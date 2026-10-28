/**
 * Schema.org JSON-LD Structured Data Helpers
 * Uses accurate business information for LucidMind and founder Ravishankar Pingali.
 */

const BASE_URL = "https://lucidmind.co.in";
const LOGO_URL = `${BASE_URL}/lucidmind-icon.webp`;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "LucidMind",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: LOGO_URL,
    caption: "LucidMind Logo",
  },
  description:
    "LucidMind is an executive advisory firm specializing in enterprise AI transformation, Global Capability Centre (GCC) operating models, and leadership capability building for the Adaptive Future.",
  founder: {
    "@type": "Person",
    name: "Ravishankar Pingali",
    jobTitle: "Founder & Principal Advisor",
    description:
      "Enterprise advisor, GCC leader, and board advisor helping organizations turn technology and operating models into measurable business impact.",
  },
  sameAs: ["https://www.linkedin.com/company/lucidmind-consulting/"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Advisory",
    url: `${BASE_URL}/contact`,
    availableLanguage: ["English"],
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "LucidMind",
  url: BASE_URL,
  publisher: {
    "@id": `${BASE_URL}/#organization`,
  },
};

export const advisoryServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${BASE_URL}/advisory#service`,
  name: "LucidMind Strategic Advisory",
  url: `${BASE_URL}/advisory`,
  description:
    "Specialized executive advisory services for enterprise AI transformation, GCC strategy, leadership development, and organizational capability building.",
  provider: {
    "@id": `${BASE_URL}/#organization`,
  },
  areaServed: "Worldwide",
  serviceType: [
    "Enterprise AI Advisory",
    "GCC Operating Model Strategy",
    "Executive Leadership Advisory",
    "Organizational Transformation",
  ],
};

export function createBreadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: `${BASE_URL}${item.path}`,
      })),
    ],
  };
}
