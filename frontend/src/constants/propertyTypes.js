// constants/propertyTypes.js
const PROPERTY_TYPES = {
  RESIDENTIAL: {
    id: "residential",
    label: "Residential",
    icon: "FaHome",
    color: "blue",
    subtypes: [
      { 
        id: "single_family", 
        label: "Single Family Home", 
        searchKeywords: ["house", "home", "single family", "detached"],
        popular: true 
      },
      { 
        id: "apartment", 
        label: "Apartment", 
        searchKeywords: ["apartment", "flat", "condo", "unit"],
        popular: true 
      },
      { 
        id: "condo", 
        label: "Condo", 
        searchKeywords: ["condo", "condominium", "apartment"],
        popular: true 
      },
      { 
        id: "townhouse", 
        label: "Townhouse", 
        searchKeywords: ["townhouse", "town home", "row house"] 
      },
      { 
        id: "multi_family", 
        label: "Multi-Family", 
        searchKeywords: ["multi family", "duplex", "triplex", "quadplex"] 
      },
      { 
        id: "villa", 
        label: "Villa", 
        searchKeywords: ["villa", "luxury", "mansion"] 
      },
      { 
        id: "farmhouse", 
        label: "Farmhouse", 
        searchKeywords: ["farmhouse", "ranch", "country home"] 
      }
    ]
  },
  COMMERCIAL: {
    id: "commercial",
    label: "Commercial",
    icon: "FaBuilding",
    color: "purple",
    subtypes: [
      { id: "office", label: "Office Space", searchKeywords: ["office", "commercial", "workspace"] },
      { id: "retail", label: "Retail", searchKeywords: ["retail", "store", "shop", "mall"] },
      { id: "industrial", label: "Industrial", searchKeywords: ["industrial", "warehouse", "factory"] },
      { id: "hotel", label: "Hotel", searchKeywords: ["hotel", "motel", "hospitality"] },
      { id: "mixed_use", label: "Mixed Use", searchKeywords: ["mixed use", "commercial residential"] }
    ]
  },
  LAND: {
    id: "land",
    label: "Land",
    icon: "FaMapMarkerAlt",
    color: "green",
    subtypes: [
      { id: "residential_plot", label: "Residential Plot", searchKeywords: ["residential plot", "lot", "land"] },
      { id: "commercial_plot", label: "Commercial Plot", searchKeywords: ["commercial plot", "business lot"] },
      { id: "agricultural", label: "Agricultural", searchKeywords: ["farm", "agricultural", "agriculture"] },
      { id: "industrial_plot", label: "Industrial Plot", searchKeywords: ["industrial plot", "factory land"] }
    ]
  },
  RENTAL: {
    id: "rental",
    label: "Rental",
    icon: "FaKey",
    color: "orange",
    subtypes: [
      { id: "apartment_rental", label: "Apartment for Rent", searchKeywords: ["apartment rent", "rental"] },
      { id: "house_rental", label: "House for Rent", searchKeywords: ["house rent", "home rental"] },
      { id: "vacation_rental", label: "Vacation Rental", searchKeywords: ["vacation", "short term", "airbnb"] }
    ]
  }
};

// Popular property types for quick filters (like realtor.com)
const POPULAR_PROPERTY_TYPES = [
  "single_family",
  "apartment", 
  "condo",
  "townhouse",
  "multi_family"
];

module.exports = { PROPERTY_TYPES, POPULAR_PROPERTY_TYPES };