import { useEffect, useRef } from 'react';

/**
 * The manuscript-paper backdrop for Section 05 - flowing 5-line staves that wave
 * and drift across the whole section instead of ruling it in rigid horizontal
 * stripes. Each staff system gets its own amplitude / frequency / phase / tilt so
 * the page never reads as uniform. Faint ink on transparent (paper shows through).
 *
 * Decorative: dpr is capped at 1, the RAF is gated to when the section is in view,
 * and motion freezes under prefers-reduced-motion.
 */

const INK = '10,10,10';
const STAFF_LINES = 5;
const LINE_GAP = 7; // px between the 5 lines of one staff
const SYSTEM_GAP = 78; // px between staff systems
const X_STEP = 16; // polyline resolution

// deterministic per-system params so the flow is varied but stable
const sysParams = (i: number) => {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  const r = s - Math.floor(s);
  const s2 = Math.sin(i * 78.233) * 12543.231;
  const r2 = s2 - Math.floor(s2);
  return {
    amp: 5 + r * 9, // 5..14 px wave height
    freq: 0.0035 + r2 * 0.0045, // gentle horizontal frequency
    phaseOff: r * Math.PI * 2,
    tilt: (r2 - 0.5) * 0.06, // slight per-system slope
    speed: 0.4 + r2 * 0.6,
  };
};

export default function StaffFlow() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0;
    let H = 0;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W); // dpr 1 - faint decorative lines
      canvas.height = Math.round(H);
    };
    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) render(0);
    });
    ro.observe(wrap);

    const render = (phase: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${INK},0.1)`;
      const systems = Math.ceil(H / SYSTEM_GAP) + 1;
      for (let sIdx = 0; sIdx < systems; sIdx++) {
        const top = sIdx * SYSTEM_GAP + 24;
        const p = sysParams(sIdx);
        for (let l = 0; l < STAFF_LINES; l++) {
          const baseY = top + l * LINE_GAP;
          ctx.beginPath();
          for (let x = 0; x <= W + X_STEP; x += X_STEP) {
            const y =
              baseY +
              p.tilt * x +
              p.amp * Math.sin(x * p.freq + p.phaseOff + phase * p.speed);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }
    };

    let raf = 0;
    let start = performance.now();
    let active = false;

    const loop = (now: number) => {
      render((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduce) {
          if (!active) {
            active = true;
            start = performance.now();
            raf = requestAnimationFrame(loop);
          }
        } else {
          active = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: '120px' }
    );
    io.observe(wrap);

    if (reduce) render(0);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className="pointer-events-none absolute inset-0">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
