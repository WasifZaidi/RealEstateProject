import { figtree, inter, outfit, ProximaNovaSemiBold } from '@/utils/fonts'
import React from 'react'
import Image from 'next/image'
import Sqftsvg from '../svg/Sqftsvg'
import Bathsvg from '../svg/Bathsvg'
import BedSvg from '../svg/BedSvg'
import LocationSvg from '../svg/LocationSvg'
import HeartSvg from '../svg/HeartSvg'
import PlusSvg from '../svg/PlusSvg'
const Homelisting = () => {
    return (
        <div className="bg-[#F0F4FD] HomeListings pt-[50px] pb-[50px] w-[100%] h-100">
            <div className="container flex flex-col gap-[40px]">
                <div className="heading flex flex-col gap-[0px] max-[500px]:gap-[10px] items-center justify-center w-[100%]">
                      <h2 className={`text-[22px] leading-[20px] text-[#1D4ED8] font-[900] tracking-tight`}>
                        Who we are
                    </h2>
                    <h2 className={`${outfit.className} text-[55px] max-w-[90%] mx-auto max-[1300px]:text-[40px] max-[900px]:text-[40px] max-[550px]:text-[30px] max-[500px]:leading-[40px] text-center font-[600] text-[#434343]`}>
                        Property for sell and rent
                    </h2>
                </div>
                <div className="cards flex gap-5 overflow-x-auto scrollbar-hide">
                    <div className="card min-w-[calc(25%-20px)] rounded-xl overflow-hidden bg-white max-[768px]:min-w-[calc(50%-16px)] max-[500px]:min-w-full">
                        <div className="img_box relative">
                            <Image
                                src="/temp_img/listings/list5.jpg"
                                alt="Product"
                                fill
                                className="img"
                                style={{ objectFit: "cover" }}
                                quality={85}
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            <span className={`absolute flex items-center gap-[5px] right-[20px] top-[20px] ${inter.className} text-[12px] font-[600] bg-gradient-to-r from-[#1D4ED8]/80 to-[#3B82F6]/80 text-white px-[10px] py-[5px] rounded-[50px] backdrop-blur-sm border border-white/30 transition-all duration-200 hover:bg-[#3B82F6]/90`}>
                                <span className="rounded-[50px] h-[5px] w-[5px] bg-[#3B82F6]"></span>
                                For Sell
                            </span>
                        </div>
                        <div className="content bg-white p-[20px] pt-[10px]">
                            <span className={`${figtree.className} text-[14px] font-[700] text-[#1D4ED8] uppercase`}>Apartment</span>
                            <p className={`text-[14px] text-[#2c2c2c] mt-[10px] flex items-center gap-[6px] ${inter.className}`}>
                                <LocationSvg /> Lorem ipsum dolor sit amet.
                            </p>
                            <h3 className={`${inter.className} mt-[20px] text-[22px] font-[700] text-[#1D4ED8] max-[300px]:text-[18px]`}>
                                $335,900 <span className="text-[14px] font-[600] text-[#2c2c2c]">/Month</span>
                            </h3>
                            <div className="flex mt-[10px] max-[300px]:mt-[16px] flex-wrap items-center gap-[16px]">
                                <div className="flex border-r-2 pr-2 border-[#c7c7c7] items-center gap-[10px]">
                                    <BedSvg />
                                    <span className={`${inter.className} text-[14px] text-[#2c2c2c]`}>3 Beds</span>
                                </div>
                                <div className="flex border-r-2 pr-2 border-[#c7c7c7] items-center gap-[10px]">
                                    <Bathsvg />
                                    <span className={`${inter.className} text-[14px] text-[#2c2c2c]`}>2 Bath</span>
                                </div>
                                <div className="flex items-center border-r-2 pr-2 border-[#c7c7c7] gap-[10px]">
                                    <Sqftsvg />
                                    <span className={`${inter.className} text-[14px] text-[#2c2c2c]`}>2000 Sqft</span>
                                </div>
                            </div>
                        </div>
                    </div>
                       <div className="card min-w-[calc(25%-20px)] rounded-xl overflow-hidden bg-white max-[768px]:min-w-[calc(50%-16px)] max-[500px]:min-w-full">
                        <div className="img_box relative">
                            <Image
                                src="/temp_img/listings/list1.jpg"
                                alt="Product"
                                fill
                                className="img"
                                style={{ objectFit: "cover" }}
                                quality={85}
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            <span className={`absolute flex items-center gap-[5px] right-[20px] top-[20px] ${inter.className} text-[12px] font-[600] bg-gradient-to-r from-[#1D4ED8]/80 to-[#3B82F6]/80 text-white px-[10px] py-[5px] rounded-[50px] backdrop-blur-sm border border-white/30 transition-all duration-200 hover:bg-[#3B82F6]/90`}>
                                <span className="rounded-[50px] h-[5px] w-[5px] bg-[#3B82F6]"></span>
                                For Sell
                            </span>
                        </div>
                        <div className="content bg-white p-[20px] pt-[10px]">
                            <span className={`${figtree.className} text-[14px] font-[700] text-[#1D4ED8] uppercase`}>Apartment</span>
                            <p className={`text-[14px] text-[#2c2c2c] mt-[10px] flex items-center gap-[6px] ${inter.className}`}>
                                <LocationSvg /> Lorem ipsum dolor sit amet.
                            </p>
                            <h3 className={`${inter.className} mt-[20px] text-[22px] font-[700] text-[#1D4ED8] max-[300px]:text-[18px]`}>
                                $335,900 <span className="text-[14px] font-[600] text-[#2c2c2c]">/Month</span>
                            </h3>
                            <div className="flex mt-[10px] max-[300px]:mt-[16px] flex-wrap items-center gap-[16px]">
                                <div className="flex border-r-2 pr-2 border-[#c7c7c7] items-center gap-[10px]">
                                    <BedSvg />
                                    <span className={`${inter.className} text-[14px] text-[#2c2c2c]`}>3 Beds</span>
                                </div>
                                <div className="flex border-r-2 pr-2 border-[#c7c7c7] items-center gap-[10px]">
                                    <Bathsvg />
                                    <span className={`${inter.className} text-[14px] text-[#2c2c2c]`}>2 Bath</span>
                                </div>
                                <div className="flex items-center border-r-2 pr-2 border-[#c7c7c7] gap-[10px]">
                                    <Sqftsvg />
                                    <span className={`${inter.className} text-[14px] text-[#2c2c2c]`}>2000 Sqft</span>
                                </div>
                            </div>
                        </div>
                    </div>
                      <div className="card min-w-[calc(25%-20px)] rounded-xl overflow-hidden bg-white max-[768px]:min-w-[calc(50%-16px)] max-[500px]:min-w-full">
                        <div className="img_box relative">
                            <Image
                                src="/temp_img/listings/list3.jpg"
                                alt="Product"
                                fill
                                className="img"
                                style={{ objectFit: "cover" }}
                                quality={85}
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            <span className={`absolute flex items-center gap-[5px] right-[20px] top-[20px] ${inter.className} text-[12px] font-[600] bg-gradient-to-r from-[#1D4ED8]/80 to-[#3B82F6]/80 text-white px-[10px] py-[5px] rounded-[50px] backdrop-blur-sm border border-white/30 transition-all duration-200 hover:bg-[#3B82F6]/90`}>
                                <span className="rounded-[50px] h-[5px] w-[5px] bg-[#3B82F6]"></span>
                                For Sell
                            </span>
                        </div>
                        <div className="content bg-white p-[20px] pt-[10px]">
                            <span className={`${figtree.className} text-[14px] font-[700] text-[#1D4ED8] uppercase`}>Apartment</span>
                            <p className={`text-[14px] text-[#2c2c2c] mt-[10px] flex items-center gap-[6px] ${inter.className}`}>
                                <LocationSvg /> Lorem ipsum dolor sit amet.
                            </p>
                            <h3 className={`${inter.className} mt-[20px] text-[22px] font-[700] text-[#1D4ED8] max-[300px]:text-[18px]`}>
                                $335,900 <span className="text-[14px] font-[600] text-[#2c2c2c]">/Month</span>
                            </h3>
                            <div className="flex mt-[10px] max-[300px]:mt-[16px] flex-wrap items-center gap-[16px]">
                                <div className="flex border-r-2 pr-2 border-[#c7c7c7] items-center gap-[10px]">
                                    <BedSvg />
                                    <span className={`${inter.className} text-[14px] text-[#2c2c2c]`}>3 Beds</span>
                                </div>
                                <div className="flex border-r-2 pr-2 border-[#c7c7c7] items-center gap-[10px]">
                                    <Bathsvg />
                                    <span className={`${inter.className} text-[14px] text-[#2c2c2c]`}>2 Bath</span>
                                </div>
                                <div className="flex items-center border-r-2 pr-2 border-[#c7c7c7] gap-[10px]">
                                    <Sqftsvg />
                                    <span className={`${inter.className} text-[14px] text-[#2c2c2c]`}>2000 Sqft</span>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div className="card min-w-[calc(25%-20px)] rounded-xl overflow-hidden bg-white max-[768px]:min-w-[calc(50%-16px)] max-[500px]:min-w-full">
                        <div className="img_box relative">
                            <Image
                                src="/temp_img/listings/list4.jpg"
                                alt="Product"
                                fill
                                className="img"
                                style={{ objectFit: "cover" }}
                                quality={85}
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            <span className={`absolute flex items-center gap-[5px] right-[20px] top-[20px] ${inter.className} text-[12px] font-[600] bg-gradient-to-r from-[#1D4ED8]/80 to-[#3B82F6]/80 text-white px-[10px] py-[5px] rounded-[50px] backdrop-blur-sm border border-white/30 transition-all duration-200 hover:bg-[#3B82F6]/90`}>
                                <span className="rounded-[50px] h-[5px] w-[5px] bg-[#3B82F6]"></span>
                                For Sell
                            </span>
                        </div>
                        <div className="content bg-white p-[20px] pt-[10px]">
                            <span className={`${figtree.className} text-[14px] font-[700] text-[#1D4ED8] uppercase`}>Apartment</span>
                            <p className={`text-[14px] text-[#2c2c2c] mt-[10px] flex items-center gap-[6px] ${inter.className}`}>
                                <LocationSvg /> Lorem ipsum dolor sit amet.
                            </p>
                            <h3 className={`${inter.className} mt-[20px] text-[22px] font-[700] text-[#1D4ED8] max-[300px]:text-[18px]`}>
                                $335,900 <span className="text-[14px] font-[600] text-[#2c2c2c]">/Month</span>
                            </h3>
                            <div className="flex mt-[10px] max-[300px]:mt-[16px] flex-wrap items-center gap-[16px]">
                                <div className="flex border-r-2 pr-2 border-[#c7c7c7] items-center gap-[10px]">
                                    <BedSvg />
                                    <span className={`${inter.className} text-[14px] text-[#2c2c2c]`}>3 Beds</span>
                                </div>
                                <div className="flex border-r-2 pr-2 border-[#c7c7c7] items-center gap-[10px]">
                                    <Bathsvg />
                                    <span className={`${inter.className} text-[14px] text-[#2c2c2c]`}>2 Bath</span>
                                </div>
                                <div className="flex items-center border-r-2 pr-2 border-[#c7c7c7] gap-[10px]">
                                    <Sqftsvg />
                                    <span className={`${inter.className} text-[14px] text-[#2c2c2c]`}>2000 Sqft</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Homelisting




