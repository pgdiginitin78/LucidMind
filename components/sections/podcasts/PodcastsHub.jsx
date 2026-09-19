"use client";
import { useEffect, useState } from "react";
import { usePageReady } from "@/components/transitions/PageTransitionContext";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Headphones, Mic, Play, X } from "lucide-react";
import Image from "next/image";
import PodcastHeroBanner from "./images/PodcastHeroBanner.webp";
import PodcastHeroBannerMobile from "./images/PodcastHeroBannerMobile.webp";

export default function PodcastsHub() {
  const { setReady } = usePageReady();
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [playingModal, setPlayingModal] = useState(null);

  useEffect(() => {
    setReady(true);
  }, [setReady]);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/podcasts")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        if (isMounted && data?.podcasts && Array.isArray(data.podcasts)) {
          const activeList = data.podcasts.filter(
            (p) => p.isActive !== false && p.isPublished !== false,
          );
          const normalized = activeList.map((p, idx) => ({
            id: p._id || p.id || idx + 1,
            title: p.title || "",
            episode: p.episode || `Ep. 0${idx + 1}`,
            src: p.src || p.audioUrl || "",
            thumbnail:
              p.thumbnail ||
              p.coverImage ||
              p.image ||
              "/assets/podcastThumbnails/Capacity vs Capability.min.webp",
            description: Array.isArray(p.description)
              ? p.description
              : p.description
                ? p.description.split("\n\n")
                : [],
          }));
          setPodcasts(normalized);
          if (normalized.length > 0) {
            setActiveEpisode(normalized[0]);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const openPlayer = (episode) => {
    if (episode.src) {
      setPlayingModal(episode);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#030914] text-slate-100 font-['PlusJakartaSans',sans-serif] selection:bg-[#00C4B4]/30 selection:text-white pb-24 sm:pb-32 overflow-hidden">
      <section className="relative w-full overflow-hidden flex items-center pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 lg:pb-28 mb-10 sm:mb-14 min-h-[520px] sm:min-h-[580px] lg:min-h-[660px] xl:min-h-[720px]">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src={PodcastHeroBanner}
            alt="Conversations on Enterprise AI & Scale"
            fill
            priority
            sizes="100vw"
            className="hidden md:block object-cover object-right md:object-center"
          />
          <Image
            src={PodcastHeroBannerMobile}
            alt="Conversations on Enterprise AI & Scale"
            fill
            priority
            sizes="100vw"
            className="block md:hidden object-cover object-center"
          />
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#030914] via-[#030914]/70 lg:via-[#030914]/25 to-transparent" />
          <div className="block md:hidden absolute inset-0 bg-gradient-to-b from-[#030914]/30 via-transparent to-[#030914]/70" />
          <div className="absolute inset-x-0 bottom-0 h-16 sm:h-32 bg-gradient-to-t from-[#030914] to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-8">
          <header className="max-w-2xl lg:max-w-xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl  font-extrabold font-['Playfair_Display',serif] tracking-tight text-white leading-[1.1] mb-4"
            >
              Conversations on{" "}
              <span className="bg-gradient-to-r from-[#00E5FF] via-[#00C4B4] to-[#38BDF8] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(0,196,180,0.4)]">
                Enterprise AI &amp; Scale
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-normal"
            >
              Strategic, unscripted reflections from Ravishankar Pingali on how
              global capability centres and enterprise leaders navigate the
              shift from volume to influence.
            </motion.p>
          </header>
        </div>
      </section>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-8">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-2 border-[#00C4B4] border-t-transparent rounded-full animate-spin mb-4" />
            <span className="text-xs text-slate-400 tracking-wider uppercase">
              Loading podcast library...
            </span>
          </div>
        ) : (
          <div className="space-y-12 sm:space-y-16">
            {activeEpisode && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative rounded-3xl p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-[#07162e] via-[#051124] to-[#020712] border border-[#00C4B4]/30 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_30px_rgba(0,196,180,0.12)] overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00C4B4]/15 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 flex flex-col items-center sm:flex-row lg:flex-col gap-6">
                    <div className="relative group cursor-pointer w-full max-w-[640px] aspect-video  lg:aspect-[4/3] rounded overflow-hidden border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
                      <img
                        src={encodeURI(activeEpisode.thumbnail)}
                        alt={activeEpisode.title}
                        onError={(e) => {
                          e.currentTarget.src =
                            "/assets/podcastThumbnails/Capacity%20vs%20Capability.min.webp";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div
                        onClick={() => openPlayer(activeEpisode)}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#00C4B4] to-[#2563EB] flex items-center justify-center text-white shadow-[0_0_30px_rgba(0,196,180,0.6)] group-hover:scale-110 transition-transform duration-300">
                          <Play size={28} className="fill-white ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-['Playfair_Display',serif] text-white leading-tight mb-4">
                        {activeEpisode.title}
                      </h2>

                      <div className="space-y-3 mb-6">
                        {activeEpisode.description
                          .slice(0, 4)
                          .map((line, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed"
                            >
                              <span className="text-[#00C4B4] mt-1 shrink-0 font-bold">
                                •
                              </span>
                              <span>{line.replace(/^✅\s*/, "")}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00C4B4] to-[#2563EB] flex items-center justify-center font-bold text-white text-xs shadow-[0_0_12px_rgba(0,196,180,0.3)]">
                          RP
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">
                            Ravishankar Pingali
                          </div>
                          <div className="text-[11px] text-slate-400">
                            GCC Leader &amp; Board Advisor
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => openPlayer(activeEpisode)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00C4B4] via-[#009A9A] to-[#2563EB] text-white font-semibold text-xs sm:text-sm shadow-[0_0_20px_rgba(0,196,180,0.4)] hover:shadow-[0_0_30px_rgba(0,196,180,0.6)] hover:scale-[1.02] transition-all"
                      >
                        <Play size={14} className="fill-white" />
                        <span>Play Full Episode</span>
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00C4B4] shadow-[0_0_8px_#00C4B4]" />
                  <h3 className="text-xl sm:text-2xl font-bold font-['Playfair_Display',serif] text-white">
                    All Studio Episodes ({podcasts.length})
                  </h3>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Full Series Archive
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {podcasts.map((podcast, index) => {
                  const isSelected = activeEpisode?.id === podcast.id;
                  return (
                    <motion.article
                      key={podcast.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                      className={`group rounded-2xl bg-[#061226]/85 border transition-all duration-300 flex flex-col h-full overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.35)] ${
                        isSelected
                          ? "border-[#00C4B4]/60 shadow-[0_0_24px_rgba(0,196,180,0.25)]"
                          : "border-white/[0.09] hover:border-[#00C4B4]/50 hover:shadow-[0_16px_40px_rgba(0,196,180,0.15)]"
                      }`}
                    >
                      <div className="relative aspect-video overflow-hidden shrink-0">
                        <img
                          src={encodeURI(podcast.thumbnail)}
                          alt={podcast.title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/assets/podcastThumbnails/Capacity%20vs%20Capability.min.webp";
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#061226] via-black/30 to-transparent" />

                        <button
                          type="button"
                          onClick={() => openPlayer(podcast)}
                          className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity"
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00C4B4] to-[#2563EB] flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,196,180,0.5)] group-hover:scale-110 transition-transform">
                            <Play size={20} className="fill-white ml-0.5" />
                          </div>
                        </button>
                      </div>

                      <div className="p-5 sm:p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                          <Headphones size={13} className="text-[#00C4B4]" />
                          <span className="font-mono">
                            Executive Audio Dialogue
                          </span>
                        </div>

                        <h4 className="text-lg sm:text-xl font-bold font-['Playfair_Display',serif] text-white leading-snug mb-3 group-hover:text-[#00C4B4] transition-colors line-clamp-2">
                          {podcast.title}
                        </h4>

                        <div className="space-y-2 mb-6 flex-1">
                          {podcast.description.slice(0, 2).map((item, i) => (
                            <p
                              key={i}
                              className="text-xs text-slate-300 line-clamp-2 leading-relaxed"
                            >
                              {item.replace(/^✅\s*/, "")}
                            </p>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between gap-3 mt-auto">
                          <button
                            type="button"
                            onClick={() => setActiveEpisode(podcast)}
                            className="text-xs text-slate-400 hover:text-white transition-colors"
                          >
                            Set as Focus
                          </button>

                          <button
                            type="button"
                            onClick={() => openPlayer(podcast)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00C4B4]/15 hover:bg-[#00C4B4] text-[#00C4B4] hover:text-black font-semibold text-xs tracking-wide transition-all"
                          >
                            <span>Listen</span>
                            <ArrowUpRight size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {playingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) setPlayingModal(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#07162e] border border-[#00C4B4]/30 rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.8)]"
            >
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/[0.08] bg-[#051124]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00C4B4]/20 flex items-center justify-center text-[#00C4B4]">
                    <Mic size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[#00C4B4] font-bold">
                      {playingModal.episode}
                    </div>
                    <div className="text-sm font-bold text-white truncate max-w-sm sm:max-w-md">
                      {playingModal.title}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPlayingModal(null)}
                  className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-slate-300 hover:text-white flex items-center justify-center transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner">
                  <iframe
                    src={playingModal.src}
                    title={playingModal.title}
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-400">
                  <span>Host: Ravishankar Pingali</span>
                  <a
                    href={playingModal.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#00C4B4] hover:underline"
                  >
                    <span>Open in LinkedIn</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
