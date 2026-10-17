import React from "react";

export function ContactUsSkeleton() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#050B18] via-[#060e1f] to-[#040a16] animate-pulse">
      <div className="relative z-10 w-full max-w-[1680px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 mx-auto pt-24 sm:pt-32 pb-14 sm:pb-20">
        <div className="mb-10 text-center sm:mb-14 flex flex-col items-center">
          <div className="mb-4 inline-flex items-center gap-2 sm:gap-3">
            <span className="h-px w-5 sm:w-7 bg-[#00C4B4]" />
            <span className="h-3 w-24 bg-[#00C4B4]/40 rounded-full" />
            <span className="h-px w-5 sm:w-7 bg-[#00C4B4]" />
          </div>

          <div className="h-9 sm:h-12 w-80 max-w-full bg-white/20 rounded-xl" />
          <div className="h-4 w-full max-w-md bg-white/10 rounded-md mt-3" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-5 items-stretch">
          <div className="order-2 hidden md:flex h-full min-h-[500px] flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 items-center justify-center lg:order-1 relative overflow-hidden">
            <div className="w-56 h-56 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="w-36 h-36 rounded-2xl border border-white/10 bg-white/5" />
          </div>

          <div className="order-1 flex h-full flex-col lg:order-2 rounded-3xl border border-white/[0.09] bg-white/[0.025] p-5 sm:p-7 lg:p-9 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="h-3 w-16 bg-white/15 rounded" />
                <div className="h-11 w-full rounded-[10px] bg-white/5 border border-white/10" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-16 bg-white/15 rounded" />
                <div className="h-11 w-full rounded-[10px] bg-white/5 border border-white/10" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="h-3 w-16 bg-white/15 rounded" />
                <div className="h-11 w-full rounded-[10px] bg-white/5 border border-white/10" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-20 bg-white/15 rounded" />
                <div className="h-11 w-full rounded-[10px] bg-white/5 border border-white/10" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="h-3 w-16 bg-white/15 rounded" />
              <div className="h-11 w-full rounded-[10px] bg-white/5 border border-white/10" />
            </div>

            <div className="space-y-1.5">
              <div className="h-3 w-16 bg-white/15 rounded" />
              <div className="h-28 w-full rounded-[10px] bg-white/5 border border-white/10" />
            </div>

            <div className="pt-2">
              <div className="h-12 w-full rounded-xl bg-gradient-to-r from-[#00C4B4]/40 via-[#009A9A]/40 to-[#2563EB]/40 border border-white/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
