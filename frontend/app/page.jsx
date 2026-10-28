import { lazy, Suspense } from "react";
import { PageTransition } from "@/components/transitions/PageTransition";
import { HomeSkeleton } from "@/components/skeletons/HomeSkeleton";
import HeroSection from "@/components/sections/heroSection/HeroSection";
import SEOHead from "@/components/seo/SEOHead";
import { organizationSchema } from "@/lib/schemaData";

// Genuinely lazy-load below-the-fold components to reduce initial JavaScript execution
const ProblemsAndSolutions = lazy(() =>
  import("@/components/sections/problemsAndSolutions/ProblemsAndSolutions")
);
const AdvisoryPhilosophy = lazy(() =>
  import("@/components/sections/advisoryPhilosophy/AdvisoryPhilosophy")
);
const Articles = lazy(() =>
  import("@/components/sections/featuredInsights/Articles")
);
const Podcasts = lazy(() =>
  import("@/components/sections/featuredInsights/Podcasts")
);

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

