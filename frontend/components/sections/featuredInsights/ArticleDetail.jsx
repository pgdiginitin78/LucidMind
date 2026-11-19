"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DEFAULT_ARTICLE_IMAGE, resolveSafeImageUrl } from "@/lib/utils";

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-5 h-5"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

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

function renderContent(content) {
  if (!content) return null;
  if (typeof content === "string") {
    return content.split("\n\n").map((p, i) => (
      <p key={i} className="body-text text-[#CBD5E1] leading-relaxed mb-4">
        {p}
      </p>
    ));
  }
  if (!Array.isArray(content)) return null;
  return content.map((block, i) => {
    if (block.type === "paragraph") {
      return (
        <p key={i} className="body-text text-[#CBD5E1] leading-relaxed mb-4">
          {block.text}
        </p>
      );
    }
    if (block.type === "heading") {
      return (
        <h3 key={i} className="heading-h3 text-[#00C4B4] mb-2 mt-5">
          {block.text}
        </h3>
      );
    }
    if (block.type === "subheading") {
      return (
        <h4 key={i} className="heading-h4 text-white mb-1 mt-4">
          {block.text}
        </h4>
      );
    }
    if (block.type === "list") {
      return (
        <ul key={i} className="space-y-1.5 mb-4 ml-1">
          {block.items.map((item, j) => (
            <li
              key={j}
              className="body-text text-[#CBD5E1] leading-relaxed flex gap-2"
            >
              <span className="text-[#00C4B4] mt-1 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    if (block.type === "quote") {
      return (
        <blockquote
          key={i}
          className="body-text border-l-2 border-[#00C4B4] pl-4 italic text-[#94A3B8] mb-4"
        >
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
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-6 bg-[#040C1A]/85 backdrop-blur-md overscroll-contain"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        data-lenis-prevent="true"
        onWheel={handleCardWheel}
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden overscroll-contain bg-gradient-to-br from-[#0d1f38] via-[#09172B] to-[#040C1A] border border-[#00C4B4]/20 shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(0,196,180,0.08)]"
      >
        <button
          type="button"
          aria-label="Close article"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 cursor-pointer rounded-full bg-[#09172B]/85 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white/40 transition-colors"
        >
          <CloseIcon />
        </button>

        <div
          ref={scrollRef}
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="flex-1 overflow-y-auto overscroll-contain"
        >
          <div className="relative w-full overflow-hidden bg-[#040C1A]">
            <img
              src={resolveSafeImageUrl(article.image, DEFAULT_ARTICLE_IMAGE)}
              alt={article.title}
              onError={(e) => {
                if (!e.currentTarget.dataset.fallbackApplied) {
                  e.currentTarget.dataset.fallbackApplied = "true";
                  e.currentTarget.src = DEFAULT_ARTICLE_IMAGE;
                }
              }}
              className="w-full h-auto block"
            />
            <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#09172B] to-transparent pointer-events-none" />
          </div>

          <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-4 sm:pt-5">
            <div className="flex justify-end gap-3 mb-3 sm:mb-4">
              <span className="body-text-sm sm:body-text text-[#64748B]">
                {article.date}
              </span>
            </div>

            <h2 className="heading-h4 2xl:heading-h3 text-white mb-2">
              {article.title}
            </h2>

            <div className="flex items-center gap-3 mb-5 sm:mb-6 pb-4 sm:pb-5 border-b border-white/[0.07]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C4B4] to-[#2563EB] flex items-center justify-center text-white body-text-sm font-bold shrink-0">
                RP
              </div>
              <div className="min-w-0">
                <p className="body-text-sm sm:body-text text-white font-semibold">
                  {article.author}
                </p>
                <p className="text-xs sm:body-text-sm text-[#64748B] leading-tight">
                  {article.authorRole}
                </p>
              </div>
            </div>

            <div>{renderContent(article.content)}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
