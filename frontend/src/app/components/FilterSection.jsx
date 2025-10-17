"use client"
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  Ruler
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

// ===============================================
// ENTERPRISE DATA & CONFIGURATION (Unchanged)
// ===============================================

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

// Define which modals require explicit Apply button (multi-input, like price range)
const MODALS_THAT_REQUIRE_APPLY = new Set(['price', 'bedrooms', 'bathrooms', 'more']);

const INITIAL_FILTERS = {
  propertyType: '',
  propertyFor: '',
  minPrice: '', maxPrice: '',
  minBedrooms: '', maxBedrooms: '',
  minBathrooms: '', maxBathrooms: '',
  minSize: '', maxSize: '',
  state: '', city: '',
  amenities: [],
  yearBuiltFrom: '', yearBuiltTo: '',
};

// ===============================================
// HELPER FUNCTIONS & COMPONENTS (Mocked/Simplified)
// ===============================================

const parseQueryString = (params) => {
  const newFilters = { ...INITIAL_FILTERS };
  params.forEach((value, key) => {
    if (key in INITIAL_FILTERS) {
      newFilters[key] = key === 'amenities' ? (value ? value.split(',') : []) : value;
    } else if (key === 'amenities') {
      newFilters[key] = value ? value.split(',') : [];
    }
  });
  return newFilters;
};

// --- PropertyTypeModal (Unchanged - uses applyImmediate) ---
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

// --- PropertyForModal (Unchanged - uses applyImmediate) ---
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

// --- RangeSelector (UPDATED to accept tempFilters and a dedicated tempHandleFilterChange) ---
// Now uses 'tempFilters' and 'handleTempFilterChange'
const RangeSelector = ({ label, options, minKey, maxKey, tempFilters, handleTempFilterChange }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">Minimum {label}</label>
      <div className="grid grid-cols-6 gap-2">
        {options.map((option) => (
          <button
            key={`min-${option}`}
            onClick={() => handleTempFilterChange(minKey, option === 'Any' ? '' : option.replace('+', ''))}
            className={`py-3 rounded-xl border-2 transition-all font-medium ${tempFilters[minKey] === (option === 'Any' ? '' : option.replace('+', ''))
                ? 'border-blue-600 bg-blue-600 text-white shadow-md'
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
      <div className="grid grid-cols-6 gap-2">
        {options.map((option) => (
          <button
            key={`max-${option}`}
            onClick={() => handleTempFilterChange(maxKey, option === 'Any' ? '' : option.replace('+', ''))}
            className={`py-3 rounded-xl border-2 transition-all font-medium ${tempFilters[maxKey] === (option === 'Any' ? '' : option.replace('+', ''))
                ? 'border-blue-600 bg-blue-600 text-white shadow-md'
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

// --- PriceModal (Now consistently uses tempFilters and handleTempFilterChange) ---
const PriceModal = ({ tempFilters, handleTempFilterChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
        <input
          type="number"
          placeholder="Min Price ($)"
          value={tempFilters.minPrice}
          // Change handler uses the temporary state function
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
          // Change handler uses the temporary state function
          onChange={(e) => handleTempFilterChange('maxPrice', e.target.value)}
          className="normal_input"
        />
      </div>
    </div>
    {/* Quick select buttons (also updated to use tempHandleFilterChange) */}
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

// --- AmenitiesModal (Unchanged - uses main filters and debounced update) ---
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

// --- MoreFiltersModal (UPDATED to accept tempFilters and a dedicated tempHandleFilterChange) ---
// Now uses 'tempFilters' and 'handleTempFilterChange'
const MoreFiltersModal = ({ tempFilters, handleTempFilterChange }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-3">Square Footage</label>
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
      <label className="block text-sm font-semibold text-gray-900 mb-3">Location</label>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="City"
          value={tempFilters.city}
          onChange={(e) => handleTempFilterChange('city', e.target.value)}
          className="normal_input"
        />
        <input
          type="text"
          placeholder="State/Province"
          value={tempFilters.state}
          onChange={(e) => handleTempFilterChange('state', e.target.value)}
          className="normal_input"
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-3">Year Built</label>
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

// ===============================================
// MAIN FILTER COMPONENT
// ===============================================

const FilterSection = ({ onApplyFilters }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef(null);
  const modalContentRef = useRef(null);
  const previousFiltersRef = useRef(null);

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [tempFilters, setTempFilters] = useState(INITIAL_FILTERS); // 👈 Dedicated state for draft changes
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
      if (value && (Array.isArray(value) ? value.length > 0 : true)) {
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
    if (activeModal && MODALS_THAT_REQUIRE_APPLY.has(activeModal)) {
      // Revert state for multi-input modals (Price, Beds, More) is now implicit:
      // We only update the main 'filters' state on 'Show Results'.
      // When 'Cancel' is clicked, we just close the modal, discarding 'tempFilters'.
    }
    setActiveModal(null);
  }, [activeModal]);

  // We are removing the original handleFilterChange from the component scope
  // for the multi-input modals, as they now use 'tempFilters'.

  // New dedicated change handler for temp state
  const handleTempFilterChange = useCallback((key, value) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const openModal = (key) => {
    if (MODALS_THAT_REQUIRE_APPLY.has(key)) {
      // Only set temp state when opening a multi-input modal
      // The current main filters state becomes the starting point for editing.
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

  const clearAllFilters = () => {
    setFilters(INITIAL_FILTERS);
    applyFilters(INITIAL_FILTERS);
  };

  const hasActiveFilters = useMemo(() => Object.entries(filters).some(([key, value]) =>
    value && (Array.isArray(value) ? value.length > 0 : value.toString().trim() !== '')
  ), [filters]);

  // 4. UI Rendering Helpers (Unchanged)
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
      case 'more':
        const moreCount = [filters.minSize, filters.maxSize, filters.yearBuiltFrom, filters.yearBuiltTo, filters.city, filters.state].filter(Boolean).length;
        return moreCount > 0 ? `${moreCount} More` : 'More';
      default:
        return 'More';
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
      case 'more': return !!(filters.minSize || filters.maxSize || filters.yearBuiltFrom || filters.yearBuiltTo || filters.city || filters.state);
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

          {/* Filter Button Scroll Container (Unchanged) */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-0 sm:px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <FilterButton filterKey="propertyType" defaultLabel="Property Type" icon={Home} />
            <FilterButton filterKey="propertyFor" defaultLabel="For Sale/Rent" />
            <FilterButton filterKey="price" defaultLabel="Price Range" icon={DollarSign} />
            <FilterButton filterKey="bedrooms" defaultLabel="Beds" icon={Bed} />
            <FilterButton filterKey="bathrooms" defaultLabel="Baths" icon={Bath} />
            <FilterButton filterKey="amenities" defaultLabel="Amenities" icon={Check} />
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
              onClick={() => scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg border border-gray-200 p-2 hover:bg-gray-50 transition-all hidden sm:block"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          )}
        </div>
      </div>

      {/* Modal Container */}
      {activeModal && (
        <>
          {/* Overlay - High Z-index (Unchanged) */}
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            onClick={handleCancel}
            aria-hidden="true"
          />

          {/* Modal Panel - Z-index must be higher than overlay (Unchanged) */}
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
                {/* Modal Header (Unchanged) */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                  <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
                    {activeModal === 'propertyType' && 'Select Property Type'}
                    {activeModal === 'propertyFor' && 'Listing Status'}
                    {activeModal === 'price' && 'Price Range'}
                    {activeModal === 'bedrooms' && 'Bedrooms'}
                    {activeModal === 'bathrooms' && 'Bathrooms'}
                    {activeModal === 'amenities' && 'Amenities & Features'}
                    {activeModal === 'more' && 'Additional Filters'}
                  </h3>
                  <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Close filters modal"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Scrollable content area */}
                <div className="overflow-y-auto flex-1 p-6">
                  {activeModal === 'propertyType' && (
                    <PropertyTypeModal
                      filters={filters}
                      applyImmediate={applyImmediate}
                      activePropertyCategory={activePropertyCategory}
                      setActivePropertyCategory={setActivePropertyCategory}
                    />
                  )}
                  {activeModal === 'propertyFor' && (
                    <PropertyForModal filters={filters} applyImmediate={applyImmediate} />
                  )}
                  {/* PRICE MODAL: Now passes tempFilters and handleTempFilterChange */}
                  {activeModal === 'price' && (
                    <PriceModal
                      tempFilters={tempFilters}
                      handleTempFilterChange={handleTempFilterChange}
                    />
                  )}
                  {/* BEDROOMS MODAL: Now passes tempFilters and handleTempFilterChange */}
                  {activeModal === 'bedrooms' && (
                    <RangeSelector
                      label="Bedrooms"
                      options={NUM_OPTIONS}
                      minKey="minBedrooms"
                      maxKey="maxBedrooms"
                      tempFilters={tempFilters} // 👈 Use tempFilters
                      handleTempFilterChange={handleTempFilterChange} // 👈 Use temp change handler
                    />
                  )}
                  {/* BATHROOMS MODAL: Now passes tempFilters and handleTempFilterChange */}
                  {activeModal === 'bathrooms' && (
                    <RangeSelector
                      label="Bathrooms"
                      options={NUM_OPTIONS}
                      minKey="minBathrooms"
                      maxKey="maxBathrooms"
                      tempFilters={tempFilters} // 👈 Use tempFilters
                      handleTempFilterChange={handleTempFilterChange} // 👈 Use temp change handler
                    />
                  )}
                  {activeModal === 'amenities' && (
                    <AmenitiesModal filters={filters} handleAmenityToggle={handleAmenityToggle} />
                  )}
                  {/* MORE FILTERS MODAL: Now passes tempFilters and handleTempFilterChange */}
                  {activeModal === 'more' && (
                    <MoreFiltersModal
                      tempFilters={tempFilters} // 👈 Use tempFilters
                      handleTempFilterChange={handleTempFilterChange} // 👈 Use temp change handler
                    />
                  )}
                </div>

                {/* Modal Footer (Only for Multi-Input Modals) */}
                {MODALS_THAT_REQUIRE_APPLY.has(activeModal) && (
                  <div className="flex justify-between items-center p-4 border-t border-gray-200 flex-shrink-0">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    {/* The applyFilters function commits tempFilters to filters state */}
                    <button
                      onClick={() => applyFilters(tempFilters)}
                      className="px-6 py-[8px] text-base font-semibold text-white bg-blue-600 rounded-[50px] hover:bg-blue-700 transition-colors shadow-md"
                    >
                      Show Results
                    </button>

                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterSection;