"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname, Link } from "@/lib/navigation";
import Heading from "../../ui/Heading";
import ArticleDetail from "./ArticleDetail";
import WebGLParticleCanvas from "./WebGLParticleCanvas";
import { API_BASE_URL } from "@/src/config/api";
import { DEFAULT_ARTICLE_IMAGE, resolveSafeImageUrl } from "@/lib/utils";
const articlesSectionBgWebP = "/assets/articles_section_bg.webp";

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

export default function Articles() {
  const sectionRef = useRef(null);
  const [articlesList, setArticlesList] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE_URL}/blogs`)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        if (isMounted && data?.blogs && data.blogs.length > 0) {
          const activeBlogs = data.blogs.filter(
            (b) => b.isActive !== false && b.isPublished !== false,
          );
          const normalized = activeBlogs.map((b, idx) => ({
            id: b._id || b.id || idx + 1,
            title: b.title || "",
            tag: b.tag || b.category || "INSIGHTS",
            readTime: b.readTime || "3 MIN READ",
            date: b.date || "",
            author: b.author || "Ravishankar Pingali",
            authorRole: b.authorRole || "",
            description: b.excerpt || b.description || "",
            image: resolveSafeImageUrl(
              b.image || b.coverImage || b.cover_image,
              DEFAULT_ARTICLE_IMAGE,
            ),
            content: b.rawContent || b.content || [],
          }));
          setArticlesList(normalized);
        }
      })
      .catch((err) => {
        console.warn("[Articles] Network error:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const displayedArticles =
    articlesList.length > 0 ? articlesList.slice(0, 4) : null;

  return (
    <>
      <section
        ref={sectionRef}
        className={`w-full ${pathname === "/articles" || pathname === "/insights" ? "pt-24 sm:pt-32 lg:pt-36 pb-10 sm:pb-14 lg:pb-16" : "py-10 sm:py-14 md:py-16 lg:py-14 xl:py-16"} relative overflow-hidden font-inter`}
      >
        <img
          src={articlesSectionBgWebP}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          width={1400}
          height={900}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-1 opacity-75"
        />

        <div className="absolute inset-0 w-full h-full pointer-events-none z-1 bg-linear-to-br from-white/45 via-white/15 to-transparent" />

        <WebGLParticleCanvas variant="articles" />

        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 relative z-[2]">
          <div className="flex flex-col gap-5 sm:gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 md:gap-8 w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 min-w-0 pt-1 sm:pt-2"
              >
                <p className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.18em] uppercase text-brand-blue mb-1.5 sm:mb-2">
                  INSIGHTS &amp; PERSPECTIVES
                </p>
                <Heading
                  level={2}
                  className="heading-h2 leading-[1.08] tracking-tight text-[#0B192C] mb-1.5 sm:mb-2 drop-shadow-md sm:drop-shadow-none"
                >
                  Thought Leadership for the{" "}
                  <span className="text-brand-teal">Adaptive Future.</span>
                </Heading>
                <p className="body-text-sm sm:body-text text-black max-w-full md:max-w-[85%] lg:max-w-[900px] mb-1 sm:mb-2 drop-shadow-md sm:drop-shadow-none whitespace-normal break-words">
                  Expert insights, frameworks and perspectives to help leaders
                  navigate complexity and build future-ready organisations.
                </p>
              </motion.div>
              <div className="flex items-center justify-start md:justify-end shrink-0 mb-2 md:mb-0">
                <Link href="/insights">
                  <span className="body-text-sm sm:body-text text-brand-blue hover:text-brand-teal transition-colors cursor-pointer font-semibold inline-flex items-center">
                    View All Insights <ArrowRightIcon />
                  </span>
                </Link>
              </div>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 xl:gap-6 my-1 sm:my-2">
              {displayedArticles?.length > 0 &&
                displayedArticles.map((article, idx) => (
                  <article
                    key={article.id || idx}
                    onClick={() => setSelectedArticle(article)}
                    className="group rounded-2xl bg-[#08152b]/95 border border-white/15 hover:border-brand-teal/60 overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.28)] hover:shadow-[0_16px_48px_rgba(0,196,180,0.2)] transition-all duration-300 flex flex-col h-full cursor-pointer min-w-0"
                  >
                    <div className="relative w-full overflow-hidden shrink-0">
                      <img
                        src={article.image}
                        alt={article.title}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          if (!e.currentTarget.dataset.fallbackApplied) {
                            e.currentTarget.dataset.fallbackApplied = "true";
                            e.currentTarget.src = DEFAULT_ARTICLE_IMAGE;
                          }
                        }}
                        className="w-full h-auto block pointer-events-none select-none"
                      />
                    </div>

                    <div className="p-4 sm:p-5 xl:p-6 flex flex-col flex-1">
                      {article.tag && (
                        <span className="text-[11px] sm:text-xs xl:text-sm text-brand-teal uppercase font-semibold tracking-widest mb-1.5">
                          {article.tag}
                        </span>
                      )}

                      <h3 className="heading-h5 lg:heading-h6 xl:heading-h5 2xl:heading-h4 text-white leading-snug mb-2 line-clamp-2 group-hover:text-brand-teal transition-colors">
                        {article.title}
                      </h3>

                      <p className="text-xs xl:body-text-sm text-slate-300 line-clamp-2 xl:line-clamp-3 leading-relaxed mb-4 flex-1">
                        {article.description}
                      </p>

                      <div className="mt-auto pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedArticle(article);
                          }}
                          className="relative inline-flex items-center group/btn cursor-pointer py-1 select-none"
                        >
                          <span className="absolute inset-y-1 left-0 w-8 sm:w-9 xl:w-10 rounded-full bg-brand-teal transition-all duration-500 ease-[cubic-bezier(0.65,0,0.076,1)] group-hover/btn:w-full group-hover/btn:bg-gradient-to-r group-hover/btn:from-brand-teal group-hover/btn:to-brand-blue shadow-[0_4px_16px_rgba(0,196,180,0.4)]" />

                          <span className="relative z-10 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 xl:w-10 xl:h-10 shrink-0">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white transition-transform duration-500 group-hover/btn:translate-x-1"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                          </span>

                          <span className="relative z-10 pr-4 sm:pr-5 pl-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-teal transition-colors duration-500 group-hover/btn:text-white whitespace-nowrap">
                            Read Article
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedArticle && (
          <ArticleDetail
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
