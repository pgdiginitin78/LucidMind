import React from 'react';

export function AdvisorySkeleton() {
  const TEAL = "#00C4B4";
  const BLUE = "#2563EB";

  return (
    <div className="relative w-full min-h-screen bg-[#040914] overflow-x-hidden animate-pulse">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-full h-200 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0, 196, 180, 0.22) 0%, rgba(37, 99, 235, 0.18) 45%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-24 sm:pb-32">
        
        {/* Header Section */}
        <section className="grid grid-cols-1 justify-items-center text-center mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent to-white/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <div className="w-12 sm:w-16 h-px bg-gradient-to-l from-transparent to-white/20" />
          </div>

          <div className="h-10 sm:h-12 md:h-16 w-64 bg-white/10 rounded-lg mb-5"></div>

          <div className="max-w-xl space-y-2 w-full flex flex-col items-center">
            <div className="h-3 w-full bg-white/10 rounded-md"></div>
            <div className="h-3 w-[80%] bg-white/10 rounded-md"></div>
          </div>
        </section>

        {/* Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 py-8 mb-16 sm:mb-20 items-center">
          {[1, 2].map((i) => (
            <div key={i} className="grid grid-cols-[auto_1fr] gap-4 items-start w-full">
              <div className="w-11 h-11 rounded-full bg-white/10 shrink-0"></div>
              <div className="space-y-2 mt-1 w-full">
                <div className="h-2 w-full bg-white/10 rounded-sm"></div>
                <div className="h-2 w-[90%] bg-white/10 rounded-sm"></div>
                <div className="h-2 w-[80%] bg-white/10 rounded-sm"></div>
                <div className="h-2 w-[70%] bg-white/10 rounded-sm"></div>
              </div>
            </div>
          ))}
        </section>

        {/* Operating Model Section Header */}
        <section className="grid grid-cols-1 justify-items-center mb-20 sm:mb-24">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-px bg-white/20" />
            <div className="h-2 w-48 bg-white/20 rounded-sm" />
            <div className="w-4 h-px bg-white/20" />
          </div>

          <div className="h-8 sm:h-10 w-72 bg-white/10 rounded-lg mb-4"></div>

          <div className="max-w-3xl space-y-2 w-full flex flex-col items-center mb-10">
            <div className="h-3 w-full bg-white/10 rounded-md"></div>
            <div className="h-3 w-[95%] bg-white/10 rounded-md"></div>
            <div className="h-3 w-[85%] bg-white/10 rounded-md"></div>
          </div>
        </section>

      </div>
    </div>
  );
}
