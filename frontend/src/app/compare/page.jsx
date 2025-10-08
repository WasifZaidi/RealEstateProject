"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Home, AlertCircle, RefreshCw, X, Star, MapPin, Ruler, Car, Bath, Bed, Calendar, UtilityPole, Shield, Wifi, Trees } from "lucide-react";

export default function CompareListingsPage() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const router = useRouter();

    // Common features to compare across all property types
    const allFeatures = [
        { key: 'price', label: 'Price', icon: '$', format: (value) => `$${value?.amount?.toLocaleString() || 'N/A'}` },
        { key: 'propertyType', label: 'Property Type', format: (value) => `${value?.category || 'N/A'} - ${value?.subType || 'N/A'}` },
        { key: 'location', label: 'Location', icon: MapPin, format: (value) => `${value?.city || 'N/A'}, ${value?.state || 'N/A'}` },
        { key: 'size', label: 'Size (sq ft)', icon: Ruler, format: (value) => value?.toLocaleString() || 'N/A' },
        { key: 'bedrooms', label: 'Bedrooms', icon: Bed, format: (value) => value || 'N/A' },
        { key: 'bathrooms', label: 'Bathrooms', icon: Bath, format: (value) => value || 'N/A' },
        { key: 'yearBuilt', label: 'Year Built', icon: Calendar, format: (value) => value || 'N/A' },
        { key: 'parkingSpaces', label: 'Parking', icon: Car, format: (value) => value || 'N/A' },
        { key: 'floors', label: 'Floors', format: (value) => value || 'N/A' },
        { key: 'lotSize', label: 'Lot Size (sq ft)', icon: Trees, format: (value) => value?.toLocaleString() || 'N/A' },
        { key: 'includesUtilities', label: 'Utilities Included', icon: UtilityPole, format: (value) => value ? 'Yes' : 'No' },
        { key: 'agent', label: 'Agent', format: (value) => value || 'N/A' }
    ];

    // Amenity icons mapping
    const amenityIcons = {
        'balcony': '🏠',
        'garden': '🌿',
        'fireplace': '🔥',
        'pool': '🏊',
        'modern-kitchen': '👨‍🍳',
        'dishwasher': '🍽️',
        'microwave': '🔥',
        'ac': '❄️',
        'heating': '🔥',
        'washer-dryer': '👕',
        'security-system': '🛡️',
        'gated-community': '🏘️',
        'cctv': '📹',
        'parking': '🅿️',
        'garage': '🚗',
        'patio': '🌳',
        'furnished': '🛋️',
        'pet-friendly': '🐾',
        'wheelchair-accessible': '♿',
        'high-speed-internet': '🌐',
        'smart-home': '🏠'
    };

    async function fetchWithTimeout(resource, options = {}, timeout = 10000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(resource, {
                ...options,
                signal: controller.signal,
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    }

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const stored = localStorage.getItem("compare_listings");
                const listingIds = stored ? JSON.parse(stored) : [];

                if (!listingIds.length) {
                    setListings([]);
                    setLoading(false);
                    return;
                }

                const res = await fetchWithTimeout(
                    `http://localhost:3001/api/getListingForCompare`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({ listingIds }),
                    },
                    10000
                );

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to load listings");
                }

                const listingsData = data.listings || [];
                setListings(listingsData);
                
                // Auto-select common features based on available data
                const availableFeatures = allFeatures.filter(feature => 
                    listingsData.some(listing => {
                        if (feature.key === 'includesUtilities') {
                            return listing.price?.includesUtilities !== undefined;
                        }
                        if (['size', 'bedrooms', 'bathrooms', 'yearBuilt', 'parkingSpaces', 'floors', 'lotSize'].includes(feature.key)) {
                            return listing.details?.[feature.key] !== undefined;
                        }
                        return listing[feature.key] !== undefined;
                    })
                );
                setSelectedFeatures(availableFeatures.map(f => f.key));
            } catch (err) {
                if (err.name === "AbortError") {
                    setError("Request timed out. Please check your connection.");
                } else {
                    setError(err.message || "Something went wrong while fetching listings.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    const removeFromComparison = (listingId) => {
        const updatedListings = listings.filter(listing => listing._id !== listingId);
        setListings(updatedListings);
        
        // Update localStorage
        const stored = localStorage.getItem("compare_listings");
        const listingIds = stored ? JSON.parse(stored) : [];
        const updatedIds = listingIds.filter(id => id !== listingId);
        localStorage.setItem("compare_listings", JSON.stringify(updatedIds));
    };

    const getFeatureValue = (listing, featureKey) => {
        if (featureKey === 'includesUtilities') {
            return listing.price?.includesUtilities;
        }
        if (['size', 'bedrooms', 'bathrooms', 'yearBuilt', 'parkingSpaces', 'floors', 'lotSize'].includes(featureKey)) {
            return listing.details?.[featureKey];
        }
        return listing[featureKey];
    };

    const getCoverImage = (media) => {
        const coverImage = media?.find(m => m.isCover) || media?.[0];
        return coverImage?.url || '/placeholder-property.jpg';
    };
 
    if (loading) {
        return (
            <section className="max-w-[1600px] w-[90%] mx-auto px-4 py-16 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 mb-6 animate-pulse">
                    <Home size={40} className="text-blue-500 fill-blue-500" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Comparing Listings
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Loading your selected properties...
                </p>
                <div className="relative w-10 h-10 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin-smooth"></div>
                </div>
            </section>
        );
    }

    if (error || !listings.length) {
        return (
            <section className="max-w-[1600px] w-[90%] mx-auto text-center py-24">
                {error ? (
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                ) : (
                    <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                )}
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    {error ? "Error Loading Listings" : "No Listings to Compare"}
                </h2>
                <p className="text-gray-600 mb-6">
                    {error
                        ? error
                        : "Add properties to your compare list to see them here."}
                </p>
                <button
                    onClick={() => router.push("/saved")}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
                >
                    Go to Saved Listings
                </button>
            </section>
        );
    }

    return (
      <section className="max-w-[1800px] mx-auto px-4 py-8">
  {/* Header */}
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Compare Properties ({listings.length})
      </h1>
      <p className="text-gray-600">
        Side-by-side comparison of your selected properties
      </p>
    </div>
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={() => router.push("/saved")}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        Back to Saved
      </button>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
      >
        <RefreshCw size={16} />
        Refresh
      </button>
    </div>
  </div>

  {/* Feature Selection */}
  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-8 sticky top-0 z-10">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Compare Features
    </h3>
    <div className="flex  gap-3 overflow-x-auto pb-2">
      {allFeatures.map((feature) => (
        <button
          key={feature.key}
          onClick={() => {
            setSelectedFeatures((prev) =>
              prev.includes(feature.key)
                ? prev.filter((f) => f !== feature.key)
                : [...prev, feature.key]
            );
          }}
          className={`flex-shrink-0 px-4 py-[6px] rounded-[50px] border transition-all whitespace-nowrap ${
            selectedFeatures.includes(feature.key)
              ? "bg-blue-50 border-blue-600 text-blue-700"
              : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
          }`}
        >
          {feature.label}
        </button>
      ))}
    </div>
  </div>

  {/* Comparison Table */}
  <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
    <div
      className="min-w-[600px] grid"
      style={{ gridTemplateColumns: `300px repeat(${listings.length}, minmax(250px, 1fr))` }}
    >
      {/* Feature Column */}
      <div className="border-r border-gray-200 bg-gray-50 p-6">
        <h3 className="font-semibold text-gray-900 text-lg">Features</h3>
      </div>

      {/* Property Headers */}
      {listings.map((listing) => (
        <div
          key={listing._id}
          className="border-r border-gray-200 last:border-r-0 p-6 relative flex flex-col gap-4"
        >
          <button
            onClick={() => removeFromComparison(listing._id)}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={16} className="text-gray-400" />
          </button>

          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 w-full">
            {/* <Image src={getCoverImage(listing.media)} alt={listing.title} width={200} height={200} className="w-full h-full object-cover" /> */}
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 line-clamp-2 mb-1">{listing.title}</h4>
            <div className="flex items-center gap-1 text-gray-600 mb-1 text-sm">
              <MapPin size={14} />
              {listing.location?.city}, {listing.location?.state}
            </div>
            <div className="text-xl font-bold text-blue-600 mb-2">
              ${listing.price?.amount?.toLocaleString()}
            </div>
            <div className="flex gap-4 text-sm text-gray-600 flex-wrap">
              {listing.details?.bedrooms && (
                <span className="flex items-center gap-1">
                  <Bed size={14} /> {listing.details.bedrooms}
                </span>
              )}
              {listing.details?.bathrooms && (
                <span className="flex items-center gap-1">
                  <Bath size={14} /> {listing.details.bathrooms}
                </span>
              )}
              {listing.details?.size && (
                <span className="flex items-center gap-1">
                  <Ruler size={14} /> {listing.details.size.toLocaleString()} sq ft
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Feature Rows */}
    {selectedFeatures.map((featureKey) => {
      const feature = allFeatures.find((f) => f.key === featureKey);
      if (!feature) return null;
      return (
        <div
          key={featureKey}
          className="grid border-t border-gray-200"
          style={{ gridTemplateColumns: `300px repeat(${listings.length}, minmax(250px, 1fr))` }}
        >
          <div className="border-r border-gray-200 bg-gray-50 p-6 flex items-center gap-2">
            {feature.icon && (typeof feature.icon === "string" ? <span>{feature.icon}</span> : <feature.icon size={16} className="text-gray-400" />)}
            <span className="font-medium text-gray-700">{feature.label}</span>
          </div>

          {listings.map((listing) => (
            <div key={`${listing._id}-${featureKey}`} className="border-r border-gray-200 last:border-r-0 p-6">
              <div className="text-gray-900">{feature.format(getFeatureValue(listing, featureKey))}</div>
            </div>
          ))}
        </div>
      );
    })}
  </div>

  {/* Mobile Cards */}
  <div className="lg:hidden mt-8 space-y-6">
    {listings.map((listing) => (
      <div key={listing._id} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-1">{listing.title}</h3>
            <div className="text-xl font-bold text-blue-600">${listing.price?.amount?.toLocaleString()}</div>
          </div>
          <button onClick={() => removeFromComparison(listing._id)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={16} />
          </button>
        </div>

        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 mb-4" />

        <div className="space-y-2">
          {selectedFeatures.map((featureKey) => {
            const feature = allFeatures.find((f) => f.key === featureKey);
            if (!feature) return null;
            return (
              <div key={featureKey} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">{feature.label}:</span>
                <span className="text-gray-900">{feature.format(getFeatureValue(listing, featureKey))}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <button onClick={() => router.push(`/listing/${listing._id}`)} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
            View Details
          </button>
          <button onClick={() => removeFromComparison(listing._id)} className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition font-medium">
            Remove
          </button>
        </div>
      </div>
    ))}
  </div>
</section>

    );
}