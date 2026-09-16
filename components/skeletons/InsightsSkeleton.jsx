import React from "react";

export function InsightsSkeleton() {
  return (
    <div className="relative w-full min-h-screen bg-[#040914] overflow-x-hidden animate-pulse pt-28 sm:pt-36 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mb-10 sm:mb-14">
          <div className="h-4 w-32 bg-white/10 rounded-full mb-3" />
          <div className="h-10 sm:h-12 w-80 bg-white/15 rounded-lg mb-4" />
          <div className="h-4 w-full max-w-lg bg-white/10 rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#09172B]/70 border border-white/[0.08] p-5 h-80 flex flex-col justify-between"
            >
              <div className="w-full h-40 bg-white/10 rounded-xl mb-4" />
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-white/15 rounded" />
                <div className="h-3 w-full bg-white/10 rounded" />
                <div className="h-3 w-2/3 bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
