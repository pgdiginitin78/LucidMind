/* global process */
// Single source of truth for the backend API base URL.
//   NEXT_PUBLIC_API_URL / VITE_API_URL  -> explicit override (e.g. http://localhost:5000/api)
//   dev default                         -> http://localhost:5000/api (Express dev server)
//   production default                  -> /api (same domain as the site)
const fromEnv =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
  import.meta.env?.VITE_API_URL ||
  '';

const fallback = import.meta.env?.DEV ? 'http://localhost:5000/api' : '/api';

export const API_BASE_URL = (fromEnv || fallback).replace(/\/+$/, '');
