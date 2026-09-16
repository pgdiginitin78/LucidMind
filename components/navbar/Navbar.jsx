"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import {
  Menu,
  LayoutDashboard as DashboardIcon,
  Briefcase as BriefcaseIcon,
  BookOpen as BookOpenIcon,
  Mic as MicIcon,
} from "lucide-react";
const LucidMindTransperentLogo = "/assets/logo/Lucid-mind-logos1.min.webp";
const LucidMindTransperentLogoMobile =
  "/assets/logo/Lucid-mind-logos1-mobile.webp";
import { cn } from "@/lib/utils";
import { RandomLetterSwap } from "../ui/random-letter-swap";
import { Component as KineticMobileNav } from "../ui/sterling-gate-kinetic-navigation";
import { Avatar, Menu as MuiMenu, MenuItem, Divider } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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
  const [user, setUser] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

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
    } catch {
      // ignore
    }
    setUser(null);
    setProfileAnchorEl(null);
    window.dispatchEvent(new Event("lucidmind_auth_change"));
  };

  const isManuallyExpanded = useRef(false);
  const expandScrollY = useRef(0);
  const isCollapsedRef = useRef(false);
  const showLogoRef = useRef(true);

  const pathname = usePathname();
  const router = useRouter();
  const currentPath = pathname;
  const navRef = useRef(null);

  const navigateTo = (path) => {
    setProfileAnchorEl(null);
    router.push(path);
  };

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
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [updateRightOffset]);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldShow = latest <= 50;
    if (showLogoRef.current !== shouldShow) {
      showLogoRef.current = shouldShow;
      setShowLogo(shouldShow);
    }

    if (latest > 120) {
      if (!isCollapsedRef.current) {
        if (!isManuallyExpanded.current) {
          isCollapsedRef.current = true;
          setIsCollapsed(true);
        } else if (Math.abs(latest - expandScrollY.current) > 30) {
          isManuallyExpanded.current = false;
          isCollapsedRef.current = true;
          setIsCollapsed(true);
        }
      }
    } else if (latest <= 20) {
      isManuallyExpanded.current = false;
      if (isCollapsedRef.current) {
        isCollapsedRef.current = false;
        setIsCollapsed(false);
      }
    }
  });

  const handleNavClick = (e) => {
    if (isCollapsed) {
      e.preventDefault();
      e.stopPropagation();
      isManuallyExpanded.current = true;
      expandScrollY.current = window.scrollY;
      isCollapsedRef.current = false;
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
          <Link href="/" className="flex items-center group">
            <img
              src={LucidMindTransperentLogoMobile}
              srcSet={`${LucidMindTransperentLogoMobile} 200w, ${LucidMindTransperentLogo} 400w`}
              sizes="(max-width: 768px) 160px, 200px"
              alt="LucidMind"
              width={200}
              height={80}
              fetchPriority="high"
              decoding="async"
              className="h-9 md:h-14 xl:h-18.75 2xl:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
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
              "relative flex items-center px-4 2xl:px-6 overflow-hidden rounded-full border border-[#2563EB]/70 bg-[#0D1F3C]/70 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.35),0_0_20px_rgba(37,99,235,0.12)] h-12 2xl:h-16 transition-colors duration-300",
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
                      href={item.href}
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

              {user ? (
                <div className="relative flex items-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileAnchorEl(e.currentTarget);
                    }}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 2xl:px-4 py-1 2xl:py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 hover:border-[#00C4FF]/50 transition-all duration-200 cursor-pointer outline-none"
                  >
                    <Avatar
                      sx={{
                        width: { xs: 26, "2xl": 32 },
                        height: { xs: 26, "2xl": 32 },
                        background:
                          "linear-gradient(135deg, #2563EB 0%, #00C4FF 100%)",
                        color: "#ffffff",
                        fontSize: { xs: "0.78rem", "2xl": "0.9rem" },
                        fontWeight: 700,
                        border: "1.5px solid rgba(0, 196, 255, 0.5)",
                        boxShadow: "0 0 10px rgba(0, 196, 255, 0.3)",
                      }}
                    >
                      {user.username ? (
                        user.username.charAt(0).toUpperCase()
                      ) : (
                        <PersonIcon sx={{ fontSize: 16 }} />
                      )}
                    </Avatar>
                    <span className="text-white font-medium text-xs sm:text-sm 2xl:text-base capitalize tracking-wide hidden sm:inline-block">
                      {user.username || "Admin"}
                    </span>
                    <KeyboardArrowDownIcon
                      sx={{
                        fontSize: 18,
                        color: "rgba(255, 255, 255, 0.65)",
                        transition: "transform 0.2s ease",
                        transform: profileAnchorEl
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  </button>

                  <MuiMenu
                    anchorEl={profileAnchorEl}
                    open={Boolean(profileAnchorEl)}
                    onClose={() => setProfileAnchorEl(null)}
                    onClick={(e) => e.stopPropagation()}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    slotProps={{
                      paper: {
                        sx: {
                          mt: 1.5,
                          minWidth: 190,
                          backgroundColor: "rgba(13, 31, 60, 0.95)",
                          backdropFilter: "blur(24px)",
                          WebkitBackdropFilter: "blur(24px)",
                          border: "1px solid rgba(37, 99, 235, 0.45)",
                          borderRadius: "14px",
                          boxShadow:
                            "0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(37,99,235,0.25)",
                          color: "#ffffff",
                          p: 0.5,
                        },
                      },
                    }}
                  >
                    <div
                      style={{
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          background:
                            "linear-gradient(135deg, #2563EB 0%, #00C4FF 100%)",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                        }}
                      >
                        {user.username
                          ? user.username.charAt(0).toUpperCase()
                          : "A"}
                      </Avatar>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span
                          style={{
                            fontSize: "0.88rem",
                            fontWeight: 600,
                            color: "#ffffff",
                            textTransform: "capitalize",
                          }}
                        >
                          {user.username || "Admin"}
                        </span>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            color: "#00C4FF",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: "#22c55e",
                              display: "inline-block",
                            }}
                          />
                          Active
                        </span>
                      </div>
                    </div>

                    <Divider
                      sx={{
                        borderColor: "rgba(255, 255, 255, 0.12)",
                        my: 0.5,
                      }}
                    />

                    <MenuItem
                      onClick={() => navigateTo("/admin")}
                      sx={{
                        borderRadius: "8px",
                        color: "#ffffff",
                        fontSize: "0.83rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        py: 0.9,
                        "&:hover": {
                          backgroundColor: "rgba(37, 99, 235, 0.2)",
                          color: "#00C4FF",
                        },
                      }}
                    >
                      <DashboardIcon size={15} className="text-[#00C4FF]" />
                      <span>Dashboard</span>
                    </MenuItem>

                    <MenuItem
                      onClick={() => navigateTo("/admin/services")}
                      sx={{
                        borderRadius: "8px",
                        color: "#ffffff",
                        fontSize: "0.83rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        py: 0.9,
                        "&:hover": {
                          backgroundColor: "rgba(37, 99, 235, 0.2)",
                          color: "#00C4FF",
                        },
                      }}
                    >
                      <BriefcaseIcon size={15} className="text-[#00C4FF]" />
                      <span>Services</span>
                    </MenuItem>

                    <MenuItem
                      onClick={() => navigateTo("/admin/blogs")}
                      sx={{
                        borderRadius: "8px",
                        color: "#ffffff",
                        fontSize: "0.83rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        py: 0.9,
                        "&:hover": {
                          backgroundColor: "rgba(192, 132, 252, 0.2)",
                          color: "#C084FC",
                        },
                      }}
                    >
                      <BookOpenIcon size={15} className="text-[#C084FC]" />
                      <span>Blogs</span>
                    </MenuItem>

                    <MenuItem
                      onClick={() => navigateTo("/admin/podcasts")}
                      sx={{
                        borderRadius: "8px",
                        color: "#ffffff",
                        fontSize: "0.83rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        py: 0.9,
                        "&:hover": {
                          backgroundColor: "rgba(52, 211, 153, 0.2)",
                          color: "#34D399",
                        },
                      }}
                    >
                      <MicIcon size={15} className="text-[#34D399]" />
                      <span>Podcasts</span>
                    </MenuItem>

                    <Divider
                      sx={{
                        borderColor: "rgba(255, 255, 255, 0.12)",
                        my: 0.5,
                      }}
                    />

                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        borderRadius: "8px",
                        color: "#f87171",
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        py: 1,
                        "&:hover": {
                          backgroundColor: "rgba(239, 68, 68, 0.12)",
                          color: "#ef4444",
                        },
                      }}
                    >
                      <LogoutIcon sx={{ fontSize: 18 }} />
                      <span>Sign Out</span>
                    </MenuItem>
                  </MuiMenu>
                </div>
              ) : null}
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
