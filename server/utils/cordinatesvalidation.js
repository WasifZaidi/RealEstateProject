// utils/validation.js
const validateCoordinates = (lat, lng) => {
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  
  if (isNaN(latNum) || isNaN(lngNum)) {
    return false;
  }
  
  // Valid latitude range: -90 to 90
  // Valid longitude range: -180 to 180
  return (
    latNum >= -90 && latNum <= 90 &&
    lngNum >= -180 && lngNum <= 180
  );
};

const sanitizeCoordinates = (lat, lng) => {
  // Round to 6 decimal places (~0.1 meter precision)
  return {
    lat: parseFloat(parseFloat(lat).toFixed(6)),
    lng: parseFloat(parseFloat(lng).toFixed(6))
  };
};

module.exports = {
  validateCoordinates,
  sanitizeCoordinates
};