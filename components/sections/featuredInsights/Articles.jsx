"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname, Link } from "@/lib/navigation";
const articlesSectionBgWebP = "/assets/articles_section_bg.webp";
import Heading from "../../ui/Heading";
import ArticleDetail from "./ArticleDetail";
import {
  BentoCardGrid,
  GlobalSpotlight,
  ParticleCard,
  useMobileDetection,
} from "./MagicBento";
import WebGLParticleCanvas from "./WebGLParticleCanvas";
import { API_BASE_URL } from "@/lib/api";

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
  const gridRef = useRef(null);
  const cardsRef = useRef([]);
  const [articlesList, setArticlesList] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const pathname = usePathname();
  const isMobile = useMobileDetection();

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE_URL}/api/blogs`)
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
      .catch(() => {
        // keep default fallback articles
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className={`w-full ${pathname === "/articles" || pathname === "/insights" ? "pt-28 sm:pt-36 pb-12 sm:pb-16" : "py-12 sm:py-16 md:py-10"} relative overflow-hidden font-['PlusJakartaSans',sans-serif]`}
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

        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 relative z-[2]">
          <BentoCardGrid gridRef={gridRef}>
            <GlobalSpotlight
              gridRef={gridRef}
              disableAnimations={isMobile}
              enabled={true}
              spotlightRadius={400}
              glowColor="0, 196, 180"
            />
            <div className="grid items-start">
              <div className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="shrink-0 pt-2"
                >
                  <p className="text-brand-blue font-semibold tracking-[0.18em] uppercase text-xs mb-2">
                    INSIGHTS &amp; PERSPECTIVES
                  </p>
                  <Heading
                    level={2}
                    className="font-['Playfair_Display',serif] font-semibold text-[2rem] lg:text-[3rem] lg:text-[3rem] leading-[1.05] tracking-tight text-[#0B192C] mb-2 drop-shadow-md sm:drop-shadow-none"
                  >
                    Thought Leadership
                    <br />
                    for the{" "}
                    <span className="text-brand-teal  font-['Playfair_Display',serif]">
                      AI Era.
                    </span>
                  </Heading>
                  <p className="text-black text-sm sm:text-base lg:text-base leading-relaxed max-w-[100%] md:max-w-[80%] lg:max-w-[900px] mb-3 drop-shadow-md sm:drop-shadow-none">
                    Expert insights, frameworks and perspectives to help leaders
                    navigate complexity and build future-ready organisations.
                  </p>
                </motion.div>
                <div className="w-full flex items-center justify-end">
                  <Link href="/insights">
                    <span className=" text-brand-blue  cursor-pointer font-semibold">
                      View All Insights <ArrowRightIcon />
                    </span>
                  </Link>
                </div>
              </div>

              <div className="md:flex-1 grid grid-cols-1  md:grid-cols-2 xl:grid-cols-4 gap-4 ">
                {articlesList.slice(0, 4).map((article, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{
                      duration: 0.7,
                      delay: idx * 0.08,
                      ease: "easeOut",
                    }}
                    className="h-full"
                  >
                    <ParticleCard
                      onClick={() => setSelectedArticle(article)}
                      disableAnimations={isMobile}
                      particleCount={12}
                      glowColor="0, 196, 180"
                      enableTilt={false}
                      enableMagnetism={false}
                      clickEffect={true}
                      className="magic-bento-card magic-bento-card--border-glow rounded-xl overflow-hidden cursor-pointer group flex flex-col h-full bg-[#09172B]/85 border border-[#00C4B4]/[0.22] shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
                    >
                      <div className="relative h-48 2xl:h-48 overflow-hidden shrink-0">
                        <img
                          src={article.image}
                          alt={article.title}
                          loading="lazy"
                          decoding="async"
                          width={700}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60" />
                      </div>
                      <div className="flex flex-col flex-1 p-3 z-10">
                        <h3 className="text-white font-['Playfair_Display',serif] font-semibold text-[1rem] 2xl:text-[1.3rem] leading-[1.25] mb-2">
                          {article.title}
                        </h3>
                        <p className="text-[#94A3B8] text-xs 2xl:text-sm leading-relaxed mb-4 flex-1">
                          {article.description}
                        </p>
                        <span className="text-brand-teal text-xs 2xl:text-base font-semibold tracking-wide inline-flex items-center gap-1 group-hover:text-white transition-colors mt-auto">
                          Read Article <ArrowRightIcon />
                        </span>
                      </div>
                    </ParticleCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </BentoCardGrid>
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
