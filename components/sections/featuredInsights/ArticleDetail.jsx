"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 inline-block mr-1" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
    </svg>
  );
}

function renderContent(content) {
  if (!content) return null;
  if (typeof content === "string") {
    return content.split("\n\n").map((p, i) => (
      <p key={i} className="text-[#CBD5E1] text-sm leading-relaxed mb-4">
        {p}
      </p>
    ));
  }
  if (!Array.isArray(content)) return null;
  return content.map((block, i) => {
    if (block.type === "paragraph") {
      return (
        <p key={i} className="text-[#CBD5E1] text-sm leading-relaxed mb-4">
          {block.text}
        </p>
      );
    }
    if (block.type === "heading") {
      return (
        <h3 key={i} className="text-[#00C4B4] font-['Playfair_Display',serif] font-semibold text-base mb-2 mt-5 leading-snug">
          {block.text}
        </h3>
      );
    }
    if (block.type === "subheading") {
      return (
        <h4 key={i} className="text-white font-semibold text-sm mb-1 mt-4">
          {block.text}
        </h4>
      );
    }
    if (block.type === "list") {
      return (
        <ul key={i} className="space-y-1.5 mb-4 ml-1">
          {block.items.map((item, j) => (
            <li key={j} className="text-[#CBD5E1] text-sm leading-relaxed flex gap-2">
              <span className="text-[#00C4B4] mt-1 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    if (block.type === "quote") {
      return (
        <blockquote key={i} className="border-l-2 border-[#00C4B4] pl-4 italic text-[#94A3B8] text-sm mb-4">
          {block.text}
        </blockquote>
      );
    }
    return null;
  });
}

export default function ArticleDetail({ article, onClose }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__lenis?.stop();
    }
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      if (typeof window !== "undefined") {
        window.__lenis?.start();
      }
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleCardWheel = (e) => {
    e.stopPropagation();
    if (scrollRef.current && !scrollRef.current.contains(e.target)) {
      scrollRef.current.scrollTop += e.deltaY;
    }
  };

  if (!article) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 overscroll-contain"
        style={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(4,12,26,0.85)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          data-lenis-prevent="true"
          onWheel={handleCardWheel}
          className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden overscroll-contain"
          style={{
            background: "linear-gradient(160deg, #0d1f38 0%, #09172B 60%, #040C1A 100%)",
            border: "1px solid rgba(0,196,180,0.2)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,196,180,0.08)",
          }}
        >
          <div className="relative h-52 sm:h-64 2xl:h-96 shrink-0 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              onError={(e) => {
                e.currentTarget.src = "/assets/articles/The%20Mindset%20Shift.webp";
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#09172B]" />
            <div className="absolute inset-x-4 top-4 flex items-center justify-between">
              <span className="bg-[#09172B]/85 backdrop-blur-md border border-[#00C4B4]/40 text-[#00C4B4] text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                {article.tag}
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 cursor-pointer rounded-full bg-[#09172B]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-colors"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8 pb-8 pt-5"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(0, 196, 180, 0.35) transparent",
            }}
          >
            <div className="flex justify-end gap-3 mb-4">

              <span className="text-[#64748B] text-xs">{article.date}</span>
            </div>

            <h2 className="font-['Playfair_Display',serif] font-bold text-white text-xl sm:text-2xl leading-tight mb-2">
              {article.title}
            </h2>

            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/[0.07]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C4B4] to-[#2563EB] flex items-center justify-center text-white text-xs font-bold shrink-0">
                RP
              </div>
              <div>
                <p className="text-white text-xs 2xl:text-lg font-semibold">{article.author}</p>
                <p className="text-[#64748B] text-[10px] 2xl:text-sm leading-tight">{article.authorRole}</p>
              </div>
            </div>

            <div>{renderContent(article.content)}</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
