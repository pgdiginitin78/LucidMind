"use client";

import { useEffect, useRef, lazy, Suspense } from "react";
import { usePathname } from "@/lib/navigation";

// Lazy-load Navbar and Footer to prevent them from blocking the initial JS parse.
// They are UI chrome, not critical to LCP content.
const Navbar = lazy(() => import("@/components/navbar/Navbar"));
const Footer = lazy(() => import("@/components/footer/Footer"));
const ScrollToTopButton = lazy(() => import("@/components/ui/ScrollToTopButton"));

function ScrollToTop({ lenisRef }) {
  const pathname = usePathname();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "scrollRestoration" in window.history
    ) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
    lenisRef.current?.scrollTo(0, { immediate: true });

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
      lenisRef.current?.scrollTo(0, { immediate: true });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [lenisRef]);

  useEffect(() => {
    window.scrollTo(0, 0);
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname, lenisRef]);

  return null;
}

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const lenisRef = useRef(null);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    // Defer heavy scroll library initialization until after first paint
    // Use requestIdleCallback if available, with setTimeout fallback
    const initScrollLibraries = () => {
      import("lenis").then(({ default: Lenis }) => {
        import("gsap").then(({ default: gsap }) => {
          import("gsap/ScrollTrigger").then(({ default: ScrollTrigger }) => {
            if (lenisRef.current) return; // guard double init

            const lenis = new Lenis({
              duration: 1.2,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              smoothWheel: true,
              smoothTouch: false,
              wheelMultiplier: 1,
              touchMultiplier: 1.5,
            });
            lenisRef.current = lenis;
            if (typeof window !== "undefined") {
              window.__lenis = lenis;
            }

            gsap.registerPlugin(ScrollTrigger);
            lenis.on("scroll", ScrollTrigger.update);

            const updateTicker = (time) => {
              lenis.raf(time * 1000);
            };

            gsap.ticker.add(updateTicker);
            gsap.ticker.lagSmoothing(0);
          });
        });
      });
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(initScrollLibraries, { timeout: 2000 });
      return () => {
        window.cancelIdleCallback(idleId);
        if (lenisRef.current) {
          lenisRef.current.destroy();
          lenisRef.current = null;
          if (typeof window !== "undefined") window.__lenis = null;
        }
      };
    } else {
      const timer = setTimeout(initScrollLibraries, 500);
      return () => {
        clearTimeout(timer);
        if (lenisRef.current) {
          lenisRef.current.destroy();
          lenisRef.current = null;
          if (typeof window !== "undefined") window.__lenis = null;
        }
      };
    }
  }, [pathname]);

  const isAdminRoute = pathname?.startsWith("/admin") || pathname?.includes("/admin");

  return (
    <div className="min-h-screen overflow-x-hidden font-inter">
      <ScrollToTop lenisRef={lenisRef} />
      {!isAdminRoute && (
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
      )}

      <div
        key={pathname}
        className="page-fade-in"
      >
        {children}
      </div>

      {!isAdminRoute && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
      <Suspense fallback={null}>
        <ScrollToTopButton />
      </Suspense>
    </div>
  );
}
