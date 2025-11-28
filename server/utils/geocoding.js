// utils/geocoding.js
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'openstreetmap',
  httpAdapter: 'https',
  formatter: null
};

const geocoder = NodeGeocoder(options);

const geocodeAddress = async (address) => {
  try {
    const results = await geocoder.geocode(address);
    
    if (results && results.length > 0) {
      return {
        lat: results[0].latitude,
        lng: results[0].longitude
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

module.exports = {
  geocodeAddress
};