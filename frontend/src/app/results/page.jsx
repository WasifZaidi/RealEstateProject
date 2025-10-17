import React from 'react';
import { Metadata } from 'next';
import FilterSection from '..//components/FilterSection';
import ListingsGrid from '../components/ListingGrid';
import { fetchListings } from '../../lib/api_utils';
import ResultsSorting from '../components/SideComponents/ResultsSorting';

// Generate metadata for SEO
export async function generateMetadata({ searchParams }) {
  const seoTitle = generateSEOTitle(searchParams);
  const seoDescription = generateSEODescription(searchParams);

  return {
    title: `${seoTitle} | RealEstatePro`,
    description: seoDescription,
    keywords: 'real estate, properties, homes, apartments, buy, rent, lease',
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'website',
      siteName: 'RealEstatePro',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Helper functions for SEO
function generateSEOTitle(params) {
  const parts = [];

  if (params?.city) parts.push(`in ${params.city}`);
  if (params?.propertyType) {
    const typeMap = {
      house: 'Houses',
      apartment: 'Apartments',
      condo: 'Condos',
      villa: 'Villas',
      commercial: 'Commercial Properties',
      land: 'Land'
    };
    parts.push(typeMap[params.propertyType] || `${params.propertyType}s`);
  }
  if (params?.propertyFor) {
    const forMap = {
      sale: 'For Sale',
      rent: 'For Rent',
      lease: 'For Lease'
    };
    parts.push(forMap[params.propertyFor] || `for ${params.propertyFor}`);
  }

  const baseTitle = 'Property Listings';
  return parts.length > 0 ? `${baseTitle} ${parts.join(' ')}` : baseTitle;
}

function generateSEODescription(params) {
  const parts = [];

  if (params?.propertyType) parts.push(params.propertyType);
  if (params?.city) parts.push(`in ${params.city}`);
  if (params?.propertyFor) parts.push(`for ${params.propertyFor}`);

  const baseDescription = 'Find your perfect property from our extensive collection of verified listings.';

  if (parts.length > 0) {
    return `Browse ${parts.join(' ')} properties. ${baseDescription}`;
  }

  return baseDescription;
}

// Main page component
export default async function ResultsPage({ searchParams }) {
  const listingsData = await fetchListings(searchParams)

  const {
    listings = [],
    pagination = {},
    metadata = {}
  } = listingsData.data || {};

  const hasError = !listingsData.success;
  const totalResults = pagination.totalCount || 0;

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: generateSEOTitle(searchParams),
    description: generateSEODescription(searchParams),
    numberOfItems: totalResults,
    itemListElement: listings.map((listing, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'RealEstateListing',
        name: listing.title,
        description: listing.description?.substring(0, 200),
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/properties/${listing._id}`,
        ...(listing.price && {
          offers: {
            '@type': 'Offer',
            price: listing.price.amount,
            priceCurrency: listing.price.currency || 'USD'
          }
        })
      }
    }))
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Top Filter Bar */}
        <FilterSection />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          {/* Results Summary */}
          <div className="flex flex-wrap gap-y-[26px] items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Properties for Sale</h1>
              <p className="text-gray-600 mt-1">Showing 1,243 properties in your area</p>
            </div>
            <ResultsSorting/>
          </div>

          {/* Listings Grid */}
          <ListingsGrid
            listings={listings}
            pagination={pagination}
            searchParams={searchParams}
            hasError={hasError}
          />
        </div>
      </div>
    </>
  );
}