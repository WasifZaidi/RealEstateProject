"use client"
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Us_Data } from '@/constants/Us_Data';
import MuiDropdown from "@/app/components/MuiDropdown";
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
  Navigation,
  Star, // Added for Neighborhood
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';



const PROPERTY_TYPES = {
  // ... (unchanged)
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
  { value: 'Sell', label: 'For Sale' },
  { value: 'Rent', label: 'For Rent' },
  { value: 'Lease', label: 'For Lease' }
];

const AMENITIES_OPTIONS = [
  { value: 'balcony', label: 'Balcony', icon: '🏖️' },
  { value: 'garden', label: 'Garden', icon: '🌱' },
  { value: 'pool', label: 'Swimming Pool', icon: '🏊' },
  { value: 'ac', label: 'Air Conditioning', icon: '❄️' },
  { value: 'parking', label: 'Parking', icon: '🚗' },
  { value: 'furnished', label: 'Furnished', icon: '🛋️' },
  { value: 'security', label: '24/7 Security', icon: '🛡️' },
  { value: 'pet-friendly', label: 'Pet Friendly', icon: '🐾' },
];

const NUM_OPTIONS = ['Any', '1', '2', '3', '4', '5+'];

// MODALS_THAT_REQUIRE_APPLY: Added 'location' and changed 'more' to 'sizeOther'
const MODALS_THAT_REQUIRE_APPLY = new Set(['price', 'bedrooms', 'bathrooms', 'sizeOther', 'location']);

const INITIAL_FILTERS = {
  propertyType: '',
  propertyFor: '',
  minPrice: '', maxPrice: '',
  minBedrooms: '', maxBedrooms: '',
  minBathrooms: '', maxBathrooms: '',
  minSize: '', maxSize: '',
  // LOCATION FILTERS - Keep these separate for the Clear All logic
  state: '', city: '', neighborhood: '',
  amenities: [],
  yearBuiltFrom: '', yearBuiltTo: '',
};

const LOCATION_KEYS = ['state'];
const NON_LOCATION_KEYS = Object.keys(INITIAL_FILTERS).filter(key => !LOCATION_KEYS.includes(key));


// ===============================================
// HELPER FUNCTIONS & COMPONENTS
// ===============================================

const parseQueryString = (params) => {
  const newFilters = { ...INITIAL_FILTERS };
  params.forEach((value, key) => {
    if (key in INITIAL_FILTERS) {
      // Use case-insensitive check for boolean/numeric values from URL
      const normalizedValue = key === 'amenities' ? (value ? value.split(',') : []) : value;
      newFilters[key] = normalizedValue;
    } else if (key === 'amenities') {
      newFilters[key] = value ? value.split(',') : [];
    }
  });
  return newFilters;
};

// --- RangeSelector (Unchanged) ---
const RangeSelector = ({ label, options, minKey, maxKey, tempFilters, handleTempFilterChange }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">Minimum {label}</label>
      <div className="grid grid-cols-6 gap-2 range-grid-modal">
        {options.map((option) => (
          <button
            key={`min-${option}`}
            onClick={() => handleTempFilterChange(minKey, option === 'Any' ? '' : option.replace('+', ''))}
            className={`py-3   border-2 transition-all font-medium ${tempFilters[minKey] === (option === 'Any' ? '' : option.replace('+', ''))
                ? 'border-black bg-black text-white shadow-md'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">Maximum {label}</label>
      <div className="grid grid-cols-6 gap-2 range-grid-modal">
        {options.map((option) => (
          <button
            key={`max-${option}`}
            onClick={() => handleTempFilterChange(maxKey, option === 'Any' ? '' : option.replace('+', ''))}
            className={`py-3  border-2 transition-all font-medium ${tempFilters[maxKey] === (option === 'Any' ? '' : option.replace('+', ''))
                ? 'border-black bg-black text-white shadow-md'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  </div>
);

// --- PriceModal (Unchanged) ---
const PriceModal = ({ tempFilters, handleTempFilterChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
        <input
          type="number"
          placeholder="Min Price ($)"
          value={tempFilters.minPrice}
          onChange={(e) => handleTempFilterChange('minPrice', e.target.value)}
          className="normal_input"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
        <input
          type="number"
          placeholder="Max Price ($)"
          value={tempFilters.maxPrice}
          onChange={(e) => handleTempFilterChange('maxPrice', e.target.value)}
          className="normal_input"
        />
      </div>
    </div>
    <div className="grid grid-cols-4 gap-2 pt-2">
      {[100000, 250000, 500000, 1000000].map((price) => (
        <button
          key={price}
          onClick={() => handleTempFilterChange('maxPrice', price.toString())}
          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${tempFilters.maxPrice === price.toString()
              ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          ${price >= 1000000 ? `${price / 1000000}M` : `${price / 1000}k`}
        </button>
      ))}
    </div>
  </div>
);

// --- PropertyTypeModal & PropertyForModal & AmenitiesModal (Unchanged - instant apply) ---
const PropertyTypeModal = ({ filters, applyImmediate, setActivePropertyCategory, activePropertyCategory }) => (
  <div className="space-y-4">
    <div className="flex flex-wrap gap-2 mb-4">
      {Object.keys(PROPERTY_TYPES).map((category) => (
        <button
          key={category}
          onClick={() => setActivePropertyCategory(category)}
          className={`px-4 py-2 rounded-full font-medium transition-all ${activePropertyCategory === category ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            onClick={() => applyImmediate({ propertyType: isSelected ? '' : type.id })}
            className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all w-full ${isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
              }`}
          >
            <Icon className={`h-6 w-6 ${isSelected ? 'text-gray-900' : 'text-gray-500'}`} />
            <span className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
              {type.label}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);
const PropertyForModal = ({ filters, applyImmediate }) => (
  <div className="space-y-2">
    {PROPERTY_FOR_OPTIONS.map((option) => (
      <button
        key={option.value}
        onClick={() => applyImmediate({ propertyFor: option.value })}
        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${filters.propertyFor === option.value ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
          }`}
      >
        <span className="font-medium">{option.label}</span>
        {filters.propertyFor === option.value && <Check className="h-5 w-5 text-gray-900" />}
      </button>
    ))}
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
          className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 h-24 transition-all ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
        >
          <span className="text-2xl">{amenity.icon}</span>
          <span className={`text-xs font-medium text-center ${isSelected ? 'text-blue-900' : 'text-gray-600'}`}>
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

// --- SizeOtherModal (Renamed & Location removed) ---
// Now uses 'tempFilters' and 'handleTempFilterChange'
const SizeOtherModal = ({ tempFilters, handleTempFilterChange }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Ruler className="w-4 h-4 text-gray-600" />
        Square Footage
      </label>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Min sq ft"
          value={tempFilters.minSize}
          onChange={(e) => handleTempFilterChange('minSize', e.target.value)}
          className="normal_input"
        />
        <input
          type="number"
          placeholder="Max sq ft"
          value={tempFilters.maxSize}
          onChange={(e) => handleTempFilterChange('maxSize', e.target.value)}
          className="normal_input"
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Building className="w-4 h-4 text-gray-600" />
        Year Built
      </label>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="From Year"
          value={tempFilters.yearBuiltFrom}
          onChange={(e) => handleTempFilterChange('yearBuiltFrom', e.target.value)}
          className="normal_input"
          min="1900"
          max={new Date().getFullYear()}
        />
        <input
          type="number"
          placeholder="To Year"
          value={tempFilters.yearBuiltTo}
          onChange={(e) => handleTempFilterChange('yearBuiltTo', e.target.value)}
          className="normal_input"
          min="1900"
          max={new Date().getFullYear()}
        />
      </div>
    </div>
  </div>
);


// --- NEW: LocationModal (Replicating HeroBanner Logic) ---
const LocationModal = ({ tempFilters, handleTempFilterChange }) => {

  // --- Location Dropdown Options Logic (Copied/Adapted from HeroBanner) ---
  const stateOptions = useMemo(() => Us_Data.map((s) => s.state), []);

  const cityOptions = useMemo(() => {
    if (tempFilters.state) {
      const state = Us_Data.find((s) => s.state === tempFilters.state);
      return state ? state.cities.map((c) => c.name) : [];
    }
    if (tempFilters.neighborhood) {
      const match = Us_Data.flatMap((s) =>
        s.cities.filter((c) => c.neighborhoods.includes(tempFilters.neighborhood))
      );
      return match.map((c) => c.name);
    }
    return Us_Data.flatMap((s) => s.cities.map((c) => c.name));
  }, [tempFilters.state, tempFilters.neighborhood]);

  const neighborhoodOptions = useMemo(() => {
    if (tempFilters.city) {
      const city = Us_Data.flatMap((s) => s.cities).find(
        (c) => c.name === tempFilters.city
      );
      return city ? city.neighborhoods : [];
    }
    if (tempFilters.state) {
      const state = Us_Data.find((s) => s.state === tempFilters.state);
      return state
        ? state.cities.flatMap((c) => c.neighborhoods)
        : [];
    }
    return Us_Data.flatMap((s) =>
      s.cities.flatMap((c) => c.neighborhoods)
    );
  }, [tempFilters.state, tempFilters.city]);

  const handleStateChange = (value) => {
    handleTempFilterChange('state', value);
    handleTempFilterChange('city', '');
    handleTempFilterChange('neighborhood', '');
  };

  const handleCityChange = (value) => {
    handleTempFilterChange('city', value);
    const matchedState = Us_Data.find((s) =>
      s.cities.some((c) => c.name === value)
    );
    if (matchedState) handleTempFilterChange('state', matchedState.state);
    handleTempFilterChange('neighborhood', '');
  };

  const handleNeighborhoodChange = (value) => {
    handleTempFilterChange('neighborhood', value);
    const matchedState = Us_Data.find((s) =>
      s.cities.some((c) => c.neighborhoods.includes(value))
    );
    const matchedCity = matchedState?.cities.find((c) =>
      c.neighborhoods.includes(value)
    );
    if (matchedState) handleTempFilterChange('state', matchedState.state);
    if (matchedCity) handleTempFilterChange('city', matchedCity.name);
  };
  // --- End Location Dropdown Options Logic ---


  return (
    <div className="space-y-6">
      {/* State Dropdown */}
      <div>
        <label className="text-sm font-semibold uppercase text-gray-600 tracking-wide flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          State
        </label>
        <MuiDropdown
          placeholder="Select State"
          options={stateOptions}
          value={tempFilters.state}
          onChange={handleStateChange}
          customClasses="h-[48px] border-gray-300 rounded-lg focus:border-blue-500 transition-all text-sm"
        />
      </div>

      {/* City Dropdown */}
      <div>
        <label className="text-sm font-semibold uppercase text-gray-600 tracking-wide flex items-center gap-2 mb-2">
          <Building className="w-4 h-4 text-blue-500" />
          City
        </label>
        <MuiDropdown
          placeholder="Select City"
          options={cityOptions}
          value={tempFilters.city}
          onChange={handleCityChange}
          customClasses="h-[48px] border-gray-300 rounded-lg focus:border-blue-500 transition-all text-sm"
        />
      </div>

      {/* Neighborhood Dropdown */}
      <div>
        <label className="text-sm font-semibold uppercase text-gray-600 tracking-wide flex items-center gap-2 mb-2">
          <Navigation className="w-4 h-4 text-blue-500" />
          Neighborhood
        </label>
        <MuiDropdown
          placeholder="Select Area"
          options={neighborhoodOptions}
          value={tempFilters.neighborhood}
          onChange={handleNeighborhoodChange}
          customClasses="h-[48px] border-gray-300 rounded-lg focus:border-blue-500 transition-all text-sm"
        />
      </div>
    </div>
  );
};

// ===============================================
// MAIN FILTER COMPONENT
// ===============================================

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

  // 1. INITIAL URL SYNC
  useEffect(() => {
    const initialFilters = parseQueryString(searchParams);
    setFilters(initialFilters);
    // Set initial category based on URL type, defaults to Residential
    const typeConfig = Object.values(PROPERTY_TYPES).flat().find(t => t.id === initialFilters.propertyType);
    if (typeConfig) {
      setActivePropertyCategory(typeConfig.category);
    }
  }, [searchParams]);

  // 2. Scroll and Accessibility Effects (Unchanged)
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 5);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
      }
    };

    checkScroll();
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeModal ? 'hidden' : '';
    if (activeModal) {
      requestAnimationFrame(() => {
        modalContentRef.current?.focus();
      });
    }
    const onKey = (e) => {
      if (e.key === 'Escape') handleCancel();
    };
    if (activeModal) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeModal]);

  // 3. CORE LOGIC - URL/Filter Management
  const buildQueryString = (f) => {
    const params = new URLSearchParams();
    Object.entries(f).forEach(([key, value]) => {
      if (value && (Array.isArray(value) ? value.length > 0 : value.toString().trim() !== '')) {
        params.set(key, Array.isArray(value) ? value.join(',') : value);
      }
    });
    return params.toString();
  };

  const updateUrlAndNotify = useCallback((f) => {
    try {
      const qs = buildQueryString(f);
      const newPath = window.location.pathname + (qs ? `?${qs}` : '');
      router.replace(newPath, { shallow: true });
      if (onApplyFilters) onApplyFilters(f);
    } catch (err) {
      console.error('Error updating URL:', err);
    }
  }, [onApplyFilters, router]);


  const applyFilters = useCallback((nextFilters = null) => {
    const toApply = nextFilters || filters;
    updateUrlAndNotify(toApply);
    setFilters(toApply);
    setActiveModal(null);
  }, [filters, updateUrlAndNotify]);

  const handleCancel = useCallback(() => {
    // If a modal that uses tempFilters is closed, tempFilters is discarded.
    // The main 'filters' state remains unchanged.
    setActiveModal(null);
  }, []);

  // Dedicated change handler for temp state
  const handleTempFilterChange = useCallback((key, value) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const openModal = (key) => {
    if (MODALS_THAT_REQUIRE_APPLY.has(key)) {
      // Set temp state when opening a multi-input modal
      setTempFilters({ ...filters });
    }
    setActiveModal(key);
  };

  // For single-choice/instant-apply filters (Type, For)
  const applyImmediate = useCallback((patch) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    updateUrlAndNotify(next);

    // Close modal immediately for instant-apply modals
    if (!MODALS_THAT_REQUIRE_APPLY.has(activeModal)) {
      setActiveModal(null);
    }
  }, [activeModal, filters, updateUrlAndNotify]);

  // Handle the 'Show Results' click for modals that use tempFilters
  const handleApplyModalFilters = useCallback(() => {
    // The main filters state is updated with the temporary, draft state
    applyFilters(tempFilters);
  }, [applyFilters, tempFilters]);


  // Debounce amenity toggling to avoid too many URL changes
  const amenityTimerRef = useRef(null);
  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];

    // INSTANTLY update UI with setFilters
    setFilters(prev => ({ ...prev, amenities: newAmenities }));

    // DEBOUNCED update URL
    clearTimeout(amenityTimerRef.current);
    amenityTimerRef.current = setTimeout(() => {
      updateUrlAndNotify({ ...filters, amenities: newAmenities });
    }, 250); // 250ms debounce
  };

  /**
   * Clears all filters *except* the location filters.
   */
  const clearAllFilters = () => {
    // Isolate the location filters from the current state
    const locationFilters = LOCATION_KEYS.reduce((acc, key) => ({
      ...acc,
      [key]: filters[key] || '', // Use current location or empty string
    }), {});

    // Create the new state by combining initial non-location filters with current location filters
    const clearedFilters = {
      ...INITIAL_FILTERS,
      ...locationFilters,
      // Ensure other non-location keys are cleared (redundant with INITIAL_FILTERS but safe)
      ...NON_LOCATION_KEYS.reduce((acc, key) => ({ ...acc, [key]: INITIAL_FILTERS[key] }), {})
    };

    setFilters(clearedFilters);
    applyFilters(clearedFilters);
  };

  const hasActiveFilters = useMemo(() => Object.entries(filters).some(([key, value]) =>
    value && (Array.isArray(value) ? value.length > 0 : value.toString().trim() !== '')
  ), [filters]);

  // 4. UI Rendering Helpers
  const getFilterLabel = useCallback((filterKey) => {
    switch (filterKey) {
      case 'propertyType':
        const allTypes = Object.values(PROPERTY_TYPES).flat();
        return allTypes.find(t => t.id === filters.propertyType)?.label || 'Type';
      case 'propertyFor':
        return PROPERTY_FOR_OPTIONS.find(o => o.value === filters.propertyFor)?.label || 'For';
      case 'price':
        if (filters.minPrice || filters.maxPrice) {
          const minP = filters.minPrice ? `$${Number(filters.minPrice).toLocaleString()}` : 'Min';
          const maxP = filters.maxPrice ? `$${Number(filters.maxPrice).toLocaleString()}` : 'Max';
          return `${minP} - ${maxP}`;
        }
        return 'Price';
      case 'bedrooms':
        if (filters.minBedrooms || filters.maxBedrooms) {
          const min = filters.minBedrooms || 'Any';
          const max = filters.maxBedrooms || 'Any';
          return `${min}${min !== 'Any' && min !== '5' ? '+' : ''} - ${max}${max === '5' ? '+' : ''} Beds`;
        }
        return 'Beds';
      case 'bathrooms':
        if (filters.minBathrooms || filters.maxBathrooms) {
          const min = filters.minBathrooms || 'Any';
          const max = filters.maxBathrooms || 'Any';
          return `${min}${min !== 'Any' && min !== '5' ? '+' : ''} - ${max}${max === '5' ? '+' : ''} Baths`;
        }
        return 'Baths';
      case 'amenities':
        return filters.amenities.length > 0 ? `${filters.amenities.length} Amenities` : 'Amenities';
      case 'location':
        if (filters.neighborhood) return filters.neighborhood;
        if (filters.city) return filters.city;
        if (filters.state) return filters.state;
        return 'Location';
      case 'sizeOther':
        const moreCount = [filters.minSize, filters.maxSize, filters.yearBuiltFrom, filters.yearBuiltTo].filter(Boolean).length;
        return moreCount > 0 ? `${moreCount} More Filters` : 'Size & Other';
      default:
        return 'Filter';
    }
  }, [filters]);

  const hasFilterValue = useCallback((filterKey) => {
    switch (filterKey) {
      case 'propertyType': return !!filters.propertyType;
      case 'propertyFor': return !!filters.propertyFor;
      case 'price': return !!(filters.minPrice || filters.maxPrice);
      case 'bedrooms': return !!(filters.minBedrooms || filters.maxBedrooms);
      case 'bathrooms': return !!(filters.minBathrooms || filters.maxBathrooms);
      case 'amenities': return filters.amenities.length > 0;
      case 'location': return !!(filters.state || filters.city || filters.neighborhood); // New location check
      case 'sizeOther': return !!(filters.minSize || filters.maxSize || filters.yearBuiltFrom || filters.yearBuiltTo); // Location removed
      default: return false;
    }
  }, [filters]);


  const FilterButton = ({ filterKey, icon: Icon, defaultLabel }) => {
    const hasValue = hasFilterValue(filterKey);
    const displayLabel = hasValue ? getFilterLabel(filterKey) : defaultLabel;

    return (
      <button
        onClick={() => openModal(filterKey)}
        aria-pressed={activeModal === filterKey}
        aria-controls={`filter-modal-${filterKey}`}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 whitespace-nowrap font-medium text-sm hover:shadow-md ${hasValue
            ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700'
            : activeModal === filterKey
              ? 'bg-gray-50 border-gray-900 text-gray-900'
              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-500'
          }`}
      >
        {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
        <span>{displayLabel}</span>
      </button>
    );
  };

  // 5. RENDER
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative py-4">
          {/* Scroll Buttons for UX (Unchanged) */}
          {canScrollLeft && (
            <button
              onClick={() => scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg border border-gray-200 p-2 hover:bg-gray-50 transition-all hidden sm:block"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
          )}

          {/* Filter Button Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-0 sm:px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Filter Buttons */}
            <FilterButton filterKey="propertyType" icon={Home} defaultLabel="Property Type" />
            <FilterButton filterKey="propertyFor" icon={DollarSign} defaultLabel="For Sale/Rent" />
            <FilterButton filterKey="location" icon={Map} defaultLabel="Location" /> {/* NEW LOCATION BUTTON */}
            <FilterButton filterKey="price" icon={DollarSign} defaultLabel="Price Range" />
            <FilterButton filterKey="bedrooms" icon={Bed} defaultLabel="Bedrooms" />
            <FilterButton filterKey="bathrooms" icon={Bath} defaultLabel="Bathrooms" />
            <FilterButton filterKey="amenities" icon={Star} defaultLabel="Amenities" />

            <div className='w-4'></div> {/* Spacing */}

            {/* Renamed More Filters Button */}
            <FilterButton filterKey="sizeOther" icon={SlidersHorizontal} defaultLabel="Size & Other" />

            {/* Clear All Button */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 px-3 py-2.5 rounded-full border border-red-500 text-red-600 bg-red-50/50 text-sm font-medium transition-all hover:bg-red-100/50 whitespace-nowrap"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg border border-gray-200 p-2 hover:bg-gray-50 transition-all hidden sm:block"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          )}
        </div>
      </div>

      {/* --- Modal Overlay --- */}
      {activeModal && (
        <div
          id={`filter-modal-${activeModal}`}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 flex items-start justify-center pt-8 md:pt-16 px-4"
          onClick={handleCancel}
        >
          <div
            ref={modalContentRef}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()} // Keep modal open on click inside
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-transform duration-300"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-5 border-b border-gray-200 flex items-center justify-between z-10">
              <button onClick={handleCancel} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="text-xl font-bold text-gray-900">
                {activeModal === 'propertyType' ? 'Property Type' :
                  activeModal === 'propertyFor' ? 'For Sale/Rent' :
                    activeModal === 'price' ? 'Price Range' :
                      activeModal === 'bedrooms' ? 'Bedrooms' :
                        activeModal === 'bathrooms' ? 'Bathrooms' :
                          activeModal === 'amenities' ? 'Amenities' :
                            activeModal === 'location' ? 'Select Location' : // New title
                              activeModal === 'sizeOther' ? 'Size & Other' : 'Filter Options'} {/* Updated title */}
              </h3>
              <div className='w-10 h-5'></div> {/* Spacer */}
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {activeModal === 'propertyType' && (
                <PropertyTypeModal
                  filters={filters}
                  applyImmediate={applyImmediate}
                  setActivePropertyCategory={setActivePropertyCategory}
                  activePropertyCategory={activePropertyCategory}
                />
              )}
              {activeModal === 'propertyFor' && (
                <PropertyForModal filters={filters} applyImmediate={applyImmediate} />
              )}
              {activeModal === 'location' && (
                <LocationModal
                  tempFilters={tempFilters}
                  handleTempFilterChange={handleTempFilterChange}
                />
              )}
              {activeModal === 'price' && (
                <PriceModal
                  tempFilters={tempFilters}
                  handleTempFilterChange={handleTempFilterChange}
                />
              )}
              {activeModal === 'bedrooms' && (
                <RangeSelector
                  label="Bedrooms"
                  options={NUM_OPTIONS}
                  minKey="minBedrooms"
                  maxKey="maxBedrooms"
                  tempFilters={tempFilters}
                  handleTempFilterChange={handleTempFilterChange}
                />
              )}
              {activeModal === 'bathrooms' && (
                <RangeSelector
                  label="Bathrooms"
                  options={NUM_OPTIONS}
                  minKey="minBathrooms"
                  maxKey="maxBathrooms"
                  tempFilters={tempFilters}
                  handleTempFilterChange={handleTempFilterChange}
                />
              )}
              {activeModal === 'amenities' && (
                <AmenitiesModal
                  filters={filters}
                  handleAmenityToggle={handleAmenityToggle}
                />
              )}
              {activeModal === 'sizeOther' && (
                <SizeOtherModal
                  tempFilters={tempFilters}
                  handleTempFilterChange={handleTempFilterChange}
                />
              )}
            </div>

            {/* Modal Footer (Show Results Button for multi-input modals) */}
            {MODALS_THAT_REQUIRE_APPLY.has(activeModal) && (
              <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 shadow-xl flex justify-end">
                <button
                  onClick={handleApplyModalFilters}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-[50px] shadow-lg hover:bg-blue-700 transition-colors"
                >
                  Show Results
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;