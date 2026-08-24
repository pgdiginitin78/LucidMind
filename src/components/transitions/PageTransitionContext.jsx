import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useLocation } from "react-router-dom";

const PageTransitionContext = createContext({
  isReady: false,
  setReady: () => {},
});

export const PageTransitionProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

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
