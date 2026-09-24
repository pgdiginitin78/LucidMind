"use client";
import { useEffect, useRef } from "react";

const COLOR_BUCKETS = 100;
const colorLUT = (() => {
  const lut = new Array(COLOR_BUCKETS);
  for (let i = 0; i < COLOR_BUCKETS; i++) {
    const normX = i / (COLOR_BUCKETS - 1);
    let r, g, b;
    if (normX < 0.5) {
      const ratio = normX / 0.5;
      r = Math.round(105 + (60 - 105) * ratio);
      g = Math.round(150 + (205 - 150) * ratio);
      b = Math.round(255 + (255 - 255) * ratio);
    } else {
      const ratio = (normX - 0.5) / 0.5;
      r = Math.round(60 + (0 - 60) * ratio);
      g = Math.round(205 + (245 - 205) * ratio);
      b = Math.round(255 + (240 - 255) * ratio);
    }
    lut[i] = `rgb(${r},${g},${b})`;
  }
  return lut;
})();

const TWO_PI = Math.PI * 2;

function AiParticleDisplay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", {
      alpha: true,
      willReadFrequently: false,
    });
    let animationFrameId;
    let time = 0;
    let isVisible = true;
    let isIntersecting = true;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let dotSpacing = 0,
      cols = 0,
      rows = 0,
      startX = 0,
      startY = 0;
    let fontSize = 0;

    function resize() {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const baseSpacing = isMobile
        ? Math.max(12, Math.floor(width / 45))
        : Math.max(8, Math.floor(width / 65));
      dotSpacing = baseSpacing;
      cols = Math.floor(width / dotSpacing);
      rows = Math.floor((height + 180) / dotSpacing);
      startX = (width - cols * dotSpacing) / 2;
      startY = (height - rows * dotSpacing) / 2;
      fontSize = Math.min(width * 0.72, height * 0.95);
    }

    const checkAndRender = () => {
      if (isVisible && isIntersecting && !animationFrameId) {
        render();
      }
    };

    const handleVisibility = () => {
      isVisible = document.visibilityState === "visible";
      checkAndRender();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const io = new IntersectionObserver(
      (entries) => {
        isIntersecting = entries[0].isIntersecting;
        checkAndRender();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    resize();
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };
    window.addEventListener("resize", onResize);

    const bucketCoords = Array.from({ length: COLOR_BUCKETS }, () => []);
    const radius = 1.6;

    function render() {
      if (!canvas || !isVisible || !isIntersecting) {
        animationFrameId = null;
        return;
      }
      animationFrameId = requestAnimationFrame(render);

      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      time += 0.018;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < COLOR_BUCKETS; i++) {
        bucketCoords[i].length = 0;
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const normX = c / cols;
          const normY = r / rows;

          const wave1 = Math.sin(normX * 8 + time * 1.5 + normY * 4) * 14;
          const wave2 = Math.cos(normY * 10 - time * 1.2 + normX * 6) * 10;
          const wave3 = Math.sin((normX + normY) * 6 + time * 0.8) * 8;

          const px = startX + c * dotSpacing + wave2 * 0.4;
          const py = startY + r * dotSpacing + wave1 + wave3;

          const lutIdx = Math.min(
            COLOR_BUCKETS - 1,
            Math.floor(normX * COLOR_BUCKETS),
          );
          bucketCoords[lutIdx].push(px, py);
        }
      }

      for (let idx = 0; idx < COLOR_BUCKETS; idx++) {
        const coords = bucketCoords[idx];
        if (!coords.length) continue;

        ctx.fillStyle = colorLUT[idx];
        ctx.beginPath();
        for (let i = 0; i < coords.length; i += 2) {
          ctx.moveTo(coords[i] + radius, coords[i + 1]);
          ctx.arc(coords[i], coords[i + 1], radius, 0, TWO_PI);
        }
        ctx.fill();
      }

      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = "#ffffff";
      ctx.font = `900 ${fontSize}px "PlusJakartaSans", "Gilroy", "Inter", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("AI", width / 2, height / 2 + fontSize * 0.04);
      ctx.globalCompositeOperation = "source-over";
    }

    checkAndRender();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      io.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center justify-center font-['PlusJakartaSans',sans-serif]">
      <div className="relative w-full h-[220px] md:h-[400px] lg:h-[440px] xl:h-[440px] 2xl:h-[550px] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          style={{ willChange: "transform" }}
          className="w-full h-full block pointer-events-none drop-shadow-[0_0_20px_rgba(0,245,240,0.35)] drop-shadow-[0_0_35px_rgba(105,150,255,0.25)]"
        />
      </div>
    </div>
  );
}

export default AiParticleDisplay;
