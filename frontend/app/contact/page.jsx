import { PageTransition } from "@/components/transitions/PageTransition";
import { ContactUsSkeleton } from "@/components/skeletons/ContactUsSkeleton";
import ContactUs from "@/components/sections/contactUs/ContactUs";
import { Suspense } from "react";

const SectionFallback = () => (
  <div style={{ minHeight: "80px" }} aria-hidden="true" />
);

export default function ContactPage() {
  return (
    <PageTransition skeleton={<ContactUsSkeleton />} animationType="topToBottom">
      <Suspense fallback={<SectionFallback />}>
        <ContactUs />
      </Suspense>
    </PageTransition>
  );
}

