import { PageTransition } from "@/components/transitions/PageTransition";
import { AdvisorySkeleton } from "@/components/skeletons/AdvisorySkeleton";
import Advisory from "@/components/sections/advisory/Advisory";
import { Suspense } from "react";

import SEOHead from "@/components/seo/SEOHead";
import { advisoryServiceSchema } from "@/lib/schemaData";

const SectionFallback = () => (
  <div style={{ minHeight: "80px" }} aria-hidden="true" />
);

export default function AdvisoryPage() {
  return (
    <PageTransition skeleton={<AdvisorySkeleton />} animationType="topToBottom">
      <SEOHead
        title="Enterprise Advisory Services & AI Strategy | LucidMind"
        description="Specialized executive advisory for enterprise AI transformation, Global Capability Centres (GCC) strategy, executive coaching, and operating model evolution."
        canonical="/advisory"
        structuredData={advisoryServiceSchema}
      />
      <Suspense fallback={<SectionFallback />}>
        <Advisory />
      </Suspense>
    </PageTransition>
  );
}

