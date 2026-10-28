import { PageTransition } from "@/components/transitions/PageTransition";
import { ContactUsSkeleton } from "@/components/skeletons/ContactUsSkeleton";
import ContactUs from "@/components/sections/contactUs/ContactUs";
import { Suspense } from "react";

import SEOHead from "@/components/seo/SEOHead";
import { createBreadcrumbSchema } from "@/lib/schemaData";

const SectionFallback = () => (
  <div style={{ minHeight: "80px" }} aria-hidden="true" />
);

const contactBreadcrumbs = createBreadcrumbSchema([{ name: "Contact", path: "/contact" }]);

export default function ContactPage() {
  return (
    <PageTransition skeleton={<ContactUsSkeleton />} animationType="topToBottom">
      <SEOHead
        title="Contact LucidMind | Schedule an Executive Conversation"
        description="Connect with LucidMind to discuss enterprise AI strategy, GCC acceleration, leadership advisory, or speak directly with Ravishankar Pingali."
        canonical="/contact"
        structuredData={contactBreadcrumbs}
      />
      <Suspense fallback={<SectionFallback />}>
        <ContactUs />
      </Suspense>
    </PageTransition>
  );
}

