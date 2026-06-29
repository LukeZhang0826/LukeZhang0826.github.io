import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';

/**
 * Reusable horizontal reference-wall scroller. Travel is drag + prev/next arrows +
 * native shift-wheel / trackpad - deliberately NOT wheel-hijacked (the 2.0 scroll-jacking
 * mistake). Track has vertical padding so cards can lift on hover without the overflow
 * clipping their top border.
 */
export default function HScroll({
  children,
  label,
  arrowClass = 'border-ink text-ink hover:bg-ink hover:text-bone',
  labelClass = 'text-ink/50',
  gapClass = 'gap-3',
  snap = true,
  bleed = false,
  step = 320,
}: {
  children: ReactNode;
  label?: string;
  /** border/hover classes for the arrow buttons (per-section palette) */
  arrowClass?: string;
  labelClass?: string;
  /** track gap between items - set 'gap-0' for a continuous strip (film reel) */
  gapClass?: string;
  /** snap items to the left edge (default true) */
  snap?: boolean;
  /** drop the side padding so content runs to the page edges (film reel bleed) */
  bleed?: boolean;
  /** how far one arrow press scrolls, in px (or a fn for responsive item widths) */
  step?: number | (() => number);
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  // hide the arrows when there's nothing to scroll
  const [scrollable, setScrollable] = useState(false);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => setScrollable(el.scrollWidth - el.clientWidth > 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // no pointer capture - capture re-targets the click to the track and would block the
  // cards' own click (card flip). Instead we track drag distance and swallow the click
  // only when the pointer actually dragged.
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    const el = trackRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const el = trackRef.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - dx;
  }

  function endDrag() {
    drag.current.active = false;
  }

  function onClickCapture(e: ReactMouseEvent<HTMLDivElement>) {
    // a click that came at the end of a drag shouldn't flip a card
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
    drag.current.moved = false;
  }

  function nudge(dir: 1 | -1) {
    const amount = typeof step === 'function' ? step() : step;
    trackRef.current?.scrollBy({ left: dir * amount, behavior: 'smooth' });
  }

  return (
    <div className="relative w-full">
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        className={`no-scrollbar flex cursor-grab overflow-x-auto py-6 active:cursor-grabbing ${bleed ? '' : 'px-5 scroll-pl-5 md:px-8 md:scroll-pl-8'} ${gapClass} ${snap ? 'snap-x snap-mandatory' : ''}`}
        style={{ overscrollBehaviorX: 'contain' }}
      >
        {children}
      </div>

      <div className="mt-2 flex items-center justify-between px-4 md:px-8">
        {label && (
          <span className={`font-mono text-[10px] uppercase tracking-[0.25em] ${labelClass}`}>
            {label}
          </span>
        )}
        {scrollable && (
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => nudge(-1)}
              aria-label="Scroll left"
              className={`border-2 px-3 py-1 font-mono text-sm font-bold transition-colors ${arrowClass}`}
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              aria-label="Scroll right"
              className={`border-2 px-3 py-1 font-mono text-sm font-bold transition-colors ${arrowClass}`}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
