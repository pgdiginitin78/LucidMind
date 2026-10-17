import React from "react";

export function AboutSkeleton() {
  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 overflow-x-hidden animate-pulse">
      <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] xl:min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#040814] via-[#06142a] to-[#040814]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#040814]/90 via-[#040814]/40 to-transparent pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full flex items-center justify-between px-5 sm:px-10 md:px-14 xl:px-20 py-24 sm:py-28 xl:py-32 min-h-[85vh] sm:min-h-[90vh] xl:min-h-screen">
          <div className="w-full xl:max-w-3xl">
            <div className="h-12 sm:h-16 md:h-20 w-full max-w-xl bg-white/20 rounded-xl" />
            <div className="h-12 sm:h-16 md:h-20 w-3/4 max-w-lg bg-gradient-to-r from-white/20 to-[#00C4B4]/40 rounded-xl mt-3" />

            <div className="mt-6 space-y-2.5 max-w-lg">
              <div className="h-4 w-full max-w-md bg-white/15 rounded-md" />
              <div className="h-4 w-3/4 max-w-sm bg-white/15 rounded-md" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full bg-[#F1F6FB] overflow-hidden flex items-center py-12 sm:py-14 md:py-16 min-h-[220px] sm:min-h-[250px]">
        <div className="relative z-10 w-full max-w-[1680px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 lg:gap-12">
          <div className="hidden xl:block w-[24%] h-28 rounded-xl bg-slate-300/40 shrink-0" />

          <div className="w-full md:w-[40%] xl:w-[35%] shrink-0 space-y-2.5">
            <div className="h-7 sm:h-8 w-full bg-slate-300/70 rounded-lg" />
            <div className="h-7 sm:h-8 w-4/5 bg-slate-300/70 rounded-lg" />
            <div className="h-7 sm:h-8 w-3/5 bg-slate-300/70 rounded-lg" />
          </div>

          <div className="w-full md:w-[50%] space-y-2">
            <div className="h-4 w-full bg-slate-300/50 rounded-md" />
            <div className="h-4 w-11/12 bg-slate-300/50 rounded-md" />
            <div className="h-4 w-4/5 bg-slate-300/50 rounded-md" />
          </div>
        </div>
      </section>
    </div>
  );
}
