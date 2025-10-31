
// controllers/listingController.js

const Listing = require("../Model/Listing");
const Meeting = require("../Model/Meeting")
const cloudinary = require("../utils/cloudinary");
const { v4: uuidv4 } = require("uuid")
const FileCleanupManager = require("../utils/fileCleanup");
const safeParse = (val, fallback = null) => {
  if (typeof val === 'object') return val;
  try {
    return val ? JSON.parse(val) : fallback;
  } catch (error) {
    console.warn('Safe parse failed:', error.message);
    return fallback;
  }
};

const cleanNumber = (val) => {
  if (val == null || val === '') return undefined;
  const num = Number(String(val).replace(/[^\d.-]/g, ''));
  return isNaN(num) ? undefined : num;
};

const validateCoordinates = (lat, lng) => {
  const numLat = Number(lat);
  const numLng = Number(lng);
  return (
    !isNaN(numLat) &&
    !isNaN(numLng) &&
    numLat >= -90 &&
    numLat <= 90 &&
    numLng >= -180 &&
    numLng <= 180
  );
};

const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  return input;
};

// Create a new Listing
exports.createListing = async (req, res) => {
  const session = await Listing.startSession();
  session.startTransaction();

  let cloudinaryPublicIds = []; // Track uploaded files for rollback
  let tempFiles = []; // Track temp files for cleanup

  try {
    // Store reference to temp files for cleanup
    tempFiles = req.files ? [...req.files] : [];

    // 🔒 Sanitize all string inputs
    const sanitizedBody = {};
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        sanitizedBody[key] = sanitizeInput(req.body[key]);
      } else {
        sanitizedBody[key] = req.body[key];
      }
    });

    const {
      title,
      description,
      owner,
      agent,
      contactInfo,
      propertyFor = 'Sell'
    } = sanitizedBody;

    // 🎯 Parse and validate JSON fields
    const propertyType = safeParse(sanitizedBody.propertyType, {});
    let location = safeParse(sanitizedBody.location, {});
    const price = safeParse(sanitizedBody.price, {});
    const details = safeParse(sanitizedBody.details, {});
    const amenities = safeParse(sanitizedBody.amenities, []);

    // 🔥 Enhanced numeric field cleaning with validation
    const numericFields = {
      priceAmount: cleanNumber(price.amount),
      detailsSize: cleanNumber(details.size),
      detailsBedrooms: cleanNumber(details.bedrooms),
      detailsBathrooms: cleanNumber(details.bathrooms),
      detailsYearBuilt: cleanNumber(details.yearBuilt),
      detailsFloors: cleanNumber(details.floors) || 1,
      detailsLotSize: cleanNumber(details.lotSize),
      detailsParkingSpaces: cleanNumber(details.parkingSpaces) || 0
    };

    // Validate critical numeric fields
    if (!numericFields.priceAmount || numericFields.priceAmount < 0) {
      throw new Error('VALIDATION_ERROR: Valid price amount is required');
    }

    if (!numericFields.detailsSize || numericFields.detailsSize < 0) {
      throw new Error('VALIDATION_ERROR: Valid property size is required');
    }

    // Apply cleaned numeric values
    price.amount = numericFields.priceAmount;
    details.size = numericFields.detailsSize;
    details.bedrooms = numericFields.detailsBedrooms;
    details.bathrooms = numericFields.detailsBathrooms;
    details.yearBuilt = numericFields.detailsYearBuilt;
    details.floors = numericFields.detailsFloors;
    details.lotSize = numericFields.detailsLotSize;
    details.parkingSpaces = numericFields.detailsParkingSpaces;

    // 🗺️ Enhanced GeoJSON validation
    if (location) {
      if (location.lat != null && location.lng != null) {
        if (!validateCoordinates(location.lat, location.lng)) {
          throw new Error('VALIDATION_ERROR: Invalid coordinates provided');
        }
        location.coordinates = {
          type: "Point",
          coordinates: [Number(location.lng), Number(location.lat)],
        };
      } else if (location.coordinates && Array.isArray(location.coordinates.coordinates)) {
        const [lng, lat] = location.coordinates.coordinates;
        if (!validateCoordinates(lat, lng)) {
          throw new Error('VALIDATION_ERROR: Invalid coordinates format');
        }
        location.coordinates.type = "Point";
      } else {
        location.coordinates = {
          type: "Point",
          coordinates: [0, 0],
        };
      }
    }

    // ✅ Enhanced required field validation
    const missingFields = [];
    if (!title?.trim()) missingFields.push('title');
    if (!propertyType.category) missingFields.push('propertyType.category');
    if (!propertyType.subType) missingFields.push('propertyType.subType');
    if (!location?.state?.trim()) missingFields.push('location.state');
    if (!location?.city?.trim()) missingFields.push('location.city');
    if (!owner?.trim()) missingFields.push('owner');
    if (!propertyFor?.trim()) missingFields.push('propertyFor');

    if (missingFields.length > 0) {
      throw new Error(`VALIDATION_ERROR: Missing required fields: ${missingFields.join(', ')}`);
    }

    // 🏢 Business logic validation
    if (propertyFor === 'Rent' && price.priceType === 'auction') {
      throw new Error('BUSINESS_ERROR: Auction price type is not allowed for rental properties');
    }

    // Validate property type consistency
    const validSubtypes = {
      Residential: ['apartment', 'house', 'villa', 'condo', 'townhouse'],
      Plot: ['commercial-plot', 'residential-plot', 'agricultural-plot', 'industrial-plot'],
      Commercial: ['office', 'retail', 'warehouse', 'restaurant'],
      Industrial: ['factory', 'storage', 'manufacturing']
    };

    if (!validSubtypes[propertyType.category]?.includes(propertyType.subType)) {
      throw new Error('BUSINESS_ERROR: Invalid property subtype for category');
    }

    // 📁 Handle media uploads with enhanced error handling
    let media = [];
    if (req.files && req.files.length > 0) {
      // Validate file count
      if (req.files.length > 10) {
        throw new Error('VALIDATION_ERROR: Maximum 10 files allowed');
      }

      for (const [index, file] of req.files.entries()) {
        try {
          // Validate file size
          if (file.size > 10 * 1024 * 1024) {
            throw new Error(`File ${file.originalname} exceeds 10MB limit`);
          }

          const uploadResult = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto",
            folder: `listings/${owner}`,
            public_id: `${uuidv4()}_${Date.now()}`,
            quality: 'auto',
            fetch_format: 'auto',
            timeout: 30000
          });

          cloudinaryPublicIds.push(uploadResult.public_id);

          media.push({
            public_id: uploadResult.public_id,
            url: uploadResult.secure_url,
            resource_type: uploadResult.resource_type,
            format: uploadResult.format,
            width: uploadResult.width,
            height: uploadResult.height,
            duration: uploadResult.duration || null,
            bytes: uploadResult.bytes,
            isCover: index === parseInt(sanitizedBody.coverPhotoIndex, 10) || index === 0,
            uploadOrder: index + 1,
            altText: `Property image ${index + 1} for ${title}`,
            uploadedAt: new Date()
          });

        } catch (uploadError) {
          console.error(`Failed to upload file ${file.originalname}:`, uploadError);
          throw new Error(`MEDIA_UPLOAD_ERROR: Failed to upload ${file.originalname}`);
        }
      }
    }

    // 💾 Create and save listing with transaction
    const listingData = {
      title: title.trim(),
      description: description?.trim(),
      propertyType,
      location,
      price,
      details,
      amenities: Array.isArray(amenities) ? amenities : [],
      media,
      owner: owner.trim(),
      agent: agent?.trim(),
      contactInfo: safeParse(contactInfo, {}),
      propertyFor: propertyFor.trim(),
      listingReference: `LST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    const listing = new Listing(listingData);

    // Validate against Mongoose schema before saving
    const validationError = listing.validateSync();
    if (validationError) {
      const errors = Object.values(validationError.errors).map(err => err.message);
      throw new Error(`SCHEMA_VALIDATION_ERROR: ${errors.join(', ')}`);
    }

    await listing.save({ session });

    // ✅ Commit transaction
    await session.commitTransaction();

    // 🧹 Cleanup temp files after successful upload
    await FileCleanupManager.cleanupFiles(tempFiles);

    // 🎉 Success response
    return res.status(201).json({
      success: true,
      message: "Listing created successfully",
      data: {
        id: listing._id,
        reference: listing.listingReference,
        title: listing.title,
        price: listing.price,
        location: listing.location,
        mediaCount: listing.media.length,
        createdAt: listing.createdAt
      },
      metadata: {
        filesUploaded: media.length,
        listingId: listing._id
      }
    });

  } catch (error) {
    // 🔄 Rollback transaction
    await session.abortTransaction();

    // 🗑️ Clean up uploaded Cloudinary files on error
    if (cloudinaryPublicIds.length > 0) {
      try {
        await Promise.all(
          cloudinaryPublicIds.map(publicId =>
            cloudinary.uploader.destroy(publicId)
          )
        );
        console.log('Rolled back Cloudinary uploads:', cloudinaryPublicIds);
      } catch (rollbackError) {
        console.error('Failed to rollback Cloudinary uploads:', rollbackError);
      }
    }

    await FileCleanupManager.cleanupFiles(tempFiles);

    // 🚨 Enhanced error handling
    console.error('Create listing error:', {
      error: error.message,
      stack: error.stack,
      body: req.body,
      files: req.files?.map(f => f.originalname),
      timestamp: new Date().toISOString()
    });

    // 📊 Categorized error responses
    let statusCode = 500;
    let userMessage = 'Server error while creating listing';
    if (error.message.includes('VALIDATION_ERROR')) {
      statusCode = 400;
      userMessage = error.message.replace('VALIDATION_ERROR: ', '');
    } else if (error.message.includes('BUSINESS_ERROR')) {
      statusCode = 400;
      userMessage = error.message.replace('BUSINESS_ERROR: ', '');
    } else if (error.message.includes('MEDIA_UPLOAD_ERROR')) {
      statusCode = 400;
      userMessage = error.message.replace('MEDIA_UPLOAD_ERROR: ', '');
    } else if (error.message.includes('SCHEMA_VALIDATION_ERROR')) {
      statusCode = 400;
      userMessage = error.message.replace('SCHEMA_VALIDATION_ERROR: ', '');
    } else if (error.code === 11000) {
      statusCode = 409;
      userMessage = 'Listing with similar properties already exists';
    }

    return res.status(statusCode).json({
      success: false,
      message: userMessage,
      error: process.env.NODE_ENV === 'production' ? undefined : error.message,
      type: error.message.split(':')[0] || 'UNKNOWN_ERROR'
    });

  } finally {
    // 🧹 Cleanup session
    session.endSession();
  }
};
exports.getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing listing ID.",
      });
    }

    // 2️⃣ Fetch listing
    const listing = await Listing.findById(id).lean();
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found.",
      });
    }

    // 3️⃣ Check if user has a scheduled tour for this listing
    const existingTour = await Meeting.exists({
      client: userId,
      listing: id,
      status: "Scheduled",
    });
    

    // 4️⃣ Add flag to response
    const listingWithStatus = {
      ...listing,
      isScheduledTour: !!existingTour,
    };
    

    // 5️⃣ Success response
    return res.status(200).json({
      success: true,
      message: "Listing fetched successfully.",
      listing: listingWithStatus,
    });

  } catch (error) {
    console.error("❌ Error fetching listing by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching listing.",
      error: error.message,
    });
  }
};


// Get listing by filters
exports.getListingByFilter = async (req, res) => {
  try {
    const {
      // Pagination
      page = 1,
      limit = 20,
      propertyType,
      propertyFor,
      minPrice,
      maxPrice,
      minBedrooms,
      maxBedrooms,
      minBathrooms,
      maxBathrooms,
      minSize,
      maxSize,

      // Location filters
      state,
      city,
      zipCode,
      neighborhood,
      latitude,
      longitude,
      radius = 10, // in kilometers

      // Advanced filters
      amenities,
      priceType,
      includesUtilities,
      yearBuiltFrom,
      yearBuiltTo,
      minFloors,
      maxFloors,
      minParking,
      maxParking,

      // Status and visibility
      status = 'pending',
      isFeatured,
      isPremium,
      visibility = 'public',

      // Search
      search,

      // Sorting
      sortBy = 'listedAt',
      sortOrder = 'desc',

      // Agent/Owner filters
      owner,
      agent
    } = req.query;

    // Build filter object
    const filter = {};
    const userId = req.user?.id;
    let savedListingIds = [];

    if (userId) {
      const userWishlist = await Wishlist.find({ user: userId })
        .select("listing -_id")
        .lean();
      savedListingIds = userWishlist.map(w => w.listing.toString());
    }


    // Status and visibility filters
    // filter.status = status;
    filter.visibility = visibility;

    // Property type filters
    if (propertyType) {
      filter['propertyType.subType'] = propertyType;
    }

    if (propertyFor) {
      filter.propertyFor = propertyFor;
    }


    // Price range filter
    if (minPrice || maxPrice) {
      filter['price.amount'] = {};
      if (minPrice) filter['price.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) filter['price.amount'].$lte = parseFloat(maxPrice);
    }



    // Bedrooms filter
    if (minBedrooms || maxBedrooms) {
      filter['details.bedrooms'] = {};
      if (minBedrooms) filter['details.bedrooms'].$gte = parseInt(minBedrooms);
      if (maxBedrooms) filter['details.bedrooms'].$lte = parseInt(maxBedrooms);
    }

    // Bathrooms filter
    if (minBathrooms || maxBathrooms) {
      filter['details.bathrooms'] = {};
      if (minBathrooms) filter['details.bathrooms'].$gte = parseInt(minBathrooms);
      if (maxBathrooms) filter['details.bathrooms'].$lte = parseInt(maxBathrooms);
    }

    // Size filter
    if (minSize || maxSize) {
      filter['details.size'] = {};
      if (minSize) filter['details.size'].$gte = parseFloat(minSize);
      if (maxSize) filter['details.size'].$lte = parseFloat(maxSize);
    }

    // Location filters
    if (state) filter['location.state'] = new RegExp(state, 'i');
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (zipCode) filter['location.zipCode'] = zipCode;
    if (neighborhood) filter['location.neighborhood'] = new RegExp(neighborhood, 'i');

    // Geo-spatial filter
    if (latitude && longitude) {
      filter['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
        }
      };
    }

    // Advanced filters
    if (amenities) {
      const amenitiesArray = Array.isArray(amenities) ? amenities : amenities.split(',');
      filter.amenities = { $all: amenitiesArray };
    }

    if (priceType) filter['price.priceType'] = priceType;
    if (includesUtilities !== undefined) filter['price.includesUtilities'] = includesUtilities === 'true';

    // Year built filter
    if (yearBuiltFrom || yearBuiltTo) {
      filter['details.yearBuilt'] = {};
      if (yearBuiltFrom) filter['details.yearBuilt'].$gte = parseInt(yearBuiltFrom);
      if (yearBuiltTo) filter['details.yearBuilt'].$lte = parseInt(yearBuiltTo);
    }

    // Floors filter
    if (minFloors || maxFloors) {
      filter['details.floors'] = {};
      if (minFloors) filter['details.floors'].$gte = parseInt(minFloors);
      if (maxFloors) filter['details.floors'].$lte = parseInt(maxFloors);
    }

    // Parking filter
    if (minParking || maxParking) {
      filter['details.parkingSpaces'] = {};
      if (minParking) filter['details.parkingSpaces'].$gte = parseInt(minParking);
      if (maxParking) filter['details.parkingSpaces'].$lte = parseInt(maxParking);
    }

    // Boolean filters
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    if (isPremium !== undefined) filter.isPremium = isPremium === 'true';

    // Owner/Agent filters
    if (owner) filter.owner = owner;
    if (agent) filter.agent = agent;

    // Text search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.neighborhood': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortOptions = {};
    const allowedSortFields = [
      'price.amount', 'listedAt', 'views', 'favoritesCount',
      'details.size', 'details.bedrooms', 'details.bathrooms'
    ];

    if (allowedSortFields.includes(sortBy)) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOptions.listedAt = -1; // Default sort
    }

    // Pagination options
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100); // Max 100 per page
    const skip = (pageNum - 1) * limitNum;

    // Execute query with performance optimization
    const [listings, totalCount, featuredCount] = await Promise.all([
      // Get paginated listings
      Listing.find(filter)
        .select('-__v -updatedAt') // Exclude unnecessary fields
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(), // For better performance

      // Get total count for pagination
      Listing.countDocuments(filter),

      // Get featured count for UI purposes
      Listing.countDocuments({ ...filter, isFeatured: true })
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;


    const listingsDataComplete = listings.map(listing => ({
      ...listing,
      isSaved: savedListingIds.includes(listing._id.toString())
    }));

    // Response structure
    const response = {
      success: true,
      data: {
        listings: listingsDataComplete,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        },
        metadata: {
          featuredCount,
          returnedCount: listings.length
        }
      },
      message: listings.length > 0 ? 'Listings retrieved successfully' : 'No listings found'
    };

    // Cache control headers for performance
    res.set({
      'Cache-Control': 'public, max-age=300', // 5 minutes cache
      'X-Total-Count': totalCount,
      'X-Page-Count': totalPages
    });

    return res.status(200).json(response);

  } catch (error) {
    // Log error for monitoring
    console.error('GetListingByFilter Error:', {
      error: error.message,
      stack: error.stack,
      query: req.query,
      timestamp: new Date().toISOString()
    });

    // Different error responses based on error type
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid filter parameters',
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching listings',
      error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message
    });
  }
};


exports.getAgentListings = async (req, res) => {
  try {
    const agentRef = req.user?.id; 
    if (!agentRef) {
      return res.status(401).json({ success: false, message: 'Unauthorized - Agent ID missing' });
    }

    let { page = 1, limit = 10, sort = '-createdAt', status, search } = req.query;
    page = Math.max(1, parseInt(page));
    limit = Math.min(parseInt(limit), 100); // Hard cap to prevent overloading DB

    const query = { agentRef };

    if (status) query.status = status;
    if (search) {
      // Full-text search optimization
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    


    const listings = await Listing.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('title price.amount price.currency status propertyType listedAt views isFeatured') // Select only needed fields
      .lean(); // Returns plain JS objects for better performance

    const totalListings = await Listing.countDocuments(query);
    const totalPages = Math.ceil(totalListings / limit);


    // -------------------------------
    // ✅ Response
    // -------------------------------
    res.status(200).json({
      success: true,
      page,
      limit,
      totalListings,
      totalPages,
      listings,
    });

  } catch (error) {
    console.error('Error fetching agent listings:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deleteAllListings = async (req, res) => {
  try {
    const result = await Listing.deleteMany({}); // deletes all documents

    res.status(200).json({
      success: true,
      message: 'All listings have been deleted successfully.',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting listings:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting listings.',
      error: error.message
    });
  }
};