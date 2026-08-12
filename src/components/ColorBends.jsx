import { useEffect, useRef } from "react";

export function ColorBends({
  color = "#A855F7",
  speed = 0.2,
  frequency = 1.0,
  noise = 0.15,
  bandWidth = 0.14,
  rotation = 90,
  fadeTop = 0.75,
  iterations = 1,
  intensity = 1.3,
  className = "",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let time = 0;
    let isVisible = true;
    let isIntersecting = true;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const handleVisibility = () => { isVisible = document.visibilityState === "visible"; };
    document.addEventListener("visibilitychange", handleVisibility);

    const io = new IntersectionObserver((entries) => {
      isIntersecting = entries[0].isIntersecting;
    }, { threshold: 0 });
    io.observe(canvas);

    let resizeTimer;
    const resizeCanvas = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = (parent.clientWidth || window.innerWidth) * dpr;
          canvas.height = (parent.clientHeight || window.innerHeight) * dpr;
          canvas.style.width = `${parent.clientWidth || window.innerWidth}px`;
          canvas.style.height = `${parent.clientHeight || window.innerHeight}px`;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      }, 100);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const hexToRgb = (hex) => {
      let c = hex.replace("#", "");
      if (c.length === 3) {
        c = c.split("").map((char) => char + char).join("");
      }
      const num = parseInt(c, 16);
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
      };
    };

    const rgb = hexToRgb(color);

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible || !isIntersecting) return;

      time += speed * 0.012;
      const { width, height } = canvas;
      const logicalW = width / dpr;
      const logicalH = height / dpr;
      ctx.clearRect(0, 0, logicalW, logicalH);

      const bgGrad = ctx.createLinearGradient(0, 0, logicalW, logicalH);
      bgGrad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`);
      bgGrad.addColorStop(0.5, "rgba(10, 15, 30, 0.95)");
      bgGrad.addColorStop(1, "rgba(5, 11, 24, 1)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, logicalW, logicalH);

      ctx.save();
      ctx.translate(logicalW / 2, logicalH / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-logicalW / 2, -logicalH / 2);

      const numBands = Math.max(3, iterations * 4);
      for (let i = 0; i < numBands; i++) {
        ctx.beginPath();
        const yOffset = (logicalH / numBands) * i - logicalH * 0.2;
        const waveAmp = (logicalH * bandWidth) * (1 + Math.sin(time + i) * 0.2);

        ctx.moveTo(0, yOffset);

        for (let x = 0; x <= logicalW; x += 24) {
          const normX = x / logicalW;
          const sine1 = Math.sin(normX * Math.PI * 2 * frequency + time + i * 0.8);
          const sine2 = Math.cos(normX * Math.PI * 4 * frequency - time * 0.5 + i);
          const noiseFactor = (Math.sin(normX * 20 + time * 3) * noise * 50);
          const y = yOffset + (sine1 + sine2 * 0.5) * waveAmp + noiseFactor;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(logicalW, logicalH * 1.5);
        ctx.lineTo(0, logicalH * 1.5);
        ctx.closePath();

        const alpha = Math.min(0.8, (intensity * 0.3) / (i * 0.3 + 1));
        const bandGrad = ctx.createLinearGradient(0, yOffset - waveAmp, 0, yOffset + waveAmp * 2);

        const mixR = Math.round(rgb.r * 0.8 + (i % 2 === 0 ? 0 : 40));
        const mixG = Math.round(rgb.g * 0.8 + (i % 2 === 0 ? 150 : 80));
        const mixB = Math.round(rgb.b * 0.8 + 100);

        bandGrad.addColorStop(0, `rgba(${mixR}, ${mixG}, ${mixB}, ${alpha * 0.8})`);
        bandGrad.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.5})`);
        bandGrad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

        ctx.fillStyle = bandGrad;
        ctx.fill();
      }

      ctx.restore();

      if (fadeTop > 0) {
        const topFade = ctx.createLinearGradient(0, 0, 0, logicalH * fadeTop);
        topFade.addColorStop(0, "rgba(5, 11, 24, 0.4)");
        topFade.addColorStop(1, "rgba(5, 11, 24, 0)");
        ctx.fillStyle = topFade;
        ctx.fillRect(0, 0, logicalW, logicalH * fadeTop);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimer);
      io.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [color, speed, frequency, noise, bandWidth, rotation, fadeTop, iterations, intensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{ willChange: "transform" }}
      className={`absolute inset-0 w-full h-full object-cover z-0 ${className}`}
    />
  );
}

export default ColorBends;
