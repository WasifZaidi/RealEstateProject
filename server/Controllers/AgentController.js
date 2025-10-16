const bcrypt = require("bcryptjs");
const Agent = require("../Model/Agent");
const cloudinary = require("../utils/cloudinary");
const User = require("../Model/User");
const { nanoid } = require("nanoid");
const { default: mongoose } = require("mongoose");
exports.createAgent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
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

    // ✅ 1. Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    // ✅ 2. Prevent duplicate agent profile
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({
        success: false,
        message: "Agent with this email already exists.",
      });
    }

    // ✅ 3. Upload profile image (if provided)
    let profileImage = null;
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "real_estate/agents",
      });

      profileImage = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    // ✅ 4. Generate a clean & unique agentId
    const agentId = `Agt-${nanoid(10)}`; // Example: Agt-BzK8P9yLqT

    // ✅ 5. Create the Agent document
    const agent = await Agent.create(
      [
        {
          agentId,
          user: req.user.id,
          profile: {
            firstName,
            lastName,
            phone,
            email,
            profileImage,
            bio,
            designation,
            licenseNumber,
            experienceYears,
            specialization,
            languages,
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
      { new: true, session }
    );

    // ✅ 7. Commit transaction
    await session.commitTransaction();
    session.endSession();

    // ✅ 8. Respond with success
    res.status(201).json({
      success: true,
      message: "Agent profile created successfully.",
      agent: {
        _id: agent[0]._id,
        agentId: agent[0].agentId,
        name: `${firstName} ${lastName}`,
        email,
        phone,
        profileImage,
        status: "active",
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Error creating agent:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating agent.",
      error: error.message,
    });
  }
};

exports.getAgents = async (req, res) => {
  try {
    // ✅ Extract page number from query (default: 1)
    let { page = 1 } = req.query;
    page = parseInt(page) < 1 ? 1 : parseInt(page);

    const limit = 20;
    const skip = (page - 1) * limit;

    // ✅ Count total agents
    const totalAgents = await Agent.countDocuments();

    // ✅ Fetch agents with pagination, and sort by creation date
    const agents = await Agent.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // use lean() for performance

    // ✅ Calculate total pages
    const totalPages = Math.ceil(totalAgents / limit);

    // ✅ Send response
    return res.status(200).json({
      success: true,
      count: agents.length,
      totalAgents,
      totalPages,
      currentPage: page,
      agents,
    });

  } catch (error) {
    console.error("Error fetching agents:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching agents",
      error: error.message,
    });
  }
};

exports.getAgentByAgentId = async (req, res) => {
  try {
    const { agentId } = req.params;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        message: "Agent ID is required",
      });
    }

    // ✅ Fetch the agent and select only public-safe fields
    const agent = await Agent.findOne({ agentId, status: "active" })
      .select(
        "agentId profile.firstName profile.lastName profile.profileImage.url profile.bio profile.designation profile.experienceYears profile.specialization profile.languages profile.socialLinks performance"
      )
      .lean();

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    // ✅ Format data to make it frontend-friendly
    const formattedAgent = {
      id: agent.agentId,
      name: `${agent.profile.firstName} ${agent.profile.lastName}`,
      image: agent.profile.profileImage?.url || null,
      bio: agent.profile.bio || "",
      designation: agent.profile.designation,
      experienceYears: agent.profile.experienceYears,
      specialization: agent.profile.specialization || [],
      languages: agent.profile.languages || [],
      socialLinks: agent.profile.socialLinks || {},
      performance: {
        totalListings: agent.performance.totalListings,
        soldProperties: agent.performance.soldProperties,
        totalClients: agent.performance.totalClients,
        rating: agent.performance.rating.average,
      },
    };

    return res.status(200).json({
      success: true,
      agent: formattedAgent,
    });
  } catch (error) {
    console.error("❌ Error fetching agent by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};