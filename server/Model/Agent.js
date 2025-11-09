// agent.model.js (Mongoose Example)
const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
       unique: true, 
    },

    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      profileImage: {
        url:  { type: String, required: true },
        public_id: { type: String, required: true}
      },
      bio: {
        type: String,
        maxlength: 2000,
      },
      designation: { type: String, default: "Real Estate Agent" },
      licenseNumber: { type: String },
      experienceYears: { type: Number, default: 0 },
      specialization: [String],
      languages: [String],
      socialLinks: {
        facebook: String,
        instagram: String,
        linkedin: String,
        twitter: String,
        website: String,
      },
    },

    // 📈 Agent Activity & Performance
    performance: {
      totalListings: { type: Number, default: 0 },
      activeListings: { type: Number, default: 0 },
      soldProperties: { type: Number, default: 0 },
      totalClients: { type: Number, default: 0 },
      rating: {
        average: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 },
      },
    },

    agentId: {type: String, required: true, unique: true},

    // 🕒 System & Access Control
    status: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "active",
    },

    role: {
      type: String,
      enum: ["agent"],
      default: "agent",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agent", agentSchema);
