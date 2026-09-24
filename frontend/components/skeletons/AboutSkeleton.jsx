import React from 'react';

export function AboutSkeleton() {
  const INK = "#0B1220";
  return (
    <div className="min-h-screen bg-[#F6F7FB] animate-pulse">
      <section
        className="relative overflow-hidden pt-28 sm:pt-36 pb-16 sm:pb-20"
        style={{
          background: `linear-gradient(160deg, ${INK} 0%, #101d38 45%, ${INK} 100%)`,
        }}
      >
        <div className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 z-10">
          <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-8 md:gap-12">
            <div className="w-full md:w-[60%]">
              <div className="h-3 w-24 bg-white/20 rounded-md mb-2"></div>
              <div className="h-10 sm:h-12 w-64 bg-white/20 rounded-lg mt-1"></div>
              <div className="mt-4 space-y-2 max-w-xl">
                <div className="h-4 w-full bg-white/10 rounded-md"></div>
                <div className="h-4 w-[80%] bg-white/10 rounded-md"></div>
                <div className="h-4 w-[60%] bg-white/10 rounded-md"></div>
              </div>
              <div className="mt-5 flex gap-4">
                <div className="h-6 w-32 bg-white/10 rounded-full"></div>
                <div className="h-6 w-40 bg-white/10 rounded-full"></div>
              </div>
            </div>

            <div className="relative shrink-0 grid place-items-center">
              <div className="w-[180px] h-[180px] sm:w-[260px] sm:h-[260px] rounded-2xl bg-white/10 border border-white/20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Nav skeleton */}
      <div className="sticky top-16 z-40 w-full border-y border-slate-200 bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex items-center gap-6 h-12">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-3 w-16 bg-slate-200 rounded-md"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16">
        <div className="flex gap-12">
          <div className="w-full lg:w-2/3 space-y-6">
            <div className="h-8 w-48 bg-slate-200 rounded-lg mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-slate-200 rounded-md"></div>
              <div className="h-4 w-[90%] bg-slate-200 rounded-md"></div>
              <div className="h-4 w-full bg-slate-200 rounded-md"></div>
              <div className="h-4 w-[75%] bg-slate-200 rounded-md"></div>
            </div>
            <div className="space-y-3 pt-6">
              <div className="h-4 w-full bg-slate-200 rounded-md"></div>
              <div className="h-4 w-[85%] bg-slate-200 rounded-md"></div>
            </div>
          </div>

          <div className="hidden lg:block w-1/3">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-28 bg-slate-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
