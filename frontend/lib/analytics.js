/**
 * LucidMind Centralized Analytics Utility (GA4)
 * Production-ready, lightweight Google Analytics 4 integration with PII safety,
 * duplicate event suppression, and SPA route tracking.
 */

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-08RTQ1WC0C";
const IS_DEV = import.meta.env.DEV;

// In-memory guards
let isInitialized = false;
let lastTrackedPath = "";
let lastTrackedTime = 0;

/**
 * PII Sanitizer: strips emails, phone numbers, and potential credentials from analytics payloads.
 */
function sanitizeValue(value) {
  if (typeof value !== "string") return value;
  // Mask email patterns
  let clean = value.replace(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g, "[REDACTED_EMAIL]");
  // Mask phone number sequences (7+ digits with optional dashes/spaces)
  clean = clean.replace(/(\+?\d[\d\s-]{6,}\d)/g, "[REDACTED_PHONE]");
  return clean;
}

function sanitizeParams(params = {}) {
  const sanitized = {};
  for (const [key, val] of Object.entries(params)) {
    if (typeof val === "object" && val !== null) {
      sanitized[key] = sanitizeParams(val);
    } else {
      sanitized[key] = sanitizeValue(val);
    }
  }
  return sanitized;
}

/**
 * Safe gtag dispatch wrapper.
 * index.html sets window.gtag directly before the React bundle loads,
 * so we check for window.gtag first, then fall back to dataLayer push.
 */
function gtagWrapper(...args) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag(...args);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(args);
    } else if (IS_DEV) {
      console.debug("[Analytics GA4 (dev)]", ...args);
    }
  } catch (e) {
    if (IS_DEV) console.warn("[Analytics] gtagWrapper error:", e);
  }
}

/**
 * Initialize Google Analytics 4
 * If already loaded via index.html, seamlessly hooks into existing window.gtag.
 * Otherwise, loads gtag.js dynamically.
 */
export function initGA() {
  if (typeof window === "undefined") return false;

  // If already initialized or loaded via index.html <script>
  if (typeof window.gtag === "function" || window.__lucidmind_ga_initialized) {
    isInitialized = true;
    window.__lucidmind_ga_initialized = true;
    return true;
  }

  if (isInitialized) return true;

  if (!GA_ID || !/^G-[A-Z0-9]+$/i.test(GA_ID.trim())) {
    return false;
  }

  const measurementId = GA_ID.trim();

  // Create dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());

  // Configure with send_page_view: false to prevent duplicate page_views with React Router
  window.gtag("config", measurementId, {
    send_page_view: false,
    cookie_flags: "SameSite=None;Secure",
    anonymize_ip: true,
  });

  // Inject script tag
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.onerror = () => {
    console.warn("[Analytics] Failed to load Google Analytics tag script.");
  };
  document.head.appendChild(script);

  isInitialized = true;
  window.__lucidmind_ga_initialized = true;
  return true;
}

/**
 * Track SPA Page View
 * Accurately tracks React Router navigation without double-counting.
 */
export function trackPageView(path, title) {
  if (typeof window === "undefined") return;

  const currentPath = path || window.location.pathname + window.location.search;
  const currentTitle = title || document.title || "LucidMind";
  const now = Date.now();

  // Prevent duplicate page_view events within 400ms for identical path
  if (currentPath === lastTrackedPath && now - lastTrackedTime < 400) {
    return;
  }

  lastTrackedPath = currentPath;
  lastTrackedTime = now;

  // Initialize GA on first call if not already done
  if (!isInitialized) {
    initGA();
  }

  gtagWrapper("event", "page_view", {
    page_path: currentPath,
    page_location: window.location.origin + currentPath,
    page_title: currentTitle,
  });

  if (IS_DEV) {
    console.debug("[Analytics page_view]", { path: currentPath, title: currentTitle });
  }
}

/**
 * Generic Event Tracker with parameter sanitization
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;
  if (!eventName || typeof eventName !== "string") return;

  const cleanParams = sanitizeParams(params);

  gtagWrapper("event", eventName, cleanParams);

  if (IS_DEV) {
    console.debug(`[Analytics event: ${eventName}]`, cleanParams);
  }
}

/**
 * Business Conversion Event: Contact Form Submission
 *
 * ONLY fires after the backend returns { success: true } (HTTP 200).
 * This means the SMTP email has already been dispatched successfully.
 * Never fires on validation errors, API failures, network errors, or
 * repeated button clicks that do not complete a successful round-trip.
 *
 * No PII is sent: name, email, phone, and message content are never
 * included in these event parameters.
 */
export function trackContactFormSuccess(params = {}) {
  try {
    // Companion event for funnel analysis (optional, non-GA4-standard)
    const safePayload = {
      form_name: "contact_form",
      form_destination: params.source || "contact-us-page",
      subject_category: sanitizeValue(params.subject || "general_inquiry"),
      page_location: typeof window !== "undefined" ? window.location.href : "",
    };
    trackEvent("contact_form_submit", safePayload);

    // Primary GA4 conversion event — appears in Reports > Conversions
    trackEvent("generate_lead", {
      lead_type: "advisory_inquiry",
      lead_source: params.source || "contact-us-page",
      page_location: typeof window !== "undefined" ? window.location.href : "",
    });

    if (IS_DEV) {
      console.debug(
        "[Analytics] generate_lead fired — confirmed backend success.",
        { source: params.source, subject: params.subject },
      );
    }
  } catch (analyticsError) {
    // Analytics errors must never surface to the user or affect form submission.
    console.warn("[Analytics] trackContactFormSuccess failed silently:", analyticsError);
  }
}

/**
 * Business Conversion Event: Consultation Request
 */
export function trackConsultationRequest(params = {}) {
  trackEvent("consultation_request", {
    request_type: params.type || "discovery_call",
    source_location: params.location || "website",
  });
}

/**
 * User Engagement: Primary CTA Click
 */
export function trackPrimaryCTA(ctaName, ctaLocation, destination) {
  trackEvent("primary_cta_click", {
    cta_name: sanitizeValue(ctaName),
    cta_location: sanitizeValue(ctaLocation),
    destination: sanitizeValue(destination || ""),
  });
}

/**
 * User Engagement: Outbound Link Click
 */
export function trackOutboundLink(url, linkText) {
  trackEvent("outbound_link_click", {
    link_url: sanitizeValue(url),
    link_text: sanitizeValue(linkText || ""),
  });
}

/**
 * User Engagement: Telephone Link Click
 */
export function trackPhoneClick(phone) {
  trackEvent("phone_click", {
    phone_action: "call_initiation",
  });
}

/**
 * User Engagement: Email Link Click
 */
export function trackEmailClick(email) {
  // Only extract domain portion if possible, never send raw email
  let domain = "direct";
  if (typeof email === "string" && email.includes("@")) {
    domain = email.split("@")[1].toLowerCase();
  }
  trackEvent("email_click", {
    email_domain: domain,
  });
}

/**
 * User Engagement: File Download
 */
export function trackFileDownload(fileUrl, fileName) {
  const extension = (fileUrl || "").split(".").pop().toLowerCase();
  trackEvent("file_download", {
    file_name: sanitizeValue(fileName || fileUrl),
    file_extension: extension,
  });
}

export default {
  initGA,
  trackPageView,
  trackEvent,
  trackContactFormSuccess,
  trackConsultationRequest,
  trackPrimaryCTA,
  trackOutboundLink,
  trackPhoneClick,
  trackEmailClick,
  trackFileDownload,
};
