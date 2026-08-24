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
  <div style={{ minHeight: "80px" }} aria-hidden="true" />
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
  }, [pathname, lenisRef]);

  return null;
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    lenisRef.current = lenis;

    let isMounted = true;
    let updateTicker = null;

    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        if (!isMounted) return;
        gsap.registerPlugin(ScrollTrigger);

        lenis.on("scroll", () => {
          ScrollTrigger.update();
        });

        updateTicker = (time) => {
          lenis.raf(time * 1000);
        };

        gsap.ticker.add(updateTicker);
        gsap.ticker.lagSmoothing(0);

        lenis._gsapCleanup = () => {
          if (updateTicker) gsap.ticker.remove(updateTicker);
        };
      });
    });

    return () => {
      isMounted = false;
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
