"use client";

import Image from "@/common/Image";
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { usePageReady } from "../../transitions/PageTransitionContext";
import AboutUsSecondSectionBanner from "./images/AboutUsSecondSectionBanner.webp";
import PillarBuildImg from "./images/Create capability.webp";
import PillarThinkImg from "./images/Create clarity.webp";
import PillarDeliverImg from "./images/Create impact.webp";
import ExecutiveThinkingLeftImg from "./images/executive_thinking_left.webp";
import GlobeCurvedRightImg from "./images/globe_curved_right.webp";
import HeroBgSectionUnknown from "./images/HeroBgSectionUnknown.webp";
import HeroBannerBg from "./images/NewHeroBanner.webp";
import NewHeroBannerMobile from "./images/NewHeroBanner_mobile.webp";
import Section4MountainPeak from "./images/section4_mountain_summit.webp";
import Section5FullBg from "./images/SectionFiveBg.webp";
import Section5FullBgTab from "./images/SectionFiveBgTab.webp";
import TheFounderSectionBg from "./images/TheFounderSectionBg.webp";
import TheFounderSectionBgMobile from "./images/TheFounderSectionBg_mobile.webp";
import TheFounderSectionBgTablet from "./images/TheFounderSectionBg_tablet.webp";

import Velaris from "@/components/ui/velaris";
import TealParticles from "@/components/ui/TealParticles";
import OrbitPhilosophyBg from "./images/orbit_philosophy_bg.webp";

const EarthHorizonImg = "/assets/about/earth_horizon_dawn.webp";
const FounderImg = "/assets/Ravishankar Pingali.webp";
const LucidMindTransperentLogo = "/assets/logo/LucidMind logo 2.svg";

const IconPillarBrain = ({ stroke = "#00A896" }) => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    <path d="M17.6 6.5a3 3 0 0 0 .4-1.375" />
    <path d="M6 5.125A3 3 0 0 0 6.4 6.5" />
  </svg>
);

const IconPillarBox = ({ stroke = "#2563EB" }) => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconPillarTarget = ({ stroke = "#1D4ED8" }) => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" fill={stroke} />
    <line x1="18.5" y1="5.5" x2="13.5" y2="10.5" strokeWidth="2" />
  </svg>
);

const IconCareerReinvention = () => (
  <svg
    className="w-6 h-6 sm:w-7 sm:h-7 text-[#00C4FF]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
    <path d="M4 20h16" />
  </svg>
);

const IconTwoXFounder = () => (
  <svg
    className="w-6 h-6 sm:w-7 sm:h-7 text-[#00C4FF]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const IconThreeContinents = () => (
  <svg
    className="w-6 h-6 sm:w-7 sm:h-7 text-[#00C4FF]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconLeadershipPipeline = () => (
  <svg
    className="w-6 h-6 sm:w-7 sm:h-7 text-[#00C4FF]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const IconEye = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconGear = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
);

const IconShield = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const IconLoop = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 2l4 4-4 4" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <path d="M7 22l-4-4 4-4" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

const IconZap = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconArrowRight = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function Reveal({ children, className = "", variants = fadeUp, custom = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      custom={custom}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutUs() {
  const { setReady } = usePageReady();
  const heroRef = useRef(null);
  const philosophyRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const { scrollYProgress: philosophyScroll } = useScroll({
    target: philosophyRef,
    offset: ["start end", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const velarisY = useTransform(philosophyScroll, [0, 1], [-70, 70]);

  useEffect(() => {
    setReady(true);
  }, [setReady]);

  const valuePillars = [
    {
      icon: <IconEye />,
      title: "Lucidity",
      desc: "See the invisible, clarify better decisions, build a fairer tomorrow.",
      color: "#00C4FF",
      num: "01",
    },
    {
      icon: <IconGear />,
      title: "Pragmatism",
      desc: "Focus on what can create a measurable transformation, not what is merely possible.",
      color: "#00C4FF",
      num: "02",
    },
    {
      icon: <IconShield />,
      title: "Ownership",
      desc: "Stay accountable, take initiative, act with integrity.",
      color: "#00C4FF",
      num: "03",
    },
    {
      icon: <IconLoop />,
      title: "Adaptability",
      desc: "Build organisations that can anticipate change, evolve early, not just react.",
      color: "#00C4FF",
      num: "04",
    },
    {
      icon: <IconZap />,
      title: "Impact",
      desc: "Measure progress by outcomes, not activity.",
      color: "#00C4FF",
      num: "05",
    },
  ];

  const threePillars = [
    {
      num: "01",
      numColor: "#00A896",
      numLine: "#00A896",
      iconBg: "#E6F8F5",
      iconBorder: "#A7E2D6",
      arcColor: "#00C4B4",
      ringColor: "#A7F3D0",
      bulletColor: "#00A896",
      icon: <IconPillarBrain stroke="#00A896" />,
      title: "THINK",
      desc: [
        "Understand the business",
        "Challenge assumptions",
        "Identify what matters",
        "Define the direction",
      ],
      image: PillarThinkImg,
      alt: "THINK - Strategic executive thinking",
      imgPos: "object-[55%_35%]",
    },
    {
      num: "02",
      numColor: "#2563EB",
      numLine: "#2563EB",
      iconBg: "#EFF6FF",
      iconBorder: "#BFDBFE",
      arcColor: "#2563EB",
      ringColor: "#BFDBFE",
      bulletColor: "#2563EB",
      icon: <IconPillarBox stroke="#2563EB" />,
      title: "BUILD",
      desc: [
        "Translate strategy",
        "Design operating models",
        "Build technology capabilities",
        "Align leadership",
        "Enable scalable ways of working",
      ],
      image: PillarBuildImg,
      alt: "BUILD - Technology capability building",
      imgPos: "object-[52%_40%]",
    },
    {
      num: "03",
      numColor: "#1D4ED8",
      numLine: "#1D4ED8",
      iconBg: "#EFF6FF",
      iconBorder: "#BFDBFE",
      arcColor: "#1D4ED8",
      ringColor: "#BFDBFE",
      bulletColor: "#1D4ED8",
      icon: <IconPillarTarget stroke="#1D4ED8" />,
      title: "DELIVER",
      desc: [
        "Turn ideas into action",
        "Drive adoption",
        "Enable execution",
        "Measure business impact",
        "Deliver tangible outcomes",
      ],
      image: PillarDeliverImg,
      alt: "DELIVER - Tangible business outcomes",
      imgPos: "object-[82%_42%]",
    },
  ];

  return (
    <main className="relative w-full bg-[#040814] text-slate-100 overflow-x-hidden font-playfair">
      <section
        ref={heroRef}
        className="relative w-full min-h-[85vh] sm:min-h-[90vh] xl:min-h-screen flex items-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
            <div
              className="absolute inset-0 hidden xl:block"
              style={{
                backgroundImage: `url(${HeroBannerBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div
              className="absolute inset-0 hidden md:block xl:hidden"
              style={{
                backgroundImage: `url(${HeroBannerBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div
              className="absolute inset-0 block md:hidden"
              style={{
                backgroundImage: `url(${NewHeroBannerMobile})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                backgroundRepeat: "no-repeat",
              }}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#040814]/90 via-[#040814]/40 xl:via-[#040814]/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040814] via-transparent to-[#040814]/40" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 w-full flex items-center justify-between px-5 sm:px-10 md:px-14 xl:px-20 py-24 sm:py-28 xl:py-32 min-h-[85vh] sm:min-h-[90vh] xl:min-h-screen"
        >
          <div className="xl:max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="heading-h1 font-bold tracking-tight text-white leading-[1.12] xl:leading-[1.08]"
            >
              Born from experience.
              <br />
              Built for what{" "}
              <span
                className="text-[#00C4B4]"
                style={{ textShadow: "0 0 40px rgba(0,196,180,0.5)" }}
              >
                comes next.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="body-text text-slate-400 font-medium max-w-xs sm:max-w-md md:max-w-lg mt-5"
            >
              LucidMind is built on a simple belief
              <br />
              better outcomes begin with better thinking.
            </motion.p>
          </div>
        </motion.div>
      </section>





      <section className="relative w-full bg-[#F1F6FB] overflow-hidden flex items-center py-12 sm:py-14 md:py-16 min-h-[220px] sm:min-h-[250px]">
        <div className="hidden xl:block absolute top-0 bottom-0 left-0 w-[30%] pointer-events-none overflow-hidden z-0">
          <Image
            src={Section4MountainPeak}
            alt="Transformation journey mountain peak"
            fill
            priority
            className="object-cover object-left"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent 30%, #F1F6FB 95%" />
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-36 sm:w-48 lg:w-64 pointer-events-none opacity-30 overflow-hidden z-0">
          <svg
            viewBox="0 0 200 200"
            fill="none"
            className="w-full h-full object-cover"
          >
            <path
              d="M40 200C110 140 150 70 200 -20"
              stroke="#D4AF37"
              strokeWidth="22"
              strokeLinecap="round"
              opacity="0.3"
            />
            <path
              d="M70 200C130 150 165 80 200 10"
              stroke="#E6CA65"
              strokeWidth="12"
              strokeLinecap="round"
              opacity="0.25"
            />
          </svg>
        </div>

        <div className="relative z-10 w-full max-w-[1680px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 lg:gap-12">
          <div className="hidden xl:block w-[24%] shrink-0" />

          <div className="w-full md:w-[40%] xl:w-[35%] shrink-0">
            <Reveal variants={fadeUp}>
              <h2 className="heading-h4 sm:heading-h3 lg:heading-h2 text-[#0B2545] leading-[1.22] tracking-tight">
                The hardest part of
                <br />
                transformation is rarely
                <br />
                the technology.
              </h2>
            </Reveal>
          </div>

          <div className="w-full md:w-[50%] xl:w-[38%]">
            <Reveal variants={fadeUp}>
              <p className="body-text text-[#3B4E68] leading-[1.7] font-normal">
                It is creating clarity around the problem, aligning people
                around the opportunity, building the capability to execute and
                maintaining the discipline to turn ideas into outcomes.
              </p>
              <p className="body-text mt-3 font-bold text-[#0B2545] leading-[1.7]">
                And that is where LucidMind begins.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative w-full bg-[#011424] py-10 sm:py-12 md:py-14 xl:py-16 overflow-hidden flex items-center min-h-[420px] sm:min-h-[460px] lg:min-h-[520px] xl:min-h-[560px]">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src={Section5FullBgTab}
            alt="The LucidMind Difference background"
            fill
            priority
            className="hidden lg:block xl:hidden object-cover object-center"
          />

          <Image
            src={Section5FullBg}
            alt="The LucidMind Difference background"
            fill
            priority
            className="hidden xl:block object-cover object-right"
          />
          <div className="absolute inset-0 bg-[#011424] lg:hidden" />
          <div className="absolute inset-0 hidden lg:block xl:hidden bg-gradient-to-r from-[#011424]/95 via-[#011424]/70 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[1680px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 xl:gap-6">
          <div className="w-full lg:w-[50%] xl:w-[47%] shrink-0">
            <Reveal variants={fadeLeft}>
              <span className="heading-h6 font-bold tracking-[0.24em] uppercase text-[#00C4FF] mb-2 sm:mb-2.5 block">
                The LucidMind difference
              </span>
              <h2 className="heading-h3 md:heading-h2 text-white leading-[1.14] tracking-tight mb-3 sm:mb-3.5">
                We don&apos;t start with technology.
                <br className="hidden md:block" />
                We{"  "}
                <span className="text-[#00C4FF]">
                  start <br className="md:hidden" /> with the question.
                </span>
              </h2>
              
              <div className="flex items-center gap-2.5 mb-3.5 mt-2">
                <span className="w-2 h-2 rounded-full bg-[#00C4FF] animate-pulse shadow-[0_0_10px_#00C4FF] hidden lg:block" />
                <h3 className="heading-h5 md:heading-h4 uppercase text-[#00C4FF]">
                  The strategic imperatives
                </h3>
              </div>
              <div className="grid space-y-2.5 sm:space-y-3 mb-4">
                {[
                  "Where can technology create meaningful advantage?",
                  "What capabilities does the organisation need to build?",
                  "What should be automated, augmented or fundamentally redesigned?",
                  "How do we move from experimentation to enterprise value?",
                ].map((q, i) => (
                  <div
                    key={i}
                    className="group relative flex items-center gap-3 sm:gap-3.5 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-transparent border border-white/10 hover:border-[#00C4FF]/50 hover:from-[#00C4FF]/10 hover:via-white/[0.06] hover:translate-x-1.5 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#00C4FF]/15 border border-[#00C4FF]/30 text-[#00C4FF] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(0,196,255,0.25)] group-hover:bg-[#00C4FF] group-hover:text-[#011424] transition-all duration-300">
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </div>
                    <span className="body-text font-medium text-slate-100 leading-snug group-hover:text-white transition-colors">
                      {q}
                    </span>
                  </div>
                ))}
              </div>
              
            </Reveal>
          </div>

          <div className="hidden lg:block w-[50%] xl:w-[53%] shrink-0 pointer-events-none" />
        </div>
      </section>

      <section className="relative w-full py-10  md:py-10 overflow-hidden select-none bg-[#FAFCFE]">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src={HeroBgSectionUnknown}
            alt="Three pillars background"
            fill
            priority
            className="object-cover object-center w-full h-full"
          />
        </div>

        <div className="relative z-10 w-full max-w-[1680px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 mx-auto ">
          <Reveal
            variants={fadeUp}
            className="text-center max-w-5xl mx-auto mb-12 sm:mb-16 xl:mb-20"
          >
            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
              <span className="w-8 sm:w-12 h-[1px] bg-slate-400/50" />
              <span className="heading-h6 font-bold tracking-[0.24em] text-slate-500 uppercase">
                OUR APPROACH
              </span>
              <span className="w-8 sm:w-12 h-[1px] bg-slate-400/50" />
            </div>
            <h2 className="heading-h3 md:heading-h2 text-[#0B182F] tracking-tight leading-[1.2]">
              This allows us to connect three things
              <br />
              that are often{" "}
              <span className="text-[#007DFE]">addressed separately</span>
            </h2>
          </Reveal>

          <div className="absolute top-10 right-10 w-28 h-24 pointer-events-none opacity-30 [background-image:radial-gradient(#94A3B8_1.5px,transparent_1.5px)] [background-size:12px_12px] hidden sm:block" />
          <div className="absolute bottom-10 left-10 w-28 h-24 pointer-events-none opacity-30 [background-image:radial-gradient(#94A3B8_1.5px,transparent_1.5px)] [background-size:12px_12px] hidden sm:block" />

          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center max-w-[1140px] xl:max-w-[1240px] 2xl:max-w-[1440px] mx-auto w-full gap-10 lg:gap-0 px-4 sm:px-6">
            {threePillars.map((step, i) => (
              <React.Fragment key={step.title}>
                <Reveal
                  variants={scaleIn}
                  custom={i}
                  className="relative flex flex-col items-start shrink-0 w-full max-w-[280px] sm:max-w-[290px] lg:w-[210px] xl:w-[250px] 2xl:w-[276px] overflow-visible"
                >
                  <div className="absolute left-[64px] sm:left-[70px] lg:left-[64px] xl:left-[76px] 2xl:left-[82px] top-0 shrink-0 z-10">
                    <svg
                      className="absolute -inset-2.5 sm:-inset-3 w-[calc(100%+20px)] sm:w-[calc(100%+24px)] h-[calc(100%+20px)] sm:h-[calc(100%+24px)] pointer-events-none z-10"
                      viewBox="0 0 100 100"
                      fill="none"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="46"
                        stroke={step.ringColor}
                        strokeWidth="1.5"
                        strokeOpacity="0.5"
                      />
                      <path
                        d="M 27 10 A 46 46 0 0 1 90 73"
                        stroke={step.arcColor}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="relative w-36 h-36 sm:w-40 sm:h-40 lg:w-[140px] lg:h-[140px] xl:w-[170px] xl:h-[170px] 2xl:w-[190px] 2xl:h-[190px] rounded-full overflow-hidden border-[3.5px] border-white shadow-[0_10px_28px_rgba(0,0,0,0.08)] bg-white">
                      <Image
                        src={step.image}
                        alt={step.alt}
                        fill
                        priority
                        className={`object-cover w-full h-full ${step.imgPos || "object-center"}`}
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/90 via-white/20 to-transparent pointer-events-none z-[1]" />
                    </div>
                  </div>

                  <div className="hidden lg:block absolute left-6 w-[55px] xl:w-[70px] top-[70px] sm:top-[78px] lg:top-[70px] xl:top-[85px] 2xl:top-[95px] h-[1.5px] bg-[#93C5FD]/70 z-0 pointer-events-none" />

                  <div className="relative z-20 flex flex-col items-start w-full text-left">
                    <div className="flex flex-col items-center shrink-0 w-12 sm:w-14">
                      <span
                        className="heading-h1 leading-none tracking-tight block text-center flex items-center justify-center"
                        style={{ color: step.numColor }}
                      >
                        {step.num}
                      </span>

                      <div
                        className="w-8 sm:w-9 h-[2.5px] rounded-full mt-2 mb-2.5"
                        style={{ backgroundColor: step.numLine }}
                      />

                      <div
                        className="w-11 h-11 sm:w-12 sm:h-12 xl:w-13 xl:h-13 rounded-full border flex items-center justify-center shadow-xs transition-transform duration-300 hover:scale-105 bg-white relative z-10"
                        style={{
                          backgroundColor: step.iconBg,
                          borderColor: step.iconBorder,
                        }}
                      >
                        {step.icon}
                      </div>
                    </div>

                    <h3 className="heading-h5 md:heading-h4 tracking-wider text-[#06142F] leading-none mt-3.5 sm:mt-4 mb-1.5 uppercase">
                      {step.title}
                    </h3>

                    <div
                      className="w-8 sm:w-9 h-[2.5px] rounded-full mb-3 sm:mb-3.5"
                      style={{ backgroundColor: step.numLine }}
                    />

                    <ul className="space-y-2 sm:space-y-2.5 text-[12px] sm:text-[13px] xl:text-[13.5px] text-[#334155] font-inter font-normal leading-snug">
                      {step.desc.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2.5 whitespace-nowrap"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: step.bulletColor }}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                {i < 2 && (
                  <>
                    <div className="hidden lg:flex items-center justify-center relative shrink-0 flex-1 min-w-[50px] max-w-[120px] xl:max-w-[150px] self-start mt-[70px] sm:mt-[78px] lg:mt-[70px] xl:mt-[85px] 2xl:mt-[95px]">
                      <div className="w-full h-[1.5px] bg-[#93C5FD]/70" />
                      <div className="absolute w-7 h-7 xl:w-8 xl:h-8 rounded-full border border-[#93C5FD] bg-white shadow-xs flex items-center justify-center text-[#2563EB]">
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex lg:hidden items-center justify-center relative py-2 my-2">
                      <div className="w-[1.5px] h-8 bg-[#93C5FD]/70" />
                      <div className="absolute w-7 h-7 rounded-full border border-[#93C5FD] bg-white shadow-xs flex items-center justify-center text-[#2563EB]">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </>
                )}
              </React.Fragment>
            ))}
          </div>

          <Reveal
            variants={fadeUp}
            custom={3}
            className="mt-14 sm:mt-18 lg:mt-20 text-center max-w-3xl mx-auto px-4"
          >
            <p className="body-text font-semibold text-[#1E293B] leading-relaxed">
              Because strategy without execution remains an idea. And technology
              without direction remains a tool.
            </p>
            <p className="heading-h4 mt-2 font-black text-[#007DFE] tracking-tight">
              LucidMind works at the intersection.
            </p>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#00C4FF] to-[#007DFE] rounded-full mx-auto mt-3.5" />
          </Reveal>
        </div>
      </section>



      <section
        ref={philosophyRef}
        className="relative w-full bg-[#010B1E] py-8 sm:py-10 lg:py-12 px-4 sm:px-6 md:px-8 xl:px-12 overflow-hidden select-none"
      >
        <div className="absolute inset-0 pointer-events-none z-0">
          <Image
            src={OrbitPhilosophyBg}
            alt=""
            fill
            priority
            className="object-cover object-center opacity-95"
          />
          <div className="absolute inset-0 bg-[#010B1E]/25 pointer-events-none" />
        </div>

        <TealParticles className="z-[1] opacity-25" count={25} />

        <div className="max-w-6xl mx-auto relative z-10">
          <Reveal
            variants={fadeUp}
            className="text-center max-w-5xl mx-auto mb-5 sm:mb-6"
          >
            <h2 className="heading-h3 md:heading-h2 tracking-tight text-white mb-2">
              What <span className="text-[#00C4FF]">LucidMind</span> stands for
            </h2>
            <div className="w-10 h-0.5 bg-[#00C4FF] rounded-full mx-auto shadow-[0_0_10px_#00c4ff]" />
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-3.5 xl:gap-4">
            {valuePillars.map((pillar, i) => (
              <Reveal key={pillar.num} variants={scaleIn} custom={i}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="group flex flex-row sm:flex-col items-start gap-3 sm:gap-0 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#030d22]/60 backdrop-blur-xl border border-cyan-500/25 hover:border-cyan-400/70 hover:bg-[#030d22]/80 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_20px_rgba(0,196,255,0.25)] h-full"
                >
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-[#010714] border border-cyan-500/35 text-[#00C4FF] flex items-center justify-center sm:mb-2.5 shadow-[inset_0_0_10px_rgba(0,196,255,0.2)] filter drop-shadow-[0_0_6px_rgba(0,196,255,0.5)] group-hover:scale-105 group-hover:border-[#00C4FF] transition-all">
                    {pillar.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="heading-h6 md:heading-h5 text-white mb-1 tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="body-text-sm text-slate-300/85 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          <div className="my-6 sm:my-8 lg:my-10" />

          <Reveal
            variants={fadeUp}
            className="text-center max-w-5xl mx-auto my-20"
          >
            <h2 className="heading-h3 md:heading-h2 tracking-tight text-white font-['Playfair_Display',serif] drop-shadow-[0_2px_14px_rgba(0,196,255,0.5)]">
              The Philosophy Behind{" "}
              <span className="text-[#00C4FF] bg-gradient-to-r from-[#00C4FF] via-[#38BDF8] to-[#60A5FA] bg-clip-text text-transparent">
                Our Mark
              </span>
            </h2>
            <div className="w-12 h-0.5 bg-[#00C4FF] rounded-full mx-auto my-2.5 shadow-[0_0_10px_#00c4ff]" />
            <p className="body-text text-slate-300/90 font-medium max-w-xl mx-auto">
              Our logo is a visual manifesto of the values we bring to every
              partnership.
            </p>
          </Reveal>

          <div className="relative">
            <div className="flex flex-col lg:flex-row items-center justify-center max-w-5xl mx-auto relative px-2 sm:px-4 lg:px-0 gap-20">
              <div className="relative shrink-0 flex items-center justify-center mb-4 lg:mb-0">
                <div className="absolute -inset-10 sm:-inset-12 rounded-full bg-[radial-gradient(circle,_rgba(0,196,255,0.35)_0%,_rgba(0,120,255,0.12)_50%,_transparent_70%)] blur-2xl pointer-events-none" />
                <div className="absolute -inset-4 sm:-inset-6 rounded-full border border-cyan-400/25 pointer-events-none transform -rotate-6 scale-x-105" />
                <div className="relative w-60 h-60 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full border-2 border-cyan-400/80 bg-[#020b1c]/80 backdrop-blur-xl shadow-[0_0_35px_rgba(0,196,255,0.5),inset_0_0_25px_rgba(0,196,255,0.2)] flex flex-col items-center justify-center p-6 text-center group transition-all duration-300">
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative z-10 flex items-center justify-center w-full"
                  >
                    <img
                      src={LucidMindTransperentLogo}
                      alt="LucidMind Logo"
                      className="w-60 h-auto object-contain filter drop-shadow-[0_0_20px_rgba(0,196,255,0.7)]"
                    />
                  </motion.div>
                </div>
              </div>

              <div className="relative shrink-0 w-full max-w-md lg:max-w-none lg:w-[480px] xl:w-[500px] flex flex-col gap-3 sm:gap-[15px] z-10 px-2 sm:px-0">
                <Reveal variants={fadeRight}>
                  <motion.div
                    whileHover={{ x: 4, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className="group flex items-center gap-3.5 sm:gap-4 p-3 sm:p-3.5 min-h-[80px] lg:h-[86px] rounded-xl sm:rounded-2xl bg-[#030d22]/65 backdrop-blur-xl border border-cyan-500/25 hover:border-cyan-400/80 hover:bg-[#030d22]/85 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(0,196,255,0.3)]"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-[#010714] border border-cyan-500/40 flex items-center justify-center p-2 shadow-[inset_0_0_12px_rgba(0,196,255,0.15)] group-hover:scale-105 group-hover:border-cyan-400 transition-all">
                      <img
                        src="/assets/logo/open-circle.webp"
                        alt="Open Circle"
                        className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,196,255,0.7)]"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="heading-h6 md:heading-h5 text-white">
                          Open Circle
                        </h3>
                        <span className="heading-h6 md:heading-h5 text-white">
                          Continuous Learning
                        </span>
                      </div>
                      <p className="body-text-sm text-slate-300/90 leading-snug lg:line-clamp-2 font-normal">
                        We approach every challenge with a holistic perspective,
                        remaining endlessly open to new possibilities and the
                        clarity that comes from continuous learning.
                      </p>
                    </div>
                  </motion.div>
                </Reveal>

                <Reveal variants={fadeRight} custom={1}>
                  <motion.div
                    whileHover={{ x: 4, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className="group flex items-center gap-3.5 sm:gap-4 p-3 sm:p-3.5 min-h-[80px] lg:h-[86px] rounded-xl sm:rounded-2xl bg-[#030d22]/65 backdrop-blur-xl border border-cyan-500/25 hover:border-cyan-400/80 hover:bg-[#030d22]/85 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(0,196,255,0.3)]"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-[#010714] border border-cyan-500/40 flex items-center justify-center p-2 shadow-[inset_0_0_12px_rgba(0,196,255,0.15)] group-hover:scale-105 group-hover:border-cyan-400 transition-all">
                      <img
                        src="/assets/logo/hidden-lm.webp"
                        alt="Hidden LM"
                        className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,196,255,0.7)]"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="heading-h6 md:heading-h5 text-white">
                          Hidden LM
                        </h3>
                        <span className="heading-h6 md:heading-h5 text-white">
                          Core Clarity
                        </span>
                      </div>
                      <p className="body-text-sm text-slate-300/90 leading-snug lg:line-clamp-2 font-normal">
                        LucidMind sits at the center of the work we do. We cut
                        through complexity to shape better outcomes and bring
                        absolute clarity to your toughest business questions.
                      </p>
                    </div>
                  </motion.div>
                </Reveal>

                <Reveal variants={fadeRight} custom={2}>
                  <motion.div
                    whileHover={{ x: 4, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className="group flex items-center gap-3.5 sm:gap-4 p-3 sm:p-3.5 min-h-[80px] lg:h-[86px] rounded-xl sm:rounded-2xl bg-[#030d22]/65 backdrop-blur-xl border border-cyan-500/25 hover:border-cyan-400/80 hover:bg-[#030d22]/85 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(0,196,255,0.3)]"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-[#010714] border border-cyan-500/40 flex items-center justify-center p-2 shadow-[inset_0_0_12px_rgba(0,196,255,0.15)] group-hover:scale-105 group-hover:border-cyan-400 transition-all">
                      <img
                        src="/assets/logo/upward-path.webp"
                        alt="Upward Path"
                        className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,196,255,0.7)]"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="heading-h6 md:heading-h5 text-white">
                          Upward Path
                        </h3>
                        <span className="heading-h6 md:heading-h5 text-white">
                          Measurable Impact
                        </span>
                      </div>
                      <p className="body-text-sm text-slate-300/90 leading-snug lg:line-clamp-2 font-normal">
                        We are built for progress. Our commitment is to take you
                        on a journey from strategic insight to tangible, lasting
                        enterprise impact.
                      </p>
                    </div>
                  </motion.div>
                </Reveal>
              </div>
            </div>
          </div>

          <Reveal variants={fadeUp} custom={1}>
            <div className="mt-6 sm:mt-8 lg:mt-10 text-center w-full max-w-xl mx-auto p-3 sm:p-3.5 rounded-xl bg-[#030d22]/70 backdrop-blur-xl border border-cyan-500/25 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <p className="body-text font-medium text-slate-200 leading-relaxed px-2">
                We help leaders move from clarity to capability, and from
                strategy to lasting impact.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative w-full bg-[#030A16] py-12 sm:py-16 md:py-20 xl:py-28 px-4 sm:px-8 md:px-10 xl:px-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none -z-10">
          <Image
            src={TheFounderSectionBg}
            alt=""
            fill
            priority
            className="hidden xl:block object-cover object-center opacity-90"
          />
          <Image
            src={TheFounderSectionBgTablet}
            alt=""
            fill
            priority
            className="hidden md:block xl:hidden object-cover object-center opacity-90"
          />
          <Image
            src={TheFounderSectionBgMobile}
            alt=""
            fill
            priority
            className="block md:hidden object-cover object-top opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030A16]/50 via-transparent to-[#030A16]/75" />
        </div>

        <div className="max-w-[1680px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 mx-auto relative z-10 flex flex-col gap-8 sm:gap-10 items-center xl:gap-14">
          <Reveal variants={fadeUp}>
            <div className="flex flex-col lg:flex-row items-center  gap-8 sm:gap-10 xl:gap-14">
              <Reveal
                variants={fadeLeft}
                className="w-full sm:w-[260px] md:w-[280px] xl:w-[330px] shrink-0 flex flex-col items-center"
              >
                <div className="relative w-full max-w-[220px] sm:max-w-[260px] md:max-w-[280px] xl:max-w-[380px]">
                  <div className="absolute -inset-2 rounded-3xl bg-[#061e38]/50 border border-[#00C4FF]/20 -z-10 translate-x-1.5 translate-y-1.5 pointer-events-none" />
                  <div className="relative w-full aspect-[4/6] rounded-2xl overflow-hidden border-2 border-[#00C4FF] shadow-[0_0_30px_rgba(0,196,255,0.35)] bg-[#040E1E]">
                    <Image
                      src={FounderImg}
                      alt="Ravishankar Pingali"
                      fill
                      className="object-cover object-top w-full h-full"
                    />
                  </div>
                </div>
                <div className="mt-4 sm:mt-5 w-full flex justify-center">
                  <a
                    href="https://www.linkedin.com/in/ravipingali/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Connect with Ravishankar Pingali on LinkedIn"
                    className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#051C33]/90 hover:bg-[#00C4FF] text-white hover:text-[#040E1E] border border-[#00C4FF]/70 shadow-[0_0_15px_rgba(0,196,255,0.25)] hover:shadow-[0_0_25px_rgba(0,196,255,0.6)] font-semibold body-text transition-all duration-300 group"
                  >
                    <div className="w-5 h-5 rounded bg-[#0077B5] flex items-center justify-center text-white shrink-0">
                      <LinkedInIcon />
                    </div>
                    <span>Ravishankar Pingali</span>
                    <IconArrowRight />
                  </a>
                </div>
              </Reveal>

              <Reveal variants={fadeRight} className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="heading-h6 font-bold tracking-[0.25em] uppercase text-[#00C4FF]">
                    THE FOUNDER
                  </span>
                  <span className="w-8 sm:w-12 h-[1.5px] bg-[#00C4FF]/60" />
                </div>
                <h2 className="heading-h3 md:heading-h2 mt-1.5 sm:mt-2 text-white tracking-tight">
                  Ravishankar Pingali
                </h2>
                <h3 className="heading-h5 md:heading-h3 text-[#00C4FF] mt-1.5 sm:mt-2">
                  GCC & Transformation Leader | Advisor | Independent Director
                </h3>
                <p className="body-text text-slate-200 mt-1.5 sm:mt-2 font-normal leading-relaxed">
                  Adaptability, practised before it was advised.
                </p>
                <div className="body-text-sm   space-y-3 sm:space-y-3.5 text-slate-300 leading-relaxed mt-4 sm:mt-5">
                  <p>
                    Ravishankar’s career has seen a series of purposeful
                    reinventions as a result of both technological and business
                    model evolutions. Starting off as a software engineer and
                    technical lead, he quickly rose to the position of chief
                    architect and programme manager on large-scale
                    transformation programmes for insurers in the US and Canada.
                  </p>
                  <p>
                    He went on to lead major financial services accounts across
                    North America and the UK, where close partnership with
                    demanding clients became one of his defining strengths.
                  </p>
                  <p>
                    In <span className="font-bold">2014</span>, he took the
                    plunge and started up his first entrepreneurial venture as a
                    co-founder in a technology start-up.
                  </p>
                  <p>
                    He later joined Würth IT India as part of their digital
                    transformation efforts, eventually rising to COO, Managing
                    Director & CEO, as well as a member of its Board.
                  </p>
                  <p>
                    There, he was able to convince global leadership to let the
                    India unit own end-to-end product lifecycle management,
                    invested early on in low-code and built competencies in AI
                    and emerging technologies. He also realised, first hand,
                    that building technology is not the same as transforming
                    work practices.
                  </p>
                  <p>
                    Earlier this year, he took an intentional pause to reflect
                    and refocus. He spoke with industry leaders and founders and
                    took part in industry events, gaining a first-hand view of
                    what AI was disrupting, and what it wasn't.
                  </p>
                  <p>
                    He also qualified as an Independent Director and is
                    currently pursuing IICA's ESG Impact Leader programme. All
                    of this led to the founding of LucidMind in{" "}
                    <span className="font-bold">June 2026</span>, his second
                    entrepreneurial venture with a purpose.
                  </p>
                </div>
              </Reveal>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3.5 xl:gap-5">
            {[
              {
                icon: <IconCareerReinvention />,
                stat: "Engineer → MD & CEO",
                statClass: "text-[#00C4FF]",
                label: "A career of deliberate reinvention",
              },
              {
                icon: <IconTwoXFounder />,
                stat: "2× Founder ",
                statClass: "text-white",
                label: "Calculated risks, taken twice",
              },
              {
                icon: <IconThreeContinents />,
                stat: "3 Continents ",
                statClass: "text-[#00C4FF]",
                label:
                  "Client leadership across North America, Europe and APAC",
              },
              {
                icon: <IconLeadershipPipeline />,
                stat: "30%",
                statClass: "text-white",
                label: "Leadership pipeline strengthened",
              },
            ].map((m, i) => (
              <Reveal key={i} variants={scaleIn} custom={i}>
                <div className="h-full rounded-2xl bg-[#06182D]/70 backdrop-blur-md border border-[#00C4FF]/30 p-3.5 sm:p-4 md:p-5 xl:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-[#00C4FF]/70 hover:shadow-[0_0_25px_rgba(0,196,255,0.25)] transition-all duration-300 flex flex-col justify-between">
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-13 sm:h-13 xl:w-14 xl:h-14 mx-auto rounded-full bg-[#05172A] border border-[#00C4FF]/60 shadow-[0_0_18px_rgba(0,196,255,0.45)] flex items-center justify-center mb-2.5 md:mb-3.5 text-[#00C4FF]">
                      {m.icon}
                    </div>
                    <h4
                      className={`heading-h4 leading-tight tracking-tight ${m.statClass}`}
                    >
                      {m.stat}
                    </h4>
                  </div>
                  <p className="body-text text-slate-300 leading-snug text-center">
                    {m.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal variants={fadeUp} custom={1}>
            <div className="relative rounded-3xl border border-[#00C4FF]/40 bg-[#041122]/80 backdrop-blur-md p-5 sm:p-7 md:p-9 xl:p-12 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute right-0 bottom-0 top-0 w-full lg:w-3/5">
                  <Image
                    src={TheFounderSectionBg}
                    alt=""
                    fill
                    className="hidden xl:block object-cover object-bottom-right opacity-85"
                  />
                  <Image
                    src={TheFounderSectionBgTablet}
                    alt=""
                    fill
                    className="hidden md:block xl:hidden object-cover object-bottom-right opacity-85"
                  />
                  <Image
                    src={TheFounderSectionBgMobile}
                    alt=""
                    fill
                    className="block md:hidden object-cover object-bottom opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#041122] via-[#041122]/70 to-transparent" />
                </div>
              </div>

              <div className="relative z-10 max-w-3xl">
                <h3 className="heading-h4 sm:heading-h3 text-white tracking-tight">
                  The future belongs to adaptive organisations.
                </h3>
                <p className="body-text mt-3 sm:mt-4 text-slate-300 leading-relaxed">
                  The organisations that thrive in the years ahead will not
                  necessarily be those that adopt every new technology first.
                </p>
                <p className="body-text mt-2 text-slate-300 leading-relaxed">
                  They will be the ones that can{" "}
                  <strong className="text-white font-bold">
                    understand change, make better decisions, build the right
                    capabilities and execute with consistency
                  </strong>
                  .
                </p>
                <p className="body-text mt-2 text-slate-300 leading-relaxed">
                  LucidMind exists to help them do exactly that.
                </p>
              </div>

              <div className="relative z-10 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#00C4FF]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5">
                <p className="body-text font-bold text-[#00C4FF]">
                  THINK clearly. BUILD capability. DELIVER impact.
                </p>
                
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
