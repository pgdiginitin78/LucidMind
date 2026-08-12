import { useEffect, useRef } from "react";

function AiParticleDisplay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    let animationFrameId;
    let time = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

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
    }

    resize();
    window.addEventListener("resize", resize);

    function render() {
      if (!canvas) return;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      time += 0.025;

      ctx.clearRect(0, 0, width, height);

      const dotSpacing = Math.max(7, Math.floor(width / 70));
      const cols = Math.floor(width / dotSpacing);
      const rows = Math.floor((height + 200) / dotSpacing);
      const startX = (width - cols * dotSpacing) / 2;
      const startY = (height - rows * dotSpacing) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const normX = c / cols;
          const normY = r / rows;

          const wave1 = Math.sin(normX * 8 + time * 1.5 + normY * 4) * 14;
          const wave2 = Math.cos(normY * 10 - time * 1.2 + normX * 6) * 10;
          const wave3 = Math.sin((normX + normY) * 6 + time * 0.8) * 8;

          const px = startX + c * dotSpacing + wave2 * 0.4;
          const py = startY + r * dotSpacing + wave1 + wave3;

          let color;
          if (normX < 0.5) {
            const ratio = normX / 0.5;
            const rVal = Math.round(0 + (0 - 0) * ratio);
            const gVal = Math.round(196 + (229 - 196) * ratio);
            const bVal = Math.round(180 + (255 - 180) * ratio);
            color = `rgb(${rVal}, ${gVal}, ${bVal})`;
          } else {
            const ratio = (normX - 0.5) / 0.5;
            const rVal = Math.round(0 + (37 - 0) * ratio);
            const gVal = Math.round(229 + (99 - 229) * ratio);
            const bVal = Math.round(255 + (235 - 255) * ratio);
            color = `rgb(${rVal}, ${gVal}, ${bVal})`;
          }

          const pulse = Math.sin(time * 2 + normX * 10 + normY * 10) * 0.4;
          const radius = Math.max(1, 1.6 + pulse);

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = "#ffffff";

      const fontSize = Math.min(width * 0.72, height * 0.95);
      ctx.font = `900 ${fontSize}px "PlusJakartaSans", "Gilroy", "Inter", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText("AI", width / 2, height / 2 + fontSize * 0.04);

      ctx.globalCompositeOperation = "source-over";

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center justify-center font-['PlusJakartaSans',sans-serif]">
      <div className="relative w-full h-[220px] md:h-[400px] lg:h-[440px] xl:h-[440px] 2xl:h-[550px] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full block pointer-events-none drop-shadow-[0_0_25px_rgba(0,196,180,0.3)]"
        />
      </div>

      {/* <div className="relative w-full flex flex-col items-center text-center mt-2  px-2">
        <h2 className="text-white font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.25em] uppercase leading-tight select-none drop-shadow-md">
          ISN’T THE FUTURE.
        </h2>

        <p className="mt-2 text-slate-400 font-semibold text-xs sm:text-base md:text-lg lg:text-xl tracking-[0.22em] uppercase select-none">
          IT’S YOUR{" "}
          <span className="text-[#00C4B4] font-bold drop-shadow-[0_0_8px_rgba(0,196,180,0.5)]">
            NEXT ADVANTAGE.
          </span>
        </p>

        <div className="relative w-full max-w-[85%] sm:max-w-md mt-6 sm:mt-8 h-[1px]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00C4B4]/40 to-transparent" />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 sm:w-36 h-[2px] bg-[#00C4B4] shadow-[0_0_15px_3px_rgba(0,196,180,0.9)] rounded-full" />
        </div>
      </div> */}
    </div>
  );
}

export default AiParticleDisplay;
