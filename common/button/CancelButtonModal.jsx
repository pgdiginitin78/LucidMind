import React from "react";
import { motion } from "framer-motion";

function CancelButtonModal({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="absolute top-4 right-4 lg:top-3 lg:right-3 z-50
      w-8 h-8 rounded-full 
      bg-gray-100 hover:bg-red-50
      border border-gray-200 hover:border-red-200
      flex items-center justify-center
      shadow-sm hover:shadow-md
      transition-colors duration-200
      group"
      aria-label="Close modal"
    >
      <svg
        className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors duration-200"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
    </motion.button>
  );
}

export default CancelButtonModal;