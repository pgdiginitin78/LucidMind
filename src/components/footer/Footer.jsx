import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LucidMindTransperentLogo from "../../assets/logo/LucidMindTransperent1.png";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const wordmarkRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordmarkRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wordmarkRef.current,
            start: "top 90%",
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
    }),
  };

  const linkColumns = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Advisory", path: "/advisory" },
        { name: "Insights", path: "/insights" },
        { name: "Contact", path: "/contact" },
      ],
    },
    {
      title: "Featured",
      links: [
        { name: "Latest Articles", path: "/insights" },
        { name: "Podcasts", path: "/podcasts" },
        { name: "Case Studies", path: "/case-studies" },
        { name: "Reports", path: "/reports" },
      ],
    },
  ];

  return (
    <footer className="w-full relative bg-[#040C1A] pt-12 sm:pt-16 pb-6 sm:pb-8 border-t border-[#0F2644] font-['PlusJakartaSans',sans-serif] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-7 sm:gap-12 lg:gap-6 mb-12 sm:mb-12">
          <motion.div
            className="col-span-2 md:col-span-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            custom={0}
          >
            <Link to="/" className="inline-block mb-3 sm:mb-2 h-24 w-28">
              <img src={LucidMindTransperentLogo} />
            </Link>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-5 sm:mb-6 max-w-sm">
              Navigating complexity and building future-ready organisations for
              the AI era.
            </p>
            <div className="flex items-center gap-3">
              {[
                {
                  href: "https://twitter.com",
                  path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.004 3.973H5.078z",
                },
                {
                  href: "https://linkedin.com",
                  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                },
              ].map((s) => (
                <motion.a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{
                    y: -2,
                    borderColor: "#ffffff",
                    color: "#ffffff",
                  }}
                  transition={{ duration: 0.2 }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#0F2644] flex items-center justify-center text-[#94A3B8]"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d={s.path} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {linkColumns.map((col, colIdx) => (
            <motion.div
              key={col.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              custom={colIdx + 1}
            >
              <h3 className="text-white text-xs sm:text-sm font-normal tracking-wide mb-3">
                {col.title}
              </h3>
              <div className="w-8 h-px bg-[#00C4B4] mb-4 sm:mb-5" />
              <ul className="flex flex-col gap-2.5 sm:gap-3">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="group relative text-[#94A3B8] text-sm hover:text-white transition-colors inline-block"
                    >
                      {link.name}
                      <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div
            className="col-span-2 md:col-span-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            custom={3}
          >
            <h3 className="text-white text-xs sm:text-sm font-normal tracking-wide mb-3">
              Get in Touch
            </h3>
            <div className="w-8 h-px bg-[#00C4B4] mb-4 sm:mb-5" />
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-5">
              Have a question or want to work together? Let's talk.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white border border-white/20 text-sm font-normal px-5 sm:px-6 py-2.5 rounded-full hover:bg-white hover:text-[#040C1A] transition-colors duration-300 w-full sm:w-auto"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="pt-6 sm:pt-8 border-t border-[#0F2644] flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-[#64748B] text-xs order-2 md:order-1">
            &copy; {currentYear} Lucidmind. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 order-1 md:order-2">
            <Link
              to="/privacy-policy"
              className="text-[#64748B] text-xs hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-[#64748B] text-xs hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="text-[#64748B] text-xs hover:text-white transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </motion.div>
      </div>

      <div
        ref={wordmarkRef}
        className="pointer-events-none select-none absolute left-0 right-0 bottom-[-6%] sm:bottom-[-4%] flex justify-center overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-['Playfair_Display',serif] font-normal leading-none whitespace-nowrap"
          style={{
            fontSize: "clamp(3.5rem, 20vw, 14rem)",
            color: "transparent",
            WebkitTextStroke: "1px #14243d",
            backgroundImage:
              "linear-gradient(180deg, #0B1D38 0%, #071120 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          Lucidmind
        </span>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#040C1A] via-transparent to-[#040C1A]/60" />
    </footer>
  );
}
