import { useEffect, useRef } from 'react';

/**
 * Neon doodle layer for the vaporwave hero: click + drag to draw a thick glowing neon
 * line that holds, then fades cleanly to nothing.
 *
 * Two offscreen buffers accumulate the drawing - the glowing colored BODY and the white
 * CORE - kept separate so the core is always composited last (a later segment's body can
 * no longer cover an earlier segment's bright center). Each frame the visible canvas is
 * cleared and both buffers are blitted at a fading alpha, so there is ZERO leftover residue.
 * Performance-first: one rAF loop that only runs while drawing + during the fade, then
 * sleeps; window listeners early-return when idle.
 */

const NEON = ['#FF49C7', '#2DE2E6', '#FF6AD5', '#C77DFF'];
const HOLD_MS = 900; // stays fully visible this long after you release...
const FADE_MS = 2400; // ...then fades cleanly to zero
const LINE_W = 7;

export default function NeonDraw() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // separate buffers: glowing body + white core (core blits last so it's never covered)
    const body = document.createElement('canvas');
    const core = document.createElement('canvas');
    const bctx = body.getContext('2d');
    const cctx = core.getContext('2d');
    if (!bctx || !cctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let cssW = 0;
    let cssH = 0;
    let rect = canvas.getBoundingClientRect();
    const resize = () => {
      rect = canvas.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      canvas.width = body.width = core.width = Math.round(cssW * dpr);
      canvas.height = body.height = core.height = Math.round(cssH * dpr);
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw the buffers in CSS coords
      cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // visible ctx stays at identity: only clear + drawImage(buffers) 1:1 in device px
    };
    resize();

    let down = false;
    let color = NEON[0];
    let lastX = 0;
    let lastY = 0;
    let releaseAt = 0;
    let raf = 0;

    const inBounds = (x: number, y: number) => x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

    const segment = (clientX: number, clientY: number) => {
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      // glowing colored body -> body buffer
      bctx.lineCap = 'round';
      bctx.lineJoin = 'round';
      bctx.strokeStyle = color;
      bctx.shadowColor = color;
      bctx.shadowBlur = 14;
      bctx.lineWidth = LINE_W;
      bctx.beginPath();
      bctx.moveTo(lastX, lastY);
      bctx.lineTo(x, y);
      bctx.stroke();
      // white-hot core -> core buffer (composited on top later)
      cctx.lineCap = 'round';
      cctx.lineJoin = 'round';
      cctx.strokeStyle = '#FFFFFF';
      cctx.lineWidth = LINE_W * 0.4;
      cctx.beginPath();
      cctx.moveTo(lastX, lastY);
      cctx.lineTo(x, y);
      cctx.stroke();
      lastX = x;
      lastY = y;
      ensure();
    };

    const tick = () => {
      let alpha = 1; // full while drawing and during the hold
      if (!down) {
        const t = performance.now() - releaseAt - HOLD_MS;
        if (t > 0) alpha = 1 - t / FADE_MS;
      }
      if (alpha < 0) alpha = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (alpha > 0) {
        ctx.globalAlpha = alpha;
        ctx.drawImage(body, 0, 0);
        ctx.globalAlpha = alpha * 0.9; // core slightly under-blended so it reads as a glow center
        ctx.drawImage(core, 0, 0);
        ctx.globalAlpha = 1;
      }
      if (down || alpha > 0) {
        raf = requestAnimationFrame(tick);
      } else {
        bctx.clearRect(0, 0, cssW, cssH); // empty the buffers; screen is already blank
        cctx.clearRect(0, 0, cssW, cssH);
        raf = 0;
      }
    };
    const ensure = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (down && inBounds(e.clientX, e.clientY)) segment(e.clientX, e.clientY);
    };
    const onDown = (e: PointerEvent) => {
      if (!inBounds(e.clientX, e.clientY)) return;
      down = true;
      color = NEON[Math.floor(Math.random() * NEON.length)];
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
      // only listen for moves WHILE drawing - zero per-move cost when idle
      window.addEventListener('pointermove', onMove, { passive: true });
      segment(e.clientX, e.clientY); // a click leaves a dot
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      window.removeEventListener('pointermove', onMove);
      releaseAt = performance.now(); // hold-then-fade starts from release
      ensure();
    };
    const onScroll = () => {
      rect = canvas.getBoundingClientRect();
    };

    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-[5] h-full w-full" />;
}
