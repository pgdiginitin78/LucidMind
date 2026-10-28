import { PageTransition } from "@/components/transitions/PageTransition";
import { InsightsSkeleton } from "@/components/skeletons/InsightsSkeleton";
import InsightsContent from "@/components/sections/featuredInsights/InsightsContent";
import { Suspense } from "react";

import SEOHead from "@/components/seo/SEOHead";
import { createBreadcrumbSchema } from "@/lib/schemaData";

const SectionFallback = () => (
  <div style={{ minHeight: "80px" }} aria-hidden="true" />
);

const insightsBreadcrumbs = createBreadcrumbSchema([{ name: "Insights", path: "/insights" }]);

export default function InsightsPage() {
  return (
    <PageTransition skeleton={<InsightsSkeleton />} animationType="topToBottom">
      <SEOHead
        title="Executive Insights & Perspectives on AI & GCCs | LucidMind"
        description="Executive insights, strategic articles, and leadership perspectives by Ravishankar Pingali on scaling enterprise AI and building adaptive organisations."
        canonical="/insights"
        structuredData={insightsBreadcrumbs}
      />
      <Suspense fallback={<SectionFallback />}>
        <InsightsContent />
      </Suspense>
    </PageTransition>
  );
}
