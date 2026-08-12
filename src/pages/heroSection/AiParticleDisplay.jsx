import { useEffect, useRef } from "react";

// Pre-compute a gradient color lookup table (100 buckets) to avoid per-dot string allocation
const COLOR_BUCKETS = 100;
const colorLUT = (() => {
  const lut = new Array(COLOR_BUCKETS);
  for (let i = 0; i < COLOR_BUCKETS; i++) {
    const normX = i / (COLOR_BUCKETS - 1);
    let r, g, b;
    if (normX < 0.5) {
      const ratio = normX / 0.5;
      r = 0;
      g = Math.round(196 + (229 - 196) * ratio);
      b = Math.round(180 + (255 - 180) * ratio);
    } else {
      const ratio = (normX - 0.5) / 0.5;
      r = Math.round(37 * ratio);
      g = Math.round(229 + (99 - 229) * ratio);
      b = Math.round(255 + (235 - 255) * ratio);
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
    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    let animationFrameId;
    let time = 0;
    let isVisible = true;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Pre-computed dot grid layout (rebuilt on resize)
    let dotSpacing = 0, cols = 0, rows = 0, startX = 0, startY = 0;
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

      // Cache layout values
      dotSpacing = Math.max(8, Math.floor(width / 65));
      cols = Math.floor(width / dotSpacing);
      rows = Math.floor((height + 180) / dotSpacing);
      startX = (width - cols * dotSpacing) / 2;
      startY = (height - rows * dotSpacing) / 2;
      fontSize = Math.min(width * 0.72, height * 0.95);
    }

    // Pause animation when tab is hidden
    const handleVisibility = () => { isVisible = document.visibilityState === "visible"; };
    document.addEventListener("visibilitychange", handleVisibility);

    resize();
    let resizeTimer;
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); };
    window.addEventListener("resize", onResize);

    function render() {
      animationFrameId = requestAnimationFrame(render);
      if (!canvas || !isVisible) return;

      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      time += 0.018; // slightly slower = less CPU per frame

      ctx.clearRect(0, 0, width, height);

      // Group dots by color bucket — batch arcs with same fill to minimise fillStyle changes
      // Build per-color-bucket path arrays
      const bucketPaths = {};

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const normX = c / cols;
          const normY = r / rows;

          const wave1 = Math.sin(normX * 8 + time * 1.5 + normY * 4) * 14;
          const wave2 = Math.cos(normY * 10 - time * 1.2 + normX * 6) * 10;
          const wave3 = Math.sin((normX + normY) * 6 + time * 0.8) * 8;

          const px = startX + c * dotSpacing + wave2 * 0.4;
          const py = startY + r * dotSpacing + wave1 + wave3;

          // Map normX → LUT index
          const lutIdx = Math.min(COLOR_BUCKETS - 1, Math.floor(normX * COLOR_BUCKETS));
          if (!bucketPaths[lutIdx]) bucketPaths[lutIdx] = [];
          bucketPaths[lutIdx].push(px, py);
        }
      }

      // Single dot radius — skip per-dot pulse for perf (visually indistinguishable at this density)
      const radius = 1.4;

      // Draw all dots grouped by color
      for (const [idx, coords] of Object.entries(bucketPaths)) {
        ctx.fillStyle = colorLUT[idx];
        ctx.beginPath();
        for (let i = 0; i < coords.length; i += 2) {
          ctx.moveTo(coords[i] + radius, coords[i + 1]);
          ctx.arc(coords[i], coords[i + 1], radius, 0, TWO_PI);
        }
        ctx.fill();
      }

      // Clip dots to "AI" text shape
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = "#ffffff";
      ctx.font = `900 ${fontSize}px "PlusJakartaSans", "Gilroy", "Inter", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("AI", width / 2, height / 2 + fontSize * 0.04);
      ctx.globalCompositeOperation = "source-over";
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center justify-center font-['PlusJakartaSans',sans-serif]">
      <div className="relative w-full h-[220px] md:h-[400px] lg:h-[440px] xl:h-[440px] 2xl:h-[550px] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          style={{ willChange: "transform" }}
          className="w-full h-full block pointer-events-none drop-shadow-[0_0_25px_rgba(0,196,180,0.3)]"
        />
      </div>
    </div>
  );
}

export default AiParticleDisplay;
