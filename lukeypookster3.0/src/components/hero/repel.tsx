import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';

/**
 * Shared "letters scatter away from the cursor" system (Obsidian graph / Coltrane-circle
 * feel) used across the hero copy. Performance-first: ONE window pointermove listener and
 * ONE rAF loop drive every registered letter via direct DOM transforms - no per-letter
 * framer springs or listeners - and the loop sleeps when nothing is moving. This scales to
 * the whole index page's text without the cost of N components animating themselves.
 */

interface Letter {
  el: HTMLElement;
  hx: number; // home (rest) center, in client coords
  hy: number;
  x: number; // current offset
  y: number;
  vx: number; // velocity (simple spring integration)
  vy: number;
}

interface Ctrl {
  register: (el: HTMLElement) => () => void;
}

const RepelContext = createContext<Ctrl | null>(null);

const RADIUS = 200; // px around the cursor that pushes letters
const STRENGTH = 95; // max px a letter is shoved
const STIFF = 0.16; // spring pull toward target
const DAMP = 0.74; // velocity damping
const EPS = 0.08; // rest threshold

export function RepelProvider({ children }: { children: ReactNode }) {
  const letters = useRef<Set<Letter>>(new Set());
  const pointer = useRef({ x: 0, y: 0, active: false });
  const raf = useRef(0);

  const measure = useCallback((L: Letter) => {
    const r = L.el.getBoundingClientRect();
    // subtract the live offset so home stays the undisplaced center
    L.hx = r.left + r.width / 2 - L.x;
    L.hy = r.top + r.height / 2 - L.y;
  }, []);

  const tick = useCallback(() => {
    const { x: cx, y: cy, active } = pointer.current;
    let moving = false;
    letters.current.forEach((L) => {
      let tx = 0;
      let ty = 0;
      if (active) {
        const dx = L.hx - cx;
        const dy = L.hy - cy;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < RADIUS) {
          const f = (1 - dist / RADIUS) ** 2; // strongest at the cursor, eases off
          tx = (dx / dist) * f * STRENGTH;
          ty = (dy / dist) * f * STRENGTH;
        }
      }
      L.vx = (L.vx + (tx - L.x) * STIFF) * DAMP;
      L.vy = (L.vy + (ty - L.y) * STIFF) * DAMP;
      L.x += L.vx;
      L.y += L.vy;
      if (
        Math.abs(tx - L.x) > EPS ||
        Math.abs(ty - L.y) > EPS ||
        Math.abs(L.vx) > EPS ||
        Math.abs(L.vy) > EPS
      ) {
        moving = true;
      } else {
        L.x = tx;
        L.y = ty;
        L.vx = 0;
        L.vy = 0;
      }
      L.el.style.transform = `translate3d(${L.x.toFixed(2)}px, ${L.y.toFixed(2)}px, 0)`;
    });
    raf.current = moving ? requestAnimationFrame(tick) : 0;
  }, []);

  const ensure = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  }, [tick]);

  const register = useCallback(
    (el: HTMLElement) => {
      const L: Letter = { el, hx: 0, hy: 0, x: 0, y: 0, vx: 0, vy: 0 };
      measure(L);
      letters.current.add(L);
      return () => {
        letters.current.delete(L);
      };
    },
    [measure],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY, active: true };
      ensure();
    };
    const onLeave = () => {
      pointer.current.active = false;
      ensure(); // let letters spring back
    };
    const remeasure = () => letters.current.forEach(measure);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('blur', onLeave);
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', remeasure);
    window.addEventListener('scroll', remeasure, { passive: true });
    document.fonts?.ready.then(remeasure); // glyph widths shift once the display font loads
    const settle = setTimeout(remeasure, 1300); // re-cache homes after entrance animations settle
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('blur', onLeave);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', remeasure);
      window.removeEventListener('scroll', remeasure);
      clearTimeout(settle);
      cancelAnimationFrame(raf.current);
    };
  }, [ensure, measure]);

  return <RepelContext.Provider value={{ register }}>{children}</RepelContext.Provider>;
}

function RepelChar({ ch, className, promote }: { ch: string; className?: string; promote?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const ctx = useContext(RepelContext);
  useEffect(() => {
    if (ref.current && ctx) return ctx.register(ref.current);
  }, [ctx]);
  return (
    <span
      ref={ref}
      aria-hidden
      className={className}
      style={{ display: 'inline-block', willChange: promote ? 'transform' : undefined }}
    >
      {ch}
    </span>
  );
}

/** Repels an arbitrary element (not split into letters) as a single unit - e.g. the
 *  status "now available" dot. The element must be transformable (inline-block/flex). */
export function RepelNode({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const ctx = useContext(RepelContext);
  useEffect(() => {
    if (ref.current && ctx) return ctx.register(ref.current);
  }, [ctx]);
  return (
    <span ref={ref} aria-hidden className={className} style={{ willChange: 'transform' }}>
      {children}
    </span>
  );
}

export interface RepelWord {
  t: string;
  c?: string; // optional per-word class (e.g. a highlight color)
}

/**
 * Renders words whose individual letters repel the cursor. Words wrap as whole units (so
 * a line break never splits a word) and the spaces between them are normal, non-repelling.
 * Letters are aria-hidden; put an aria-label on the semantic parent element.
 */
export function RepelText({
  words,
  letterClass,
  promote,
}: {
  words: RepelWord[];
  letterClass?: string; // shared per-letter class (size, etc.)
  promote?: boolean; // give each letter its own compositor layer (use for big glowing text)
}) {
  return (
    <>
      {words.map((w, wi) => (
        <span key={wi}>
          {wi > 0 ? ' ' : null}
          <span className="inline-block whitespace-nowrap">
            {[...w.t].map((ch, ci) => (
              <RepelChar key={ci} ch={ch} className={[letterClass, w.c].filter(Boolean).join(' ') || undefined} promote={promote} />
            ))}
          </span>
        </span>
      ))}
    </>
  );
}
