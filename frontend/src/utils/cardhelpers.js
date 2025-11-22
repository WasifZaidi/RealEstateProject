export const getCoverImage = (media) => {
  if (!media || media.length === 0) return "/temp_img/listings/list1.jpg";
  const coverImage = media.find(item => item.isCover) || media[0];
  return coverImage.url || "/temp_img/listings/list1.jpg";
};

export const formatPrice = (price) => {
  if (!price) return "N/A";
  const amount = price.amount?.toLocaleString() || "0";
  const currency = price.currency === "USD" ? "$" : price.currency || "$";
  return `${currency}${amount}`;
};

export const getLocationString = (location) => {
  if (!location) return "Unknown location";
  const parts = [];
  if (location.neighborhood) parts.push(location.neighborhood);
  if (location.city) parts.push(location.city);
  if (location.state) parts.push(location.state);
  return parts.length > 0 ? parts.join(", ") : "Unknown location";
};

export const getPricePeriod = (propertyFor, priceType) => {
  if (propertyFor === "rent") return "/Month";
  if (priceType === "auction") return " (Auction)";
  return "";
};

// Modern Tag Component (same as original)
export const ModernTag = ({ children, variant = "default", className = "" }) => {
  const baseClasses = "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200";

  const variants = {
    default:
      "bg-gray-100/80 text-gray-800 border border-gray-300 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]",
    primary:
      "bg-blue-600/10 text-blue-700 border border-blue-300 shadow-sm hover:bg-blue-600/20 backdrop-blur-sm",
    success:
      "bg-emerald-600 text-emerald-100 border border-emerald-300 shadow-sm hover:bg-emerald-600/20 backdrop-blur-sm",
    warning:
      "bg-amber-500/10 text-amber-100 border border-amber-300 shadow-sm hover:bg-amber-500/20 backdrop-blur-sm",
    danger:
      "bg-rose-500/10 text-rose-200 border border-rose-300 shadow-sm hover:bg-rose-500/20 backdrop-blur-sm",
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

// Property For Tag Component (same as original)
export const PropertyForTag = ({ propertyFor, listingType }) => {
  const type = propertyFor || listingType;
  
  const getTagConfig = (type) => {
    const config = {
      Sell: { label: "For Sale", variant: "success" },
      sale: { label: "For Sale", variant: "success" },
      Rent: { label: "For Rent", variant: "primary" },
      rent: { label: "For Rent", variant: "primary" },
      Lease: { label: "For Lease", variant: "warning" },
      lease: { label: "For Lease", variant: "warning" }
    };

    return config[type] || { label: type, variant: "default" };
  };

  const { label, variant } = getTagConfig(type);

  return (
    <ModernTag variant={variant} className="shadow-sm">
      {label}
    </ModernTag>
  );
};

// Property Type Badge Component (same as original)
export const PropertyTypeBadge = ({ propertyType }) => {
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