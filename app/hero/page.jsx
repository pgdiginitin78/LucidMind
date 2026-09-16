import { PageTransition } from "@/components/transitions/PageTransition";
import { HomeSkeleton } from "@/components/skeletons/HomeSkeleton";
import HeroSection from "@/components/sections/heroSection/HeroSection";

export default function HeroPage() {
  return (
    <PageTransition skeleton={<HomeSkeleton />} animationType="topToBottom">
      <HeroSection />
    </PageTransition>
  );
}

