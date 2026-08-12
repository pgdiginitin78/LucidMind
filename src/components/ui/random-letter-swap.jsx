"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function RandomLetterSwap({
  label = "",
  className = "",
  staggerDuration = 0.025,
  transition = { duration: 0.6, type: "spring", stiffness: 300, damping: 20 },
  reverse = false,
  staggerFrom = "first",
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false);
  const characters = label ? label.split("") : [];

  const getStaggerDelay = (index, total) => {
    if (staggerFrom === "last") {
      return (total - 1 - index) * staggerDuration;
    }
    if (staggerFrom === "center") {
      const center = (total - 1) / 2;
      return Math.abs(center - index) * staggerDuration;
    }
    if (staggerFrom === "random") {
      const hash = (index * 7) % total;
      return hash * staggerDuration;
    }
    return index * staggerDuration;
  };

  return (
    <span
      className={cn("relative inline-flex overflow-hidden cursor-pointer select-none", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <span className="inline-flex items-center">
        {characters.map((char, i) => {
          if (char === " ") {
            return (
              <span key={i} className="inline-block">
                &nbsp;
              </span>
            );
          }

          const delay = getStaggerDelay(i, characters.length);

          return (
            <span
              key={i}
              className="relative inline-block overflow-hidden h-[1.25em] leading-[1.25em]"
            >
              <motion.span
                inherit={false}
                initial={false}
                className="inline-block"
                animate={{
                  y: isHovered ? (reverse ? "100%" : "-100%") : "0%",
                }}
                transition={{
                  ...transition,
                  delay,
                }}
              >
                {char}
              </motion.span>

              <motion.span
                inherit={false}
                initial={false}
                className="absolute left-0 inline-block"
                style={{
                  top: reverse ? "-100%" : "100%",
                }}
                animate={{
                  y: isHovered ? (reverse ? "100%" : "-100%") : "0%",
                }}
                transition={{
                  ...transition,
                  delay,
                }}
              >
                {char}
              </motion.span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

export default RandomLetterSwap;
