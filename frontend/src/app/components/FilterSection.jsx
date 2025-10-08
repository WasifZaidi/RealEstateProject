"use client"
import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  X,
  Home,
  DollarSign,
  Bed,
  Bath,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FaBuilding, FaCity, FaHome, FaIndustry, FaMapMarkedAlt, FaTree, FaWarehouse } from 'react-icons/fa';


const FilterSection = ({ onApplyFilters }) => {
  const scrollContainerRef = useRef(null);
  const modalContentRef = useRef(null);
  const previousFiltersRef = useRef(null);

  const [filters, setFilters] = useState({
    propertyType: '',
    propertyFor: '',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    maxBedrooms: '',
    minBathrooms: '',
    maxBathrooms: '',
    minSize: '',
    maxSize: '',
    state: '',
    city: '',
    amenities: [],
    yearBuiltFrom: '',
    yearBuiltTo: '',
  });

  const [activeModal, setActiveModal] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activePropertyCategory,  setActivePropertyCategory] = useState("Residential")

  const modalsThatRequireApply = new Set(['price', 'more']);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
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
        const el = modalContentRef.current?.querySelector('button, input, [tabindex]');
        if (el) el.focus();
      });
    }
  }, [activeModal]);

  useEffect(() => {
    // ESC key to close modal (and restore if needed)
    const onKey = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };
    if (activeModal) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeModal, filters]);

  // URL sync helpers
  const buildQueryString = (f) => {
    const params = new URLSearchParams();
    if (f.propertyType) params.set('propertyType', f.propertyType);
    if (f.propertyFor) params.set('propertyFor', f.propertyFor);
    if (f.minPrice) params.set('minPrice', f.minPrice);
    if (f.maxPrice) params.set('maxPrice', f.maxPrice);
    if (f.minBedrooms) params.set('beds', f.minBedrooms);
    if (f.minBathrooms) params.set('baths', f.minBathrooms);
    if (f.minSize) params.set('minSize', f.minSize);
    if (f.maxSize) params.set('maxSize', f.maxSize);
    if (f.state) params.set('state', f.state);
    if (f.city) params.set('city', f.city);
    if (Array.isArray(f.amenities) && f.amenities.length) params.set('amenities', f.amenities.join(','));
    if (f.yearBuiltFrom) params.set('yearFrom', f.yearBuiltFrom);
    if (f.yearBuiltTo) params.set('yearTo', f.yearBuiltTo);
    return params.toString();
  };

  const router = useRouter();

  const updateUrlAndNavigate = (f) => {
    try {
      const qs = buildQueryString(f);
      const newPath = window.location.pathname + (qs ? `?${qs}` : '');
      router.replace(newPath);
    } catch (err) {
      window.history.replaceState({}, '', window.location.pathname + (qs ? `?${qs}` : ''));
    }
  };


  const applyFilters = (nextFilters = null) => {
    const toApply = nextFilters || filters;
    updateUrlAndNavigate(toApply);
    setActiveModal(null);
  };



  const handleCancel = () => {
    // If modal required apply (two-step) then restore previous snapshot
    if (activeModal && modalsThatRequireApply.has(activeModal)) {
      if (previousFiltersRef.current) setFilters(previousFiltersRef.current);
    }
    setActiveModal(null);
  };

  const openModal = (key) => {
    // For two-step modals, snapshot current filters so Cancel can restore
    if (modalsThatRequireApply.has(key)) previousFiltersRef.current = { ...filters };
    setActiveModal((cur) => (cur === key ? null : key));
  };

  // immediate apply helper: compute new filters, set state, update URL and notify
  const applyImmediate = (patch) => {
    const next = { ...filters, ...patch };

    console.log(next, "next")
    setFilters(next);
    // trigger server render with new URL
    updateUrlAndNavigate(next);
  };






 const propertyTypes = {
        Residential: [
            { id: "apartment", label: "Apartment", category: "Residential", icon: FaBuilding },
            { id: "house", label: "House", category: "Residential", icon: FaHome },
            { id: "villa", label: "Villa", category: "Residential", icon: FaCity },
            { id: "condo", label: "Condo", category: "Residential", icon: FaBuilding },
            { id: "townhouse", label: "Townhouse", category: "Residential", icon: FaHome },
        ],
        Plot: [
            { id: "commercial-plot", label: "Commercial Plot", category: "Plot", icon: FaMapMarkedAlt },
            { id: "residential-plot", label: "Residential Plot", category: "Plot", icon: FaTree },
            { id: "agricultural-plot", label: "Agricultural Plot", category: "Plot", icon: FaTree },
            { id: "industrial-plot", label: "Industrial Plot", category: "Plot", icon: FaBuilding },
        ],
        Commercial: [
            { id: "office", label: "Office", category: "Commercial", icon: FaBuilding },
            { id: "shop", label: "Shop", category: "Commercial", icon: FaMapMarkedAlt },
            { id: "mall", label: "Mall", category: "Commercial", icon: FaCity },
            { id: "restaurant", label: "Restaurant", category: "Commercial", icon: FaBuilding },
        ],
        Industrial: [
            { id: "factory", label: "Factory", category: "Industrial", icon: FaIndustry },
            { id: "warehouse", label: "Warehouse", category: "Industrial", icon: FaWarehouse },
            { id: "plant", label: "Plant", category: "Industrial", icon: FaIndustry },
        ],
    };
  const propertyForOptions = [
    { value: 'Sell', label: 'For Sell' },
    { value: 'Rent', label: 'For Rent' },
    { value: 'Lease', label: 'For Lease' }
  ];

  const amenitiesOptions = [
    { value: 'balcony', label: 'Balcony', icon: '🏖️' },
    { value: 'garden', label: 'Garden', icon: '🌱' },
    { value: 'fireplace', label: 'Fireplace', icon: '🔥' },
    { value: 'pool', label: 'Swimming Pool', icon: '🏊' },
    { value: 'modern-kitchen', label: 'Modern Kitchen', icon: '🍽️' },
    { value: 'dishwasher', label: 'Dishwasher', icon: '🧼' },
    { value: 'ac', label: 'Air Conditioning', icon: '❄️' },
    { value: 'heating', label: 'Heating', icon: '🌡️' },
    { value: 'washer-dryer', label: 'Washer/Dryer', icon: '👕' },
    { value: 'security-system', label: 'Security System', icon: '🛡️' },
    { value: 'gated-community', label: 'Gated Community', icon: '🔒' },
    { value: 'cctv', label: 'CCTV', icon: '📹' },
    { value: 'parking', label: 'Parking', icon: '🚗' },
    { value: 'garage', label: 'Garage', icon: '🏠' },
    { value: 'furnished', label: 'Furnished', icon: '🛋️' },
    { value: 'pet-friendly', label: 'Pet Friendly', icon: '🐾' },
    { value: 'wheelchair-accessible', label: 'Wheelchair Access', icon: '♿' },
    { value: 'high-speed-internet', label: 'High-Speed Internet', icon: '📶' },
    { value: 'smart-home', label: 'Smart Home', icon: '🏡' },
  ];

  const bedroomOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5+' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // For amenities we want immediate apply when user toggles
  const amenityTimerRef = useRef(null);

  // replace your existing handleAmenityToggle with this:
  const handleAmenityToggle = (amenity) => {
    // build new amenities array
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];

    // update local state immediately for instant UI feedback
    setFilters(prev => ({ ...prev, amenities: newAmenities }));

    // debounce navigation to avoid many router replaces
    clearTimeout(amenityTimerRef.current);
    amenityTimerRef.current = setTimeout(() => {
      // you likely have a buildQueryString helper inside the component
      const qs = buildQueryString({ ...filters, amenities: newAmenities });
      const newPath = window.location.pathname + (qs ? `?${qs}` : '');
      router.replace(newPath, { scroll: false }); // triggers server re-render
      // optional: call parent callback too
      if (onApplyFilters) onApplyFilters({ ...filters, amenities: newAmenities });
    }, 250); // 200-300ms is a good sweet spot
  };

  // cleanup on unmount
  useEffect(() => {
    return () => clearTimeout(amenityTimerRef.current);
  }, []);

  const hasActiveFilters = Object.entries(filters).some(([key, value]) =>
    value && (Array.isArray(value) ? value.length > 0 : true)
  );

  const getFilterLabel = (filterKey) => {
    switch (filterKey) {
      case 'propertyType':
              const allTypes = Object.values(propertyTypes).flat();
      return allTypes.find(t => t.id === filters.propertyType)?.label || 'Type';
      case 'propertyFor':
        return propertyForOptions.find(o => o.value === filters.propertyFor)?.label || 'For';
      case 'price':
        if (filters.minPrice || filters.maxPrice) {
          return `${filters.minPrice || '0'} - ${filters.maxPrice || 'Any'}`;
        }
        return 'Price';
      case 'bedrooms':
        return filters.minBedrooms ? `${filters.minBedrooms}+ Beds` : 'Beds';
      case 'bathrooms':
        return filters.minBathrooms ? `${filters.minBathrooms}+ Baths` : 'Baths';
      case 'amenities':
        return filters.amenities.length > 0 ? `${filters.amenities.length} Amenities` : 'Amenities';
      default:
        return 'More';
    }
  };

  const hasFilterValue = (filterKey) => {
    switch (filterKey) {
      case 'propertyType':
        return !!filters.propertyType;
      case 'propertyFor':
        return !!filters.propertyFor;
      case 'price':
        return !!(filters.minPrice || filters.maxPrice);
      case 'bedrooms':
        return !!filters.minBedrooms;
      case 'bathrooms':
        return !!filters.minBathrooms;
      case 'amenities':
        return filters.amenities.length > 0;
      case 'more':
        return !!(filters.minSize || filters.maxSize || filters.yearBuiltFrom || filters.yearBuiltTo || filters.city || filters.state);
      default:
        return false;
    }
  };

  const FilterButton = ({ filterKey, label, icon: Icon }) => {
    const hasValue = hasFilterValue(filterKey);
    const displayLabel = getFilterLabel(filterKey);

    return (
      <button
        onClick={() => openModal(filterKey)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 whitespace-nowrap font-medium text-sm hover:border-gray-900 hover:shadow-md ${hasValue
          ? 'bg-gray-900 text-white border-gray-900'
          : activeModal === filterKey
            ? 'bg-gray-50 border-gray-900'
            : 'bg-white border-gray-300'
          }`}
      >
        {Icon && <Icon className="h-4 w-4" />}
        <span>{displayLabel}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${activeModal === filterKey ? 'rotate-180' : ''}`} />
      </button>
    );
  };

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative py-4">
          {canScrollLeft && (
            <button
              onClick={() => scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg border border-gray-200 p-2 hover:bg-gray-50 transition-all"
              aria-label="Scroll left"
            >
              <ChevronDown className="h-5 w-5 rotate-90 text-gray-700" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex items-center gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-8"
          >
            <FilterButton filterKey="propertyType" label="Type" icon={Home} />
            <FilterButton filterKey="propertyFor" label="For" />
            <FilterButton filterKey="price" label="Price" icon={DollarSign} />
            <FilterButton filterKey="bedrooms" label="Beds" icon={Bed} />
            <FilterButton filterKey="bathrooms" label="Baths" icon={Bath} />
            <FilterButton filterKey="amenities" label="Amenities" />
            <FilterButton filterKey="more" label="More" icon={SlidersHorizontal} />

            {hasActiveFilters && (
              <button
                onClick={() => {
                  const cleared = {
                    propertyType: '', propertyFor: '', minPrice: '', maxPrice: '',
                    minBedrooms: '', maxBedrooms: '', minBathrooms: '', maxBathrooms: '',
                    minSize: '', maxSize: '', state: '', city: '', amenities: [], yearBuiltFrom: '', yearBuiltTo: ''
                  };
                  setFilters(cleared);
                  applyFilters(cleared);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-all whitespace-nowrap text-sm font-medium"
              >
                <X className="h-4 w-4" />
                Clear all
              </button>
            )}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg border border-gray-200 p-2 hover:bg-gray-50 transition-all"
              aria-label="Scroll right"
            >
              <ChevronDown className="h-5 w-5 -rotate-90 text-gray-700" />
            </button>
          )}
        </div>
      </div>

      {/* overlay */}
      {activeModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={handleCancel}
          aria-hidden
        />
      )}

      {/* modal panel */}
      {activeModal && (
        <div className="absolute left-0 right-0 top-full mt-2 z-40 max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div
              ref={modalContentRef}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[70vh] flex flex-col"
            >
              {/* Header with title and close button */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-900">
                  {activeModal === 'propertyType' && 'Property Type'}
                  {activeModal === 'propertyFor' && 'Property For'}
                  {activeModal === 'price' && 'Price Range'}
                  {activeModal === 'bedrooms' && 'Bedrooms'}
                  {activeModal === 'bathrooms' && 'Bathrooms'}
                  {activeModal === 'amenities' && 'Amenities'}
                  {activeModal === 'more' && 'More Filters'}
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable content area */}
              <div className="overflow-y-auto flex-1">
                <div className="p-6">
                  {/* PROPERTY TYPE (instant apply) */}
                  {/* PROPERTY TYPE (instant apply with category toggler) */}
{activeModal === 'propertyType' && (
  <div className="space-y-4">
    {/* Category Tabs */}
    <div className="flex flex-wrap gap-2 mb-4">
      {Object.keys(propertyTypes).map((category) => (
        <button
          key={category}
          onClick={() => setActivePropertyCategory(category)}
          className={`px-4 py-2 rounded-full font-medium transition-all ${
            activePropertyCategory === category
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>

    {/* Property Type Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {propertyTypes[activePropertyCategory].map((type) => {
        const Icon = type.icon;
        const isSelected = filters.propertyType === type.id;
        return (
          <button
            key={type.id}
            onClick={() => applyImmediate({ propertyType: type.id })}
            className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all w-full ${
              isSelected
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Icon
              className={`h-6 w-6 ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}
            />
            <span
              className={`text-sm font-medium ${
                isSelected ? 'text-gray-900' : 'text-gray-600'
              }`}
            >
              {type.label}
            </span>
          </button>
        );
      })}
    </div>
  </div>
)}

                  {/* PROPERTY FOR (instant) */}
                  {activeModal === 'propertyFor' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        {propertyForOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => applyImmediate({ propertyFor: option.value })}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${filters.propertyFor === option.value
                              ? 'border-gray-900 bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            <span className="font-medium">{option.label}</span>
                            {filters.propertyFor === option.value && <Check className="h-5 w-5 text-gray-900" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PRICE (two-step) */}
                  {activeModal === 'price' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                          <input
                            type="number"
                            placeholder="$ Min"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                          <input
                            type="number"
                            placeholder="$ Max"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 pt-2">
                        {[100000, 250000, 500000, 1000000].map((price) => (
                          <button
                            key={price}
                            onClick={() => handleFilterChange('maxPrice', price.toString())}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${filters.maxPrice === price.toString()
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            ${price >= 1000000 ? `${price / 1000000}M` : `${price / 1000}k`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* BEDROOMS (instant apply) */}
                  {activeModal === 'bedrooms' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-5 gap-3">
                        {bedroomOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => applyImmediate({ minBedrooms: option.value })}
                            className={`py-4 px-4 rounded-xl border-2 text-center font-semibold transition-all ${filters.minBedrooms === option.value
                              ? 'border-gray-900 bg-gray-900 text-white'
                              : 'border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* BATHROOMS (instant apply) */}
                  {activeModal === 'bathrooms' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map((num) => (
                          <button
                            key={num}
                            onClick={() => applyImmediate({ minBathrooms: num.toString() })}
                            className={`py-4 px-4 rounded-xl border-2 text-center font-semibold transition-all ${filters.minBathrooms === num.toString()
                              ? 'border-gray-900 bg-gray-900 text-white'
                              : 'border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            {num}+
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AMENITIES (instant toggle + apply) */}
                  {activeModal === 'amenities' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {amenitiesOptions.map((amenity) => {
                          const isSelected = filters.amenities.includes(amenity.value);
                          return (
                            <button
                              key={amenity.value}
                              onClick={() => handleAmenityToggle(amenity.value)}
                              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${isSelected
                                ? 'border-gray-900 bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                              <span className="text-2xl">{amenity.icon}</span>
                              <span className={`text-xs font-medium text-center ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                                {amenity.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* MORE (two-step: Size, Year, Location) */}
                  {activeModal === 'more' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Square Footage</label>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="number"
                            placeholder="Min sq ft"
                            value={filters.minSize}
                            onChange={(e) => handleFilterChange('minSize', e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                          />
                          <input
                            type="number"
                            placeholder="Max sq ft"
                            value={filters.maxSize}
                            onChange={(e) => handleFilterChange('maxSize', e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Year Built</label>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="number"
                            placeholder="From year"
                            value={filters.yearBuiltFrom}
                            onChange={(e) => handleFilterChange('yearBuiltFrom', e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                          />
                          <input
                            type="number"
                            placeholder="To year"
                            value={filters.yearBuiltTo}
                            onChange={(e) => handleFilterChange('yearBuiltTo', e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Location</label>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="City"
                            value={filters.city}
                            onChange={(e) => handleFilterChange('city', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                          />
                          <input
                            type="text"
                            placeholder="State"
                            value={filters.state}
                            onChange={(e) => handleFilterChange('state', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Fixed footer with Apply/Cancel buttons */}
              <div className="border-t border-gray-200 bg-white p-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 border border-gray-300  rounded-[50px] font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>

                  {modalsThatRequireApply.has(activeModal) ? (
                  <button
  onClick={() => applyFilters()}
  className="flex-1 px-6 py-3 bg-[rgb(0,106,255)] text-white rounded-[50px] font-semibold hover:bg-[rgb(0,80,200)] transition-all"
>
  Apply
</button>

                  ) : (
                    <button
                      onClick={() => setActiveModal(null)}
                      className="flex-1 px-6 py-3 bg-white text-gray-700 rounded-[50px] font-semibold hover:bg-gray-50 transition-all"
                      aria-hidden
                    >
                      Done
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default FilterSection;
