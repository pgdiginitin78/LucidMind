import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Heading from "../../components/ui/Heading";
import WebGLParticleCanvas from "./WebGLParticleCanvas";
import podcastMicrophone from "../../assets/podcast_microphone.png";
import podcastsSectionBg from "../../assets/podcasts_section_bg.png";


gsap.registerPlugin(ScrollTrigger);

const podcastEpisodes = [
  {
    ep: "EPISODE 26",
    title: "AI Governance: Building Trust at Enterprise Scale",
    duration: "28 MIN",
    iconPath: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-5 h-5"
        stroke="#00C4B4"
        strokeWidth="1.6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
  {
    ep: "EPISODE 25",
    title: "The Future of Work in an Intelligent World",
    duration: "24 MIN",
    iconPath: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-5 h-5"
        stroke="#00C4B4"
        strokeWidth="1.6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
    ),
  },
  {
    ep: "EPISODE 24",
    title: "Data, Decisions and Competitive Advantage",
    duration: "29 MIN",
    iconPath: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-5 h-5"
        stroke="#00C4B4"
        strokeWidth="1.6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
        />
      </svg>
    ),
  },
  {
    ep: "EPISODE 23",
    title: "Leading Change When the Future is Uncertain",
    duration: "27 MIN",
    iconPath: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-5 h-5"
        stroke="#00C4B4"
        strokeWidth="1.6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
        />
      </svg>
    ),
  },
];

function PlayIcon({ size = 18 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ width: size, height: size }}
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-4 h-4 inline-block ml-1"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
      />
    </svg>
  );
}

function WaveformIcon() {
  return (
    <svg viewBox="0 0 32 16" className="w-6 h-4" fill="none">
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

export default function Podcasts() {
  const sectionRef = useRef(null);
  const episodesRef = useRef([]);

  useGSAP(() => {
    gsap.from(".podcasts-headline", {
      opacity: 0,
      x: -50,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
    });
    gsap.from(".featured-episode-card", {
      opacity: 0,
      scale: 0.95,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
    });
    gsap.from(episodesRef.current, {
      opacity: 0,
      x: 30,
      stagger: 0.12,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
    });
  }, []);

  return (
    <div className="w-full relative bg-[#040C1A]">
      {/* Top thin divider line */}
      <div className="w-full border-t border-[#0F2644]" />

      <section
        ref={sectionRef}
        className="w-full py-10 px-6 sm:px-12 md:px-16 lg:px-12 relative overflow-hidden font-['PlusJakartaSans',sans-serif]"
      >
        <WebGLParticleCanvas variant="podcast" />
        <img
          src={podcastsSectionBg}
          alt="Podcasts Section Background"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[1] opacity-80"
        />  

        <div className="max-w-[1440px] mx-auto relative" style={{ zIndex: 2 }}>
          <div className="flex flex-col lg:flex-row gap-4 xl:gap-5 items-start">
            
            <div className="podcasts-headline lg:w-[320px] xl:w-[420px] 2xl:w-[520px] flex-shrink-0 pt-2">
              <div className="flex items-center gap-2 mb-3">
                <WaveformIcon />
                <p className="text-[#00C4B4] font-semibold tracking-[0.18em] uppercase text-xs">
                  PODCASTS
                </p>
              </div>
              <Heading
                level={2}
                className="font-['Playfair_Display',serif] font-semibold text-[2.5rem] md:text-[2.5rem] 2xl:text-[3.25rem] leading-[1.05] tracking-tight text-white mb-5"
              >
                Conversations that<br />
                Inspire and <span className="text-[#00C4B4] font-['Playfair_Display',serif]">Challenge.</span>
              </Heading>
              <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed mb-7 max-w-xs">
                Candid conversations with global leaders, operators and innovators
                shaping the future with AI.
              </p>
              <motion.button
                whileHover={{ scale: 1.04, backgroundColor: "#00C4B4", color: "#ffffff" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-2.5 border border-[#00C4B4]/60 text-[#00C4B4] text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#00C4B4] hover:text-white transition-colors duration-300 cursor-pointer"
              >
                View All Episodes
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center">
                  <ArrowRightIcon />
                </span>
              </motion.button>
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8 w-full">
              <motion.div
                className="featured-episode-card rounded-2xl overflow-hidden relative flex flex-col bg-[#09172B]/[0.88] backdrop-blur-lg border border-[#00C4B4]/25 shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 20px 45px rgba(0, 196, 180, 0.22)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative h-[180px] 2xl:h-[260px] overflow-hidden">
                  <img
                    src={podcastMicrophone}
                    alt="Featured Podcast Episode"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09172B] via-transparent to-black/30" />
                  <span className="absolute top-3 left-3 bg-[#09172B]/85 backdrop-blur-md border border-[#00C4B4]/40 text-[#00C4B4] text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                    FEATURED EPISODE
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-5 pt-3">
                  <p className="text-[#00C4B4] text-[11px] font-semibold tracking-widest uppercase mb-1.5">
                    EPISODE 27
                  </p>
                  <h3 className="text-white font-['Playfair_Display',serif] font-semibold text-[1.5rem] leading-[1.2] mb-2.5">
                    Redefining Productivity in the Age of AI
                  </h3>
                  <p className="text-[#94A3B8] text-xs leading-relaxed mb-5">
                    A conversation on augmenting human potential, rethinking
                    workflows and driving real impact.
                  </p>
                  
                <div className="flex items-center justify-center">
                    <motion.button
                    whileHover={{ scale: 1.04, backgroundColor: "#009A9A" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-3 bg-[#00C4B4] text-[#061325] text-xs font-bold px-4 py-2.5 rounded-full w-fit cursor-pointer transition-colors duration-200"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#061325]/20 flex items-center justify-center text-[#061325]">
                      <PlayIcon size={12} />
                    </span>
                    Listen Now
                    <span className="text-[#061325]/70 font-medium ml-1">32 MIN</span>
                  </motion.button>
                </div>

                  <div className="mt-5 flex items-end justify-center w-full shrink-0 h-6 gap-[3px] opacity-40">
                    {Array.from({ length: 48 }).map((_, i) => {
                      const h = Math.max(
                        4,
                        Math.round(Math.abs(Math.sin(i * 0.6)) * 20 + 4),
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

              {/* Episode list */}
              <div className="flex flex-col gap-3.5 justify-between h-full">
                {podcastEpisodes.map((ep, idx) => (
                  <motion.div
                    key={idx}
                    ref={(el) => (episodesRef.current[idx] = el)}
                    whileHover={{ x: 4, borderColor: "rgba(0, 196, 180, 0.4)" }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3.5 rounded-xl px-4 py-3 cursor-pointer group flex-1 bg-[#09172B]/80 backdrop-blur-md border border-[#00C4B4]/15 shadow-[0_4px_15px_rgba(0,0,0,0.25)]"
                  >
                    <button className="w-9 h-9 rounded-full border border-[#00C4B4]/40 flex items-center justify-center text-[#00C4B4] group-hover:border-[#00C4B4] group-hover:bg-[#00C4B4] group-hover:text-[#061325] transition-all duration-200 flex-shrink-0">
                      <PlayIcon size={12} />
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-[#00C4B4] text-[10px] font-semibold tracking-widest uppercase mb-0.5">
                        {ep.ep}
                      </p>
                      <p className="text-white text-xs font-['PlusJakartaSans',sans-serif] font-medium leading-snug truncate group-hover:text-[#00C4B4] transition-colors">
                        {ep.title}
                      </p>
                    </div>

                    <span className="text-[#94A3B8] text-[10px] font-medium flex-shrink-0">
                      {ep.duration}
                    </span>

                    <div className="w-10 h-10 rounded-lg bg-[#0C2442] border border-[#00C4B4]/20 flex items-center justify-center flex-shrink-0 group-hover:border-[#00C4B4]/40 transition-colors">
                      {ep.iconPath}
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

