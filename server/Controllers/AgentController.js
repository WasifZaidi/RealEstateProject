const bcrypt = require("bcryptjs");
const Agent = require("../Model/Agent");
const cloudinary = require("../utils/cloudinary");
const User = require("../Model/User");
const { nanoid } = require("nanoid");
const { default: mongoose } = require("mongoose");

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

exports.getAgentContactInfo = async (req, res) => {
  try {
    const { agentId } = req.params;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        message: "Agent ID is required",
      });
    }

    // 🔍 Fetch agent contact info only
    const agent = await Agent.findOne({ agentId, status: "active" })
      .select(
        "agentId profile.firstName profile.lastName profile.phone profile.email profile.socialLinks"
      )
      .lean();

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    // 🧩 Format for frontend
    const contactInfo = {
      id: agent.agentId,
      name: `${agent.profile.firstName} ${agent.profile.lastName}`,
      phone: agent.profile.phone,
      email: agent.profile.email,
      socialLinks: agent.profile.socialLinks || {},
    };

    return res.status(200).json({
      success: true,
      contact: contactInfo,
    });
  } catch (error) {
    console.error("❌ Error fetching agent contact info:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
