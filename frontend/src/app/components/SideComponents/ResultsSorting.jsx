"use client";
import React, { useState } from "react";
import { ArrowDownWideNarrow } from "lucide-react";
import MuiDropdown from "../Commons/MuiDropdown"; // adjust path if different

const ResultsSorting = () => {
  const [sortValue, setSortValue] = useState("recommended");

  const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
    { value: "newest", label: "Newest Listings" },
    { value: "oldest", label: "Oldest Listings" },
  ];

  const handleSortChange = (value) => {
    setSortValue(value);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <ArrowDownWideNarrow className="w-5 h-5 text-gray-700" />
        <span className="text-gray-800 font-medium text-[14px]">Sort:</span>
      </div>

      <div className="w-[180px]">
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
