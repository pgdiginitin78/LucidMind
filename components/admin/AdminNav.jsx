"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  LayoutDashboard,
  LogOut,
  Mic
} from "lucide-react";
import { Link, usePathname, useRouter } from "@/lib/navigation";
import { useRef, useState } from "react";
const LucidMindTransperentLogo = "/assets/logo/LucidMind logo 2.svg";
const LucidMindTransperentLogoMobile =
  "/assets/logo/LucidMind logo 2.svg";

const NAV_TABS = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  // { name: "Services", href: "/admin/services", icon: Briefcase },
  { name: "Blogs", href: "/admin/blogs", icon: BookOpen },
  { name: "Podcasts", href: "/admin/podcasts", icon: Mic },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogo, setShowLogo] = useState(true);
  const showLogoRef = useRef(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldShow = latest <= 50;
    if (showLogoRef.current !== shouldShow) {
      showLogoRef.current = shouldShow;
      setShowLogo(shouldShow);
    }

  });

  const handleLogout = () => {
    try {
      localStorage.removeItem("lucidmind_token");
      localStorage.removeItem("lucidmind_user");
    } catch {}
    window.dispatchEvent(new Event("lucidmind_auth_change"));
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#070e1e]/85 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-22">

          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                opacity: showLogo ? 1 : 0,
                y: showLogo ? 0 : -10,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                " z-50",
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
                  className="h-9 md:h-14 xl:h-18.75 2xl:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            </motion.div>
          </div>

          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive =
                tab.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(tab.href);

              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${isActive
                    ? "bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-[#00C4FF]/30"
                    : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                    }`}
                >
                  <Icon size={14} className={isActive ? "text-[#00C4FF]" : "text-white/60"} />
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">


            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 px-3 py-1.5 rounded-full border border-red-500/25 hover:bg-red-500/10 transition-all cursor-pointer"
              title="Sign Out of Admin"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div
          className="flex md:hidden items-center gap-1 pb-3 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              tab.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${isActive
                  ? "bg-[#2563EB] text-white border border-[#00C4FF]/30"
                  : "text-white/60 hover:text-white bg-white/[0.03]"
                  }`}
              >
                <Icon size={13} />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
