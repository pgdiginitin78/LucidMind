"use client";
import { useEffect } from "react";
import { Link } from "@/lib/navigation";
import AiParticleDisplay from "./AiParticleDisplay";
import DotField from "./DotField";
import { usePageReady } from "../../transitions/PageTransitionContext";
import { motion } from "framer-motion";

function HeroSection() {
  const { setReady } = usePageReady();

  useEffect(() => {
    setReady(true);
  }, [setReady]);

  return (
    <div className="relative w-full min-h-screen md:min-h-[90dvh]  lg:min-h-screen flex items-center justify-center overflow-hidden py-16 sm:py-20 md:py-0 bg-gradient-to-r from-[#4B9AF5] to-[#040914]">
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <DotField
          dotRadius={1.5}
          dotSpacing={16}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          gradientFrom="#00C4B4"
          gradientTo="#2563EB"
          glowColor="#00C4B4"
        />
      </div>

      <div className="absolute inset-0 md:inset-y-0 md:left-0 md:right-auto w-full md:w-[70%] lg:w-[60%] pointer-events-none z-10 bg-gradient-to-b md:bg-gradient-to-r from-[#040914]/95 via-[#040914]/70 md:via-[#040914]/60 to-[#040914]/60 md:to-transparent" />

      <div
        className="absolute top-1/3 sm:top-1/2 -left-16 sm:-left-20 -translate-y-1/2 w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] lg:w-[650px] lg:h-[650px] pointer-events-none z-10 opacity-60 sm:opacity-70 blur-[60px] sm:blur-[90px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, rgba(0, 196, 180, 0.22) 0%, rgba(37, 99, 235, 0.12) 50%, transparent 75%)",
        }}
      />

      <div className="relative z-20 w-full max-w-[1680px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 mx-auto flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10 md:gap-8 lg:gap-8">
        <div className="w-full md:w-[48%] lg:w-[50%] flex items-center justify-center order-first md:order-last scale-95 sm:scale-100 md:scale-100 -mb-6 sm:-mb-4 md:mb-0">
          <AiParticleDisplay />
        </div>

        <div className="w-full md:w-[52%] lg:w-[50%] flex flex-col md:pt-20 lg:pt-10 items-center md:items-start gap-4 text-center md:text-left font-['Inter',sans-serif]">
          <div className="flex flex-col items-center md:items-start w-full">
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="heading-h1 text-white w-full"
            >
              Built For The <br />
              <span className="text-[#009A9A]">Adaptive Future</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="origin-left w-10 sm:w-12 md:w-16 h-[3px] bg-[#009A9A] mt-4 sm:mt-6 mb-2"
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="body-text text-slate-400 font-medium max-w-xs sm:max-w-md md:max-w-lg mb-2"
          >
            Helping leaders turn technology, transformation and organisational
            capability into measurable business impact.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.38,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href="/contact"
              className="group cursor-pointer flex items-center justify-center gap-3 sm:gap-4 rounded-full bg-gradient-to-r from-[#00B8B8] via-[#009A9A] to-[#006D77] px-5 py-2.5 sm:px-7 sm:py-3 text-white body-text font-medium shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-cyan-500/40 mt-2 w-full sm:w-auto"
            >
              <span>Schedule a Conversation</span>

              <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12h15m0 0-6.75-6.75M19.5 12l-6.75 6.75"
                  />
                </svg>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
