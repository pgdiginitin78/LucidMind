import { PageTransition } from "@/components/transitions/PageTransition";
import { InsightsSkeleton } from "@/components/skeletons/InsightsSkeleton";
import InsightsContent from "@/components/sections/featuredInsights/InsightsContent";
import { Suspense } from "react";

export const metadata = {
  title: "Insights & Perspectives | LucidMind",
  description:
    "Executive insights, articles, and leadership conversations on scaling enterprise AI and building adaptive organisations.",
};

const SectionFallback = () => (
  <div style={{ minHeight: "80px" }} aria-hidden="true" />
);

export default function InsightsPage() {
  return (
    <PageTransition skeleton={<InsightsSkeleton />} animationType="topToBottom">
      <Suspense fallback={<SectionFallback />}>
        <InsightsContent />
      </Suspense>
    </PageTransition>
  );
}
