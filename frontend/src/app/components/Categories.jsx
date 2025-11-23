import React from 'react';
import Link from 'next/link';
import { Building2, Home, Trees, Store, ArrowRight } from 'lucide-react';

// ✅ Generate Property Category Structured Data
function generateCategoryStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://realestatepro.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Real Estate Property Categories",
    "description": "Browse different types of properties including apartments, houses, villas, and offices for sale and rent",
    "numberOfItems": 4,
    "itemListOrder": "https://schema.org/ItemListOrderDescending",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "ProductCategory",
          "name": "Apartments",
          "description": "Modern apartments with premium amenities and city views",
          "url": `${baseUrl}/results?propertyType=apartments`,
          "numberOfItems": "1234"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "ProductCategory",
          "name": "Houses",
          "description": "Luxury family homes with spacious living areas",
          "url": `${baseUrl}/results?propertyType=house`,
          "numberOfItems": "856"
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "ProductCategory",
          "name": "Villas",
          "description": "Peaceful countryside estates and rustic retreats",
          "url": `${baseUrl}/results?propertyType=villa`,
          "numberOfItems": "342"
        }
      },
      {
        "@type": "ListItem",
        "position": 4,
        "item": {
          "@type": "ProductCategory",
          "name": "Offices",
          "description": "Premium office spaces and business centers",
          "url": `${baseUrl}/results?propertyType=office`,
          "numberOfItems": "567"
        }
      }
    ]
  };
}

// ✅ Generate Real Estate Service Schema
function generateRealEstateServiceSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://realestatepro.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Real Estate Services",
    "provider": {
      "@type": "RealEstateAgent",
      "name": "RealEstatePro"
    },
    "description": "Comprehensive real estate services including property sales, rentals, and investment consulting across multiple property types",
    "areaServed": "United States",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Property Categories",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Apartment Listings",
            "description": "Browse modern apartment listings with premium amenities"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "House Listings", 
            "description": "Explore luxury family homes and residential properties"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Villa Listings",
            "description": "Discover countryside estates and luxury villas"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Office Listings",
            "description": "Find premium commercial office spaces"
          }
        }
      ]
    }
  };
}

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: 'Apartments',
      linkhref: "apartments",
      icon: Building2,
      description: 'Modern apartments with premium amenities and city views',
      count: '1,234',
      gradient: 'from-blue-500 via-blue-600 to-cyan-500',
      bgGradient: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      schemaType: 'Apartment'
    },
    {
      id: 2,
      name: 'Houses',
      linkhref: "house",
      icon: Home,
      description: 'Luxury family homes with spacious living areas',
      count: '856',
      gradient: 'from-emerald-500 via-green-600 to-teal-500',
      bgGradient: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-200',
      schemaType: 'SingleFamilyResidence'
    },
    {
      id: 3,
      name: 'Villas',
      linkhref: "villa",
      icon: Trees,
      description: 'Peaceful countryside estates and rustic retreats',
      count: '342',
      gradient: 'from-amber-500 via-orange-600 to-yellow-500',
      bgGradient: 'bg-gradient-to-br from-amber-50 to-yellow-50',
      borderColor: 'border-amber-200',
      schemaType: 'VacationRental'
    },
    {
      id: 4,
      name: 'Offices',
      linkhref: "office",
      icon: Store,
      description: 'Premium office spaces and business centers',
      count: '567',
      gradient: 'from-purple-500 via-violet-600 to-fuchsia-500',
      bgGradient: 'bg-gradient-to-br from-purple-50 to-fuchsia-50',
      borderColor: 'border-purple-200',
      schemaType: 'OfficeBuilding'
    }
  ];

  const categoryStructuredData = generateCategoryStructuredData();
  const serviceStructuredData = generateRealEstateServiceSchema();

  return (
    <>
      {/* ✅ Structured Data for Property Categories */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryStructuredData) }}
        key="category-schema"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }}
        key="service-schema"
      />

      {/* ✅ Semantic Section with Proper Landmark */}
      <section 
        className="py-20 bg-gradient-to-b from-white to-gray-50/30"
        aria-labelledby="property-categories-heading"
        itemScope
        itemType="https://schema.org/ItemList"
        role="region"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* ✅ Header Section with Semantic Markup */}
          <header className="text-center mb-16">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6"
              itemProp="description"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full" aria-hidden="true"></div>
              <span className="text-sm font-medium text-blue-700">Property Types</span>
            </div>
            <h2 
              id="property-categories-heading"
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              itemProp="name"
            >
              Explore Our <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Premium</span> Collection
            </h2>
            <p 
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              itemProp="description"
            >
              Discover exceptional properties tailored to your lifestyle. From urban apartments to countryside estates, find your perfect property type.
            </p>
          </header>

          {/* ✅ Categories Grid with Semantic List */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 max-w-7xl mx-auto"
            role="list"
            aria-label="Property type categories"
          >
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  role="listitem"
                  itemScope
                  itemType="https://schema.org/ProductCategory"
                  className="group relative h-full flex flex-col"
                >
                  <Link
                    href={`/results?propertyType=${encodeURIComponent(category.linkhref)}`}
                    passHref
                    legacyBehavior
                  >
                    <a 
                      className="block h-full"
                      aria-label={`Browse ${category.count} ${category.name.toLowerCase()} properties - ${category.description}`}
                      itemProp="url"
                    >
                      {/* ✅ Card with Semantic Markup */}
                      <div 
                        className={`relative bg-white rounded-3xl shadow-lg hover:shadow-2xl 
                          border ${category.borderColor} border-opacity-50
                          transition-all duration-500 ease-out
                          transform group-hover:scale-105 group-hover:-translate-y-2
                          overflow-hidden
                          h-full flex flex-col
                          before:absolute before:inset-0 before:bg-gradient-to-br ${category.gradient} before:opacity-0 before:transition-opacity before:duration-500 before:group-hover:opacity-5
                        `}
                        itemScope
                        itemType={`https://schema.org/${category.schemaType}`}
                      >
                        {/* Background Pattern */}
                        <div 
                          className={`absolute inset-0 opacity-30 ${category.bgGradient}`}
                          aria-hidden="true"
                        />

                        <div className="relative z-10 p-8 flex-1 flex flex-col">
                          {/* ✅ Icon with Semantic Meaning */}
                          <div 
                            className={`
                              relative mb-6 p-4 rounded-[50px] 
                              bg-gradient-to-br ${category.gradient}
                              shadow-lg group-hover:shadow-xl
                              w-16 h-16 flex items-center justify-center
                              transform group-hover:scale-110 group-hover:rotate-3
                              transition-all duration-500 ease-out
                              before:absolute before:inset-2 before:rounded-[50px] before:bg-white/20
                            `}
                            itemProp="image"
                            aria-hidden="true"
                          >
                            <IconComponent className="h-8 w-8 text-white relative z-10" />
                          </div>

                          {/* ✅ Content with Schema Markup */}
                          <h3 
                            className="text-2xl font-bold text-gray-900 mb-3"
                            itemProp="name"
                          >
                            {category.name}
                          </h3>
                          <p 
                            className="text-gray-600 mb-6 leading-relaxed text-base flex-1"
                            itemProp="description"
                          >
                            {category.description}
                          </p>

                          {/* ✅ Count & CTA with Schema */}
                          <div 
                            className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors duration-300 mt-auto"
                            role="button"
                            tabIndex={-1}
                          >
                            <div className="flex items-center gap-2">
                              <span 
                                className="text-sm font-semibold text-gray-900"
                                itemProp="numberOfItems"
                              >
                                {category.count}
                              </span>
                              <span className="text-sm text-gray-500">properties</span>
                            </div>
                            <div 
                              className={`
                                flex items-center justify-center 
                                w-10 h-10 rounded-full 
                                bg-gray-100 group-hover:bg-gradient-to-br ${category.gradient}
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

                        {/* Border Glow */}
                        <div 
                          className={`
                            absolute inset-0 rounded-3xl 
                            bg-gradient-to-br ${category.gradient} 
                            opacity-0 group-hover:opacity-10
                            transition-opacity duration-500
                            -z-10
                          `}
                          aria-hidden="true"
                        />
                      </div>

                      {/* External Glow */}
                      <div 
                        className={`
                          absolute inset-0 rounded-3xl 
                          bg-gradient-to-br ${category.gradient} 
                          opacity-0 group-hover:opacity-20
                          blur-xl group-hover:blur-2xl
                          transition-all duration-700 ease-out
                          -z-10 transform group-hover:scale-105
                        `}
                        aria-hidden="true"
                      />
                    </a>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* ✅ Hidden Accessibility Content */}
          <div className="sr-only">
            <h3>Property Type Categories Overview</h3>
            <p>
              Browse our comprehensive collection of property types to find exactly what you're looking for:
            </p>
            <ul>
              <li>
                <strong>Apartments:</strong> Perfect for urban living with modern amenities and convenient locations
              </li>
              <li>
                <strong>Houses:</strong> Ideal for families seeking spacious living areas and private outdoor space
              </li>
              <li>
                <strong>Villas:</strong> Luxury countryside estates offering privacy and premium features
              </li>
              <li>
                <strong>Offices:</strong> Professional commercial spaces for businesses of all sizes
              </li>
            </ul>
            <p>
              Each category features verified listings with detailed information, photos, and expert insights 
              to help you make informed decisions about your next property investment.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Categories;