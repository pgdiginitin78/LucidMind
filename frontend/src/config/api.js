/* global process */
// Single source of truth for the backend API base URL.
// Default is the same-origin relative path `/api` in EVERY environment:
//   local dev  -> Vite dev server proxies /api to http://localhost:5000 (see vite.config.js)
//   production -> the same domain serves both the site and /api
// No CORS and no per-environment URL to keep in sync.
// Only set NEXT_PUBLIC_API_URL / VITE_API_URL if the API lives on a different domain.
const fromEnv =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
  import.meta.env?.VITE_API_URL ||
  '';

export const API_BASE_URL = (fromEnv || '/api').replace(/\/+$/, '');
