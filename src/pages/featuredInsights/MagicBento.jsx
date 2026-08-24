import { useRef, useEffect, useCallback, useState, forwardRef } from 'react';
import './MagicBento.css';

const DEFAULT_PARTICLE_COUNT = 10;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '0, 196, 180';
const MOBILE_BREAKPOINT = 768;

const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

export const ParticleCard = forwardRef(({
  children,
  className = '',
  disableAnimations = false,
  style = {},
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = true,
  enableMagnetism = true,
  onClick
}, ref) => {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef([]);
  const particlesInitialized = useRef(false);
  const cachedRectRef = useRef(null);

  const setRef = useCallback((node) => {
    cardRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref]);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cachedRectRef.current = rect;
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * rect.width, Math.random() * rect.height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    particlesRef.current.forEach((particle) => {
      particle.style.transition = 'transform 0.25s ease-in, opacity 0.25s ease-in';
      particle.style.transform = 'scale(0)';
      particle.style.opacity = '0';
      setTimeout(() => { particle.parentNode?.removeChild(particle); }, 250);
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true);
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        clone.style.transition = 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.25s';
        clone.style.transform = 'scale(1)';
        clone.style.opacity = '1';

        setTimeout(() => {
          if (!clone.parentNode) return;
          clone.style.transition = 'transform ' + (2 + Math.random() * 2) + 's ease-in-out';
          clone.style.transform = 'translate(' + ((Math.random() - 0.5) * 60) + 'px, ' + ((Math.random() - 0.5) * 60) + 'px) scale(1)';
        }, 50);
      }, index * 80);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;
    let moveRafId = null;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      const rect = element.getBoundingClientRect();
      cachedRectRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        absoluteTop: rect.top + window.scrollY
      };
      animateParticles();

      if (enableTilt) {
        element.style.transition = 'transform 0.3s ease-out';
        element.style.transform = 'perspective(1000px) rotateX(4deg) rotateY(4deg)';
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      cachedRectRef.current = null;
      if (moveRafId) {
        cancelAnimationFrame(moveRafId);
        moveRafId = null;
      }
      clearAllParticles();

      if (enableTilt || enableMagnetism) {
        element.style.transition = 'transform 0.3s ease-out';
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate(0px, 0px)';
      }
    };

    const handleMouseMove = (e) => {
      if (!enableTilt && !enableMagnetism) return;
      if (moveRafId) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      moveRafId = requestAnimationFrame(() => {
        moveRafId = null;
        if (!cachedRectRef.current || !isHoveredRef.current) return;
        const rect = cachedRectRef.current;
        const currentTop = rect.absoluteTop - window.scrollY;

        const x = clientX - rect.left;
        const y = clientY - currentTop;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        element.style.transition = 'transform 0.15s ease-out';
        let transformStr = '';
        if (enableTilt) {
          const rotateX = ((y - centerY) / centerY) * -6;
          const rotateY = ((x - centerX) / centerX) * 6;
          transformStr += 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) ';
        }
        if (enableMagnetism) {
          const magnetX = (x - centerX) * 0.04;
          const magnetY = (y - centerY) * 0.04;
          transformStr += 'translate(' + magnetX + 'px, ' + magnetY + 'px)';
        }
        if (transformStr) {
          element.style.transform = transformStr;
        }
      });
    };

    const handleClick = (e) => {
      if (onClick) onClick(e);
      if (!clickEffect) return;

      let rect = cachedRectRef.current;
      if (!rect) {
        const r = element.getBoundingClientRect();
        rect = { left: r.left, absoluteTop: r.top + window.scrollY, width: r.width, height: r.height };
      }
      
      const currentTop = rect.absoluteTop - window.scrollY;
      const x = e.clientX - rect.left;
      const y = e.clientY - currentTop;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
        transform: scale(0);
        opacity: 1;
      `;

      element.appendChild(ripple);

      setTimeout(() => {
        ripple.style.transition = 'transform 0.7s ease-out, opacity 0.7s ease-out';
        ripple.style.transform = 'scale(1)';
        ripple.style.opacity = '0';
        setTimeout(() => ripple.remove(), 700);
      }, 10);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove, { passive: true });
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      cachedRectRef.current = null;
      if (moveRafId) cancelAnimationFrame(moveRafId);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor, onClick]);

  return (
    <div
      ref={setRef}
      className={`${className} particle-container magic-bento-card magic-bento-card--border-glow`}
      style={{ ...style, '--glow-rgb': glowColor, position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
});

ParticleCard.displayName = 'ParticleCard';

export const GlobalSpotlight = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR
}) => {
  const spotlightRef = useRef(null);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const grid = gridRef.current;
    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 700px;
      height: 700px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.14) 0%,
        rgba(${glowColor}, 0.07) 15%,
        rgba(${glowColor}, 0.03) 25%,
        rgba(${glowColor}, 0.01) 40%,
        transparent 65%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    let rafId = null;
    let pendingX = 0, pendingY = 0;
    let isInside = false;

    let cachedSectionRect = null;
    let cachedCardRects = null;

    const updateAllRects = () => {
      if (!grid) return;
      const sectionRect = grid.getBoundingClientRect();
      const scrollY = window.scrollY;
      
      cachedSectionRect = {
        left: sectionRect.left,
        top: sectionRect.top,
        right: sectionRect.right,
        bottom: sectionRect.bottom,
        width: sectionRect.width,
        height: sectionRect.height,
        absoluteTop: sectionRect.top + scrollY
      };

      const cards = grid.querySelectorAll('.magic-bento-card');
      cachedCardRects = Array.from(cards).map(card => {
        const rect = card.getBoundingClientRect();
        return {
          el: card,
          rect: {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            absoluteTop: rect.top + scrollY
          }
        };
      });
    };

    const resizeObserver = new ResizeObserver(updateAllRects);
    resizeObserver.observe(grid);

    const processMove = () => {
      rafId = null;
      if (!spotlightRef.current || !grid) return;

      if (!cachedSectionRect || !cachedCardRects) {
        updateAllRects();
      }

      const scrollY = window.scrollY;
      const rect = cachedSectionRect;
      if (!rect) return;
      
      const currentSectionTop = rect.absoluteTop - scrollY;
      const currentSectionBottom = currentSectionTop + rect.height;

      const mouseInside =
        pendingX >= rect.left &&
        pendingX <= rect.right &&
        pendingY >= currentSectionTop &&
        pendingY <= currentSectionBottom;

      if (!mouseInside) {
        if (isInside) {
          isInside = false;
          spotlightRef.current.style.opacity = '0';
          cachedCardRects?.forEach(({ el }) => el.style.setProperty('--glow-intensity', '0'));
        }
        return;
      }

      isInside = true;
      spotlightRef.current.style.left = `${pendingX}px`;
      spotlightRef.current.style.top = `${pendingY}px`;
      spotlightRef.current.style.opacity = '0.75';

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);

      cachedCardRects.forEach(({ el, rect: cardRect }) => {
        const currentCardTop = cardRect.absoluteTop - scrollY;
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = currentCardTop + cardRect.height / 2;
        
        const distance =
          Math.hypot(pendingX - centerX, pendingY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }
        
        const relativeX = ((pendingX - cardRect.left) / cardRect.width) * 100;
        const relativeY = ((pendingY - currentCardTop) / cardRect.height) * 100;

        el.style.setProperty('--glow-x', `${relativeX}%`);
        el.style.setProperty('--glow-y', `${relativeY}%`);
        el.style.setProperty('--glow-intensity', glowIntensity.toString());
        el.style.setProperty('--glow-radius', `${spotlightRadius}px`);
      });
    };

    const handleMouseMove = (e) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(processMove);
    };

    const handleMouseEnter = () => {
      updateAllRects();
    };

    const handleMouseLeave = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      isInside = false;
      if (spotlightRef.current) spotlightRef.current.style.opacity = '0';
      cachedCardRects?.forEach(({ el }) => el.style.setProperty('--glow-intensity', '0'));
    };

    grid.addEventListener('mouseenter', handleMouseEnter);
    grid.addEventListener('mouseleave', handleMouseLeave);
    grid.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      grid.removeEventListener('mouseenter', handleMouseEnter);
      grid.removeEventListener('mouseleave', handleMouseLeave);
      grid.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

export const BentoCardGrid = ({ children, gridRef, className = '' }) => (
  <div className={`bento-section ${className}`} ref={gridRef}>
    {children}
  </div>
);

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let debounceTimer;
    const checkMobile = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
      }, 100);
    };

    setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', checkMobile, { passive: true });

    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
};

const MagicBento = ({
  children,
  enableSpotlight = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
  const gridRef = useRef(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  return (
    <>
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        {children}
      </BentoCardGrid>
    </>
  );
};

export default MagicBento;
