import { figtree, inter, outfit } from "@/utils/fonts";
import Image from "next/image";
import Sqftsvg from "../svg/Sqftsvg";
import Bathsvg from "../svg/Bathsvg";
import BedSvg from "../svg/BedSvg";
import LocationSvg from "../svg/LocationSvg";

// ✅ Server Component – fetched directly in SSR
async function getHomeListings() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/results/homepage`, {
            cache: "no-store", // ❗ Prevent caching for dynamic updates
            next: { revalidate: 60 }, // ✅ Revalidate every 60 seconds (optional)
        });

        if (!res.ok) throw new Error("Failed to fetch listings");
        const data = await res.json();
        return data.listings || []; // Ensure array
    } catch (error) {
        console.error("❌ Error fetching homepage listings:", error);
        return [];
    }
}

// Utility function to get cover image or first media
const getCoverImage = (media) => {
    if (!media || media.length === 0) return "/temp_img/listings/list1.jpg";

    const coverImage = media.find(item => item.isCover) || media[0];
    return coverImage.url || "/temp_img/listings/list1.jpg";
};

// Utility function to format price
const formatPrice = (price) => {
    if (!price) return "N/A";

    const amount = price.amount?.toLocaleString() || "0";
    const currency = price.currency === "USD" ? "$" : price.currency || "$";

    return `${currency}${amount}`;
};

// Utility function to get location string
const getLocationString = (location) => {
    if (!location) return "Unknown location";

    const parts = [];
    if (location.neighborhood) parts.push(location.neighborhood);
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);

    return parts.length > 0 ? parts.join(", ") : "Unknown location";
};

// Utility function to get price period
const getPricePeriod = (propertyFor, priceType) => {
    if (propertyFor === "rent") return "/Month";
    if (priceType === "auction") return " (Auction)";
    return "";
};

// Modern Tag Component
const ModernTag = ({ children, variant = "default", className = "" }) => {
    const baseClasses = "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200";

    const variants = {
        default:
            "bg-gray-100/80 text-gray-800 border border-gray-300 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]",

        primary:
            "bg-blue-600/10 text-blue-700 border border-blue-300 shadow-sm hover:bg-blue-600/20 backdrop-blur-sm",

        success:
            "bg-emerald-600/10 text-emerald-700 border border-emerald-300 shadow-sm hover:bg-emerald-600/20 backdrop-blur-sm",

        warning:
            "bg-amber-500/10 text-amber-700 border border-amber-300 shadow-sm hover:bg-amber-500/20 backdrop-blur-sm",

        danger:
            "bg-rose-500/10 text-rose-700 border border-rose-300 shadow-sm hover:bg-rose-500/20 backdrop-blur-sm",

        premium:
            "bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white shadow-md hover:opacity-90",

        featured:
            "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:opacity-90"
    };


    return (
        <span className={`${baseClasses} ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

// Property For Tag Component
const PropertyForTag = ({ propertyFor }) => {
    const getTagConfig = (type) => {
        const config = {
            Sell: { label: "For Sale", variant: "success" },
            Rent: { label: "For Rent", variant: "primary" },
            Lease: { label: "For Lease", variant: "warning" }
        };

        return config[type] || { label: type, variant: "default" };
    };

    const { label, variant } = getTagConfig(propertyFor);

    return (
        <ModernTag variant={variant} className="shadow-sm">
            {label}
        </ModernTag>
    );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
        const config = {
            active: { color: "bg-green-500", label: "Active" },
            draft: { color: "bg-gray-500", label: "Draft" },
            pending: { color: "bg-amber-500", label: "Pending" },
            sold: { color: "bg-red-500", label: "Sold" },
            expired: { color: "bg-gray-400", label: "Expired" },
            archived: { color: "bg-gray-600", label: "Archived" }
        };

        return config[status] || { color: "bg-gray-500", label: status };
    };

    const { color, label } = getStatusConfig(status);

    return (
        <ModernTag variant="default" className="bg-white/90 backdrop-blur-sm border-white/30 shadow-md">
            <span className={`rounded-full h-2 w-2 mr-1.5 ${color}`} />
            {label}
        </ModernTag>
    );
};

// Property Type Badge Component
const PropertyTypeBadge = ({ propertyType }) => {
    const formatPropertyType = (type) => {
        return type?.replace(/-/g, " ")?.replace(/\b\w/g, l => l.toUpperCase()) || "Property";
    };

    return (
        <ModernTag
            variant="default"
            className="bg-blue-50 text-blue-700 border border-blue-200 shadow-sm font-medium tracking-wide px-3 py-1 rounded-full text-[12px]"
        >
            {formatPropertyType(propertyType)}
        </ModernTag>
    );
};


export default async function Homelisting() {
    const listings = await getHomeListings();

    return (
        <div className="bg-[#F0F4FD] HomeListings pt-[50px] pb-[50px] w-[100%]">
            <div className="container flex flex-col gap-[40px]">
                {/* Heading */}
                <div className="heading flex flex-col gap-[0px] max-[500px]:gap-[10px] items-center justify-center w-[100%]">
                    <h2 className="text-[22px] leading-[20px] text-[#1D4ED8] font-[900] tracking-tight">
                        Who we are
                    </h2>
                    <h2
                        className={`${outfit.className} text-[55px] max-w-[90%] mx-auto max-[1300px]:text-[40px] max-[900px]:text-[40px] max-[550px]:text-[30px] max-[500px]:leading-[40px] text-center font-[600] text-[#434343]`}
                    >
                        Property for sell and rent
                    </h2>
                </div>

                {/* Cards */}
                <div className="cards flex gap-5 overflow-x-auto scrollbar-hide pb-4">
                    {listings.length === 0 ? (
                        <div className="text-center text-gray-500 w-full py-20">
                            No listings available
                        </div>
                    ) : (
                        listings.map((listing, index) => (
                            <div
                                key={listing._id || index}
                                className="card min-w-[calc(25%-20px)] rounded-2xl overflow-hidden bg-white shadow-sm  transition-all duration-300 max-[768px]:min-w-[calc(50%-16px)] max-[500px]:min-w-full group"
                            >
                                {/* Image Section */}
                                <div className="img_box relative h-[250px] overflow-hidden">
                                    {/* 
                  <Image
                    src={getCoverImage(listing.media)}
                    alt={listing.title || "Property Listing"}
                    fill
                    className="img group-hover:scale-110 transition-transform duration-500 ease-out"
                    style={{ objectFit: "cover" }}
                    quality={85}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    priority={index < 3}
                  />
                  */}

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

                                {/* Content Section */}
                                <div className="content bg-white p-6 pt-4">
                                    <div className="flex items-center mb-4">
                                        <PropertyTypeBadge
                                            propertyType={listing.propertyType?.subType}
                                        />
                                    </div>


                                    {/* Location */}
                                    <p
                                        className={`text-[14px] text-[#2c2c2c] mb-3 flex items-center gap-2 ${inter.className}`}
                                    >
                                        <LocationSvg className="text-blue-600" />
                                        {getLocationString(listing.location)}
                                    </p>

                                    {/* Title */}
                                    <h3
                                        className={`${inter.className} mb-3 text-[18px] font-[700] text-[#1a1a1a] line-clamp-2 min-h-[56px] group-hover:text-blue-700 transition-colors duration-200`}
                                    >
                                        {listing.title || "No Title"}
                                    </h3>

                                    {/* Price */}
                                    <h3
                                        className={`${inter.className} mb-4 text-[22px] font-[700] text-[#1D4ED8] max-[300px]:text-[18px]`}
                                    >
                                        {formatPrice(listing.price)}
                                        <span className="text-[14px] font-[600] text-[#2c2c2c] ml-1">
                                            {getPricePeriod(listing.propertyFor, listing.price?.priceType)}
                                        </span>
                                    </h3>

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
                                        <span>Listed: {new Date(listing.listedAt).toLocaleDateString()}</span>
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
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}