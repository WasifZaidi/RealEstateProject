"use client";
import React, { useState, useMemo } from "react";
import { Us_Data } from "@/constants/Us_Data";
import MuiDropdown from "@/app/components/MuiDropdown";
import { SearchIcon, Star, CheckCircle, Headset, MapPin, Building, Navigation, Search, Zap } from 'lucide-react';
import { useRouter } from "next/navigation";

// ✅ Structured Data for Hero Section
const generateHeroStructuredData = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://realestatepro.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "RealEstatePro",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?state={state}&city={city}&neighborhood={neighborhood}`,
      "query-input": "required name=state name=city name=neighborhood"
    },
    "description": "Search for properties to buy, rent, or sell across the United States"
  };
};

export const Hero = () => {
  const [selectedSection, setSelectedSection] = useState("Buy");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");

  const sectionOptions = useMemo(() => ["Buy", "Rent", "Sell"], []);
  const stateOptions = useMemo(() => Us_Data.map((s) => s.state), []);

  // ✅ Memoized filtered options for performance
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

  const router = useRouter();

  const handleSearch = () => {
    // ✅ Collect and validate search parameters
    const filters = {
      state: selectedState,
      city: selectedCity,
      neighborhood: selectedNeighborhood,
    };

    // ✅ Remove empty filters and trim whitespace
    const validFilters = Object.entries(filters)
      .filter(([_, value]) => value && value.trim() !== "")
      .reduce((acc, [key, value]) => {
        acc[key] = value.trim();
        return acc;
      }, {});

    // ✅ Create SEO-friendly URL with proper encoding
    const queryString = new URLSearchParams(validFilters).toString();
    
    // ✅ Track search event for analytics (optional)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: `${selectedState} ${selectedCity} ${selectedNeighborhood}`.trim(),
        transaction_type: selectedSection.toLowerCase()
      });
    }

    router.push(`/results?${queryString}`);
  };

  // ✅ Handle keyboard navigation
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const heroStructuredData = generateHeroStructuredData();

  return (
    <>
      {/* ✅ Structured Data for Search Functionality */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(heroStructuredData) }}
        key="hero-search-schema"
      />

      {/* ✅ Semantic Hero Section with Proper Landmark */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-hero bg-cover bg-center bg-no-repeat"
        role="banner"
        aria-labelledby="hero-heading"
        itemScope
        itemType="https://schema.org/RealEstateAgent"
      >
        {/* ✅ Enhanced Gradient Overlay for Accessibility */}
        <div 
          className="absolute inset-0 bg-black/40 bg-gradient-to-t from-blue-900/40 via-black/40 to-black/30"
          aria-hidden="true"
        />

        {/* ✅ Main Content Container */}
        <div className="relative z-10 text-center text-white py-20 px-4 w-full max-w-[1100px] mx-auto">
          
          {/* ✅ Semantic Heading Structure */}
          <header className="mb-12">
            <h1 
              id="hero-heading"
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-snug tracking-tight"
              itemProp="name"
            >
              Find Your Dream <span className="text-blue-300">Home</span>.
            </h1>
            <p 
              className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto font-light text-white/90"
              itemProp="description"
            >
              Explore millions of verified listings and expert-backed insights.
            </p>
          </header>

          {/* ✅ Search Filter Section with ARIA Labels */}
          <div 
            className="bg-white rounded-2xl shadow-2xl shadow-blue-500/15 p-6 md:p-7 max-w-7xl mx-auto border border-blue-100/50 backdrop-blur-sm bg-white/95"
            role="search"
            aria-label="Property search filters"
          >

            {/* ✅ Search Form Grid */}
            <form 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 items-end"
              onSubmit={(e) => e.preventDefault()}
              onKeyPress={handleKeyPress}
            >
              {/* ✅ State Dropdown */}
              <div className="space-y-3">
                <label 
                  htmlFor="state-select"
                  className="text-xs font-semibold uppercase text-gray-600 tracking-wide flex items-center gap-2 mb-2"
                >
                  <MapPin className="w-4 h-4 text-blue-500" aria-hidden="true" />
                  State
                </label>
                <div className="relative group">
                  <MuiDropdown
                    id="state-select"
                    placeholder="Select State"
                    options={stateOptions}
                    value={selectedState}
                    onChange={(value) => {
                      setSelectedState(value);
                      setSelectedCity("");
                      setSelectedNeighborhood("");
                    }}
                    customClasses="h-[48px] border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 group-hover:border-blue-300 bg-white/80 shadow-sm"
                    aria-label="Select state for property search"
                  />
                </div>
              </div>

              {/* ✅ City Dropdown */}
              <div className="space-y-3">
                <label 
                  htmlFor="city-select"
                  className="text-xs font-semibold uppercase text-gray-600 tracking-wide flex items-center gap-2 mb-2"
                >
                  <Building className="w-4 h-4 text-blue-500" aria-hidden="true" />
                  City
                </label>
                <div className="relative group">
                  <MuiDropdown
                    id="city-select"
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
                    aria-label="Select city for property search"
                    disabled={!selectedState}
                  />
                </div>
              </div>

              {/* ✅ Neighborhood Dropdown */}
              <div className="space-y-3">
                <label 
                  htmlFor="neighborhood-select"
                  className="text-xs font-semibold uppercase text-gray-600 tracking-wide flex items-center gap-2 mb-2"
                >
                  <Navigation className="w-4 h-4 text-blue-500" aria-hidden="true" />
                  Neighborhood
                </label>
                <div className="relative group">
                  <MuiDropdown
                    id="neighborhood-select"
                    placeholder="Select Area"
                    options={neighborhoodOptions}
                    value={selectedNeighborhood}
                    onChange={handleNeighborhoodChange}
                    customClasses="h-[48px] border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 group-hover:border-blue-300 bg-white/80 shadow-sm"
                    aria-label="Select neighborhood for property search"
                    disabled={!selectedCity && !selectedState}
                  />
                </div>
              </div>

              {/* ✅ Search Button */}
              <div className="mt-2 sm:mt-0">
                <label className="hidden sm:block text-xs font-semibold uppercase text-gray-600 tracking-wide mb-2 opacity-0">
                  Search Action
                </label>
                <button
                  type="submit"
                  onClick={handleSearch}
                  className="group relative flex items-center justify-center w-full gap-3 px-4 py-3 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[50px] font-semibold overflow-hidden transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                  aria-label={`Search for properties to ${selectedSection.toLowerCase()} in ${selectedState || 'selected locations'}`}
                  disabled={!selectedState && !selectedCity && !selectedNeighborhood}
                >
                  {/* Shine Effect */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                    aria-hidden="true"
                  />

                  {/* Content */}
                  <Search className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                  <span className="relative z-10 whitespace-nowrap transition-all duration-300 group-hover:tracking-wide text-sm">
                    Search Now
                  </span>
                </button>
              </div>
            </form>

            {/* ✅ Quick Search Tips */}
            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>Tip: Start with state selection for best results</p>
            </div>
          </div>

          {/* ✅ Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-400" aria-hidden="true" />
              <span>Verified Listings</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-yellow-400" aria-hidden="true" />
              <span>Expert Reviews</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Headset className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* ✅ Hidden Accessibility Content */}
        <div className="sr-only">
          <p id="search-instructions">
            Use the search filters above to find properties by state, city, or neighborhood. 
            Select your preferred transaction type: buy, rent, or sell.
          </p>
        </div>
      </section>
    </>
  );
};