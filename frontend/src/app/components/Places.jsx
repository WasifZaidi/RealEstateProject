import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { outfit } from '@/utils/fonts';

const Places = () => {
  const places = [
    {
      city: 'Austin',
      state: 'Texas',
      img: '/temp_img/Places/dubai.jpg',
      properties: '1,892',
      gradient: 'from-amber-500 via-orange-600 to-yellow-500',
      color: 'amber'
    },
    {
      city: 'New York',
      state: 'New York',
      img: '/temp_img/Places/london.jpg',
      properties: '2,345',
      gradient: 'from-blue-500 via-blue-600 to-cyan-500',
      color: 'blue'
    },
    {
      city: 'Los Angeles',
      state: 'California',
      img: '/temp_img/Places/newyork.jpg',
      properties: '3,127',
      gradient: 'from-purple-500 via-violet-600 to-fuchsia-500',
      color: 'purple'
    },
    {
      city: 'Chicago',
      state: 'Illinois',
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
    return colors[color] || colors.blue;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50/50 to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Prime Locations</span>
          </div>
          <h2 className={`${outfit.className} text-4xl md:text-5xl font-bold text-gray-900 mb-6`}>
            Discover Properties in{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Popular US Cities
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore premium real estate opportunities in the most sought-after US cities
          </p>
        </div>

        <div className="cards-wrapper w-full ">
          <div className="hidden xl:grid grid-cols-4 gap-6 lg:gap-8">
            {places.map((place, index) => (
              <Link
                key={index}
                href={`/results?state=${encodeURIComponent(place.state)}&city=${encodeURIComponent(place.city)}`}
                passHref
              >
                <div className="group relative cursor-pointer">
                  <div className="
                    relative bg-white rounded-3xl shadow-lg hover:shadow-2xl 
                    border border-gray-200 border-opacity-60
                    transition-all duration-500 ease-out
                    transform group-hover:scale-105 group-hover:-translate-y-2
                    overflow-hidden
                    h-full
                  ">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={place.img}
                        alt={place.city}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                    </div>
                    <div className="relative z-10 p-6 flex flex-col">
                      <div className="flex-1 mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
                          {place.city}
                        </h3>
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getColorClasses(place.color)} transition-all duration-300 group-hover:scale-105`}>
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm font-medium">{place.properties} properties</span>
                        </div>
                      </div>
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Places;
