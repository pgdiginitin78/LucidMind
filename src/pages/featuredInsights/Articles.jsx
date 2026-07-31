import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Heading from "../../components/ui/Heading";
import WebGLParticleCanvas from "./WebGLParticleCanvas";
import articlesSectionBg from "../../assets/articles_section_bg.png";

gsap.registerPlugin(ScrollTrigger);

const articles = [
  {
    tag: "MINDSET",
    readTime: "2 MIN READ",
    title: "From Managing to Making: The Mindset Shift",
    description: "For much of my recent career, I focused on managing",
    image:
      "https://media.licdn.com/dms/image/v2/D4D12AQEGa84Lo3CPoA/article-cover_image-shrink_423_752/B4DZm9_jvSJcAU-/0/1759829183949?e=1787184000&v=beta&t=dxvs3erh4GkEvIhHWZpxMmjNd7hJot2JGCFbHKyuNJo",
  },
  {
    tag: "PROGRAMMING",
    readTime: "4 MIN READ",
    title: "Three Programming Revolutions, Three Leadership Principles",
    description:
      "Over the past 26 years in tech, I’ve watched coding evolve in ways none....",
    image:
      "https://media.licdn.com/dms/image/v2/D4D12AQG-CfrS0So1qg/article-cover_image-shrink_423_752/B4DZlxfH_4JEAU-/0/1758545618607?e=1787184000&v=beta&t=yQog4r6TvaE13qc4-SPPhpRtEkK3SHRvg2lJ_0Znn84",
  },
  {
    tag: "MENTORSHIP",
    readTime: "4 MIN READ",
    title: "Mentorship in the Age of AI: Why Your Humanity Isn't....",
    description:
      "All through my career, I have found myself existing between two colliding....",
    image:
      "https://media.licdn.com/dms/image/v2/D4D12AQGVE09Z1Kmf-g/article-cover_image-shrink_180_320/B4DZin44AMGgAY-/0/1755163366813?e=1787184000&v=beta&t=y1Mk-K55inLaorCVw8B1I499DcfgZMsQz3mhkeSrPyM",
  },
  {
    tag: "TECHNOLOGY",
    readTime: "4 MIN READ",
    title: "My Lens For Evaluating Any Emerging Technology",
    description:
      "But amidst all the “next big thing” technology hype cycles, how do we, as...",
    image:
      "https://media.licdn.com/dms/image/v2/D4D12AQGq9HgOFTeV9g/article-cover_image-shrink_180_320/B4DZdjhz66H4AY-/0/1749721510060?e=1787184000&v=beta&t=njsvL0C8VJDzo9DnCc2n4wWWbPDpGy6_J0oBb2QSY_M",
  },
  {
    tag: "AI AGENTS",
    readTime: "4 MIN READ",
    title: "How to Build Effective AI Agents",
    description:
      "Creating an AI agent that works effectively requires more than just th....",
    image:
      "https://media.licdn.com/dms/image/v2/D4D12AQEDJxJtZY3Jig/article-cover_image-shrink_180_320/article-cover_image-shrink_180_320/0/1734363762906?e=1787184000&v=beta&t=ZWfmiRetot0D-eiB4LbirQ4pFaStzlFksG1TE5KFNSc",
  },
  {
    tag: "AGENTIC AI",
    readTime: "4 MIN READ",
    title: "Agentic AI : The Next Evolution in AI",
    description:
      "The Intelligent Virtual Assistant Market size was valued at USD 14.25 Billion in...",
    image:
      "https://media.licdn.com/dms/image/v2/D4D12AQFCbN9b2MiYuA/article-cover_image-shrink_423_752/article-cover_image-shrink_423_752/0/1732879436421?e=1787184000&v=beta&t=EMmtu1L55aA5usCKxurDW1Pr8fzVy8R3y7u65OYt9Xw",
  },
  {
    tag: "AI ERA",
    readTime: "2 MIN READ",
    title: "Evolution of Software Engineering in the AI Era",
    description: "The Transformative Waves of Technology Over the past two...",
    image:
      "https://media.licdn.com/dms/image/v2/D4D12AQGmxn2D39GH4g/article-cover_image-shrink_423_752/article-cover_image-shrink_423_752/0/1727439816280?e=1787184000&v=beta&t=cZMAxjbLurMPfwXCs9F1-_d5L3eP4xkbcDtxWo3oRqU",
  },
  {
    tag: "TRANSFORMATION",
    readTime: "2 MIN READ",
    title: "The Triad of Transformation",
    description: "In the ever-evolving landscape of supply chain management, the digital...",
    image:"https://media.licdn.com/dms/image/v2/D4D12AQGEDyej8LdxWQ/article-cover_image-shrink_423_752/article-cover_image-shrink_423_752/0/1706787208335?e=1787184000&v=beta&t=zwUQfQL_zh4ZlkscCbJNa3Gl88JbGpe5c6tIFVCwmAI",
  },
];

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-3.5 h-3.5 inline-block mr-1"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
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

export default function Articles() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useGSAP(() => {
    gsap.from(".articles-headline", {
      opacity: 0,
      x: -50,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
    });
    gsap.from(cardsRef.current, {
      opacity: 0,
      y: 60,
      stagger: 0.15,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-10 px-6 sm:px-12 md:px-16 lg:px-12 relative overflow-hidden font-['PlusJakartaSans',sans-serif]"
    >
      <img
        src={articlesSectionBg}
        alt="Articles Section Background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[1] opacity-75"
      />

      <div className="max-w-[1440px] mx-auto relative" style={{ zIndex: 2 }}>
        <WebGLParticleCanvas variant="articles" />
        <div className="grid items-start">
          <div className="articles-headline  flex-shrink-0 pt-2">
            <p className="text-[#00C4B4] font-semibold tracking-[0.18em] uppercase text-xs mb-3">
              INSIGHTS &amp; PERSPECTIVES
            </p>
            <Heading
              level={2}
              className="font-['Playfair_Display',serif] font-semibold text-[2.5rem] sm:text-[3rem] lg:text-[3.25rem] leading-[1.05] tracking-tight text-white sm:text-[#0B192C] mb-5 drop-shadow-md sm:drop-shadow-none"
            >
              Thought Leadership
              <br />
              for the{" "}
              <span className="text-[#00C4B4] sm:text-[#009A9A] font-['Playfair_Display',serif]">
                AI Era.
              </span>
            </Heading>
            <p className="text-white sm:text-black text-sm sm:text-base leading-relaxed mb-7  drop-shadow-md sm:drop-shadow-none">
              Expert insights, frameworks and perspectives to help leaders
              navigate complexity and build future-ready organisations.
            </p>
            {/* <motion.button
              whileHover={{ scale: 1.04, backgroundColor: "#009A9A", color: "#ffffff", borderColor: "#009A9A" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-2.5 border border-[#00C4B4] sm:border-[#009A9A] text-[#00C4B4] sm:text-[#009A9A] text-sm font-semibold px-5 py-2.5 rounded-full hover:text-white transition-colors duration-300 cursor-pointer shadow-sm bg-white/30 backdrop-blur-sm sm:bg-transparent"
            >
              Explore All Articles
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center">
                <ArrowRightIcon />
              </span>
            </motion.button> */}
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {articles.map((article, idx) => (
              <motion.div
                key={idx}
                ref={(el) => (cardsRef.current[idx] = el)}
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 40px rgba(0,196,180,0.25)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="rounded-xl overflow-hidden cursor-pointer group flex flex-col bg-[#09172B]/85  border border-[#00C4B4]/[0.22] shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
              >
                <div className="relative h-[170px] overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                  <div className="absolute inset-x-3 top-3 flex items-center justify-between">
                    <span className="bg-[#09172B]/85 backdrop-blur-md border border-[#00C4B4]/40 text-[#00C4B4] text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                      {article.tag}
                    </span>
                    <span className="text-[#94A3B8] text-[10px] font-medium bg-[#09172B]/75 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 flex items-center">
                      <ClockIcon />
                      {article.readTime}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-3">
                  <h3 className="text-white font-['Playfair_Display',serif] font-semibold text-[1rem] leading-[1.25] mb-2 flex-1">
                    {article.title}
                  </h3>
                  <p className="text-[#94A3B8] text-xs leading-relaxed mb-3">
                    {article.description}
                  </p>
                  <span className="text-[#00C4B4] text-xs font-semibold tracking-wide inline-flex items-center gap-1 group-hover:text-white transition-colors">
                    Read Article <ArrowRightIcon />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
