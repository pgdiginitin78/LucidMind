import React, { useRef, useEffect } from "react";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Heading from "../../components/ui/Heading";


const problems = [
  "AI without a roadmap",
  "Scaling GCCs",
  "Enterprise transformation",
  "Leadership readiness",
  "Governance & Responsible AI",
];

const solutions = [
  {
    title: "AI Strategy & Adoption",
    desc: "Build the right strategy.\nDrive meaningful adoption.",
    icon: (
      <svg className="w-5 h-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Business Transformation",
    desc: "Reimagine operations.\nAccelerate impact.",
    icon: (
      <svg className="w-5 h-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    title: "GCC Advisory",
    desc: "Setup, scale and optimize\nhigh-performance GCCs.",
    icon: (
      <svg className="w-5 h-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: "Leadership Advisory",
    desc: "Strengthen leadership\nfor the AI era.",
    icon: (
      <svg className="w-5 h-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    title: "Responsible AI & ESG",
    desc: "Build trust through ethics,\ngovernance and impact.",
    icon: (
      <svg className="w-5 h-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const TiltCard = ({ children, className }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const onMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const onMouseEnter = () => {
      gsap.to(card, { scale: 1.02, duration: 0.5, ease: "back.out(1.5)" });
    };

    const onMouseLeave = () => {
      gsap.to(card, { scale: 1, rotateX: 0, rotateY: 0, duration: 0.7, ease: "power3.out" });
    };

    card.addEventListener("mousemove", onMouseMove);
    card.addEventListener("mouseenter", onMouseEnter);
    card.addEventListener("mouseleave", onMouseLeave);

    return () => {
      card.removeEventListener("mousemove", onMouseMove);
      card.removeEventListener("mouseenter", onMouseEnter);
      card.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div ref={cardRef} className={className} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
};


export default function ProblemsAndSolutions() {
  const gridRef = useRef(null);
  const problemRefs = useRef([]);
  const solutionRefs = useRef([]);

  const listVariant = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };

  const itemVariant = {
    hidden: { opacity: 0, x: -16 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
  };

  const itemVariantRight = {
    hidden: { opacity: 0, x: 16 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#e8f1f8] to-[#d3e1ef] px-6 py-16 sm:px-12 md:px-16 lg:px-12">
      <div className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full overflow-hidden">
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-white/60 blur-[100px]" />
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1220px] ">
          <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex-1 w-full md:w-1/2"
        >
          <div className="flex flex-col items-start w-full">
            <p className="text-brand-blue font-bold tracking-[0.25em] uppercase text-xs sm:text-sm mb-3">
              Challenges Leaders Face
            </p>
            <div className="w-12 h-[2px] bg-brand-blue mb-6"></div>
            
            <Heading level={2} className="text-2xl sm:text-3xl lg:text-[2.5rem] text-[#0B192C] leading-[1.1] mb-8">
              What Problems Leadership Teams Face <span className="text-brand-blue">Today</span>
            </Heading>
            
         
          </div>
        </motion.div>

        <div ref={gridRef} className="relative grid grid-cols-1 items-stretch gap-y-6 md:grid-cols-2 md:gap-x-10 lg:gap-x-14  ">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-20 flex flex-col justify-center rounded-[1.5rem] border border-[#009A9A]/15 bg-white/70 p-6 shadow-[0_20px_50px_rgba(11,25,44,0.08)] backdrop-blur-sm sm:p-8"
          >
            <p className="mb-1 text-xs font-semibold tracking-[0.3em] text-[#007070] uppercase sm:text-sm">
              The Problem
            </p>
            <h3 className="mb-5 text-lg font-semibold text-[#0B192C] sm:text-xl">What&apos;s slowing teams down</h3>

            <motion.ul variants={listVariant} initial="hidden" whileInView="show" viewport={{ once: true }} className="w-full">
              {problems.map((item, idx) => (
                <motion.li
                  variants={itemVariant}
                  key={idx}
                  className="group flex h-16 cursor-default items-center justify-between border-b border-gray-300/60 last:border-0"
                >
                  <div className="flex items-center">
                    <div className="mr-4 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#E0EBF5] shadow-sm transition-colors duration-300 group-hover:bg-[#009A9A]">
                      <KeyboardArrowRightRoundedIcon
                        fontSize="small"
                        className="text-[#007070] transition-colors duration-300 group-hover:text-white"
                      />
                    </div>
                    <span className="text-base font-medium text-[#1c2e4a] transition-colors duration-300 group-hover:text-[#009A9A]">
                      {item}
                    </span>
                  </div>
                  <span
                    ref={(el) => (problemRefs.current[idx] = el)}
                    className="ml-3 h-2 w-2 flex-shrink-0 rounded-full bg-[#009A9A] shadow-[0_0_8px_1px_rgba(0,154,154,0.6)]"
                  />
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-20 flex"
          >
            <TiltCard className="relative flex w-full flex-col justify-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-brand-blue to-[#040914] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] sm:p-8">
              <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-[#00A3FF] opacity-30 blur-[80px]" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 -translate-x-1/3 translate-y-1/3 rounded-full bg-[#00A3FF] opacity-10 blur-[60px]" />

              <div className="relative z-10 mb-4">
                <p className="mb-1 text-xs font-semibold tracking-[0.3em] text-white uppercase sm:text-sm">How</p>
                <Heading level={2} className="text-3xl leading-tight tracking-wide text-white sm:text-[1.75rem]">
                  <span className="bg-gradient-to-r from-[#00C4B4] to-[#00E5FF] bg-clip-text font-bold text-transparent">
                    LucidMind
                  </span>{" "}
                  HELPS
                </Heading>
              </div>

              <motion.ul variants={listVariant} initial="hidden" whileInView="show" viewport={{ once: true }} className="relative z-10">
                {solutions.map((item, idx) => (
                  <motion.li
                    variants={itemVariantRight}
                    key={idx}
                    className="group flex h-16 cursor-pointer items-center border-b border-white/10 last:border-0"
                  >
                    <span
                      ref={(el) => (solutionRefs.current[idx] = el)}
                      className="mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-[#00E5FF] shadow-[0_0_8px_1px_rgba(0,229,255,0.7)]"
                    />

                    <div className="relative mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#112240] shadow-[0_0_15px_rgba(0,196,180,0.1)] transition-colors duration-300 group-hover:bg-[#1a365d]">
                      <div className="absolute inset-0 rounded-full bg-[#00A3FF] opacity-20 blur-md transition-opacity duration-300 group-hover:opacity-40" />
                      <div className="relative z-10">{item.icon}</div>
                    </div>

                    <div className="flex-1 pr-4">
                      <Heading level={3} className="text-sm text-white">
                        {item.title}
                      </Heading>
                      <p className="mt-1 text-xs leading-snug whitespace-pre-line text-blue-100/60">{item.desc}</p>
                    </div>

                    <div className="flex-shrink-0 text-blue-400/40 transition-colors group-hover:text-[#00C4B4]">
                      <KeyboardArrowRightRoundedIcon fontSize="small" />
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}