const Joi = require('joi');

// Common reusable schemas
const locationSchema = Joi.object({
  state: Joi.string().trim().required().messages({
    "string.empty": "State is required",
    "any.required": "State is required",
  }),

  city: Joi.string().trim().required().messages({
    "string.empty": "City is required",
    "any.required": "City is required",
  }),

  // NEW FIELD: address
  address: Joi.string().trim().allow("", null),

  // NEW FIELDS: lat / lng from frontend
  lat: Joi.number().optional(),
  lng: Joi.number().optional(),

  // Your existing GeoJSON structure
  coordinates: Joi.object({
    type: Joi.string().valid("Point").default("Point"),
    coordinates: Joi.array().items(Joi.number()).length(2).optional(),
  }).optional(),

  zipCode: Joi.string()
    .pattern(/^\d{5}(-\d{4})?$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Zip code must be in valid format (e.g., 12345 or 12345-6789)",
    }),

  neighborhood: Joi.string().trim().optional(),
});


const pricingSchema = Joi.object({
  amount: Joi.number().min(0).max(100000000).required().messages({
    'number.min': 'Price amount must be at least 0',
    'number.max': 'Price amount cannot exceed 100,000,000',
    'any.required': 'Price amount is required'
  }),
  currency: Joi.string().default('USD'),
  priceType: Joi.string().valid('fixed', 'negotiable', 'auction').default('fixed'),
  includesUtilities: Joi.boolean().default(false)
});

const propertyDetailsSchema = Joi.object({
  size: Joi.number().min(0).required().messages({
    'number.min': 'Property size must be at least 0',
    'any.required': 'Property size is required'
  }),
  bedrooms: Joi.number().min(0).max(50).optional(),
  bathrooms: Joi.number().min(0).max(50).optional(),
  yearBuilt: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
  floors: Joi.number().min(1).default(1),
  lotSize: Joi.number().min(0).optional(),
  parkingSpaces: Joi.number().min(0).default(0)
});

// Main listing creation schema
const createListingSchema = Joi.object({
  // Basic Information
  title: Joi.string().trim().required().max(200).messages({
    'string.empty': 'Title is required',
    'string.max': 'Title cannot exceed 200 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().trim().max(5000).optional(),

  isFeatured: Joi.boolean().optional().messages({
    'boolean.base': 'isFeatured must be a boolean'
  }),

  // Property Classification
  propertyType: Joi.object({
    category: Joi.string().valid('Residential', 'Plot', 'Commercial', 'Industrial').required(),
    subType: Joi.string().valid(
      'apartment', 'house', 'villa', 'condo', 'townhouse',
      'commercial-plot', 'residential-plot', 'agricultural-plot', 'industrial-plot',
      'office', 'retail', 'warehouse', 'restaurant',
      'factory', 'storage', 'manufacturing'
    ).required()
  }).required(),

  // Location
  location: locationSchema.required(),

  propertyFor: Joi.string().valid('Sell', 'Rent', "Lease").required().messages({
    'any.only': 'Property for must be either Sell or Rent'
  }),

  // Pricing
  price: pricingSchema.required(),

  // Property Details
  details: propertyDetailsSchema.required(),

  // Amenities
  amenities: Joi.array().items(
    Joi.string().valid(
      'balcony', 'garden', 'fireplace', 'pool',
      'modern-kitchen', 'dishwasher', 'microwave',
      'ac', 'heating', 'washer-dryer',
      'security-system', 'gated-community', 'cctv',
      'parking', 'garage', 'patio',
      'furnished', 'pet-friendly', 'wheelchair-accessible',
      'high-speed-internet', 'smart-home'
    )
  ).optional(),

  // Status and Visibility
  status: Joi.string().valid('draft', 'active', 'pending', 'sold', 'expired', 'archived').default('draft'),
  isFeatured: Joi.boolean().default(false),
  isPremium: Joi.boolean().default(false),
  visibility: Joi.string().valid('public', 'private', 'unlisted').default('public'),

  // Ownership and Agent Info
  owner: Joi.string().required(),
  agent: Joi.string().required(),
  contactInfo: Joi.object({
    name: Joi.string().trim().optional(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
    email: Joi.string().email().optional(),
    showContact: Joi.boolean().default(true)
  }).optional()
}).options({ abortEarly: false });

const updateListingSchema = Joi.object({
  // Basic Information
  title: Joi.string().trim().max(200).optional().messages({
    'string.max': 'Title cannot exceed 200 characters'
  }),
  description: Joi.string().trim().max(5000).optional(),

  // Property Classification
  propertyType: Joi.object({
    category: Joi.string().valid('Residential', 'Plot', 'Commercial', 'Industrial').optional(),
    subType: Joi.string().valid(
      'apartment', 'house', 'villa', 'condo', 'townhouse',
      'commercial-plot', 'residential-plot', 'agricultural-plot', 'industrial-plot',
      'office', 'retail', 'warehouse', 'restaurant',
      'factory', 'storage', 'manufacturing'
    ).optional()
  }).optional(),

  // Location
  location: locationSchema.optional(),

  propertyFor: Joi.string().valid('Sell', 'Rent').optional().messages({
    'any.only': 'Property for must be either Sell or Rent'
  }),

  // Pricing
  price: pricingSchema.optional(),

  // Property Details
  details: propertyDetailsSchema.optional(),

  // Amenities
  amenities: Joi.array().items(
    Joi.string().valid(
      'balcony', 'garden', 'fireplace', 'pool',
      'modern-kitchen', 'dishwasher', 'microwave',
      'ac', 'heating', 'washer-dryer',
      'security-system', 'gated-community', 'cctv',
      'parking', 'garage', 'patio',
      'furnished', 'pet-friendly', 'wheelchair-accessible',
      'high-speed-internet', 'smart-home'
    )
  ).optional(),

  // Status and Visibility
  status: Joi.string().valid('draft', 'active', 'pending', 'sold', 'expired', 'archived').optional(),
  isFeatured: Joi.boolean().optional(),
  isPremium: Joi.boolean().optional(),
  visibility: Joi.string().valid('public', 'private', 'unlisted').optional(),

  // Media Management
  deleteMedia: Joi.array().items(Joi.string()).optional(),
  coverPhotoIndex: Joi.number().integer().min(0).optional(),

  // Contact Info
  contactInfo: Joi.object({
    name: Joi.string().trim().optional(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
    email: Joi.string().email().optional(),
    showContact: Joi.boolean().optional()
  }).optional()
}).options({ abortEarly: false });

// Filter schema for GET listings

const PROPERTY_TYPES = {
  RESIDENTIAL: ['apartment', 'house', 'villa', 'condo', 'townhouse'],
  PLOT: ['commercial-plot', 'residential-plot', 'agricultural-plot', 'industrial-plot'],
  COMMERCIAL: ['office', 'retail', 'warehouse', 'restaurant'],
  INDUSTRIAL: ['factory', 'storage', 'manufacturing']
};
const ALL_PROPERTY_TYPES = Object.values(PROPERTY_TYPES).flat();

// Updated filterListingSchema
const filterListingSchema = Joi.object({
  // Pagination
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),

  // Basic filters
  propertyType: Joi.string().valid(...ALL_PROPERTY_TYPES),
  propertyFor: Joi.string().valid('Sell', 'Rent'),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  minBedrooms: Joi.number().integer().min(0),
  maxBedrooms: Joi.number().integer().min(0),
  minBathrooms: Joi.number().integer().min(0),
  maxBathrooms: Joi.number().integer().min(0),
  minSize: Joi.number().min(0),
  maxSize: Joi.number().min(0),

  // Location filters
  state: Joi.string().trim(),
  city: Joi.string().trim(),
  zipCode: Joi.string(),
  neighborhood: Joi.string().trim(),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180),
  radius: Joi.number().min(0).max(100).default(10),

  // Advanced filters
  amenities: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ),
  priceType: Joi.string().valid('fixed', 'negotiable', 'auction'),
  includesUtilities: Joi.boolean(),
  yearBuiltFrom: Joi.number().integer().min(1800),
  yearBuiltTo: Joi.number().integer().min(1800),
  minFloors: Joi.number().integer().min(1),
  maxFloors: Joi.number().integer().min(1),
  minParking: Joi.number().integer().min(0),
  maxParking: Joi.number().integer().min(0),

  // Status and visibility
  status: Joi.string().valid('draft', 'active', 'pending', 'sold', 'expired', 'archived').default('active'),
  isFeatured: Joi.boolean(),
  isPremium: Joi.boolean(),
  visibility: Joi.string().valid('public', 'private', 'unlisted').default('public'),

  // Search
  search: Joi.string().trim().max(100),

  // Sorting - Enhanced options
  sortBy: Joi.string().valid(
    'price.amount',
    'listedAt',
    'views',
    'favoritesCount',
    'details.size',
    'details.bedrooms',
    'details.bathrooms',
    'isFeatured', // Added for recommended sorting
    'isPremium'   // Added for premium priority
  ).default('listedAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),

  // Agent/Owner filters
  owner: Joi.string(),
  agent: Joi.string()
}).options({ abortEarly: false });

// ID validation schema
const idParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    'string.hex': 'Invalid ID format',
    'string.length': 'ID must be 24 characters long',
    'any.required': 'ID is required'
  })
});

module.exports = {
  createListingSchema,
  updateListingSchema,
  filterListingSchema,
  idParamSchema
};