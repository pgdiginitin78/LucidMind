import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  build: {
    target: "es2022",
    modulePreload: false,
    cssMinify: true,
    minify: "esbuild",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router-dom/") ||
            id.includes("node_modules/scheduler/")
          ) {
            return "vendor-react";
          }
          if (id.includes("node_modules/framer-motion/")) {
            return "vendor-framer";
          }
          if (
            id.includes("node_modules/gsap/") ||
            id.includes("node_modules/@gsap/")
          ) {
            return "vendor-gsap";
          }
          if (id.includes("node_modules/lenis/")) {
            return "vendor-lenis";
          }
          if (
            id.includes("node_modules/@mui/") ||
            id.includes("node_modules/@emotion/")
          ) {
            return "vendor-mui";
          }
          if (
            id.includes("node_modules/react-hook-form/") ||
            id.includes("node_modules/@hookform/") ||
            id.includes("node_modules/yup/") ||
            id.includes("node_modules/sweetalert2/")
          ) {
            return "vendor-form";
          }
          if (
            id.includes("node_modules/lucide-react/") ||
            id.includes("node_modules/react-icons/")
          ) {
            return "vendor-icons";
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ["framer-motion", "gsap", "lenis", "react-router-dom"],
  },
});
