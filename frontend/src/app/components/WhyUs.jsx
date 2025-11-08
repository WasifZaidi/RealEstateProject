import React from 'react';
import { Shield, Award, Clock, Users, Home, Star, Phone } from 'lucide-react';
import { outfit, inter } from '@/utils/fonts';

const WhyUs = () => {
  const features = [
    {
      icon: Shield,
      title: 'Trusted & Secure',
      description: '27+ years of trusted real estate services with 100% secure transactions and verified properties.',
      gradient: 'from-blue-500 to-cyan-500',
      stats: '10K+ Verified Properties'
    },
    {
      icon: Award,
      title: 'Award Winning',
      description: 'Multiple industry awards for excellence in customer service and property management.',
      gradient: 'from-emerald-500 to-teal-500',
      stats: '15+ Industry Awards'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to assist you at every step of your property journey.',
      gradient: 'from-amber-500 to-orange-500',
      stats: 'Instant Response'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: '300+ certified real estate experts with deep market knowledge and personalized approach.',
      gradient: 'from-purple-500 to-pink-500',
      stats: '300+ Professionals'
    },
    {
      icon: Home,
      title: 'Wide Portfolio',
      description: 'From luxury apartments to commercial spaces, we have the perfect property for every need.',
      gradient: 'from-violet-500 to-indigo-500',
      stats: '1.5K+ Listings'
    },
    {
      icon: Star,
      title: 'Premium Service',
      description: 'White-glove service with personalized attention and end-to-end property solutions.',
      gradient: 'from-rose-500 to-red-500',
      stats: '98% Satisfaction'
    }
  ];

  const stats = [
    { number: '27+', label: 'Years Experience' },
    { number: '5K+', label: 'Happy Clients' },
    { number: '2K+', label: 'Properties Sold' },
    { number: '15+', label: 'Industry Awards' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200 rounded-full blur-3xl opacity-20 translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-15 -translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
            <Award className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Why Choose Us</span>
          </div>
          <h2 className={`${outfit.className} text-4xl md:text-5xl font-bold text-gray-900 mb-6`}>
            The <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Preferred Choice</span>{' '}
            for Smart Investors
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the difference with our unparalleled service, market expertise, and commitment to your real estate success
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 p-8 transition-all duration-500 overflow-hidden"
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 transform group-hover:scale-105`} />

                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 blur-xl group-hover:blur-2xl transition-all duration-700 -z-10 transform group-hover:scale-110`} />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`mb-6 p-4 rounded-[50px] bg-gradient-to-br ${feature.gradient} w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors duration-300">
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                      {feature.stats}
                    </span>
                    <div className={`w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gradient-to-br ${feature.gradient} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                      <div className="w-2 h-2 bg-gray-400 group-hover:bg-white rounded-full transition-colors duration-300" />
                    </div>
                  </div>
                </div>

                {/* Animated Border */}
                <div className={`absolute bottom-0 left-1/2 w-0 h-1 bg-gradient-to-r ${feature.gradient} transform -translate-x-1/2 group-hover:w-4/5 transition-all duration-700 ease-out rounded-t-full`} />
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="relative py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden rounded-[20px] sm:rounded-[30px] md:rounded-[40px]">
          {/* Premium Dark Blue Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e3a8a]">
            {/* Deep Ambient Glows - Adjusted for mobile */}
            <div className="absolute -top-12 -left-12 w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-blue-700/20 rounded-full blur-xl sm:blur-2xl md:blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-cyan-500/20 rounded-full blur-xl sm:blur-2xl md:blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-72 lg:h-72 bg-blue-300/10 rounded-full blur-lg sm:blur-xl md:blur-2xl animate-pulse delay-700"></div>

            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:48px_48px] md:bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
            </div>
          </div>

          <div className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6">
            {/* Glass Card */}
            <div className="relative backdrop-blur-xl sm:backdrop-blur-2xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 overflow-hidden shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] sm:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)] md:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]">

              {/* Subtle Shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              {/* Floating Glows */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-6 h-6 sm:w-8 sm:h-8 bg-blue-500/30 rounded-full blur-md"></div>
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-7 h-7 sm:w-10 sm:h-10 bg-cyan-500/30 rounded-full blur-md"></div>

              {/* Stats */}
              <div className="relative z-10 mb-8 sm:mb-10 md:mb-12">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center group">
                      <div className="mb-2 sm:mb-3 md:mb-4 relative inline-flex">
                        <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-500">
                          {stat.number}
                        </span>
                        <div className="absolute -top-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500" />
                      </div>
                      <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-300 group-hover:text-white transition-colors duration-300 leading-tight">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="relative z-10 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-5 md:mb-6 shadow-inner">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-xs sm:text-sm font-medium">Limited Properties Available</span>
                </div>

                {/* Heading */}
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-5 lg:mb-6 leading-snug sm:leading-tight">
                  Discover Your{' '}
                  <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                    Dream Property
                  </span>
                </h2>

                {/* Description */}
                <p className="text-gray-300 mb-6 sm:mb-7 md:mb-8 lg:mb-10 max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                  Join <span className="text-white font-semibold">5,000+</span> satisfied clients who found their luxury home with us.
                  Experience a smarter way to invest in real estate.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-7 md:mb-8">
                  {/* Contact Button */}
                  <a
                    href="/contact"
                    className="group relative flex items-center justify-center gap-2 sm:gap-3 w-full max-w-xs sm:w-48 md:w-52 h-11 sm:h-12 md:h-14 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[40px] sm:rounded-[50px] font-semibold overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 text-sm sm:text-base"
                  >
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                    {/* Content */}
                    <Phone size={18} className="relative z-10 transition-transform duration-300 group-hover:scale-110 min-w-[18px]" />
                    <span className="relative z-10 whitespace-nowrap transition-all duration-300 group-hover:tracking-wide">
                      Get In Touch
                    </span>
                  </a>

                  {/* View Properties Button */}
                  <button
                    className="group relative flex items-center justify-center w-full max-w-xs sm:w-48 md:w-52 h-11 sm:h-12 md:h-14 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-[40px] sm:rounded-[50px] font-semibold overflow-hidden transition-all duration-300 hover:bg-white/20 hover:scale-105 shadow-md hover:shadow-blue-500/20 text-sm sm:text-base"
                  >
                    <span className="relative z-10">View Properties</span>
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 sm:mt-7 md:mt-8 pt-4 sm:pt-5 md:pt-6 border-t border-white/10">
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">Trusted by Homeowners & Investors Worldwide</p>
                  <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 opacity-70">
                    <div className="text-white/80 text-xs sm:text-sm">🏆 Award Winning</div>
                    <div className="text-white/80 text-xs sm:text-sm">🔒 Secure Deals</div>
                    <div className="text-white/80 text-xs sm:text-sm">⭐ Rated 4.9/5</div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 sm:mt-5 md:mt-6 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 md:gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                    Free property valuation
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    No obligation consultation
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                    Response within 2 hours
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyUs;