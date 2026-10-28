import React from "react";
import { Link as RouterLink, useNavigate, useLocation, useSearchParams as useRRSearchParams } from "react-router-dom";

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    push: (to) => navigate(to),
    replace: (to) => navigate(to, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => window.location.reload(),
    prefetch: () => {},
    pathname: location.pathname,
  };
}

export function usePathname() {
  const location = useLocation();
  return location.pathname;
}

export function useSearchParams() {
  return useRRSearchParams();
}

export { useLocation };

import {
  trackOutboundLink,
  trackEmailClick,
  trackPhoneClick,
  trackFileDownload,
} from "@/lib/analytics";

export const Link = React.forwardRef(function Link({ href, to, children, onClick, ...props }, ref) {
  const target = to || href || "#";

  const handleClick = (e) => {
    if (typeof target === "string") {
      if (target.startsWith("mailto:")) {
        trackEmailClick(target.replace(/^mailto:/i, ""));
      } else if (target.startsWith("tel:")) {
        trackPhoneClick(target.replace(/^tel:/i, ""));
      } else if (target.startsWith("http://") || target.startsWith("https://")) {
        try {
          const urlObj = new URL(target);
          if (!urlObj.hostname.includes("lucidmind.co.in")) {
            const label = typeof children === "string" ? children : urlObj.hostname;
            trackOutboundLink(target, label);
          }
        } catch {}
      }

      // Check for file download
      if (/\.(pdf|docx?|xlsx?|zip|csv|pptx?)$/i.test(target)) {
        trackFileDownload(target);
      }
    }

    if (typeof onClick === "function") {
      onClick(e);
    }
  };

  // External links
  if (
    typeof target === "string" &&
    (target.startsWith("http://") ||
      target.startsWith("https://") ||
      target.startsWith("mailto:") ||
      target.startsWith("tel:"))
  ) {
    return (
      <a href={target} ref={ref} onClick={handleClick} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={target} ref={ref} onClick={handleClick} {...props}>
      {children}
    </RouterLink>
  );
});

export default Link;
