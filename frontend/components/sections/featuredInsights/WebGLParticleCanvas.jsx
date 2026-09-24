"use client";
import { useRef, useEffect } from "react";

export default function WebGLParticleCanvas({ variant }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cleanupWebGL = null;
    let initialized = false;

    const initWebGL = () => {
      const gl = canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: false,
        antialias: false,
        powerPreference: "low-power",
      });
      if (!gl) return;

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const VERT = `
        attribute vec2 a_pos;
        attribute float a_sz;
        attribute vec3 a_col;
        attribute float a_opa;
        uniform vec2 u_res;
        uniform float u_dpr;
        varying vec3 v_col;
        varying float v_opa;
        void main() {
          vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
          gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
          gl_PointSize = a_sz * u_dpr;
          v_col = a_col;
          v_opa = a_opa;
        }
      `;

      const FRAG = `
        precision mediump float;
        varying vec3 v_col;
        varying float v_opa;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float core = 1.0 - smoothstep(0.0, 0.20, d);
          float glow = 1.0 - smoothstep(0.06, 0.50, d);
          float a = (core * 0.95 + glow * 0.55) * v_opa;
          vec3 col = mix(v_col, vec3(1.0), core * 0.4);
          gl_FragColor = vec4(col, a);
        }
      `;

      const LVERT = `
        attribute vec2 a_pos;
        attribute vec3 a_col;
        attribute float a_opa;
        uniform vec2 u_res;
        varying vec3 v_col;
        varying float v_opa;
        void main() {
          vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
          gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
          v_col = a_col;
          v_opa = a_opa;
        }
      `;

      const LFRAG = `
        precision mediump float;
        varying vec3 v_col;
        varying float v_opa;
        void main() {
          gl_FragColor = vec4(v_col, v_opa);
        }
      `;

      function mkShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      }

      function mkProg(vs, fs) {
        const p = gl.createProgram();
        gl.attachShader(p, mkShader(gl.VERTEX_SHADER, vs));
        gl.attachShader(p, mkShader(gl.FRAGMENT_SHADER, fs));
        gl.linkProgram(p);
        return p;
      }

      const ptProg = mkProg(VERT, FRAG);
      const lnProg = mkProg(LVERT, LFRAG);

      const ptLoc = {
        res: gl.getUniformLocation(ptProg, "u_res"),
        dpr: gl.getUniformLocation(ptProg, "u_dpr"),
        pos: gl.getAttribLocation(ptProg, "a_pos"),
        sz:  gl.getAttribLocation(ptProg, "a_sz"),
        col: gl.getAttribLocation(ptProg, "a_col"),
        opa: gl.getAttribLocation(ptProg, "a_opa"),
      };

      const lnLoc = {
        res: gl.getUniformLocation(lnProg, "u_res"),
        pos: gl.getAttribLocation(lnProg, "a_pos"),
        col: gl.getAttribLocation(lnProg, "a_col"),
        opa: gl.getAttribLocation(lnProg, "a_opa"),
      };

      // Vibrant, luminous palette for high visibility
      const isPodcast = variant === "podcast";
      const pool = isPodcast
        ? [
            [0.00, 0.88, 1.00], // bright cyan
            [0.00, 0.92, 0.78], // vibrant teal
            [0.22, 0.58, 1.00], // electric blue
            [0.45, 0.85, 1.00], // sky highlight
            [0.00, 0.76, 0.88], // cyan deep
          ]
        : [
            [0.00, 0.77, 0.71], // teal
            [0.15, 0.45, 0.95], // blue
            [0.00, 0.68, 0.90], // cerulean
            [0.10, 0.55, 0.95], // cobalt
            [0.00, 0.82, 0.75], // mint teal
          ];

      const isMobileDevice = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
      const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

      let W = 0, H = 0;
      let particles = [];
      let rafId = null;
      let time = 0;

      const ptBuf = gl.createBuffer();
      const lnBuf = gl.createBuffer();

      let ptDataBuf = new Float32Array(0);
      let lnDataBuf = new Float32Array(0);

      function rand(a, b) {
        return Math.random() * (b - a) + a;
      }

      function initParticles() {
        if (W <= 0 || H <= 0) return;

        // Density suited for elegant coverage without overcrowding
        const density = isMobileDevice ? 14000 : 7000;
        const maxCount = isMobileDevice ? 35 : 95;
        const count = Math.max(25, Math.min(Math.floor((W * H) / density), maxCount));

        particles = Array.from({ length: count }, (_, i) => {
          const isMeshNode = i < count * 0.42;

          return {
            x: rand(10, W - 10),
            y: rand(10, H - 10),
            vx: rand(-0.32, 0.32) * (isMobileDevice ? 0.8 : 1),
            vy: rand(-0.25, 0.25) * (isMobileDevice ? 0.8 : 1),
            phase: rand(0, Math.PI * 2),
            waveSpeed: rand(0.008, 0.02),

            // Prominent visible particle sizes
            baseSize: isMeshNode ? rand(5.5, 9.5) : rand(3.0, 5.5),
            size: 0,
            isMeshNode,
            col: pool[Math.floor(Math.random() * pool.length)],

            // Rich ambient opacity always clearly visible without mouse
            baseOpa: isMeshNode ? rand(0.65, 0.92) : rand(0.40, 0.72),
            opa: 0,
            pulse: rand(0, Math.PI * 2),
            pulseSpeed: rand(0.015, 0.035),
          };
        });

        const maxMesh = Math.ceil(particles.length * 0.45);
        const maxLines = maxMesh * maxMesh;
        ptDataBuf = new Float32Array(particles.length * 7);
        lnDataBuf = new Float32Array(maxLines * 12);
      }

      function resize() {
        if (!canvas) return;
        W = canvas.offsetWidth || canvas.clientWidth || 300;
        H = canvas.offsetHeight || canvas.clientHeight || 300;

        canvas.width = Math.floor(W * dpr);
        canvas.height = Math.floor(H * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);

        initParticles();
      }

      let isVisible = true;
      let isIntersecting = true;

      const checkAndDraw = () => {
        if (isVisible && isIntersecting && !rafId) {
          draw();
        }
      };

      const handleVisibility = () => {
        isVisible = document.visibilityState === "visible";
        checkAndDraw();
      };
      document.addEventListener("visibilitychange", handleVisibility);

      const io = new IntersectionObserver(
        (entries) => {
          isIntersecting = entries[0].isIntersecting;
          if (isIntersecting) {
            checkAndDraw();
          }
        },
        { threshold: 0 }
      );
      io.observe(canvas);

      const MAX_LINE_DIST = isMobileDevice ? 110 : 155;
      const MAX_LINE_DIST_SQ = MAX_LINE_DIST * MAX_LINE_DIST;

      function draw() {
        if (!isVisible || !isIntersecting) {
          rafId = null;
          return;
        }
        rafId = requestAnimationFrame(draw);

        time += 0.016;

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Update positions naturally and continuously without any cursor interaction
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.pulse += p.pulseSpeed;

          // Organic floating drift
          const waveX = Math.cos(time * 0.8 + p.phase) * 0.28;
          const waveY = Math.sin(time * 0.7 + p.phase) * 0.22;

          p.x += p.vx + waveX;
          p.y += p.vy + waveY;

          // Smooth wrap-around edges
          if (p.x < -15) p.x = W + 15;
          else if (p.x > W + 15) p.x = -15;

          if (p.y < -15) p.y = H + 15;
          else if (p.y > H + 15) p.y = -15;

          const pulseFactor = 0.88 + 0.12 * Math.sin(p.pulse);
          p.size = p.baseSize * pulseFactor;
          p.opa = Math.min(1.0, p.baseOpa * pulseFactor);
        }

        // Draw connecting constellation lines between nearby mesh nodes
        let lnCount = 0;
        const meshParticles = particles.filter((p) => p.isMeshNode);

        for (let i = 0; i < meshParticles.length; i++) {
          const p1 = meshParticles[i];

          for (let j = i + 1; j < meshParticles.length; j++) {
            const p2 = meshParticles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dSq = dx * dx + dy * dy;

            if (dSq < MAX_LINE_DIST_SQ) {
              const d = Math.sqrt(dSq);
              const normDist = 1.0 - d / MAX_LINE_DIST;
              // Clear, smooth ambient line opacity
              const alpha = normDist * normDist * 0.26 * Math.min(p1.opa, p2.opa);

              const c0 = (p1.col[0] + p2.col[0]) * 0.5;
              const c1 = (p1.col[1] + p2.col[1]) * 0.5;
              const c2 = (p1.col[2] + p2.col[2]) * 0.5;

              const base = lnCount * 12;
              lnDataBuf[base]     = p1.x;  lnDataBuf[base + 1]  = p1.y;
              lnDataBuf[base + 2] = c0;    lnDataBuf[base + 3]  = c1;    lnDataBuf[base + 4]  = c2;  lnDataBuf[base + 5]  = alpha;
              lnDataBuf[base + 6] = p2.x;  lnDataBuf[base + 7]  = p2.y;
              lnDataBuf[base + 8] = c0;    lnDataBuf[base + 9]  = c1;    lnDataBuf[base + 10] = c2;  lnDataBuf[base + 11] = alpha * 0.75;
              lnCount++;
            }
          }
        }

        if (lnCount > 0) {
          gl.useProgram(lnProg);
          gl.uniform2f(lnLoc.res, W, H);
          gl.bindBuffer(gl.ARRAY_BUFFER, lnBuf);
          gl.bufferData(gl.ARRAY_BUFFER, lnDataBuf.subarray(0, lnCount * 12), gl.DYNAMIC_DRAW);
          const s = 6 * 4;
          gl.enableVertexAttribArray(lnLoc.pos);
          gl.vertexAttribPointer(lnLoc.pos, 2, gl.FLOAT, false, s, 0);
          gl.enableVertexAttribArray(lnLoc.col);
          gl.vertexAttribPointer(lnLoc.col, 3, gl.FLOAT, false, s, 2 * 4);
          gl.enableVertexAttribArray(lnLoc.opa);
          gl.vertexAttribPointer(lnLoc.opa, 1, gl.FLOAT, false, s, 5 * 4);
          gl.drawArrays(gl.LINES, 0, lnCount * 2);
        }

        // Draw glowing particles
        for (let pi = 0; pi < particles.length; pi++) {
          const p = particles[pi];
          const base = pi * 7;
          ptDataBuf[base]     = p.x;
          ptDataBuf[base + 1] = p.y;
          ptDataBuf[base + 2] = p.size;
          ptDataBuf[base + 3] = p.col[0];
          ptDataBuf[base + 4] = p.col[1];
          ptDataBuf[base + 5] = p.col[2];
          ptDataBuf[base + 6] = p.opa;
        }

        gl.useProgram(ptProg);
        gl.uniform2f(ptLoc.res, W, H);
        gl.uniform1f(ptLoc.dpr, dpr);
        gl.bindBuffer(gl.ARRAY_BUFFER, ptBuf);
        gl.bufferData(gl.ARRAY_BUFFER, ptDataBuf.subarray(0, particles.length * 7), gl.DYNAMIC_DRAW);
        const ps = 7 * 4;
        gl.enableVertexAttribArray(ptLoc.pos);
        gl.vertexAttribPointer(ptLoc.pos, 2, gl.FLOAT, false, ps, 0);
        gl.enableVertexAttribArray(ptLoc.sz);
        gl.vertexAttribPointer(ptLoc.sz, 1, gl.FLOAT, false, ps, 2 * 4);
        gl.enableVertexAttribArray(ptLoc.col);
        gl.vertexAttribPointer(ptLoc.col, 3, gl.FLOAT, false, ps, 3 * 4);
        gl.enableVertexAttribArray(ptLoc.opa);
        gl.vertexAttribPointer(ptLoc.opa, 1, gl.FLOAT, false, ps, 6 * 4);
        gl.drawArrays(gl.POINTS, 0, particles.length);
      }

      resize();
      draw();

      let roTimer;
      const ro = new ResizeObserver(() => {
        clearTimeout(roTimer);
        roTimer = setTimeout(resize, 120);
      });
      ro.observe(canvas);

      cleanupWebGL = () => {
        clearTimeout(roTimer);
        document.removeEventListener("visibilitychange", handleVisibility);
        if (rafId) cancelAnimationFrame(rafId);
        ro.disconnect();
        io.disconnect();
      };
    };

    const initialIo = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !initialized) {
          initialized = true;
          initWebGL();
        }
      },
      { threshold: 0 }
    );
    initialIo.observe(canvas);

    return () => {
      initialIo.disconnect();
      if (cleanupWebGL) cleanupWebGL();
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
