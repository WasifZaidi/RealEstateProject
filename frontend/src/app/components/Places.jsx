import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';
import { outfit } from '@/utils/fonts';
import { BLUE_PLACEHOLDER } from '@/utils/blueplaceholder';

// ✅ Generate Local Business Structured Data for Popular Cities
function generateLocalBusinessStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://realestatepro.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Popular US Cities for Real Estate",
    "description": "Discover premium real estate properties in top US cities including Austin, New York, Los Angeles, and Chicago",
    "numberOfItems": 4,
    "itemListOrder": "https://schema.org/ItemListOrderDescending",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "City",
          "name": "Austin",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Austin",
            "addressRegion": "Texas",
            "addressCountry": "US"
          },
          "description": "Discover 1,892+ properties in Austin, Texas - a thriving real estate market"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "City",
          "name": "New York",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "New York",
            "addressRegion": "New York",
            "addressCountry": "US"
          },
          "description": "Explore 2,345+ premium properties in New York City"
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "City",
          "name": "Los Angeles",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Los Angeles",
            "addressRegion": "California",
            "addressCountry": "US"
          },
          "description": "Browse 3,127+ luxury properties in Los Angeles, California"
        }
      },
      {
        "@type": "ListItem",
        "position": 4,
        "item": {
          "@type": "City",
          "name": "Chicago",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Chicago",
            "addressRegion": "Illinois",
            "addressCountry": "US"
          },
          "description": "Find 1,543+ properties in Chicago, Illinois"
        }
      }
    ]
  };
}

// ✅ Generate Breadcrumb Schema for Locations
function generateLocationBreadcrumbSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://realestatepro.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Locations",
        "item": `${baseUrl}/locations`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Popular US Cities",
        "item": `${baseUrl}/#popular-cities`
      }
    ]
  };
}

const Places = () => {
  const places = [
    {
      city: 'Austin',
      state: 'Texas',
      img: '/temp_img/Places/dubai.jpg',
      properties: '1,892',
      gradient: 'from-amber-500 via-orange-600 to-yellow-500',
      color: 'amber',
      description: 'Discover thriving real estate opportunities in Austin, Texas - known for its vibrant culture and growing tech industry'
    },
    {
      city: 'New York',
      state: 'New York',
      img: '/temp_img/Places/london.jpg',
      properties: '2,345',
      gradient: 'from-blue-500 via-blue-600 to-cyan-500',
      color: 'blue',
      description: 'Explore premium properties in New York City - the epicenter of luxury real estate and urban living'
    },
    {
      city: 'Los Angeles',
      state: 'California',
      img: '/temp_img/Places/newyork.jpg',
      properties: '3,127',
      gradient: 'from-purple-500 via-violet-600 to-fuchsia-500',
      color: 'purple',
      description: 'Browse luxury homes and investment properties in Los Angeles, California - the entertainment capital'
    },
    {
      city: 'Chicago',
      state: 'Illinois',
      img: '/temp_img/Places/vegas.jpg',
      properties: '1,543',
      gradient: 'from-emerald-500 via-green-600 to-teal-500',
      color: 'emerald',
      description: 'Find diverse real estate options in Chicago, Illinois - featuring architectural marvels and waterfront properties'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      amber: 'bg-amber-50 border-amber-200 text-amber-700',
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700'
    };
    return colors[color] || colors.blue;
  };

  const localBusinessStructuredData = generateLocalBusinessStructuredData();
  const breadcrumbStructuredData = generateLocationBreadcrumbSchema();

  return (
    <>
      {/* ✅ Structured Data for Locations */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessStructuredData) }}
        key="locations-schema"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        key="locations-breadcrumb-schema"
      />

      {/* ✅ Semantic Section with Proper Landmark */}
      <section 
        id="popular-cities"
        className="py-20 bg-gradient-to-b from-gray-50/50 to-white relative overflow-hidden"
        aria-labelledby="popular-cities-heading"
        itemScope
        itemType="https://schema.org/ItemList"
        role="region"
      >
        {/* Background Decorations */}
        <div 
          className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        />
        <div 
          className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3"
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* ✅ Header Section with Semantic Markup */}
          <header className="text-center mb-16">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6"
              itemProp="description"
            >
              <MapPin className="w-4 h-4 text-blue-600" aria-hidden="true" />
              <span className="text-sm font-medium text-blue-700">Prime Locations</span>
            </div>
            <h2 
              id="popular-cities-heading"
              className={`${outfit.className} text-4xl md:text-5xl font-bold text-gray-900 mb-6`}
              itemProp="name"
            >
              Discover Properties in{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Popular US Cities
              </span>
            </h2>
            <p 
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              itemProp="description"
            >
              Explore premium real estate opportunities in the most sought-after US cities with verified listings and expert market insights
            </p>
          </header>

          {/* ✅ Locations Grid with Semantic List */}
          <div 
            className="cards-wrapper w-full"
            role="list"
            aria-label="Popular US cities with property listings"
          >
            <div className="hidden xl:grid grid-cols-4 gap-6 lg:gap-8">
              {places.map((place, index) => (
                <div
                  key={index}
                  role="listitem"
                  itemScope
                  itemType="https://schema.org/City"
                  className="group relative"
                >
                  <Link
                    href={`/results?state=${encodeURIComponent(place.state)}&city=${encodeURIComponent(place.city)}`}
                    passHref
                    legacyBehavior
                  >
                    <a 
                      className="block h-full"
                      aria-label={`Browse ${place.properties} properties in ${place.city}, ${place.state}`}
                      itemProp="url"
                    >
                      <div 
                        className="
                          relative bg-white rounded-3xl shadow-lg hover:shadow-2xl 
                          border border-gray-200 border-opacity-60
                          transition-all duration-500 ease-out
                          transform group-hover:scale-105 group-hover:-translate-y-2
                          overflow-hidden
                          h-full
                          cursor-pointer
                        "
                        itemScope
                        itemType="https://schema.org/Place"
                      >
                        {/* ✅ Image with Next.js Optimization */}
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={place.img}
                            alt={`${place.city}, ${place.state} skyline and properties`}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                            fill
                            sizes="(max-width: 1280px) 25vw, 300px"
                            quality={85}
                            placeholder="blur"
                            blurDataURL={BLUE_PLACEHOLDER}
                          />
                          <div 
                            className={`absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500`}
                            aria-hidden="true"
                          />
                          <div 
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                            aria-hidden="true"
                          />
                        </div>
                        
                        {/* ✅ Content Section */}
                        <div className="z-10 p-6 flex flex-col">
                          <div className="mb-4">
                            <h3 
                              className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300"
                              itemProp="name"
                            >
                              {place.city}
                            </h3>
                            <div 
                              itemProp="address"
                              itemScope
                              itemType="https://schema.org/PostalAddress"
                              className="sr-only"
                            >
                              <span itemProp="addressLocality">{place.city}</span>
                              <span itemProp="addressRegion">{place.state}</span>
                              <span itemProp="addressCountry">US</span>
                            </div>
                            <div 
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getColorClasses(place.color)} transition-all duration-300 group-hover:scale-105`}
                              itemProp="description"
                            >
                              <MapPin className="w-4 h-4" aria-hidden="true" />
                              <span className="text-sm font-medium">
                                <span itemProp="numberOfProperties">{place.properties}</span> properties
                              </span>
                            </div>
                            <meta itemProp="description" content={place.description} />
                          </div>
                          
                          {/* ✅ Call to Action */}
                          <div 
                            className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors duration-300"
                            role="button"
                            tabIndex={-1}
                          >
                            <span 
                              className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300"
                              aria-hidden="true"
                            >
                              Explore Properties
                            </span>
                            <div 
                              className={`
                                flex items-center justify-center 
                                w-10 h-10 rounded-full 
                                bg-gray-100 group-hover:bg-gradient-to-br ${place.gradient}
                                text-gray-600 group-hover:text-white
                                transform group-hover:scale-110 
                                transition-all duration-300 ease-out
                                shadow-sm group-hover:shadow-lg
                              `}
                              aria-hidden="true"
                            >
                              <ArrowRight className="h-5 w-5 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Hidden Accessibility Content */}
          <div className="sr-only">
            <h3>Property Search by Location</h3>
            <p>
              Browse properties in popular US cities including Austin, New York, Los Angeles, and Chicago. 
              Each location offers unique real estate opportunities with verified listings and local market expertise.
            </p>
            <ul>
              <li>Austin, Texas: 1,892+ properties in a growing tech hub</li>
              <li>New York, New York: 2,345+ premium urban properties</li>
              <li>Los Angeles, California: 3,127+ luxury homes and investments</li>
              <li>Chicago, Illinois: 1,543+ diverse real estate options</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default Places;