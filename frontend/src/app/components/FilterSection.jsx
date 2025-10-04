"use client"
import React, { useState } from 'react'
import { Search, MapPin, Home, DollarSign, Bed, Bath, Square, Calendar, ChevronDown, X, SlidersHorizontal } from 'lucide-react'
import { MdAttachMoney } from "react-icons/md";

const FilterSection = () => {
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    priceRange: [0, 5000000],
    bedrooms: '',
    bathrooms: '',
    minArea: '',
    maxArea: '',
    listingType: 'buy',
    yearBuilt: '',
    amenities: []
  })

  const [isExpanded, setIsExpanded] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  const propertyTypes = ['House', 'Apartment', 'Condo', 'Townhouse', 'Villa', 'Studio']
  const bedroomOptions = ['1', '2', '3', '4', '5+']
  const bathroomOptions = ['1', '2', '3', '4+']
  const yearRanges = ['2020-2024', '2015-2019', '2010-2014', '2005-2009', 'Before 2005']
  const amenities = ['Parking', 'Swimming Pool', 'Gym', 'Garden', 'Balcony', 'Elevator', 'Security', 'Pet Friendly']

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const clearFilters = () => {
    setFilters({
      location: '',
      propertyType: '',
      priceRange: [0, 5000000],
      bedrooms: '',
      bathrooms: '',
      minArea: '',
      maxArea: '',
      listingType: 'buy',
      yearBuilt: '',
      amenities: []
    })
  }

  const formatPrice = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value}`
  }

  return (
    <div className="bg-white w-[350px] border-r border-gray-300 h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-300 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-blue-600" />
            Filters
          </h2>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Clear All
          </button>
        </div>
        
        {/* Listing Type Toggle */}
        <div className="flex bg-white rounded-[50px] p-1 shadow-sm border">
          {['buy', 'rent'].map((type) => (
            <button
              key={type}
              onClick={() => handleFilterChange('listingType', type)}
              className={`flex-1 py-2 px-4 rounded-[50px] text-[14px] font-[600] capitalize transition-all duration-200 ${
                filters.listingType === type
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* BASIC FILTERS SECTION */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-blue-600"></div>
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Basic Filters</h3>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Location Search */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-300">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-blue-600" />
              Location
            </label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="City, neighborhood, or address"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-300">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <Home size={16} className="text-blue-600" />
              Property Type
            </label>
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'propertyType' ? null : 'propertyType')}
                className="w-full py-3 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-left flex items-center justify-between hover:border-blue-300"
              >
                <span className={filters.propertyType ? 'text-gray-900' : 'text-gray-500'}>
                  {filters.propertyType || 'All Types'}
                </span>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-400 transition-transform duration-200 ${
                    activeDropdown === 'propertyType' ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {activeDropdown === 'propertyType' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  <div
                    onClick={() => {
                      handleFilterChange('propertyType', '')
                      setActiveDropdown(null)
                    }}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors text-gray-700 border-b border-gray-300"
                  >
                    All Types
                  </div>
                  {propertyTypes.map(type => (
                    <div
                      key={type}
                      onClick={() => {
                        handleFilterChange('propertyType', type)
                        setActiveDropdown(null)
                      }}
                      className={`px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors ${
                        filters.propertyType === type 
                          ? 'bg-blue-50 text-blue-700 font-medium' 
                          : 'text-gray-700'
                      }`}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PRICE & SIZE SECTION */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-green-600"></div>
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Price & Size</h3>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Price Range */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-300">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-[4px] mb-3">
              <MdAttachMoney size={18} className="text-green-600" />
              Price Range
            </label>
            <div className="px-2">
              <input
                type="range"
                min="0"
                max="5000000"
                step="50000"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>$0</span>
                <span className="font-medium text-green-600">{formatPrice(filters.priceRange[1])}</span>
              </div>
            </div>
          </div>

          {/* Area Range */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-300">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <Square size={16} className="text-green-600" />
              Area (sq ft)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min"
                value={filters.minArea}
                onChange={(e) => handleFilterChange('minArea', e.target.value)}
                className="py-2.5 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxArea}
                onChange={(e) => handleFilterChange('maxArea', e.target.value)}
                className="py-2.5 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              />
            </div>
          </div>
        </div>

        {/* ROOM CONFIGURATION SECTION */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-purple-600"></div>
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Room Configuration</h3>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <Bed size={14} className="text-purple-600" />
                  Beds
                </label>
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === 'bedrooms' ? null : 'bedrooms')}
                    className="w-full py-2.5 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white text-left flex items-center justify-between hover:border-blue-300 transition-all"
                  >
                    <span className={filters.bedrooms ? 'text-gray-900' : 'text-gray-500'}>
                      {filters.bedrooms || 'Any'}
                    </span>
                    <ChevronDown 
                      size={16} 
                      className={`text-gray-400 transition-transform duration-200 ${
                        activeDropdown === 'bedrooms' ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  {activeDropdown === 'bedrooms' && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div
                        onClick={() => {
                          handleFilterChange('bedrooms', '')
                          setActiveDropdown(null)
                        }}
                        className="px-3 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors text-sm text-gray-700 border-b border-gray-300"
                      >
                        Any
                      </div>
                      {bedroomOptions.map(bed => (
                        <div
                          key={bed}
                          onClick={() => {
                            handleFilterChange('bedrooms', bed)
                            setActiveDropdown(null)
                          }}
                          className={`px-3 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors text-sm ${
                            filters.bedrooms === bed 
                              ? 'bg-blue-50 text-blue-700 font-medium' 
                              : 'text-gray-700'
                          }`}
                        >
                          {bed}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <Bath size={14} className="text-purple-600" />
                  Baths
                </label>
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === 'bathrooms' ? null : 'bathrooms')}
                    className="w-full py-2.5 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white text-left flex items-center justify-between hover:border-blue-300 transition-all"
                  >
                    <span className={filters.bathrooms ? 'text-gray-900' : 'text-gray-500'}>
                      {filters.bathrooms || 'Any'}
                    </span>
                    <ChevronDown 
                      size={16} 
                      className={`text-gray-400 transition-transform duration-200 ${
                        activeDropdown === 'bathrooms' ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  {activeDropdown === 'bathrooms' && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div
                        onClick={() => {
                          handleFilterChange('bathrooms', '')
                          setActiveDropdown(null)
                        }}
                        className="px-3 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors text-sm text-gray-700 border-b border-gray-300"
                      >
                        Any
                      </div>
                      {bathroomOptions.map(bath => (
                        <div
                          key={bath}
                          onClick={() => {
                            handleFilterChange('bathrooms', bath)
                            setActiveDropdown(null)
                          }}
                          className={`px-3 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors text-sm ${
                            filters.bathrooms === bath 
                              ? 'bg-blue-50 text-blue-700 font-medium' 
                              : 'text-gray-700'
                          }`}
                        >
                          {bath}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ADVANCED FILTERS SECTION */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-orange-600"></div>
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Advanced Filters</h3>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-300">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full p-4 text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-orange-600" />
                More Options
              </span>
              <ChevronDown 
                size={16} 
                className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {isExpanded && (
              <div className="px-4 pb-4 space-y-4 border-t border-gray-200 mt-2 pt-4">
                {/* Year Built */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar size={16} className="text-orange-600" />
                    Year Built
                  </label>
                              <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'propertyType' ? null : 'propertyType')}
                className="w-full py-3 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-left flex items-center justify-between hover:border-blue-300"
              >
                <span className={filters.propertyType ? 'text-gray-900' : 'text-gray-500'}>
                  {filters.propertyType || 'All Types'}
                </span>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-400 transition-transform duration-200 ${
                    activeDropdown === 'propertyType' ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {activeDropdown === 'propertyType' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  <div
                    onClick={() => {
                      handleFilterChange('propertyType', '')
                      setActiveDropdown(null)
                    }}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors text-gray-700 border-b border-gray-300"
                  >
                    Any year
                  </div>
                  {yearRanges.map(type => (
                    <div
                      key={type}
                      onClick={() => {
                        handleFilterChange('propertyType', type)
                        setActiveDropdown(null)
                      }}
                      className={`px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors ${
                        filters.propertyType === type 
                          ? 'bg-blue-50 text-blue-700 font-medium' 
                          : 'text-gray-700'
                      }`}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>
                </div>

                {/* Amenities */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Amenities</label>
                  <div className="grid grid-cols-1 gap-[8px]">
                    {amenities.map(amenity => (
                      <label key={amenity} className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #16a34a;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(22, 163, 74, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #16a34a;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(22, 163, 74, 0.3);
        }
      `}</style>
    </div>
  )
}

export default FilterSection