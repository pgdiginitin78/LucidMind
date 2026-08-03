import React from "react";
import { Routes, Route } from "react-router-dom";
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
  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/hero" element={<HeroSection />} />
        <Route path="/problems" element={<ProblemsAndSolutions />} />
        <Route path="/philosophy" element={<AdvisoryPhilosophy />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/podcasts" element={<Podcasts />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
