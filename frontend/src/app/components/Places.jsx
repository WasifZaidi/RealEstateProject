import { figtree, outfit } from '@/utils/fonts'
import React from 'react'
import Card from './SideComponents/Card'

const Places = () => {
    const places = [
    { name: 'Dubai', img: '/temp_img/Places/dubai.jpg' },
    { name: 'London', img: '/temp_img/Places/london.jpg' },
    { name: 'New York', img: '/temp_img/Places/newyork.jpg' },
    { name: 'Sydney', img: '/temp_img/Places/vegas.jpg' }
  ]
    return (
        <div className='HomeListings mt-[100px] max-[500px]:mt-[80px] w-full'>
            <div className="container flex flex-col gap-[30px]">
                <div className="heading flex flex-col gap-[0px] max-[500px]:gap-[10px] items-center justify-center w-full">
                    <h2 className={`text-[22px] leading-[20px] text-[#1D4ED8] font-[900] tracking-tight`}>
                       Popular Places
                    </h2>
                    <h2 className={`${outfit.className} text-[55px] max-w-[90%] mx-auto max-[1300px]:text-[40px] max-[900px]:text-[40px] max-[550px]:text-[30px] max-[500px]:leading-[40px] text-center font-[600] text-[#434343]`}>
                   Prime Real Estate in Popular Areas
                    </h2>
                </div>

                {/* Horizontal scroll cards */}
     <div className="cards-wrapper w-full mb-[100px]">
  {/* Large screens: Show all 4 cards in a grid */}
  <div className="hidden xl:grid grid-cols-4 gap-[16px] px-2">
    {places.map((place, index) => (
      <Card key={index} place={place} />
    ))}
  </div>

  {/* Small screens: Scrollable row */}
  <div className="flex xl:hidden gap-[16px] overflow-x-auto px-2 scrollbar-hide snap-x snap-mandatory">
    {places.map((place, index) => (
      <Card key={index} place={place} snap />
    ))}
  </div>
</div>



            </div>
        </div>
    )
}

export default Places
