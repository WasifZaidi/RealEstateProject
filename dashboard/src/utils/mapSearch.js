// utils/mapSearch.js
export const searchLocation = async (query) => {
  if (!query.trim()) return [];
  
  try {
    // Using OpenStreetMap Nominatim API for geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
    );
    const data = await response.json();
    
    return data.map((result) => ({
      name: result.display_name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name,
      type: result.type,
      importance: result.importance
    }));
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

// Reverse geocoding function
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    
    return {
      address: data.display_name,
      name: data.display_name.split(',')[0]
    };
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return null;
  }
};