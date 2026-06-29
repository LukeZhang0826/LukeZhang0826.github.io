import { useEffect, useRef, useState } from 'react';

/**
 * A custom cursor that takes on each section's character (the native arrow looked out of
 * place over the art direction). A snappy inner dot + a trailing outer mark whose color
 * and SHAPE change per section; the mark grows over interactive elements.
 *
 * Desktop only: rendered (and the native cursor hidden) just for fine pointers, so touch
 * devices are untouched.
 */

type Shape = 'ring' | 'square' | 'cross' | 'diamond';
type Style = { color: string; shape: Shape; blend?: boolean };

const STYLES: Record<string, Style> = {
  '00': { color: '#2DE2E6', shape: 'diamond' }, // hero - cyan diamond (vaporwave)
  '01': { color: '#C6FF1A', shape: 'square' }, // dev - terminal green block
  '02': { color: '#1A1AFF', shape: 'ring' }, // 3d - klein
  '03': { color: '#E5121F', shape: 'cross' }, // design - swiss red crosshair
  '04': { color: '#7A7A72', shape: 'ring' }, // architecture
  '05': { color: '#0A0A0A', shape: 'ring' }, // music - clean ink ring
  // room - white + difference blend so it inverts against the dark/fire scene (like the Play button)
  '06': { color: '#FFFFFF', shape: 'diamond', blend: true },
};

const SIZE = 30;

export default function CustomCursor() {
  // the cursor's character follows the section the POINTER is physically over (read from the
  // DOM), so it switches the instant you cross a section boundary - independent of scroll.
  const [sectionIndex, setSectionIndex] = useState('00');
  const style = STYLES[sectionIndex] ?? STYLES['00'];
  const clapper = sectionIndex === '02'; // film-slate cursor over the Animation section

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    // require a real mouse: a hovering, fine primary pointer. (pointer: fine) alone lets some
    // touch/hybrid devices through, where no pointermove ever fires and the dot freezes mid-screen.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return; // skip touch/coarse
    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };

    let raf = 0;
    const loop = () => {
      ring.x += (target.x - ring.x) * 0.18;
      ring.y += (target.y - ring.y) * 0.18;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`;
      // sleep once the trailing ring has caught up to the cursor (no idle rAF)
      if (Math.abs(target.x - ring.x) < 0.1 && Math.abs(target.y - ring.y) < 0.1) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    // resolve which section sits under a screen point and adopt its cursor character
    const resolveSection = (x: number, y: number, hit?: HTMLElement | null) => {
      const el = hit ?? (document.elementFromPoint(x, y) as HTMLElement | null);
      const sec = el?.closest?.('[data-section-index]') as HTMLElement | null;
      if (sec?.dataset.sectionIndex) setSectionIndex(sec.dataset.sectionIndex);
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      // wrapper sits AT the cursor point; the visual centers itself (single -50%)
      if (dotRef.current) dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      wake();
      const el = e.target as HTMLElement;
      resolveSection(e.clientX, e.clientY, el);
      const interactive = el?.closest?.(
        'a, button, [role="button"], input, label, .style-card, [data-cursor="grab"]',
      );
      setHovering(!!interactive);
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    // scrolling moves content under a stationary pointer, so re-resolve on scroll too - but throttle
    // to one elementFromPoint hit-test per frame instead of one per (frequent) scroll event
    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        resolveSection(target.x, target.y);
      });
    };

    // a hybrid device (touchscreen laptop) can pass the media check but then get used by touch;
    // the first touch tears the custom cursor down so it never sits frozen on screen.
    const onTouch = () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-custom-cursor');
      setEnabled(false);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchstart', onTouch);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  if (!enabled) return null;

  const ringScale = (hovering ? 1.9 : 1) * (down ? 0.8 : 1);
  const isCross = style.shape === 'cross';
  const rotate = style.shape === 'diamond' ? 45 : 0;
  const radius = style.shape === 'ring' ? '9999px' : style.shape === 'square' ? 3 : 0;
  const blend = style.blend ? ('difference' as const) : undefined;

  return (
    // blend is applied HERE (whose backdrop is the page) - putting it on the inner marks
    // would isolate inside their transform wrapper and never invert against the room.
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200]" style={{ mixBlendMode: clapper ? undefined : blend }}>
      {/* trailing mark - hidden when the slate is showing (centers itself on the wrapper's point) */}
      <div ref={ringRef} className="absolute left-0 top-0 will-change-transform">
        {!clapper && (
          <div
            className="transition-[width,height,opacity] duration-150"
            style={{
              width: SIZE,
              height: SIZE,
              transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${ringScale})`,
              border: isCross ? 'none' : `2.5px solid ${style.color}`,
              borderRadius: radius,
              opacity: 0.9,
            }}
          >
            {isCross && (
              <>
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2" style={{ background: style.color }} />
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2" style={{ background: style.color }} />
              </>
            )}
          </div>
        )}
      </div>

      {/* snappy point - a film slate over the reel (claps shut on press), else a small dot */}
      <div ref={dotRef} className="absolute left-0 top-0 will-change-transform">
        {clapper ? (
          <Clapper closed={down} big={hovering} />
        ) : (
          <div className="-translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: 5, height: 5, background: style.color }} />
        )}
      </div>
    </div>
  );
}

/** A clapperboard / directors slate: the striped stick is hinged at its bottom-left and swings
 *  open when idle, claps flat onto the board when the pointer is pressed (grabbing the reel). */
function Clapper({ closed, big }: { closed: boolean; big: boolean }) {
  return (
    <div
      style={{
        // anchor the clapper's top-left at the cursor point (hotspot at the tip), growing from there
        transformOrigin: '0 0',
        transform: `scale(${big ? 1.6 : 1})`,
        transition: 'transform 150ms ease',
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        // shift so the black graphic's top-left (~3,7) lands on the cursor; mirror kept
        style={{ display: 'block', overflow: 'visible', transform: 'translate(-3px, -7px) scaleX(-1)' }}
      >
        {/* board */}
        <rect x="3" y="16" width="34" height="21" rx="2.5" fill="#0A0A0A" />
        <line x1="8" y1="24" x2="32" y2="24" stroke="#FBF6EE" strokeWidth="1.4" opacity="0.75" />
        <line x1="8" y1="30" x2="27" y2="30" stroke="#FBF6EE" strokeWidth="1.4" opacity="0.5" />
        {/* hinged clapper stick (rotates about its bottom-left corner) */}
        <g
          style={{
            transformBox: 'fill-box',
            transformOrigin: '0% 100%',
            transform: closed ? 'rotate(0deg)' : 'rotate(-26deg)',
            transition: 'transform 130ms cubic-bezier(.2,.85,.25,1)',
          }}
        >
          <defs>
            <clipPath id="clapper-bar">
              <rect x="3" y="7" width="34" height="9" rx="1.5" />
            </clipPath>
          </defs>
          <g clipPath="url(#clapper-bar)">
            <rect x="3" y="7" width="34" height="9" fill="#0A0A0A" />
            {[2, 11, 20, 29].map((x) => (
              <polygon key={x} points={`${x},7 ${x + 5},7 ${x + 1},16 ${x - 4},16`} fill="#FBF6EE" />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
