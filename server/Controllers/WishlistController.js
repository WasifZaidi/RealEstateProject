const mongoose = require("mongoose");
const Listing = require("../Model/Listing");
const Wishlist = require("../Model/Wishlists");

exports.saveListing = async (req, res) => {
  try {
    const userId = req.user?.id
    const { listingId } = req.body;

    if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ success: false, message: "Invalid listing ID." });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found." });
    }

    // Find wishlist or create one if doesn't exist
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, listings: [] });
    }

    // Check if listing is already in wishlist
    const existingIndex = wishlist.listings.findIndex(
      (item) => item.listing.toString() === listingId
    );

    let action = "";

    if (existingIndex > -1) {
      // Remove listing if already saved (toggle off)
      wishlist.listings.splice(existingIndex, 1);
      action = "removed";
    } else {
      // Add new listing
      wishlist.listings.push({ listing: listingId });
      action = "added";
    }

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: `Listing successfully ${action} to wishlist.`,
      wishlistCount: wishlist.listings.length,
    });
  } catch (error) {
    console.error("Wishlist Save Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while saving listing.",
      error: error.message,
    });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found.",
      });
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const wishlistData = await Wishlist.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$listings" },
      {
        $lookup: {
          from: "listings",
          localField: "listings.listing",
          foreignField: "_id",
          as: "listingData",
        },
      },
      { $unwind: "$listingData" },
      {
        $project: {
          _id: 0,
          addedAt: "$listings.addedAt",
          note: "$listings.note",

          "listingData._id": 1,
          "listingData.title": 1,
          "listingData.price": 1,
          "listingData.details": 1,
          "listingData.location": 1,
          "listingData.propertyType": 1,
          "listingData.propertyFor": 1,
          "listingData.amenities": 1,
          "listingData.status": 1,
          "listingData.isFeatured": 1,
          "listingData.isPremium": 1,
          "listingData.media": { $slice: ["$listingData.media", 3] }, // limit to 3 images
          "listingData.views": 1,
          "listingData.favoritesCount": 1,
        },
      },
      { $sort: { addedAt: -1 } },
      {
        $facet: {
          listings: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const listings = wishlistData[0]?.listings || [];
    const totalCount = wishlistData[0]?.totalCount?.[0]?.count || 0;
    console.log(wishlistData)
    console.log(listings) 

    // ============================
    // ✅ Response
    // ============================
    return res.status(200).json({
      success: true,
      totalListings: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      listings: listings.map((item) => ({
        ...item.listingData,
        addedAt: item.addedAt,
        note: item.note,
      })),
    });
  } catch (error) {
    console.error("❌ Wishlist Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching wishlist.",
      error: error.message,
    });
  }
};


exports.getListingsForCompare = async (req, res) => {
  try {
    const { listingIds } = req.body;
    if (!Array.isArray(listingIds) || listingIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a non-empty array of listing IDs.",
      });
    }
    const uniqueIds = [...new Set(listingIds)];
    const listings = await Listing.find({ _id: { $in: uniqueIds } })
      .select(
        "title price location details area bedrooms bathrooms media propertyType features builtYear createdAt updatedAt"
      )
      .populate({
        path: "agent",
        select: "name phone email agency",
      })
      .lean();

    // 4️⃣ Handle not found
    if (!listings.length) {
      return res.status(404).json({
        success: false,
        message: "No listings found for the provided IDs.",
      });
    }

    

    // 5️⃣ Return success response
    return res.status(200).json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("❌ Error fetching listings for compare:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.getWishlistMinimal = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const wishlist = await Wishlist.findOne(
      { user: userId },
      { "listings.listing": 1, _id: 0 }
    );

    return res.status(200).json({
      success: true,
      savedListingIds: wishlist
        ? wishlist.listings.map(item => item.listing.toString())
        : [],
    });

  } catch (error) {
    console.error("❌ Wishlist Minimal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching wishlist status.",
    });
  }
};