import React from "react";
import bgVideo from "../../assets/LucidMindHero.mp4";
import Heading from "../../components/ui/Heading";

function HeroSection() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center md:justify-start overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0  w-full h-full object-center object-cover z-0"
      >
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute top-0 left-0 w-full md:w-[75%] lg:w-[60%] h-full bg-gradient-to-r from-white/95 via-white/80 to-transparent z-10"></div>

      <div className="relative z-20 w-full px-6 mt-20 sm:px-12 md:px-16 lg:px-12 md:w-[60%] lg:w-[60%] 2xl:w-[45%] flex flex-col items-start gap-4 text-left pt-24 md:pt-0 font-['Inter',sans-serif]">
        <div className="flex flex-col items-start">
          <p className="text-[#009A9A] font-light tracking-[0.2em] uppercase text-xs sm:text-sm md:text-base mb-2">
            Helping Leaders Build
          </p>
          <Heading level={1} className="text-5xl md:text-3xl lg:text-[3rem] text-[#0B192C] leading-[1.05] tracking-tight">
            Organisations Ready <br /> for the&nbsp;
            <span className="text-[#009A9A]">AI</span> Era.
          </Heading>
          <div className="w-12 sm:w-16 h-[3px] bg-[#009A9A] mt-8 mb-2"></div>
        </div>
        <p className="text-slate-600 font-medium text-lg md:text-xl leading-relaxed max-w-lg mb-2">
          AI is changing technology. The real challenge is transforming
          leadership, operating models, and business capabilities.
        </p>
        <button className="bg-[#009A9A] cursor-pointer text-white flex items-center justify-between gap-3 font-medium py-3 px-6 rounded-full hover:bg-[#007A7A] transition-colors duration-300">
          <span>Schedule a Conversation</span>
          <div className="w-7 h-7 rounded-full border border-white/50 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3.5 h-3.5 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}

export default HeroSection;
