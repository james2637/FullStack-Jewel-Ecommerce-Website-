import React from "react";
import { assets } from "../assets/assets";

const Hero = () => {
    return (
    <div className="relative w-full aspect-[2/1] max-h-[480px] min-h-[220px] border border-gray-400 overflow-hidden flex items-center justify-center">
            {/* Hero Image Full Width, clear, maintain aspect ratio */}
            <img src={assets.hero} alt="" className="absolute inset-0 w-full h-full z-0" />
            {/* Overlay Content Centered or Left/Right as needed */}
                    <div className="absolute inset-0 flex items-center justify-end z-10 px-6 sm:px-16">
                        <div className="text-[#414141] max-w-lg text-right">
                            <div className="flex items-center gap-2 justify-end">
                                <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
                                <p className="font-medium text-sm md:text-base">OUR BESTSELLERS</p>
                            </div>
                            <h1 className="text-3xl sm:py-3 lg:text-5xl leading-relaxed prata-regular">Latest Arrivals</h1>
                            <div className="flex items-center gap-2 justify-end">
                                <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
                                <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
                            </div>
                        </div>
                    </div>
        </div>
  );
};

export default Hero;
