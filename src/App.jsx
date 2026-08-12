import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import About from "./pages/aboutUs/About";
import AdvisoryPhilosophy from "./pages/advisoryPhilosophy/AdvisoryPhilosophy";
import ContactUs from "./pages/contactUs/ContactUs";
import Articles from "./pages/featuredInsights/Articles";
import Podcasts from "./pages/featuredInsights/Podcasts";
import HeroSection from "./pages/heroSection/HeroSection";
import ProblemsAndSolutions from "./pages/problemsAndSolutions/ProblemsAndSolutions";

gsap.registerPlugin(ScrollTrigger);

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

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

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
      <ProblemsAndSolutions />
      <AdvisoryPhilosophy />
      <Articles />
      <Podcasts />
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
    }, 300);

    return () => {
      clearTimeout(refreshTimer);
      gsap.ticker.remove(updateTicker);
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
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 150);
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
                <About />
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
                <ContactUs />
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
