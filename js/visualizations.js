/*
 * Interactive Canvas visual explainers for the Physics Tutor.
 *
 * Each entry in VISUALS is: id -> function(canvas, controlsEl) => cleanup()
 * The function starts an animation on the canvas, may add interactive
 * controls to controlsEl, and returns a cleanup function that cancels
 * the animation loop and removes listeners.
 */
(function () {
  "use strict";

  // --- helpers -------------------------------------------------------------
  function fitCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 640;
    const h = rect.height || 360;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }

  function slider(controlsEl, label, min, max, value, step, onInput) {
    const wrap = document.createElement("label");
    wrap.className = "viz-control";
    const span = document.createElement("span");
    const out = document.createElement("output");
    const input = document.createElement("input");
    input.type = "range";
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = value;
    const render = () => {
      span.textContent = label;
      out.textContent = input.value;
    };
    input.addEventListener("input", () => {
      render();
      onInput(parseFloat(input.value));
    });
    render();
    wrap.appendChild(span);
    wrap.appendChild(input);
    wrap.appendChild(out);
    controlsEl.appendChild(wrap);
    return input;
  }

  function loop(draw) {
    let raf;
    let running = true;
    let t0 = performance.now();
    function frame(now) {
      if (!running) return;
      draw((now - t0) / 1000, now);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }

  const VISUALS = {};

  // --- Projectile motion ---------------------------------------------------
  VISUALS.projectile = function (canvas, controls) {
    let { ctx, w, h } = fitCanvas(canvas);
    let angle = 45; // degrees
    let speed = 28; // m/s (scaled)
    const g = 9.81;
    let start = performance.now();

    slider(controls, "Angle (°)", 10, 80, angle, 1, (v) => { angle = v; start = performance.now(); });
    slider(controls, "Speed", 10, 40, speed, 1, (v) => { speed = v; start = performance.now(); });

    const onResize = () => ({ ctx, w, h } = fitCanvas(canvas));
    window.addEventListener("resize", onResize);

    const stop = loop(() => {
      const groundY = h - 30;
      const scale = (w - 60) / ((speed * speed * Math.sin((2 * angle * Math.PI) / 180)) / g + 1);
      const s = Math.min(scale, 8);
      const rad = (angle * Math.PI) / 180;
      const vx = speed * Math.cos(rad);
      const vy = speed * Math.sin(rad);
      const T = (2 * vy) / g;
      let t = ((performance.now() - start) / 1000) % (T + 0.8);

      ctx.clearRect(0, 0, w, h);
      // ground
      ctx.strokeStyle = "#3a4a63";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, groundY);
      ctx.lineTo(w - 20, groundY);
      ctx.stroke();

      // trajectory (dotted full path)
      ctx.strokeStyle = "rgba(120,180,255,0.35)";
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      for (let tt = 0; tt <= T; tt += T / 60) {
        const x = 30 + vx * tt * s;
        const y = groundY - (vy * tt - 0.5 * g * tt * tt) * s;
        tt === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // projectile
      if (t <= T) {
        const x = 30 + vx * t * s;
        const y = groundY - (vy * t - 0.5 * g * t * t) * s;
        // velocity vector
        const cvx = vx, cvy = vy - g * t;
        ctx.strokeStyle = "#ffcc66";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + cvx * 4, y - cvy * 4);
        ctx.stroke();
        ctx.fillStyle = "#66e0ff";
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // labels
      ctx.fillStyle = "#9fb3c8";
      ctx.font = "13px system-ui, sans-serif";
      const R = ((speed * speed * Math.sin((2 * angle * Math.PI) / 180)) / g).toFixed(1);
      const H = ((speed * speed * Math.sin(rad) * Math.sin(rad)) / (2 * g)).toFixed(1);
      ctx.fillText(`Range ≈ ${R} m   Max height ≈ ${H} m   Flight ≈ ${T.toFixed(1)} s`, 34, 22);
    });

    return () => { stop(); window.removeEventListener("resize", onResize); };
  };

  // --- Pendulum / SHM ------------------------------------------------------
  VISUALS.pendulum = function (canvas, controls) {
    let { ctx, w, h } = fitCanvas(canvas);
    let length = 1.6; // m
    let amp = 0.5; // rad
    const g = 9.81;

    slider(controls, "Length (m)", 0.5, 3, length, 0.1, (v) => (length = v));
    slider(controls, "Amplitude", 0.1, 1.1, amp, 0.05, (v) => (amp = v));

    const onResize = () => ({ ctx, w, h } = fitCanvas(canvas));
    window.addEventListener("resize", onResize);

    const stop = loop((t) => {
      const omega = Math.sqrt(g / length);
      const theta = amp * Math.cos(omega * t);
      const pivotX = w / 2, pivotY = 40;
      const L = Math.min(h - 120, length * 120);
      const bx = pivotX + L * Math.sin(theta);
      const by = pivotY + L * Math.cos(theta);

      ctx.clearRect(0, 0, w, h);
      // reference arc
      ctx.strokeStyle = "rgba(120,180,255,0.2)";
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, L, Math.PI / 2 - amp, Math.PI / 2 + amp);
      ctx.stroke();
      // rod
      ctx.strokeStyle = "#7f93a8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(bx, by);
      ctx.stroke();
      // pivot + bob
      ctx.fillStyle = "#3a4a63";
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#66e0ff";
      ctx.beginPath();
      ctx.arc(bx, by, 16, 0, Math.PI * 2);
      ctx.fill();

      const period = (2 * Math.PI) / omega;
      ctx.fillStyle = "#9fb3c8";
      ctx.font = "13px system-ui, sans-serif";
      ctx.fillText(`Period T = 2π√(L/g) ≈ ${period.toFixed(2)} s`, 14, 22);
    });

    return () => { stop(); window.removeEventListener("resize", onResize); };
  };

  // --- Transverse wave -----------------------------------------------------
  VISUALS.wave = function (canvas, controls) {
    let { ctx, w, h } = fitCanvas(canvas);
    let freq = 1;
    let amp = 40;
    let wavelength = 160;

    slider(controls, "Frequency", 0.2, 3, freq, 0.1, (v) => (freq = v));
    slider(controls, "Amplitude", 10, 70, amp, 5, (v) => (amp = v));
    slider(controls, "Wavelength", 60, 300, wavelength, 10, (v) => (wavelength = v));

    const onResize = () => ({ ctx, w, h } = fitCanvas(canvas));
    window.addEventListener("resize", onResize);

    const stop = loop((t) => {
      ctx.clearRect(0, 0, w, h);
      const mid = h / 2;
      const k = (2 * Math.PI) / wavelength;
      const omega = 2 * Math.PI * freq;
      ctx.strokeStyle = "rgba(120,180,255,0.15)";
      ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(w, mid); ctx.stroke();

      ctx.strokeStyle = "#66e0ff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const y = mid + amp * Math.sin(k * x - omega * t);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // a highlighted oscillating particle
      const px = w * 0.5;
      const py = mid + amp * Math.sin(k * px - omega * t);
      ctx.fillStyle = "#ffcc66";
      ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = "#9fb3c8";
      ctx.font = "13px system-ui, sans-serif";
      ctx.fillText(`v = f·λ ≈ ${(freq * wavelength).toFixed(0)} px/s`, 14, 22);
    });

    return () => { stop(); window.removeEventListener("resize", onResize); };
  };

  // --- Circular / orbital motion -------------------------------------------
  VISUALS.orbit = function (canvas, controls) {
    let { ctx, w, h } = fitCanvas(canvas);
    let radius = 120;
    slider(controls, "Orbit radius", 60, 180, radius, 5, (v) => (radius = v));

    const onResize = () => ({ ctx, w, h } = fitCanvas(canvas));
    window.addEventListener("resize", onResize);

    const stop = loop((t) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      // Kepler: T^2 ∝ r^3  => omega ∝ r^-1.5
      const omega = 2.2 * Math.pow(120 / radius, 1.5);
      const a = omega * t;
      const px = cx + radius * Math.cos(a);
      const py = cy + radius * 0.7 * Math.sin(a);

      // orbit path
      ctx.strokeStyle = "rgba(120,180,255,0.3)";
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * 0.7, 0, 0, Math.PI * 2);
      ctx.stroke();
      // star
      ctx.fillStyle = "#ffcc66";
      ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(255,204,102,0.25)";
      ctx.beginPath(); ctx.arc(cx, cy, 26, 0, Math.PI * 2); ctx.stroke();
      // planet + gravity vector
      ctx.strokeStyle = "#ff7b7b";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx + (px - cx) * 0.8, cy + (py - cy) * 0.8); ctx.stroke();
      ctx.fillStyle = "#66e0ff";
      ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = "#9fb3c8";
      ctx.font = "13px system-ui, sans-serif";
      ctx.fillText("Kepler III: closer orbits move faster (T² ∝ r³)", 14, 22);
    });

    return () => { stop(); window.removeEventListener("resize", onResize); };
  };

  // --- Electric field of a dipole -----------------------------------------
  VISUALS.efield = function (canvas, controls) {
    let { ctx, w, h } = fitCanvas(canvas);
    let sep = 90;
    slider(controls, "Charge separation", 40, 160, sep, 5, (v) => (sep = v));

    const onResize = () => ({ ctx, w, h } = fitCanvas(canvas));
    window.addEventListener("resize", onResize);

    function field(x, y, charges) {
      let ex = 0, ey = 0;
      for (const c of charges) {
        const dx = x - c.x, dy = y - c.y;
        const r2 = dx * dx + dy * dy + 25;
        const r = Math.sqrt(r2);
        const e = (c.q * 800) / r2;
        ex += (e * dx) / r;
        ey += (e * dy) / r;
      }
      return [ex, ey];
    }

    const stop = loop((t) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const charges = [
        { x: cx - sep / 2, y: cy, q: 1 },
        { x: cx + sep / 2, y: cy, q: -1 },
      ];

      // animated field-line tracers
      const nLines = 16;
      for (let i = 0; i < nLines; i++) {
        const ang = (i / nLines) * Math.PI * 2;
        let x = charges[0].x + 12 * Math.cos(ang);
        let y = charges[0].y + 12 * Math.sin(ang);
        ctx.strokeStyle = "rgba(120,180,255,0.5)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (let step = 0; step < 220; step++) {
          const [ex, ey] = field(x, y, charges);
          const m = Math.hypot(ex, ey) || 1;
          x += (ex / m) * 4;
          y += (ey / m) * 4;
          if (x < 0 || x > w || y < 0 || y > h) break;
          ctx.lineTo(x, y);
          if (Math.hypot(x - charges[1].x, y - charges[1].y) < 12) break;
        }
        ctx.stroke();
      }

      // moving test charges along lines
      const phase = (t * 0.4) % 1;
      for (let i = 0; i < nLines; i++) {
        const ang = (i / nLines) * Math.PI * 2;
        let x = charges[0].x + 12 * Math.cos(ang);
        let y = charges[0].y + 12 * Math.sin(ang);
        const steps = Math.floor(phase * 120);
        for (let s = 0; s < steps; s++) {
          const [ex, ey] = field(x, y, charges);
          const m = Math.hypot(ex, ey) || 1;
          x += (ex / m) * 4; y += (ey / m) * 4;
          if (x < 0 || x > w || y < 0 || y > h) break;
        }
        ctx.fillStyle = "rgba(255,204,102,0.8)";
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
      }

      // charges
      for (const c of charges) {
        ctx.fillStyle = c.q > 0 ? "#ff7b7b" : "#66a3ff";
        ctx.beginPath(); ctx.arc(c.x, c.y, 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px system-ui, sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(c.q > 0 ? "+" : "−", c.x, c.y);
      }
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#9fb3c8";
      ctx.font = "13px system-ui, sans-serif";
      ctx.fillText("Field lines: out of +, into −", 14, 22);
    });

    return () => { stop(); window.removeEventListener("resize", onResize); };
  };

  // --- Simple circuit / Ohm's law -----------------------------------------
  VISUALS.circuit = function (canvas, controls) {
    let { ctx, w, h } = fitCanvas(canvas);
    let voltage = 6;
    let resistance = 3;
    slider(controls, "Voltage (V)", 1, 12, voltage, 0.5, (v) => (voltage = v));
    slider(controls, "Resistance (Ω)", 1, 12, resistance, 0.5, (v) => (resistance = v));

    const onResize = () => ({ ctx, w, h } = fitCanvas(canvas));
    window.addEventListener("resize", onResize);

    const stop = loop((t) => {
      ctx.clearRect(0, 0, w, h);
      const current = voltage / resistance; // amps
      const m = 40, x0 = m, y0 = 50, x1 = w - m, y1 = h - 50;

      // wire loop
      ctx.strokeStyle = "#7f93a8";
      ctx.lineWidth = 3;
      ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);

      // battery (left side)
      ctx.fillStyle = "#0f1826";
      ctx.fillRect(x0 - 8, (y0 + y1) / 2 - 24, 16, 48);
      ctx.strokeStyle = "#ffcc66";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x0 - 14, (y0 + y1) / 2 - 12); ctx.lineTo(x0 + 14, (y0 + y1) / 2 - 12);
      ctx.moveTo(x0 - 8, (y0 + y1) / 2 + 12); ctx.lineTo(x0 + 8, (y0 + y1) / 2 + 12);
      ctx.stroke();

      // resistor (right side, zigzag)
      const ry0 = (y0 + y1) / 2 - 30, ry1 = (y0 + y1) / 2 + 30;
      ctx.strokeStyle = "#ff7b7b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x1, ry0);
      const seg = (ry1 - ry0) / 6;
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(x1 + (i % 2 === 0 ? 12 : -12), ry0 + seg * (i + 0.5));
      }
      ctx.lineTo(x1, ry1);
      ctx.stroke();

      // electrons flowing around the loop (speed ∝ current)
      const perimeter = 2 * ((x1 - x0) + (y1 - y0));
      const nE = 24;
      const speed = 30 + current * 40;
      for (let i = 0; i < nE; i++) {
        let d = ((t * speed + (i * perimeter) / nE) % perimeter);
        let x, y;
        const wq = x1 - x0, hq = y1 - y0;
        if (d < wq) { x = x0 + d; y = y0; }
        else if (d < wq + hq) { x = x1; y = y0 + (d - wq); }
        else if (d < 2 * wq + hq) { x = x1 - (d - wq - hq); y = y1; }
        else { x = x0; y = y1 - (d - 2 * wq - hq); }
        ctx.fillStyle = "#66e0ff";
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
      }

      ctx.fillStyle = "#9fb3c8";
      ctx.font = "13px system-ui, sans-serif";
      ctx.fillText(`V = I·R  →  I = ${current.toFixed(2)} A,  P = ${(voltage * current).toFixed(1)} W`, x0, 30);
    });

    return () => { stop(); window.removeEventListener("resize", onResize); };
  };

  // --- Converging lens ray diagram ----------------------------------------
  VISUALS.lens = function (canvas, controls) {
    let { ctx, w, h } = fitCanvas(canvas);
    let objDist = 220; // px from lens
    let focal = 110;
    slider(controls, "Object distance", 130, 320, objDist, 5, (v) => (objDist = v));
    slider(controls, "Focal length", 60, 150, focal, 5, (v) => (focal = v));

    const onResize = () => ({ ctx, w, h } = fitCanvas(canvas));
    window.addEventListener("resize", onResize);

    const stop = loop(() => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, axisY = h / 2;
      const objH = 60;

      // optical axis
      ctx.strokeStyle = "rgba(120,180,255,0.2)";
      ctx.beginPath(); ctx.moveTo(0, axisY); ctx.lineTo(w, axisY); ctx.stroke();

      // lens
      ctx.strokeStyle = "#66a3ff";
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, axisY - 90); ctx.lineTo(cx, axisY + 90); ctx.stroke();
      // foci
      for (const fx of [cx - focal, cx + focal]) {
        ctx.fillStyle = "#9fb3c8";
        ctx.beginPath(); ctx.arc(fx, axisY, 3, 0, Math.PI * 2); ctx.fill();
      }

      // object
      const ox = cx - objDist;
      ctx.strokeStyle = "#ffcc66";
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(ox, axisY); ctx.lineTo(ox, axisY - objH); ctx.stroke();

      // thin-lens image position: 1/f = 1/do + 1/di
      const di = 1 / (1 / focal - 1 / objDist);
      const mag = -di / objDist;
      const ix = cx + di;
      const iy = axisY - objH * mag;

      // ray 1: parallel then through far focus
      ctx.strokeStyle = "#66e0ff";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(ox, axisY - objH); ctx.lineTo(cx, axisY - objH);
      ctx.lineTo(ix, iy); ctx.stroke();
      // ray 2: through centre (straight)
      ctx.beginPath();
      ctx.moveTo(ox, axisY - objH); ctx.lineTo(ix, iy); ctx.stroke();

      // image
      if (isFinite(di)) {
        ctx.strokeStyle = "#ff7b7b";
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(ix, axisY); ctx.lineTo(ix, iy); ctx.stroke();
      }

      ctx.fillStyle = "#9fb3c8";
      ctx.font = "13px system-ui, sans-serif";
      const kind = objDist > focal ? "real, inverted" : "virtual, upright";
      ctx.fillText(`1/f = 1/dₒ + 1/dᵢ  →  image is ${kind} (mag ${mag.toFixed(2)}×)`, 14, 22);
    });

    return () => { stop(); window.removeEventListener("resize", onResize); };
  };

  // --- Double-slit interference -------------------------------------------
  VISUALS.interference = function (canvas, controls) {
    let { ctx, w, h } = fitCanvas(canvas);
    let slit = 60; // separation
    let wavelength = 26;
    slider(controls, "Slit separation", 30, 120, slit, 5, (v) => (slit = v));
    slider(controls, "Wavelength", 14, 44, wavelength, 2, (v) => (wavelength = v));

    const onResize = () => ({ ctx, w, h } = fitCanvas(canvas));
    window.addEventListener("resize", onResize);

    const stop = loop((t) => {
      const img = ctx.createImageData(w, h);
      const data = img.data;
      const s1y = h / 2 - slit / 2, s2y = h / 2 + slit / 2;
      const s1x = 60, s2x = 60;
      const k = (2 * Math.PI) / wavelength;
      const omega = 4;
      for (let y = 0; y < h; y += 2) {
        for (let x = 62; x < w; x += 2) {
          const r1 = Math.hypot(x - s1x, y - s1y);
          const r2 = Math.hypot(x - s2x, y - s2y);
          const val =
            Math.sin(k * r1 - omega * t) / Math.sqrt(r1 + 1) +
            Math.sin(k * r2 - omega * t) / Math.sqrt(r2 + 1);
          const c = Math.max(0, Math.min(255, 128 + val * 400));
          for (let dy = 0; dy < 2; dy++) {
            for (let dx = 0; dx < 2; dx++) {
              const idx = ((y + dy) * w + (x + dx)) * 4;
              data[idx] = c * 0.4;
              data[idx + 1] = c * 0.78;
              data[idx + 2] = c;
              data[idx + 3] = 255;
            }
          }
        }
      }
      ctx.putImageData(img, 0, 0);

      // barrier + slits
      ctx.fillStyle = "#0a0f18";
      ctx.fillRect(56, 0, 8, h);
      ctx.clearRect(56, s1y - 6, 8, 12);
      ctx.clearRect(56, s2y - 6, 8, 12);
      ctx.fillStyle = "#66e0ff";
      ctx.beginPath(); ctx.arc(60, s1y, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(60, s2y, 3, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = "#dbe7f3";
      ctx.font = "13px system-ui, sans-serif";
      ctx.fillText("Bright = constructive, dark = destructive interference", 70, 20);
    });

    return () => { stop(); window.removeEventListener("resize", onResize); };
  };

  // --- Quantum particle in a box ------------------------------------------
  VISUALS.quantumbox = function (canvas, controls) {
    let { ctx, w, h } = fitCanvas(canvas);
    let n = 2; // quantum number
    slider(controls, "Energy level n", 1, 5, n, 1, (v) => (n = Math.round(v)));

    const onResize = () => ({ ctx, w, h } = fitCanvas(canvas));
    window.addEventListener("resize", onResize);

    const stop = loop((t) => {
      ctx.clearRect(0, 0, w, h);
      const m = 50;
      const x0 = m, x1 = w - m, L = x1 - x0;
      const base = h * 0.62;
      const A = h * 0.22;

      // box walls
      ctx.strokeStyle = "#7f93a8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x0, base - A * 1.6); ctx.lineTo(x0, base + A * 1.6);
      ctx.moveTo(x1, base - A * 1.6); ctx.lineTo(x1, base + A * 1.6);
      ctx.moveTo(x0, base + A * 1.6); ctx.lineTo(x1, base + A * 1.6);
      ctx.stroke();

      const E = n * n; // ∝ n^2
      const omega = 0.6 + E * 0.15;
      const phase = Math.cos(omega * t);

      // probability density |ψ|^2 (filled)
      ctx.fillStyle = "rgba(102,224,255,0.18)";
      ctx.beginPath();
      ctx.moveTo(x0, base);
      for (let i = 0; i <= L; i++) {
        const xx = i / L;
        const psi = Math.sin(n * Math.PI * xx);
        const p = psi * psi;
        ctx.lineTo(x0 + i, base - p * A * 1.4);
      }
      ctx.lineTo(x1, base);
      ctx.closePath();
      ctx.fill();

      // wavefunction ψ (oscillating in time)
      ctx.strokeStyle = "#66e0ff";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= L; i++) {
        const xx = i / L;
        const psi = Math.sin(n * Math.PI * xx) * phase;
        const y = base - psi * A;
        i === 0 ? ctx.moveTo(x0 + i, y) : ctx.lineTo(x0 + i, y);
      }
      ctx.stroke();

      ctx.fillStyle = "#9fb3c8";
      ctx.font = "13px system-ui, sans-serif";
      ctx.fillText(`n = ${n}: Eₙ ∝ n² = ${E}  ·  shaded region = probability |ψ|²`, x0, 26);
    });

    return () => { stop(); window.removeEventListener("resize", onResize); };
  };

  window.PHYSICS_VISUALS = VISUALS;
})();
