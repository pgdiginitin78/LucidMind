import React from "react";

export function PodcastSkeleton() {
  return (
    <div className="relative w-full min-h-screen bg-[#030914] text-slate-100 overflow-x-hidden animate-pulse pb-24 sm:pb-32">
      <section className="relative w-full overflow-hidden flex items-center pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 lg:pb-28 mb-10 sm:mb-14 min-h-[520px] sm:min-h-[580px] lg:min-h-[660px] xl:min-h-[720px] bg-gradient-to-r from-[#030914] via-[#051124] to-[#030914]">
        <div className="relative z-10 w-full max-w-[1680px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 mx-auto">
          <div className="max-w-2xl lg:max-w-xl space-y-4">
            <div className="h-10 sm:h-14 lg:h-16 w-full bg-white/20 rounded-xl" />
            <div className="h-10 sm:h-14 lg:h-16 w-4/5 bg-gradient-to-r from-[#00E5FF]/40 to-[#00C4B4]/40 rounded-xl" />
            <div className="space-y-2 pt-2 max-w-lg">
              <div className="h-4 w-full bg-slate-300/20 rounded" />
              <div className="h-4 w-5/6 bg-slate-300/20 rounded" />
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 max-w-[1680px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 mx-auto space-y-12 sm:space-y-16">
        <section className="relative rounded-3xl p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-[#07162e] via-[#051124] to-[#020712] border border-[#00C4B4]/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[640px] aspect-video lg:aspect-[4/3] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#00C4B4]/50 to-[#2563EB]/50" />
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="h-8 sm:h-10 w-full max-w-md bg-white/20 rounded-lg" />
                <div className="space-y-2 pt-2">
                  <div className="h-3.5 w-full bg-slate-300/20 rounded" />
                  <div className="h-3.5 w-11/12 bg-slate-300/20 rounded" />
                  <div className="h-3.5 w-4/5 bg-slate-300/20 rounded" />
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08]">
                <div className="h-11 w-44 rounded-full bg-gradient-to-r from-[#00C4B4]/40 to-[#2563EB]/40 border border-white/10" />
              </div>
            </div>
          </div>
        </section>

        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00C4B4]" />
              <div className="h-6 w-48 bg-white/20 rounded-md" />
            </div>
            <div className="h-4 w-32 bg-slate-400/20 rounded hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-[#061226]/85 border border-white/[0.09] overflow-hidden flex flex-col h-full space-y-4">
                <div className="w-full aspect-video bg-white/5" />
                <div className="p-4 sm:p-5 space-y-2.5 pt-0">
                  <div className="h-3 w-20 bg-[#00C4B4]/40 rounded" />
                  <div className="h-5 w-4/5 bg-white/20 rounded-md" />
                  <div className="h-3.5 w-full bg-slate-300/20 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
