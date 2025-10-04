import React from 'react';
import Image from 'next/image';

const Card = ({ place, snap = false }) => {
  return (
    <div
      className={`relative flex-shrink-0 overflow-hidden rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl 
        ${snap ? 'snap-start w-[85%] sm:w-[55%] md:w-[40%] lg:w-[30%]' : 'w-full max-w-[400px]'}
        mx-auto my-4 aspect-[3/4] group`}
    >
      <Image
        src={place.img}
        alt={place.name}
        fill
        className="object-cover"
        quality={85}
        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 55vw, 30vw"
      />
      <div className="absolute bg-[rgba(0,0,0,0.5)]  inset-0 flex flex-col justify-center">
       <div className="backdrop-blur-lg bg-gradient-to-t from-[#5758D6]/30 via-[#6A69E2]/20 to-transparent p-4 border-2 border-white/30 border-r-0 border-l-0 shadow-inner transition-all duration-300">
  <h2 className="text-white text-xl sm:text-2xl font-semibold tracking-tight drop-shadow-md line-clamp-2">
    {place.name}
  </h2>
  <button className="mt-4 px-5 py-2 bg-[#5758D6]/40 text-white text-sm font-medium rounded-full backdrop-blur-sm border border-white/30 hover:bg-[#6A69E2]/50 hover:scale-105 transition-all duration-200 transform active:scale-95 w-full sm:w-auto">
    Explore Now
  </button>
</div>
      </div>
    </div>
  );
};

export default Card;