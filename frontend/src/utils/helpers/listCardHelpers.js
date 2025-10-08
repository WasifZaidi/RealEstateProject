export function getListingTypeStyle(type) {
  switch (type) {
    case "rent":
      return "bg-blue-600/80";
    case "sale":
      return "bg-green-600/80";
    default:
      return "bg-gray-600/80";
  }
}

export function getPropertyTypeInfo(subType) {
  const map = {
    apartment: { label: "Apartment", color: "text-blue-600" },
    house: { label: "House", color: "text-green-600" },
    condo: { label: "Condo", color: "text-purple-600" },
  };
  return map[subType?.toLowerCase()] || { label: "Property", color: "text-gray-600" };
}
