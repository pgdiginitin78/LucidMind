import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/navbar/Navbar";
import HeroSection from "./pages/heroSection/HeroSection";
import ProblemsAndSolutions from "./pages/problemsAndSolutions/ProblemsAndSolutions";
import AdvisoryPhilosophy from "./pages/advisoryPhilosophy/AdvisoryPhilosophy";
import Articles from "./pages/featuredInsights/Articles";
import Podcasts from "./pages/featuredInsights/Podcasts";
import Footer from "./components/footer/Footer";
import About from "./pages/aboutUs/About";
import ContactUs from "./pages/contactUs/ContactUs";
import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
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

  return (
    <div className="bg-[#050B18] min-h-screen">
      <ScrollToTop />
      <Navbar />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/hero" element={<PageWrapper><HeroSection /></PageWrapper>} />
          <Route path="/problems" element={<PageWrapper><ProblemsAndSolutions /></PageWrapper>} />
          <Route path="/philosophy" element={<PageWrapper><AdvisoryPhilosophy /></PageWrapper>} />
          <Route path="/articles" element={<PageWrapper><Articles /></PageWrapper>} />
          <Route path="/podcasts" element={<PageWrapper><Podcasts /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><ContactUs /></PageWrapper>} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default App;
