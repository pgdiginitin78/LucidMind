import { PageTransition } from "@/components/transitions/PageTransition";
import { AdvisorySkeleton } from "@/components/skeletons/AdvisorySkeleton";
import Advisory from "@/components/sections/advisory/Advisory";
import { Suspense } from "react";

const SectionFallback = () => (
  <div style={{ minHeight: "80px" }} aria-hidden="true" />
);

export default function AdvisoryPage() {
  return (
    <PageTransition skeleton={<AdvisorySkeleton />} animationType="topToBottom">
      <Suspense fallback={<SectionFallback />}>
        <Advisory />
      </Suspense>
    </PageTransition>
  );
}

