import Link from "next/link";
import Image from "next/image";
import WishlistButton from "../../components/WishlistButton";
import { inter } from "@/utils/fonts";
import Sqftsvg from "../../svg/Sqftsvg";
import Bathsvg from "../../svg/Bathsvg";
import BedSvg from "../../svg/BedSvg";
import LocationSvg from "../../svg/LocationSvg";
import { getCoverImage, formatPrice, getLocationString, getPricePeriod } from "@/utils/helpers/listing-helpers";
import { PropertyForTag, PropertyTypeBadge } from "@/app/components/SideComponents/PropertyTags"
import { BLUE_PLACEHOLDER } from "@/utils/blueplaceholder";
import { ModernTag } from "@/app/components/SideComponents/ModernTag";
import { MapPinIcon } from "lucide-react";

const ListingCardResults = ({ listing, isSaved, position }) => {
  // Generate structured data for each listing
  const generateStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ListItem',
      position: position,
      item: {
        '@type': 'RealEstateListing',
        name: listing.title || "Property Listing",
        description: listing.description?.substring(0, 160) || `Property located in ${getLocationString(listing.location)}`,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/properties/${listing._id}`,
        image: getCoverImage(listing.media),
        ...(listing.price && {
          offers: {
            '@type': 'Offer',
            price: listing.price.amount,
            priceCurrency: listing.price.currency || 'USD',
            availability: 'https://schema.org/InStock',
            validFrom: new Date(listing.listedAt || listing.createdAt).toISOString()
          }
        }),
        ...(listing.location && {
          address: {
            '@type': 'PostalAddress',
            streetAddress: listing.location.address,
            addressLocality: listing.location.city,
            addressRegion: listing.location.state,
            postalCode: listing.location.zipCode,
            addressCountry: listing.location.country || 'US'
          }
        }),
        ...(listing.details && {
          numberOfRooms: listing.details.bedrooms,
          numberOfBathroomsTotal: listing.details.bathrooms,
          floorSize: {
            '@type': 'QuantitativeValue',
            value: listing.details.size,
            unitCode: 'FTK' // square feet
          }
        }),
        datePosted: new Date(listing.listedAt || listing.createdAt).toISOString()
      }
    };
    return structuredData;
  };

  // Get property type for schema
  const getPropertyTypeSchema = () => {
    const typeMap = {
      house: 'SingleFamilyResidence',
      apartment: 'Apartment',
      condo: 'ApartmentComplex',
      villa: 'House',
      commercial: 'CommercialProperty',
      land: 'Land'
    };
    return typeMap[listing.propertyType?.subType] || 'RealEstateListing';
  };

  return (
    <article
      className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 w-[100%]"
      itemScope
      itemType="https://schema.org/RealEstateListing"
    >
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }}
      />

      <Link
        href={`/properties/${listing._id}`}
        className="block group"
        itemProp="url"
        aria-label={`View ${listing.title} - ${formatPrice(listing.price)} - ${getLocationString(listing.location)}`}
      >
        {/* Image Section with SEO */}
        <div className="img_box relative h-[250px] overflow-hidden">
          <Image
            src={getCoverImage(listing.media)}
            alt={`${listing.title || 'Property'} in ${getLocationString(listing.location)}`}
            fill
            className="img group-hover:scale-110 transition-transform duration-500 ease-out"
            style={{ objectFit: "cover" }}
            quality={85}
                    sizes="(max-width: 500px) 100vw, (max-width: 768px) 50vw, 25vw"
            placeholder="blur"
            blurDataURL={BLUE_PLACEHOLDER}
            itemProp="image"
            priority={position <= 4} // LCP optimization for first few images
          />

          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-hidden="true"
          />

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
          <WishlistButton listingId={listing._id} isInitiallySaved={isSaved} />
        </div>

        {/* Content Section with Semantic HTML */}
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

          {/* Property Features with Schema */}
          <div className="flex flex-wrap items-center gap-4 py-4 border-t border-gray-100">
            {/* Bedrooms */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg" aria-hidden="true">
                <BedSvg className="text-blue-600" />
              </div>
              <span
                className={`${inter.className} text-[14px] font-medium text-[#2c2c2c]`}
                itemProp="numberOfRooms"
              >
                {listing.details?.bedrooms || 0} Beds
              </span>
            </div>

            {/* Bathrooms */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg" aria-hidden="true">
                <Bathsvg className="text-blue-600" />
              </div>
              <span
                className={`${inter.className} text-[14px] font-medium text-[#2c2c2c]`}
                itemProp="numberOfBathroomsTotal"
              >
                {listing.details?.bathrooms || 0} Bath
              </span>
            </div>

            {/* Square Footage */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg" aria-hidden="true">
                <Sqftsvg className="text-blue-600" />
              </div>
              <span className={`${inter.className} text-[14px] font-medium text-[#2c2c2c]`}>
                <meta itemProp="floorSize" content={`${listing.details?.size || 0} square feet`} />
                {listing.details?.size?.toLocaleString() || 0} Sqft
              </span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs text-gray-500">
            <time
              dateTime={new Date(listing.listedAt || listing.createdAt).toISOString()}
              itemProp="datePosted"
            >
              Listed: {new Date(listing.listedAt || listing.createdAt).toLocaleDateString()}
            </time>
            {listing.views > 0 && (
              <span className="flex items-center gap-1" aria-label={`${listing.views} views`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {listing.views}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ListingCardResults;