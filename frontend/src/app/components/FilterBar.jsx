// components/FilterBar.jsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';

const FilterBar = () => {
  const [activeFilters, setActiveFilters] = useState({
    propertyType: '',
    priceRange: '',
    bedrooms: '',
    sortBy: 'newest'
  });

  const propertyTypes = [
    { value: 'house', label: 'House', count: 1243 },
    { value: 'apartment', label: 'Apartment', count: 856 },
    { value: 'condo', label: 'Condo', count: 432 }
  ];

  const priceRanges = [
    { value: '0-100000', label: 'Under $100k' },
    { value: '100000-250000', label: '$100k-$250k' },
    { value: '250000-500000', label: '$250k-$500k' }
  ];

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilter = (filterType) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: ''
    }));
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      {/* Main Filter Bar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Filter Buttons */}
          <div className="flex items-center gap-2 flex-1 overflow-x-auto">
            
            {/* Property Type Filter */}
            <FilterDropdown
              label="Property Type"
              value={activeFilters.propertyType}
              options={propertyTypes}
              onChange={(value) => handleFilterChange('propertyType', value)}
              onClear={() => clearFilter('propertyType')}
            />
            
            {/* Price Range Filter */}
            <FilterDropdown
              label="Price Range"
              value={activeFilters.priceRange}
              options={priceRanges}
              onChange={(value) => handleFilterChange('priceRange', value)}
              onClear={() => clearFilter('priceRange')}
            />
            
            {/* Bedrooms Filter */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1.5">
              <span className="text-sm font-medium text-gray-700">Beds:</span>
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => handleFilterChange('bedrooms', num.toString())}
                  className={`px-2 py-1 rounded-full text-sm transition-colors ${
                    activeFilters.bedrooms === num.toString() 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {num}+
                </button>
              ))}
            </div>

          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select 
              value={activeFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filters Bar */}
      <ActiveFiltersBar 
        activeFilters={activeFilters} 
        onClearFilter={clearFilter}
        propertyTypes={propertyTypes}
        priceRanges={priceRanges}
      />
    </div>
  );
};

// Filter Dropdown Component
const FilterDropdown = ({ label, value, options, onChange, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
          value 
            ? 'bg-blue-50 border-blue-200 text-blue-700' 
            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
        }`}
      >
        <span>{selectedOption ? selectedOption.label : label}</span>
        {value && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="hover:bg-blue-200 rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2">
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center ${
                value === option.value ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              <span>{option.label}</span>
              {option.count && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {option.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Active Filters Display
const ActiveFiltersBar = ({ activeFilters, onClearFilter, propertyTypes, priceRanges }) => {
  const hasActiveFilters = Object.values(activeFilters).some(value => value && value !== 'newest');

  if (!hasActiveFilters) return null;

  const getFilterLabel = (type, value) => {
    switch (type) {
      case 'propertyType':
        return propertyTypes.find(opt => opt.value === value)?.label;
      case 'priceRange':
        return priceRanges.find(opt => opt.value === value)?.label;
      case 'bedrooms':
        return `${value}+ beds`;
      default:
        return value;
    }
  };

  return (
    <div className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {Object.entries(activeFilters).map(([key, value]) => 
            value && key !== 'sortBy' && (
              <span
                key={key}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
              >
                {getFilterLabel(key, value)}
                <button
                  onClick={() => onClearFilter(key)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )
          )}
          <button
            onClick={() => {
              Object.keys(activeFilters).forEach(key => {
                if (key !== 'sortBy') onClearFilter(key);
              });
            }}
            className="text-sm text-gray-500 hover:text-gray-700 ml-2"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;