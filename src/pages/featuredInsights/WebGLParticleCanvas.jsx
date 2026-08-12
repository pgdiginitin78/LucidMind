import { useRef, useEffect } from "react";

export default function WebGLParticleCanvas({ variant }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false, // disable AA for perf – not needed for particles
    });
    if (!gl) return;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    /* ── Shaders for Glowing Particles ── */
    const VERT = `
      attribute vec2 a_pos;
      attribute float a_sz;
      attribute vec3 a_col;
      attribute float a_opa;
      uniform vec2 u_res;
      varying vec3 v_col;
      varying float v_opa;
      void main() {
        vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
        gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
        gl_PointSize = a_sz;
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
        float core = 1.0 - smoothstep(0.0, 0.18, d);
        float glow = 1.0 - smoothstep(0.08, 0.50, d);
        float a = (core * 0.92 + glow * 0.50) * v_opa;
        gl_FragColor = vec4(v_col, a);
      }
    `;

    /* ── Shaders for Network Lines ── */
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
      void main() { gl_FragColor = vec4(v_col, v_opa); }
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

    // Color definitions
    // Blue #2563EB = [0.145, 0.388, 0.922]
    // Teal #00C4B4 = [0.000, 0.769, 0.706]
    const BLUE = [0.145, 0.388, 0.922];
    const TEAL = [0.000, 0.769, 0.706];

    const pool = variant === "articles"
      ? [TEAL, TEAL, TEAL, BLUE, TEAL]
      : [BLUE, BLUE, BLUE, TEAL, BLUE];

    let W = 0, H = 0, particles = [], rafId;
    const ptBuf = gl.createBuffer();
    const lnBuf = gl.createBuffer();

    // Mouse state
    const mouse = { x: -1000, y: -1000, active: false };

    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    }

    function handleMouseLeave() {
      mouse.active = false;
    }

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    function rand(a, b) { return Math.random() * (b - a) + a; }

    function init() {
      // Create high-density particles for rich cinematic cloud + mesh effect
      let density = 3200;
      let maxCount = 280;
      
      if (variant === "minimal") {
        density = 10000;
        maxCount = 80;
      }

      const count = Math.min(Math.floor((W * H) / density), maxCount);
      const centerX = W * 0.5;
      const centerY = H * 0.5;

      particles = Array.from({ length: count }, (_, i) => {
        const radius = rand(30, Math.max(W, H) * 0.55); // slightly smaller orbit
        const angle = rand(0, Math.PI * 2);
        const speed = rand(0.001, 0.004) * (Math.random() < 0.15 ? -1 : 1); // slower speeds
        const isMeshNode = i < count * 0.4; // fewer mesh nodes = fewer line checks

        return {
          // Orbit parameters
          originX: centerX + rand(-W * 0.25, W * 0.25),
          originY: centerY + rand(-H * 0.2, H * 0.2),
          radiusX: radius,
          radiusY: radius * rand(0.55, 0.85), // Elliptical orbit
          angle,
          speed,
          tilt: rand(-0.4, 0.4),

          // Current calculated position
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,

          // Visual properties
          baseSize: isMeshNode ? rand(5, 10) : rand(2, 4.5),
          size: 0,
          isMeshNode,
          col: pool[Math.floor(Math.random() * pool.length)],
          baseOpa: isMeshNode ? rand(0.45, 0.85) : rand(0.2, 0.5),
          opa: 0,
          pulse: rand(0, Math.PI * 2),
          pulseSpeed: rand(0.01, 0.03),
        };
      });
    }

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      gl.viewport(0, 0, W, H);
      init();
      // Pre-allocate typed arrays sized to worst-case after resize
      const maxMesh = Math.ceil(particles.length * 0.4);
      const maxLines = maxMesh * maxMesh; // upper bound
      ptDataBuf = new Float32Array(particles.length * 7);
      lnDataBuf = new Float32Array(maxLines * 12); // 2 verts * 6 floats
    }

    // Pre-allocated typed arrays (reused each frame to avoid GC churn)
    let ptDataBuf = new Float32Array(0);
    let lnDataBuf = new Float32Array(0);
    let isVisible = true;
    let isIntersecting = true;

    const handleVisibility = () => { isVisible = document.visibilityState === "visible"; };
    document.addEventListener("visibilitychange", handleVisibility);

    const io = new IntersectionObserver((entries) => {
      isIntersecting = entries[0].isIntersecting;
    }, { threshold: 0 });
    io.observe(canvas);

    function draw() {
      rafId = requestAnimationFrame(draw);
      if (!isVisible || !isIntersecting) return;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const MOUSE_RADIUS = 180;
      const MAX_LINE_DIST = 120;
      const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;
      const MAX_LINE_DIST_SQ = MAX_LINE_DIST * MAX_LINE_DIST;

      // Update particle positions
      for (const p of particles) {
        p.angle -= p.speed;
        p.pulse += p.pulseSpeed;

        let targetX = p.originX + Math.cos(p.angle) * p.radiusX + Math.sin(p.angle) * p.tilt * 50;
        let targetY = p.originY + Math.sin(p.angle) * p.radiusY;

        if (mouse.active) {
          const dx = mouse.x - targetX;
          const dy = mouse.y - targetY;
          const distSq = dx * dx + dy * dy;

          if (distSq < MOUSE_RADIUS_SQ) {
            const dist = Math.sqrt(distSq);
            const pull = (1 - dist / MOUSE_RADIUS);
            const angleToMouse = Math.atan2(dy, dx);
            const tangentAngle = angleToMouse - Math.PI / 2;

            targetX += Math.cos(tangentAngle) * pull * 20 - Math.cos(angleToMouse) * pull * 12;
            targetY += Math.sin(tangentAngle) * pull * 20 - Math.sin(angleToMouse) * pull * 12;
          }
        }

        p.x += (targetX - p.x) * 0.07;
        p.y += (targetY - p.y) * 0.07;

        const pulseFactor = 0.85 + 0.15 * Math.sin(p.pulse);
        let glowBoost = 1.0;
        let sizeBoost = 1.0;

        if (mouse.active) {
          const ddx = mouse.x - p.x;
          const ddy = mouse.y - p.y;
          const distMouseSq = ddx * ddx + ddy * ddy;
          if (distMouseSq < MOUSE_RADIUS_SQ) {
            const factor = 1.0 - Math.sqrt(distMouseSq) / MOUSE_RADIUS;
            glowBoost = 1.0 + factor * 2.0;
            sizeBoost = 1.0 + factor * 1.2;
          }
        }

        p.size = p.baseSize * pulseFactor * sizeBoost;
        p.opa = Math.min(1.0, p.baseOpa * pulseFactor * glowBoost);
      }

      /* ── Line Pass (Faint/Subtle Network Mesh Lines) ── */
      let lnCount = 0;
      const meshParticles = particles.filter(p => p.isMeshNode);

      for (let i = 0; i < meshParticles.length; i++) {
        const p1 = meshParticles[i];

        for (let j = i + 1; j < meshParticles.length; j++) {
          const p2 = meshParticles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dSq = dx * dx + dy * dy;

          if (dSq < MAX_LINE_DIST_SQ) {
            const d = Math.sqrt(dSq);
            let t = 1 - d / MAX_LINE_DIST;
            let alpha = t * t * 0.16;

            if (mouse.active) {
              const mDx1 = mouse.x - p1.x, mDy1 = mouse.y - p1.y;
              const mDx2 = mouse.x - p2.x, mDy2 = mouse.y - p2.y;
              if (mDx1*mDx1 + mDy1*mDy1 < MOUSE_RADIUS_SQ || mDx2*mDx2 + mDy2*mDy2 < MOUSE_RADIUS_SQ) {
                alpha *= 1.5;
              }
            }

            alpha = Math.min(0.32, alpha);

            const c0 = (p1.col[0] + p2.col[0]) * 0.5;
            const c1 = (p1.col[1] + p2.col[1]) * 0.5;
            const c2 = (p1.col[2] + p2.col[2]) * 0.5;
            const base = lnCount * 12;
            lnDataBuf[base]     = p1.x;  lnDataBuf[base+1]  = p1.y;
            lnDataBuf[base+2]   = c0;    lnDataBuf[base+3]  = c1;    lnDataBuf[base+4]  = c2;  lnDataBuf[base+5]  = alpha;
            lnDataBuf[base+6]   = p2.x;  lnDataBuf[base+7]  = p2.y;
            lnDataBuf[base+8]   = c0;    lnDataBuf[base+9]  = c1;    lnDataBuf[base+10] = c2;  lnDataBuf[base+11] = alpha * 0.4;
            lnCount++;
          }
        }

        // Mouse connection lines
        if (mouse.active) {
          const dx = mouse.x - p1.x;
          const dy = mouse.y - p1.y;
          const dSq2 = dx * dx + dy * dy;

          if (dSq2 < MOUSE_RADIUS_SQ) {
            const t = 1 - Math.sqrt(dSq2) / MOUSE_RADIUS;
            const alpha = t * t * 0.25;
            const base = lnCount * 12;
            lnDataBuf[base]   = mouse.x; lnDataBuf[base+1] = mouse.y;
            lnDataBuf[base+2] = p1.col[0]; lnDataBuf[base+3] = p1.col[1]; lnDataBuf[base+4] = p1.col[2]; lnDataBuf[base+5] = alpha;
            lnDataBuf[base+6] = p1.x;    lnDataBuf[base+7] = p1.y;
            lnDataBuf[base+8] = p1.col[0]; lnDataBuf[base+9] = p1.col[1]; lnDataBuf[base+10] = p1.col[2]; lnDataBuf[base+11] = alpha * 0.3;
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
        gl.enableVertexAttribArray(lnLoc.pos); gl.vertexAttribPointer(lnLoc.pos, 2, gl.FLOAT, false, s, 0);
        gl.enableVertexAttribArray(lnLoc.col); gl.vertexAttribPointer(lnLoc.col, 3, gl.FLOAT, false, s, 2*4);
        gl.enableVertexAttribArray(lnLoc.opa); gl.vertexAttribPointer(lnLoc.opa, 1, gl.FLOAT, false, s, 5*4);
        gl.drawArrays(gl.LINES, 0, lnCount * 2);
      }

      /* ── Particle Point Pass ── */
      for (let pi = 0; pi < particles.length; pi++) {
        const p = particles[pi];
        const base = pi * 7;
        ptDataBuf[base]   = p.x;    ptDataBuf[base+1] = p.y;    ptDataBuf[base+2] = p.size;
        ptDataBuf[base+3] = p.col[0]; ptDataBuf[base+4] = p.col[1]; ptDataBuf[base+5] = p.col[2];
        ptDataBuf[base+6] = p.opa;
      }

      gl.useProgram(ptProg);
      gl.uniform2f(ptLoc.res, W, H);
      gl.bindBuffer(gl.ARRAY_BUFFER, ptBuf);
      gl.bufferData(gl.ARRAY_BUFFER, ptDataBuf.subarray(0, particles.length * 7), gl.DYNAMIC_DRAW);
      const ps = 7 * 4;
      gl.enableVertexAttribArray(ptLoc.pos); gl.vertexAttribPointer(ptLoc.pos, 2, gl.FLOAT, false, ps, 0);
      gl.enableVertexAttribArray(ptLoc.sz);  gl.vertexAttribPointer(ptLoc.sz,  1, gl.FLOAT, false, ps, 2*4);
      gl.enableVertexAttribArray(ptLoc.col); gl.vertexAttribPointer(ptLoc.col, 3, gl.FLOAT, false, ps, 3*4);
      gl.enableVertexAttribArray(ptLoc.opa); gl.vertexAttribPointer(ptLoc.opa, 1, gl.FLOAT, false, ps, 6*4);
      gl.drawArrays(gl.POINTS, 0, particles.length);
    }

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
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
        zIndex: 0,
      }}
    />
  );
}
