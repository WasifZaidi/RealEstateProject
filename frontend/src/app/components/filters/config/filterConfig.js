// components/filters/config/filterConfig.js
export const FILTER_CATEGORIES = {
  location: ['state', 'city', 'neighborhood', 'zipCode', 'latitude', 'longitude', 'radius'],
  property: [
    'propertyType', 'propertyFor', 'minPrice', 'maxPrice',
    'minBedrooms', 'maxBedrooms', 'minBathrooms', 'maxBathrooms',
    'minSize', 'maxSize', 'amenities', 'priceType', 'includesUtilities',
    'yearBuiltFrom', 'yearBuiltTo', 'minFloors', 'maxFloors', 'minParking', 'maxParking',
    'isFeatured', 'isPremium', 'search'
  ],
  system: ['page', 'limit', 'sortBy', 'sortOrder']
};
