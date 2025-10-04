
// controllers/listingController.js

const Listing = require("../Model/Listing");
const cloudinary = require("../utils/cloudinary");

// Create a new Listing
exports.createListing = async (req, res) => {
  try {
    const { title, description, owner, agent, contactInfo } = req.body;

    // Parse JSON fields safely
    const safeParse = (val, fallback) => {
      try {
        return val ? JSON.parse(val) : fallback;
      } catch {
        return fallback;
      }
    };

    const propertyType = safeParse(req.body.propertyType, {});
    let location = safeParse(req.body.location, {});
    const price = safeParse(req.body.price, {});
    const details = safeParse(req.body.details, {});
    const amenities = safeParse(req.body.amenities, []);

    // 🔥 Sanitize numeric fields
    const cleanNumber = (val) => {
      if (val == null) return undefined;
      return Number(String(val).replace(/,/g, ""));
    };

    price.amount = cleanNumber(price.amount);
    details.size = cleanNumber(details.size);
    if (details.bedrooms) details.bedrooms = cleanNumber(details.bedrooms);
    if (details.bathrooms) details.bathrooms = cleanNumber(details.bathrooms);

    // ✅ Ensure valid GeoJSON coordinates
    if (location) {
      if (location.lat != null && location.lng != null) {
        location.coordinates = {
          type: "Point",
          coordinates: [Number(location.lng), Number(location.lat)],
        };
      } else if (
        location.coordinates &&
        Array.isArray(location.coordinates.coordinates)
      ) {
        // Already valid GeoJSON, just enforce type
        location.coordinates.type = "Point";
      } else {
        // Fallback to dummy Point (so MongoDB won't break)
        location.coordinates = {
          type: "Point",
          coordinates: [0, 0],
        };
      }
    }

    console.log("Parsed:", {
      title,
      propertyType,
      location,
      price,
      details,
      owner,
    });

    // Validate required fields
    if (
      !title ||
      !propertyType.category ||
      !propertyType.subType ||
      !location.state ||
      !location.city ||
      !price.amount ||
      !details.size ||
      !owner
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Handle media uploads
    let media = [];
    if (req.files && req.files.length > 0) {
      for (const [index, file] of req.files.entries()) {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto",
          folder: "listings",
        });

        media.push({
          public_id: uploadResult.public_id,
          url: uploadResult.secure_url,
          resource_type: uploadResult.resource_type,
          format: uploadResult.format,
          width: uploadResult.width,
          height: uploadResult.height,
          duration: uploadResult.duration || null,
          bytes: uploadResult.bytes,
          isCover: index === parseInt(req.body.coverPhotoIndex, 10),
          uploadOrder: index + 1,
        });
      }
    }

    // Save listing
    const listing = new Listing({
      title,
      description,
      propertyType,
      location,
      price,
      details,
      amenities,
      media,
      owner,
      agent,
      contactInfo,
    });

    await listing.save();

    return res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    console.error("Error creating listing:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating listing",
      error: error.message,
    });
  }
};
exports.getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("hello it calls")
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing listing ID",
      });
    }
    const listing = await Listing.findById(id)
      .lean();
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Listing fetched successfully",
      listing,
    });
  } catch (error) {
    console.error("Error fetching listing by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching listing",
      error: error.message,
    });
  }
};