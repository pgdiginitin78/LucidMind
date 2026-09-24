import { PageTransition } from "@/components/transitions/PageTransition";
import { PodcastSkeleton } from "@/components/skeletons/PodcastSkeleton";
import PodcastsHub from "@/components/sections/podcasts/PodcastsHub";
import { Suspense } from "react";

export const metadata = {
  title: "Executive Podcasts | LucidMind",
  description:
    "Candid, strategic conversations with Ravishankar Pingali on leadership, AI, and the evolving future of Global Capability Centres.",
};

const SectionFallback = () => (
  <div style={{ minHeight: "80px" }} aria-hidden="true" />
);

export default function PodcastsPage() {
  return (
    <PageTransition skeleton={<PodcastSkeleton />} animationType="topToBottom">
      <Suspense fallback={<SectionFallback />}>
        <PodcastsHub />
      </Suspense>
    </PageTransition>
  );
}
