'use client';

import { ModernTag } from '@/app/components/SideComponents/ModernTag';

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