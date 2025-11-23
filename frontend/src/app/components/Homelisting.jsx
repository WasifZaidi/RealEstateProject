import { figtree, inter, outfit } from "@/utils/fonts";
import Image from "next/image";
import Sqftsvg from "../svg/Sqftsvg";
import Bathsvg from "../svg/Bathsvg";
import BedSvg from "../svg/BedSvg";
import LocationSvg from "../svg/LocationSvg";
import { getCoverImage, formatPrice, getLocationString, getPricePeriod } from "@/utils/helpers/listing-helpers";
import { PropertyForTag, PropertyTypeBadge } from "@/app/components/SideComponents/PropertyTags"
import { BLUE_PLACEHOLDER } from "@/utils/blueplaceholder";
import { ModernTag } from "@/app/components/SideComponents/ModernTag";
import { MapPinIcon } from "lucide-react";

// ✅ Enhanced fetch with proper error handling and caching strategy
async function getHomeListings() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/results/homepage`, {
            next: {
                revalidate: 300,
                tags: ['homepage-listings']
            },
            headers: {
                'Content-Type': 'application/json',
            },
            // ✅ Add timeout for better reliability
            signal: AbortSignal.timeout(10000)
        });

        if (!res.ok) {
            // ✅ More specific error handling
            if (res.status === 404) {
                console.warn('Listings endpoint not found');
                return [];
            }
            if (res.status >= 500) {
                console.error('Server error fetching listings');
                return [];
            }
            throw new Error(`Failed to fetch listings: ${res.status}`);
        }

        const data = await res.json();
        return data.listings || [];
    } catch (error) {
        console.error("❌ Error fetching homepage listings:", error);
        // ✅ Return empty array with fallback
        return [];
    }
}

// ✅ Generate structured data for the entire section
function generateStructuredData(listings) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourapp.com';

    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Featured Property Listings for Sale and Rent',
        description: 'Browse our curated selection of premium properties available for sale and rent across various locations.',
        numberOfItems: listings.length,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${baseUrl}/`
        },
        itemListElement: listings.map((listing, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'RealEstateListing',
                '@id': `${baseUrl}/properties/${listing._id}`,
                url: `${baseUrl}/properties/${listing._id}`,
                name: listing.title,
                description: listing.description?.substring(0, 160) || `Property located in ${getLocationString(listing.location)}`,
                image: getCoverImage(listing.media),
                ...(listing.price && {
                    offers: {
                        '@type': 'Offer',
                        price: listing.price.amount,
                        priceCurrency: listing.price.currency || 'USD',
                        availability: 'https://schema.org/InStock',
                        validFrom: new Date(listing.listedAt).toISOString(),
                        ...(listing.propertyFor === 'rent' && {
                            category: 'rental'
                        })
                    }
                }),
                ...(listing.location && {
                    location: {
                        '@type': 'Place',
                        address: {
                            '@type': 'PostalAddress',
                            addressLocality: listing.location.city,
                            addressRegion: listing.location.state,
                            addressCountry: 'US'
                        }
                    }
                }),
                ...(listing.details && {
                    numberOfRooms: listing.details.bedrooms,
                    numberOfBathroomsTotal: listing.details.bathrooms,
                    floorSize: {
                        '@type': 'QuantitativeValue',
                        value: listing.details.size,
                        unitCode: 'SQFT'
                    }
                })
            }
        }))
    };
}

// ✅ Generate meta description based on listings
function generateMetaDescription(listings) {
    if (listings.length === 0) {
        return "Browse our property listings for sale and rent. Find your perfect home with our extensive collection of verified properties.";
    }

    const forSale = listings.filter(l => l.propertyFor === 'sell').length;
    const forRent = listings.filter(l => l.propertyFor === 'rent').length;
    const locations = [...new Set(listings.map(listing => listing.location?.city).filter(Boolean))];

    let description = `Discover ${listings.length}+ verified properties`;

    if (forSale > 0 && forRent > 0) {
        description += ` (${forSale} for sale, ${forRent} for rent)`;
    } else if (forSale > 0) {
        description += ` for sale`;
    } else if (forRent > 0) {
        description += ` for rent`;
    }

    if (locations.length > 0) {
        description += ` in ${locations.slice(0, 3).join(', ')}${locations.length > 3 ? ' and more' : ''}`;
    }

    description += `. Browse homes with detailed information, photos, and expert insights.`;

    return description;
}

function generateRealEstateOrganizationSchema() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://realestatepro.com';

    return {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        '@id': `${baseUrl}/#realestateagent`,
        name: 'RealEstatePro',
        description: 'Premium real estate platform featuring properties for sale and rent',
        url: baseUrl,
        knowsAbout: ['Real Estate', 'Property Listings', 'Home Buying', 'Rental Properties']
    };
}


// ✅ Single Listing Card Component for better reusability and semantics
function ListingCard({ listing, index }) {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/properties/${listing._id}`,
        name: listing.title,
        description: listing.description?.substring(0, 160),
        image: getCoverImage(listing.media),
        ...(listing.price && {
            offers: {
                '@type': 'Offer',
                price: listing.price.amount,
                priceCurrency: listing.price.currency || 'USD',
                availability: 'https://schema.org/InStock'
            }
        })
    };

    return (
        <article
            className="card cursor-pointer min-w-[calc(25%-20px)] rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300 max-[768px]:min-w-[calc(50%-16px)] max-[500px]:min-w-full group"
            itemScope
            itemType="https://schema.org/RealEstateListing"
            itemID={`${process.env.NEXT_PUBLIC_SITE_URL}/properties/${listing._id}`}
        >
            {/* Structured data for individual listing */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />


            {/* Image Section with semantic markup */}
            <div className="img_box relative h-[250px] overflow-hidden">
                <Image
                    src={getCoverImage(listing.media)}
                    alt={`${listing.title} in ${getLocationString(listing.location)} - ${formatPrice(listing.price)} ${listing.propertyFor === 'rent' ? 'for rent' : 'for sale'}`}
                    fill
                    className="img group-hover:scale-110 transition-transform duration-500 ease-out"
                    style={{ objectFit: "cover" }}
                    quality={85}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    priority={index < 4} // ✅ Optimize LCP for first 4 images
                    placeholder="blur"
                    blurDataURL={BLUE_PLACEHOLDER}
                    itemProp="image"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Top Badges Container */}
                <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                    <PropertyForTag propertyFor={listing.propertyFor || "Sell"} />
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
            </div>

            {/* Content Section with semantic markup */}
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

                {/* Property Features with semantic markup */}
                <div className="flex flex-wrap items-center gap-4 py-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-[50px]">
                            <BedSvg />
                        </div>
                        <span className={`${inter.className} text-[14px] font-medium text-[#2c2c2c]`}>
                            <span itemProp="numberOfRooms">{listing.details?.bedrooms || 0}</span> Beds
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50  rounded-[50px]">
                            <Bathsvg />
                        </div>
                        <span className={`${inter.className} text-[14px] font-medium text-[#2c2c2c]`}>
                            <span itemProp="numberOfBathroomsTotal">{listing.details?.bathrooms || 0}</span> Bath
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-[50px]">
                            <Sqftsvg />
                        </div>
                        <span className={`${inter.className} text-[14px] font-medium text-[#2c2c2c]`}>
                            <span itemProp="floorSize" itemScope itemType="https://schema.org/QuantitativeValue">
                                <span itemProp="value">{listing.details?.size?.toLocaleString() || 0}</span>
                                <meta itemProp="unitCode" content="SQFT" />
                            </span> Sqft
                        </span>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs text-gray-500">
                    <time itemProp="datePosted" dateTime={new Date(listing.listedAt).toISOString()}>
                        Listed: {new Date(listing.listedAt).toLocaleDateString()}
                    </time>
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
        </article>
    );
}

export default async function Homelisting() {
    const listings = await getHomeListings();
    const structuredData = generateStructuredData(listings);
    const metaDescription = generateMetaDescription(listings);
    const realEstateSchema = generateRealEstateOrganizationSchema();


    return (
        <>
            {/* Structured Data for Search Engines */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateSchema) }}
            />

            {/* Schema.org BreadcrumbList */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            {
                                '@type': 'ListItem',
                                position: 1,
                                name: 'Home',
                                item: process.env.NEXT_PUBLIC_SITE_URL
                            },
                            {
                                '@type': 'ListItem',
                                position: 2,
                                name: 'Property Listings',
                                item: `${process.env.NEXT_PUBLIC_SITE_URL}/listings`
                            }
                        ]
                    })
                }}
            />

            <section
                className="bg-[#F0F4FD] HomeListings pt-[50px] pb-[50px] w-[100%]"
                aria-labelledby="featured-properties-heading"
            >
                <div className="container flex flex-col gap-[40px]">
                    {/* Heading with proper semantic structure */}
                    <header className="heading flex flex-col gap-[0px] max-[500px]:gap-[10px] items-center justify-center w-[100%]">
                        <p className="text-[22px] leading-[20px] text-[#1D4ED8] font-[900] tracking-tight">
                            Who we are
                        </p>
                        <h2
                            id="featured-properties-heading"
                            className={`${outfit.className} text-[55px] max-w-[90%] mx-auto max-[1300px]:text-[40px] max-[900px]:text-[40px] max-[550px]:text-[30px] max-[500px]:leading-[40px] text-center font-[600] text-[#434343]`}
                        >
                            Property for sell and rent
                        </h2>
                        {/* Hidden meta description for screen readers */}
                        <p className="sr-only">
                            {metaDescription}
                        </p>
                    </header>

                    {/* Listings with semantic role and aria attributes */}
                    <div
                        className="cards flex gap-5 overflow-x-auto scrollbar-hide pb-4"
                        role="list"
                        aria-label="Featured property listings"
                    >
                        {listings.length === 0 ? (
                            <div
                                className="text-center text-gray-500 w-full py-20"
                                role="status"
                                aria-live="polite"
                            >
                                No listings available at the moment. Please check back later.
                            </div>
                        ) : (
                            listings.map((listing, index) => (
                                <ListingCard
                                    key={listing._id || index}
                                    listing={listing}
                                    index={index}
                                />
                            ))
                        )}
                    </div>

                    {/* Hidden accessibility improvements */}
                    <div className="sr-only">
                        <h3>Property Search Features</h3>
                        <ul>
                            <li>Filter properties by type, price, and location</li>
                            <li>View detailed property information</li>
                            <li>Contact agents directly</li>
                            <li>Save favorite properties</li>
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );
}