import React from "react";

export function PodcastSkeleton() {
  return (
    <div className="relative w-full min-h-screen bg-[#030914] overflow-x-hidden animate-pulse pt-28 sm:pt-36 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mb-12">
          <div className="h-4 w-36 bg-white/10 rounded-full mb-3" />
          <div className="h-10 sm:h-14 w-96 bg-white/15 rounded-xl mb-4" />
          <div className="h-4 w-full max-w-xl bg-white/10 rounded" />
        </div>

        <div className="h-96 w-full rounded-3xl bg-white/[0.04] border border-white/10 mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 h-72 flex flex-col justify-between"
            >
              <div className="w-full h-36 bg-white/10 rounded-xl mb-4" />
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-white/15 rounded" />
                <div className="h-3 w-full bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
