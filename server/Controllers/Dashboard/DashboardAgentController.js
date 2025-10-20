const Agent = require("../../Model/Agent");
const cloudinary = require("../../utils/cloudinary");
const User = require("../../Model/User");
const { nanoid } = require("nanoid");
const { default: mongoose } = require("mongoose");
const FileCleanupManager = require('../../utils/fileCleanup');

const sanitizeInput = (value) =>
  typeof value === "string" ? value.trim().replace(/[<>$]/g, "") : value;

exports.createAgent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  let uploadedPublicIds = [];
  let tempFiles = [];

  try {
    // ✅ Track uploaded and temp files
    tempFiles = req.file ? [req.file] : [];

    // ✅ Extract and sanitize input
    const sanitized = {};
    for (const key in req.body) {
      sanitized[key] = sanitizeInput(req.body[key]);
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      bio,
      designation,
      licenseNumber,
      experienceYears,
      specialization,
      languages,
      facebook,
      instagram,
      linkedin,
      twitter,
      website,
    } = sanitized;

    // ✅ 1. Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      throw new Error("VALIDATION_ERROR: All required fields must be provided.");
    }

    // ✅ 2. Prevent duplicate profile
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      throw new Error("VALIDATION_ERROR: Agent with this email already exists.");
    }

    // ✅ 3. Handle image upload
    let profileImage = null;
    if (req.file) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "real_estate/agents",
          public_id: `agent_${nanoid(10)}`,
          quality: "auto",
          fetch_format: "auto",
        });
        uploadedPublicIds.push(uploadResult.public_id);
        profileImage = {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        };
      } catch (uploadError) {
        throw new Error("MEDIA_UPLOAD_ERROR: Failed to upload profile image");
      }
    }

    // ✅ 4. Generate unique agent ID
    const agentId = `Agt-${nanoid(10)}`;

    // ✅ 5. Create new agent
    const [agent] = await Agent.create(
      [
        {
          agentId,
          user: req.user.id,
          profile: {
            firstName,
            lastName,
            phone,
            email,
            bio,
            designation,
            licenseNumber,
            experienceYears,
            specialization: Array.isArray(specialization)
              ? specialization
              : specialization
              ? specialization.split(",").map((s) => s.trim())
              : [],
            languages: Array.isArray(languages)
              ? languages
              : languages
              ? languages.split(",").map((s) => s.trim())
              : [],
            profileImage,
            socialLinks: {
              facebook: facebook || "",
              instagram: instagram || "",
              linkedin: linkedin || "",
              twitter: twitter || "",
              website: website || "",
            },
          },
          role: "agent",
          status: "active",
        },
      ],
      { session }
    );

    // ✅ 6. Mark user as verified agent
    await User.findByIdAndUpdate(
      req.user.id,
      { isVerifiedAgent: true },
      { session, new: true }
    );

    // ✅ 7. Commit the transaction
    await session.commitTransaction();

    // ✅ 8. Clean up temp files
    await FileCleanupManager.cleanupFiles(tempFiles);

    // ✅ 9. Success response
    return res.status(201).json({
      success: true,
      message: "Agent profile created successfully.",
      agent: {
        _id: agent._id,
        agentId: agent.agentId,
        name: `${firstName} ${lastName}`,
        email,
        phone,
        profileImage,
        status: "active",
      },
    });
  } catch (error) {
    await session.abortTransaction();

    // 🗑️ Rollback uploaded files if transaction fails
    if (uploadedPublicIds.length > 0) {
      try {
        await Promise.all(
          uploadedPublicIds.map((publicId) =>
            cloudinary.uploader.destroy(publicId)
          )
        );
        console.log("Rolled back Cloudinary uploads:", uploadedPublicIds);
      } catch (rollbackError) {
        console.error("Failed to rollback Cloudinary uploads:", rollbackError);
      }
    }

    // 🧹 Always clean temp files
    await FileCleanupManager.cleanupFiles(tempFiles);

    console.error("❌ Error creating agent:", error);

    // 🎯 Error categorization
    let statusCode = 500;
    let message = "Server error while creating agent";

    if (error.message.includes("VALIDATION_ERROR")) {
      statusCode = 400;
      message = error.message.replace("VALIDATION_ERROR: ", "");
    } else if (error.message.includes("MEDIA_UPLOAD_ERROR")) {
      statusCode = 400;
      message = error.message.replace("MEDIA_UPLOAD_ERROR: ", "");
    }

    return res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
      type: error.message.split(":")[0] || "UNKNOWN_ERROR",
    });
  } finally {
    session.endSession();
  }
};

exports.updateAgent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  let tempFiles = [];           // Track local uploaded files for cleanup
  let cloudinaryPublicIds = []; // Track new Cloudinary uploads for rollback

  try {
    const userId = req.user.id;

    // ✅ 1. Find the agent linked to this user
    const agent = await Agent.findOne({ user: userId }).session(session);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent profile not found for this user.",
      });
    }

    tempFiles = req.file ? [req.file] : [];

    // ✅ 2. Extract updatable fields
    const {
      firstName,
      lastName,
      email,
      phone,
      bio,
      designation,
      licenseNumber,
      experienceYears,
      specialization,
      languages,
      facebook,
      instagram,
      linkedin,
      twitter,
      website,
    } = req.body;

    // ✅ 3. Handle profile image replacement
    let profileImage = agent.profile.profileImage;

    if (req.file) {
      // Delete old image if it exists
      if (profileImage?.public_id) {
        try {
          await cloudinary.uploader.destroy(profileImage.public_id);
        } catch (err) {
          console.warn("⚠️ Failed to delete old profile image:", err.message);
        }
      }

      // Upload new image
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "real_estate/agents",
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      });

      cloudinaryPublicIds.push(uploadResult.public_id);

      profileImage = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    // ✅ 4. Update only provided fields
    const p = agent.profile;

    p.firstName = firstName ?? p.firstName;
    p.lastName = lastName ?? p.lastName;
    p.email = email ?? p.email;
    p.phone = phone ?? p.phone;
    p.bio = bio ?? p.bio;
    p.designation = designation ?? p.designation;
    p.licenseNumber = licenseNumber ?? p.licenseNumber;
    p.experienceYears = experienceYears ?? p.experienceYears;
    p.specialization = specialization ?? p.specialization;
    p.languages = languages ?? p.languages;
    p.profileImage = profileImage;

    p.socialLinks = {
      facebook: facebook ?? p.socialLinks?.facebook,
      instagram: instagram ?? p.socialLinks?.instagram,
      linkedin: linkedin ?? p.socialLinks?.linkedin,
      twitter: twitter ?? p.socialLinks?.twitter,
      website: website ?? p.socialLinks?.website,
    };

    // ✅ 5. Save updated agent
    await agent.save({ session });

    // ✅ 6. Commit transaction
    await session.commitTransaction();

    // ✅ 7. Cleanup local temp file (after successful upload)
    await FileCleanupManager.cleanupFiles(tempFiles);

    session.endSession();

    // ✅ 8. Send response
    return res.status(200).json({
      success: true,
      message: "Your agent profile has been updated successfully.",
      agent: {
        _id: agent._id,
        agentId: agent.agentId,
        name: `${agent.profile.firstName} ${agent.profile.lastName}`,
        email: agent.profile.email,
        phone: agent.profile.phone,
        profileImage: agent.profile.profileImage,
        status: agent.status,
      },
    });

  } catch (error) {
    // ❌ Rollback transaction
    await session.abortTransaction();

    // ❌ Rollback uploaded Cloudinary image if error occurs
    if (cloudinaryPublicIds.length > 0) {
      try {
        await Promise.all(
          cloudinaryPublicIds.map(id => cloudinary.uploader.destroy(id))
        );
        console.log("Rolled back Cloudinary upload:", cloudinaryPublicIds);
      } catch (rollbackErr) {
        console.error("Failed Cloudinary rollback:", rollbackErr);
      }
    }

    // ❌ Cleanup local temp files
    await FileCleanupManager.cleanupFiles(tempFiles);

    session.endSession();

    console.error("❌ Error updating agent:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating agent.",
      error: error.message,
    });
  }
};

exports.getAgentByUser = async (req, res) => {
  try {
    const userId = req.user.id; // Logged-in user's ID

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // ✅ Fetch the agent by the user reference
    const agent = await Agent.findOne({ user: userId, status: "active" })
      .select(
        "agentId profile.firstName profile.lastName profile.email profile.phone profile.profileImage.url profile.bio profile.designation profile.licenseNumber profile.experienceYears profile.specialization profile.languages profile.socialLinks performance"
      )
      .lean();

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent profile not found for this user.",
      });
    }

    // ✅ Format for frontend
    const formattedAgent = {
      id: agent.agentId,
      firstName: agent.profile.firstName,
      lastName: agent.profile.lastName,
      email: agent.profile.email,
      phone: agent.profile.phone,
      image: agent.profile.profileImage?.url || null,
      bio: agent.profile.bio || "",
      designation: agent.profile.designation,
      licenseNumber: agent.profile.licenseNumber,
      experienceYears: agent.profile.experienceYears,
      specialization: agent.profile.specialization || [],
      languages: agent.profile.languages || [],
      socialLinks: agent.profile.socialLinks || {},
      performance: {
        totalListings: agent.performance?.totalListings || 0,
        soldProperties: agent.performance?.soldProperties || 0,
        totalClients: agent.performance?.totalClients || 0,
        rating: agent.performance?.rating?.average || 0,
      },
    };

    console.log("for", formattedAgent)

    return res.status(200).json({
      success: true,
      agent: formattedAgent,
    });
  } catch (error) {
    console.error("❌ Error fetching agent by user ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};