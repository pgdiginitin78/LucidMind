"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Play } from "lucide-react";
import { usePathname, Link } from "@/lib/navigation";
import { useEffect, useRef, useState } from "react";
import Heading from "../../ui/Heading";
import WebGLParticleCanvas from "./WebGLParticleCanvas";
import Image from "@/common/Image";
import PodcastBannerImg from "./images/PodcastBanner.webp";
import { API_BASE_URL } from "@/lib/api";

function WaveformIcon({ active = false }) {
  return (
    <svg viewBox="0 0 32 16" className="w-5 h-3" fill="none">
      {[2, 6, 10, 14, 18, 22, 26, 30].map((x, i) => (
        <rect
          key={i}
          x={x - 1}
          y={i % 2 === 0 ? 2 : 5}
          width="2"
          height={i % 2 === 0 ? 12 : 6}
          rx="1"
          fill={active ? "#fff" : "#00C4B4"}
          opacity={0.6 + (i % 3) * 0.15}
        />
      ))}
    </svg>
  );
}

export default function Podcasts() {
  const sectionRef = useRef(null);
  const pathname = usePathname();
  const isStandalone = pathname === "/podcasts";
  const [selectedPodcast, setSelectedPodcast] = useState(0);
  const [podcastsList, setPodcastsList] = useState([]);

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE_URL}/api/podcasts`)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        if (isMounted && data?.podcasts && data.podcasts.length > 0) {
          const activePodcasts = data.podcasts.filter(
            (p) => p.isActive !== false && p.isPublished !== false,
          );
          const normalized = activePodcasts.map((p, idx) => ({
            id: p._id || p.id || idx + 1,
            title: p.title || "",
            episode: p.episode || `Ep. 0${idx + 1}`,
            src: p.src || p.audioUrl || "",
            thumbnail: p.thumbnail || p.coverImage || p.image || "",
            description: Array.isArray(p.description)
              ? p.description
              : p.description
                ? p.description.split("\n\n")
                : [],
          }));
          setPodcastsList(normalized);
        }
      })
      .catch(() => {
        // use DEFAULT_PODCASTS on fetch failure
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectPodcast = (index) => {
    setSelectedPodcast(index);
  };

  const handlePlayClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const current = podcastsList[selectedPodcast] || podcastsList[0] || {};

  return (
    <div className="w-full relative bg-[#040C1A] overflow-hidden">
      {/* Background Banner Image */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src={PodcastBannerImg}
          alt="Podcast Banner"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-85 sm:opacity-95"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040C1A]/70 via-transparent to-[#040C1A]/85 pointer-events-none" />
      </div>

      <div className="w-full border-t border-[#0F2644]/60 relative z-[1]" />
      <div className="absolute pointer-events-none top-[-15%] left-[-8%] w-[65%] pb-[65%] rounded-full blur-[2px] bg-[radial-gradient(circle,rgba(0,196,180,0.12)_0%,rgba(0,196,180,0.03)_45%,transparent_70%)] z-[1]" />
      <div className="absolute pointer-events-none bottom-[-20%] right-[-10%] w-[60%] pb-[60%] rounded-full blur-[2px] bg-[radial-gradient(circle,rgba(14,165,233,0.12)_0%,rgba(14,165,233,0.03)_45%,transparent_70%)] z-[1]" />
      <div className="absolute pointer-events-none top-[35%] left-1/2 -translate-x-1/2 w-[40%] pb-[25%] rounded-full bg-[radial-gradient(ellipse,rgba(0,196,180,0.06)_0%,transparent_70%)] z-[1]" />
      <div className="w-full h-[1.5px] bg-[linear-gradient(90deg,transparent_0%,#00C4B4_35%,#0EA5E9_65%,transparent_100%)] relative z-[1]" />
      <section
        ref={sectionRef}
        className={`w-full ${isStandalone ? "pt-28 sm:pt-36 pb-12 sm:pb-16" : "py-12 sm:py-16 md:py-20"} relative font-['PlusJakartaSans',sans-serif]`}
      >
        <WebGLParticleCanvas variant="podcast" />

        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 relative z-[2]">
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-6 sm:mb-8 text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-full bg-[#00C4B4]/10 border border-[#00C4B4]/25">
                  <WaveformIcon />
                  <p className="text-[#00C4B4] font-semibold tracking-[0.2em] uppercase text-[10px] sm:text-xs">
                    Podcasts
                  </p>
                </div>
                <Heading
                  level={2}
                  className="font-['Playfair_Display',serif] font-semibold text-[1.4rem] sm:text-[1.7rem] md:text-[2rem] lg:text-[2.3rem] leading-[1.15] tracking-tight text-white mt-2 mb-2"
                >
                  Conversations that{" "}
                  <span className="bg-[linear-gradient(135deg,#00C4B4,#4B9AF5)] bg-clip-text text-transparent">
                    Inspire.
                  </span>
                </Heading>
                <p className="text-white/50 text-xs sm:text-sm max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Candid insights from Ravishankar Pingali on leadership, AI,
                  and the future of Global Capability Centres.
                </p>
              </motion.div>

              <div className="w-full  flex-shrink-0">
                <div className="flex flex-col gap-3.5">
                  {podcastsList.slice(0, 3).map((podcast, index) => {
                    const isActive = selectedPodcast === index;
                    return (
                      <motion.div
                        key={podcast.id}
                        initial={{ opacity: 0, x: -40, scale: 0.97 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.07,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        onClick={() => handleSelectPodcast(index)}
                        whileHover={{ x: isActive ? 0 : 6, scale: 1.01 }}
                        className={`cursor-pointer rounded-lg flex items-center gap-3 px-3 py-2.5 group transition-all duration-300 ${
                          isActive
                            ? "bg-[linear-gradient(135deg,rgba(0,196,180,0.18)_0%,rgba(37,99,235,0.12)_100%)] border border-[#00C4B4]/45 shadow-[0_4px_24px_rgba(0,196,180,0.15),inset_0_1px_0_rgba(255,255,255,0.06)]"
                            : "bg-white/[0.03] border border-white/[0.07]"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex flex-col items-center justify-center shrink-0 transition-all duration-300 ${
                            isActive
                              ? "bg-[linear-gradient(135deg,#00C4B4,#2563EB)] shadow-[0_4px_16px_rgba(0,196,180,0.35)]"
                              : "bg-white/[0.06]"
                          }`}
                        >
                          {/* {isActive ? (
                          <WaveformIcon active />
                        ) : (
                          <span className="text-[10px] font-bold text-[#00C4B4] leading-none px-0.5 ">
                            {podcast.episode}
                          </span>
                        )} */}
                          <Play className="w-4 h-4 sm:w-4 sm:h-4 text-white fill-white ml-0.5" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <p
                            className={`text-xs 2xl:text-base font-semibold leading-snug line-clamp-2 transition-colors duration-300 ${isActive ? "text-white" : "text-white/60 group-hover:text-white/85"}`}
                          >
                            {podcast.title}
                          </p>
                          <p className="text-[10px] 2xl:text-sm text-white/30 mt-0.5">
                            {podcast.episode}
                          </p>
                        </div>
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full shrink-0 mr-1 bg-[linear-gradient(135deg,#00C4B4,#4B9AF5)] shadow-[0_0_6px_rgba(0,196,180,0.7)]" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex-1 w-full lg:sticky lg:top-24 min-w-0"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedPodcast}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="rounded-xl overflow-hidden bg-white/[0.04] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md"
                  >
                    <div
                      onClick={() => handlePlayClick(current.src)}
                      className="relative w-full pt-[52%] lg:pt-[42%] xl:pt-[50%] cursor-pointer group/thumb"
                    >
                      <img
                        src={current.thumbnail}
                        alt={current.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-[linear-gradient(135deg,#00C4B4,#2563EB)] shadow-[0_8px_28px_rgba(0,196,180,0.45)] transition-transform duration-300 group-hover/thumb:scale-110">
                          <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="px-4 sm:px-5 py-4 border-t border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,transparent_100%)]">
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <h3 className="font-['Playfair_Display',serif] font-bold text-white text-base sm:text-lg 2xl:text-2xl leading-snug">
                          {current.title}
                        </h3>
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          <div className="w-full flex justify-center mt-10">
            <Link
              href="/podcasts"
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-[#00C4B4] via-[#009A9A] to-[#2563EB] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_24px_rgba(0,196,180,0.35)] hover:shadow-[0_0_36px_rgba(0,196,180,0.55)] hover:scale-[1.03] transition-all duration-300 group cursor-pointer"
            >
              <span>View All Episodes</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4 inline-block ml-1 transition-transform group-hover:translate-x-1"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
