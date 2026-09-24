import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoader } from "./LoaderContext";

const CommonLoader = ({ loadingText = "Please wait...", size = "medium" }) => {
  const { isLoading } = useLoader();

  const sizes = {
    small: "w-16 h-16",
    medium: "w-24 h-24",
    large: "w-32 h-32",
  };

  const textSizes = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}
          >
            <svg className={sizes[size]} viewBox="0 0 100 100">
              <defs>
                <linearGradient id="circularGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
              </defs>

              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />

              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#circularGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ pathLength: 0, rotate: 0 }}
                animate={{
                  pathLength: [0, 0.75, 0],
                  rotate: 360,
                }}
                transition={{
                  pathLength: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            </svg>

            {loadingText && (
              <motion.p
                className={`text-white ${textSizes[size]} font-light tracking-wide`}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {loadingText}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommonLoader;