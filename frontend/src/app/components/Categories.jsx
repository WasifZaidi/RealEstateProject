import React from 'react';
import Link from 'next/link';
import { Building2, Home, Trees, Store, ArrowRight } from 'lucide-react';

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
      borderColor: 'border-blue-200'
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
      borderColor: 'border-emerald-200'
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
      borderColor: 'border-amber-200'
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
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-700">Property Types</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Explore Our <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Premium</span> Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover exceptional properties tailored to your lifestyle. From urban apartments to countryside estates.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 max-w-7xl mx-auto">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.id}
                href={`/results?propertyType=${encodeURIComponent(category.linkhref)}`}
                passHref
              >
                <div className="group relative cursor-pointer h-full flex flex-col">
                  {/* Card */}
                  <div className={`relative bg-white rounded-3xl shadow-lg hover:shadow-2xl 
                border ${category.borderColor} border-opacity-50
                transition-all duration-500 ease-out
                transform group-hover:scale-105 group-hover:-translate-y-2
                overflow-hidden
                h-full flex flex-col
                before:absolute before:inset-0 before:bg-gradient-to-br ${category.gradient} before:opacity-0 before:transition-opacity before:duration-500 before:group-hover:opacity-5
              `}>
                    {/* Background Pattern */}
                    <div className={`absolute inset-0 opacity-30 ${category.bgGradient}`} />

                    <div className="relative z-10 p-8 flex-1 flex flex-col">
                      {/* Icon */}
                      <div className={`
                    relative mb-6 p-4 rounded-[50px] 
                    bg-gradient-to-br ${category.gradient}
                    shadow-lg group-hover:shadow-xl
                    w-16 h-16 flex items-center justify-center
                    transform group-hover:scale-110 group-hover:rotate-3
                    transition-all duration-500 ease-out
                    before:absolute before:inset-2 before:rounded-[50px] before:bg-white/20
                  `}>
                        <IconComponent className="h-8 w-8 text-white relative z-10" />
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{category.name}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed text-base flex-1">{category.description}</p>

                      {/* Count & CTA - stick to bottom */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors duration-300 mt-auto">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{category.count}</span>
                          <span className="text-sm text-gray-500">properties</span>
                        </div>
                        <div className={`
                      flex items-center justify-center 
                      w-10 h-10 rounded-full 
                      bg-gray-100 group-hover:bg-gradient-to-br ${category.gradient}
                      text-gray-600 group-hover:text-white
                      transform group-hover:scale-110
                      transition-all duration-300 ease-out
                      shadow-sm group-hover:shadow-lg
                    `}>
                          <ArrowRight className="h-5 w-5 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>

                    {/* Border Glow */}
                    <div className={`
                  absolute inset-0 rounded-3xl 
                  bg-gradient-to-br ${category.gradient} 
                  opacity-0 group-hover:opacity-10
                  transition-opacity duration-500
                  -z-10
                `} />
                  </div>

                  {/* External Glow */}
                  <div className={`
                absolute inset-0 rounded-3xl 
                bg-gradient-to-br ${category.gradient} 
                opacity-0 group-hover:opacity-20
                blur-xl group-hover:blur-2xl
                transition-all duration-700 ease-out
                -z-10 transform group-hover:scale-105
              `} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>

  );
};

export default Categories;
