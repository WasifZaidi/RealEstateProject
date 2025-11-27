// components/PropertyCoordinates.jsx
'use client'; // If using Next.js App Router

import dynamic from 'next/dynamic';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  FaMapMarkerAlt,
  FaCrosshairs,
  FaSearchLocation,
  FaEdit,
  FaCheck,
  FaTimes,
  FaMap,
  FaGlobeAmericas,
  FaCompass,
  FaSearch
} from 'react-icons/fa';

// Import Leaflet CSS only on client side
if (typeof window !== 'undefined') {
  require('leaflet/dist/leaflet.css');
}

// Dynamically import the map component with no SSR
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-b-2xl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600 text-sm">Loading map...</p>
      </div>
    </div>
  )
});

const PropertyCoordinates = ({
  coordinates,
  setCoordinates,
  address,
  setAddress,
  errors,
  setErrors
}) => {
  const [mapMode, setMapMode] = useState('search');
  const [manualCoords, setManualCoords] = useState({ lat: '', lng: '' });
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [tempCoordinates, setTempCoordinates] = useState(coordinates);
  const [isClient, setIsClient] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const searchInputRef = useRef(null);


  function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

async function searchLocation(query) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`
  );
  const data = await res.json();
  return data.map((item) => ({
    name: item.display_name,
    lat: item.lat,
    lng: item.lon,
  }));
}



  const handleSearch = useCallback(
    debounce(async (query) => {
      if (query.length < 3) {
        setSearchResults([]);
        return;
      }

      const results = await searchLocation(query);
      setSearchResults(results);
    }, 300),
    []
  );

  // Handle search result selection
const handleSearchResultSelect = (result) => {
  const newCoords = {
    lat: parseFloat(result.lat),
    lng: parseFloat(result.lng),
  };

  setTempCoordinates(newCoords);
  setSearchResults([]);
  setSearchQuery(result.name);

  // 🔥 FORCE MAP TO MOVE
  setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent("move-map-to", { detail: newCoords })
    );
  }, 50);
};

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize manual coords when coordinates exist
  useEffect(() => {
    if (coordinates && coordinates.lat && coordinates.lng) {
      setManualCoords({
        lat: coordinates.lat.toString(),
        lng: coordinates.lng.toString()
      });
    }
  }, [coordinates]);

  // Set temp coordinates when modal opens
  useEffect(() => {
    if (isMapModalOpen) {
      setTempCoordinates(coordinates || { lat: 40.7128, lng: -74.0060 });
    }
  }, [isMapModalOpen, coordinates]);

  // Validate coordinates
  const validateCoordinates = (lat, lng) => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    return (
      !isNaN(latNum) && latNum >= -90 && latNum <= 90 &&
      !isNaN(lngNum) && lngNum >= -180 && lngNum <= 180
    );
  };

  // Handle manual coordinate input
  const handleManualCoordinateChange = (field, value) => {
    const newManualCoords = {
      ...manualCoords,
      [field]: value
    };
    setManualCoords(newManualCoords);

    // Clear errors when user starts typing
    if (errors.coordinates) {
      setErrors(prev => ({ ...prev, coordinates: '' }));
    }

    // Auto-save if valid
    if (validateCoordinates(newManualCoords.lat, newManualCoords.lng)) {
      const newCoords = {
        lat: parseFloat(newManualCoords.lat),
        lng: parseFloat(newManualCoords.lng)
      };
      setCoordinates(newCoords);
      // Reverse geocode the coordinates
      reverseGeocode(newCoords.lat, newCoords.lng);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrors(prev => ({ ...prev, coordinates: 'Geolocation is not supported by this browser.' }));
      return;
    }

    setErrors(prev => ({ ...prev, coordinates: '' }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCoordinates(newCoords);
        setManualCoords({
          lat: newCoords.lat.toString(),
          lng: newCoords.lng.toString()
        });
        reverseGeocode(newCoords.lat, newCoords.lng);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Unable to retrieve your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Location access was denied.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        setErrors(prev => ({ ...prev, coordinates: errorMessage }));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  };

  // Search by address using OpenStreetMap Nominatim
  const handleAddressSearch = async () => {
    if (!address.trim()) {
      setErrors(prev => ({ ...prev, coordinates: 'Please enter an address to search.' }));
      return;
    }

    setIsSearching(true);
    setErrors(prev => ({ ...prev, coordinates: '' }));

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error('Search service unavailable');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const newCoords = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
        setCoordinates(newCoords);
        setManualCoords({
          lat: newCoords.lat.toString(),
          lng: newCoords.lng.toString()
        });

        // Get formatted address
        const formattedAddress = data[0].display_name;
        setAddress(formattedAddress);

        setErrors(prev => ({ ...prev, coordinates: '' }));
      } else {
        setErrors(prev => ({
          ...prev,
          coordinates: 'Address not found. Please try a different address or enter coordinates manually.'
        }));
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setErrors(prev => ({
        ...prev,
        coordinates: 'Search service unavailable. Please try manual entry or use the map.'
      }));
    } finally {
      setIsSearching(false);
    }
  };

  // Reverse geocode coordinates to get address
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.display_name) {
          setAddress(data.display_name);
        }
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Silently fail for reverse geocoding
    }
  };

  // Handle map click
  const handleMapClick = (newCoords) => {
    setTempCoordinates(newCoords);
    reverseGeocode(newCoords.lat, newCoords.lng);
  };

  // Clear coordinates
  const clearCoordinates = () => {
    setCoordinates(null);
    setManualCoords({ lat: '', lng: '' });
    setAddress('');
    setErrors(prev => ({ ...prev, coordinates: '' }));
  };

  // Open map modal
  const openMapModal = () => {
    setIsMapModalOpen(true);
  };

  // Close map modal
  const closeMapModal = () => {
    setIsMapModalOpen(false);
  };

  // Use coordinates from map
  const useMapCoordinates = () => {
    if (tempCoordinates) {
      setCoordinates(tempCoordinates);
      reverseGeocode(tempCoordinates.lat, tempCoordinates.lng);
    }
    closeMapModal();
  };

  // Don't render map-related content during SSR
  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <FaMapMarkerAlt className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Property Location</h3>
            <p className="text-sm text-gray-600">Add precise coordinates for better visibility</p>
          </div>
        </div>
        <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-600">Loading map component...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-50 rounded-lg">
          <FaMapMarkerAlt className="text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Property Location</h3>
          <p className="text-sm text-gray-600">Add precise coordinates for better visibility</p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
        <button
          type="button"
          onClick={() => setMapMode('search')}
          className={`py-2 px-3 text-sm font-medium rounded-md transition-colors ${mapMode === 'search'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          <FaSearchLocation className="inline mr-1" />
          Search
        </button>
        <button
          type="button"
          onClick={() => setMapMode('manual')}
          className={`py-2 px-3 text-sm font-medium rounded-md transition-colors ${mapMode === 'manual'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          <FaEdit className="inline mr-1" />
          Manual
        </button>
        <button
          type="button"
          onClick={() => setMapMode('map')}
          className={`py-2 px-3 text-sm font-medium rounded-md transition-colors ${mapMode === 'map'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          <FaMap className="inline mr-1" />
          Map
        </button>
        <button
          type="button"
          onClick={() => setMapMode('pin')}
          className={`py-2 px-3 text-sm font-medium rounded-md transition-colors ${mapMode === 'pin'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          <FaCrosshairs className="inline mr-1" />
          Current
        </button>
      </div>

      {/* Search Mode */}
      {mapMode === 'search' && (
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Enter full address (street, city, state, zip)"
              className="flex-1 normal_input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
              disabled={isSearching}
            />
            <button
              type="button"
              onClick={handleAddressSearch}
              disabled={isSearching}
              className="px-4 py-2 bg-blue-600 rounded-[50px] text-white cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
          <button
            type="button"
            onClick={openMapModal}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <FaMap className="inline mr-2" />
            Open Interactive Map
          </button>
        </div>
      )}

      {/* Manual Mode */}
      {mapMode === 'manual' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-medium text-gray-700 text-sm">
                Latitude
              </label>
              <input
                type="text"
                placeholder="e.g., 40.7128"
                className={`normal_input ${errors.coordinates ? 'normal_err' : ''}`}
                value={manualCoords.lat}
                onChange={(e) => handleManualCoordinateChange('lat', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="font-medium text-gray-700 text-sm">
                Longitude
              </label>
              <input
                type="text"
                placeholder="e.g., -74.0060"
                className={`normal_input ${errors.coordinates ? 'normal_err' : ''}`}
                value={manualCoords.lng}
                onChange={(e) => handleManualCoordinateChange('lng', e.target.value)}
              />
            </div>
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={openMapModal}
              className="py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <FaGlobeAmericas className="inline mr-2" />
              Verify on Map
            </button>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500">
              Enter coordinates in decimal degrees (e.g., 40.7128, -74.0060 for New York)
            </p>
          </div>
        </div>
      )}

      {/* Map Mode */}
      {mapMode === 'map' && (
        <div className="space-y-3">
          <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FaMap className="text-3xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm mb-3">Interactive Map</p>
              <button
                type="button"
                onClick={openMapModal}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Open Map
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Click to open interactive map and select property location
          </p>
        </div>
      )}

      {/* Current Location Mode */}
      {mapMode === 'pin' && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={getCurrentLocation}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-[50px] cursor-pointer hover:bg-green-700 transition-colors font-medium"
          >
            <FaCrosshairs className="inline mr-2" />
            Use My Current Location
          </button>
          <div className="text-center">
            <button
              type="button"
              onClick={openMapModal}
              className="py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <FaMap className="inline mr-2" />
              Or Select on Map
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            We'll use your device's GPS to get precise coordinates
          </p>
        </div>
      )}

      {/* Coordinate Display */}
      {coordinates && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-green-800 text-sm flex items-center gap-2">
                <FaCheck className="text-green-600" />
                Location Coordinates Set
              </h4>
              <p className="text-green-700 text-sm mt-1">
                Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
              </p>
              {address && (
                <p className="text-green-600 text-xs mt-1 truncate">{address}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={openMapModal}
                className="p-2 text-green-600 hover:text-green-800 transition-colors"
                title="View on map"
              >
                <FaMap />
              </button>
              <button
                type="button"
                onClick={clearCoordinates}
                className="p-2 text-green-600 hover:text-green-800 transition-colors"
                title="Clear location"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {errors.coordinates && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm flex items-center gap-2">
            <FaTimes className="text-red-500" />
            {errors.coordinates}
          </p>
        </div>
      )}

      {/* Help Text */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 text-sm mb-1">
          Why add coordinates?
        </h4>
        <ul className="text-blue-700 text-xs space-y-1">
          <li>• Precise location mapping for buyers</li>
          <li>• Better search results and recommendations</li>
          <li>• Accurate distance calculations</li>
          <li>• Interactive map displays</li>
          <li>• Professional property presentation</li>
        </ul>
      </div>

    {/* Map Modal */}
{isMapModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={closeMapModal}
    />

    {/* Modal */}
    <div className="relative bg-white w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl rounded-3xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-600" />
            Select Property Location
          </h3>
          <p className="text-gray-600 text-sm">Search or click on the map to select location.</p>
        </div>

        <div className="flex items-center gap-3 w">
          {tempCoordinates && (
            <button
              onClick={useMapCoordinates}
              className="px-6 py-3 flex items-center gap-[10px] cursor-pointer text-sm bg-blue-600 text-white rounded-[50px] shadow hover:bg-blue-700 transition"
            >
              <FaCheck /> Confirm
            </button>
          )}

          <button
            onClick={closeMapModal}
            className="p-3 rounded-xl hover:bg-gray-100 transition"
          >
            <FaTimes className="text-xl text-gray-500" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-3 bg-white">
        <div className="relative max-w-xl">
          <input
            type="text"
            placeholder="Search address, place, or coordinates…"
            className="w-full normal_input mod_2"
            onChange={(e) => handleSearch(e.target.value)}
          />

          <FaSearch className="absolute left-3 top-[16px] text-gray-400" />

          {searchQuery?.length > 0 && (
            <FaTimes
              className="absolute right-3 top-[17px] text-gray-400 cursor-pointer"
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
            />
          )}
        </div>
      </div>

      {/* Main Map */}
      <div className="flex-1 relative">

        <LeafletMap
          coordinates={tempCoordinates}
            tempCoordinates={tempCoordinates}
  setTempCoordinates={setTempCoordinates}
          searchResults={searchResults}
          onMapClick={handleMapClick}
          onSearchSelect={(loc) => {
            setTempCoordinates({ lat: loc.lat, lng: loc.lng });
            setSearchResults([]);
          }}
        />

        {/* Search Result Panel */}
       {searchResults.length > 0 && (
  <div className="absolute top-6 left-6 w-96 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 max-h-[400px] z-[999] backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200">
    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Search Results
        <span className="ml-auto text-xs font-normal text-gray-500 bg-white px-2 py-1 rounded-full">
          {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
        </span>
      </h3>
    </div>
    <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
      {searchResults.map((item, index) => (
        <div
          key={index}
          className="p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-200 group"
          onClick={() => handleSearchResultSelect(item)}
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {item.name}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                {item.address}
              </p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default PropertyCoordinates;