import { PageTransition } from "@/components/transitions/PageTransition";
import { AboutSkeleton } from "@/components/skeletons/AboutSkeleton";
import AboutUs from "@/components/sections/aboutUs/About";
import { Suspense } from "react";

import SEOHead from "@/components/seo/SEOHead";
import { createBreadcrumbSchema } from "@/lib/schemaData";

const SectionFallback = () => (
  <div style={{ minHeight: "80px" }} aria-hidden="true" />
);

const aboutBreadcrumbs = createBreadcrumbSchema([{ name: "About Us", path: "/about" }]);

export default function AboutPage() {
  return (
    <PageTransition skeleton={<AboutSkeleton />} animationType="topToBottom">
      <SEOHead
        title="About LucidMind | Our Mission, Leadership & Philosophy"
        description="Discover LucidMind's vision for the Adaptive Future. Learn about founder Ravishankar Pingali and our core advisory philosophy: Think Clearly, Build Capability, Deliver Impact."
        canonical="/about"
        structuredData={aboutBreadcrumbs}
      />
      <Suspense fallback={<SectionFallback />}>
        <AboutUs />
      </Suspense>
    </PageTransition>
  );
}

