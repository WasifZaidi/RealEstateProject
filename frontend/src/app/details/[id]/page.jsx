// app/details/[id]/page.js
import MediaSection from "@/app/components/MediaSection";
import React from "react";
import {
  MapPinIcon,
  HomeModernIcon,
  BuildingOfficeIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import ActionButtons from "@/app/components/ActionButtons";

async function getListing(id) {
  try {
    const res = await fetch(`http://localhost:3001/api/listings/find/68dd5969d20ab71025e7cfb9`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.listing || null;
  } catch (err) {
    console.error("Error fetching listing:", err);
    return null;
  }
}

// Price formatting utility
function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency || 'USD',
    maximumFractionDigits: 0,
  }).format(price.amount);
}

// Date formatting utility
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Key Details Component
function KeyDetails({ details, propertyType }) {
  const detailItems = [
    { 
      icon: HomeModernIcon, 
      label: 'Property Type', 
      value: propertyType.subType,
      color: 'blue'
    },
    { 
      icon: BuildingOfficeIcon, 
      label: 'Bedrooms', 
      value: details.bedrooms,
      color: 'purple'
    },
    { 
      icon: UserIcon, 
      label: 'Bathrooms', 
      value: details.bathrooms,
      color: 'green'
    },
    { 
      icon: 'sqft', 
      label: 'Square Feet', 
      value: details.size?.toLocaleString(),
      color: 'orange'
    },
    { 
      icon: 'floor', 
      label: 'Floors', 
      value: details.floors,
      color: 'red'
    },
    { 
      icon: 'parking', 
      label: 'Parking', 
      value: details.parkingSpaces,
      color: 'indigo'
    },
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-700' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100', border: 'border-purple-200', text: 'text-purple-700' },
    green: { bg: 'bg-green-50', icon: 'bg-green-100', border: 'border-green-200', text: 'text-green-700' },
    orange: { bg: 'bg-orange-50', icon: 'bg-orange-100', border: 'border-orange-200', text: 'text-orange-700' },
    red: { bg: 'bg-red-50', icon: 'bg-red-100', border: 'border-red-200', text: 'text-red-700' },
    indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-100', border: 'border-indigo-200', text: 'text-indigo-700' },
  };

  const IconWrapper = ({ item }) => {
    const colors = colorMap[item.color];
    
    if (item.icon === 'sqft') {
      return (
        <div className={`w-8 h-8 sm:w-10 sm:h-10 ${colors.icon} rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-105 flex-shrink-0`}>
          <span className="text-xs font-semibold text-gray-700">ft²</span>
        </div>
      );
    } else if (item.icon === 'floor') {
      return (
        <div className={`w-8 h-8 sm:w-10 sm:h-10 ${colors.icon} rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-105 flex-shrink-0`}>
          <span className="text-xs font-semibold text-gray-700">FL</span>
        </div>
      );
    } else if (item.icon === 'parking') {
      return (
        <div className={`w-8 h-8 sm:w-10 sm:h-10 ${colors.icon} rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-105 flex-shrink-0`}>
          <span className="text-xs font-semibold text-gray-700">P</span>
        </div>
      );
    } else {
      return (
        <div className={`w-8 h-8 sm:w-10 sm:h-10 ${colors.icon} rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-105 flex-shrink-0`}>
          <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 max-w-[970px] mx-auto w-full">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Property details</h3>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Essential information about this property</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {detailItems.map((item, index) => (
          <div 
            key={index} 
            className={`group relative ${colorMap[item.color].bg} rounded-xl p-3 sm:p-4 transition-all duration-200 hover:shadow-sm border ${colorMap[item.color].border} hover:border-gray-300 w-full overflow-hidden`}
          >
            <div className="flex items-center space-x-2 sm:space-x-3 w-full">
              <IconWrapper item={item} />
              
              <div className="flex-1 min-w-0 overflow-hidden">
                <span className="text-xs sm:text-sm font-medium text-gray-600 block leading-tight truncate">
                  {item.label}
                </span>
                <span className="text-base sm:text-lg font-semibold text-gray-900 block leading-tight mt-0.5 truncate">
                  {item.value || 'N/A'}
                </span>
              </div>
            </div>
            
            {/* Airbnb-style subtle hover effect */}
            <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Amenities Component
function Amenities({ amenities }) {
  const commonAmenities = {
    balcony: 'Balcony',
    garden: 'Garden',
    fireplace: 'Fireplace',
    pool: 'Swimming Pool',
    microwave: 'Microwave',
    dishwasher: 'Dishwasher',
    'modern-kitchen': 'Modern Kitchen',
    gym: 'Fitness Center',
    security: 'Security System',
    laundry: 'Laundry',
    ac: 'Air Conditioning',
    heating: 'Heating',
    wifi: 'High-Speed Internet',
    parking: 'Parking',
    patio: 'Patio',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Amenities</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center space-x-3 p-2">
            <CheckBadgeIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-gray-700 font-[500]">{commonAmenities[amenity] || amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Contact Card Component
function ContactCard({ agent, contactInfo, title, location, listing }) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sticky top-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <UserIcon className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{agent}</h3>
        <p className="text-gray-600 text-sm">Real Estate Agent</p>
        {listing.isPremium && (
          <div className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium mt-2">
            <CheckBadgeIcon className="w-3 h-3 mr-1" />
            Premium Agent
          </div>
        )}
      </div>

      <div className="space-y-4">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-[50px] font-semibold transition-colors duration-200 flex items-center justify-center">
          <PhoneIcon className="w-5 h-5 mr-2" />
          Contact Agent
        </button>
        
        <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-[50px] font-semibold transition-colors duration-200 flex items-center justify-center">
          <EnvelopeIcon className="w-5 h-5 mr-2" />
          Send Message
        </button>

        <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-[50px] font-semibold transition-colors duration-200 flex items-center justify-center">
          <CalendarIcon className="w-5 h-5 mr-2" />
          Schedule Tour
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-center text-sm text-gray-600">
          <p>Listed on {formatDate(listing.listedAt)}</p>
          <p className="mt-1">{listing.views} views • {listing.favoritesCount} favorites</p>
        </div>
      </div>
    </div>
  );
}

// Action Buttons Component


export default async function ListingPage({ params }) {
  const { id } = params;
  const listing = await getListing(id);

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing Not Found</h1>
          <p className="text-gray-600">The property you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {listing.isFeatured && (
                  <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
                {listing.isPremium && (
                  <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Premium
                  </span>
                )}
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {listing.propertyType.category}
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {listing.status}
                </span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {listing.title}
              </h1>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPinIcon className="w-5 h-5 mr-1" />
                <span>{listing.location.city}, {listing.location.state}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-3xl font-bold text-blue-600">
                  {formatPrice(listing.price)}
                  {listing.price.priceType === 'fixed' ? '' : ` ${listing.price.priceType}`}
                </div>
                <ActionButtons
                  isFeatured={listing.isFeatured}
                  isPremium={listing.isPremium}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Media Section */}
        <div className="mb-8">
          <MediaSection data={listing.media} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Details */}
            <KeyDetails 
              details={listing.details} 
              propertyType={listing.propertyType}
            />

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="leading-relaxed text-[14px]">{listing.description}</p>
              </div>
            </div>

            {/* Amenities */}
            <Amenities amenities={listing.amenities} />

            {/* Location Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Location</h3>
              <div className="flex items-center text-gray-700 mb-4">
                <MapPinIcon className="w-5 h-5 mr-2 text-gray-500" />
                <span>{listing.location.city}, {listing.location.state}</span>
              </div>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <MapPinIcon className="w-12 h-12 mx-auto mb-2" />
                  <p>Interactive Map</p>
                  <p className="text-sm">Coordinates: {listing.location.coordinates.coordinates.join(', ')}</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property ID:</span>
                    <span className="font-medium">{listing._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Listed Date:</span>
                    <span className="font-medium">{formatDate(listing.listedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type:</span>
                    <span className="font-medium capitalize">{listing.propertyType.subType}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built:</span>
                    <span className="font-medium">2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Utilities Included:</span>
                    <span className="font-medium">
                      {listing.price.includesUtilities ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">{formatDate(listing.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Card */}
          <div className="lg:col-span-1">
            <ContactCard 
              agent={listing.agent}
              contactInfo={listing.contactInfo}
              title={listing.title}
              location={listing.location}
              listing={listing}
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Interested in this property?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Schedule a viewing or get more information about this beautiful {listing.propertyType.subType} in {listing.location.city}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-[50px] font-semibold hover:bg-blue-50 transition-colors duration-200">
                Schedule a Tour
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-[50px] font-semibold hover:bg-blue-700 transition-colors duration-200">
                Request More Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}