"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/lib/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token =
          sessionStorage.getItem("admin_token") ||
          localStorage.getItem("admin_token");
        setIsAuth(!!token);
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("lucidmind_auth_change", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("lucidmind_auth_change", checkAuth);
    };
  }, []);

  const isLoginPage =
    pathname === "/admin/login" ||
    pathname === "/login" ||
    (pathname?.startsWith("/admin") && !isAuth);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setIsVisible(window.scrollY > 250);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    let unsubscribeLenis;
    if (typeof window !== "undefined" && window.__lenis) {
      unsubscribeLenis = window.__lenis.on("scroll", (e) => {
        const y = typeof e?.scroll === "number" ? e.scroll : window.scrollY;
        setIsVisible(y > 250);
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (typeof unsubscribeLenis === "function") {
        unsubscribeLenis();
      }
    };
  }, [pathname]);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.0 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  if (isLoginPage) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.7, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 16 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#00C4FF] text-white shadow-[0_0_24px_rgba(0,196,255,0.45)] hover:shadow-[0_0_36px_rgba(0,196,255,0.7)] border border-white/25 backdrop-blur-md cursor-pointer group"
        >
          <ArrowUp
            size={20}
            className="stroke-[2.5] group-hover:-translate-y-0.5 transition-transform duration-200"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
