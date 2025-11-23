import React from 'react'
import Image from 'next/image'
import { figtree, inter, outfit, ProximaNovaSemiBold } from '@/utils/fonts'
import DoneSvg from '../svg/DoneSvg';
import { Award } from 'lucide-react';
import { BLUE_PLACEHOLDER } from '@/utils/blueplaceholder';

// ✅ Generate About Page Structured Data
function generateAboutStructuredData() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://realestatepro.com';

    return {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About RealEstatePro - Family-Owned Empire Agency",
        "description": "With 27+ years of experience, RealEstatePro has helped 5,000+ clients with 1,500+ active listings and 2,000+ properties sold. Discover our family-owned real estate legacy.",
        "url": `${baseUrl}/about`,
        "mainEntity": {
            "@type": "RealEstateAgent",
            "name": "RealEstatePro",
            "description": "Family-owned real estate agency with 27+ years of experience in property sales and rentals",
            "foundingDate": "1997",
            "numberOfEmployees": "300+",
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "US"
            },
            "award": "Premium Real Estate Agency",
            "knowsAbout": [
                "Real Estate",
                "Property Sales",
                "Property Rentals",
                "Home Valuation",
                "Real Estate Investment"
            ]
        }
    };
}

// ✅ Generate Organization Structured Data for About Section
function generateOrganizationStructuredData() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://realestatepro.com';

    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "RealEstatePro",
        "alternateName": "Empire Agency",
        "description": "Family-owned real estate agency with 27+ years of experience",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "foundingDate": "1997",
        "founders": [
            {
                "@type": "Person",
                "name": "RealEstatePro Founders"
            }
        ],
        "numberOfEmployees": "300",
        "slogan": "Your Trusted Real Estate Partner",
        "knowsAbout": [
            "Real Estate",
            "Property Management",
            "Home Buying",
            "Home Selling",
            "Real Estate Investment"
        ],
        "award": "27+ Years of Excellence in Real Estate",
        "areaServed": "United States",
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": "English"
        }
    };
}

const About = () => {
    const aboutStructuredData = generateAboutStructuredData();
    const organizationStructuredData = generateOrganizationStructuredData();

    return (
        <>
            {/* ✅ Structured Data for About Page */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutStructuredData) }}
                key="about-page-schema"
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
                key="organization-schema"
            />

            {/* ✅ Semantic About Section */}
            <section
                className="about_box margin_top_reg flex items-start max-w-[1500px] w-[95%] mx-auto max-[1024px]:flex-col max-[1024px]:gap-[100px] max-[500px]:gap-[30px]"
                aria-labelledby="about-heading"
                itemScope
                itemType="https://schema.org/AboutPage"
                role="region"
            >
                {/* ✅ Image Section with Semantic Markup */}
                <div
                    className="basis-[45%] about_left relative max-[1024px]:w-[500px] max-[1024px]:max-w-full"
                    itemScope
                    itemProp="image"
                    itemType="https://schema.org/ImageObject"
                >
                    <div className="relative about_left_img1 w-[70%] aspect-[380/534]">
                        <Image
                            src="/temp_img/About1.png"
                            alt="RealEstatePro team members discussing property strategies in modern office"
                            className='rounded-[20px]'
                            fill
                            quality={85}
                            sizes="(max-width: 1024px) 500px, (max-width: 768px) 400px, 45vw"
                            itemProp="contentUrl"
                            placeholder="blur"
                            blurDataURL={BLUE_PLACEHOLDER}
                        />
                    </div>
                    <div className="absolute rounded-[30px] about_left_img2 top-[15%] right-[10%] w-[50%] aspect-[600/635] border-[8px] border-white max-[500px]:right-0">
                        <Image
                            src="/temp_img/About_img2.avif"
                            alt="RealEstatePro successful property transaction celebration with clients"
                            className='rounded-[20px]'
                            fill
                            quality={85}
                            sizes="(max-width: 1024px) 250px, (max-width: 768px) 200px, 25vw"
                            itemProp="thumbnail"
                            placeholder="blur"
                            blurDataURL={BLUE_PLACEHOLDER}
                        />
                    </div>

                    {/* ✅ Experience Badge with Schema */}
                    <div
                        className="absolute bottom-4 left-4 flex flex-col gap-3 py-4 px-5 rounded-2xl bg-gradient-to-br from-[#5758D6]/50 via-[#3B82F6]/50 to-[#1E40AF]/50 backdrop-blur-xl border-2 border-white/40 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl max-[500px]:gap-2 max-[500px]:left-2 max-[500px]:py-3 max-[500px]:px-4 z-10"
                        itemProp="award"
                    >
                        <h3
                            className="text-5xl text-white font-semibold leading-tight drop-shadow-md max-[500px]:text-3xl max-[250px]:text-2xl"
                            itemProp="description"
                        >
                            27+
                        </h3>
                        <span
                            className="text-base text-white uppercase tracking-wide max-[500px]:text-sm max-[250px]:text-xs"
                            itemProp="name"
                        >
                            Years of Experience
                        </span>
                        <meta itemProp="dateReceived" content="1997" />
                    </div>
                </div>

                {/* ✅ Content Section with Proper Semantic Structure */}
                <div
                    className="basis-[55%] about_right max-[500px]:w-[90%] max-[500px]:mx-auto"
                    itemScope
                    itemProp="mainContentOfPage"
                >
                    <header className="flex flex-col gap-6">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 w-fit"
                            itemProp="description"
                        >
                            <Award className="w-4 h-4 text-blue-600" aria-hidden="true" />
                            <span className="text-sm font-medium text-blue-700">Who We Are</span>
                        </div>
                        <h1
                            id="about-heading"
                            className={`${outfit.className} text-4xl lg:text-5xl font-bold text-gray-900 leading-tight`}
                            itemProp="headline"
                        >
                            We Are A Family-Owned{' '}
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                Empire Agency
                            </span>
                        </h1>
                    </header>

                    <div className="flex mt-[20px] flex-col gap-[20px]">
                        {/* ✅ Enhanced Description with Better Content */}
                        <div
                            className={`text ${inter.className} text-[14px] text-gray-700 leading-relaxed max-w-prose`}
                            itemProp="description"
                        >
                            <p className="mb-4">
                                For over 27 years, <strong itemProp="name">RealEstatePro</strong> has been the trusted
                                name in real estate, helping thousands of families find their dream homes and
                                maximize their property investments. As a family-owned empire agency, we combine
                                traditional values with modern technology to deliver exceptional results.
                            </p>
                            <p>
                                Our dedicated team of 300+ real estate professionals brings unparalleled expertise
                                in property sales, rentals, and investment consulting. We pride ourselves on
                                building lasting relationships with our clients and providing personalized
                                service that exceeds expectations in today's dynamic real estate market.
                            </p>
                        </div>

                        {/* ✅ Statistics with Schema Markup */}
                        <div
                            className="cards about_right_cards grid grid-cols-2 gap-[16px] max-[500px]:grid-cols-1"
                            role="list"
                            aria-label="Company achievements and statistics"
                        >
                            {/* Happy Clients */}
                            <div
                                className="card about_right_card flex items-center gap-[20px] py-[10px] px-[20px] rounded-xl bg-gradient-to-br from-[#1D4ED8]/20 via-[#3B82F6]/20 to-[#60A5FA]/20 backdrop-blur-lg border border-white/30 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg max-[1024px]:flex-col max-[1024px]:gap-0 max-[1024px]:text-center"
                                itemProp="review"
                                itemScope
                                itemType="https://schema.org/Review"
                                role="listitem"
                            >
                                <span
                                    className="font-[700] text-[30px] about_right_card_head max-[1200px]:text-[20px] max-[1024px]:text-[30px] max-[500px]:text-[16px] text-[#1D4ED8]"
                                    itemProp="reviewRating"
                                    itemScope
                                    itemType="https://schema.org/Rating"
                                >
                                    <span itemProp="ratingValue">5K+</span>
                                    <meta itemProp="bestRating" content="10000" />
                                </span>
                                <span
                                    className="font-[600] text-[20px] about_right_card_body max-[1200px]:text-[16px] max-[1024px]:text-[20px] max-[500px]:text-[14px] text-gray-800"
                                    itemProp="name"
                                >
                                    Happy Clients
                                </span>
                            </div>

                            {/* Active Listings */}
                            <div
                                className="card about_right_card flex items-center gap-[20px] py-[10px] px-[20px] rounded-xl bg-gradient-to-br from-[#1D4ED8]/20 via-[#3B82F6]/20 to-[#60A5FA]/20 backdrop-blur-lg border border-white/30 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg max-[1024px]:flex-col max-[1024px]:gap-0 max-[1024px]:text-center"
                                role="listitem"
                            >
                                <span className="font-[700] text-[30px] about_right_card_head max-[1200px]:text-[20px] max-[1024px]:text-[30px] max-[500px]:text-[16px] text-[#1D4ED8]">
                                    1.5K+
                                </span>
                                <span className="font-[600] text-[20px] about_right_card_body max-[1200px]:text-[16px] max-[1024px]:text-[20px] max-[500px]:text-[14px] text-gray-800">
                                    Active Listings
                                </span>
                            </div>

                            {/* Property Sold */}
                            <div
                                className="card about_right_card flex items-center gap-[20px] py-[10px] px-[20px] rounded-xl bg-gradient-to-br from-[#1D4ED8]/20 via-[#3B82F6]/20 to-[#60A5FA]/20 backdrop-blur-lg border border-white/30 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg max-[1024px]:flex-col max-[1024px]:gap-0 max-[1024px]:text-center"
                                role="listitem"
                            >
                                <span className="font-[700] text-[30px] about_right_card_head max-[1200px]:text-[20px] max-[1024px]:text-[30px] max-[500px]:text-[16px] text-[#1D4ED8]">
                                    2K+
                                </span>
                                <span className="font-[600] text-[20px] about_right_card_body max-[1200px]:text-[16px] max-[1024px]:text-[20px] max-[500px]:text-[14px] text-gray-800">
                                    Property Sold
                                </span>
                            </div>

                            {/* Team Members */}
                            <div
                                className="card about_right_card flex items-center gap-[20px] py-[10px] px-[20px] rounded-xl bg-gradient-to-br from-[#1D4ED8]/20 via-[#3B82F6]/20 to-[#60A5FA]/20 backdrop-blur-lg border border-white/30 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg max-[1024px]:flex-col max-[1024px]:gap-0 max-[1024px]:text-center"
                                itemProp="numberOfEmployees"
                                role="listitem"
                            >
                                <span className="font-[700] text-[30px] about_right_card_head max-[1200px]:text-[20px] max-[1024px]:text-[30px] max-[500px]:text-[16px] text-[#1D4ED8]">
                                    300+
                                </span>
                                <span className="font-[600] text-[20px] about_right_card_body max-[1200px]:text-[16px] max-[1024px]:text-[20px] max-[500px]:text-[14px] text-gray-800">
                                    Team Members
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ✅ Hidden Accessibility Content */}
                <div className="sr-only">
                    <h2>About RealEstatePro</h2>
                    <p>
                        RealEstatePro is a family-owned real estate agency with over 27 years of experience
                        in the industry. We have successfully served 5,000+ happy clients, managed 1,500+
                        active listings, sold 2,000+ properties, and built a team of 300+ dedicated real
                        estate professionals.
                    </p>
                    <p>
                        Our mission is to provide exceptional real estate services combining traditional
                        values with modern technology to help clients achieve their property goals.
                    </p>
                </div>
            </section>
        </>
    )
};

export default About;