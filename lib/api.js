/**
 * Central API configuration.
 * In production: calls go to https://api.lucidmind.co.in
 * In development: Vite proxy forwards /api to localhost:5001
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'https://api.lucidmind.co.in'
    : '');
