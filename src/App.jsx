import React from "react";
import Navbar from "./components/navbar/Navbar";
import HeroSection from "./pages/heroSection/HeroSection";
import ProblemsAndSolutions from "./pages/problemsAndSolutions/ProblemsAndSolutions";
import AdvisoryPhilosophy from "./pages/advisoryPhilosophy/AdvisoryPhilosophy";
import Articles from "./pages/featuredInsights/Articles";
import Podcasts from "./pages/featuredInsights/Podcasts";
import Footer from "./components/footer/Footer";

import "./App.css";

function App() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <HeroSection />
      <ProblemsAndSolutions />
      <AdvisoryPhilosophy />
      <Articles />
      <Podcasts />
      <Footer />
    </div>
  );
}

export default App;
