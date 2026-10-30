
const fromEnv =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
  import.meta.env?.VITE_API_URL ||
  '';

export const API_BASE_URL = (fromEnv || '/api').replace(/\/+$/, '');
