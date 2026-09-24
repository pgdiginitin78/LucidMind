"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import Lenis from "lenis";
import Image from "@/common/Image";
import { Link } from "@/lib/navigation";
import React, { useEffect, useRef, useState } from "react";
import { usePageReady } from "../../transitions/PageTransitionContext";
import ExecutiveThinkingLeftImg from "./images/executive_thinking_left.webp";
import GlobeCurvedRightImg from "./images/globe_curved_right.webp";
import HeroBannerBg from "./images/NewHeroBanner.png";
import NewHeroBannerMobile from "./images/NewHeroBanner_mobile.webp";
import NewHeroBannerTablet from "./images/NewHeroBanner_tablet.webp";
import Section4MountainPeak from "./images/section4_mountain_summit.webp";
import Section5FullBg from "./images/SectionFiveBg.webp";
import TheFounderSectionBg from "./images/TheFounderSectionBg.webp";
import TheFounderSectionBgMobile from "./images/TheFounderSectionBg_mobile.webp";
import TheFounderSectionBgTablet from "./images/TheFounderSectionBg_tablet.webp";
import PillarBuildImg from "./images/Create capability.png";
import PillarDeliverImg from "./images/Create impact.png";
import PillarThinkImg from "./images/Create clarity.png";
import HeroBgSectionUnknown from "./images/HeroBgSectionUnknown.webp";
import AboutUsSecondSectionBanner from "./images/AboutUsSecondSectionBanner.webp";

const EarthHorizonImg = "/assets/about/earth_horizon_dawn.webp";
const FounderImg = "/assets/Ravishankar Pingali.webp";

const IconPillarBrain = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#0B182F"
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

const IconPillarBox = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#0B182F"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconPillarTarget = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#0B182F"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" fill="#0B182F" />
    <line x1="18.5" y1="5.5" x2="13.5" y2="10.5" strokeWidth="2" />
  </svg>
);

const IconFounderUser = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00C4FF"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconFounderGrowthBars = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00C4FF"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="14" width="4" height="7" rx="1.5" />
    <rect x="10" y="8" width="4" height="13" rx="1.5" />
    <rect x="17" y="3" width="4" height="18" rx="1.5" />
  </svg>
);

const IconFounderGlobe = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00C4FF"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M4.5 7h15" />
    <path d="M4.5 17h15" />
  </svg>
);

const IconFounderMicrochip = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00C4FF"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="5" width="14" height="14" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="5" />
    <line x1="15" y1="1" x2="15" y2="5" />
    <line x1="9" y1="19" x2="9" y2="23" />
    <line x1="15" y1="19" x2="15" y2="23" />
    <line x1="1" y1="9" x2="5" y2="9" />
    <line x1="1" y1="15" x2="5" y2="15" />
    <line x1="19" y1="9" x2="23" y2="9" />
    <line x1="19" y1="15" x2="23" y2="15" />
  </svg>
);

const IconFounderBullseye = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00C4FF"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <line x1="19" y1="5" x2="13.4" y2="10.6" strokeWidth="2.2" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const IconRefresh = ({ className = "text-[#2563EB]" }) => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 12a8 8 0 1 0 8-8 8 8 0 0 0-5.7 2.4L3 9" />
    <path d="M3 4v5h5" />
  </svg>
);

const IconLightbulb = ({ className = "text-[#2563EB]" }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A6 6 0 1 0 7.5 11.5c.76.76 1.23 1.52 1.41 2.5h6.18z" />
  </svg>
);

const IconCrosshair = ({ className = "text-[#2563EB]" }) => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11.5" cy="12.5" r="8.5" />
    <circle cx="11.5" cy="12.5" r="4.5" />
    <circle cx="11.5" cy="12.5" r="1.5" fill="currentColor" />
    <path d="M11.5 12.5L20 4" />
    <path d="M16 4h4v4" />
  </svg>
);

const IconBarChart = ({ className = "text-[#2563EB]" }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3.5" y="14" width="4" height="7" rx="1.2" />
    <rect x="10" y="9" width="4" height="12" rx="1.2" />
    <rect x="16.5" y="4" width="4" height="17" rx="1.2" />
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

const IconTarget = () => (
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
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
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

const IconArrowUp = () => (
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
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 44 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.76, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.76, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.86 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

function Reveal({ children, className = "", variants = fadeUp, custom = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-72px" });
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
  const [showScrollTop, setShowScrollTop] = useState(false);

  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    setReady(true);
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    const onScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      lenis.destroy();
      window.removeEventListener("scroll", onScroll);
    };
  }, [setReady]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const valuePillars = [
    {
      icon: <IconEye />,
      title: "Lucidity",
      desc: "See the situation clearly before deciding what to do.",
      color: "#00C4B4",
      num: "01",
    },
    {
      icon: <IconTarget />,
      title: "Pragmatism",
      desc: "Focus on what can create meaningful business value — not what is simply possible.",
      color: "#38BDF8",
      num: "02",
    },
    {
      icon: <IconShield />,
      title: "Ownership",
      desc: "Stay connected to execution, not just strategy.",
      color: "#00C4B4",
      num: "03",
    },
    {
      icon: <IconLoop />,
      title: "Adaptability",
      desc: "Build organisations that can respond to change continuously, not periodically.",
      color: "#38BDF8",
      num: "04",
    },
    {
      icon: <IconZap />,
      title: "Impact",
      desc: "Measure progress by outcomes, not activity.",
      color: "#00C4B4",
      num: "05",
    },
  ];

  const threePillars = [
    {
      num: "01",
      numColor: "#9CD7CF",
      numLine: "#9CD7CF",
      iconBg: "#E6F7F4",
      iconBorder: "#A7E2D6",
      crescentColor: "#D6F3ED",
      icon: <IconPillarBrain />,
      title: "THINK",
      sub: "Create clarity.",
      desc: "Understand the business, challenge assumptions, identify what matters and define where the organisation needs to go.",
      image: PillarThinkImg,
      alt: "THINK - Seedling sprouting on rock",
    },
    {
      num: "02",
      numColor: "#9DCEFD",
      numLine: "#9DCEFD",
      iconBg: "#EBF4FD",
      iconBorder: "#B6D8FD",
      crescentColor: "#DDF1FD",
      icon: <IconPillarBox />,
      title: "BUILD",
      sub: "Create capability.",
      desc: "Translate strategy into operating models, technology capabilities, leadership alignment and ways of working that can actually scale.",
      image: PillarBuildImg,
      alt: "BUILD - Stacked wooden blocks",
    },
    {
      num: "03",
      numColor: "#85CEF6",
      numLine: "#85CEF6",
      iconBg: "#E6F4FC",
      iconBorder: "#A8DCFA",
      crescentColor: "#DCF0FC",
      icon: <IconPillarTarget />,
      title: "DELIVER",
      sub: "Create impact.",
      desc: "Move beyond recommendations and ensure that ideas translate into execution, adoption and measurable business outcomes.",
      image: PillarDeliverImg,
      alt: "DELIVER - Hiker on mountain summit",
    },
  ];

  return (
    <main
      className="relative w-full bg-[#040814] text-slate-100 overflow-x-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <section
        ref={heroRef}
        className="relative w-full min-h-[85vh] sm:min-h-[90vh] xl:min-h-screen flex items-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
            <Image
              src={HeroBannerBg}
              alt="About Us – Born from experience, Built for what comes next"
              fill
              priority
              className="hidden xl:block object-contain  object-center"
            />
            <Image
              src={NewHeroBannerTablet}
              alt="About Us – Born from experience, Built for what comes next"
              fill
              priority
              className="hidden md:block xl:hidden object-cover object-center"
            />
            <Image
              src={NewHeroBannerMobile}
              alt="About Us – Born from experience, Built for what comes next"
              fill
              priority
              className="block md:hidden object-cover object-top"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#040814]/90 via-[#040814]/40 xl:via-[#040814]/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040814] via-transparent to-[#040814]/40" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 w-full flex items-center justify-between px-5 sm:px-10 md:px-14 xl:px-20 py-24 sm:py-28 xl:py-32 min-h-[85vh] sm:min-h-[90vh] xl:min-h-screen"
        >
          <div className="max-w-xs sm:max-w-md xl:max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="text-3xl sm:text-2xl md:text-3xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.12] xl:leading-[1.08]"
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22 }}
              className="mt-4 sm:mt-6 xl:mt-7 text-xs sm:text-sm md:text-2xl mb-3 text-slate-300 leading-relaxed max-w-xs sm:max-w-2xl"
            >
              LucidMind is built on a simple belief
              <br />
              better outcomes begin with better thinking.
            </motion.p>
            {/* <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22 }}
            >
              In a world where AI, automation and emerging technologies are
              changing the way organisations operate, the challenge is no longer
              access to technology.
            </motion.p> */}
          </div>
        </motion.div>
      </section>

      <section className="relative w-full bg-[#0A1A35] text-slate-900 py-12 sm:py-16 md:py-20 xl:py-28 px-4 sm:px-8 md:px-12 xl:px-20 overflow-hidden">
        {/* Background Banner */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <Image
            src={AboutUsSecondSectionBanner}
            alt="Strategic transformation background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="max-w-[1640px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center relative z-10">
          <Reveal className="lg:col-span-5" variants={fadeLeft}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-extrabold text-[#1D63B8] leading-[1.12] tracking-tight">
              Why We Exist
            </h2>
            <p className="mt-4 sm:mt-6 text-xs sm:text-sm xl:text-[15px] text-[#475569] leading-relaxed max-w-md">
              LucidMind exists to help leaders answer these questions with
              clarity and move confidently from{" "}
              <span className="font-bold text-[#0B1528]">
                insight to action, capability to outcomes, and today&apos;s
                organisation to an Adaptive Future.
              </span>
            </p>
          </Reveal>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 xl:gap-4 items-stretch">
            {[
              {
                num: "01",
                icon: <IconRefresh className="text-[#1D63B8]" />,
                title: "What",
                sub: "should we change?",
                podBg:
                  "bg-gradient-to-br from-[#2563EB]/25 via-[#3B82F6]/15 to-white/75",
                podBorder: "border-[#3B82F6]/50 hover:border-[#2563EB]",
                podShadow:
                  "shadow-[0_6px_20px_rgba(37,99,235,0.28),inset_0_1.5px_2px_rgba(255,255,255,0.95)]",
              },
              {
                num: "02",
                icon: <IconLightbulb className="text-[#B45309]" />,
                title: "Why",
                sub: "should we change it?",
                podBg:
                  "bg-gradient-to-br from-[#F59E0B]/30 via-[#FBBF24]/18 to-white/75",
                podBorder: "border-[#F59E0B]/60 hover:border-[#D97706]",
                podShadow:
                  "shadow-[0_6px_20px_rgba(245,158,11,0.32),inset_0_1.5px_2px_rgba(255,255,255,0.95)]",
              },
              {
                num: "03",
                icon: <IconCrosshair className="text-[#0F766E]" />,
                title: "Where",
                sub: "should we focus first?",
                podBg:
                  "bg-gradient-to-br from-[#00C4B4]/30 via-[#2DD4BF]/18 to-white/75",
                podBorder: "border-[#00C4B4]/60 hover:border-[#0D9488]",
                podShadow:
                  "shadow-[0_6px_20px_rgba(13,148,136,0.3),inset_0_1.5px_2px_rgba(255,255,255,0.95)]",
              },
              {
                num: "04",
                icon: <IconBarChart className="text-[#6D28D9]" />,
                title: "How",
                sub: "Do we turn that intent into measurable business impact?",
                podBg:
                  "bg-gradient-to-br from-[#8B5CF6]/30 via-[#A78BFA]/18 to-white/75",
                podBorder: "border-[#8B5CF6]/60 hover:border-[#7C3AED]",
                podShadow:
                  "shadow-[0_6px_20px_rgba(124,58,237,0.3),inset_0_1.5px_2px_rgba(255,255,255,0.95)]",
              },
            ].map((card, i) => (
              <Reveal
                key={card.num}
                variants={scaleIn}
                custom={i}
                className="group relative overflow-hidden flex flex-col items-center text-center justify-between min-h-[220px] sm:min-h-[260px] md:min-h-[290px] xl:min-h-[320px] pt-5 pb-6 px-2.5 sm:pt-6 sm:pb-7 sm:px-3.5 xl:pt-7 xl:pb-8 xl:px-4 rounded-t-[48px] sm:rounded-t-[64px] xl:rounded-t-[84px] rounded-b-[48px] sm:rounded-b-[64px] xl:rounded-b-[84px] bg-gradient-to-b from-white/35 via-white/18 to-white/8 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_0_rgba(10,35,80,0.12),inset_0_1.5px_2px_0_rgba(255,255,255,0.7),inset_0_-1px_2px_0_rgba(255,255,255,0.15)] hover:from-white/45 hover:via-white/25 hover:to-white/12 hover:border-white/90 hover:shadow-[0_16px_40px_0_rgba(15,45,105,0.2),inset_0_2px_3px_0_rgba(255,255,255,0.9)] hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Glossy glass reflection sheen */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none rounded-[inherit]" />

                <div className="w-full flex flex-col items-center relative z-10">
                  <span className="text-xs sm:text-sm xl:text-[15px] font-bold text-[#0B1528] mb-2 sm:mb-3 xl:mb-3.5 select-none">
                    {card.num}
                  </span>
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 xl:w-[72px] xl:h-[72px] rounded-full ${card.podBg} backdrop-blur-md border ${card.podBorder} ${card.podShadow} flex items-center justify-center mb-3 sm:mb-4 xl:mb-5 shrink-0 select-none group-hover:scale-110 transition-all duration-300`}
                  >
                    {card.icon}
                  </div>
                </div>

                <div className="w-full flex flex-col items-center justify-center flex-1 relative z-10">
                  {card.title && (
                    <h3 className="text-lg sm:text-xl xl:text-2xl font-bold text-[#0B1528] mb-1 tracking-tight">
                      {card.title}
                    </h3>
                  )}
                  <p
                    className={
                      card.title
                        ? "text-[11px] sm:text-xs xl:text-[13px] text-[#1E293B] font-medium leading-snug"
                        : "text-[10.5px] sm:text-xs xl:text-[13.5px] text-[#0F172A] font-medium leading-snug max-w-[150px]"
                    }
                  >
                    {card.sub}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative w-full min-h-[420px] sm:min-h-[460px] lg:min-h-[520px] xl:min-h-[550px] bg-[#050D1A] overflow-hidden flex items-center py-12 sm:py-14 md:py-16">
        <div className="absolute top-0 bottom-0 left-0 w-full sm:w-[50%] lg:w-[38%] xl:w-[35%] pointer-events-none overflow-hidden z-0">
          <Image
            src={ExecutiveThinkingLeftImg}
            alt="Executive perspective"
            fill
            priority
            className="object-cover object-left opacity-10 md:opacity-15 xl:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050D1A]/90 via-[#050D1A]/75 to-[#050D1A] xl:from-transparent xl:via-[#050D1A]/30 xl:to-[#050D1A]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A] via-transparent to-[#050D1A]/40" />
        </div>

        <div className="absolute top-0 bottom-0 right-0 w-full sm:w-[50%] lg:w-[42%] xl:w-[38%] pointer-events-none overflow-hidden z-0">
          <Image
            src={GlobeCurvedRightImg}
            alt="Global enterprise perspective"
            fill
            priority
            className="object-cover object-right opacity-15 md:opacity-20 xl:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#050D1A]/85 via-[#050D1A]/60 to-[#050D1A] xl:from-transparent xl:via-[#050D1A]/10 xl:to-[#050D1A]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A] via-transparent to-[#050D1A]/40" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 xl:px-18">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="w-full lg:col-span-8">
              <Reveal variants={fadeUp}>
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.26em] uppercase text-[#00C4FF] mb-2 sm:mb-2.5 block">
                  Why LucidMind came into existence
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-[34px] xl:text-[38px] font-extrabold text-white leading-[1.18] tracking-tight mb-4 sm:mb-5">
                  Because transformation
                  <br />
                  looks different from the inside.
                </h2>

                <div className="space-y-3.5 sm:space-y-4 text-xs sm:text-sm xl:text-[14px] text-slate-200/90 leading-[1.7] max-w-2xl">
                  <p>
                    LucidMind was born from more than two decades of experience
                    building businesses, leading technology organisations,
                    scaling teams and navigating transformation across business
                    and technology.
                  </p>
                  <p>
                    Over{" "}
                    <strong className="text-white font-bold">27+ years</strong>,
                    founder{" "}
                    <strong className="text-white font-bold">
                      Ravishankar Pingali
                    </strong>{" "}
                    has worked across technology, business leadership and global
                    enterprise environments — building organisations,
                    transforming operations, scaling a GCC from{" "}
                    <strong className="text-white font-bold">
                      15 to 220+ people
                    </strong>
                    , working with global leadership teams and turning emerging
                    technologies into business outcomes.
                  </p>
                  <p className="text-[#00C4FF] font-semibold text-xs sm:text-sm xl:text-[15px] pt-1">
                    That journey revealed a recurring pattern.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="w-full lg:col-span-4 flex justify-start lg:justify-end">
              <Reveal
                variants={fadeRight}
                className="w-full max-w-sm p-6 sm:p-7 rounded-2xl bg-[#071326]/80 backdrop-blur-md border border-[#00C4FF]/30 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(0,196,255,0.06)] flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl sm:text-4xl xl:text-5xl font-black text-[#00C4FF] leading-none tracking-tight block">
                    27+ years
                  </span>
                  <div className="w-10 h-[2px] bg-[#00C4FF] my-3.5 rounded-full" />
                  <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight block">
                    15 to 220+ people
                  </span>
                </div>
                <div className="mt-5 pt-4 border-t border-[#00C4FF]/20">
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    That journey revealed a recurring pattern.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
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

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 xl:px-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 lg:gap-12">
          <div className="hidden xl:block w-[24%] shrink-0" />

          <div className="w-full md:w-[42%] xl:w-[38%] shrink-0">
            <Reveal variants={fadeUp}>
              <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-[26px] xl:text-[30px] font-extrabold text-[#0B2545] leading-[1.22] tracking-tight">
                The hardest part of
                <br />
                transformation is rarely
                <br />
                the technology.
              </h2>
            </Reveal>
          </div>

          <div className="w-full md:w-[54%] xl:w-[38%] shrink-0">
            <Reveal variants={fadeUp}>
              <p className="text-xs sm:text-sm md:text-[13px] xl:text-[14px] text-[#3B4E68] leading-[1.7] font-normal">
                It is creating clarity around the problem, aligning people
                around the opportunity, building the capability to execute and
                maintaining the discipline to turn ideas into outcomes.
              </p>
              <p className="mt-3 text-xs sm:text-sm md:text-[13px] xl:text-[14.5px] font-bold text-[#0B2545] leading-[1.7]">
                And that is where LucidMind begins.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative w-full bg-[#011424] py-10 sm:py-12 md:py-14 xl:py-16 overflow-hidden flex items-center min-h-[420px] sm:min-h-[460px] lg:min-h-[520px] xl:min-h-[560px]">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src={Section5FullBg}
            alt="The LucidMind Difference background"
            fill
            priority
            className="hidden xl:block object-cover object-right"
          />
          <div className="absolute inset-0 bg-[#011424] xl:hidden" />
        </div>

        <div className="relative z-10 w-full max-w-[1520px] mx-auto px-5 sm:px-8 md:px-12 xl:px-16 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 xl:gap-6">
          <div className="w-full lg:w-[50%] xl:w-[47%] shrink-0">
            <Reveal variants={fadeLeft}>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.24em] uppercase text-[#00C4FF] mb-2 sm:mb-2.5 block">
                The LucidMind difference
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] xl:text-[36px] font-extrabold text-white leading-[1.14] tracking-tight mb-3 sm:mb-3.5">
                We don&apos;t start with technology.
                <br />
                We{" "}
                <span className="text-[#00C4FF]">start with the question.</span>
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-300 leading-[1.6] mb-2.5 max-w-xl">
                AI is accelerating change. New platforms, tools and technologies
                are emerging every day.
              </p>
              <p className="text-xs sm:text-[13px] text-slate-300 leading-[1.6] mb-3 max-w-xl">
                But technology adoption, by itself, does not create
                transformation.
              </p>
              <h3 className="text-xs sm:text-[13px] font-bold text-white mb-2">
                The important questions are business questions:
              </h3>
              <div className="space-y-1.5 mb-3 sm:mb-3.5 pl-0.5">
                {[
                  "Where can technology create meaningful advantage?",
                  "What capabilities does the organisation need to build?",
                  "What should be automated, augmented or fundamentally redesigned?",
                  "How do we move from experimentation to enterprise value?",
                ].map((q, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 text-xs sm:text-[12.5px] text-slate-200 leading-snug"
                  >
                    <span className="text-[#00C4FF] font-bold text-sm shrink-0 leading-none mt-0.5">
                      →
                    </span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-[12px] text-slate-300/85 leading-[1.6] max-w-xl">
                LucidMind brings a perspective shaped by having sat on both
                sides of the transformation table: as a technology leader
                responsible for making change happen and as a business leader
                accountable for people, operations, stakeholders and the P&L.
              </p>
            </Reveal>
          </div>

          <div className="hidden lg:block w-[50%] xl:w-[53%] shrink-0 pointer-events-none" />
        </div>
      </section>

      <section className="relative w-full py-16 sm:py-20 md:py-24 overflow-hidden select-none bg-[#FAFCFE]">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src={HeroBgSectionUnknown}
            alt="Three pillars background"
            fill
            priority
            className="object-cover object-center w-full h-full"
          />
        </div>

        <div className="relative z-10 w-full max-w-[1680px] mx-auto px-5 sm:px-8 md:px-12 xl:px-16">
          <Reveal
            variants={fadeUp}
            className="text-center max-w-5xl mx-auto mb-12 sm:mb-16 xl:mb-20"
          >
            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
              <span className="w-8 sm:w-12 h-[1px] bg-slate-400/50" />
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.24em] text-slate-500 uppercase">
                OUR APPROACH
              </span>
              <span className="w-8 sm:w-12 h-[1px] bg-slate-400/50" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#0B182F] tracking-tight leading-[1.2]">
              This allows us to connect three things
              <br />
              that are often{" "}
              <span className="text-[#007DFE]">addressed separately</span>
            </h2>
          </Reveal>

          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center max-w-[1460px] mx-auto w-full gap-8 sm:gap-10 lg:gap-0 px-4 sm:px-6 xl:px-8">
            {threePillars.map((step, i) => (
              <React.Fragment key={step.title}>
                <Reveal
                  variants={scaleIn}
                  custom={i}
                  className="relative flex items-start shrink-0 max-w-full"
                >
                  <div className="relative z-20 flex flex-col items-start text-left shrink-0">
                    <span
                      className="text-3xl sm:text-4xl xl:text-[42px] font-bold leading-none tracking-tight"
                      style={{ color: step.numColor }}
                    >
                      {step.num}
                    </span>
                    <div
                      className="w-6 sm:w-7 h-[2px] rounded-full mt-1.5 mb-2.5 sm:mb-3"
                      style={{ backgroundColor: step.numLine }}
                    />

                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center mb-2.5 sm:mb-3.5 shadow-sm"
                      style={{
                        backgroundColor: step.iconBg,
                        borderColor: step.iconBorder,
                      }}
                    >
                      {step.icon}
                    </div>

                    <h3 className="text-base sm:text-lg xl:text-xl font-black text-[#06142F] tracking-tight leading-none mb-1">
                      {step.title}
                    </h3>
                    <h4 className="text-xs sm:text-[13px] xl:text-[13.5px] font-bold text-[#06142F] leading-tight mb-2 sm:mb-2.5">
                      {step.sub}
                    </h4>
                    <p className="text-[11px] sm:text-[12px] xl:text-[12.5px] text-[#4A5568] leading-[1.65] max-w-[155px] xs:max-w-[175px] sm:max-w-[200px] xl:max-w-[230px]">
                      {step.desc}
                    </p>
                  </div>

                  <div className="relative z-10 shrink-0 -ml-12 xs:-ml-14 sm:-ml-18 lg:-ml-16 xl:-ml-24">
                    <div
                      className="absolute -top-3 -right-3 sm:-top-3.5 sm:-right-3.5 xl:-top-4 xl:-right-4 w-[112%] h-[112%] rounded-full pointer-events-none z-0 blur-[3px] opacity-80"
                      style={{ backgroundColor: step.crescentColor }}
                    />
                    <div className="relative z-10 w-40 h-40 xs:w-44 xs:h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 lg:w-[210px] lg:h-[210px] xl:w-[260px] xl:h-[260px] rounded-full overflow-hidden">
                      <Image
                        src={step.image}
                        alt={step.alt}
                        fill
                        priority
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white from-10% via-white/50 via-30% to-transparent to-60% pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/80 from-0% via-white/40 via-30% to-transparent to-50% pointer-events-none" />
                    </div>
                  </div>
                </Reveal>

                {i < 2 && (
                  <>
                    <div className="hidden lg:flex items-center justify-center flex-1 min-w-[24px] max-w-[70px] xl:max-w-[95px] mx-1 xl:mx-2 relative shrink-0 self-start mt-[105px] xl:mt-[130px]">
                      <div className="w-full h-[1.5px] bg-[#93C5FD]/70" />
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-[#0084FF] shadow-[0_0_6px_rgba(0,132,255,0.6)]" />
                    </div>

                    <div className="flex lg:hidden flex-col items-center justify-center h-10 w-full relative shrink-0 my-1">
                      <div className="w-[1.5px] h-full bg-[#93C5FD]/60" />
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-[#0084FF] shadow-[0_0_6px_rgba(0,132,255,0.6)]" />
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
            <div className="w-[1.5px] h-6 bg-slate-300 mx-auto mb-3.5" />
            <p className="text-xs sm:text-sm md:text-[14.5px] font-semibold text-[#1E293B] leading-relaxed">
              Because strategy without execution remains an idea. And technology
              without direction remains a tool.
            </p>
            <p className="mt-2 text-lg sm:text-xl md:text-2xl font-black text-[#007DFE] tracking-tight">
              LucidMind works at the intersection.
            </p>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#00C4FF] to-[#007DFE] rounded-full mx-auto mt-3.5" />
          </Reveal>
        </div>
      </section>

      {/* <section className="relative w-full min-h-[55vh] sm:min-h-[65vh] xl:min-h-[75vh] flex items-center overflow-hidden py-16 sm:py-20 xl:py-24">
        <div className="absolute inset-0 z-0">
          <Image
            src={EarthHorizonImg}
            alt="From insight to impact"
            fill
            className="object-cover object-bottom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040814]/95 via-[#040814]/80 to-[#040814]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040814] via-transparent to-[#040814]/50" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-10 md:px-14 xl:px-20">
          <Reveal variants={fadeUp} className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6 sm:mb-8">
              From insight to impact
            </h2>

            <div className="space-y-4 sm:space-y-5 text-sm sm:text-base md:text-lg text-slate-200/95 leading-relaxed">
              <p>
                Our experience has shown us what becomes possible when the
                pieces come together. A technology centre can evolve into a
                strategic value creator.
              </p>
              <p>
                An idea born in India can become a product adopted across global
                businesses. AI, automation and low-code can move from
                experiments to real business capabilities.
              </p>
              <p>
                And transformation can become more than a technology programme.
                It can become a way for an organisation to continuously adapt.
              </p>
              <p className="text-[#00C4FF] font-semibold text-base sm:text-lg md:text-xl pt-1">
                That is the future LucidMind is built to enable.
              </p>
            </div>
          </Reveal>
        </div>
      </section> */}

      <section className="relative w-full bg-[#070D1B] py-12 sm:py-16 md:py-20 xl:py-28 px-4 sm:px-8 md:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <Reveal
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 xl:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold tracking-tight text-white">
              What LucidMind stands for
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4 xl:gap-5">
            {valuePillars.map((pillar, i) => (
              <Reveal key={pillar.num} variants={scaleIn} custom={i}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.25 }}
                  className="group relative p-4 sm:p-5 xl:p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-colors duration-300 flex flex-col justify-between h-full"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = pillar.color + "80")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
                >
                  <div>
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform"
                      style={{
                        background: `${pillar.color}18`,
                        border: `1px solid ${pillar.color}44`,
                        color: pillar.color,
                      }}
                    >
                      {pillar.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-300/80 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
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

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-8 sm:gap-10 xl:gap-14">
          <Reveal variants={fadeUp}>
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 sm:gap-10 xl:gap-14">
              <Reveal
                variants={fadeLeft}
                className="w-full sm:w-[260px] md:w-[280px] xl:w-[330px] shrink-0 flex flex-col items-center"
              >
                <div className="relative w-full max-w-[220px] sm:max-w-[260px] md:max-w-[280px] xl:max-w-[320px]">
                  <div className="absolute -inset-2 rounded-3xl bg-[#061e38]/50 border border-[#00C4FF]/20 -z-10 translate-x-1.5 translate-y-1.5 pointer-events-none" />
                  <div className="relative w-full aspect-[4/4.6] rounded-2xl overflow-hidden border-2 border-[#00C4FF] shadow-[0_0_30px_rgba(0,196,255,0.35)] bg-[#040E1E]">
                    <Image
                      src={FounderImg}
                      alt="Ravishankar Pingali"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>
                <div className="mt-4 sm:mt-5 w-full flex justify-center">
                  <a
                    href="https://www.linkedin.com/in/ravipingali/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Connect with Ravishankar Pingali on LinkedIn"
                    className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#051C33]/90 hover:bg-[#00C4FF] text-white hover:text-[#040E1E] border border-[#00C4FF]/70 shadow-[0_0_15px_rgba(0,196,255,0.25)] hover:shadow-[0_0_25px_rgba(0,196,255,0.6)] font-semibold text-xs transition-all duration-300 group"
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
                  <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#00C4FF]">
                    THE FOUNDER
                  </span>
                  <span className="w-8 sm:w-12 h-[1.5px] bg-[#00C4FF]/60" />
                </div>
                <h2 className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Ravishankar Pingali
                </h2>
                <h3 className="text-xs sm:text-sm xl:text-base font-bold text-[#00C4FF] mt-1.5 sm:mt-2">
                  GCC & Technology Leader | Transformation Advisor | Board Advisor
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1.5 sm:mt-2 font-normal leading-relaxed">
                  Building adaptive enterprises by connecting strategy,
                  technology, people and execution.
                </p>
                <div className="space-y-3 sm:space-y-3.5 text-xs sm:text-[13px] xl:text-sm text-slate-300 leading-relaxed mt-4 sm:mt-5">
                  <p>
                    Ravishankar Pingali brings{" "}
                    <strong className="text-white font-bold">
                      27+ years of experience
                    </strong>{" "}
                    across technology and business leadership, spanning
                    enterprise transformation, global technology operations,
                    product development and organisational scale
                  </p>
                  <p>
                    His career includes significant leadership experience with
                    Würth IT India, where he progressed from COO to MD, building
                    and scaling technology organisations and working closely
                    with global leadership teams.
                  </p>
                  <p>
                    At Würth IT India, he identified an APAC business gap,
                    developed and pitched the solution to the Germany leadership
                    team, and led its rollout across 12 companies within four
                    months, contributing up to 10% additional revenue at each
                    site.
                  </p>
                  <p>
                    He has also scaled a GCC from 15 to 220+ people, translating
                    emerging technologies and business strategies into tangible
                    outcomes. His experience goes beyond technology to the
                    operating realities of transformation, how strategy, people,
                    processes, technology and leadership need to come together
                    to create sustainable business impact.
                  </p>
                  <p>
                    LucidMind is a natural extension of this journey, bringing
                    that experience to organisations navigating their next
                    chapter, helping leadership teams think strategically, build
                    the right capabilities and deliver meaningful
                    transformation.
                  </p>
                </div>
              </Reveal>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3.5 xl:gap-5">
            {[
              {
                icon: <IconFounderUser />,
                stat: "27+ years",
                statClass: "text-[#00C4FF]",
                // label: "of leadership & transformation experience",
              },
              {
                icon: <IconFounderGrowthBars />,
                stat: "15 → 220+ People",
                statClass: "text-white",
                // label: "GCC scale journey",
              },
              {
                icon: <IconFounderGlobe />,
                stat: "100M+ Value Led",
                statClass: "text-[#00C4FF]",
                // label: "experience across enterprise environments",
              },
              {
               icon: <IconFounderBullseye />,
                stat: "30% Leadrship Pipline Strengthened",
                statClass: "text-white",
                // label: "perspective",
              },
              // {
              //         icon: <IconFounderMicrochip />,
              //   stat: "Strategy → Execution → Impact",
              //   statClass: "text-[#00C4FF]",
              //   label: "the LucidMind approach",
              // },
            ].map((m, i) => (
              <Reveal key={i} variants={scaleIn} custom={i}>
                <div className="h-full rounded-2xl bg-[#06182D]/70 backdrop-blur-md border border-[#00C4FF]/30 p-3.5 sm:p-4 md:p-5 xl:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-[#00C4FF]/70 hover:shadow-[0_0_25px_rgba(0,196,255,0.25)] transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 sm:w-11 sm:h-11 xl:w-12 xl:h-12 rounded-full bg-[#05172A] border border-[#00C4FF]/60 shadow-[0_0_16px_rgba(0,196,255,0.4)] flex items-center justify-center mb-3 sm:mb-4 xl:mb-5 text-[#00C4FF] scale-90 sm:scale-100">
                      {m.icon}
                    </div>
                    <h4
                      className={`text-base sm:text-lg md:text-xl xl:text-2xl font-extrabold leading-tight tracking-tight ${m.statClass}`}
                    >
                      {m.stat}
                    </h4>
                  </div>
                  <p className="text-[10.5px] sm:text-xs xl:text-[13px] text-slate-300 mt-2 sm:mt-3 leading-snug">
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
                <h3 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  The future belongs to adaptive organisations.
                </h3>
                <p className="mt-3 sm:mt-4 text-xs sm:text-[13px] xl:text-sm text-slate-300 leading-relaxed">
                  The organisations that thrive in the years ahead will not
                  necessarily be those that adopt every new technology first.
                </p>
                <p className="mt-2 text-xs sm:text-[13px] xl:text-sm text-slate-300 leading-relaxed">
                  They will be the ones that can{" "}
                  <strong className="text-white font-bold">
                    understand change, make better decisions, build the right
                    capabilities and execute with consistency
                  </strong>
                  .
                </p>
                <p className="mt-2 text-xs sm:text-[13px] xl:text-sm text-slate-300 leading-relaxed">
                  LucidMind exists to help them do exactly that.
                </p>
              </div>

              <div className="relative z-10 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#00C4FF]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5">
                <p className="text-xs sm:text-sm xl:text-base font-bold text-[#00C4FF]">
                  Think clearly. Build capability. Create impact.
                </p>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-4 md:px-7 py-2.5 md:py-3 rounded-full bg-[#14E5D4] hover:bg-[#00E5FF] text-[#031326] font-extrabold text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(20,229,212,0.5)] hover:shadow-[0_0_35px_rgba(0,229,255,0.8)] transition-all duration-300 shrink-0 group"
                >
                  <span>Welcome to LucidMind</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-8 right-8 z-50 p-3.5 rounded-full bg-[#00C4B4] text-[#040814] shadow-2xl hover:bg-[#38BDF8] hover:scale-110 transition-all duration-300"
          >
            <IconArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}
