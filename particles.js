(() => {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  const CONFIG = {
    spacing: 34,
    baseRadius: 1.1,
    maxRadius: 3.8,
    waves: [
      { speed: 0.012, length: 300, amplitude: 0.7, cx: 0.5, cy: 0.5 },
      { speed: 0.008, length: 200, amplitude: 0.35, cx: 0.25, cy: 0.75 },
      { speed: 0.014, length: 380, amplitude: 0.25, cx: 0.8, cy: 0.25 },
    ],
    mouseRadius: 170,
    mouseStrength: 4.5,
    mouseRepel: 20,
    dotOpacityMin: 0.04,
    dotOpacityMax: 0.22,
    mouseLerp: 0.08,
  };

  let width, height, dots = [];
  let mouse = { x: -9999, y: -9999, active: false };
  let smoothMouse = { x: -9999, y: -9999 };
  let time = 0;

  function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    dots = [];
    const cols = Math.ceil(width / CONFIG.spacing) + 4;
    const rows = Math.ceil(height / CONFIG.spacing) + 4;
    const offsetX = (width - (cols - 1) * CONFIG.spacing) / 2;
    const offsetY = (height - (rows - 1) * CONFIG.spacing) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ox = offsetX + c * CONFIG.spacing;
        const oy = offsetY + r * CONFIG.spacing;
        dots.push({ originX: ox, originY: oy, cx: ox, cy: oy, cr: CONFIG.baseRadius, co: CONFIG.dotOpacityMin });
      }
    }
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    time++;
    ctx.clearRect(0, 0, width, height);

    if (mouse.active) {
      smoothMouse.x = lerp(smoothMouse.x, mouse.x, CONFIG.mouseLerp);
      smoothMouse.y = lerp(smoothMouse.y, mouse.y, CONFIG.mouseLerp);
    } else {
      smoothMouse.x = lerp(smoothMouse.x, -9999, 0.02);
      smoothMouse.y = lerp(smoothMouse.y, -9999, 0.02);
    }

    const totalAmp = CONFIG.waves.reduce((s, w) => s + w.amplitude, 0);

    for (const dot of dots) {
      let waveSum = 0;
      for (const w of CONFIG.waves) {
        const dist = Math.sqrt((dot.originX - width * w.cx) ** 2 + (dot.originY - height * w.cy) ** 2);
        waveSum += Math.sin(dist / w.length * Math.PI * 2 - time * w.speed) * w.amplitude;
      }
      const wn = (waveSum / totalAmp + 1) / 2;
      const ew = wn * wn * (3 - 2 * wn);

      let tr = CONFIG.baseRadius + ew * (CONFIG.maxRadius - CONFIG.baseRadius);
      let to = CONFIG.dotOpacityMin + ew * (CONFIG.dotOpacityMax - CONFIG.dotOpacityMin);
      let tx = dot.originX, ty = dot.originY;

      const dx = dot.originX - smoothMouse.x, dy = dot.originY - smoothMouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius && dist > 0) {
        const t = 1 - dist / CONFIG.mouseRadius;
        const e = t * t * t;
        tr += e * CONFIG.mouseStrength;
        to = Math.min(to + e * 0.4, 0.7);
        tx += (dx / dist) * e * CONFIG.mouseRepel;
        ty += (dy / dist) * e * CONFIG.mouseRepel;
      }

      dot.cr = lerp(dot.cr, tr, 0.12);
      dot.co = lerp(dot.co, to, 0.12);
      dot.cx = lerp(dot.cx, tx, 0.12);
      dot.cy = lerp(dot.cy, ty, 0.12);

      ctx.beginPath();
      ctx.arc(dot.cx, dot.cy, Math.max(dot.cr, 0.3), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${dot.co})`;
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(init, 150); });
  canvas.style.pointerEvents = 'auto';
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; });
  window.addEventListener('mouseleave', () => { mouse.active = false; });
  window.addEventListener('touchmove', (e) => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; mouse.active = true; }, { passive: true });
  window.addEventListener('touchend', () => { mouse.active = false; });

  init();
  animate();
})();
