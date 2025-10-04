// app/components/MapSection.jsx
'use client';

import React from 'react';

const MapSection = ({ location }) => {
  // In a real app, you would use a mapping library like Leaflet or Google Maps
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.city},${location.state}&zoom=13&size=600x300&maptype=roadmap&key=YOUR_API_KEY`;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
      <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="font-semibold">{location.city}, {location.state}</p>
          <p className="text-sm">Interactive map would be displayed here</p>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>📍 Exact location provided after tour scheduling</p>
      </div>
    </div>
  );
};

export default MapSection;