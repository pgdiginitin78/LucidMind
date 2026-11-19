import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_BASE_URL } from "@/src/config/api";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const DEFAULT_ARTICLE_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23071328'/%3E%3Cstop offset='60%25' stop-color='%230B1F3A'/%3E%3Cstop offset='100%25' stop-color='%230D2B4E'/%3E%3C/linearGradient%3E%3ClinearGradient id='accent' x1='0' y1='0' x2='1' y2='0'%3E%3Cstop offset='0%25' stop-color='%2300C4B4' stop-opacity='0.35'/%3E%3Cstop offset='100%25' stop-color='%232563EB' stop-opacity='0.35'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='675' fill='url(%23bg)'/%3E%3Ccircle cx='980' cy='120' r='260' fill='%2300C4B4' fill-opacity='0.08'/%3E%3Ccircle cx='220' cy='580' r='300' fill='%232563EB' fill-opacity='0.10'/%3E%3Cpath d='M0 520 Q360 440 720 510 T1200 460 L1200 675 L0 675 Z' fill='url(%23accent)'/%3E%3C/svg%3E";

export function resolveImageUrl(src) {
  if (!src || typeof src !== "string") return "";
  const trimmed = src.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }
  if (trimmed.startsWith("/uploads/")) {
    const backendOrigin = (API_BASE_URL || "").replace(/\/api\/?$/, "");
    return `${backendOrigin}${trimmed}`;
  }
  return trimmed;
}

export function resolveSafeImageUrl(src, fallback = DEFAULT_ARTICLE_IMAGE) {
  const resolved = resolveImageUrl(src);
  if (!resolved) return fallback;
  if (resolved.startsWith("data:") || resolved.startsWith("blob:")) {
    return resolved;
  }
  try {
    return encodeURI(decodeURI(resolved));
  } catch {
    return resolved;
  }
}

export function getEmbedUrl(url) {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();

  // YouTube youtu.be/<id>
  const youtuBeMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/i);
  if (youtuBeMatch && youtuBeMatch[1]) {
    return `https://www.youtube.com/embed/${youtuBeMatch[1]}`;
  }

  // YouTube watch?v=<id> or shorts/<id> or embed/<id>
  const youtubeMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/))([a-zA-Z0-9_-]+)/i,
  );
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo vimeo.com/<id>
  const vimeoMatch = trimmed.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/i,
  );
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Spotify open.spotify.com/episode/<id> or /track/<id> -> open.spotify.com/embed/...
  if (trimmed.includes("open.spotify.com") && !trimmed.includes("/embed/")) {
    return trimmed.replace("open.spotify.com/", "open.spotify.com/embed/");
  }

  return trimmed;
}
