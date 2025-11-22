const Listing = require("../../Model/Listing");
const Meeting = require("../../Model/Meeting");
const cloudinary = require('../../utils/cloudinary'); // Assuming Cloudinary utility
const FileCleanupManager = require('../../utils/fileCleanup'); // Assuming local file cleanup utility
const { v4: uuidv4 } = require("uuid")

exports.getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing listing ID.",
      });
    }
    const listing = await Listing.findById(id).lean();
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Listing fetched successfully.",
      listing
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

// listingController.js

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

exports.updateListing = async (req, res) => {
  const session = await Listing.startSession();
  session.startTransaction();

  let cloudinaryPublicIds = [];
  let tempFiles = [];
  const listingId = req.params.id;

  try {
    // 1. Initial Validation and Authorization
    if (!listingId || !listingId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error('VALIDATION_ERROR: Invalid listing ID for update.');
    }

    const listing = await Listing.findById(listingId).session(session);
    if (!listing) {
      throw new Error('NOT_FOUND_ERROR: Listing not found.');
    }

    tempFiles = req.files ? [...req.files] : [];

    // 2. Parse and Sanitize Data
    const sanitizedBody = {};
    Object.keys(req.body).forEach(key => {
      sanitizedBody[key] = (typeof req.body[key] === 'string') ? sanitizeInput(req.body[key]) : req.body[key];
    });

    // Parse JSON fields
    const propertyType = safeParse(sanitizedBody.propertyType, {});
    let location = safeParse(sanitizedBody.location, {});
    const price = safeParse(sanitizedBody.price, {});
    const details = safeParse(sanitizedBody.details, {});
    const amenities = safeParse(sanitizedBody.amenities, []);

    // Media-specific data - FIXED: Proper parsing
    const removedMediaIds = safeParse(sanitizedBody.removedMediaIds, []);
    const mediaOrderFromClient = safeParse(sanitizedBody.mediaOrder, []);
    const mediaTempIds = safeParse(sanitizedBody.mediaTempIds, []); // NEW: Get temp IDs from frontend
    const coverMediaPublicId = sanitizedBody.coverMediaPublicId;

    console.log('🔄 Media Update Debug:', {
      removedMediaIds,
      mediaOrderFromClient,
      mediaTempIds, // Log temp IDs
      coverMediaPublicId,
      existingMediaCount: listing.media.length,
      newFilesCount: req.files?.length || 0
    });

    // 3. Handle Media Lifecycle

    // a) Handle deletions
    if (removedMediaIds.length > 0) {
      console.log('🗑️ Removing media:', removedMediaIds);

      // Delete from Cloudinary
      const deletePromises = removedMediaIds.map(publicId =>
        cloudinary.uploader.destroy(publicId).catch(err =>
          console.warn(`Failed to delete ${publicId} from Cloudinary:`, err.message)
        )
      );
      await Promise.all(deletePromises);

      // Remove from listing document
      listing.media = listing.media.filter(m => !removedMediaIds.includes(m.public_id));
    }

    // b) Upload new files - FIXED: Use frontend temp IDs
    // b) Upload new files - MINIMAL FIX
    let newMedia = [];
    if (req.files && req.files.length > 0) {
      // Check total media limit
      const totalMediaAfterDeletion = listing.media.length + req.files.length;
      if (totalMediaAfterDeletion > 12) {
        throw new Error('VALIDATION_ERROR: Cannot have more than 12 total files.');
      }

      console.log('📤 Uploading new files with temp IDs:', mediaTempIds);

      // Get new file identifiers from mediaOrder
      const newFileIdentifiers = mediaOrderFromClient.filter(id => id.startsWith('new-'));

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        try {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image',
            folder: `listings/${listing.owner}`,
            public_id: `listing_${listingId}_${Date.now()}_${i}`,
            quality: 'auto',
            fetch_format: 'auto'
          });

          cloudinaryPublicIds.push(uploadResult.public_id);

          // Use temp ID from mediaOrder, fallback to array index
          const tempId = newFileIdentifiers[i] || mediaTempIds[i] || `new-${Date.now()}-${i}`;

          newMedia.push({
            public_id: uploadResult.public_id,
            url: uploadResult.secure_url,
            resource_type: uploadResult.resource_type,
            bytes: uploadResult.bytes,
            duration: uploadResult.duration || null,
            tempId: tempId
          });

          console.log('✅ Uploaded:', uploadResult.public_id, 'with tempId:', tempId, 'for file:', file.originalname);
        } catch (uploadError) {
          console.error('❌ Upload failed for file:', file.originalname, uploadError);
          throw new Error(`MEDIA_UPLOAD_ERROR: Failed to upload ${file.originalname}`);
        }
      }
    }

    // c) Reconstruct final media array with proper mapping
    let finalMedia = [];

    // Create maps for existing and new media
    const existingMediaMap = new Map(listing.media.map(m => [m.public_id, m]));
    const newMediaMap = new Map(newMedia.map(m => [m.tempId, m]));

    console.log('🔄 Reordering media. Order from client:', mediaOrderFromClient);
    console.log('📁 Existing media:', Array.from(existingMediaMap.keys()));
    console.log('🆕 New media map:', Array.from(newMediaMap.keys()));

    // Process the order provided by frontend
    mediaOrderFromClient.forEach((identifier, index) => {
      let mediaItem;

      // Check if it's a new file (uses temp ID)
      if (identifier.startsWith('new-')) {
        // This is a new file - find by temp ID from frontend
        mediaItem = newMediaMap.get(identifier);
        if (mediaItem) {
          console.log('🔗 Mapped new file:', identifier, '→', mediaItem.public_id);
        } else {
          console.warn('❌ Could not find new media for tempId:', identifier);
        }
      } else {
        // This is an existing file - find by public_id
        mediaItem = existingMediaMap.get(identifier);
        if (!mediaItem) {
          console.warn('❌ Could not find existing media for public_id:', identifier);
        }
      }

      if (mediaItem) {
        // Remove tempId from final object (not needed in database)
        const { tempId, ...cleanMedia } = mediaItem.toObject ? mediaItem.toObject() : mediaItem;

        finalMedia.push({
          ...cleanMedia,
          isCover: cleanMedia.public_id === coverMediaPublicId,
          uploadOrder: index + 1
        });
      }
    });

    // Fallback: If no valid media found, use existing + new
    if (finalMedia.length === 0) {
      console.log('ℹ️ Using fallback media construction');
      finalMedia = [
        ...listing.media.map(m => ({ ...m.toObject(), isCover: m.public_id === coverMediaPublicId })),
        ...newMedia.map(m => {
          const { tempId, ...cleanMedia } = m;
          return { ...cleanMedia, isCover: cleanMedia.public_id === coverMediaPublicId };
        })
      ];
    }

    // Ensure at least one cover photo
    if (finalMedia.length > 0 && !finalMedia.some(m => m.isCover)) {
      finalMedia[0].isCover = true;
      console.log('🎯 Set first media as cover photo');
    }

    console.log('✅ Final media count:', finalMedia.length);

    // 4. Update Listing Document (rest of your existing code...)
    Object.assign(listing, {
      title: sanitizedBody.title?.trim() || listing.title,
      description: sanitizedBody.description?.trim() || listing.description,
      propertyType: propertyType.category ? propertyType : listing.propertyType,
      location: {
        ...listing.location,
        ...location
      },
      propertyFor: sanitizedBody.propertyFor || listing.propertyFor,
      price: {
        ...listing.price,
        amount: cleanNumber(price?.amount) || listing.price.amount,
        priceType: price?.priceType || listing.price.priceType,
      },
      details: {
        ...listing.details,
        size: cleanNumber(details?.size) || listing.details.size,
        bedrooms: cleanNumber(details?.bedrooms) || listing.details.bedrooms,
        bathrooms: cleanNumber(details?.bathrooms) || listing.details.bathrooms,
      },
      amenities: Array.isArray(amenities) ? amenities : listing.amenities,
      media: finalMedia,
      updatedAt: new Date()
    });

    // Rest of your backend code remains the same...
    const validationError = listing.validateSync();
    if (validationError) {
      const errorMessages = Object.values(validationError.errors).map(err => err.message);
      throw new Error(`SCHEMA_VALIDATION_ERROR: ${errorMessages.join(', ')}`);
    }

    await listing.save({ session });
    await session.commitTransaction();

    // Cleanup temp files
    await FileCleanupManager.cleanupFiles(tempFiles);

    console.log('✅ Listing updated successfully:', listingId);

    return res.status(200).json({
      success: true,
      message: "Listing updated successfully.",
      data: {
        id: listing._id,
        title: listing.title,
        mediaCount: listing.media.length
      }
    });

  } catch (error) {
    // Error handling (your existing code)...
    await session.abortTransaction();

    if (cloudinaryPublicIds.length > 0) {
      console.log('🔄 Rolling back Cloudinary uploads:', cloudinaryPublicIds);
      await Promise.all(
        cloudinaryPublicIds.map(publicId =>
          cloudinary.uploader.destroy(publicId).catch(err =>
            console.warn('Rollback failed for:', publicId, err.message)
          )
        )
      );
    }

    await FileCleanupManager.cleanupFiles(tempFiles);

    console.error('❌ Update listing error:', {
      error: error.message,
      stack: error.stack,
      listingId,
      timestamp: new Date().toISOString()
    });

    let statusCode = 500;
    let userMessage = 'Server error while updating listing';

    if (error.message.includes('VALIDATION_ERROR')) {
      statusCode = 400;
      userMessage = error.message.replace('VALIDATION_ERROR: ', '');
    } else if (error.message.includes('NOT_FOUND_ERROR')) {
      statusCode = 404;
      userMessage = 'Listing not found';
    } else if (error.message.includes('MEDIA_UPLOAD_ERROR')) {
      statusCode = 400;
      userMessage = error.message.replace('MEDIA_UPLOAD_ERROR: ', '');
    } else if (error.message.includes('SCHEMA_VALIDATION_ERROR')) {
      statusCode = 400;
      userMessage = 'Invalid listing data provided';
    }

    return res.status(statusCode).json({
      success: false,
      message: userMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    if (!listingId) {
      return res.status(400).json({
        success: false,
        message: "Listing ID is required.",
      });
    }

    // 1️⃣ Verify Listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found.",
      });
    }

    // 2️⃣ Verify Ownership
    if (listing.agentRef.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized — you can only delete your own listings.",
      });
    }

    // 3️⃣ Check if any active/scheduled meetings exist
    const hasActiveMeetings = await Meeting.exists({
      listing: listing._id,
      status: { $in: ["Scheduled", "Pending"] }, // optional statuses
    });

    // 4️⃣ If meetings exist → Soft delete
    if (hasActiveMeetings) {
      listing.status = "inactive";
      listing.deletedAt = new Date();
      listing.deletedBy = userId;
      await listing.save();

      return res.status(200).json({
        success: true,
        message:
          "Listing has active scheduled meetings, so it was marked as inactive instead of being deleted.",
        listing,
      });
    }

    // 5️⃣ No active meetings → Delete permanently
    // Step A: Delete media from Cloudinary (safe & parallel)
    if (listing.media && listing.media.length > 0) {
      const deletePromises = listing.media.map((media) =>
        cloudinary.uploader.destroy(media.public_id, {
          resource_type: media.resource_type || "image",
        })
      );

      try {
        await Promise.allSettled(deletePromises);
      } catch (cloudErr) {
        console.error("Cloudinary cleanup failed:", cloudErr);
        // Don't abort listing deletion if Cloudinary fails
      }
    }

    // Step B: Delete listing itself
    await Listing.findByIdAndDelete(listingId);

    // 6️⃣ Respond success
    return res.status(200).json({
      success: true,
      message: "Listing deleted successfully (no active meetings found).",
    });
  } catch (error) {
    console.error("❌ Error deleting listing:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while deleting listing.",
      error: error.message,
    });
  }
};


