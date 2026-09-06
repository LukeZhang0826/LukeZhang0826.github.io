import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { lockScroll, unlockScroll } from '../../lib/useLenis';

/**
 * Section-less pre-reveal loading screen (minhpham.design treatment).
 *
 * ARCHITECTURE - "the whole screen is ONE repeating gradient; every component is a mask
 * into it." A full-viewport SVG holds a single repeating purple->teal <linearGradient>
 * <rect> that fills the screen, revealed ONLY through a luminance <mask> built from all
 * the loader's marks: the ring track, the progress arc, the "NN%" counter, the v2 dino
 * logo, and the Start pill (border + label). Nothing is "colored" - the ring, the dino
 * AND the button are the same gradient because they're the same rect. This is the hook
 * for the planned ascii-cursor effect: it becomes just another white shape added to this
 * mask, so the cursor reveals the same screen gradient.
 *
 * FLOW - a `phase` machine loading -> erasing -> ready. The ring draws clockwise from 12
 * o'clock on real load signals; at 100% it erases along its own path (tail chases forward
 * until gone). The whole centerpiece starts a touch BELOW center; when the button appears
 * the dino and the button translate up TOGETHER, by the same amount at the same speed -
 * they share one `lift` value, so the motion can't desync. Clicking Start lifts the
 * curtain (pure CSS transform; framer stays off the critical path) and App replays the
 * hero intro via introNonce. The curtain doubles as the GPU warm-up window.
 */

const MIN_MS = 1400; // minimum on-screen time so a warm-cache load doesn't flash
const ERASE_MS = 600; // ring un-draw once we hit 100
const LIFT_MS = 650; // dino + button rise together
const EXIT_MS = 900;

// geometry, in screen pixels (relative to the viewport centre)
const BELOW = 12; // centerpiece starts this far below true centre
const RR = 150; // ring radius (wide) ; RING stroke is a fine hairline
const STROKE = 1.25;
const DINO_W = 66; // dino width - reads well inside the ring without dominating it
const TILE = 460; // repeating-gradient period (bigger = less repetitive across the screen)
const PCT_DY = -110; // counter sits high in the ring, near the top edge
const BTN_W = 208;
const BTN_H = 46; // shorter pill (wide:short reads more like a conventional button)
const BTN_GAP = 112; // button centre below the dino centre (clear breathing room)
const LIFT = 68; // how far dino + button rise at the reveal (keeps the pair centred)

// geometric grotesk in the spirit of minhpham's ITC Avant Garde Gothic (licensed, so we
// don't lift his files) - Century Gothic / Futura are the system equivalents, Questrial the
// free web backstop.
const FONT = "'Century Gothic','Questrial','Futura',system-ui,sans-serif";

type Phase = 'loading' | 'erasing' | 'ready';

/** Real load signals the counter is tied to. */
function collectSignals(): Promise<unknown>[] {
  return [
    document.fonts.ready,
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise((res) => window.addEventListener('load', res, { once: true })),
    // the hero's three.js chunk: same specifier the lazy canvas uses, so Vite dedupes
    import('../sections/VaporwaveCanvas').catch(() => undefined),
  ];
}

export default function LoadingScreen({ onStart, onGone }: { onStart: () => void; onGone: () => void }) {
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');
  const [erase, setErase] = useState(0); // 0..1 ring un-draw
  const [lift, setLift] = useState(0); // 0..1 dino + button rise (shared, so they can't desync)
  const [hover, setHover] = useState(false);
  const [hoverT, setHoverT] = useState(0); // 0..1 button fill-on-hover (eased so the mask repaints)
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(0);
  const totalRef = useRef(1);
  const hoverTRef = useRef(0);

  // keep the viewport size so the gradient + mask can be drawn in screen pixels
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // freeze the page while the curtain is down. lockScroll works even though Lenis is
  // created after this child effect runs (useLenis honors the lock at creation).
  useEffect(() => {
    lockScroll();
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      window.scrollTo(0, 0);
      unlockScroll();
    };
  }, []);

  // load counter -> hands off to erase at 100
  useEffect(() => {
    const signals = collectSignals();
    totalRef.current = signals.length;
    for (const s of signals)
      s.then(() => {
        doneRef.current += 1;
      });

    const t0 = performance.now();
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      // throttle to ~30fps: each setPct re-renders the full-screen SVG + mask, so 60fps would
      // double that work during load for no visible gain
      if (now - last >= 33) {
        last = now;
        const elapsed = now - t0;
        const signalPct = (doneRef.current / totalRef.current) * 100;
        const crawl = Math.min(94, elapsed * 0.02); // keeps moving while a signal drags
        const target = signalPct >= 100 ? 100 : Math.max(signalPct * 0.9, crawl);
        const capped = Math.min(target, (elapsed / MIN_MS) * 100);
        setPct(capped);
        if (capped >= 100) {
          setPhase('erasing');
          return; // stop (no reschedule)
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // erase the ring along its path, then start the lift/reveal
  useEffect(() => {
    if (phase !== 'erasing') return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / ERASE_MS);
      setErase(1 - Math.pow(1 - t, 3)); // easeOutCubic
      if (t >= 1) {
        setPhase('ready');
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // one `lift` timeline drives BOTH the dino translate and the button (translate + fade),
  // so they move the same amount at the same speed - no desync
  useEffect(() => {
    if (phase !== 'ready') return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / LIFT_MS);
      setLift(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // ease the hover-fill so the SVG mask repaints smoothly (numeric per-frame, not a CSS transition
  // inside <mask> which some browsers won't recomposite)
  useEffect(() => {
    const to = hover ? 1 : 0;
    const from = hoverTRef.current;
    if (from === to) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 200);
      const v = from + (to - from) * k;
      hoverTRef.current = v;
      setHoverT(v);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hover]);

  const start = useCallback(() => {
    if (phase !== 'ready' || leaving) return;
    setLeaving(true);
    onStart();
  }, [phase, leaving, onStart]);

  const { w, h } = size;
  const cx = w / 2;
  const cyB = h / 2 + BELOW; // centerpiece centre (a touch low)
  const CIRC = 2 * Math.PI * RR;

  // ring arc [startFrac, endFrac] of the circle from 12 o'clock clockwise
  const startFrac = phase === 'loading' ? 0 : erase;
  const endFrac = phase === 'loading' ? pct / 100 : 1;
  const vis = Math.max(0, endFrac - startFrac) * CIRC;
  const ready = phase === 'ready';

  const groupDy = -LIFT * lift; // shared vertical motion for dino + button
  const dinoScale = DINO_W / 50;
  const btnCy = cyB + BTN_GAP;

  return (
    <div
      aria-label="Loading"
      className={`fixed inset-0 z-[100] select-none bg-ink transition-transform ease-[cubic-bezier(0.76,0,0.24,1)] ${
        leaving ? '-translate-y-full' : ''
      }`}
      style={{ transitionDuration: `${EXIT_MS}ms`, willChange: 'transform' }}
      onTransitionEnd={(e) => {
        if (e.propertyName === 'transform' && leaving) onGone();
      }}
    >
      {/* ascii fire/ooze noise field behind the centerpiece; carries the same gradient over the ink bg */}
      <AsciiPulse w={w} h={h} />

      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="absolute inset-0" aria-hidden style={{ fontFamily: FONT }}>
        <defs>
          {/* the one screen-wide REPEATING gradient every mark reveals */}
          <linearGradient id="lp-bg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={TILE} y2={TILE} spreadMethod="repeat">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="33%" stopColor="#4C9AFF" />
            <stop offset="66%" stopColor="#2DE8D5" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          {/* luminance mask: white = reveal the gradient, black = hide it */}
          <mask id="lp-mask">
            {/* faint ring track - fades with the erase so the WHOLE ring disappears at 100 */}
            <circle cx={cx} cy={cyB} r={RR} fill="none" stroke="#fff" strokeWidth={STROKE} style={{ opacity: 0.16 * (1 - erase) }} />
            {/* progress arc - drops at ready so a zero-length round cap can't leave a dot */}
            {!ready && (
              <circle
                cx={cx}
                cy={cyB}
                r={RR}
                fill="none"
                stroke="#fff"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={`${vis} ${CIRC}`}
                strokeDashoffset={-startFrac * CIRC}
                transform={`rotate(-90 ${cx} ${cyB})`}
              />
            )}
            {/* counter - high in the ring, near the top edge; gone at ready */}
            <text
              x={cx}
              y={cyB + PCT_DY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#fff"
              fontSize="15"
              letterSpacing="1"
              style={{ opacity: ready ? 0 : 1, transition: 'opacity 300ms' }}
            >
              {String(Math.round(pct)).padStart(2, '0')}%
            </text>

            {/* dino + button share ONE translate so they rise together, same amount + speed */}
            <g transform={`translate(0 ${groupDy})`}>
              <g transform={`translate(${cx - 25 * dinoScale} ${cyB - 24 * dinoScale}) scale(${dinoScale})`}>
                <path d="M26.8372 17.3653C27.2848 16.2563 27.9774 15.3711 29.0999 14.5849C29.7629 14.1206 30.5758 13.6909 31.1097 13.9297C31.598 14.1482 31.8529 14.9259 31.9771 15.6433C32.2075 16.9745 31.988 18.0981 31.9236 19.2397C33.107 19.9407 34.1108 20.8138 34.822 21.883L35.01 22.1812C36.118 21.6061 37.2752 21.3746 38.6947 21.523C39.4806 21.6052 40.3468 21.8038 40.6172 22.2986C40.9089 22.8323 40.5072 23.7106 40.0948 24.4787C39.157 26.2252 38.1639 27.4016 36.7208 28.2921L37.0911 30.6554L37.3034 31.7374C38.2903 31.5748 39.424 31.3445 40.5709 31.3195C41.4842 31.2996 42.4058 31.41 42.7137 31.9913C42.9994 32.5307 42.7566 33.4756 42.4257 34.2756C41.7208 35.9794 40.6158 37.0256 39.2185 37.7526C39.8186 39.1472 40.5137 40.494 41.2982 41.7986L42.2303 43.2652C45.8574 39.8978 48.6961 34.8137 49.6389 29.3975C50.5818 23.9813 49.6288 18.233 47.3541 13.8318C45.1945 9.37262 41.1684 5.17193 36.2752 2.69468C31.3819 0.217425 25.6216 -0.536348 20.7626 0.369583C15.8818 1.14827 10.7057 3.79365 6.92208 7.77167C3.13846 11.7497 0.747279 17.0604 0.201104 21.9875C-0.472817 26.8988 0.548346 32.6353 3.24501 37.4219C5.94167 42.2086 10.3138 46.0455 14.8557 48C15.4059 43.6608 16.3573 39.4282 17.7099 35.3023C16.0929 35.1441 14.5141 34.6483 13.08 33.775C11.4146 32.7609 9.94454 31.2378 9.39018 29.4699C8.41151 26.3488 10.2868 22.4646 12.8883 20.0811C13.6955 19.3416 14.5726 18.7465 15.5037 18.2788C15.7902 16.682 16.1182 14.8729 17.0122 13.6021C17.2404 13.2777 17.5056 12.9883 17.8021 12.9217C18.1364 12.8467 18.5106 13.0552 18.8508 13.3249C19.8712 14.1342 20.5853 15.4955 21.341 16.8715C22.5202 16.8247 23.7276 16.8905 24.9424 17.0464L26.8372 17.3653Z" fill="#fff" />
                <path
                  d="M22.5777 22.115C22.0129 22.3216 21.6979 23.23 22.013 23.7436C22.2189 24.3101 23.1245 24.6261 23.6365 24.31C24.2013 24.1034 24.5163 23.195 24.2012 22.6815C23.9952 22.1149 23.0896 21.799 22.5777 22.115Z"
                  fill="#fff"
                  className="animate-dino-blink motion-reduce:animate-none"
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                />
              </g>

              {/* Start pill (border + label) - fades in as it rises; only meaningful at ready.
                  Hover FILLS the pill (white rect = gradient) and flips the label to ink (a black
                  overlay punches the letters into holes, so they read dark on the bright fill). */}
              <g opacity={lift}>
                <rect
                  x={cx - BTN_W / 2}
                  y={btnCy - BTN_H / 2}
                  width={BTN_W}
                  height={BTN_H}
                  rx={BTN_H / 2}
                  fill="#fff"
                  opacity={hoverT}
                />
                <rect
                  x={cx - BTN_W / 2}
                  y={btnCy - BTN_H / 2}
                  width={BTN_W}
                  height={BTN_H}
                  rx={BTN_H / 2}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={STROKE}
                />
                <text x={cx} y={btnCy} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="14" fontWeight="700" letterSpacing="5">
                  START
                </text>
                <text
                  x={cx}
                  y={btnCy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#000"
                  fontSize="14"
                  fontWeight="700"
                  letterSpacing="5"
                  opacity={hoverT}
                >
                  START
                </text>
                {/* WIP flag (moved here from the hero) - same mask, so it wears the gradient */}
                <text
                  x={cx}
                  y={btnCy + 44}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#fff"
                  fontSize="10"
                  letterSpacing="3"
                  opacity={0.75}
                >
                  ● WORK IN PROGRESS
                </text>
                <text
                  x={cx}
                  y={btnCy + 58}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#fff"
                  fontSize="8"
                  letterSpacing="2"
                  opacity={0.6}
                >
                  SOME MEDIA IS PLACEHOLDER + CREDITED TO OTHERS
                </text>
              </g>
            </g>
          </mask>
        </defs>

        {/* Only paint+mask the box the centerpiece actually occupies, NOT the whole viewport.
            The gradient is screen-anchored (userSpaceOnUse) so colours are identical, but the
            per-frame mask re-raster during loading now covers ~360x360 instead of the full screen. */}
        <rect
          x={cx - RR - 30}
          y={cyB - RR - 30}
          width={2 * (RR + 30)}
          height={2 * (RR + 30)}
          fill="url(#lp-bg)"
          mask="url(#lp-mask)"
        />
      </svg>

      {/* transparent hit area over the Start pill (the visible pill is the SVG mask above) */}
      {ready && (
        <button
          type="button"
          onClick={start}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-label="Start"
          className="absolute cursor-pointer"
          style={{
            left: cx,
            top: btnCy + groupDy,
            width: BTN_W,
            height: BTN_H,
            transform: 'translate(-50%, -50%)',
            opacity: 0,
          }}
        />
      )}
    </div>
  );
}

/**
 * A cheap ascii "fire / ooze" field behind the centerpiece: an organic fbm value-noise field
 * (the same noise family the room monitor's portal shader uses) that slowly RISES and morphs,
 * domain-warped so it licks like flames/ooze rather than round blobs. The noise value drives
 * BOTH the glyph (denser char = higher intensity) AND the alpha, so the field has real
 * variation in intensity; each lit glyph is painted with the SAME repeating purple->teal
 * gradient over the ink bg (so the ascii "masks" the gradient too). Kept performant: one
 * canvas, ~30fps, DPR-capped, only cells above a threshold drawn, 3-octave fbm + 1-octave
 * warp. Unmounts with the loader (zero cost after reveal); honors reduced-motion (blank).
 */
// memoized so the loader's 30fps counter re-renders don't re-run this component (it only
// depends on w/h; the canvas animation lives entirely in its own effect)
const AsciiPulse = memo(function AsciiPulse({ w, h }: { w: number; h: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    // cap at 1x: this is a soft background texture, it doesn't need retina crispness, and the
    // clear+glyph raster cost scales with dpr^2 (1x is ~2.25x cheaper than 1.5x)
    const dpr = 1;
    cv.width = w * dpr;
    cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = '13px "Space Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const CELL = 22;
    const cols = Math.ceil(w / CELL);
    const rows = Math.ceil(h / CELL);
    const SCALE = 0.006; // spatial frequency of the noise field
    const RAMP = ' .:-=+*#%@';
    // gradient stops matching the SVG (#A855F7 -> #4C9AFF -> #2DE8D5 -> wrap)
    const STOPS = [
      [168, 85, 247],
      [76, 154, 255],
      [45, 232, 213],
      [168, 85, 247],
    ];
    const gradAt = (f: number) => {
      const seg = f * (STOPS.length - 1);
      const i = Math.floor(seg);
      const t = seg - i;
      const a = STOPS[i];
      const b = STOPS[i + 1];
      return `rgb(${(a[0] + (b[0] - a[0]) * t) | 0},${(a[1] + (b[1] - a[1]) * t) | 0},${(a[2] + (b[2] - a[2]) * t) | 0})`;
    };

    // value-noise fbm (same noise family the room monitor's portal shader uses), seeded once
    const perm = new Uint8Array(512);
    {
      const p = Array.from({ length: 256 }, (_, i) => i);
      for (let i = 255; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        const t = p[i];
        p[i] = p[j];
        p[j] = t;
      }
      for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
    }
    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const vnoise = (x: number, y: number) => {
      const xi = Math.floor(x) & 255;
      const yi = Math.floor(y) & 255;
      const u = fade(x - Math.floor(x));
      const v = fade(y - Math.floor(y));
      const aa = perm[perm[xi] + yi];
      const ba = perm[perm[xi + 1] + yi];
      const ab = perm[perm[xi] + yi + 1];
      const bb = perm[perm[xi + 1] + yi + 1];
      const x1 = aa + u * (ba - aa);
      const x2 = ab + u * (bb - ab);
      return (x1 + v * (x2 - x1)) / 255; // 0..1
    };
    const fbm = (x: number, y: number) => {
      let a = 0.5;
      let f = 1;
      let s = 0;
      let n = 0;
      for (let o = 0; o < 2; o++) {
        s += a * vnoise(x * f, y * f);
        n += a;
        a *= 0.5;
        f *= 2;
      }
      return s / n;
    };

    // precompute the STATIC per-cell centre + gradient colour once (colour depends only on
    // position, never on time) so the hot loop does zero string-building or gradient math
    const N = cols * rows;
    const cellX = new Float32Array(N);
    const cellY = new Float32Array(N);
    const cellColor: string[] = new Array(N);
    const sx = new Float32Array(N); // pre-scaled sample coords for the noise
    const sy = new Float32Array(N);
    for (let gy = 0, i = 0; gy < rows; gy++) {
      for (let gx = 0; gx < cols; gx++, i++) {
        const x = gx * CELL + CELL / 2;
        const y = gy * CELL + CELL / 2;
        cellX[i] = x;
        cellY[i] = y;
        sx[i] = x * SCALE;
        sy[i] = y * SCALE;
        cellColor[i] = gradAt(((x + y) % TILE) / TILE);
      }
    }
    const RAMP_MAX = RAMP.length - 1;
    const RAMP_SPAN = RAMP.length - 2;

    let raf = 0;
    let last = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 50) return; // ~20fps (the field drifts slowly, so it still reads smooth)
      last = now;
      const time = (now - t0) / 1000;
      const rise = time * 0.5; // the field slowly rises (fire)
      const warpT = time * 0.2;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < N; i++) {
        const bx = sx[i] * 0.6;
        const by = sy[i] * 0.6;
        // domain-warp the sample coords -> licking fire/ooze tendrils, not round blobs
        const wx = vnoise(bx + warpT, by) - 0.5;
        const wy = vnoise(bx, by - warpT) - 0.5;
        const v = fbm(sx[i] + wx * 1.2, sy[i] + rise + wy * 1.2);
        if (v < 0.4) continue; // leave organic gaps, but cover more of the field
        const b = (v - 0.4) / 0.6; // 0..1 intensity -> varied glyph + alpha
        ctx.globalAlpha = 0.05 + b * 0.34; // base visibility + brighter cores (varied intensity)
        ctx.fillStyle = cellColor[i];
        ctx.fillText(RAMP[Math.min(RAMP_MAX, 1 + ((b * RAMP_SPAN) | 0))], cellX[i], cellY[i]);
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [w, h]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0" style={{ width: w, height: h }} />;
});
