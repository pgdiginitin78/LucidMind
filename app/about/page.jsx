import { PageTransition } from "@/components/transitions/PageTransition";
import { AboutSkeleton } from "@/components/skeletons/AboutSkeleton";
import AboutUs from "@/components/sections/aboutUs/About";
import { Suspense } from "react";

const SectionFallback = () => (
  <div style={{ minHeight: "80px" }} aria-hidden="true" />
);

export default function AboutPage() {
  return (
    <PageTransition skeleton={<AboutSkeleton />} animationType="topToBottom">
      <Suspense fallback={<SectionFallback />}>
        <AboutUs />
      </Suspense>
    </PageTransition>
  );
}

