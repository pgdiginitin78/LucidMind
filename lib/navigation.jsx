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

export const Link = React.forwardRef(function Link({ href, to, children, ...props }, ref) {
  const target = to || href || "#";

  // External links
  if (typeof target === "string" && (target.startsWith("http://") || target.startsWith("https://") || target.startsWith("mailto:") || target.startsWith("tel:"))) {
    return (
      <a href={target} ref={ref} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={target} ref={ref} {...props}>
      {children}
    </RouterLink>
  );
});

export default Link;
