import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import LucidMindTransperentLogo from "../../assets/logo/LucidMindTransperent1.png";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Advisory", href: "/advisory"},
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

const SERVICES_DROPDOWN = [
  { label: "Strategy Advisory", href: "/services/strategy" },
  { label: "AI Transformation", href: "/services/ai-transformation" },
  { label: "Leadership Coaching", href: "/services/leadership" },
];

const BRAND_BLUE = "#2563EB";
const BRAND_TEAL = "#00C4B4";

export default function Navbar() {
  const [active, setActive] = useState("Home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const logoGlowRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const anim = gsap.to(logoGlowRef.current, {
      opacity: 0.85,
      scale: 1.12,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    return () => anim.kill();
  }, []);



  return (
    <div className="fixed top-0 inset-x-0 z-[1000] pt-3 sm:pt-2 flex justify-center px-3 sm:px-4">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-[1180px] rounded-full border border-white/10 bg-[#050B18]/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] flex items-center justify-between gap-2 sm:gap-4 pl-3 pr-2 sm:pl-4 sm:pr-3 py-1"
      >
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="relative flex items-center justify-center w-11 h-11 md:w-20 md:h-15">
            <img
              src={LucidMindTransperentLogo}
              alt="LucidMind"
              className="relative w-full h-full object-contain"
            />
          </span>
        </Link>

        <div className="hidden lg:flex flex-1 items-center justify-end gap-6 xl:gap-8">
          {NAV_LINKS.map((item) => {
            const isActive = active === item.label;
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setServicesOpen(true)}
                onMouseLeave={() => item.hasDropdown && setServicesOpen(false)}
              >
                <Link
                  to={item.href}
                  onClick={() => setActive(item.label)}
                  className={`relative flex items-center gap-1 text-sm cursor-pointer font-medium transition-colors ${
                    isActive
                      ? "text-[#00C4B4]"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        servicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="navActiveDot"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-[#00C4B4]"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>

                {item.hasDropdown && (
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                      >
                        <div className="w-52 rounded-2xl border border-white/10 bg-[#050B18]/95 backdrop-blur-xl shadow-xl p-2">
                          {SERVICES_DROPDOWN.map((sub) => (
                            <Link
                              key={sub.label}
                              to={sub.href}
                              className="block px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 shrink-0">
          <Link
            to="/contact"
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full text-[#040C1A]"
            style={{
              backgroundImage: `linear-gradient(90deg, ${BRAND_TEAL}, ${BRAND_BLUE})`,
            }}
          >
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition-colors"
          >
            {mobileOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute top-[64px] sm:top-[72px] left-3 right-3 lg:hidden"
          >
            <div className="rounded-3xl border border-white/10 bg-[#050B18]/95 backdrop-blur-xl shadow-xl p-3 flex flex-col gap-1">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => {
                    setActive(item.label);
                    setMobileOpen(false);
                  }}
                  className={`flex items-center justify-between text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active === item.label
                      ? "text-[#00C4B4] bg-white/5"
                      : "text-white/75 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
