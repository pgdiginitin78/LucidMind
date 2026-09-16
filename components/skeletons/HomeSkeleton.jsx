import React from 'react';

export function HomeSkeleton() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-16 sm:py-20 md:py-0 bg-gradient-to-r from-[#4B9AF5] to-[#040914] animate-pulse">
      {/* Background elements */}
      <div className="absolute top-1/3 sm:top-1/2 -left-16 sm:-left-20 -translate-y-1/2 w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] lg:w-[650px] lg:h-[650px] pointer-events-none z-10 opacity-60 sm:opacity-70 blur-[60px] sm:blur-[90px] rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 50%, rgba(0, 196, 180, 0.22) 0%, rgba(37, 99, 235, 0.12) 50%, transparent 75%)",
        }}
      />
      <div className="relative z-20 w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 mx-auto flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10 md:gap-8 lg:gap-8">

        {/* Particle Display Placeholder (Right on desktop, top on mobile) */}
        <div className="w-full md:w-[48%] lg:w-[50%] flex items-center justify-center order-first md:order-last scale-95 sm:scale-100 md:scale-100 -mb-6 sm:-mb-4 md:mb-0">
          <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] rounded-full bg-white/10 blur-2xl"></div>
        </div>

        {/* Text Placeholder (Left on desktop) */}
        <div className="w-full md:w-[52%] lg:w-[50%] flex flex-col md:pt-20 lg:pt-10 items-center md:items-start gap-4 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start w-full gap-4">
            {/* Subheading */}
            <div className="h-4 w-32 bg-white/20 rounded-md mb-2"></div>

            {/* H1 Lines */}
            <div className="h-10 sm:h-12 md:h-16 lg:h-20 w-full bg-white/20 rounded-lg"></div>
            <div className="h-10 sm:h-12 md:h-16 lg:h-20 w-[70%] bg-white/20 rounded-lg"></div>

            <div className="w-10 sm:w-12 md:w-16 h-[3px] bg-white/20 mt-4 sm:mt-6 mb-2"></div>
          </div>

          {/* Paragraph */}
          <div className="w-full max-w-xs sm:max-w-md md:max-w-lg space-y-2 mb-2 mt-4">
            <div className="h-4 w-full bg-white/10 rounded-md"></div>
            <div className="h-4 w-[90%] bg-white/10 rounded-md"></div>
            <div className="h-4 w-[60%] bg-white/10 rounded-md"></div>
          </div>

          {/* Button */}
          <div className="h-12 w-full sm:w-56 bg-white/20 rounded-full mt-4"></div>
        </div>

      </div>
    </div>
  );
}
