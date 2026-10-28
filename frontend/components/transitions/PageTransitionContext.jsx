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
    // Set ready immediately — any delay here directly delays FCP/LCP
    setIsReady(true);
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
