import React from 'react';

export function ContactUsSkeleton() {
  const INK = "#050B18";
  return (
    <div className="min-h-screen bg-[#050B18] pt-24 sm:pt-32 pb-16 sm:pb-24 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 flex flex-col items-center justify-center text-center">
          <div className="h-10 sm:h-12 w-64 bg-white/10 rounded-lg mb-3"></div>
          <div className="h-4 sm:h-5 w-80 bg-white/10 rounded-md"></div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16 items-start">
          
          {/* Left Form Skeleton */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 md:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="h-3 w-20 bg-white/10 rounded-md"></div>
                  <div className="h-11 w-full bg-white/5 rounded-xl border border-white/10"></div>
                </div>
              ))}
              
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <div className="h-3 w-20 bg-white/10 rounded-md"></div>
                <div className="h-11 w-full bg-white/5 rounded-xl border border-white/10"></div>
              </div>
              
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <div className="h-3 w-20 bg-white/10 rounded-md"></div>
                <div className="h-32 w-full bg-white/5 rounded-xl border border-white/10"></div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <div className="h-11 w-full sm:w-40 bg-white/20 rounded-xl"></div>
            </div>
          </div>

          {/* Right Spline / Info Skeleton */}
          <div className="relative flex flex-col gap-8">
            <div className="relative flex h-full min-h-[380px] w-full items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02]">
               <div className="w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
