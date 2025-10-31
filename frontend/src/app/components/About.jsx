import React from 'react'
import Image from 'next/image'
import { figtree, inter, outfit, ProximaNovaSemiBold } from '@/utils/fonts'
import DoneSvg from '../svg/DoneSvg';
import { Award } from 'lucide-react';
const About = () => {
    return (
        <div className="about_box margin_top_reg  flex items-start max-w-[1500px] w-[95%] mx-auto max-[1024px]:flex-col max-[1024px]:gap-[100px] max-[500px]:gap-[30px]">
            <div className="basis-[45%] about_left relative max-[1024px]:w-[500px] max-[1024px]:max-w-full">
                <div className="relative about_left_img1 w-[70%] aspect-[380/534]">
                    <Image
                        src="/temp_img/About1.png"
                        alt="About Image1"
                        className='rounded-[20px]'
                        fill
                        quality={100}
                    />
                </div>
                <div className="absolute rounded-[30px] about_left_img2 top-[15%] right-[10%] w-[50%] aspect-[600/635] border-[8px] border-white max-[500px]:right-0">
                    <Image
                        src="/temp_img/About_img2.avif"
                        alt="About Image1"
                        className='rounded-[20px]'
                        fill
                        quality={100}
                    />
                </div>
                <div className="absolute bottom-4 left-4 flex flex-col gap-3 py-4 px-5 rounded-2xl bg-gradient-to-br from-[#5758D6]/50 via-[#3B82F6]/50 to-[#1E40AF]/50 backdrop-blur-xl border-2 border-white/40 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl max-[500px]:gap-2 max-[500px]:left-2 max-[500px]:py-3 max-[500px]:px-4 z-10">
                    <h3 className="text-5xl text-white font-semibold leading-tight drop-shadow-md max-[500px]:text-3xl max-[250px]:text-2xl">
                        27+
                    </h3>
                    <span className="text-base text-white uppercase tracking-wide max-[500px]:text-sm max-[250px]:text-xs">
                        Years of Experience
                    </span>
                </div>
            </div>
            <div className="basis-[55%] about_right max-[500px]:w-[90%] max-[500px]:mx-auto">
                <div className="flex flex-col gap-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 w-fit">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Who We Are</span>
                    </div>
                    <h2 className={`${outfit.className} text-4xl lg:text-5xl font-bold text-gray-900 leading-tight`}>
                        We Are A Family-Owned{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            Empire Agency
                        </span>
                    </h2>
                </div>
                <div className="flex mt-[20px] flex-col gap-[20px]">
                    <p className={`text ${inter.className} text-[14px] text-gray-700 leading-relaxed max-w-prose`}>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga accusantium quo sunt exercitationem praesentium ut autem inventore laudantium, cumque sequi accusamus ex quaerat architecto vero et voluptatum quas odit quibusdam corrupti distinctio mollitia repellendus. Est non quis at consequatur aperiam Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga accusantium quo sunt exercitationem praesentium ut autem inventore laudantium, cumque sequi accusamus ex quaerat architecto vero et voluptatum quas odit quibusdam corrupti distinctio mollitia repellendus. Est non quis at consequatur aperiam.
                    </p>
                    <div className="cards about_right_cards grid grid-cols-2 gap-[16px] max-[500px]:grid-cols-1">
                        <div className="card about_right_card flex items-center gap-[20px] py-[10px] px-[20px] rounded-xl bg-gradient-to-br from-[#1D4ED8]/20 via-[#3B82F6]/20 to-[#60A5FA]/20 backdrop-blur-lg border border-white/30 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg max-[1024px]:flex-col max-[1024px]:gap-0 max-[1024px]:text-center">
                            <span className="font-[700] text-[30px] about_right_card_head max-[1200px]:text-[20px] max-[1024px]:text-[30px] max-[500px]:text-[16px] text-[#1D4ED8]">5K+</span>
                            <span className="font-[600] text-[20px] about_right_card_body max-[1200px]:text-[16px] max-[1024px]:text-[20px] max-[500px]:text-[14px] text-gray-800">Happy Clients</span>
                        </div>
                        <div className="card about_right_card flex items-center gap-[20px] py-[10px] px-[20px] rounded-xl bg-gradient-to-br from-[#1D4ED8]/20 via-[#3B82F6]/20 to-[#60A5FA]/20 backdrop-blur-lg border border-white/30 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg max-[1024px]:flex-col max-[1024px]:gap-0 max-[1024px]:text-center">
                            <span className="font-[700] text-[30px] about_right_card_head max-[1200px]:text-[20px] max-[1024px]:text-[30px] max-[500px]:text-[16px] text-[#1D4ED8]">1.5K+</span>
                            <span className="font-[600] text-[20px] about_right_card_body max-[1200px]:text-[16px] max-[1024px]:text-[20px] max-[500px]:text-[14px] text-gray-800">Active Listings</span>
                        </div>
                        <div className="card about_right_card flex items-center gap-[20px] py-[10px] px-[20px] rounded-xl bg-gradient-to-br from-[#1D4ED8]/20 via-[#3B82F6]/20 to-[#60A5FA]/20 backdrop-blur-lg border border-white/30 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg max-[1024px]:flex-col max-[1024px]:gap-0 max-[1024px]:text-center">
                            <span className="font-[700] text-[30px] about_right_card_head max-[1200px]:text-[20px] max-[1024px]:text-[30px] max-[500px]:text-[16px] text-[#1D4ED8]">2K+</span>
                            <span className="font-[600] text-[20px] about_right_card_body max-[1200px]:text-[16px] max-[1024px]:text-[20px] max-[500px]:text-[14px] text-gray-800">Property Sold</span>
                        </div>
                        <div className="card about_right_card flex items-center gap-[20px] py-[10px] px-[20px] rounded-xl bg-gradient-to-br from-[#1D4ED8]/20 via-[#3B82F6]/20 to-[#60A5FA]/20 backdrop-blur-lg border border-white/30 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg max-[1024px]:flex-col max-[1024px]:gap-0 max-[1024px]:text-center">
                            <span className="font-[700] text-[30px] about_right_card_head max-[1200px]:text-[20px] max-[1024px]:text-[30px] max-[500px]:text-[16px] text-[#1D4ED8]">300+</span>
                            <span className="font-[600] text-[20px] about_right_card_body max-[1200px]:text-[16px] max-[1024px]:text-[20px] max-[500px]:text-[14px] text-gray-800">Team Members</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default About;
