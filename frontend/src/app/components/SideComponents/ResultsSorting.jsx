"use client";
import React, { useState, useEffect } from "react";
import { ArrowDownWideNarrow } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import MuiDropdown from "../Commons/MuiDropdown";

const ResultsSorting = ({ searchParams }) => {
  const router = useRouter();
  const params = useSearchParams();
  const [sortValue, setSortValue] = useState("recommended");

  const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
    { value: "newest", label: "Newest Listings" },
    { value: "oldest", label: "Oldest Listings" },
  ];

  // Initialize sort value from URL params
  useEffect(() => {
    const currentSort = params.get('sortBy');
    const currentOrder = params.get('sortOrder');
    
    if (currentSort === 'price.amount' && currentOrder === 'asc') {
      setSortValue('price-low-high');
    } else if (currentSort === 'price.amount' && currentOrder === 'desc') {
      setSortValue('price-high-low');
    } else if (currentSort === 'listedAt' && currentOrder === 'desc') {
      setSortValue('newest');
    } else if (currentSort === 'listedAt' && currentOrder === 'asc') {
      setSortValue('oldest');
    } else {
      setSortValue('recommended');
    }
  }, [params]);

  const handleSortChange = (value) => {
    setSortValue(value);
    
    // Create new URLSearchParams
    const newParams = new URLSearchParams(params.toString());
    
    // Map frontend sort values to backend parameters
    let sortBy = 'listedAt';
    let sortOrder = 'desc';
    
    switch (value) {
      case 'price-low-high':
        sortBy = 'price.amount';
        sortOrder = 'asc';
        break;
      case 'price-high-low':
        sortBy = 'price.amount';
        sortOrder = 'desc';
        break;
      case 'newest':
        sortBy = 'listedAt';
        sortOrder = 'desc';
        break;
      case 'oldest':
        sortBy = 'listedAt';
        sortOrder = 'asc';
        break;
      case 'recommended':
      default:
        // Recommended logic: featured first, then by listing date
        newParams.delete('sortBy');
        newParams.delete('sortOrder');
        break;
    }
    
    // Update URL parameters
    if (value !== 'recommended') {
      newParams.set('sortBy', sortBy);
      newParams.set('sortOrder', sortOrder);
    } else {
      newParams.delete('sortBy');
      newParams.delete('sortOrder');
    }
    
    // Reset to page 1 when changing sort
    newParams.set('page', '1');
    
    // Navigate with updated params
    router.push(`/results?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <ArrowDownWideNarrow className="w-5 h-5 text-gray-700" />
        <span className="text-gray-800 font-medium text-[14px]">Sort:</span>
      </div>

      <div className="w-[200px]">
        <MuiDropdown
          options={sortOptions}
          title=""
          value={sortValue}
          onChange={handleSortChange}
          placeholder="Sort by"
          optionType="object"
        />
      </div>
    </div>
  );
};

export default ResultsSorting;