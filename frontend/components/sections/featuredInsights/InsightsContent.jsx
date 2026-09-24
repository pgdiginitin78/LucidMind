"use client";
import { useEffect } from "react";
import { usePageReady } from "@/components/transitions/PageTransitionContext";
import InsightsHub from "./InsightsHub";
import Podcasts from "./Podcasts";

export default function InsightsContent() {
  const { setReady } = usePageReady();

  useEffect(() => {
    setReady(true);
  }, [setReady]);

  return (
    <div className="relative w-full min-h-screen bg-[#040914] text-slate-100 selection:bg-[#00C4B4]/30 selection:text-white overflow-x-hidden">
      <InsightsHub />
 
    </div>
  );
}
