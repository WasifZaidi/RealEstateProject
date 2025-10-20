const mongoose = require("mongoose")
const { Schema } = mongoose;

// ✅ Reuse your location schema
const locationSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  coordinates: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: "2dsphere",
    },
  },
  zipCode: String,
  neighborhood: String,
});

// ✅ Main Meeting schema
const meetingSchema = new mongoose.Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    agent: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },




    agentId: {
      type: String,
      required: true,
      trim: true,
    },

    listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
    },

    listing_publicId: {
      type: String, required: true
    },

    type: {
      type: String,
      enum: ["Tour", "Meeting"],
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "Cancelled By User"],
      default: "Scheduled",
    },

    notes: {
      type: String,
      trim: true,
    },

    location: locationSchema,

    agentContacts: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },

    clientContacts: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    meetingPublic_Id: { type: String, required: true },

    cancelledAt: {
      type: Date,
      default: null,
    },

    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

meetingSchema.index({ meetingPublic_Id: 1 });

module.exports = mongoose.model('Meeting', meetingSchema);

