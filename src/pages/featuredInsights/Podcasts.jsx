import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import Heading from "../../components/ui/Heading";
import Strands from "./Strands";
import WebGLParticleCanvas from "./WebGLParticleCanvas";

gsap.registerPlugin(ScrollTrigger);

function WaveformIcon() {
  return (
    <svg viewBox="0 0 32 16" className="w-5 h-3 sm:w-6 sm:h-4" fill="none">
      {[2, 6, 10, 14, 18, 22, 26, 30].map((x, i) => (
        <rect
          key={i}
          x={x - 1}
          y={i % 2 === 0 ? 2 : 5}
          width="2"
          height={i % 2 === 0 ? 12 : 6}
          rx="1"
          fill="#00C4B4"
          opacity={0.6 + (i % 3) * 0.15}
        />
      ))}
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function Podcasts() {
  const sectionRef = useRef(null);
  const location = useLocation();
  const isStandalone = location.pathname === "/podcasts";

  useGSAP(() => {
    gsap.from(".podcasts-headline", {
      opacity: 0,
      x: -50,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
    });
    gsap.from(".podcast-video-card", {
      opacity: 0,
      x: 50,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
    });
  }, []);

  return (
    <div className="w-full relative bg-white">
      <div className="w-full border-t border-[#00C4B4]/20" />

      <section
        ref={sectionRef}
        className={`w-full ${isStandalone ? "pt-10 pb-10 sm:pt-12 sm:pb-12" : "py-10 sm:py-12"} px-5 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden font-['PlusJakartaSans',sans-serif]`}
      >
        <WebGLParticleCanvas variant="podcast" />

        <div className="absolute hidden md:block inset-0 w-full h-full pointer-events-none z-0">
          <Strands
            colors={["#00C4B4", "#2563EB", "#4B9AF5"]}
            count={3}
            speed={0.5}
            amplitude={1}
            waviness={1}
            thickness={0.7}
            glow={2.6}
            taper={3}
            spread={1}
            intensity={0.6}
            saturation={2}
            opacity={1}
            scale={1.5}
            glass={false}
            refraction={1}
            dispersion={1}
            glassSize={1}
            hueShift={0}
          />
        </div>

        <div className="max-w-[1440px] mx-auto relative" style={{ zIndex: 2 }}>
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 xl:gap-16 items-center">
            <div className="podcasts-headline w-full lg:w-[380px] xl:w-[440px] 2xl:w-[500px] flex-shrink-0 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-3 sm:mb-4">
                <WaveformIcon />
                <p className="text-[#00C4B4] font-semibold tracking-[0.15em] sm:tracking-[0.18em] uppercase text-xs">
                  PODCAST
                </p>
              </div>

              <Heading
                level={2}
                className="font-['Playfair_Display',serif] font-semibold text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[2.5rem] xl:text-[2.75rem] 2xl:text-[3rem] leading-[1.15] sm:leading-[1.1] md:leading-[1.08] tracking-tight text-[#050B18] mb-4 sm:mb-5"
              >
                Conversations that
                <br />
                Inspire and{" "}
                <span className="text-[#00C4B4] font-['Playfair_Display',serif]">
                  Challenge.
                </span>
              </Heading>

              <p className="text-[#050B18]/70 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6 max-w-sm mx-auto lg:mx-0">
                Candid conversations with global leaders, operators and
                innovators shaping the future with AI — exploring strategy,
                transformation, and what it truly means to lead in an
                intelligent world.
              </p>

              <div className="flex items-center gap-3 mb-6 sm:mb-8 p-3.5 sm:p-4 rounded-xl bg-white border border-[#00C4B4]/20 text-left max-w-sm mx-auto lg:mx-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#00C4B4] to-[#2563EB] flex items-center justify-center text-white text-sm font-bold shrink-0">
                  RP
                </div>
                <div>
                  <p className="text-[#050B18] text-sm font-semibold leading-tight">
                    Ravishankar Pingali
                  </p>
                  <p className="text-[#050B18]/60 text-xs leading-snug mt-0.5">
                    GCC Leader · Enterprise Reinvention · Board Advisor
                  </p>
                </div>
              </div>

              <a
                href="https://www.youtube.com/watch?v=yNcLs9dyaDI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#050B18] text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#FF0000]/20 hover:border-[#FF0000]/60 transition-all duration-200 cursor-pointer w-full sm:w-auto"
              >
                <YoutubeIcon />
                Watch on YouTube
              </a>
            </div>

            <div className="podcast-video-card flex-1 w-full">
              <motion.div
                className="rounded-2xl overflow-hidden bg-white border border-[#00C4B4]/20 shadow-[0_16px_48px_rgba(0,0,0,0.06)]"
                whileHover={{ boxShadow: "0 24px 60px rgba(0, 196, 180, 0.15)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    src="https://www.youtube.com/embed/yNcLs9dyaDI?rel=0&modestbranding=1"
                    title="Ravishankar Pingali Podcast"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    style={{ border: "none" }}
                  />
                </div>

                <div className="px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[#00C4B4] text-[10px] font-bold tracking-widest uppercase mb-1">
                      PODCAST
                    </p>
                    <h3 className="text-[#050B18] font-['Playfair_Display',serif] font-semibold text-sm sm:text-base leading-snug truncate">
                      Redefining Productivity in the Age of AI
                    </h3>
                  </div>
                  <div className="hidden sm:flex items-end gap-[2px] h-7 shrink-0 ml-4 opacity-50">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const h = Math.max(
                        4,
                        Math.round(Math.abs(Math.sin(i * 0.7)) * 20 + 4),
                      );
                      return (
                        <div
                          key={i}
                          className="bg-[#00C4B4] rounded-full"
                          style={{ width: 2, height: h }}
                        />
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}