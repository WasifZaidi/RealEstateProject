import { FaHome, FaBuilding, FaCity, FaTree, FaMapMarkerAlt,  FaWarehouse,  FaIndustry } from "react-icons/fa";

export const propertyTypes = {
    Residential: [
        { id: "apartment", label: "Apartment", category: "Residential", icon: FaBuilding },
        { id: "house", label: "House", category: "Residential", icon: FaHome },
        { id: "villa", label: "Villa", category: "Residential", icon: FaCity },
        { id: "condo", label: "Condo", category: "Residential", icon: FaBuilding },
        { id: "townhouse", label: "Townhouse", category: "Residential", icon: FaHome },
    ],
    Plot: [
        { id: "commercial-plot", label: "Commercial Plot", category: "Plot", icon: FaMapMarkerAlt },
        { id: "residential-plot", label: "Residential Plot", category: "Plot", icon: FaTree },
        { id: "agricultural-plot", label: "Agricultural Plot", category: "Plot", icon: FaTree },
        { id: "industrial-plot", label: "Industrial Plot", category: "Plot", icon: FaBuilding },
    ],
    Commercial: [
        { id: "office", label: "Office", category: "Commercial", icon: FaBuilding },
        { id: "shop", label: "Shop", category: "Commercial", icon: FaMapMarkerAlt },
        { id: "mall", label: "Mall", category: "Commercial", icon: FaCity },
        { id: "restaurant", label: "Restaurant", category: "Commercial", icon: FaBuilding },
    ],
    Industrial: [
        { id: "factory", label: "Factory", category: "Industrial", icon: FaIndustry },
        { id: "warehouse", label: "Warehouse", category: "Industrial", icon: FaWarehouse },
        { id: "plant", label: "Plant", category: "Industrial", icon: FaIndustry },
    ],
};
