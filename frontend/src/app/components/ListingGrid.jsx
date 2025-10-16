"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import WishlistButton from "./WishlistButton";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const ListingsGrid = ({ listings, pagination, searchParams, hasError }) => {
  if (hasError) return null;

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🏠</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No properties found
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Try adjusting your filters or search criteria to find more properties.
        </p>
        <Link
          href="/results"
          className="inline-flex px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Clear All Filters
        </Link>
      </div>
    );
  }

  // Generate URL for Next.js Link
  const generatePageUrl = (page) => {
    const params = new URLSearchParams(
      typeof searchParams === "string"
        ? searchParams
        : Object.fromEntries(searchParams?.entries?.() || [])
    );
    params.set("page", page);
    return `/results?${params.toString()}`;
  };

  return (
    <>
      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>

      {/* MUI Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center border-t border-gray-200 pt-6">
          <Stack spacing={2}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              variant="outlined"
              color="primary"
              showFirstButton
              showLastButton
              onChange={(e, value) => {
                window.location.href = generatePageUrl(value);
              }}
            />
          </Stack>
        </div>
      )}
    </>
  );
};

const ListingCard = ({ listing }) => {
  const getPropertyTypeInfo = (type) => {
    const types = {
      apartment: { label: "Apartment", color: "text-[#1D4ED8]" },
      house: { label: "House", color: "text-[#059669]" },
      condo: { label: "Condo", color: "text-[#DC2626]" },
      townhouse: { label: "Townhouse", color: "text-[#7C3AED]" },
      commercial: { label: "Commercial", color: "text-[#EA580C]" },
    };
    return types[type] || { label: "Property", color: "text-[#1D4ED8]" };
  };

  const propertyTypeInfo = getPropertyTypeInfo(listing.propertyType);

  const getListingTypeStyle = (type) =>
    type === "rent"
      ? "bg-gradient-to-r from-[#059669]/80 to-[#10B981]/80"
      : "bg-gradient-to-r from-[#1D4ED8]/80 to-[#3B82F6]/80";

  return (
    <div className="card group rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300">
      <Link href={`/details/${listing._id}`}>
        <div className="img_box relative h-48 sm:h-52 md:h-56 overflow-hidden">
          {!listing.media && !listing.media[0] ? (
            <Image
              src={listing.media[0].url}
              alt={listing.title || "Property image"}
              fill
              className="img object-cover group-hover:scale-105 transition-transform duration-300"
              quality={85}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaUMkQ0sNdgjb2RWHLISHRmkjUOxUgwHQ2HffQWCbWf/9k="
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              <span className="text-4xl text-blue-300">🏠</span>
            </div>
          )}

          <WishlistButton listingId={listing._id} isInitiallySaved={listing.isSaved} />

          {/* Listing Type Badge */}
          <span
            className={`absolute flex items-center gap-2 right-4 top-4 text-xs font-semibold text-white px-3 py-2 rounded-[50px] backdrop-blur-sm border border-white/30 transition-all duration-200 hover:backdrop-blur-md ${getListingTypeStyle(
              listing.listingType
            )}`}
          >
            <span className="rounded-full h-2 w-2 bg-white/80"></span>
            {listing.listingType === "rent" ? "For Rent" : "For Sale"}
          </span>

          {/* Image Count Badge */}
          {listing.images && listing.images.length > 1 && (
            <span className="absolute left-4 top-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              📸 {listing.images.length}
            </span>
          )}
        </div>

        <div className="content bg-white p-5">
          <span
            className={`text-sm font-bold ${propertyTypeInfo.color} uppercase tracking-wide`}
          >
            {propertyTypeInfo.label}
          </span>

          <h3 className="font-bold text-gray-900 text-lg mt-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {listing.title || "No Title"}
          </h3>

          <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
            <LocationIcon />
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
              <BedIcon />
              <span className="text-sm text-gray-700 font-medium">
                {listing.details?.bedrooms || 0} Beds
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BathIcon />
              <span className="text-sm text-gray-700 font-medium">
                {listing.details?.bathrooms || 0} Bath
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AreaIcon />
              <span className="text-sm text-gray-700 font-medium">
                {listing.details?.size?.toLocaleString() || 0} Sqft
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {listing.isFeatured && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                  Featured
                </span>
              )}
              {listing.isPremium && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                  Premium
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {listing.listedAt
                ? new Date(listing.listedAt).toLocaleDateString()
                : "Recently"}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

// Icons
const LocationIcon = () => (
  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
      clipRule="evenodd"
    />
  </svg>
);
const BedIcon = () => (
  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0l-4-4M4 12l4-4" />
  </svg>
);
const BathIcon = () => (
  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const AreaIcon = () => (
  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
  </svg>
);

export default ListingsGrid;
