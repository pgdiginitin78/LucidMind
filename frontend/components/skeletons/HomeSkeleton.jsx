import React from "react";

export function HomeSkeleton() {
  return (
    <div className="relative w-full min-h-screen md:min-h-[90dvh] lg:min-h-screen flex items-center justify-center overflow-hidden py-16 sm:py-20 md:py-0 bg-gradient-to-r from-[#4B9AF5] to-[#040914] animate-pulse">
      <div className="absolute top-1/3 sm:top-1/2 -left-16 sm:-left-20 -translate-y-1/2 w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] lg:w-[650px] lg:h-[650px] pointer-events-none z-10 opacity-60 sm:opacity-70 blur-[60px] sm:blur-[90px] rounded-full bg-cyan-400/20" />
      <div className="absolute inset-0 md:inset-y-0 md:left-0 md:right-auto w-full md:w-[70%] lg:w-[60%] pointer-events-none z-10 bg-gradient-to-b md:bg-gradient-to-r from-[#040914]/95 via-[#040914]/70 md:via-[#040914]/60 to-[#040914]/60 md:to-transparent" />

      <div className="relative z-20 w-full max-w-[1680px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 mx-auto flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10 md:gap-8 lg:gap-8">
        <div className="w-full md:w-[48%] lg:w-[50%] flex items-center justify-center order-first md:order-last scale-95 sm:scale-100 md:scale-100 -mb-6 sm:-mb-4 md:mb-0">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[460px] lg:h-[460px] rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
            <div className="w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full border border-cyan-400/20 bg-cyan-400/5 flex items-center justify-center">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-cyan-400/20 blur-xl" />
            </div>
          </div>
        </div>

        <div className="w-full md:w-[52%] lg:w-[50%] flex flex-col md:pt-20 lg:pt-10 items-center md:items-start gap-4 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start w-full">
            <div className="h-10 sm:h-12 md:h-16 lg:h-18 w-full max-w-md bg-white/20 rounded-xl" />
            <div className="h-10 sm:h-12 md:h-16 lg:h-18 w-3/4 max-w-sm bg-cyan-400/30 rounded-xl mt-3" />
            <div className="w-10 sm:w-12 md:w-16 h-[3px] bg-[#009A9A] mt-4 sm:mt-6 mb-2 rounded-full" />
          </div>

          <div className="w-full max-w-xs sm:max-w-md md:max-w-lg space-y-2.5 mb-2 mt-2">
            <div className="h-4 w-full bg-white/15 rounded-md" />
            <div className="h-4 w-[85%] bg-white/15 rounded-md" />
          </div>

          <div className="h-11 sm:h-12 w-full sm:w-64 rounded-full bg-gradient-to-r from-[#00B8B8]/50 via-[#009A9A]/50 to-[#006D77]/50 mt-2 border border-white/10" />
        </div>
      </div>
    </div>
  );
}
