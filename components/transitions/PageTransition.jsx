"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageReady, PageTransitionProvider } from "./PageTransitionContext";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

let isInitialPageLoad = true;

function PageTransitionInner({ skeleton, children, animationType = "fade" }) {
  const { isReady, setReady } = usePageReady();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isInitial] = React.useState(isInitialPageLoad);

  React.useEffect(() => {
    if (isInitialPageLoad) {
      isInitialPageLoad = false;
      setReady(true);
    }
  }, [setReady]);

  const pageVariants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
    },
    topToBottom: {
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 } },
    },
    bottomToTop: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.98 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    }
  };

  const selectedVariant = prefersReducedMotion ? pageVariants.fade : (pageVariants[animationType] || pageVariants.fade);

  if (isInitial) {
    return (
      <div className="relative w-full min-h-screen">
        <div className="w-full h-full">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
 
      <AnimatePresence>
        {!isReady && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 z-50 w-full h-full bg-[#050B18]"
          >
            <style>{`
              footer { display: none !important; }
              body { overflow: hidden !important; }
            `}</style>
            {skeleton}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="w-full h-full"
        initial="hidden"
        animate={isReady ? "visible" : "hidden"}
        variants={selectedVariant}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function PageTransition({ skeleton, children, animationType }) {
  return (
    <PageTransitionProvider>
      <PageTransitionInner skeleton={skeleton} animationType={animationType}>
        {children}
      </PageTransitionInner>
    </PageTransitionProvider>
  );
}
