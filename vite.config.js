import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendPort = env.BACKEND_PORT || '5001';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
        '@components': path.resolve(__dirname, './components'),
      },
    },
    define: {
      // Inject env vars at build time so NEXT_PUBLIC_API_URL works in production
      'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(env.NEXT_PUBLIC_API_URL || ''),
      'process.env.NEXT_PUBLIC_PAYLOAD_SECRET': JSON.stringify(env.NEXT_PUBLIC_PAYLOAD_SECRET || ''),
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: `http://localhost:${backendPort}`,
          changeOrigin: true,
        },
        '/uploads': {
          target: `http://localhost:${backendPort}`,
          changeOrigin: true,
        },
      },
    },
  };
});
