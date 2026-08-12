import React, { useEffect, useRef } from "react";

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

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth || window.innerWidth;
        canvas.height = parent.clientHeight || window.innerHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Convert hex color to RGB
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
      time += speed * 0.015;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Base background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`);
      bgGrad.addColorStop(0.5, "rgba(10, 15, 30, 0.95)");
      bgGrad.addColorStop(1, "rgba(5, 11, 24, 1)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-width / 2, -height / 2);

      // Draw multi-layered animated color bend waves
      const numBands = Math.max(3, iterations * 4);
      for (let i = 0; i < numBands; i++) {
        ctx.beginPath();
        const yOffset = (height / numBands) * i - height * 0.2;
        const waveAmp = (height * bandWidth) * (1 + Math.sin(time + i) * 0.2);

        ctx.moveTo(0, yOffset);

        for (let x = 0; x <= width; x += 15) {
          const normX = x / width;
          const sine1 = Math.sin(normX * Math.PI * 2 * frequency + time + i * 0.8);
          const sine2 = Math.cos(normX * Math.PI * 4 * frequency - time * 0.5 + i);
          const noiseFactor = (Math.sin(normX * 20 + time * 3) * noise * 50);
          
          const y = yOffset + (sine1 + sine2 * 0.5) * waveAmp + noiseFactor;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height * 1.5);
        ctx.lineTo(0, height * 1.5);
        ctx.closePath();

        const alpha = Math.min(0.8, (intensity * 0.3) / (i * 0.3 + 1));
        const bandGrad = ctx.createLinearGradient(0, yOffset - waveAmp, 0, yOffset + waveAmp * 2);

        // Blend primary color with secondary glowing cyan accents
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

      // Top fade overlay if configured
      if (fadeTop > 0) {
        const topFade = ctx.createLinearGradient(0, 0, 0, height * fadeTop);
        topFade.addColorStop(0, "rgba(5, 11, 24, 0.4)");
        topFade.addColorStop(1, "rgba(5, 11, 24, 0)");
        ctx.fillStyle = topFade;
        ctx.fillRect(0, 0, width, height * fadeTop);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, speed, frequency, noise, bandWidth, rotation, fadeTop, iterations, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full object-cover z-0 ${className}`}
    />
  );
}

export default ColorBends;
