import { PageTransition } from "@/components/transitions/PageTransition";
import { HomeSkeleton } from "@/components/skeletons/HomeSkeleton";
import HeroSection from "@/components/sections/heroSection/HeroSection";
import SEOHead from "@/components/seo/SEOHead";

export default function HeroPage() {
  return (
    <PageTransition skeleton={<HomeSkeleton />} animationType="topToBottom">
      <SEOHead title="LucidMind" noIndex={true} />
      <HeroSection />
    </PageTransition>
  );
}

