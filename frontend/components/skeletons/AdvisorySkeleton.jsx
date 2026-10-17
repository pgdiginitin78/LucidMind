import React from "react";

export function AdvisorySkeleton() {
  return (
    <div className="relative w-full min-h-screen bg-[#040914] text-slate-100 overflow-x-hidden animate-pulse">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-full h-[500px] pointer-events-none bg-gradient-to-b from-[#00C4B4]/20 via-[#2563EB]/15 to-transparent blur-3xl" />
        <div className="absolute top-1/3 left-0 -translate-y-1/2 w-96 h-96 pointer-events-none rounded-full bg-[#00C4B4]/10 blur-[100px]" />
        <div className="absolute top-2/3 right-0 -translate-y-1/2 w-96 h-96 pointer-events-none rounded-full bg-[#2563EB]/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1680px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 mx-auto pt-24 sm:pt-40 pb-24 sm:pb-32">
        <section className="text-left my-16 sm:my-20 max-w-3xl">
          <div className="flex items-center gap-3 mb-4 justify-start">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00C4B4] shadow-[0_0_10px_#00C4B4]" />
            <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-[#00C4B4] to-transparent" />
          </div>

          <div className="h-10 sm:h-14 lg:h-18 w-full max-w-lg bg-white/20 rounded-xl" />
          <div className="h-10 sm:h-14 lg:h-18 w-3/4 max-w-md bg-gradient-to-r from-[#00C4B4]/50 to-[#2563EB]/40 rounded-xl mt-3" />
        </section>

        <section className="w-full h-16 sm:h-20 rounded-2xl bg-[#040D1E]/60 border border-[#142A4A] mb-16 sm:mb-20 flex items-center justify-around px-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-5 w-20 sm:w-28 bg-white/10 rounded-md" />
          ))}
        </section>

        <div className="w-full max-w-5xl mx-auto">
          <section className="grid grid-cols-1 justify-items-center mb-10 md:mb-14">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-px bg-[#00C4B4]" />
              <div className="h-3 w-48 bg-[#00C4B4]/40 rounded-full" />
              <div className="w-4 h-px bg-[#00C4B4]" />
            </div>

            <div className="h-8 sm:h-10 w-64 bg-white/20 rounded-xl mb-4" />
            <div className="max-w-2xl w-full space-y-2 mb-10">
              <div className="h-3.5 w-full bg-slate-300/20 rounded-md" />
              <div className="h-3.5 w-4/5 mx-auto bg-slate-300/20 rounded-md" />
            </div>

            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-3 items-stretch relative mt-8">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="relative flex flex-col items-center">
                  <div className="w-full relative flex flex-col items-center justify-center pt-10 pb-5 px-3 sm:px-4 rounded-2xl border border-[#142A4A] bg-[#040D1E]/80 min-h-[110px]">
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-b from-[#2563EB]/50 to-[#040D1E] border-2 border-[#2563EB]/80" />
                    <div className="h-3.5 w-20 bg-white/20 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10 md:mb-18 border border-[#2563EB]/40 p-4 md:p-8 rounded-2xl bg-[#040D1E]/40 backdrop-blur-md">
            <div className="h-6 w-24 rounded-full bg-gradient-to-r from-[#00C4B4]/40 to-[#2563EB]/40 mb-3" />
            <div className="h-6 w-56 bg-white/20 rounded-lg mb-6" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center p-4 md:p-8 rounded-2xl border border-[#142A4A] bg-[#040D1E]/85">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-[#142A4A]/50">
                  <div className="w-10 h-10 rounded-full bg-[#00C4B4]/20 border border-[#00C4B4]/40" />
                  <div className="h-5 w-52 bg-white/20 rounded-md" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-28 bg-[#00C4B4]/40 rounded" />
                  <div className="h-3.5 w-full bg-slate-300/20 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-28 bg-[#00C4B4]/40 rounded" />
                  <div className="h-3.5 w-full bg-slate-300/20 rounded" />
                  <div className="h-3.5 w-4/5 bg-slate-300/20 rounded" />
                </div>
              </div>

              <div className="lg:col-span-5 h-48 sm:h-56 rounded-xl bg-white/5 border border-white/10" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
