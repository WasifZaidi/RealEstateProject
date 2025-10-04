const mongoose = require('mongoose');
const { Schema } = mongoose;

// Media Sub-schema
const mediaSchema = new Schema({
  public_id: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  resource_type: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  format: String,
  width: Number,
  height: Number,
  duration: Number, // For videos
  bytes: Number,
  isCover: {
    type: Boolean,
    default: false
  },
  caption: String,
  uploadOrder: Number // To maintain upload sequence
}, { _id: true });

// Location Sub-schema
const locationSchema = new Schema({
  state: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  zipCode: String,
  neighborhood: String
});

// Pricing Sub-schema
const pricingSchema = new Schema({
  amount: {
    type: Number,
    required: true,
    min: 0,
    max: 100000000
  },
  currency: {
    type: String,
    default: 'USD'
  },
  priceType: {
    type: String,
    enum: ['fixed', 'negotiable', 'auction'],
    default: 'fixed'
  },
  includesUtilities: {
    type: Boolean,
    default: false
  }
});

// Property Details Sub-schema
const propertyDetailsSchema = new Schema({
  size: {
    type: Number, // in square feet
    required: true,
    min: 0
  },
  bedrooms: {
    type: Number,
    min: 0,
    max: 50
  },
  bathrooms: {
    type: Number,
    min: 0,
    max: 50
  },
  yearBuilt: Number,
  floors: {
    type: Number,
    min: 1,
    default: 1
  },
  lotSize: Number, // for plots and houses
  parkingSpaces: {
    type: Number,
    min: 0,
    default: 0
  }
});

// Main Listing Schema
const listingSchema = new Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 5000
  },
  
  // Property Classification
  propertyType: {
    category: {
      type: String,
      required: true,
      enum: ['Residential', 'Plot', 'Commercial', 'Industrial']
    },
    subType: {
      type: String,
      required: true,
      enum: [
        // Residential
        'apartment', 'house', 'villa', 'condo', 'townhouse',
        // Plot
        'commercial-plot', 'residential-plot', 'agricultural-plot', 'industrial-plot',
        // Commercial
        'office', 'retail', 'warehouse', 'restaurant',
        // Industrial
        'factory', 'storage', 'manufacturing'
      ]
    }
  },
  
  // Location
  location: {
    type: locationSchema,
    required: true
  },
  
  // Pricing
  price: {
    type: pricingSchema,
    required: true
  },
  
  // Property Details
  details: {
    type: propertyDetailsSchema,
    required: true
  },
  
  // Media
  media: [mediaSchema],
  
  // Amenities
  amenities: [{
    type: String,
    enum: [
      'balcony', 'garden', 'fireplace', 'pool',
      'modern-kitchen', 'dishwasher', 'microwave',
      'ac', 'heating', 'washer-dryer',
      'security-system', 'gated-community', 'cctv',
      'parking', 'garage', 'patio',
      'furnished', 'pet-friendly', 'wheelchair-accessible',
      'high-speed-internet', 'smart-home'
    ]
  }],
  
  // Status and Visibility
  status: {
    type: String,
    enum: ['draft', 'active', 'pending', 'sold', 'expired', 'archived'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'public'
  },
  
  // Ownership and Agent Info
  owner: {
    type: String,
    required: true
  },
  agent: {
     type: String,
    required: true
  },
  contactInfo: {
    name: String,
    phone: String,
    email: String,
    showContact: {
      type: Boolean,
      default: true
    }
  },
  
  // Metadata
  views: {
    type: Number,
    default: 0
  },
  favoritesCount: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  listedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date,
  lastRefreshed: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});



module.exports = mongoose.model('Listing', listingSchema);