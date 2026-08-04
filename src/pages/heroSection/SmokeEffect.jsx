import { useEffect, useRef } from 'react';

const SmokeEffect = ({ className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl = canvas.getContext('webgl2', {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    });

    const isWebGL2 = !!gl;
    if (!gl) {
      gl = canvas.getContext('webgl', {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false,
      });
    }

    if (!gl) return;

    // Check extensions
    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float');
      gl.getExtension('OES_texture_float_linear');
    } else {
      gl.getExtension('OES_texture_float');
      gl.getExtension('OES_texture_float_linear');
      gl.getExtension('WEBGL_color_buffer_float');
    }

    const halfFloat = isWebGL2 ? gl.HALF_FLOAT : gl.getExtension('OES_texture_half_float')?.HALF_FLOAT_OES || gl.FLOAT;

    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    const baseVertexShaderSource = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;

      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // Splat shader - soft ink injection with capped intensity
    const splatShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;

      void main () {
        vec2 p = vUv - point;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        // Cap maximum accumulated density to prevent over-exposure/white blowout
        gl_FragColor = vec4(min(base + splat, vec3(0.5)), 1.0);
      }
    `;

    const advectionShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;

      void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * texture2D(uSource, coord);
      }
    `;

    const divergenceShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    const curlShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `;

    const vorticityShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vT;
      varying vec2 vB;
      varying vec2 vL;
      varying vec2 vR;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;

      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
      }
    `;

    const pressureShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;

      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float div = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - div) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `;

    const gradientSubtractShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;

      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B) * 0.5;
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `;

    // Extremely dark, subtle, misty cyan shader matching digitz.fr exact low-contrast look (no white blowouts)
    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTexture;

      void main () {
        vec3 density = texture2D(uTexture, vUv).rgb;
        float val = max(density.r, max(density.g, density.b));
        
        // Low-contrast muted cyan smoke tone matching digitz.fr screenshot
        vec3 darkCyan = vec3(0.04, 0.16, 0.22);
        vec3 midCyan = vec3(0.12, 0.35, 0.44);
        
        vec3 col = mix(darkCyan, midCyan, smoothstep(0.0, 0.4, val));
        float alpha = clamp(val * 0.6, 0.0, 0.4);
        
        gl_FragColor = vec4(col * alpha, alpha);
      }
    `;

    function compileShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function createProgram(vertexSource, fragmentSource) {
      const program = gl.createProgram();
      const vs = compileShader(gl.VERTEX_SHADER, vertexSource);
      const fs = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
      if (!vs || !fs) return null;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);

      const uniforms = {};
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const name = gl.getActiveUniform(program, i).name;
        uniforms[name] = gl.getUniformLocation(program, name);
      }

      return { program, uniforms };
    }

    const splatProgram = createProgram(baseVertexShaderSource, splatShaderSource);
    const advectionProgram = createProgram(baseVertexShaderSource, advectionShaderSource);
    const divergenceProgram = createProgram(baseVertexShaderSource, divergenceShaderSource);
    const curlProgram = createProgram(baseVertexShaderSource, curlShaderSource);
    const vorticityProgram = createProgram(baseVertexShaderSource, vorticityShaderSource);
    const pressureProgram = createProgram(baseVertexShaderSource, pressureShaderSource);
    const gradSubProgram = createProgram(baseVertexShaderSource, gradientSubtractShaderSource);
    const displayProgram = createProgram(baseVertexShaderSource, displayShaderSource);

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    function createFBO(w, h, internalFormat, format, type, param) {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        attach(id) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(w, h, internalFormat, format, type, param) {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);

      return {
        get read() {
          return fbo1;
        },
        get write() {
          return fbo2;
        },
        swap() {
          const temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    }

    const simWidth = 128;
    const simHeight = 128;
    const dyeWidth = 512;
    const dyeHeight = 512;

    const formatRGBA = isWebGL2 ? gl.RGBA16F : gl.RGBA;
    const formatRG = isWebGL2 ? gl.RG16F : gl.RGBA;
    const filtering = gl.LINEAR;

    let density = createDoubleFBO(dyeWidth, dyeHeight, formatRGBA, gl.RGBA, halfFloat, filtering);
    let velocity = createDoubleFBO(simWidth, simHeight, formatRG, isWebGL2 ? gl.RG : gl.RGBA, halfFloat, filtering);
    let divergence = createFBO(simWidth, simHeight, isWebGL2 ? gl.R16F : gl.RGBA, isWebGL2 ? gl.RED : gl.RGBA, halfFloat, gl.NEAREST);
    let curlFBO = createFBO(simWidth, simHeight, isWebGL2 ? gl.R16F : gl.RGBA, isWebGL2 ? gl.RED : gl.RGBA, halfFloat, gl.NEAREST);
    let pressure = createDoubleFBO(simWidth, simHeight, isWebGL2 ? gl.R16F : gl.RGBA, isWebGL2 ? gl.RED : gl.RGBA, halfFloat, gl.NEAREST);

    function blit(destination) {
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);
      if (!destination) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, destination.fbo);
        gl.viewport(0, 0, destination.width, destination.height);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    const mouse = {
      x: 0.5,
      y: 0.5,
      dx: 0,
      dy: 0,
      moved: false,
    };

    function updatePointer(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = 1.0 - (clientY - rect.top) / rect.height;

      mouse.dx = (x - mouse.x) * 1200.0;
      mouse.dy = (y - mouse.y) * 1200.0;
      mouse.x = x;
      mouse.y = y;
      mouse.moved = true;
    }

    function onMouseMove(e) {
      updatePointer(e.clientX, e.clientY);
    }

    function onTouchMove(e) {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    function resize() {
      const w = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      const h = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
      }
    }

    window.addEventListener('resize', resize);
    resize();

    // Muted dark cyan dye vector (low intensity)
    const SUBTLE_CYAN_DYE = [0.03, 0.12, 0.15];

    function splat(x, y, dx, dy, color, radius = 0.003) {
      gl.useProgram(splatProgram.program);
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProgram.uniforms.point, x, y);
      gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
      gl.uniform1f(splatProgram.uniforms.radius, radius);
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(splatProgram.uniforms.uTarget, density.read.attach(0));
      gl.uniform3f(splatProgram.uniforms.color, color[0], color[1], color[2]);
      blit(density.write);
      density.swap();
    }

    let frame = 0;
    let lastTime = Date.now();
    let animId;

    function step() {
      frame++;
      const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
      lastTime = Date.now();

      // Subtle ambient Lissajous motion (very small dye injection)
      const t = frame * 0.008;
      const e0x = 0.5 + 0.3 * Math.sin(t * 0.8);
      const e0y = 0.5 + 0.25 * Math.cos(t * 1.1);
      const e1x = 0.5 + 0.32 * Math.cos(t * 0.65);
      const e1y = 0.5 + 0.22 * Math.sin(t * 1.25);

      if (frame % 8 === 0) {
        splat(e0x, e0y, Math.cos(t * 2.0) * 2.0, Math.sin(t * 2.0) * 2.0, [0.01, 0.04, 0.05], 0.002);
        splat(e1x, e1y, -Math.sin(t * 1.8) * 2.0, Math.cos(t * 1.8) * 2.0, [0.01, 0.04, 0.05], 0.002);
      }

      if (mouse.moved) {
        mouse.moved = false;
        splat(mouse.x, mouse.y, mouse.dx, mouse.dy, SUBTLE_CYAN_DYE, 0.004);
      }

      // Curl (28.0 for subtle wispy smoke)
      gl.useProgram(curlProgram.program);
      gl.uniform2f(curlProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curlFBO);

      gl.useProgram(vorticityProgram.program);
      gl.uniform2f(vorticityProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curlFBO.attach(1));
      gl.uniform1f(vorticityProgram.uniforms.curl, 28.0);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      // Divergence
      gl.useProgram(divergenceProgram.program);
      gl.uniform2f(divergenceProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      // Pressure Jacobi Solver
      gl.useProgram(pressureProgram.program);
      gl.uniform2f(pressureProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < 20; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      // Gradient Subtract
      gl.useProgram(gradSubProgram.program);
      gl.uniform2f(gradSubProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
      gl.uniform1i(gradSubProgram.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradSubProgram.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      // Advection with smooth decay
      gl.useProgram(advectionProgram.program);
      gl.uniform2f(advectionProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read.attach(0));
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(advectionProgram.uniforms.dissipation, 0.985);
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource, density.read.attach(1));
      gl.uniform1f(advectionProgram.uniforms.dissipation, 0.985);
      blit(density.write);
      density.swap();

      // Display extremely subtle, dark misty smoke matching digitz.fr
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.useProgram(displayProgram.program);
      gl.uniform1i(displayProgram.uniforms.uTexture, density.read.attach(0));
      blit(null);

      animId = requestAnimationFrame(step);
    }

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto cursor-default ${className}`}
    />
  );
};

export default SmokeEffect;
