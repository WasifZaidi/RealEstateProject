"use client"
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Home,
  DollarSign,
  Bed,
  Bath,
  SlidersHorizontal,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Building,
  MapPin,
  Map,
  Ruler,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

/* ============ Unchanged enterprise constants (kept) ============ */
const PROPERTY_TYPES = {
  Residential: [
    { id: "apartment", label: "Apartment", category: "Residential", icon: Building },
    { id: "house", label: "House", category: "Residential", icon: Home },
    { id: "villa", label: "Villa", category: "Residential", icon: Home },
    { id: "condo", label: "Condo", category: "Residential", icon: Building },
    { id: "townhouse", label: "Townhouse", category: "Residential", icon: Home },
  ],
  Plot: [
    { id: "commercial-plot", label: "Commercial Plot", category: "Plot", icon: MapPin },
    { id: "residential-plot", label: "Residential Plot", category: "Plot", icon: MapPin },
    { id: "agricultural-plot", label: "Agricultural Plot", category: "Plot", icon: MapPin },
    { id: "industrial-plot", label: "Industrial Plot", category: "Plot", icon: MapPin },
  ],
  Commercial: [
    { id: "office", label: "Office", category: "Commercial", icon: Building },
    { id: "shop", label: "Shop", category: "Commercial", icon: Building },
    { id: "mall", label: "Mall", category: "Commercial", icon: Building },
    { id: "restaurant", label: "Restaurant", category: "Commercial", icon: Building },
  ],
};

const PROPERTY_FOR_OPTIONS = [
  { value: "Sell", label: "For Sale" },
  { value: "Rent", label: "For Rent" },
  { value: "Lease", label: "For Lease" },
];

const AMENITIES_OPTIONS = [
  { value: "balcony", label: "Balcony", icon: "🏖️" },
  { value: "garden", label: "Garden", icon: "🌱" },
  { value: "pool", label: "Swimming Pool", icon: "🏊" },
  { value: "ac", label: "Air Conditioning", icon: "❄️" },
  { value: "parking", label: "Parking", icon: "🚗" },
  { value: "furnished", label: "Furnished", icon: "🛋️" },
  { value: "security", label: "24/7 Security", icon: "🛡️" },
  { value: "pet-friendly", label: "Pet Friendly", icon: "🐾" },
];

const NUM_OPTIONS = ["Any", "1", "2", "3", "4", "5+"];

/* --- Add 'location' and 'size' to the modals that require explicit Apply --- */
const MODALS_THAT_REQUIRE_APPLY = new Set(["price", "bedrooms", "bathrooms", "more", "location", "size"]);

/* === Ensure neighborhood exists in initial filters === */
const INITIAL_FILTERS = {
  propertyType: "",
  propertyFor: "",
  minPrice: "",
  maxPrice: "",
  minBedrooms: "",
  maxBedrooms: "",
  minBathrooms: "",
  maxBathrooms: "",
  minSize: "",
  maxSize: "",
  state: "",
  city: "",
  neighborhood: "",
  amenities: [],
  yearBuiltFrom: "",
  yearBuiltTo: "",
};

/* ======== Helpers ======== */
const parseQueryString = (params) => {
  const newFilters = { ...INITIAL_FILTERS };
  params.forEach((value, key) => {
    if (key in newFilters) {
      if (key === "amenities") {
        newFilters.amenities = value ? value.split(",") : [];
      } else {
        newFilters[key] = value;
      }
    }
  });
  return newFilters;
};

/* ======= Small UI components (kept + extended) ======= */
const RangeSelector = ({ label, options, minKey, maxKey, tempFilters, handleTempFilterChange }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">Minimum {label}</label>
      <div className="grid grid-cols-6 gap-2">
        {options.map((option) => (
          <button
            key={`min-${option}`}
            onClick={() => handleTempFilterChange(minKey, option === "Any" ? "" : option.replace("+", ""))}
            className={`py-3 rounded-xl border-2 transition-all font-medium ${tempFilters[minKey] === (option === "Any" ? "" : option.replace("+", ""))
                ? "border-blue-600 bg-blue-600 text-white shadow-md"
                : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">Maximum {label}</label>
      <div className="grid grid-cols-6 gap-2">
        {options.map((option) => (
          <button
            key={`max-${option}`}
            onClick={() => handleTempFilterChange(maxKey, option === "Any" ? "" : option.replace("+", ""))}
            className={`py-3 rounded-xl border-2 transition-all font-medium ${tempFilters[maxKey] === (option === "Any" ? "" : option.replace("+", ""))
                ? "border-blue-600 bg-blue-600 text-white shadow-md"
                : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const PriceModal = ({ tempFilters, handleTempFilterChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
        <input
          type="number"
          placeholder="Min Price ($)"
          value={tempFilters.minPrice}
          onChange={(e) => handleTempFilterChange("minPrice", e.target.value.replace(/\D/g, ""))}
          className="normal_input"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
        <input
          type="number"
          placeholder="Max Price ($)"
          value={tempFilters.maxPrice}
          onChange={(e) => handleTempFilterChange("maxPrice", e.target.value.replace(/\D/g, ""))}
          className="normal_input"
        />
      </div>
    </div>
    <div className="grid grid-cols-4 gap-2 pt-2">
      {[100000, 250000, 500000, 1000000].map((price) => (
        <button
          key={price}
          onClick={() => handleTempFilterChange("maxPrice", price.toString())}
          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${tempFilters.maxPrice === price.toString() ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          ${price >= 1000000 ? `${price / 1000000}M` : `${price / 1000}k`}
        </button>
      ))}
    </div>
  </div>
);

const AmenitiesModal = ({ filters, handleAmenityToggle }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
    {AMENITIES_OPTIONS.map((amenity) => {
      const isSelected = filters.amenities.includes(amenity.value);
      return (
        <button
          key={amenity.value}
          onClick={() => handleAmenityToggle(amenity.value)}
          className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 h-24 transition-all ${isSelected ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
            }`}
        >
          <span className="text-2xl">{amenity.icon}</span>
          <span className={`text-xs font-medium text-center ${isSelected ? "text-blue-900" : "text-gray-600"}`}>
            {amenity.label}
          </span>
          {isSelected && (
            <div className="absolute top-1 right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </button>
      );
    })}
  </div>
);

/* ===== New: LocationModal and SizeModal (separate, require Apply) ===== */
const LocationModal = ({ tempFilters, handleTempFilterChange }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">State</label>
      <input
        value={tempFilters.state}
        onChange={(e) => handleTempFilterChange("state", e.target.value)}
        placeholder="Type or choose a state"
        className="normal_input"
      />
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">City</label>
      <input
        value={tempFilters.city}
        onChange={(e) => handleTempFilterChange("city", e.target.value)}
        placeholder="Type or choose a city"
        className="normal_input"
      />
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">Neighborhood / Area</label>
      <input
        value={tempFilters.neighborhood}
        onChange={(e) => handleTempFilterChange("neighborhood", e.target.value)}
        placeholder="Optional: neighborhood"
        className="normal_input"
      />
    </div>
    <p className="text-xs text-gray-500">Tip: Use the Hero search to pre-select your location (MUI dropdowns recommended there).</p>
  </div>
);

const SizeModal = ({ tempFilters, handleTempFilterChange }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">Min Size (sq ft)</label>
      <input
        value={tempFilters.minSize}
        onChange={(e) => handleTempFilterChange("minSize", e.target.value.replace(/\D/g, ""))}
        placeholder="e.g. 500"
        className="normal_input"
      />
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">Max Size (sq ft)</label>
      <input
        value={tempFilters.maxSize}
        onChange={(e) => handleTempFilterChange("maxSize", e.target.value.replace(/\D/g, ""))}
        placeholder="e.g. 2000"
        className="normal_input"
      />
    </div>
  </div>
);

/* ===================== Main FilterSection ===================== */
const FilterSection = ({ onApplyFilters }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef(null);
  const modalContentRef = useRef(null);

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [tempFilters, setTempFilters] = useState(INITIAL_FILTERS);
  const [activeModal, setActiveModal] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activePropertyCategory, setActivePropertyCategory] = useState("Residential");

  /* =========== INITIAL URL SYNC =========== */
  useEffect(() => {
    const initialFilters = parseQueryString(searchParams);
    setFilters(initialFilters);
    setTempFilters(initialFilters);
    const typeConfig = Object.values(PROPERTY_TYPES).flat().find((t) => t.id === initialFilters.propertyType);
    if (typeConfig) setActivePropertyCategory(typeConfig.category);
  }, [searchParams]);

  /* =========== SCROLL CHECKS =========== */
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 5);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
      }
    };
    checkScroll();
    const c = scrollContainerRef.current;
    c?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      c?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  /* =========== FOCUS & ESC =========== */
  useEffect(() => {
    document.body.style.overflow = activeModal ? "hidden" : "";
    if (activeModal) {
      requestAnimationFrame(() => modalContentRef.current?.focus());
    }
    const onKey = (e) => {
      if (e.key === "Escape") handleCancel();
      if (e.key === "Enter" && MODALS_THAT_REQUIRE_APPLY.has(activeModal)) {
        // When pressing Enter inside a multi-input modal, apply
        applyFilters(tempFilters);
      }
    };
    if (activeModal) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModal, tempFilters]);

  /* =========== URL BUILD & Update =========== */
  const buildQueryString = (f) => {
    const params = new URLSearchParams();
    Object.entries(f).forEach(([key, value]) => {
      if (value && (Array.isArray(value) ? value.length > 0 : true)) {
        params.set(key, Array.isArray(value) ? value.join(",") : value);
      }
    });
    return params.toString();
  };

  const updateUrlAndNotify = useCallback(
    (f) => {
      try {
        const qs = buildQueryString(f);
        const newPath = window.location.pathname + (qs ? `?${qs}` : "");
        router.replace(newPath, { shallow: true });
        if (onApplyFilters) onApplyFilters(f);
      } catch (err) {
        console.error("Error updating URL:", err);
      }
    },
    [onApplyFilters, router]
  );

  /* =========== Apply / Cancel =========== */
  const applyFilters = useCallback(
    (nextFilters = null) => {
      const toApply = nextFilters || filters;
      setFilters(toApply);
      setTempFilters(toApply);
      updateUrlAndNotify(toApply);
      setActiveModal(null);
    },
    [filters, updateUrlAndNotify]
  );

  const handleCancel = useCallback(() => {
    // discard temp changes for multi-input modals
    setTempFilters(filters);
    setActiveModal(null);
  }, [filters]);

  /* =========== temp changes handler =========== */
  const handleTempFilterChange = useCallback((key, value) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const openModal = (key) => {
    if (MODALS_THAT_REQUIRE_APPLY.has(key)) {
      // start edit from current filters
      setTempFilters({ ...filters });
    } else {
      // immediate modals still benefit from current filters being set as temp to keep UI consistent
      setTempFilters({ ...filters });
    }
    setActiveModal(key);
  };

  /* =========== Immediate apply (single-choice) =========== */
  const applyImmediate = useCallback(
    (patch) => {
      const next = { ...filters, ...patch };
      setFilters(next);
      setTempFilters(next);
      updateUrlAndNotify(next);
      if (!MODALS_THAT_REQUIRE_APPLY.has(activeModal)) setActiveModal(null);
    },
    [activeModal, filters, updateUrlAndNotify]
  );

  /* =========== Amenities toggle with robust debounced URL update =========== */
  const amenityTimerRef = useRef(null);
  const handleAmenityToggle = (amenity) => {
    setFilters((prev) => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      const nextFilters = { ...prev, amenities: newAmenities };

      // update URL debounced — make sure we use the nextFilters value (no stale closure)
      clearTimeout(amenityTimerRef.current);
      amenityTimerRef.current = setTimeout(() => {
        updateUrlAndNotify(nextFilters);
      }, 250);

      return nextFilters;
    });
  };

  /* =========== Clear filters (but preserve location) =========== */
  const clearAllFilters = () => {
    setFilters((prev) => {
      const preserved = {
        state: prev.state || "",
        city: prev.city || "",
        neighborhood: prev.neighborhood || "",
      };
      const next = { ...INITIAL_FILTERS, ...preserved };
      setTempFilters(next);
      updateUrlAndNotify(next);
      return next;
    });
  };

  /* =========== Helper display label functions =========== */
  const getFilterLabel = useCallback(
    (filterKey) => {
      switch (filterKey) {
        case "propertyType": {
          const allTypes = Object.values(PROPERTY_TYPES).flat();
          return allTypes.find((t) => t.id === filters.propertyType)?.label || "Type";
        }
        case "propertyFor":
          return PROPERTY_FOR_OPTIONS.find((o) => o.value === filters.propertyFor)?.label || "For";
        case "price": {
          if (filters.minPrice || filters.maxPrice) {
            const minP = filters.minPrice ? `$${Number(filters.minPrice).toLocaleString()}` : "Min";
            const maxP = filters.maxPrice ? `$${Number(filters.maxPrice).toLocaleString()}` : "Max";
            return `${minP} - ${maxP}`;
          }
          return "Price";
        }
        case "bedrooms": {
          if (filters.minBedrooms || filters.maxBedrooms) {
            const min = filters.minBedrooms || "Any";
            const max = filters.maxBedrooms || "Any";
            return `${min}${min !== "Any" && min !== "5" ? "+" : ""} - ${max}${max === "5" ? "+" : ""} Beds`;
          }
          return "Beds";
        }
        case "bathrooms": {
          if (filters.minBathrooms || filters.maxBathrooms) {
            const min = filters.minBathrooms || "Any";
            const max = filters.maxBathrooms || "Any";
            return `${min}${min !== "Any" && min !== "5" ? "+" : ""} - ${max}${max === "5" ? "+" : ""} Baths`;
          }
          return "Baths";
        }
        case "amenities":
          return filters.amenities.length > 0 ? `${filters.amenities.length} Amenities` : "Amenities";
        case "more": {
          const moreCount = [filters.minSize, filters.maxSize, filters.yearBuiltFrom, filters.yearBuiltTo].filter(Boolean).length;
          return moreCount > 0 ? `${moreCount} More` : "More";
        }
        case "location": {
          if (filters.state || filters.city || filters.neighborhood) {
            const chunks = [];
            if (filters.city) chunks.push(filters.city);
            if (filters.state) chunks.push(filters.state);
            if (!filters.city && filters.neighborhood) chunks.push(filters.neighborhood);
            return chunks.join(", ");
          }
          return "Location";
        }
        case "size": {
          if (filters.minSize || filters.maxSize) {
            const min = filters.minSize || "Min";
            const max = filters.maxSize || "Max";
            return `${min} - ${max} sq ft`;
          }
          return "Size";
        }
        default:
          return "More";
      }
    },
    [filters]
  );

  const hasFilterValue = useCallback(
    (filterKey) => {
      switch (filterKey) {
        case "propertyType":
          return !!filters.propertyType;
        case "propertyFor":
          return !!filters.propertyFor;
        case "price":
          return !!(filters.minPrice || filters.maxPrice);
        case "bedrooms":
          return !!(filters.minBedrooms || filters.maxBedrooms);
        case "bathrooms":
          return !!(filters.minBathrooms || filters.maxBathrooms);
        case "amenities":
          return filters.amenities.length > 0;
        case "more":
          return !!(filters.minSize || filters.maxSize || filters.yearBuiltFrom || filters.yearBuiltTo);
        case "location":
          return !!(filters.state || filters.city || filters.neighborhood);
        case "size":
          return !!(filters.minSize || filters.maxSize);
        default:
          return false;
      }
    },
    [filters]
  );

  const FilterButton = ({ filterKey, icon: Icon, defaultLabel }) => {
    const hasValue = hasFilterValue(filterKey);
    const displayLabel = hasValue ? getFilterLabel(filterKey) : defaultLabel;

    return (
      <button
        onClick={() => openModal(filterKey)}
        aria-pressed={activeModal === filterKey}
        aria-controls={`filter-modal-${filterKey}`}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 whitespace-nowrap font-medium text-sm hover:shadow-md ${hasValue
            ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700"
            : activeModal === filterKey
              ? "bg-gray-50 border-gray-900 text-gray-900"
              : "bg-white border-gray-300 text-gray-700 hover:border-gray-500"
          }`}
      >
        {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
        <span>{displayLabel}</span>
      </button>
    );
  };

  const hasActiveFilters = useMemo(
    () =>
      Object.entries(filters).some(([key, value]) =>
        value && (Array.isArray(value) ? value.length > 0 : value.toString().trim() !== "")
      ),
    [filters]
  );

  /* ===================== Render ===================== */
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative py-4">
          {canScrollLeft && (
            <button
              onClick={() => scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg border border-gray-200 p-2 hover:bg-gray-50 transition-all hidden sm:block"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex items-center gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-0 sm:px-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <FilterButton filterKey="propertyType" defaultLabel="Property Type" icon={Home} />
            <FilterButton filterKey="propertyFor" defaultLabel="For Sale/Rent" />
            <FilterButton filterKey="price" defaultLabel="Price Range" icon={DollarSign} />
            <FilterButton filterKey="bedrooms" defaultLabel="Beds" icon={Bed} />
            <FilterButton filterKey="bathrooms" defaultLabel="Baths" icon={Bath} />
            <FilterButton filterKey="amenities" defaultLabel="Amenities" icon={Check} />
            <FilterButton filterKey="location" defaultLabel="Location" icon={MapPin} />
            <FilterButton filterKey="size" defaultLabel="Size" icon={Ruler} />
            <FilterButton filterKey="more" defaultLabel="More Filters" icon={SlidersHorizontal} />

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-red-400 bg-red-50 text-red-700 hover:bg-red-100 transition-all whitespace-nowrap text-sm font-medium flex-shrink-0"
              >
                <X className="h-4 w-4" />
                Clear All
              </button>
            )}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg border border-gray-200 p-2 hover:bg-gray-50 transition-all hidden sm:block"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          )}
        </div>
      </div>

      {/* Modal container */}
      {activeModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-25 z-40" onClick={handleCancel} aria-hidden="true" />

          <div className="absolute left-0 right-0 top-[0%] mt-2 z-50 max-w-7xl mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div
                ref={modalContentRef}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[70vh] flex flex-col focus:outline-none"
                tabIndex={-1}
                id={`filter-modal-${activeModal}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                  <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
                    {activeModal === "propertyType" && "Select Property Type"}
                    {activeModal === "propertyFor" && "Listing Status"}
                    {activeModal === "price" && "Price Range"}
                    {activeModal === "bedrooms" && "Bedrooms"}
                    {activeModal === "bathrooms" && "Bathrooms"}
                    {activeModal === "amenities" && "Amenities & Features"}
                    {activeModal === "more" && "Additional Filters"}
                    {activeModal === "location" && "Location"}
                    {activeModal === "size" && "Size"}
                  </h3>
                  <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Close filters modal">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6">
                  {activeModal === "propertyType" && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.keys(PROPERTY_TYPES).map((category) => (
                          <button
                            key={category}
                            onClick={() => setActivePropertyCategory(category)}
                            className={`px-4 py-2 rounded-full font-medium transition-all ${activePropertyCategory === category ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {PROPERTY_TYPES[activePropertyCategory].map((type) => {
                          const Icon = type.icon;
                          const isSelected = filters.propertyType === type.id;
                          return (
                            <button
                              key={type.id}
                              onClick={() => applyImmediate({ propertyType: isSelected ? "" : type.id })}
                              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all w-full ${isSelected ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                              <Icon className={`h-6 w-6 ${isSelected ? "text-gray-900" : "text-gray-500"}`} />
                              <span className={`text-sm font-medium ${isSelected ? "text-gray-900" : "text-gray-600"}`}>{type.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeModal === "propertyFor" && (
                    <div className="space-y-2">
                      {PROPERTY_FOR_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => applyImmediate({ propertyFor: option.value })}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${filters.propertyFor === option.value ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                          <span className="font-medium">{option.label}</span>
                          {filters.propertyFor === option.value && <Check className="h-5 w-5 text-gray-900" />}
                        </button>
                      ))}
                    </div>
                  )}

                  {activeModal === "price" && <PriceModal tempFilters={tempFilters} handleTempFilterChange={handleTempFilterChange} />}

                  {activeModal === "bedrooms" && (
                    <RangeSelector label="Bedrooms" options={NUM_OPTIONS} minKey="minBedrooms" maxKey="maxBedrooms" tempFilters={tempFilters} handleTempFilterChange={handleTempFilterChange} />
                  )}

                  {activeModal === "bathrooms" && (
                    <RangeSelector label="Bathrooms" options={NUM_OPTIONS} minKey="minBathrooms" maxKey="maxBathrooms" tempFilters={tempFilters} handleTempFilterChange={handleTempFilterChange} />
                  )}

                  {activeModal === "amenities" && <AmenitiesModal filters={filters} handleAmenityToggle={handleAmenityToggle} />}

                  {activeModal === "more" && <div className="space-y-6"><div><label className="block text-sm font-semibold text-gray-900 mb-3">Year Built</label><div className="grid grid-cols-2 gap-4"><input type="number" placeholder="From Year" value={tempFilters.yearBuiltFrom} onChange={(e) => handleTempFilterChange("yearBuiltFrom", e.target.value.replace(/\D/g, ""))} className="normal_input" min="1900" max={new Date().getFullYear()} /><input type="number" placeholder="To Year" value={tempFilters.yearBuiltTo} onChange={(e) => handleTempFilterChange("yearBuiltTo", e.target.value.replace(/\D/g, ""))} className="normal_input" min="1900" max={new Date().getFullYear()} /></div></div></div>}

                  {activeModal === "location" && <LocationModal tempFilters={tempFilters} handleTempFilterChange={handleTempFilterChange} />}

                  {activeModal === "size" && <SizeModal tempFilters={tempFilters} handleTempFilterChange={handleTempFilterChange} />}
                </div>

                {MODALS_THAT_REQUIRE_APPLY.has(activeModal) ? (
                  <div className="flex justify-between items-center p-4 border-t border-gray-200 flex-shrink-0">
                    <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                      Cancel
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          // Quick reset for the modal only (keeps other filters intact)
                          setTempFilters((prev) => {
                            const keepLocation = { state: prev.state, city: prev.city, neighborhood: prev.neighborhood };
                            if (activeModal === "location") {
                              // reset location fields only
                              return { ...prev, state: "", city: "", neighborhood: "" };
                            }
                            if (activeModal === "size") {
                              return { ...prev, minSize: "", maxSize: "" };
                            }
                            // default: reset modal-relevant fields
                            return { ...prev };
                          });
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Reset
                      </button>
                      <button onClick={() => applyFilters(tempFilters)} className="px-6 py-[8px] text-base font-semibold text-white bg-blue-600 rounded-[50px] hover:bg-blue-700 transition-colors shadow-md">
                        Show Results
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterSection;
