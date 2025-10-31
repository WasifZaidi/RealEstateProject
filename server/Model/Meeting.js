const mongoose = require("mongoose");
const { Schema } = mongoose;

// ✅ Reusable location sub-schema
const locationSchema = new Schema({
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
      required: true,
      index: "2dsphere",
    },
  },
  zipCode: {
    type: String,
    trim: true,
  },
  neighborhood: {
    type: String,
    trim: true,
  },
});

// ✅ Main Meeting Schema
const meetingSchema = new Schema(
  {
    // Public meeting identifier
    meetingPublic_Id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Linked entities
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
      required: true,
    },

    listing_publicId: {
      type: String,
      required: true,
      trim: true,
    },

    // Meeting details
    type: {
      type: String,
      enum: ["Tour", "Meeting", "Consultation", "Follow-up"],
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },

    meetingMode: {
      type: String,
      enum: ["In-Person", "Video", "Call"],
      default: "In-Person",
      required: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    // Embedded sub-documents
    location: {
      type: locationSchema,
      required: true,
    },

    agentContacts: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
    },

    clientContacts: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Rescheduling history
    rescheduleHistory: [
      {
        oldDate: { type: Date, required: true },
        newDate: { type: Date, required: true },
        reason: { type: String, trim: true },
        rescheduledBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    rescheduleCount: { type: Number, default: 0 },

    // Cancellation info
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

// ✅ Indexes for performance
meetingSchema.index({ meetingPublic_Id: 1 }, { unique: true });
meetingSchema.index({ createdAt: -1 });
meetingSchema.index({ "location.coordinates": "2dsphere" });

// ✅ Export Model
module.exports = mongoose.model("Meeting", meetingSchema);
