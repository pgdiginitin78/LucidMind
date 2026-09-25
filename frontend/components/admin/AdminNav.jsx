"use client";

import { cn } from "@/lib/utils";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Mic,
  Globe,
  ExternalLink,
} from "lucide-react";
import { Link, usePathname, useRouter } from "@/lib/navigation";
import { useEffect, useState } from "react";
const LucidMindTransperentLogo = "/assets/logo/LucidMind logo 2.svg";
const LucidMindTransperentLogoMobile =
  "/assets/logo/LucidMind logo 2.svg";

const NAV_TABS = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Blogs", href: "/admin/blogs", icon: BookOpen },
  { name: "Podcasts", href: "/admin/podcasts", icon: Mic },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lucidmind_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("lucidmind_token");
      localStorage.removeItem("lucidmind_user");
    } catch {}
    window.dispatchEvent(new Event("lucidmind_auth_change"));
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#070e1e]/90 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center group"
              title="Return to LucidMind Home"
            >
              <img
                src={LucidMindTransperentLogoMobile}
                srcSet={`${LucidMindTransperentLogoMobile} 200w, ${LucidMindTransperentLogo} 400w`}
                sizes="(max-width: 768px) 140px, 180px"
                alt="LucidMind"
                width={180}
                height={72}
                fetchPriority="high"
                decoding="async"
                className="h-11 sm:h-13 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop & Tablet Navigation Pill */}
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
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? "bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-[#00C4FF]/30"
                      : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <Icon
                    size={14}
                    className={isActive ? "text-[#00C4FF]" : "text-white/60"}
                  />
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right actions: View Website, User Profile, Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-[#00C4FF] px-2.5 sm:px-3 py-1.5 rounded-full border border-white/10 hover:border-[#00C4FF]/40 bg-white/[0.03] hover:bg-white/[0.08] transition-all"
              title="View Public Website"
            >
              <Globe size={13} className="text-[#00C4FF]" />
              <span className="hidden sm:inline">View Website</span>
            </Link>

            {user && (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#00C4FF] flex items-center justify-center text-[10px] font-bold text-white">
                  {user.username ? user.username.charAt(0).toUpperCase() : "A"}
                </div>
                <span className="text-xs font-medium text-white/80 capitalize">
                  {user.username || "Admin"}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 px-2.5 sm:px-3 py-1.5 rounded-full border border-red-500/25 hover:bg-red-500/10 transition-all cursor-pointer"
              title="Sign Out of Admin"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile & Small Tablet Navigation Tabs */}
        <div
          className="flex md:hidden items-center gap-1.5 pb-2.5 pt-1 overflow-x-auto"
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#2563EB] text-white border border-[#00C4FF]/30 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                    : "text-white/70 hover:text-white bg-white/[0.04] border border-white/[0.06]"
                }`}
              >
                <Icon
                  size={13}
                  className={isActive ? "text-[#00C4FF]" : "text-white/60"}
                />
                <span>{tab.name}</span>
              </Link>
            );
          })}

          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/60 hover:text-[#00C4FF] bg-white/[0.02] border border-white/[0.06] whitespace-nowrap ml-auto"
          >
            <Globe size={12} className="text-[#00C4FF]" />
            <span>Website</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
