"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Search, ArrowUpRight, Sparkles, BookOpen, Layers } from "lucide-react";
import ArticleDetail from "./ArticleDetail";

export default function InsightsHub() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/blogs")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        if (isMounted && data?.blogs && Array.isArray(data.blogs)) {
          const activeBlogs = data.blogs.filter(
            (b) => b.isActive !== false && b.isPublished !== false
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
            image: encodeURI(b.image || b.coverImage || "/assets/articles/The Mindset Shift.webp"),
            content: b.rawContent || b.content || [],
          }));
          setArticles(normalized);
        }
      })
      .catch(() => { })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

 

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
    <div className="relative w-full min-h-screen bg-[#040914] text-slate-100 font-['PlusJakartaSans',sans-serif] selection:bg-[#00C4B4]/30 selection:text-white pt-28 sm:pt-36 pb-20 sm:pb-28 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0, 196, 180, 0.16) 0%, rgba(37, 99, 235, 0.12) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/3 -left-32 w-96 h-96 pointer-events-none rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 196, 180, 0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-2/3 -right-32 w-96 h-96 pointer-events-none rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16">
        <header className="max-w-7xl mb-12 sm:mb-16">
   

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-['Playfair_Display',serif] tracking-tight text-white leading-[1.1] mb-5"
          >
            Insights on Scaling{" "}
            <span className="bg-gradient-to-r from-[#00C4B4] via-[#38bdf8] to-[#2563EB] bg-clip-text text-transparent">
              Enterprise AI
            </span>{" "}
            &amp; Adaptive Leadership
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-7xl font-normal"
          >
            Explore all executive essays, frameworks, and strategic reflections
            for technology and GCC leaders navigating operating model
            reinvention.
          </motion.p>
        </header>

        {loading ? (
          <div className="py-14 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-2 border-[#00C4B4] border-t-transparent rounded-full animate-spin mb-4" />
            <span className="text-xs text-slate-400 tracking-wider uppercase">
              Loading executive publications...
            </span>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-[#08152b]/50 border border-white/[0.08] p-8 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <Layers size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No matching insights</h3>
            <p className="text-xs text-slate-400 mb-5">
              No publications matched your current filter or search criteria.
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
                      e.currentTarget.src = "/assets/articles/The%20Mindset%20Shift.webp";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08152b] via-transparent to-transparent lg:hidden" />

                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap justify-end gap-3 text-xs text-slate-400 mb-4">

                      {featuredArticle.date && <span>{featuredArticle.date}</span>}

                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold font-['Playfair_Display',serif] text-white leading-tight mb-4 group-hover:text-[#00C4B4] transition-colors">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-4 mb-6">
                      {featuredArticle.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00C4B4] to-[#2563EB] flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-[0_0_12px_rgba(0,196,180,0.3)]">
                        RP
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs 2xl:text-sm font-bold text-white truncate">
                          {featuredArticle.author}
                        </div>
                        <div className="text-[11px]  2xl:text-sm text-slate-400 truncate">
                          {featuredArticle.authorRole}
                        </div>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#00C4B4]/15 group-hover:bg-[#00C4B4] text-[#00C4B4] group-hover:text-black font-semibold text-xs tracking-wide transition-all shrink-0">
                      <span>Read Essay</span>
                      <ArrowUpRight
                        size={14}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      />
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
                        e.currentTarget.src = "/assets/articles/The%20Mindset%20Shift.webp";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08152b] via-black/30 to-transparent" />

                  </div>

                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <div className="flex justify-end gap-3 text-xs 2xl:text-sm text-slate-400 mb-2.5">
                      {article.date && <span>{article.date}</span>}
                    </div>

                    <h3 className="text-lg sm:text-xl 2xl:text-2xl font-bold font-['Playfair_Display',serif] text-white leading-snug mb-3 group-hover:text-[#00C4B4] transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-slate-300 text-xs sm:text-sm 2xl:text-lg leading-relaxed line-clamp-3 mb-6 flex-1">
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
      </div>

      <AnimatePresence>
        {selectedArticle && (
          <ArticleDetail
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
