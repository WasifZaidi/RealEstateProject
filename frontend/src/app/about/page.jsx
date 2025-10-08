import React from 'react'
import About from '../components/About'
import Head from 'next/head'
import Image from 'next/image'
import { ArrowRight, Building, Globe, Phone, Rocket, Sparkles, Trophy, Users, Zap } from 'lucide-react'
import InnerHeader from '../components/InnerHeader'
const AboutPage = () => {
  // Structured data for SEO (unchanged)
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Your Company Name",
    "description": "Leading enterprise solutions provider transforming businesses through innovative technology",
    "url": "https://yourcompany.com",
    "logo": "https://yourcompany.com/logo.png",
    "foundingDate": "2015",
    "employees": "500+",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Enterprise Street",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "postalCode": "94105",
      "addressCountry": "USA"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-0123",
      "contactType": "customer service"
    },
    "sameAs": [
      "https://www.linkedin.com/company/yourcompany",
      "https://twitter.com/yourcompany",
      "https://github.com/yourcompany"
    ]
  }

  const leadership = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      bio: "Former Fortune 500 CTO with 15+ years in enterprise technology and innovation leadership.",
      image: "/temp_img/2.jpg",
      social: {
        linkedin: "https://linkedin.com/in/johndoe",
        twitter: "https://twitter.com/johndoe",
        email: "john@company.com"
      }
    },
    {
      name: "Marcus Johnson",
      role: "CTO",
      bio: "AI and machine learning expert with multiple patents in distributed systems and automation.",
      image: "/temp_img/4.jpg",
      social: {
        linkedin: "https://linkedin.com/in/johndoe",
        twitter: "https://twitter.com/johndoe",
        email: "john@company.com"
      }
    },
    {
      name: "Elena Rodriguez",
      role: "COO",
      bio: "Operations leader with a proven track record in scaling global organizations and driving efficiency.",
      image: "/temp_img/7.jpg",
      social: {
        linkedin: "https://linkedin.com/in/johndoe",
        twitter: "https://twitter.com/johndoe",
        email: "john@company.com"
      }
    },
    {
      name: "David Kim",
      role: "CFO",
      bio: "Financial strategist with extensive experience in venture capital, M&A, and corporate growth.",
      image: "/temp_img/8.jpg",
      social: {
        linkedin: "https://linkedin.com/in/johndoe",
        twitter: "https://twitter.com/johndoe",
        email: "john@company.com"
      }
    },
  ];



  return (
    <>
      <Head>
        <title>About Us | Your Company - Enterprise Solutions Leader</title>
        <meta
          name="description"
          content="Learn about Your Company's mission, values, and leadership. We're a global enterprise solutions provider with 500+ employees driving digital transformation since 2015."
        />
        <meta name="keywords" content="enterprise solutions, company about us, business transformation, technology leadership" />
        <meta property="og:title" content="About Us | Your Company - Enterprise Solutions Leader" />
        <meta property="og:description" content="Discover how Your Company is shaping the future of enterprise technology with innovative solutions and expert leadership." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourcompany.com/about" />
        <meta property="og:image" content="https://yourcompany.com/og-about-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Your Company" />
        <meta name="twitter:description" content="Leading enterprise solutions provider transforming businesses through innovative technology" />
        <meta name="twitter:image" content="https://yourcompany.com/twitter-about-image.jpg" />
        <link rel="canonical" href="https://yourcompany.com/about" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
      </Head>

      {/*Header Section */}
      <InnerHeader title="About Our Enterprise" body="Pioneering digital transformation for global enterprises since 2015. Discover our journey, values, and commitment to excellence."/>


      {/* Main Content */}
      <main className="relative">
        {/* Background Pattern */}
        <div className="fixed inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_70%,transparent_100%)] pointer-events-none"></div>

        <div className="relative z-10">
          {/* Your Existing About Component */}
          <About />

          {/* Glassy Feature Cards */}
          <section className="py-20">
            <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Trophy,
                    title: "Our Mission",
                    description: "To empower businesses with cutting-edge technology solutions that drive growth, efficiency, and sustainable success in the digital age.",
                    gradient: "from-blue-500/20 to-cyan-500/20",
                    glowColor: "group-hover:shadow-blue-500/20",
                    iconColor: "text-blue-600",
                    accentColor: "bg-blue-500",
                    hoverGradient: "from-blue-500/30 to-cyan-500/30"
                  },
                  {
                    icon: Globe,
                    title: "Global Reach",
                    description: "Serving 1000+ enterprise clients across 50+ countries with localized support and global expertise.",
                    gradient: "from-green-500/20 to-emerald-500/20",
                    glowColor: "group-hover:shadow-green-500/20",
                    iconColor: "text-green-600",
                    accentColor: "bg-green-500",
                    hoverGradient: "from-green-500/30 to-emerald-500/30"
                  },
                  {
                    icon: Rocket,
                    title: "Innovation",
                    description: "Investing 20% of revenue in R&D to stay at the forefront of technological innovation and industry trends.",
                    gradient: "from-purple-500/20 to-pink-500/20",
                    glowColor: "group-hover:shadow-purple-500/20",
                    iconColor: "text-purple-600",
                    accentColor: "bg-purple-500",
                    hoverGradient: "from-purple-500/30 to-pink-500/30"
                  }
                ].map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`group relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 transition-all duration-500 overflow-hidden
              shadow-lg hover:shadow-2xl hover:scale-105 hover:bg-white/20 ${feature.glowColor}
              bg-gradient-to-br from-white/5 to-white/15 hover:from-white/10 hover:to-white/25`}
                    >

                      {/* Static Background Pattern */}
                      <div className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500`}></div>
                        <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${feature.gradient} rounded-full blur-xl group-hover:blur-2xl transition-all duration-500`}></div>
                      </div>

                      {/* Corner Accent */}
                      <div className={`absolute top-0 right-0 w-20 h-20 ${feature.accentColor} opacity-5 group-hover:opacity-10 transition-opacity duration-500 rounded-bl-full`}></div>

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Icon Container */}
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 
                transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative overflow-hidden
                shadow-lg group-hover:shadow-xl`}>

                          {/* Icon Glow Effect */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} blur-lg opacity-30 group-hover:opacity-50 group-hover:blur-xl transition-all duration-500`}></div>

                          <IconComponent
                            className={`w-10 h-10 ${feature.iconColor} relative z-10 transition-all duration-500
                    drop-shadow-sm group-hover:drop-shadow-md group-hover:scale-110`}
                            strokeWidth={2}
                          />

                          {/* Sparkle Effect */}
                          <Sparkles
                            className={`absolute top-1 right-1 w-4 h-4 ${feature.iconColor} opacity-40 group-hover:opacity-100 transition-all duration-300 delay-100`}
                          />
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors flex items-center gap-2">
                          {feature.title}
                          <ArrowRight
                            className="w-5 h-5 opacity-60 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300"
                          />
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors text-lg">
                          {feature.description}
                        </p>

                        {/* Decorative Line */}
                        <div className={`mt-6 h-1 w-16 group-hover:w-full ${feature.accentColor} rounded-full transition-all duration-500 ease-out opacity-80 group-hover:opacity-100`}></div>
                      </div>

                      {/* Bottom Gradient Line */}
                      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>

                      {/* Subtle Border Glow */}
                      <div className={`absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Glassy Leadership Section */}
          <section className="py-24  relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
              <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
              {/* Enhanced Header */}
              <div className="text-center mb-20">
                <div className="inline-flex items-center justify-center px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-50 rounded-full border border-blue-100">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Our Leadership Team
                </div>

                <h2 className="text-5xl md:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
                    Executive Leadership
                  </span>
                </h2>

                <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                  Meet the visionary leaders driving innovation and excellence across our global enterprise.
                  <span className="text-gray-900 font-medium"> Together, we're shaping the future.</span>
                </p>
              </div>

              {/* Enhanced Team Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {leadership.map((leader, index) => (
                  <div
                    key={index}
                    className="group relative"
                  >
                    {/* Card Container with Enhanced Glass Effect */}
                    <div className="relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-2 border border-gray-300/80">

                      {/* Enhanced Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-indigo-600/0 rounded-3xl  group-hover:from-blue-600/8 group-hover:via-purple-600/5 group-hover:to-indigo-600/8 transition-all duration-500 z-10 pointer-events-none"></div>

                      {/* Enhanced Image Container */}
                      <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        <Image
                          src={leader.image}
                          alt={leader.name}
                          fill
                          className="object-cover transition-all duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          priority={index < 2}
                        />

                        {/* Enhanced Gradient Overlay on Image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Social Links - Enhanced on Hover */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                          {leader.social?.linkedin && (
                            <a
                              href={leader.social.linkedin}
                              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-blue-600 text-gray-600 hover:text-white border border-white/60 hover:border-blue-400 transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-md"
                              aria-label={`Connect with ${leader.name} on LinkedIn`}
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                              </svg>
                            </a>
                          )}
                          {leader.social?.twitter && (
                            <a
                              href={leader.social.twitter}
                              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-blue-400 text-gray-600 hover:text-white border border-white/60 hover:border-blue-300 transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-md"
                              aria-label={`Follow ${leader.name} on Twitter`}
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                              </svg>
                            </a>
                          )}
                          {leader.social?.email && (
                            <a
                              href={`mailto:${leader.social.email}`}
                              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-green-500 text-gray-600 hover:text-white border border-white/60 hover:border-green-400 transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-md"
                              aria-label={`Email ${leader.name}`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </a>
                          )}
                        </div>

                        {/* Experience Badge */}
                        <div className="absolute top-4 right-4 opacity-90 group-hover:opacity-100 transition-all duration-500">
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
                            {leader.experience || "Expert"}
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="relative p-6 bg-gradient-to-b from-white to-gray-50/70">
                        {/* Name and Role */}
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 transition-all duration-300 group-hover:text-blue-600">
                            {leader.name}
                          </h3>

                          <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="h-px w-6 bg-gradient-to-r from-transparent to-blue-400"></div>
                            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                              {leader.role}
                            </p>
                            <div className="h-px w-6 bg-gradient-to-l from-transparent to-blue-400"></div>
                          </div>
                        </div>

                        {/* Enhanced Decorative Line */}
                        <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 mx-auto transition-all duration-500 group-hover:w-16 group-hover:from-blue-600 group-hover:to-purple-600"></div>

                        {/* Bio Section */}
                        <div className="text-center">
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors mb-4">
                            {leader.bio}
                          </p>

                          {/* Enhanced Connect Section */}
                          <div className="mt-5 pt-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors">
                            <div className="flex flex-col items-center gap-3">
                              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Connect With Me</span>

                              {/* Social Links Row */}
                              <div className="flex gap-3">
                                {leader.social?.linkedin && (
                                  <a
                                    href={leader.social.linkedin}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-300 group/btn border border-blue-100 hover:border-blue-200 text-xs font-medium"
                                  >
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                    LinkedIn
                                  </a>
                                )}

                                {leader.social?.twitter && (
                                  <a
                                    href={leader.social.twitter}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-500 hover:text-blue-600 transition-all duration-300 group/btn border border-blue-100 hover:border-blue-200 text-xs font-medium"
                                  >
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                    </svg>
                                    Twitter
                                  </a>
                                )}
                              </div>

                              {/* Email Link */}
                              {leader.social?.email && (
                                <a
                                  href={`mailto:${leader.social.email}`}
                                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 transition-all duration-300 group/btn border border-green-100 hover:border-green-200 text-xs font-medium"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  Send Email
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Corner Accent */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Glassy Stats Section */}
          <section className="py-16 md:py-20 relative overflow-hidden">
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-indigo-800/90">
              {/* Animated Gradient Orbs */}
              <div className="absolute top-1/4 -left-10 w-40 h-40 md:w-60 md:h-60 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 -right-10 w-40 h-40 md:w-60 md:h-60 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 bg-cyan-400/15 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>


            <div className="relative z-10 container mx-auto px-4 sm:px-6">
              {/* Section Header */}
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                  Global Impact in Numbers
                </h2>
                <p className="text-blue-100/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                  Trusted by enterprises worldwide for excellence and reliability
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
                {[
                  {
                    number: "500+",
                    label: "Employees",
                    icon: Users,
                    gradient: "from-blue-400/20 to-cyan-400/20",
                    iconColor: "text-blue-300"
                  },
                  {
                    number: "50+",
                    label: "Countries",
                    icon: Globe,
                    gradient: "from-purple-400/20 to-pink-400/20",
                    iconColor: "text-purple-300"
                  },
                  {
                    number: "1K+",
                    label: "Enterprise Clients",
                    icon: Building,
                    gradient: "from-green-400/20 to-emerald-400/20",
                    iconColor: "text-green-300"
                  },
                  {
                    number: "99.9%",
                    label: "Uptime SLA",
                    icon: Zap,
                    gradient: "from-orange-400/20 to-red-400/20",
                    iconColor: "text-orange-300"
                  }
                ].map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div
                      key={index}
                      className="group relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:bg-white/15 hover:scale-105 hover:shadow-2xl hover:shadow-white/10"
                    >
                      {/* Hover Gradient Effect */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>

                      {/* Icon Container */}
                      <div className="flex justify-center mb-3 sm:mb-4">
                        <div className="p-3 rounded-2xl bg-white/10 group-hover:bg-white/20 transition-all duration-300">
                          <IconComponent
                            className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.iconColor} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`}
                            strokeWidth={2}
                          />
                        </div>
                      </div>

                      {/* Number */}
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-white transition-colors duration-300 text-center">
                        {stat.number}
                      </div>

                      {/* Label */}
                      <div className="text-blue-100/90 font-medium text-sm sm:text-base group-hover:text-white/90 transition-colors duration-300 text-center">
                        {stat.label}
                      </div>

                      {/* Bottom Glow Effect */}
                      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${stat.gradient.split(' ')[0]} ${stat.gradient.split(' ')[2]} rounded-full group-hover:w-3/4 transition-all duration-500`}></div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom CTA */}
              <div className="text-center mt-12 md:mt-16">
                <button className="backdrop-blur-xl bg-white/10 border border-white/20 text-white px-6 sm:px-8 py-3 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 text-sm sm:text-base font-medium">
                  Explore Our Success Stories
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Glassy CTA Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          {/* Animated Gradient Orbs */}
          <div className="absolute -top-20 -left-20 w-60 h-60 md:w-80 md:h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 md:w-80 md:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-60 md:h-60 bg-cyan-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
          {/* Enhanced Glass Container */}
          <div className="relative backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 lg:p-16 max-w-4xl mx-auto overflow-hidden">

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            {/* Floating Elements */}
            <div className="absolute top-4 right-4 w-6 h-6 bg-blue-400/20 rounded-full blur-sm"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 bg-purple-400/20 rounded-full blur-sm"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-sm font-medium">Limited Spots Available</span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
                Ready to Transform Your{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Enterprise?
                </span>
              </h2>

              {/* Description */}
              <p className="text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed">
                Join <span className="text-white font-semibold">1,000+</span> forward-thinking enterprises that trust us with their digital transformation journey. Start your success story today.
              </p>

              {/* Enhanced CTA Buttons */}
              <div className="flex justify-center items-center">
  <a
    href="/contact"
    className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[50px] font-semibold overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
  >
    {/* Shine Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
    
    {/* Content */}
    <Phone size={20} className="relative z-10 transition-transform duration-300 group-hover:scale-110" />
    <span className="relative z-10 whitespace-nowrap transition-all duration-300 group-hover:tracking-wide">
      Get In Touch
    </span>
  </a>
</div>
              {/* Trust Indicators */}
              <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/10">
                <p className="text-gray-400 text-sm mb-4">Trusted by industry leaders</p>
                <div className="flex justify-center items-center gap-6 md:gap-8 opacity-60">
                  <div className="text-white/80 text-xs md:text-sm">🏆 Fortune 500</div>
                  <div className="text-white/80 text-xs md:text-sm">🌍 Global Brands</div>
                  <div className="text-white/80 text-xs md:text-sm">⭐ 4.9/5 Rating</div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  Free consultation
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                  Response within 24h
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage