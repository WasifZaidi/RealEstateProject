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