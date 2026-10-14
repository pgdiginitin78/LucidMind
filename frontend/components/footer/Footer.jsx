"use client";

import { useEffect, useState } from "react";
import { Link } from "@/lib/navigation";
import { motion } from "framer-motion";
import FooterBg from "./image/FooterBg.webp";

const LucidMindTransperentLogo = "/assets/logo/LucidMind logo 4.svg";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("lucidmind_token");
        const storedUser = localStorage.getItem("lucidmind_user");

        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    checkAuth();

    window.addEventListener("lucidmind_auth_change", checkAuth);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("lucidmind_auth_change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("lucidmind_token");
      localStorage.removeItem("lucidmind_user");
    } catch {}

    setUser(null);
    window.dispatchEvent(new Event("lucidmind_auth_change"));
  };

  const socialLinks = [
    {
      href: "https://www.linkedin.com/company/lucidmind-consulting/",
      label: "LinkedIn",
      path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    },
    // {
    //   href: "#",
    //   label: "Facebook",
    //   path: "M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z",
    // },
    // {
    //   href: "#",
    //   label: "Instagram",
    //   path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
    // },
    // {
    //   href: "#",
    //   label: "YouTube",
    //   path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    // },
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Advisory", path: "/advisory" },
    { name: "Insights", path: "/insights" },
    { name: "Contact", path: "/contact" },
  ];

  const featuredLinks = [
    { name: "Latest Articles", path: "/insights" },
    { name: "Podcasts", path: "/podcasts" },
  ];

  const services = [
    "Strategy & Advisory",
    "Leadership Development",
    "Organisational Transformation",
    "Talent & Teams",
    "Innovation Enablement",
  ];

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 18,
    },
    visible: (index = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        delay: index * 0.08,
        ease: "easeOut",
      },
    }),
  };

  const bgUrl = FooterBg.src || FooterBg;

  return (
    <footer className="relative w-full overflow-hidden bg-[#030d1c] font-inter">
      {/* Single Background Image */}
      <div className="pointer-events-none absolute inset-0 z-[1] hidden md:block">
        <img
          src={bgUrl}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-bottom"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[7] w-full max-w-[560px] lg:w-[38%]"
        style={{
          background:
            "linear-gradient(to right, rgba(3, 13, 28, 0.75) 0%, rgba(3, 13, 28, 0.3) 60%, transparent 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 z-[8] h-1/2 w-full"
        style={{
          background:
            "linear-gradient(to top, rgba(3, 13, 28, 0.82) 0%, rgba(3, 13, 28, 0.35) 50%, transparent 100%)",
        }}
      />

      <div className="relative z-20 mx-auto w-full max-w-[1920px] px-6 sm:px-10 lg:px-14 xl:px-20 2xl:px-24">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.35fr_0.85fr_1.15fr_1.35fr]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUp}
            custom={0}
            className="min-w-0 py-10 lg:py-12 lg:pr-12 xl:pr-16 col-span-2 md:col-span-1"
          >
            <Link href="/" className="mb-3 block w-[220px]">
              <img
                src={LucidMindTransperentLogo}
                alt="LucidMind"
                width={150}
                height={60}
                loading="lazy"
                decoding="async"
                className="h-auto w-full object-contain"
              />
            </Link>

            <div className="mb-5 h-[2px] w-14 bg-[#00c4b4]" />

            <p className="mb-7 max-w-[370px] text-[14px] font-light leading-[1.75] text-white">
              Navigating complexity and building organisations ready for the
              Adaptive Future.
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#00c4b4]/45 bg-[#030d1c]/35 text-white/85 backdrop-blur-sm transition-all duration-300 hover:border-[#00c4b4] hover:bg-[#00c4b4]/10 hover:text-[#00c4b4]"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d={social.path} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUp}
            custom={1}
            className="border-t border-white/[0.09] py-10 sm:py-12  lg:border-t-0 lg:px-8 xl:px-10"
          >
            <h3 className="font-['Playfair_Display',_serif] text-[20px] font-semibold leading-none text-white">
              Quick Links
            </h3>

            <div className="mb-7 mt-5 h-[2px] w-12 bg-[#00c4b4]" />

            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-[14px] font-light text-white transition-all duration-300 hover:pl-1 hover:text-[#00c4b4]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUp}
            custom={2}
            className="border-t border-white/[0.09] py-10 sm:py-12  lg:border-t-0 lg:px-8 xl:px-10"
          >
            <h3 className="font-['Playfair_Display',_serif] text-[20px] font-semibold leading-none text-white">
              Featured
            </h3>

            <div className="mb-7 mt-5 h-[2px] w-12 bg-[#00c4b4]" />

            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {featuredLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-[14px] font-light text-white transition-all duration-300 hover:pl-1 hover:text-[#00c4b4]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUp}
            custom={3}
            className="border-t border-white/[0.09] py-10 sm:py-12  lg:border-t-0 lg:px-8 xl:px-10"
          >
            <h3 className="font-['Playfair_Display',_serif] text-[20px] font-semibold leading-none text-white">
              Our Services
            </h3>

            <div className="mb-7 mt-5 h-[2px] w-12 bg-[#00c4b4]" />

            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    href="/advisory"
                    className="text-[14px] font-light leading-6 text-white transition-all duration-300 hover:pl-1 hover:text-[#00c4b4]"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div> */}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUp}
            custom={4}
            className="border-t border-white/[0.09] py-10 sm:py-12  lg:border-t-0 lg:pl-8 xl:pl-10 col-span-2 md:col-span-1"
          >
            <h3 className="font-['Playfair_Display',_serif] text-[20px] font-semibold leading-none text-white">
             Get in Touch
            </h3>

            <div className="mb-5 mt-5 h-[2px] w-12 bg-[#00c4b4]" />

            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#00c4b4]/60 bg-[#031624]/50 text-[#00c4b4]">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>

              <div className="flex flex-col items-start">
                <p className="mb-4 text-[14px] font-light leading-[1.7] text-white">
                  Have a question or want to
                  <br />
                  work together?
                  <br />
                  Let's talk.
                </p>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 rounded-full border border-[#00c4b4]/70 px-6 py-2.5 text-[13px] font-medium text-white transition-all duration-300 hover:bg-[#00c4b4]/10"
                >
                  Contact Us
                  <span className="text-[#00c4b4]">→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-40 flex flex-col gap-3 border-t border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] font-light text-white/50">
            © {currentYear} Lucidmind. All rights reserved.
          </p>
          {/* 
          <div className="flex flex-wrap items-center gap-2 text-[12px] font-light text-white/45">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>

            <span className="text-white/20">|</span>

            <Link href="/terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>

            <span className="text-white/20">|</span>

            <Link
              href="/cookies"
              className="transition-colors hover:text-white"
            >
              Cookies
            </Link>
          </div> */}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 z-[14] h-px w-full bg-[#00c4b4]/25" />
    </footer>
  );
}
