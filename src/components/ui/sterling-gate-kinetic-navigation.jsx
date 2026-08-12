import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Menu, X } from "lucide-react";
import LucidMindTransperentLogo from "../../assets/logo/Lucid-mind-logos1.png";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

export function Component() {
  const containerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowLogo(false);
      } else {
        setShowLogo(true);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    try {
      if (!gsap.parseEase("main")) {
        CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
        gsap.defaults({ ease: "main", duration: 0.7 });
      }
    } catch {
      gsap.defaults({ ease: "power2.out", duration: 0.7 });
    }

    const ctx = gsap.context(() => {
      const menuItems = currentContainer.querySelectorAll(".menu-list-item[data-shape]");
      const shapesContainer = currentContainer.querySelector(".ambient-background-shapes");
      
      menuItems.forEach((item) => {
        const shapeIndex = item.getAttribute("data-shape");
        const shape = shapesContainer ? shapesContainer.querySelector(`.bg-shape-${shapeIndex}`) : null;
        
        if (!shape) return;

        const shapeEls = shape.querySelectorAll(".shape-element");

        const onEnter = () => {
          if (shapesContainer) {
            shapesContainer.querySelectorAll(".bg-shape").forEach((s) => s.classList.remove("active"));
          }
          shape.classList.add("active");
          
          gsap.fromTo(shapeEls, 
            { scale: 0.5, opacity: 0, rotation: -10 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.7)", overwrite: "auto" }
          );
        };
        
        const onLeave = () => {
          gsap.to(shapeEls, {
            scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in",
            onComplete: () => shape.classList.remove("active"),
            overwrite: "auto"
          });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
        
        item._cleanup = () => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
        };
      });
      
    }, currentContainer);

    return () => {
      ctx.revert();
      if (currentContainer) {
        const items = currentContainer.querySelectorAll(".menu-list-item[data-shape]");
        items.forEach((item) => item._cleanup && item._cleanup());
      }
    };
  }, []);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;
    
    const ctx = gsap.context(() => {
      const navWrap = currentContainer.querySelector(".nav-overlay-wrapper");
      const menu = currentContainer.querySelector(".menu-content");
      const overlay = currentContainer.querySelector(".overlay");
      const bgPanels = currentContainer.querySelectorAll(".backdrop-layer");
      const menuLinks = currentContainer.querySelectorAll(".nav-link");
      const fadeTargets = currentContainer.querySelectorAll("[data-menu-fade]");

      const tl = gsap.timeline();
      
      if (isMenuOpen) {
        if (navWrap) navWrap.setAttribute("data-nav", "open");
        
        tl.set(navWrap, { display: "block" })
          .set(menu, { xPercent: 0 }, "<")
          .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
          .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575 }, "<")
          .fromTo(menuLinks, { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, "<+=0.35");
          
        if (fadeTargets.length) {
          tl.fromTo(fadeTargets, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.04, clearProps: "all" }, "<+=0.2");
        }

      } else {
        if (navWrap) navWrap.setAttribute("data-nav", "closed");

        tl.to(overlay, { autoAlpha: 0 })
          .to(menu, { xPercent: 120 }, "<")
          .set(navWrap, { display: "none" });
      }

    }, currentContainer);
    
    return () => ctx.revert();
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div ref={containerRef}>
      <header className="fixed top-0 left-0 right-0 z-[1001] w-full pointer-events-none">
        <div className="w-full max-w-7xl 2xl:max-w-[1660px] mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between pt-3 sm:pt-4 pointer-events-auto">
          <Link
            to="/"
            className={`flex items-center transition-all duration-300 ${
              showLogo ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            <img
              src={LucidMindTransperentLogo}
              alt="LucidMind"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain"
            />
          </Link>
          
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="w-10 h-10 shrink-0 rounded-full border border-brand-blue/60 bg-[#030A18]/90 backdrop-blur-xl text-[#00C4FF] shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-[#00C4FF] hover:scale-105 active:scale-95"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-[#00C4FF]" />
            ) : (
              <Menu className="w-5 h-5 text-[#00C4FF]" />
            )}
          </button>
        </div>
      </header>

      <section className="fullscreen-menu-container">
        <div data-nav="closed" className="nav-overlay-wrapper fixed inset-0 z-1000 hidden">
          <div className="overlay absolute inset-0 bg-black/60 backdrop-blur-md" onClick={closeMenu}></div>
          <nav className="menu-content absolute right-0 top-0 bottom-0 w-full max-w-md bg-linear-to-tr from-[#040914] to-[#4B9AF5] flex flex-col justify-center px-8 sm:px-12 py-10 overflow-hidden shadow-2xl">

            <div className="menu-bg absolute inset-0 overflow-hidden pointer-events-none">
              <div className="backdrop-layer first absolute inset-0 bg-linear-to-b from-[#4B9AF5] to-[#040914]"></div>
              <div className="backdrop-layer second absolute inset-0 bg-linear-to-b from-[#040914] to-[#4B9AF5]"></div>
              <div className="backdrop-layer absolute inset-0 bg-linear-to-b from-[#040914] to-[#4B9AF5]"></div>

              <div className="ambient-background-shapes absolute inset-0 pointer-events-none opacity-40">
                <svg className="bg-shape bg-shape-1 absolute inset-0 w-full h-full opacity-0 transition-opacity duration-300" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="80" cy="120" r="40" fill="rgba(0,196,255,0.2)" />
                  <circle className="shape-element" cx="300" cy="80" r="60" fill="rgba(37,99,235,0.2)" />
                  <circle className="shape-element" cx="200" cy="300" r="80" fill="rgba(0,196,255,0.15)" />
                </svg>

                <svg className="bg-shape bg-shape-2 absolute inset-0 w-full h-full opacity-0 transition-opacity duration-300" viewBox="0 0 400 400" fill="none">
                  <path className="shape-element" d="M0 200 Q100 100, 200 200 T 400 200" stroke="rgba(0,196,255,0.25)" strokeWidth="60" fill="none" />
                </svg>

                <svg className="bg-shape bg-shape-3 absolute inset-0 w-full h-full opacity-0 transition-opacity duration-300" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="50" cy="50" r="8" fill="rgba(0,196,255,0.4)" />
                  <circle className="shape-element" cx="150" cy="50" r="8" fill="rgba(37,99,235,0.4)" />
                  <circle className="shape-element" cx="250" cy="50" r="8" fill="rgba(0,196,255,0.4)" />
                  <circle className="shape-element" cx="350" cy="50" r="8" fill="rgba(37,99,235,0.4)" />
                </svg>

                <svg className="bg-shape bg-shape-4 absolute inset-0 w-full h-full opacity-0 transition-opacity duration-300" viewBox="0 0 400 400" fill="none">
                  <path className="shape-element" d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100" fill="rgba(0,196,255,0.18)" />
                </svg>

                <svg className="bg-shape bg-shape-5 absolute inset-0 w-full h-full opacity-0 transition-opacity duration-300" viewBox="0 0 400 400" fill="none">
                  <line className="shape-element" x1="0" y1="100" x2="300" y2="400" stroke="rgba(0,196,255,0.2)" strokeWidth="30" />
                </svg>
              </div>
            </div>

            <div className="menu-content-wrapper relative z-10">
              <ul className="menu-list space-y-8">
                <li className="menu-list-item" data-shape="1">
                  <Link to="/" onClick={closeMenu} className="nav-link block text-2xl font-bold text-white/90 hover:text-[#00C4FF] transition-colors">
                    <p className="nav-link-text">Home</p>
                  </Link>
                </li>
                <li className="menu-list-item" data-shape="2">
                  <Link to="/about" onClick={closeMenu} className="nav-link block text-2xl  font-bold text-white/90 hover:text-[#00C4FF] transition-colors">
                    <p className="nav-link-text">About</p>
                  </Link>
                </li>
                <li className="menu-list-item" data-shape="3">
                  <Link to="/advisory" onClick={closeMenu} className="nav-link block text-2xl  font-bold text-white/90 hover:text-[#00C4FF] transition-colors">
                    <p className="nav-link-text">Advisory</p>
                  </Link>
                </li>
                <li className="menu-list-item" data-shape="4">
                  <Link to="/insights" onClick={closeMenu} className="nav-link block text-2xl  font-bold text-white/90 hover:text-[#00C4FF] transition-colors">
                    <p className="nav-link-text" data-menu-fade>Insights</p>
                  </Link>
                </li>
                <li className="menu-list-item" data-shape="5">
                  <Link to="/contact" onClick={closeMenu} className="nav-link block text-2xl  font-bold text-white/90 hover:text-[#00C4FF] transition-colors">
                    <p className="nav-link-text">Contact</p>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}

export default Component;
