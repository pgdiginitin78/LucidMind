import React from "react";

export function InsightsSkeleton() {
  return (
    <div className="relative w-full min-h-screen bg-[#040914] text-slate-100 overflow-x-hidden animate-pulse pb-24 sm:pb-32">
      <section className="relative w-full overflow-hidden flex items-end md:items-center pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16 lg:pb-20 mb-8 sm:mb-12 min-h-[560px] sm:min-h-[620px] lg:min-h-[680px] xl:min-h-[720px] bg-gradient-to-r from-[#040914] via-[#06142a] to-[#040914]">
        <div className="relative z-10 w-full max-w-[1680px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 mx-auto">
          <div className="max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
            <div className="flex items-center gap-3 mb-4 justify-start">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00C4B4] shadow-[0_0_10px_#00C4B4]" />
              <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-[#00C4B4] to-transparent" />
            </div>

            <div className="space-y-3 mb-4">
              <div className="h-9 sm:h-12 lg:h-14 w-full bg-white/20 rounded-xl" />
              <div className="h-9 sm:h-12 lg:h-14 w-4/5 bg-gradient-to-r from-[#00C4B4]/40 to-[#2563EB]/40 rounded-xl" />
              <div className="h-9 sm:h-12 lg:h-14 w-2/3 bg-white/20 rounded-xl" />
            </div>

            <div className="space-y-2 max-w-xl mt-4">
              <div className="h-4 w-full bg-slate-300/20 rounded" />
              <div className="h-4 w-4/5 bg-slate-300/20 rounded" />
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 max-w-[1680px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 mx-auto space-y-16 sm:space-y-20">
        <div className="w-full pb-4 sm:pb-5 border-b border-white/[0.08]">
          <div className="w-full sm:w-auto flex justify-center sm:justify-start">
            <div className="w-full sm:w-auto grid grid-cols-2 sm:flex sm:items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl sm:rounded-full bg-[#08152b]/90 border border-white/[0.1]">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 w-24 sm:w-28 rounded-xl sm:rounded-full bg-white/10" />
              ))}
            </div>
          </div>
        </div>

        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.06]">
            <div className="space-y-2">
              <div className="h-8 w-72 bg-white/20 rounded-lg" />
              <div className="h-4 w-96 max-w-full bg-slate-400/20 rounded" />
            </div>
          </div>

          <div className="rounded-3xl bg-[#08152b]/90 border border-white/[0.12] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-7 h-72 sm:h-96 lg:h-80 bg-white/5 border-b lg:border-b-0 lg:border-r border-white/10" />
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="h-4 w-24 bg-white/10 rounded" />
                <div className="h-6 sm:h-7 w-full bg-white/20 rounded-lg" />
                <div className="h-6 sm:h-7 w-4/5 bg-white/20 rounded-lg" />
                <div className="space-y-1.5 pt-2">
                  <div className="h-3.5 w-full bg-slate-300/20 rounded" />
                  <div className="h-3.5 w-full bg-slate-300/20 rounded" />
                  <div className="h-3.5 w-2/3 bg-slate-300/20 rounded" />
                </div>
              </div>
              <div className="pt-4 border-t border-white/[0.08] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div className="h-4 w-32 bg-white/10 rounded" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-[#08152b]/85 border border-white/[0.09] p-5 space-y-4">
                <div className="w-full aspect-video rounded-xl bg-white/5" />
                <div className="h-5 w-3/4 bg-white/20 rounded" />
                <div className="space-y-1.5">
                  <div className="h-3 w-full bg-white/10 rounded" />
                  <div className="h-3 w-4/5 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
