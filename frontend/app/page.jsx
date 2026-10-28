import { PageTransition } from "@/components/transitions/PageTransition";
import { HomeSkeleton } from "@/components/skeletons/HomeSkeleton";
import HeroSection from "@/components/sections/heroSection/HeroSection";
import ProblemsAndSolutions from "@/components/sections/problemsAndSolutions/ProblemsAndSolutions";
import AdvisoryPhilosophy from "@/components/sections/advisoryPhilosophy/AdvisoryPhilosophy";
import Articles from "@/components/sections/featuredInsights/Articles";
import Podcasts from "@/components/sections/featuredInsights/Podcasts";
import { Suspense } from "react";

import SEOHead from "@/components/seo/SEOHead";
import { organizationSchema } from "@/lib/schemaData";

const SectionFallback = () => (
  <div style={{ minHeight: "80px" }} aria-hidden="true" />
);

export default function Home() {
  return (
    <PageTransition skeleton={<HomeSkeleton />} animationType="topToBottom">
      <SEOHead
        title="LucidMind | Enterprise AI Transformation & GCC Advisory"
        description="LucidMind helps enterprise leaders build the strategic leadership, operating models, and AI capabilities required for the Adaptive Future. Expert advisory by Ravishankar Pingali."
        canonical="/"
        structuredData={organizationSchema}
      />
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

