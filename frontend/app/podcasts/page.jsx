import { PageTransition } from "@/components/transitions/PageTransition";
import { PodcastSkeleton } from "@/components/skeletons/PodcastSkeleton";
import PodcastsHub from "@/components/sections/podcasts/PodcastsHub";
import { Suspense } from "react";

import SEOHead from "@/components/seo/SEOHead";
import { createBreadcrumbSchema } from "@/lib/schemaData";

const SectionFallback = () => (
  <div style={{ minHeight: "80px" }} aria-hidden="true" />
);

const podcastsBreadcrumbs = createBreadcrumbSchema([{ name: "Podcasts", path: "/podcasts" }]);

export default function PodcastsPage() {
  return (
    <PageTransition skeleton={<PodcastSkeleton />} animationType="topToBottom">
      <SEOHead
        title="Executive Podcasts & Conversations | LucidMind"
        description="Candid, strategic conversations with Ravishankar Pingali on leadership, AI, and the evolving future of Global Capability Centres."
        canonical="/podcasts"
        structuredData={podcastsBreadcrumbs}
      />
      <Suspense fallback={<SectionFallback />}>
        <PodcastsHub />
      </Suspense>
    </PageTransition>
  );
}
