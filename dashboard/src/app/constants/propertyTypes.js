import { 
  FaBuilding, 
  FaHome, 
  FaCity, 
  FaStore, 
  FaShoppingCart, 
  FaHotel, 
  FaUtensils, 
  FaWarehouse, 
  FaUsers, 
  FaClinicMedical, 
  FaIndustry, 
  FaTruck, 
  FaSnowflake, 
  FaFlask, 
  FaBolt, 
  FaMapMarkerAlt, 
  FaTree, 
  FaTractor 
} from 'react-icons/fa';

// Property Categories Enum
export const PROPERTY_CATEGORIES = {
  RESIDENTIAL: 'Residential',
  COMMERCIAL: 'Commercial',
  INDUSTRIAL: 'Industrial',
  PLOT: 'Plot'
};

// Property Types Configuration
export const PROPERTY_TYPES = {
  [PROPERTY_CATEGORIES.RESIDENTIAL]: [
    { 
      id: "apartment", 
      label: "Apartment", 
      category: PROPERTY_CATEGORIES.RESIDENTIAL, 
      icon: FaBuilding, 
      color: "blue",
      description: "Multi-unit residential building"
    },
    { 
      id: "house", 
      label: "Single Family Home", 
      category: PROPERTY_CATEGORIES.RESIDENTIAL, 
      icon: FaHome, 
      color: "blue",
      description: "Detached residential property"
    },
    { 
      id: "villa", 
      label: "Villa", 
      category: PROPERTY_CATEGORIES.RESIDENTIAL, 
      icon: FaCity, 
      color: "blue",
      description: "Luxury standalone residence"
    },
    { 
      id: "condo", 
      label: "Condominium", 
      category: PROPERTY_CATEGORIES.RESIDENTIAL, 
      icon: FaBuilding, 
      color: "blue",
      description: "Individually owned unit in a complex"
    },
    { 
      id: "townhouse", 
      label: "Townhouse", 
      category: PROPERTY_CATEGORIES.RESIDENTIAL, 
      icon: FaHome, 
      color: "blue",
      description: "Multi-floor attached home"
    },
    { 
      id: "duplex", 
      label: "Duplex", 
      category: PROPERTY_CATEGORIES.RESIDENTIAL, 
      icon: FaHome, 
      color: "blue",
      description: "Two separate units in one building"
    },
    { 
      id: "penthouse", 
      label: "Penthouse", 
      category: PROPERTY_CATEGORIES.RESIDENTIAL, 
      icon: FaBuilding, 
      color: "blue",
      description: "Luxury top-floor apartment"
    }
  ],
  
  [PROPERTY_CATEGORIES.COMMERCIAL]: [
    { 
      id: "office-space", 
      label: "Office Space", 
      category: PROPERTY_CATEGORIES.COMMERCIAL, 
      icon: FaBuilding, 
      color: "purple",
      description: "Commercial office premises"
    },
    { 
      id: "retail-store", 
      label: "Retail Store", 
      category: PROPERTY_CATEGORIES.COMMERCIAL, 
      icon: FaStore, 
      color: "purple",
      description: "Shop or retail establishment"
    },
    { 
      id: "shopping-mall", 
      label: "Shopping Mall", 
      category: PROPERTY_CATEGORIES.COMMERCIAL, 
      icon: FaShoppingCart, 
      color: "purple",
      description: "Large retail complex with multiple stores"
    },
    { 
      id: "hotel", 
      label: "Hotel", 
      category: PROPERTY_CATEGORIES.COMMERCIAL, 
      icon: FaHotel, 
      color: "purple",
      description: "Hospitality accommodation property"
    },
    { 
      id: "restaurant", 
      label: "Restaurant", 
      category: PROPERTY_CATEGORIES.COMMERCIAL, 
      icon: FaUtensils, 
      color: "purple",
      description: "Food service establishment"
    },
    { 
      id: "warehouse", 
      label: "Warehouse", 
      category: PROPERTY_CATEGORIES.COMMERCIAL, 
      icon: FaWarehouse, 
      color: "purple",
      description: "Storage and distribution facility"
    },
    { 
      id: "co-working", 
      label: "Co-working Space", 
      category: PROPERTY_CATEGORIES.COMMERCIAL, 
      icon: FaUsers, 
      color: "purple",
      description: "Shared office environment"
    },
    { 
      id: "medical-center", 
      label: "Medical Center", 
      category: PROPERTY_CATEGORIES.COMMERCIAL, 
      icon: FaClinicMedical, 
      color: "purple",
      description: "Healthcare facility premises"
    }
  ],
  
  [PROPERTY_CATEGORIES.INDUSTRIAL]: [
    { 
      id: "manufacturing-plant", 
      label: "Manufacturing Plant", 
      category: PROPERTY_CATEGORIES.INDUSTRIAL, 
      icon: FaIndustry, 
      color: "orange",
      description: "Industrial production facility"
    },
    { 
      id: "factory", 
      label: "Factory", 
      category: PROPERTY_CATEGORIES.INDUSTRIAL, 
      icon: FaIndustry, 
      color: "orange",
      description: "Goods manufacturing unit"
    },
    { 
      id: "logistics-center", 
      label: "Logistics Center", 
      category: PROPERTY_CATEGORIES.INDUSTRIAL, 
      icon: FaTruck, 
      color: "orange",
      description: "Distribution and logistics hub"
    },
    { 
      id: "cold-storage", 
      label: "Cold Storage", 
      category: PROPERTY_CATEGORIES.INDUSTRIAL, 
      icon: FaSnowflake, 
      color: "orange",
      description: "Refrigerated warehouse facility"
    },
    { 
      id: "industrial-warehouse", 
      label: "Industrial Warehouse", 
      category: PROPERTY_CATEGORIES.INDUSTRIAL, 
      icon: FaWarehouse, 
      color: "orange",
      description: "Large-scale storage facility"
    },
    { 
      id: "research-facility", 
      label: "Research Facility", 
      category: PROPERTY_CATEGORIES.INDUSTRIAL, 
      icon: FaFlask, 
      color: "orange",
      description: "Industrial research and development center"
    },
    { 
      id: "power-plant", 
      label: "Power Plant", 
      category: PROPERTY_CATEGORIES.INDUSTRIAL, 
      icon: FaBolt, 
      color: "orange",
      description: "Energy generation facility"
    }
  ],
  
  [PROPERTY_CATEGORIES.PLOT]: [
    { 
      id: "commercial-plot", 
      label: "Commercial Plot", 
      category: PROPERTY_CATEGORIES.PLOT, 
      icon: FaMapMarkerAlt, 
      color: "green",
      description: "Land for commercial development"
    },
    { 
      id: "residential-plot", 
      label: "Residential Plot", 
      category: PROPERTY_CATEGORIES.PLOT, 
      icon: FaTree, 
      color: "green",
      description: "Land for residential construction"
    },
    { 
      id: "agricultural-plot", 
      label: "Agricultural Land", 
      category: PROPERTY_CATEGORIES.PLOT, 
      icon: FaTractor, 
      color: "green",
      description: "Farming and agricultural land"
    },
    { 
      id: "industrial-plot", 
      label: "Industrial Plot", 
      category: PROPERTY_CATEGORIES.PLOT, 
      icon: FaIndustry, 
      color: "green",
      description: "Land for industrial development"
    },
    { 
      id: "mixed-use-plot", 
      label: "Mixed-Use Plot", 
      category: PROPERTY_CATEGORIES.PLOT, 
      icon: FaCity, 
      color: "green",
      description: "Land for combined residential/commercial use"
    }
  ]
};

// Tab configuration with icons
export const PROPERTY_TABS = [
  { 
    key: PROPERTY_CATEGORIES.RESIDENTIAL, 
    label: "Residential", 
    icon: FaHome 
  },
  { 
    key: PROPERTY_CATEGORIES.COMMERCIAL, 
    label: "Commercial", 
    icon: FaBuilding 
  },
  { 
    key: PROPERTY_CATEGORIES.INDUSTRIAL, 
    label: "Industrial", 
    icon: FaIndustry 
  },
  { 
    key: PROPERTY_CATEGORIES.PLOT, 
    label: "Land & Plot", 
    icon: FaMapMarkerAlt 
  }
];

// Helper functions
export const getPropertyById = (id) => {
  for (const category in PROPERTY_TYPES) {
    const property = PROPERTY_TYPES[category].find(prop => prop.id === id);
    if (property) return property;
  }
  return null;
};

export const getPropertiesByCategory = (category) => {
  return PROPERTY_TYPES[category] || [];
};

export const isValidPropertyCategory = (category) => {
  return Object.values(PROPERTY_CATEGORIES).includes(category);
};