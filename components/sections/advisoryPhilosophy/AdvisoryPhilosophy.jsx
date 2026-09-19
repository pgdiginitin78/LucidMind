"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import AdvisoryPhilosophyBanner from "./images/AdvisoryPhilosophyBanner.webp";
import HighlightCard from "../../ui/highlight-card";

function LightbulbIcon() {
  return (
    <svg
      className="w-8 h-8 sm:w-9 sm:h-9 text-[#1B64F2]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M9 18c-2.76-1.5-4-4-4-6.5a7 7 0 1 1 14 0c0 2.5-1.24 5-4 6.5v0z" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg
      className="w-8 h-8 sm:w-9 sm:h-9 text-[#00C4B4]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.0}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg
      className="w-8 h-8 sm:w-9 sm:h-9 text-[#7C3AED]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="4.5 16.5 9 12 13.5 16.5 20.5 8" />
      <polyline points="15 8 20.5 8 20.5 13.5" />
    </svg>
  );
}

const philosophies = [
  {
    theme: "blue",
    title: "Strategy for Better Decisions",
    description: [
      "Helping leadership teams make",
      "informed, future-ready decisions.",
    ],
    icon: <LightbulbIcon />,
  },
  {
    theme: "teal",
    title: "Execution for Stronger Organisations",
    description: [
      "Building the capabilities, leadership,",
      "and operating models required to",
      "execute with confidence.",
    ],
    icon: <GearIcon />,
  },
  {
    theme: "purple",
    title: "Outcomes for Measurable Impact",
    description: [
      "Driving sustainable growth through",
      "responsible transformation and",
      "tangible business results.",
    ],
    icon: <TrendingUpIcon />,
  },
];

export default function AdvisoryPhilosophy() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f8fafc] py-10  md:py-14">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={AdvisoryPhilosophyBanner}
          alt="Advisory Philosophy Banner"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 md:mb-14 gap-5"
        >
          <div>
            <div className="w-12 h-1 bg-[#1D4ED8] rounded-full mb-3" />
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0B1528] tracking-tight leading-tight">
              Our Advisory <span className="text-[#2563EB]">Philosophy</span>
            </h2>
            <p className="text-[#526484] text-base sm:text-lg font-normal mt-1.5">
              From Strategy to Execution. From Execution to Impact.
            </p>
          </div>

          <div className="flex items-center gap-3.5 pb-1 self-start sm:self-auto">
            <div className="w-[1.5px] h-10 bg-blue-300/70" />
            <div className="text-[11px] font-bold tracking-[0.22em] text-[#8392A5] uppercase leading-[1.35] flex flex-col items-start select-none">
              <span>IDEAS</span>
              <span>PEOPLE</span>
              <span>REAL IMPACT</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8 items-stretch 2xl:px-8">
          {philosophies.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: "easeOut" }}
              className="h-full flex"
            >
              <HighlightCard
                theme={item.theme}
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
