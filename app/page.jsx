import { PageTransition } from "@/components/transitions/PageTransition";
import { HomeSkeleton } from "@/components/skeletons/HomeSkeleton";
import HeroSection from "@/components/sections/heroSection/HeroSection";
import ProblemsAndSolutions from "@/components/sections/problemsAndSolutions/ProblemsAndSolutions";
import AdvisoryPhilosophy from "@/components/sections/advisoryPhilosophy/AdvisoryPhilosophy";
import Articles from "@/components/sections/featuredInsights/Articles";
import Podcasts from "@/components/sections/featuredInsights/Podcasts";
import { Suspense } from "react";

const SectionFallback = () => (
  <div style={{ minHeight: "80px" }} aria-hidden="true" />
);

export default function Home() {
  return (
    <PageTransition skeleton={<HomeSkeleton />} animationType="topToBottom">
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
    </PageTransition>
  );
}

