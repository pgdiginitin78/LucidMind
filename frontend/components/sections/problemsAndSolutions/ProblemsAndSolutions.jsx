"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import Heading from "../../ui/Heading";
import LucidMindHELPSImg from "./images/LucidMindHELPS.webp";

function ChevronRightIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
    </svg>
  );
}

const problems = [
  "AI without a roadmap",
  "Enterprise transformation",
  "Transforming GCCs",
  "Leadership readiness",
  "Governance & Responsible AI",
];

const solutions = [
  {
    title: "AI Strategy & Adoption",
    desc: "From AI strategy to measurable value",
    icon: (
      <svg
        className="w-5 h-5 text-blue-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    title: "Change Enablement",
    desc: "Making change work across the business",
    icon: (
      <svg
        className="w-5 h-5 text-blue-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
  },
  {
    title: "GCC Evolution & Optimisation",
    desc: "Evolving GCCs for greater business impact",
    icon: (
      <svg
        className="w-5 h-5 text-blue-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    title: "Leadership Capability & Adoption Mindset",
    desc: "Building leaders ready for change",
    icon: (
      <svg
        className="w-5 h-5 text-blue-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    title: "ESG & Responsible Business Transformation",
    desc: "Building responsible, sustainable growth",
    icon: (
      <svg
        className="w-5 h-5 text-blue-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
];

const TiltCard = ({ children, className }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function ProblemsAndSolutions() {
  const gridRef = useRef(null);
  const problemRefs = useRef([]);
  const solutionRefs = useRef([]);

  const listVariant = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, x: -12 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };

  const itemVariantRight = {
    hidden: { opacity: 0, x: 12 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#e8f1f8] to-[#d3e1ef] py-10 sm:py-12 md:py-16 min-[2560px]:py-24">
      <div className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full overflow-hidden">
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-white/60 blur-[100px]" />
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1680px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 min-[1920px]:max-w-[1800px] min-[2560px]:max-w-[2200px] min-[3840px]:max-w-[3000px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex-1"
        >
          <div className="flex w-full flex-col items-start">
            <p className="heading-h6 mb-3 font-bold tracking-[0.25em] text-brand-blue uppercase">
              Challenges
            </p>
            <div className="mb-6 h-[2px] w-12 bg-brand-blue"></div>

            <Heading
              level={2}
              className="heading-h2 mb-6 leading-[1.1] text-[#0B192C] md:mb-8"
            >
              What Problems Enterprises Face{" "}
              <span className="text-brand-blue">Today?</span>
            </Heading>
          </div>
        </motion.div>

        <div className="mx-auto w-full">
          <div
            ref={gridRef}
            className="relative grid grid-cols-1 items-stretch gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-8 xl:gap-12 min-[2560px]:gap-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-20 flex w-full flex-col justify-center rounded-[1.5rem] border border-[#009A9A]/15 bg-white/70 p-5 shadow-[0_20px_50px_rgba(11,25,44,0.08)] backdrop-blur-sm sm:p-8 min-[2560px]:p-12"
            >
              <p className="heading-h6 mb-1 font-semibold tracking-[0.3em] text-[#007070] uppercase">
                What`s
              </p>
              <h3 className="heading-h3 mb-4 text-[#0B192C] sm:mb-5">
                Slowing Enterprises down
              </h3>

              <motion.ul
                variants={listVariant}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
                className="w-full"
              >
                {problems.map((item, idx) => (
                  <motion.li
                    variants={itemVariant}
                    key={idx}
                    className="group flex min-h-[3.5rem] cursor-default items-center justify-between gap-3 border-b border-gray-300/60 py-3 last:border-0 sm:min-h-[4rem] min-[2560px]:min-h-[5.5rem] min-[2560px]:py-5"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E0EBF5] shadow-sm transition-colors duration-300 group-hover:bg-[#009A9A] min-[2560px]:h-10 min-[2560px]:w-10">
                        <ChevronRightIcon className="text-[#007070] transition-colors duration-300 group-hover:text-white" />
                      </div>
                      <span className="body-text min-w-0 break-words font-medium leading-snug text-[#1c2e4a] transition-colors duration-300 group-hover:text-[#009A9A]">
                        {item}
                      </span>
                    </div>
                    <span
                      ref={(el) => (problemRefs.current[idx] = el)}
                      className="h-2 w-2 shrink-0 rounded-full bg-[#009A9A] shadow-[0_0_8px_1px_rgba(0,154,154,0.6)]"
                    />
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-20 flex w-full"
            >
              <TiltCard className="relative flex w-full flex-col justify-center overflow-hidden rounded-[1.5rem] bg-[#040914] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] sm:p-8 min-[2560px]:p-12">
                <div className="pointer-events-none absolute inset-0 z-0">
                  <img
                    src={LucidMindHELPSImg.src || LucidMindHELPSImg}
                    alt="LucidMind HELPS Background"
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#040914]/90 via-[#040914]/70 to-[#040914]/35" />
                  <div className="absolute inset-0 bg-[#040914]/20" />
                </div>

                <div className="relative z-10 mb-4">
                  <p className="heading-h6 mb-1 font-semibold tracking-[0.3em] text-white uppercase">
                    How
                  </p>
                  <Heading
                    level={2}
                    className="heading-h2 leading-tight tracking-wide text-white"
                  >
                    <span className="bg-gradient-to-r from-[#00C4B4] to-[#00E5FF] bg-clip-text font-bold text-transparent">
                      LucidMind
                    </span>{" "}
                    HELPS
                  </Heading>
                </div>

                <motion.ul
                  variants={listVariant}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.15 }}
                  className="relative z-10 w-full"
                >
                  {solutions.map((item, idx) => (
                    <motion.li
                      variants={itemVariantRight}
                      key={idx}
                      className="group flex min-h-[4.5rem] cursor-pointer items-center gap-3 border-b border-white/10 py-3 last:border-0 sm:gap-4 md:min-h-[5rem] min-[2560px]:min-h-[6.5rem] min-[2560px]:py-5"
                    >
                      <span
                        ref={(el) => (solutionRefs.current[idx] = el)}
                        className="h-2 w-2 shrink-0 rounded-full bg-[#00E5FF] shadow-[0_0_8px_1px_rgba(0,229,255,0.7)]"
                      />

                      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#112240] shadow-[0_0_15px_rgba(0,196,180,0.1)] transition-colors duration-300 group-hover:bg-[#1a365d] md:h-10 md:w-10 min-[2560px]:h-14 min-[2560px]:w-14">
                        <div className="absolute inset-0 rounded-full bg-[#00A3FF] opacity-20 blur-md transition-opacity duration-300 group-hover:opacity-40" />
                        <div className="relative z-10">{item.icon}</div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <Heading
                          level={3}
                          className="heading-h6 md:heading-h5 break-words leading-snug text-white"
                        >
                          {item.title}
                        </Heading>
                        <p className="mt-1 break-words text-xs leading-snug text-blue-100/70 md:body-text">
                          {item.desc}
                        </p>
                      </div>

                      <div className="shrink-0 text-blue-400/40 transition-colors group-hover:text-[#00C4B4]">
                        <ChevronRightIcon />
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
