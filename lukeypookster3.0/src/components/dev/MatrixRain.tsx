import { useEffect, useRef } from 'react';

/**
 * Subtle "Matrix" digital rain for Section 01 - columns of code/katakana glyphs
 * trickling down behind the dark development room. Tinted with the dev accent
 * (acid green) so it rhymes with the section's `text-acid` headings. Kept faint:
 * it's a texture, not a feature.
 *
 * Decorative: dpr capped at 1, RAF gated to when the section is in view, the
 * fall is time-stepped (calm, not strobing), and it freezes / renders one static
 * frame under prefers-reduced-motion.
 */

const ACID = '198,255,26'; // matches theme colors.acid
const GLYPHS = '01<>[]{}/\\=+*;:#$&|ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾊﾋﾌﾍﾎ';
const FONT = 15; // px cell size (logical)
const STEP_MS = 55; // ms between drop advances (lower = faster)
// render the (full-section-tall, faint) canvas below native resolution so the per-frame
// texture upload stays cheap - it sits behind transparent cards, so softness is invisible.
const RENDER_SCALE = 0.7;

export default function MatrixRain() {
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
    let cols = 0;
    let drops: number[] = [];

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const nw = Math.round(r.width);
      const nh = Math.round(r.height);
      if (nw === W && nh === H) return; // nothing actually changed
      // preserve the current frame so an expanding accordion (which grows the section
      // height) doesn't clear the canvas and visibly restart the rain
      let snap: HTMLCanvasElement | null = null;
      if (W && H) {
        snap = document.createElement('canvas');
        snap.width = canvas.width;
        snap.height = canvas.height;
        snap.getContext('2d')?.drawImage(canvas, 0, 0);
      }
      W = nw;
      H = nh;
      // buffer rendered below CSS size (RENDER_SCALE); the ctx is scaled so all drawing
      // stays in logical (CSS) pixels and the per-frame texture upload stays cheap.
      canvas.width = Math.round(W * RENDER_SCALE);
      canvas.height = Math.round(H * RENDER_SCALE);
      cols = Math.ceil(W / FONT);
      // keep existing drops where possible; seed new columns at a random height
      drops = Array.from({ length: cols }, (_, i) =>
        drops[i] ?? Math.floor((Math.random() * -H) / FONT),
      );
      if (snap) ctx.drawImage(snap, 0, 0); // identity space: restore the preserved frame
      ctx.setTransform(RENDER_SCALE, 0, 0, RENDER_SCALE, 0, 0);
      ctx.font = `${FONT}px "Space Mono", ui-monospace, monospace`;
      ctx.textBaseline = 'top';
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const step = () => {
      // fade the previous frame toward ink so trails decay (bg is already ink)
      ctx.fillStyle = 'rgba(10,10,10,0.09)';
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < cols; i++) {
        const g = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        const x = i * FONT;
        const y = drops[i] * FONT;
        // the leading glyph shimmers a touch brighter; the rest stay faint
        ctx.fillStyle =
          Math.random() > 0.975 ? `rgba(${ACID},0.42)` : `rgba(${ACID},0.22)`;
        ctx.fillText(g, x, y);

        if (y > H && Math.random() > 0.975) drops[i] = 0;
        else drops[i]++;
      }
    };

    let raf = 0;
    let active = false;
    let last = 0;
    let acc = 0;

    const loop = (now: number) => {
      acc += now - last;
      last = now;
      // time-step so the rain falls at a steady calm rate regardless of fps
      while (acc >= STEP_MS) {
        step();
        acc -= STEP_MS;
      }
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduce) {
          if (!active) {
            active = true;
            last = performance.now();
            acc = 0;
            raf = requestAnimationFrame(loop);
          }
        } else {
          active = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: '120px' },
    );
    io.observe(wrap);

    if (reduce) step(); // one static frame, no animation

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
