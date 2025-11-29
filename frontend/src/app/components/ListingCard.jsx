"use client";
import Link from "next/link";
import Image from "next/image";
import { Check, MapPinIcon, Scale } from "lucide-react";
import WishlistButton from "../components/WishlistButton";
import { inter } from "@/utils/fonts";
import Sqftsvg from "../svg/Sqftsvg";
import Bathsvg from "../svg/Bathsvg";
import BedSvg from "../svg/BedSvg";
import LocationSvg from "../svg/LocationSvg";
import { getCoverImage, formatPrice, getLocationString, getPricePeriod } from "@/utils/helpers/listing-helpers";
import { PropertyForTag, PropertyTypeBadge } from "@/app/components/SideComponents/PropertyTags"
import { BLUE_PLACEHOLDER } from "@/utils/blueplaceholder";
import { ModernTag } from "@/app/components/SideComponents/ModernTag";


const ListingCard = ({ listing, selectedForCompare, setSelectedForCompare }) => {
  const isSelected = selectedForCompare.includes(listing._id);

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedForCompare((prev) =>
      prev.includes(listing._id)
        ? prev.filter((id) => id !== listing._id)
        : [...prev, listing._id]
    );
  };

  return (
    <div className="relative group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300 max-w-[400px] mx-auto">
      <Link href={`/properties/${listing._id}`}>
        {/* Image Section - Same as Homelisting */}
        <div className="img_box relative h-[250px] overflow-hidden">
          <Image
            src={getCoverImage(listing.media)}
            alt={listing.title || "Property Listing"}
            fill
            className="img group-hover:scale-110 transition-transform duration-500 ease-out"
            style={{ objectFit: "cover" }}
            quality={85}
                   sizes="(max-width: 500px) 100vw, (max-width: 768px) 50vw, 25vw"
            placeholder="blur"
            blurDataURL={BLUE_PLACEHOLDER}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Top Badges Container */}
          <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
            <PropertyForTag 
              propertyFor={listing.propertyFor} 
              listingType={listing.listingType} 
            />
            {listing.isFeatured && (
              <ModernTag variant="featured" className="shadow-lg">
                Featured
              </ModernTag>
            )}
            {listing.isPremium && (
              <ModernTag variant="premium" className="shadow-lg">
                Premium
              </ModernTag>
            )}
          </div>

          {/* Wishlist Button */}
                 <WishlistButton listingId={listing._id} isInitiallySaved={true} />
        </div>

        {/* Content Section - Same as Homelisting */}
        <div className="content bg-white p-6 pt-4">
                         <div className="flex items-center mb-4">
                    <PropertyTypeBadge
                        propertyType={listing.propertyType?.subType}
                    />
                </div>

                {/* Location with semantic markup */}
                <p className={`text-[14px] text-[#2c2c2c] flex items-start gap-2 ${inter.className}`}>
                    <MapPinIcon className="text-blue-600 w-5 h-5" />
                    <span itemProp="location" itemScope itemType="https://schema.org/Place">
                        <span className="" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                            <span itemProp="addressLocality">{listing.location?.city}</span>
                            {listing.location?.state && <span>, <span itemProp="addressRegion">{listing.location.state}</span></span>}
                        </span>
                    </span>
                </p>

                {/* Title with h3 for proper heading hierarchy */}
                <div className="mt-[30px]">
                    <h3 className={`${inter.className} mb-3 text-[18px] font-[700] text-[#1a1a1a] line-clamp-2  group-hover:text-blue-700 transition-colors duration-200`}>
                        <span itemProp="name">{listing.title || "No Title"}</span>
                    </h3>

                    {/* Price with semantic markup */}
                    <div className={`${inter.className} mb-4 text-[22px] font-[700] text-[#1D4ED8] max-[300px]:text-[18px]`}>
                        <span itemProp="offers" itemScope itemType="https://schema.org/Offer">
                            <span itemProp="price" content={listing.price?.amount}>
                                {formatPrice(listing.price)}
                            </span>
                            <meta itemProp="priceCurrency" content={listing.price?.currency || 'USD'} />
                            <span className="text-[14px] font-[600] text-[#2c2c2c] ml-1">
                                {getPricePeriod(listing.propertyFor, listing.price?.priceType)}
                            </span>
                        </span>
                    </div>
                </div>

          {/* Property Features */}
          <div className="flex flex-wrap items-center gap-4 py-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BedSvg className="text-blue-600" />
              </div>
              <span className={`${inter.className} text-[14px] font-medium text-[#2c2c2c]`}>
                {listing.details?.bedrooms || 0} Beds
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Bathsvg className="text-blue-600" />
              </div>
              <span className={`${inter.className} text-[14px] font-medium text-[#2c2c2c]`}>
                {listing.details?.bathrooms || 0} Bath
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Sqftsvg className="text-blue-600" />
              </div>
              <span className={`${inter.className} text-[14px] font-medium text-[#2c2c2c]`}>
                {listing.details?.size?.toLocaleString() || 0} Sqft
              </span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs text-gray-500">
            <span>Listed: {new Date(listing.listedAt || listing.createdAt).toLocaleDateString()}</span>
            {listing.views > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {listing.views}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Compare Button - Your additional functionality */}
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