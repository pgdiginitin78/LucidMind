import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Local dev talks to the local backend by default. To view LIVE data locally, create
  // frontend/.env.local with: DEV_API_TARGET=https://lucidmind.co.in
  const apiTarget = env.DEV_API_TARGET || 'http://localhost:5000';
  return {
    base: '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
        '@components': path.resolve(__dirname, './components'),
      },
    },
    define: {
      'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(env.NEXT_PUBLIC_API_URL || ''),
      'process.env.NEXT_PUBLIC_PAYLOAD_SECRET': JSON.stringify(env.NEXT_PUBLIC_PAYLOAD_SECRET || ''),
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            if (!apiTarget.startsWith('http://localhost') && !apiTarget.startsWith('http://127.0.0.1')) {
              proxy.on('proxyReq', (proxyReq) => {
                proxyReq.setHeader('Origin', apiTarget);
                proxyReq.setHeader('Referer', apiTarget);
              });
            }
          },
        },
        '/uploads': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            if (!apiTarget.startsWith('http://localhost') && !apiTarget.startsWith('http://127.0.0.1')) {
              proxy.on('proxyReq', (proxyReq) => {
                proxyReq.setHeader('Origin', apiTarget);
                proxyReq.setHeader('Referer', apiTarget);
              });
            }
          },
        },
      },
    },
    build: {
      outDir: path.resolve(__dirname, '../dist'),
      emptyOutDir: true,
      target: 'es2020',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 600,
      minify: 'esbuild',
      sourcemap: false,
      reportCompressedSize: false, // Speeds up build
      rollupOptions: {
        output: {
          // Use content-hash naming for long-term caching
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          manualChunks(id) {
            // React core - highest priority, smallest chunk
            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')
            ) {
              return 'react-core';
            }
            // React Router
            if (
              id.includes('node_modules/react-router') ||
              id.includes('node_modules/@remix-run')
            ) {
              return 'router';
            }
            // Framer Motion - large animation library
            if (id.includes('node_modules/framer-motion')) {
              return 'framer-motion';
            }
            // GSAP ecosystem
            if (id.includes('node_modules/gsap') || id.includes('node_modules/@gsap')) {
              return 'gsap';
            }
            // Lenis smooth scroll
            if (id.includes('node_modules/lenis')) {
              return 'lenis';
            }
            // lucide-react icons
            if (id.includes('node_modules/lucide-react')) {
              return 'lucide';
            }
            // Form libraries
            if (
              id.includes('node_modules/react-hook-form') ||
              id.includes('node_modules/@hookform') ||
              id.includes('node_modules/yup')
            ) {
              return 'forms';
            }
            // SweetAlert2
            if (id.includes('node_modules/sweetalert2')) {
              return 'sweetalert';
            }
            // MUI - admin only, should stay in lazy chunks
            if (id.includes('node_modules/@mui') || id.includes('node_modules/@emotion')) {
              return 'mui-admin';
            }
            // Spline 3D - used only in contact page (lazy)
            if (id.includes('node_modules/@splinetool')) {
              return 'spline-3d';
            }
            // Three.js ecosystem - not used currently but installed
            if (
              id.includes('node_modules/three') ||
              id.includes('node_modules/@react-three') ||
              id.includes('node_modules/ogl') ||
              id.includes('node_modules/webgl-fluid')
            ) {
              return 'three-webgl';
            }
          },
        },
      },
    },
  };
});
