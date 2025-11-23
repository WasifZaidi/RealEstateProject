import Homelisting from "./components/Homelisting";
import "./globals.css"
import About from "./components/About";
import Places from "./components/Places";
import WhyUs from "./components/WhyUs";
import { Hero } from "./components/Hero";
import Categories from "./components/Categories";
import { Phone } from "lucide-react";

// ✅ Enterprise-grade Metadata (JavaScript version)
export const metadata = {
  title: "RealEstatePro | Find Your Dream Home | Properties for Sale & Rent",
  description: "Discover premium properties for sale and rent. Browse thousands of verified listings with detailed information, photos, and virtual tours. Find your perfect home today.",
  keywords: "real estate, properties for sale, homes for rent, buy property, rent apartment, real estate listings, dream home",
  
  // ✅ Open Graph for Social Sharing
  openGraph: {
    title: "RealEstatePro | Find Your Dream Home | Properties for Sale & Rent",
    description: "Discover premium properties for sale and rent. Browse thousands of verified listings with detailed information, photos, and virtual tours.",
    type: "website",
    locale: "en_US",
    siteName: "RealEstatePro",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RealEstatePro - Find Your Dream Home",
      },
    ],
  },

  // ✅ Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "RealEstatePro | Find Your Dream Home",
    description: "Discover premium properties for sale and rent with verified listings.",
    images: ["/twitter-image.jpg"],
  },

  // ✅ Robots & Crawling
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ✅ Additional Meta Tags
  authors: [{ name: "RealEstatePro" }],
  creator: "RealEstatePro",
  publisher: "RealEstatePro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // ✅ Canonical URL
  alternates: {
    canonical: "https://realestatepro.com",
  },

  // ✅ Verification (if needed)
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

// ✅ Generate structured data for the entire homepage
function generateHomepageStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://realestatepro.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "RealEstatePro",
    "description": "Premium real estate platform for buying, selling, and renting properties",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RealEstatePro",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    }
  };
}

// ✅ Organization Schema
function generateOrganizationStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://realestatepro.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "RealEstatePro",
    "description": "Leading real estate platform connecting buyers, sellers, and renters with premium properties",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Your City",
      "addressRegion": "Your State",
      "postalCode": "Your ZIP",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service",
      "areaServed": "US",
      "availableLanguage": "en"
    },
    "sameAs": [
      "https://www.facebook.com/realestatepro",
      "https://www.twitter.com/realestatepro",
      "https://www.linkedin.com/company/realestatepro",
      "https://www.instagram.com/realestatepro"
    ]
  };
}

// ✅ Breadcrumb Schema
function generateBreadcrumbStructuredData() {
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
      }
    ]
  };
}

export default function Home() {
  const homepageStructuredData = generateHomepageStructuredData();
  const organizationStructuredData = generateOrganizationStructuredData();
  const breadcrumbStructuredData = generateBreadcrumbStructuredData();

  return (
    <>
      {/* ✅ Structured Data for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData) }}
        key="website-schema"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        key="organization-schema"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        key="breadcrumb-schema"
      />

      {/* ✅ Semantic HTML Structure */}
      <main 
        itemScope 
        itemType="https://schema.org/WebPage"
        className="Home"
        role="main"
        aria-label="Real Estate Homepage"
      >
        {/* ✅ Hero Section with Schema */}
        <section 
          aria-labelledby="hero-heading"
          itemScope 
          itemProp="mainContentOfPage"
        >
          <Hero />
        </section>

        {/* ✅ Featured Listings with Schema */}
        <section 
          aria-labelledby="featured-listings-heading"
          itemScope 
          itemType="https://schema.org/ItemList"
        >
          <Homelisting />
        </section>

        {/* ✅ About Section */}
        <section 
          aria-labelledby="about-heading"
          itemScope 
          itemType="https://schema.org/AboutPage"
        >
          <About />
        </section>

        {/* ✅ Popular Places */}
        <section 
          aria-labelledby="popular-places-heading"
          itemScope 
          itemType="https://schema.org/ItemList"
        >
          <Places />
        </section>

        {/* ✅ Property Categories */}
        <section 
          aria-labelledby="categories-heading"
          itemScope 
          itemType="https://schema.org/ItemList"
        >
          <Categories />
        </section>

        {/* ✅ Why Choose Us */}
        <section 
          aria-labelledby="why-us-heading"
          itemScope 
          itemType="https://schema.org/WebPageElement"
        >
          <WhyUs />
        </section>

        {/* ✅ Hidden Accessibility Content */}
        <div className="sr-only">
          <h2 id="hero-heading">Find Your Dream Home</h2>
          <h2 id="featured-listings-heading">Featured Property Listings</h2>
          <h2 id="about-heading">About RealEstatePro</h2>
          <h2 id="popular-places-heading">Popular Locations</h2>
          <h2 id="categories-heading">Property Categories</h2>
          <h2 id="why-us-heading">Why Choose RealEstatePro</h2>
          
          <p>
            RealEstatePro is your premier destination for buying, selling, and renting properties. 
            Browse thousands of verified listings with comprehensive details, high-quality images, 
            and virtual tours. Our platform connects you with trusted real estate professionals 
            and provides market insights to make informed decisions.
          </p>
        </div>
      </main>

      {/* ✅ JSON-LD for Local Business (if applicable) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": "RealEstatePro",
            "image": `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
            "description": "Premium real estate platform for property listings",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "123 Main St",
              "addressLocality": "Your City",
              "addressRegion": "Your State",
              "postalCode": "12345",
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "40.7128",
              "longitude": "-74.0060"
            },
            "url": process.env.NEXT_PUBLIC_SITE_URL,
            "telephone": "+1-555-123-4567",
            "openingHours": "Mo-Fr 09:00-18:00",
            "priceRange": "$$$"
          })
        }}
        key="local-business-schema"
      />
    </>
  );
}