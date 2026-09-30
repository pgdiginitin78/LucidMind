import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_BASE_URL } from "@/src/config/api";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

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

export function getEmbedUrl(url) {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();

  // YouTube youtu.be/<id>
  const youtuBeMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/i);
  if (youtuBeMatch && youtuBeMatch[1]) {
    return `https://www.youtube.com/embed/${youtuBeMatch[1]}`;
  }

  // YouTube watch?v=<id> or shorts/<id> or embed/<id>
  const youtubeMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/))([a-zA-Z0-9_-]+)/i);
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo vimeo.com/<id>
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Spotify open.spotify.com/episode/<id> or /track/<id> -> open.spotify.com/embed/...
  if (trimmed.includes("open.spotify.com") && !trimmed.includes("/embed/")) {
    return trimmed.replace("open.spotify.com/", "open.spotify.com/embed/");
  }

  return trimmed;
}
