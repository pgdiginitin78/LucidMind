"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { usePathname } from "@/lib/navigation";

const PageTransitionContext = createContext({
  isReady: false,
  setReady: () => {},
});

export const PageTransitionProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsReady(false);
    // Reduced from 1500ms to 400ms — 1500ms was causing FCP/LCP delays on mobile
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [pathname]);

  const setReady = useCallback((state) => {
    setIsReady(state);
  }, []);

  return (
    <PageTransitionContext.Provider value={{ isReady, setReady }}>
      {children}
    </PageTransitionContext.Provider>
  );
};

export const usePageReady = () => useContext(PageTransitionContext);
