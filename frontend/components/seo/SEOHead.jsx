import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

const DEFAULT_ORIGIN = "https://lucidmind.co.in";
const DEFAULT_IMAGE = `${DEFAULT_ORIGIN}/lucidmind-icon.webp`;
const SITE_NAME = "LucidMind";

/**
 * Helper to update or create a <meta> tag by name or property
 */
function setMetaTag(attributeName, attributeValue, content) {
  if (typeof document === "undefined") return;
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content || "");
}

/**
 * Helper to update or create a <link rel="..."> tag
 */
function setLinkTag(rel, href) {
  if (typeof document === "undefined") return;
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href || "");
}

/**
 * SEOHead Component
 * Dynamically updates document head metadata, canonical URL, Open Graph,
 * Twitter Card, robots directives, and JSON-LD structured data.
 * Also triggers GA4 page_view tracking synchronously with title update.
 */
export default function SEOHead({
  title = "LucidMind | Enterprise AI Transformation & GCC Advisory",
  description = "LucidMind helps enterprise leaders build the strategic leadership, operating models, and AI capabilities required for the Adaptive Future.",
  canonical,
  ogType = "website",
  ogImage = DEFAULT_IMAGE,
  noIndex = false,
  structuredData,
}) {
  const location = useLocation();
  const currentPath = canonical || location.pathname;
  const canonicalUrl = `${DEFAULT_ORIGIN}${currentPath === "/" ? "" : currentPath.replace(/\/$/, "")}`;

  useEffect(() => {
    // 1. Title
    document.title = title;

    // 2. Standard Meta
    setMetaTag("name", "description", description);
    setMetaTag(
      "name",
      "robots",
      noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    // 3. Canonical Link
    setLinkTag("canonical", canonicalUrl);

    // 4. Open Graph
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:site_name", SITE_NAME);
    setMetaTag("property", "og:image", ogImage);
    setMetaTag("property", "og:locale", "en_US");

    // 5. Twitter Card
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", ogImage);

    // 6. JSON-LD structured data
    let jsonLdScript = document.getElementById("seo-json-ld");
    if (structuredData) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement("script");
        jsonLdScript.id = "seo-json-ld";
        jsonLdScript.type = "application/ld+json";
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.textContent = JSON.stringify(structuredData);
    } else if (jsonLdScript) {
      jsonLdScript.remove();
    }

    // 7. Track GA4 page_view
    trackPageView(currentPath, title);
  }, [title, description, canonicalUrl, ogType, ogImage, noIndex, structuredData, currentPath]);

  return null;
}
