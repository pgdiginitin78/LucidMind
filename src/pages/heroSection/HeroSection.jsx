import React from "react";
import bgVideo from "../../assets/LucidMindHero4.mp4";
import Heading from "../../components/ui/Heading";
import HeroBannerImg from "../../assets/HeroBanner.png";

function HeroSection() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center md:justify-start overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-top z-0"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>
      {/* <img
        src={HeroBannerImg}
        alt="Hero Banner"
        className="absolute inset-0 w-full h-full object-cover object-top z-0"
      /> */}

      <div className="absolute top-0 left-0 w-full md:w-[75%] lg:w-[60%] h-full bg-gradient-to-r from-white/95 via-white/80 to-transparent z-10"></div>

      <div className="relative z-20 w-full px-6 mt-20 sm:px-12 md:px-16 lg:px-12 2xl:px-24 md:w-[60%] lg:w-[60%] 2xl:w-[45%] flex flex-col items-start gap-4 text-left pt-24 md:pt-0 font-['Inter',sans-serif]">
        <div className="flex flex-col items-start">
          <p className="text-[#009A9A] font-light tracking-[0.2em] uppercase text-xs sm:text-sm md:text-base mb-2">
            Helping Leaders Build
          </p>
          <Heading
            level={1}
            className="text-5xl md:text-3xl lg:text-[3rem] text-[#0B192C] leading-[1.05] tracking-tight"
          >
            Organisations Ready <br /> for the&nbsp;
            <span className="text-[#009A9A]">AI</span> Era.
          </Heading>
          <div className="w-12 sm:w-16 h-[3px] bg-[#009A9A] mt-8 mb-2"></div>
        </div>
        <p className="text-slate-600 font-medium text-lg md:text-xl leading-relaxed max-w-lg mb-2">
          AI is changing technology. The real challenge is transforming
          leadership, operating models, and business capabilities.
        </p>
        <button className="group cursor-pointer flex items-center gap-4 rounded-full bg-gradient-to-r from-[#00B8B8] via-[#009A9A] to-[#006D77] px-7 py-3 text-white font-medium shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-cyan-500/40">
          <span>Schedule a Conversation</span>

          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h15m0 0-6.75-6.75M19.5 12l-6.75 6.75"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}

export default HeroSection;
