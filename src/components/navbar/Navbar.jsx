import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu } from "lucide-react";
import LucidMindTransperentLogo from "../../assets/logo/Lucid-mind-logos1.png";
import { cn } from "../../lib/utils";
import { RandomLetterSwap } from "../ui/random-letter-swap";
import { Component as KineticMobileNav } from "../ui/sterling-gate-kinetic-navigation";

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Advisory", href: "/advisory" },
  { name: "Insights", href: "/insights" },
  { name: "Contact", href: "/contact" },
];

const itemVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", damping: 18, stiffness: 250 },
  },
  collapsed: { opacity: 0, x: 15, scale: 0.9, transition: { duration: 0.15 } },
};

const collapsedIconVariants = {
  expanded: { opacity: 0, scale: 0.6, transition: { duration: 0.15 } },
  collapsed: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 16,
      stiffness: 300,
      delay: 0.1,
    },
  },
};

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [rightOffset, setRightOffset] = useState(0);
  const isManuallyExpanded = useRef(false);
  const expandScrollY = useRef(0);

  const location = useLocation();
  const currentPath = location.pathname;
  const navRef = useRef(null);

  const updateRightOffset = useCallback(() => {
    const containerWidth = window.innerWidth;
    const padding =
      containerWidth <= 768 ? 20 : containerWidth >= 1536 ? 64 : 48;
    const collapsedPillWidth = containerWidth >= 1536 ? 64 : 48;
    const offset = containerWidth / 2 - collapsedPillWidth / 2 - padding;
    setRightOffset(Math.max(0, offset));
  }, []);

  useEffect(() => {
    const handleResize = () => updateRightOffset();
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateRightOffset]);

  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setShowLogo(false);
    } else {
      setShowLogo(true);
    }

    if (latest > 120) {
      if (!isCollapsed) {
        if (!isManuallyExpanded.current) {
          setIsCollapsed(true);
        } else if (Math.abs(latest - expandScrollY.current) > 30) {
          isManuallyExpanded.current = false;
          setIsCollapsed(true);
        }
      }
    } else if (latest <= 20) {
      isManuallyExpanded.current = false;
      if (isCollapsed) {
        setIsCollapsed(false);
      }
    }

    lastScrollY.current = latest;
  });

  const handleNavClick = (e) => {
    if (isCollapsed) {
      e.preventDefault();
      e.stopPropagation();
      isManuallyExpanded.current = true;
      expandScrollY.current = window.scrollY;
      setIsCollapsed(false);
    }
  };

  const is2xl = typeof window !== "undefined" && window.innerWidth >= 1536;

  return (
    <>
      <div className="lg:hidden">
        <KineticMobileNav />
      </div>

      <div className="hidden lg:block">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{
            opacity: showLogo ? 1 : 0,
            y: showLogo ? 0 : -10,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "fixed top-3 2xl:top-6 left-6 sm:left-12 2xl:left-16 z-50",
            !showLogo && "pointer-events-none",
          )}
        >
          <Link to="/" className="flex items-center group">
            <img
              src={LucidMindTransperentLogo}
              alt="LucidMind"
              className="h-9 md:h-14 xl:h-18.75 2xl:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </motion.div>

        <div className="fixed top-5 2xl:top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
          <motion.nav
            ref={navRef}
            initial={{ y: -80, opacity: 0 }}
            animate={{
              x: isCollapsed ? rightOffset : 0,
              width: isCollapsed ? (is2xl ? "4rem" : "3rem") : "auto",
              y: 0,
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 24,
              mass: 0.8,
            }}
            whileHover={isCollapsed ? { scale: 1.08 } : {}}
            whileTap={isCollapsed ? { scale: 0.95 } : {}}
            onClick={handleNavClick}
            className={cn(
              "relative flex items-center px-4 2xl:px-6 overflow-hidden rounded-full border border-[#2563EB]/60 bg-[#030A18]/85 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(37,99,235,0.15)] h-12 2xl:h-16 transition-colors duration-300",
              isCollapsed &&
                "cursor-pointer justify-center !px-0 hover:border-[#00C4FF] hover:shadow-[0_0_25px_rgba(0,196,255,0.35)]",
            )}
          >
            <motion.div
              className={cn(
                "flex items-center gap-1 sm:gap-2 2xl:gap-4",
                isCollapsed && "pointer-events-none",
              )}
            >
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/"
                    ? currentPath === "/"
                    : currentPath.startsWith(item.href);

                return (
                  <motion.div
                    key={item.name}
                    variants={itemVariants}
                    animate={!isCollapsed ? "expanded" : "collapsed"}
                  >
                    <Link
                      to={item.href}
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        "relative text-sm 2xl:text-xl font-medium transition-all duration-300 px-3.5 2xl:px-6 py-1.5 2xl:py-2.5 rounded-full flex items-center justify-center whitespace-nowrap",
                        isActive
                          ? "text-[#00C4FF] font-semibold bg-[#2563EB]/25 border border-[#00C4FF]/40 shadow-[0_0_12px_rgba(0,196,255,0.2)]"
                          : "text-white/80 hover:text-[#00C4FF] hover:bg-white/[0.06]",
                      )}
                    >
                      <RandomLetterSwap
                        label={item.name}
                        staggerDuration={0.025}
                        transition={{
                          duration: 0.6,
                          type: "spring",
                          stiffness: 280,
                          damping: 20,
                        }}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                variants={collapsedIconVariants}
                animate={!isCollapsed ? "expanded" : "collapsed"}
              >
                <Menu className="h-5 w-5 2xl:h-7 2xl:w-7 text-[#00C4FF]" />
              </motion.div>
            </div>
          </motion.nav>
        </div>
      </div>
    </>
  );
}
