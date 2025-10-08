"use client";
import Link from "next/link";
import Image from "next/image";
import { BedIcon, BathIcon, MapPin, Square, Scale, Check } from "lucide-react";
import WishlistButton from "../components/WishlistButton";
import { getListingTypeStyle, getPropertyTypeInfo } from "../../utils/helpers/listCardHelpers";

const ListingCard = ({ listing, selectedForCompare, setSelectedForCompare }) => {
  const propertyTypeInfo = getPropertyTypeInfo(listing.propertyType?.subType);

  const isSelected = selectedForCompare.includes(listing._id);

  const handleCompareClick = (e) => {
    e.preventDefault(); // Prevent triggering Link navigation
    e.stopPropagation();

    setSelectedForCompare((prev) =>
      prev.includes(listing._id)
        ? prev.filter((id) => id !== listing._id)
        : [...prev, listing._id]
    );
  };

  return (
    <div className="relative group rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300">
      <Link href={`/properties/${listing._id}`}>
        {/* Image Section */}
        <div className="img_box relative h-48 sm:h-52 md:h-56 overflow-hidden">
          {!listing.media && !listing.media[0] ? (
            <Image
              src={listing.media[0].url}
              alt={listing.title || "Property image"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              quality={85}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              <span className="text-4xl text-blue-300">🏠</span>
            </div>
          )}

          {/* Wishlist */}
          <WishlistButton listingId={listing._id} isInitiallySaved={true} />

          {/* Type Badge */}
          <span
            className={`absolute flex items-center gap-2 right-4 top-4 text-xs font-semibold text-white px-3 py-2 rounded-full backdrop-blur-sm border border-white/30 transition-all duration-200 ${getListingTypeStyle(listing.listingType)}`}
          >
            <span className="rounded-full h-2 w-2 bg-white/80"></span>
            {listing.listingType === "rent" ? "For Rent" : "For Sale"}
          </span>
        </div>

        {/* Content Section */}
        <div className="content bg-white p-5">
          <span
            className={`text-sm font-bold ${propertyTypeInfo.color} uppercase tracking-wide`}
          >
            {propertyTypeInfo.label}
          </span>

          <h3 className="font-bold text-gray-900 text-lg mt-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {listing.title || "Untitled Property"}
          </h3>

          <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
            <MapPin size={14} />
            <span className="line-clamp-1">
              {listing.location?.neighborhood && `${listing.location.neighborhood}, `}
              {listing.location?.city}, {listing.location?.state}
            </span>
          </p>

          <h3 className="mt-4 text-xl font-bold text-blue-600">
            ${listing.price?.amount?.toLocaleString() || "0"}
            {listing.listingType === "rent" && (
              <span className="text-sm font-semibold text-gray-700 ml-1">/Month</span>
            )}
          </h3>

          <div className="flex mt-4 flex-wrap items-center gap-4 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2">
              <BedIcon size={16} />
              <span className="text-sm text-gray-700 font-medium">
                {listing.details?.bedrooms || 0} Beds
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BathIcon size={16} />
              <span className="text-sm text-gray-700 font-medium">
                {listing.details?.bathrooms || 0} Bath
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Square size={16} />
              <span className="text-sm text-gray-700 font-medium">
                {listing.details?.size?.toLocaleString() || "0"} Sqft
              </span>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {listing.isFeatured && (
                <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                  Featured
                </span>
              )}
              {listing.isPremium && (
                <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                  Premium
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {listing.listedAt ? new Date(listing.listedAt).toLocaleDateString() : "Recently"}
            </div>
          </div>
        </div>
      </Link>

      {/* 🧩 Compare Button */}
      <button
        onClick={handleCompareClick}
        className={`absolute bottom-4 right-4 flex items-center gap-2 px-3.5 py-2.5 text-sm font-semibold rounded-[50px] transition-all duration-300 shadow-md ${
          isSelected
            ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
            : "bg-gradient-to-br from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800"
        }`}
      >
        {isSelected ? (
          <>
            <Check size={16} />
            Added
          </>
        ) : (
          <>
            <Scale size={16} />
            Compare
          </>
        )}
      </button>
    </div>
  );
};

export default ListingCard;
