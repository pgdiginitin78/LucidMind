"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";

const PageTransitionContext = createContext({
  isReady: false,
  setReady: () => {},
});

export const PageTransitionProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsReady(false);
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1500);
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

