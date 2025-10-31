import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { outfit } from '@/utils/fonts';

const Places = () => {
  const places = [
    {
      name: 'Dubai',
      img: '/temp_img/Places/dubai.jpg',
      properties: '1,892',
      gradient: 'from-amber-500 via-orange-600 to-yellow-500',
      color: 'amber'
    },
    {
      name: 'London',
      img: '/temp_img/Places/london.jpg',
      properties: '2,345',
      gradient: 'from-blue-500 via-blue-600 to-cyan-500',
      color: 'blue'
    },
    {
      name: 'New York',
      img: '/temp_img/Places/newyork.jpg',
      properties: '3,127',
      gradient: 'from-purple-500 via-violet-600 to-fuchsia-500',
      color: 'purple'
    },
    {
      name: 'Sydney',
      img: '/temp_img/Places/vegas.jpg',
      properties: '1,543',
      gradient: 'from-emerald-500 via-green-600 to-teal-500',
      color: 'emerald'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      amber: 'bg-amber-50 border-amber-200 text-amber-700',
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700'
    };
    return colors || colors.blue;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50/50 to-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Prime Locations</span>
          </div>
          <h2 className={`${outfit.className} text-4xl md:text-5xl font-bold text-gray-900 mb-6`}>
            Discover Properties in{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Popular Cities
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore premium real estate opportunities in the world's most sought-after destinations
          </p>
        </div>

        {/* Enhanced Cards Grid */}
        <div className="cards-wrapper w-full mb-16">
          {/* Large screens: Show all 4 cards in a grid */}
          <div className="hidden xl:grid grid-cols-4 gap-6 lg:gap-8">
            {places.map((place, index) => (
              <div
                key={index}
                className="group relative"
              >
                {/* Card Container with Enhanced Effects */}
                <div className="
                  relative bg-white rounded-3xl shadow-lg hover:shadow-2xl 
                  border border-gray-200 border-opacity-60
                  transition-all duration-500 ease-out
                  transform group-hover:scale-105 group-hover:-translate-y-2
                  overflow-hidden
                  h-full cursor-pointer
                ">

                  {/* Image Container with Enhanced Hover */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={place.img}
                      alt={place.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay - Lighter and More Subtle */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />

                    {/* Shine Effect on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-6 flex flex-col">
                    <div className="flex-1 mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
                        {place.name}
                      </h3>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getColorClasses(place.color)} transition-all duration-300 group-hover:scale-105`}>
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">{place.properties} properties</span>
                      </div>
                    </div>

                    {/* Enhanced CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors duration-300">
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                        Explore Properties
                      </span>
                      <div className={`
                        flex items-center justify-center 
                        w-10 h-10 rounded-full 
                        bg-gray-100 group-hover:bg-gradient-to-br ${place.gradient}
                        text-gray-600 group-hover:text-white
                        transform group-hover:scale-110 
                        transition-all duration-300 ease-out
                        shadow-sm group-hover:shadow-lg
                      `}>
                        <ArrowRight className="h-5 w-5 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Hover Border Glow */}
                  <div className={`
                    absolute inset-0 rounded-3xl 
                    bg-gradient-to-br ${place.gradient} 
                    opacity-0 group-hover:opacity-10
                    transition-opacity duration-500
                    -z-10
                  `} />

                  {/* Floating Elements on Hover */}
                  <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500 delay-200"></div>
                  <div className="absolute top-4 right-4 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500 delay-300"></div>
                </div>

                {/* External Glow Effect */}
                <div className={`
                  absolute inset-0 rounded-3xl 
                  bg-gradient-to-br ${place.gradient} 
                  opacity-0 group-hover:opacity-15
                  blur-xl group-hover:blur-2xl
                  transition-all duration-700 ease-out
                  -z-10 transform group-hover:scale-105
                `} />
              </div>
            ))}
          </div>

          {/* Small screens: Scrollable row with enhanced design */}
          <div className="flex xl:hidden gap-6 overflow-x-auto px-2 scrollbar-hide snap-x snap-mandatory pb-4">
            {places.map((place, index) => (
              <div
                key={index}
                className="flex-none w-80 snap-center"
              >
                <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-300 overflow-hidden h-full">
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={place.img}
                      alt={place.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                    {/* City Name Overlay */}
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg">{place.name}</h3>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm mt-2 ${getColorClasses(place.color)}`}>
                        <MapPin className="w-3 h-3" />
                        <span className="text-xs font-medium text-white drop-shadow">{place.properties} properties</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="p-4">
                    <button className="group w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      Explore Properties
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced View All Button */}
        <div className="text-center">
          <button
            className="
      group relative
      inline-flex items-center gap-2
      px-6 py-3.5
      bg-gradient-to-r from-blue-950 via-indigo-900 to-purple-900
      hover:from-[#1E3A8A] hover:via-[#4C1D95] hover:to-[#6366F1]
      text-white font-medium tracking-wide
      rounded-full
      shadow-[0_4px_15px_rgba(0,0,0,0.4)]
      hover:shadow-[0_6px_25px_rgba(99,102,241,0.4)]
      transform hover:scale-[1.05]
      transition-all duration-300 ease-out
      overflow-hidden
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#6366F1]/15 before:to-[#3B82F6]/15
      before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
    "
          >
            {/* Border Glow */}
            <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-[#6366F1]/50 transition-all duration-500" />

            {/* Light sweep animation */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />

            {/* Icon and Text */}
            <MapPin className="w-4 h-4 text-[#93C5FD] relative z-10" />
            <span className="relative z-10 text-sm">View All Locations</span>
            <ArrowRight className="w-4 h-4 text-[#93C5FD] relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default Places;