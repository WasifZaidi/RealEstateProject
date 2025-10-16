"use client";
import React, { useState, useMemo } from "react";
import { Us_Data } from "@/constants/Us_Data";
import MuiDropdown from "@/app/components/MuiDropdown";
// Importing Lucide icons
import { SearchIcon, Star, CheckCircle, Headset, MapPin, Building, Navigation, Search, Zap } from 'lucide-react';

// --- Property Type Toggle Component (No Change) ---
const PropertyTypeToggle = ({ options, selected, onChange }) => {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 space-x-1 border border-gray-200">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`
                        flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-all duration-200 ease-in-out
                        ${selected === option
              ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
              : "text-gray-700 hover:bg-gray-200"
            }
                    `}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
// ------------------------------------------

export const Hero = () => {
  const [selectedSection, setSelectedSection] = useState("Buy");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");

  const sectionOptions = useMemo(() => ["Buy", "Rent", "Sell"], []);
  const stateOptions = useMemo(() => Us_Data.map((s) => s.state), []);

  // Filter city options (Logic remains the same)
  const cityOptions = useMemo(() => {
    if (selectedState) {
      const state = Us_Data.find((s) => s.state === selectedState);
      return state ? state.cities.map((c) => c.name) : [];
    }
    if (selectedNeighborhood) {
      const match = Us_Data.flatMap((s) =>
        s.cities.filter((c) => c.neighborhoods.includes(selectedNeighborhood))
      );
      return match.map((c) => c.name);
    }
    return Us_Data.flatMap((s) => s.cities.map((c) => c.name));
  }, [selectedState, selectedNeighborhood]);

  // Filter neighborhood options (Logic remains the same)
  const neighborhoodOptions = useMemo(() => {
    if (selectedCity) {
      const city = Us_Data.flatMap((s) => s.cities).find(
        (c) => c.name === selectedCity
      );
      return city ? city.neighborhoods : [];
    }
    if (selectedState) {
      const state = Us_Data.find((s) => s.state === selectedState);
      return state
        ? state.cities.flatMap((c) => c.neighborhoods)
        : [];
    }
    return Us_Data.flatMap((s) =>
      s.cities.flatMap((c) => c.neighborhoods)
    );
  }, [selectedState, selectedCity]);

  const handleNeighborhoodChange = (value) => {
    setSelectedNeighborhood(value);
    const matchedState = Us_Data.find((s) =>
      s.cities.some((c) => c.neighborhoods.includes(value))
    );
    const matchedCity = matchedState?.cities.find((c) =>
      c.neighborhoods.includes(value)
    );
    if (matchedState) setSelectedState(matchedState.state);
    if (matchedCity) setSelectedCity(matchedCity.name);
  };

  const handleSearch = () => {
    const filters = { selectedSection, selectedState, selectedCity, selectedNeighborhood };
    console.log("Searching with filters:", filters);
    // Add your actual search/navigation logic here
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-hero bg-cover bg-center bg-no-repeat">
      {/* Classy Gradient Overlay */}
      <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-blue-900/40 via-black/40 to-black/30"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white py-20 px-4 w-[1100px] mx-auto">
        <h1 className="text-5xl md:text-7xl font-black mb-4 leading-snug tracking-tight">
          Find Your Dream <span className="text-blue-300">Home</span>.
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto font-light text-white/90">
          Explore millions of verified listings and expert-backed insights.
        </p>

        {/* --- Search Filter Bar --- */}
        {/* --- Modern Search Filter Bar --- */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-blue-500/15 p-6 md:p-7 max-w-7xl mx-auto border border-blue-100/50 backdrop-blur-sm bg-white/95">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 items-end">

            {/* State Dropdown */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase text-gray-600 tracking-wide flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                State
              </label>
              <div className="relative group">
                <MuiDropdown
                  placeholder="Select State"
                  options={stateOptions}
                  value={selectedState}
                  onChange={(value) => {
                    setSelectedState(value);
                    setSelectedCity("");
                    setSelectedNeighborhood("");
                  }}
                  customClasses="h-[48px] border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 group-hover:border-blue-300 bg-white/80 shadow-sm"
                />
              </div>
            </div>

            {/* City Dropdown */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase text-gray-600 tracking-wide flex items-center gap-2 mb-2">
                <Building className="w-4 h-4 text-blue-500" />
                City
              </label>
              <div className="relative group">
                <MuiDropdown
                  placeholder="Select City"
                  options={cityOptions}
                  value={selectedCity}
                  onChange={(value) => {
                    setSelectedCity(value);
                    const matchedState = Us_Data.find((s) =>
                      s.cities.some((c) => c.name === value)
                    );
                    if (matchedState) setSelectedState(matchedState.state);
                    setSelectedNeighborhood("");
                  }}
                  customClasses="h-[48px] border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 group-hover:border-blue-300 bg-white/80 shadow-sm"
                />
              </div>
            </div>

            {/* Neighborhood Dropdown */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase text-gray-600 tracking-wide flex items-center gap-2 mb-2">
                <Navigation className="w-4 h-4 text-blue-500" />
                Neighborhood
              </label>
              <div className="relative group">
                <MuiDropdown
                  placeholder="Select Area"
                  options={neighborhoodOptions}
                  value={selectedNeighborhood}
                  onChange={handleNeighborhoodChange}
                  customClasses="h-[48px] border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 group-hover:border-blue-300 bg-white/80 shadow-sm"
                />
              </div>
            </div>

            {/* Search Button - Original Style */}
            <div className="mt-2 sm:mt-0">
              <label className="hidden sm:block text-xs font-semibold uppercase text-gray-600 tracking-wide mb-2 opacity-0">Search</label>
              <button
                onClick={handleSearch}
                className="group relative flex items-center justify-center w-full gap-3 px-4 py-3 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[50px] font-semibold overflow-hidden transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                aria-label="Start property search"
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                {/* Content */}
                <Search className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                <span className="relative z-10 whitespace-nowrap transition-all duration-300 group-hover:tracking-wide text-sm">
                  Search Now
                </span>
              </button>
            </div>
          </div>

        </div>
        {/* --- End Search Filter Bar --- */}


      </div>
    </div>
  );
};