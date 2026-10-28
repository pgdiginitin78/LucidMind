"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname, Link } from "@/lib/navigation";
import Heading from "../../ui/Heading";
import ArticleDetail from "./ArticleDetail";
import { useMobileDetection } from "./MagicBento";
import WebGLParticleCanvas from "./WebGLParticleCanvas";
import { API_BASE_URL } from "@/src/config/api";
import { cn, resolveImageUrl } from "@/lib/utils";
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
  const [hovered, setHovered] = useState(null);
  const pathname = usePathname();
  const isMobile = useMobileDetection();

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
            image: b.image || b.coverImage || "",
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
        className={`w-full ${pathname === "/articles" || pathname === "/insights" ? "pt-28 sm:pt-36 pb-12 sm:pb-16" : "py-12 sm:py-16 md:py-10"} relative overflow-hidden font-inter`}
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

        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 relative z-[2]">
          <div className="grid items-start gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 min-w-0 pt-2"
              >
                <p className="heading-h6 font-semibold tracking-[0.18em] uppercase text-brand-blue mb-2">
                  INSIGHTS &amp; PERSPECTIVES
                </p>
                <Heading
                  level={2}
                  className="heading-h2 leading-[1.05] tracking-tight text-[#0B192C] mb-2 drop-shadow-md sm:drop-shadow-none"
                >
                  Thought Leadership
             
                  for the{" "}
                  <span className="text-brand-teal">
                    Adaptive Future.
                  </span>
                </Heading>
                <p className="body-text text-black max-w-full md:max-w-[80%] lg:max-w-[900px] mb-3 drop-shadow-md sm:drop-shadow-none whitespace-normal break-words">
                  Expert insights, frameworks and perspectives to help leaders
                  navigate complexity and build future-ready organisations.
                </p>
              </motion.div>
              <div className="flex items-center justify-start md:justify-end shrink-0 mb-4 md:mb-0">
                <Link href="/insights">
                  <span className="body-text text-brand-blue hover:text-brand-teal transition-colors cursor-pointer font-semibold inline-flex items-center">
                    View All Insights <ArrowRightIcon />
                  </span>
                </Link>
              </div>
            </div>

            <div
              className="w-full flex flex-col lg:flex-row gap-3 h-auto lg:h-[520px] rounded-2xl overflow-hidden my-2"
              onMouseLeave={() => !isMobile && setHovered(null)}
            >
              {displayedArticles?.length > 0 &&
                displayedArticles.map((article, idx) => {
                  const isActive = hovered === article.id;
                  const isIdle = hovered !== null && hovered !== article.id;

                  return (
                    <div
                      key={article.id || idx}
                      className={cn(
                        "relative overflow-hidden rounded-2xl cursor-pointer border min-w-0",
                        "h-80 lg:h-full",
                        "transition-all duration-600 ease-[cubic-bezier(0.25,1,0.5,1)]",
                        isMobile
                          ? "w-full"
                          : isActive
                            ? "lg:flex-[2.4] border-brand-teal/80 shadow-[0_12px_40px_rgba(0,196,180,0.25)]"
                            : isIdle
                              ? "lg:flex-[0.75] border-white/10"
                              : "lg:flex-1 border-white/20 hover:border-brand-teal/40",
                      )}
                      onMouseEnter={() => {
                        if (!isMobile && hovered !== article.id) {
                          setHovered(article.id);
                        }
                      }}
                      onClick={() => setSelectedArticle(article)}
                    >
                      <div
                        className={cn(
                          "absolute inset-0 overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                          isActive ? "scale-105" : "scale-100",
                        )}
                      >
                        <img
                          src={resolveImageUrl(article.image)}
                          alt={article.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover object-center pointer-events-none select-none"
                        />
                      </div>

                      <div
                        className={cn(
                          "absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-500",
                          "bg-gradient-to-t from-[#040914] via-[#040914]/65 to-transparent",
                          isIdle ? "opacity-90" : "opacity-80",
                        )}
                      />

                      <div
                        className={cn(
                          "absolute inset-0 pointer-events-none bg-[#040914]/45 transition-opacity duration-500",
                          isIdle ? "opacity-100" : "opacity-0",
                        )}
                      />

                      <div className="absolute inset-0 flex items-end p-5 lg:p-6 pointer-events-none">
                        <div
                          className={cn(
                            "hidden lg:flex flex-col items-center justify-end absolute bottom-6 inset-x-0 px-4 text-center pointer-events-none transition-all",
                            isActive
                              ? "opacity-0 translate-y-3 pointer-events-none duration-200 delay-0"
                              : isIdle
                                ? "opacity-75 translate-y-0 duration-400 delay-100"
                                : "opacity-100 translate-y-0 duration-400 delay-100",
                          )}
                        >
                          {article.tag && (
                            <span className="heading-h6 text-brand-teal uppercase font-semibold tracking-widest mb-1.5 drop-shadow">
                              {article.tag}
                            </span>
                          )}
                          <p className="body-text text-white font-semibold leading-snug tracking-wide text-center drop-shadow-md line-clamp-3 max-w-full px-2">
                            {article.title}
                          </p>
                        </div>

                        <div
                          className={cn(
                            "w-full flex flex-col gap-2 z-10 pointer-events-auto transition-all ease-out",
                            isMobile || isActive
                              ? "opacity-100 translate-y-0 visible duration-500 delay-150"
                              : "opacity-0 translate-y-4 invisible pointer-events-none duration-200 delay-0",
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {article.tag && (
                              <span className="heading-h6 text-brand-teal uppercase font-semibold tracking-widest">
                                {article.tag}
                              </span>
                            )}
                          </div>
                          <h3 className="heading-h3 text-white leading-snug drop-shadow-lg line-clamp-2 md:line-clamp-3">
                            {article.title}
                          </h3>
                          <p className="body-text text-slate-300 line-clamp-2 max-w-2xl leading-relaxed drop-shadow">
                            {article.description}
                          </p>
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedArticle(article);
                              }}
                              className="relative inline-flex items-center group/btn cursor-pointer py-1 select-none"
                            >
                              <span className="absolute inset-y-1 left-0 w-11 rounded-full bg-brand-teal transition-all duration-500 ease-[cubic-bezier(0.65,0,0.076,1)] group-hover/btn:w-full group-hover/btn:bg-gradient-to-r group-hover/btn:from-brand-teal group-hover/btn:to-brand-blue shadow-[0_4px_16px_rgba(0,196,180,0.4)]" />

                              <span className="relative z-10 flex items-center justify-center w-11 h-11 shrink-0">
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className="w-4 h-4 text-white transition-transform duration-500 group-hover/btn:translate-x-1"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                  <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                              </span>

                              <span className="relative z-10 pr-5 pl-2 body-text font-bold uppercase tracking-wider text-brand-teal transition-colors duration-500 group-hover/btn:text-white whitespace-nowrap">
                                Read Article
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      {selectedArticle && (
        <ArticleDetail
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </>
  );
}
