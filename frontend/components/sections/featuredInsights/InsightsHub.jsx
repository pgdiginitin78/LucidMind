"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Headphones,
  Layers,
  Mic,
  Play,
  Sparkles,
  Video,
  X,
} from "lucide-react";
import Image from "@/common/Image";
import { Link } from "@/lib/navigation";
import { useEffect, useMemo, useState } from "react";
import { cn, resolveImageUrl, getEmbedUrl } from "@/lib/utils";
import ArticleDetail from "./ArticleDetail";
import InsightsAllBannerImage from "./images/InsightsAllBannerImage.webp";
import InsightsAllMobileBanner from "./images/InsightsAllMobileBanner.webp";
import { API_BASE_URL } from "@/src/config/api";

export default function InsightsHub() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const [podcasts, setPodcasts] = useState([]);
  const [podcastLoading, setPodcastLoading] = useState(true);
  const [activePodcast, setActivePodcast] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [playingPodcastModal, setPlayingPodcastModal] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");

  const scrollToSection = (targetId) => {
    if (typeof window === "undefined") return;
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (!el) return;
      if (window.__lenis) {
        window.__lenis.scrollTo(el, {
          offset: -90,
          duration: 1.2,
        });
      } else {
        const yOffset = -90;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      }
    }, 80);
  };

  const handleTabSelect = (tab, targetId) => {
    setActiveTab(tab);
    if (targetId) {
      scrollToSection(targetId);
    }
  };

  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash.substring(1);
        if (hash === "blogs") handleTabSelect("BLOGS", "blogs");
        else if (hash === "videos") handleTabSelect("VIDEOS", "videos");
        else if (hash === "podcasts") handleTabSelect("PODCASTS", "podcasts");
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE_URL}/blogs`)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        if (isMounted && data?.blogs && Array.isArray(data.blogs)) {
          const activeBlogs = data.blogs.filter(
            (b) => b.isActive !== false && b.isPublished !== false,
          );
          const normalized = activeBlogs.map((b, idx) => ({
            id: b._id || b.id || idx + 1,
            title: b.title || "",
            tag: (b.tag || b.category || "INSIGHTS").toUpperCase(),
            readTime: b.readTime || "3 MIN READ",
            date: b.date || "",
            author: b.author || "Ravishankar Pingali",
            authorRole:
              b.authorRole ||
              "Building Adaptive Enterprises | GCC Leader | Board Advisor",
            description: b.excerpt || b.description || "",
            image: encodeURI(
              resolveImageUrl(
                b.image ||
                  b.coverImage ||
                  "/assets/articles/The Mindset Shift.webp",
              ),
            ),
            content: b.rawContent || b.content || [],
          }));
          setArticles(normalized);
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

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE_URL}/podcasts?_t=${Date.now()}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        if (isMounted && data?.podcasts && Array.isArray(data.podcasts)) {
          const activeList = data.podcasts.filter(
            (p) => p.isActive !== false && p.isPublished !== false,
          );
          const normalized = activeList.map((p, idx) => {
            const isVid =
              (p.mediaType || p.type || "").toLowerCase() === "video" ||
              (Array.isArray(p.tags) &&
                p.tags.some((t) => String(t).toLowerCase() === "video")) ||
              /^v\d+/i.test(String(p.episode || "").trim()) ||
              String(p.episode || "")
                .toLowerCase()
                .startsWith("video");

            return {
              id: p._id || p.id || idx + 1,
              title: p.title || "",
              episode: p.episode || `Ep. 0${idx + 1}`,
              src: p.src || p.audioUrl || "",
              mediaType: isVid ? "video" : "podcast",
              tags: Array.isArray(p.tags) ? p.tags : [],
              thumbnail: resolveImageUrl(
                p.thumbnail ||
                  p.coverImage ||
                  p.image ||
                  "/assets/podcastThumbnails/Capacity vs Capability.webp",
              ),
              duration: p.duration || "18 mins",
              host: p.host || "Ravishankar Pingali",
              guest: p.guest || "GCC Leaders",
              description: Array.isArray(p.description)
                ? p.description
                : p.description
                  ? p.description.split("\n\n")
                  : [],
            };
          });
          setPodcasts(normalized);
          const firstVid = normalized.find((p) => p.mediaType === "video");
          const firstPod = normalized.find((p) => p.mediaType !== "video");
          if (firstVid) setActiveVideo(firstVid);
          if (firstPod) setActivePodcast(firstPod);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setPodcastLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const videoList = useMemo(
    () =>
      podcasts.filter(
        (p) => (p.mediaType || p.type || "").toLowerCase() === "video",
      ),
    [podcasts],
  );

  const podcastList = useMemo(
    () =>
      podcasts.filter(
        (p) => (p.mediaType || p.type || "podcast").toLowerCase() !== "video",
      ),
    [podcasts],
  );

  const currentActiveVideo = useMemo(() => {
    if (activeVideo && videoList.some((v) => v.id === activeVideo.id)) {
      return activeVideo;
    }
    return videoList[0] || null;
  }, [activeVideo, videoList]);

  const currentActivePodcast = useMemo(() => {
    if (activePodcast && podcastList.some((p) => p.id === activePodcast.id)) {
      return activePodcast;
    }
    return podcastList[0] || null;
  }, [activePodcast, podcastList]);

  const openPodcastPlayer = (episode) => {
    if (episode?.src) {
      setPlayingPodcastModal(episode);
    }
  };

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "ALL" || article.tag === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.description.toLowerCase().includes(q) ||
        article.tag.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const featuredArticle =
    selectedCategory === "ALL" && !searchQuery.trim() && articles.length > 0
      ? articles[0]
      : null;

  const listArticles = featuredArticle
    ? filteredArticles.filter((a) => a.id !== featuredArticle.id)
    : filteredArticles;

  return (
    <div className="relative w-full min-h-screen bg-[#040914] text-slate-100 font-['PlusJakartaSans',sans-serif] selection:bg-[#00C4B4]/30 selection:text-white pb-24 sm:pb-32 overflow-hidden">
      <section className="relative w-full overflow-hidden flex items-end md:items-center pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16 lg:pb-20 mb-8 sm:mb-12 min-h-[560px] sm:min-h-[620px] lg:min-h-[680px] xl:min-h-[720px]">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src={InsightsAllBannerImage}
            alt="Insights on Scaling Enterprise AI & Adaptive Leadership"
            fill
            priority
            sizes="100vw"
            className="hidden md:block object-cover object-right"
          />
          <Image
            src={InsightsAllMobileBanner}
            alt="Insights on Scaling Enterprise AI & Adaptive Leadership"
            fill
            priority
            sizes="100vw"
            className="block md:hidden object-cover object-center"
          />

          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#040914] from-15% via-[#040914]/90 via-38% md:via-[#040914]/70 md:via-48% to-transparent" />
          <div className="hidden md:block absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-gradient-to-t from-[#040914] to-transparent" />

          <div className="block md:hidden absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#040914]/70 to-transparent" />
          <div className="block md:hidden absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#040914] via-[#040914]/90 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16">
          <header className="relative max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
            <div className="absolute -inset-4 sm:-inset-6 -z-10 rounded-3xl bg-[#040914]/30 md:bg-gradient-to-r md:from-[#040914]/70 md:via-[#040914]/40 md:to-transparent backdrop-blur-[1px] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-4 justify-start"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#00C4B4] shadow-[0_0_10px_#00C4B4]" />
              <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-[#00C4B4] to-transparent" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading-h1 text-white tracking-tight mb-2"
            >
              Insights on Scaling{" "}  <br className="hidden sm:block" />
              <span
                className="text-[#00C4B4]"
                style={{ textShadow: "0 0 40px rgba(0,196,180,0.5)" }}
              >
                Enterprise AI
              </span>{" "}
             
              <span className="font-sans">&amp;</span> Adaptive<br/> Leadership
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="body-text text-slate-200 mt-4 max-w-xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
            >
              Explore executive essays, strategic frameworks, and in-depth video
              dialogues designed for leaders reinventing operating models.
            </motion.p>
          </header>
        </div>
      </section>

      <div
        id="insights-content"
        className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 space-y-16 sm:space-y-20"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-[#08152b]/80 border border-white/[0.1] backdrop-blur-xl">
            <button
              type="button"
              onClick={() => handleTabSelect("ALL", "insights-content")}
              className={cn(
                "px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer",
                activeTab === "ALL"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#00C4FF] text-white shadow-[0_0_16px_rgba(0,196,255,0.35)]"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.05]",
              )}
            >
              All Content
            </button>
            <button
              type="button"
              onClick={() => handleTabSelect("BLOGS", "blogs")}
              className={cn(
                "flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer",
                activeTab === "BLOGS"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#00C4FF] text-white shadow-[0_0_16px_rgba(0,196,255,0.35)]"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.05]",
              )}
            >
              <BookOpen size={13} />
              <span>Blogs ({articles.length})</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabSelect("VIDEOS", "videos")}
              className={cn(
                "flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer",
                activeTab === "VIDEOS"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#00C4FF] text-white shadow-[0_0_16px_rgba(0,196,255,0.35)]"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.05]",
              )}
            >
              <Video size={13} />
              <span>Videos ({videoList.length})</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabSelect("PODCASTS", "podcasts")}
              className={cn(
                "flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer",
                activeTab === "PODCASTS"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#00C4FF] text-white shadow-[0_0_16px_rgba(0,196,255,0.35)]"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.05]",
              )}
            >
              <Mic size={13} />
              <span>Podcasts ({podcastList.length})</span>
            </button>
          </div>
        </div>

        {(activeTab === "ALL" || activeTab === "BLOGS") && (
          <section id="blogs" className="scroll-mt-28 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/[0.06]">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/30 text-[#00C4FF] text-xs font-semibold mb-2">
                  <BookOpen size={13} />
                  <span>Executive Essays <span className="font-sans">&amp;</span> Frameworks</span>
                </div>
                <h2 className="heading-h2 text-white">
                  Thought Leadership <span className="font-sans">&amp;</span> Blogs
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-2">
                  Reflections on modern engineering, talent ecosystems, and
                  shifting from legacy execution to continuous making.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-14 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-2 border-[#00C4B4] border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-xs text-slate-400 tracking-wider uppercase">
                  Loading executive publications...
                </span>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-[#08152b]/50 border border-white/[0.08] p-8 max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-400 mx-auto mb-3">
                  <Layers size={22} />
                </div>
                <h3 className="heading-h3 text-white mb-2">
                  No matching insights
                </h3>
                <p className="text-xs text-slate-400 mb-5">
                  No publications matched your current filter criteria.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("ALL");
                  }}
                  className="px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-white border border-white/15 transition-all"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-10 sm:space-y-12">
                {featuredArticle && (
                  <motion.article
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    onClick={() => setSelectedArticle(featuredArticle)}
                    className="group cursor-pointer rounded-3xl bg-[#08152b]/90 border border-white/[0.12] hover:border-[#00C4B4]/60 overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_60px_rgba(0,196,180,0.18)] transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 items-stretch"
                  >
                    <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden">
                      <img
                        src={featuredArticle.image}
                        alt={featuredArticle.title}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/assets/articles/The%20Mindset%20Shift.webp";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#08152b] via-transparent to-transparent lg:hidden" />
                    </div>

                    <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap justify-end gap-3 text-xs text-slate-400 mb-4">
                          {featuredArticle.date && (
                            <span>{featuredArticle.date}</span>
                          )}
                        </div>

                        <h4 className="heading-h4 text-white mb-4 group-hover:text-[#00C4B4] transition-colors">
                          {featuredArticle.title}
                        </h4>

                        <p className="body-text text-slate-300 text-sm line-clamp-4 mb-6">
                          {featuredArticle.description}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-white/[0.08] gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00C4B4] to-[#2563EB] flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-[0_0_12px_rgba(0,196,180,0.3)]">
                            RP
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs 2xl:text-sm font-bold text-white truncate">
                              {featuredArticle.author}
                            </div>
                            <div className="text-[11px] 2xl:text-sm text-slate-400 truncate">
                              {featuredArticle.authorRole}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <div className="inline-flex items-center gap-1.5 px-4 mt-2 2xl:mt-4 py-2 rounded-full bg-[#00C4B4]/15 group-hover:bg-[#00C4B4] text-[#00C4B4] group-hover:text-black font-semibold text-xs tracking-wide transition-all shrink-0">
                            <span>Read Essay</span>
                            <ArrowUpRight
                              size={14}
                              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {listArticles.map((article, index) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                      onClick={() => setSelectedArticle(article)}
                      className="group cursor-pointer rounded-2xl bg-[#08152b]/85 border border-white/[0.09] hover:border-[#00C4B4]/50 overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_48px_rgba(0,196,180,0.16)] transition-all duration-300 flex flex-col h-full"
                    >
                      <div className="relative h-52 sm:h-56 overflow-hidden shrink-0">
                        <img
                          src={article.image}
                          alt={article.title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/assets/articles/The%20Mindset%20Shift.webp";
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#08152b] via-black/30 to-transparent" />
                      </div>

                      <div className="p-5 sm:p-6 flex flex-col flex-1">
                        <div className="flex justify-end gap-3 text-xs 2xl:text-sm text-slate-400 mb-2.5">
                          {article.date && <span>{article.date}</span>}
                        </div>

                        <h5 className="heading-h5 text-white mb-3 group-hover:text-[#00C4B4] transition-colors line-clamp-2">
                          {article.title}
                        </h5>

                        <p className="body-text-lg text-slate-300 text-xs sm:text-sm line-clamp-3 mb-6 flex-1">
                          {article.description}
                        </p>

                        <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between gap-3 mt-auto">
                          <span className="text-[11px] 2xl:text-sm text-slate-400 truncate">
                            {article.author}
                          </span>

                          <span className="inline-flex items-center gap-1 text-xs 2xl:text-sm font-semibold text-[#00C4B4] group-hover:text-white transition-colors">
                            <span>Read Full Article</span>
                            <ArrowUpRight
                              size={13}
                              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                            />
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {(activeTab === "ALL" || activeTab === "VIDEOS") && (
          <section id="videos" className="scroll-mt-28 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/[0.06]">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C4FF]/15 border border-[#00C4FF]/30 text-[#00C4FF] text-xs font-semibold mb-2">
                  <Video size={13} />
                  <span>Executive Videos</span>
                </div>
                <h2 className="heading-h2 text-white">
                  Video Discussions <span className="font-sans">&amp;</span> Masterclasses
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-2">
                  Watch executive video discussions and dialogues on enterprise
                  scale, GCC evolution, and generative AI.
                </p>
              </div>
            </div>

            {podcastLoading ? (
              <div className="py-14 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-2 border-[#00C4FF] border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-xs text-slate-400 tracking-wider uppercase">
                  Loading video discussions...
                </span>
              </div>
            ) : videoList.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-[#08152b]/50 border border-white/[0.08] p-8 max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-400 mx-auto mb-3">
                  <Video size={22} />
                </div>
                <h3 className="heading-h3 text-white mb-2">
                  No videos available
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Video discussions are currently being prepared for broadcast.
                </p>
              </div>
            ) : (
              <div className="space-y-10 sm:space-y-12">
                {currentActiveVideo && (
                  <motion.div
                    key={currentActiveVideo.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-3xl bg-[#08152b]/95 border border-[#00C4FF]/25 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-6 sm:p-8 lg:p-10"
                  >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00C4FF]/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      <div className="lg:col-span-5 flex flex-col items-center">
                        <div
                          onClick={() => openPodcastPlayer(currentActiveVideo)}
                          className="relative group cursor-pointer w-full aspect-video rounded-2xl overflow-hidden border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.6)] bg-black"
                        >
                          <img
                            src={encodeURI(currentActiveVideo.thumbnail)}
                            alt={currentActiveVideo.title}
                            onError={(e) => {
                              e.currentTarget.src =
                                "/assets/podcastThumbnails/Capacity%20vs%20Capability.webp";
                            }}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                          />

                          <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition-colors">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#2563EB] to-[#00C4FF] flex items-center justify-center text-white shadow-[0_0_30px_rgba(0,196,255,0.6)] group-hover:scale-115 transition-transform duration-300">
                              <Play size={24} className="fill-white ml-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="lg:col-span-7 flex flex-col justify-between">
                        <div>
                          <h4 className="heading-h4 text-white mb-4">
                            {currentActiveVideo.title}
                          </h4>

                          <div className="space-y-2.5 mb-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {currentActiveVideo.description
                              .slice(0, 4)
                              .map((line, idx) => (
                                <p
                                  key={idx}
                                  className={
                                    line.startsWith("✅")
                                      ? "text-[#00C4FF] font-medium"
                                      : "line-clamp-2"
                                  }
                                >
                                  {line}
                                </p>
                              ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00C4FF] to-[#2563EB] flex items-center justify-center font-bold text-white text-xs shadow-[0_0_12px_rgba(0,196,255,0.3)]">
                              RP
                            </div>
                            <div>
                              <div className="text-xs sm:text-sm font-bold text-white">
                                {currentActiveVideo.host}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                Board Advisor <span className="font-sans">&amp;</span> GCC Leader
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                openPodcastPlayer(currentActiveVideo)
                              }
                              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#00C4FF] text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(0,196,255,0.4)] hover:brightness-110 transition-all cursor-pointer"
                            >
                              <Play size={14} className="fill-white" />
                              <span>Watch Video</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {videoList
                    .filter((video) => video.id !== currentActiveVideo?.id)
                    .map((video, index) => {
                      const isSelected = currentActiveVideo?.id === video.id;
                      return (
                        <motion.article
                          key={video.id}
                          initial={{ opacity: 0, y: 24 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.1 }}
                          transition={{
                            duration: 0.5,
                            delay: (index % 3) * 0.08,
                          }}
                          className={cn(
                            "group rounded-2xl bg-[#08152b]/85 border overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.35)] transition-all duration-300 flex flex-col h-full",
                            isSelected
                              ? "border-[#00C4FF] shadow-[0_0_24px_rgba(0,196,255,0.2)]"
                              : "border-white/[0.09] hover:border-[#00C4FF]/50 hover:shadow-[0_16px_48px_rgba(0,196,255,0.15)]",
                          )}
                        >
                          <div className="relative aspect-video overflow-hidden bg-black shrink-0">
                            <img
                              src={encodeURI(video.thumbnail)}
                              alt={video.title}
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/assets/podcastThumbnails/Capacity%20vs%20Capability.webp";
                              }}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#08152b] via-black/20 to-transparent" />

                            <button
                              type="button"
                              onClick={() => openPodcastPlayer(video)}
                              className="absolute inset-0 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity"
                              aria-label={`Play ${video.title}`}
                            >
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#2563EB] to-[#00C4FF] flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,196,255,0.5)] group-hover:scale-110 transition-transform">
                                <Play size={18} className="fill-white ml-0.5" />
                              </div>
                            </button>
                          </div>

                          <div className="p-5 sm:p-6 flex flex-col flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/[0.06] text-[#00C4FF] border border-white/10">
                                <Video size={10} />
                                <span>Video</span>
                              </span>
                            </div>

                            <h5 className="heading-h5 text-white mb-3 group-hover:text-[#00C4FF] transition-colors line-clamp-2">
                              {video.title}
                            </h5>

                            <div className="space-y-1.5 mb-6 flex-1">
                              {video.description.slice(0, 2).map((item, i) => (
                                <p
                                  key={i}
                                  className="text-xs text-slate-300 line-clamp-2 leading-relaxed"
                                >
                                  {item.replace(/^✅\s*/, "")}
                                </p>
                              ))}
                            </div>

                            <div className="pt-4 border-t border-white/[0.07] flex items-center justify-end gap-3 mt-auto">
                              {/* <button
                                type="button"
                                onClick={() => {
                                  setActiveVideo(video);
                                  scrollToSection("videos");
                                }}
                                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                              >
                                Set as Focus
                              </button> */}

                              <button
                                type="button"
                                onClick={() => openPodcastPlayer(video)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00C4FF]/15 hover:bg-[#00C4FF] text-[#00C4FF] hover:text-black font-semibold text-xs tracking-wide transition-all cursor-pointer"
                              >
                                <span>Watch Video</span>
                                <ArrowUpRight size={13} />
                              </button>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                </div>
              </div>
            )}
          </section>
        )}

        {(activeTab === "ALL" || activeTab === "PODCASTS") && (
          <section id="podcasts" className="scroll-mt-28 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/[0.06]">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C4FF]/15 border border-[#00C4FF]/30 text-[#00C4FF] text-xs font-semibold mb-2">
                  <Mic size={13} />
                  <span>Executive Podcasts</span>
                </div>
                <h2 className="heading-h2 text-white">
                  Podcasts <span className="font-sans">&amp;</span> Audio Broadcasts
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-2">
                  Listen to in-depth discussions unpacking capacity vs.
                  capability and modern engineering leadership.
                </p>
              </div>
            </div>

            {podcastLoading ? (
              <div className="py-14 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-2 border-[#00C4FF] border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-xs text-slate-400 tracking-wider uppercase">
                  Loading podcast episodes...
                </span>
              </div>
            ) : podcastList.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-[#08152b]/50 border border-white/[0.08] p-8 max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-400 mx-auto mb-3">
                  <Headphones size={22} />
                </div>
                <h3 className="heading-h3 text-white mb-2">
                  No podcast episodes available
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Podcast episodes are currently being prepared for broadcast.
                </p>
              </div>
            ) : (
              <div className="space-y-10 sm:space-y-12">
                {currentActivePodcast && (
                  <motion.div
                    key={currentActivePodcast.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-3xl bg-[#08152b]/95 border border-[#00C4FF]/25 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-6 sm:p-8 lg:p-10"
                  >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00C4FF]/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      <div className="lg:col-span-5 flex flex-col items-center">
                        <div
                          onClick={() =>
                            openPodcastPlayer(currentActivePodcast)
                          }
                          className="relative group cursor-pointer w-full aspect-video rounded-2xl overflow-hidden border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.6)] bg-black"
                        >
                          <img
                            src={encodeURI(currentActivePodcast.thumbnail)}
                            alt={currentActivePodcast.title}
                            onError={(e) => {
                              e.currentTarget.src =
                                "/assets/podcastThumbnails/Capacity%20vs%20Capability.webp";
                            }}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                          />

                          <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition-colors">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#2563EB] to-[#00C4FF] flex items-center justify-center text-white shadow-[0_0_30px_rgba(0,196,255,0.6)] group-hover:scale-115 transition-transform duration-300">
                              <Play size={24} className="fill-white ml-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="lg:col-span-7 flex flex-col justify-between">
                        <div>
                          <h4 className="heading-h4 text-white mb-4">
                            {currentActivePodcast.title}
                          </h4>

                          <div className="space-y-2.5 mb-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {currentActivePodcast.description
                              .slice(0, 4)
                              .map((line, idx) => (
                                <p
                                  key={idx}
                                  className={
                                    line.startsWith("✅")
                                      ? "text-[#00C4FF] font-medium"
                                      : "line-clamp-2"
                                  }
                                >
                                  {line}
                                </p>
                              ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00C4FF] to-[#2563EB] flex items-center justify-center font-bold text-white text-xs shadow-[0_0_12px_rgba(0,196,255,0.3)]">
                              RP
                            </div>
                            <div>
                              <div className="text-xs sm:text-sm font-bold text-white">
                                {currentActivePodcast.host}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                Board Advisor <span className="font-sans">&amp;</span> GCC Leader
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                openPodcastPlayer(currentActivePodcast)
                              }
                              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#00C4FF] text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(0,196,255,0.4)] hover:brightness-110 transition-all cursor-pointer"
                            >
                              <Play size={14} className="fill-white" />
                              <span>Watch Episode Video</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {podcastList
                    .filter(
                      (podcast) => podcast.id !== currentActivePodcast?.id,
                    )
                    .map((podcast, index) => {
                      const isSelected =
                        currentActivePodcast?.id === podcast.id;
                      return (
                        <motion.article
                          key={podcast.id}
                          initial={{ opacity: 0, y: 24 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.1 }}
                          transition={{
                            duration: 0.5,
                            delay: (index % 3) * 0.08,
                          }}
                          className={cn(
                            "group rounded-2xl bg-[#08152b]/85 border overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.35)] transition-all duration-300 flex flex-col h-full",
                            isSelected
                              ? "border-[#00C4FF] shadow-[0_0_24px_rgba(0,196,255,0.2)]"
                              : "border-white/[0.09] hover:border-[#00C4FF]/50 hover:shadow-[0_16px_48px_rgba(0,196,255,0.15)]",
                          )}
                        >
                          <div className="relative aspect-video overflow-hidden bg-black shrink-0">
                            <img
                              src={encodeURI(podcast.thumbnail)}
                              alt={podcast.title}
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/assets/podcastThumbnails/Capacity%20vs%20Capability.webp";
                              }}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#08152b] via-black/20 to-transparent" />

                            <button
                              type="button"
                              onClick={() => openPodcastPlayer(podcast)}
                              className="absolute inset-0 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity"
                              aria-label={`Play ${podcast.title}`}
                            >
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#2563EB] to-[#00C4FF] flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,196,255,0.5)] group-hover:scale-110 transition-transform">
                                <Play size={18} className="fill-white ml-0.5" />
                              </div>
                            </button>
                          </div>

                          <div className="p-5 sm:p-6 flex flex-col flex-1">
                            <h5 className="heading-h5 text-white mb-3 group-hover:text-[#00C4FF] transition-colors line-clamp-2">
                              {podcast.title}
                            </h5>

                            <div className="space-y-1.5 mb-6 flex-1">
                              {podcast.description
                                .slice(0, 2)
                                .map((item, i) => (
                                  <p
                                    key={i}
                                    className="text-xs text-slate-300 line-clamp-2 leading-relaxed"
                                  >
                                    {item.replace(/^✅\s*/, "")}
                                  </p>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-white/[0.07] flex items-center justify-end gap-3 mt-auto">
                              {/* <button
                                type="button"
                                onClick={() => {
                                  setActivePodcast(podcast);
                                  scrollToSection("podcasts");
                                }}
                                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                              >
                                Set as Focus
                              </button> */}

                              <button
                                type="button"
                                onClick={() => openPodcastPlayer(podcast)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00C4FF]/15 hover:bg-[#00C4FF] text-[#00C4FF] hover:text-black font-semibold text-xs tracking-wide transition-all cursor-pointer"
                              >
                                <span>Listen / Watch</span>
                                <ArrowUpRight size={13} />
                              </button>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <AnimatePresence>
        {selectedArticle && (
          <ArticleDetail
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {playingPodcastModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) setPlayingPodcastModal(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl bg-[#07162e] border border-[#00C4FF]/40 rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
            >
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/[0.08] bg-[#051124]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#00C4FF]/20 border border-[#00C4FF]/30 flex items-center justify-center text-[#00C4FF] shrink-0">
                    {playingPodcastModal.mediaType === "video" ? (
                      <Video size={18} />
                    ) : (
                      <Mic size={18} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-[#00C4FF] font-bold">
                      {playingPodcastModal.episode}
                    </div>
                    <div className="text-sm font-bold text-white truncate max-w-sm sm:max-w-md">
                      {playingPodcastModal.title}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPlayingPodcastModal(null)}
                  className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner">
                  <iframe
                    src={getEmbedUrl(playingPodcastModal.src)}
                    title={playingPodcastModal.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                  <span>Host: {playingPodcastModal.host}</span>
                  {playingPodcastModal.src && (
                    <a
                      href={playingPodcastModal.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#00C4FF] hover:underline"
                    >
                      <span>Open in Source</span>
                      <ArrowUpRight size={13} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
