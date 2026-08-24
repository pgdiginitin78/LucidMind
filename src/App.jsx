import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";
import { lazy, Suspense, useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import HeroSection from "./pages/heroSection/HeroSection";

const ProblemsAndSolutions = lazy(() =>
  import("./pages/problemsAndSolutions/ProblemsAndSolutions")
);
const AdvisoryPhilosophy = lazy(() =>
  import("./pages/advisoryPhilosophy/AdvisoryPhilosophy")
);
const Articles = lazy(() => import("./pages/featuredInsights/Articles"));
const Podcasts = lazy(() => import("./pages/featuredInsights/Podcasts"));

const About = lazy(() => import("./pages/aboutUs/About"));
const Advisory = lazy(() => import("./pages/advisory/Advisory"));
const ContactUs = lazy(() => import("./pages/contactUs/ContactUs"));

const SectionFallback = () => (
  <div style={{ minHeight: "100px" }} aria-hidden="true" />
);

function ScrollToTop({ lenisRef }) {
  const { pathname } = useLocation();

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

    let timer;
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    });

    return () => clearTimeout(timer);
  }, [pathname, lenisRef]);

  return null;
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}

function HomePage() {
  return (
    <>
      
      <HeroSection />

      <Suspense fallback={<SectionFallback />}>
        <ProblemsAndSolutions />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <AdvisoryPhilosophy />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Articles />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Podcasts />
      </Suspense>
    </>
  );
}

function App() {
  const location = useLocation();
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    lenisRef.current = lenis;

    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        lenis.on("scroll", () => {
          ScrollTrigger.update();
        });

        const updateTicker = (time) => {
          lenis.raf(time * 1000);
        };

        gsap.ticker.add(updateTicker);
        gsap.ticker.lagSmoothing(0);

        const refreshTimer = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 200);

        lenis._gsapCleanup = () => {
          clearTimeout(refreshTimer);
          gsap.ticker.remove(updateTicker);
        };
      });
    });

    return () => {
      lenis._gsapCleanup?.();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <ScrollToTop lenisRef={lenisRef} />
      <Navbar />

      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          window.scrollTo(0, 0);
          lenisRef.current?.scrollTo(0, { immediate: true });
          import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
            setTimeout(() => {
              ScrollTrigger.refresh();
            }, 100);
          });
        }}
      >
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <HomePage />
              </PageWrapper>
            }
          />
          <Route
            path="/about"
            element={
              <PageWrapper>
                <Suspense fallback={<SectionFallback />}>
                  <About />
                </Suspense>
              </PageWrapper>
            }
          />
          <Route
            path="/advisory"
            element={
              <PageWrapper>
                <Suspense fallback={<SectionFallback />}>
                  <Advisory />
                </Suspense>
              </PageWrapper>
            }
          />
          <Route
            path="/hero"
            element={
              <PageWrapper>
                <HeroSection />
              </PageWrapper>
            }
          />
          <Route
            path="/contact"
            element={
              <PageWrapper>
                <Suspense fallback={<SectionFallback />}>
                  <ContactUs />
                </Suspense>
              </PageWrapper>
            }
          />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default App;
