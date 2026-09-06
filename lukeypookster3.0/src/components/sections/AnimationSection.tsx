import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSectionSpy } from '../../lib/section';
import { useYouTubeProjection } from '../../lib/useYouTubeProjection';
import AnimationHero from '../animation/AnimationHero';
import FilmOverlay from '../animation/FilmOverlay';
import HScroll from '../design/HScroll';
import Reveal from '../util/Reveal';

/**
 * Section 02 - Animation (3D + 2.5D motion). dedouze-inspired: a 16:9 looping hero (EmesZack's
 * piece, credited + cursor-parallax) with a Japanese-editorial title, then BOTH galleries as
 * one continuous celluloid FILM REEL each on a white projected-film ground (gate vignette + dust):
 *   1. "Completed animated works" (Reel 01)  2. "Selected loops" (Reel 02)
 * The reel is a single strip (continuous sprockets), windows are transparent until a clip fills
 * them, and the featured loop also plays blurred behind the overlay (synced to the real player).
 */

const CREAM = '#FBF6EE';

type Tile = {
  t: string;
  tag: string;
  c: [string, string];
  clip?: string;
  gif?: string;
  yt?: string; // YouTube id - embedded as a real, interactive player
  credit?: { name: string; url: string };
};

// in-progress loops (transparent placeholders for now)
const LOOPS: Tile[] = [
  { t: 'Night Tram', tag: 'Loop · 3D', c: ['#2B6DE0', '#1E4FA8'] },
  { t: 'Alley Stairs', tag: 'Scene', c: ['#F58FC2', '#D96BA6'] },
  { t: 'Laundromat', tag: 'Ambient', c: ['#4FC3E8', '#2E9BC4'] },
  { t: 'Rooftop Wires', tag: 'Loop', c: ['#7C4DFF', '#5E35D6'] },
];

// completed works (real Reddemoninc loop first; the rest are transparent placeholders for now)
const WORKS: Tile[] = [
  {
    t: 'Reddemoninc loop',
    tag: 'Animation',
    c: ['#2a0a0f', '#120406'],
    yt: 'nsZn9AeVBTo',
    credit: { name: 'Reddemoninc', url: 'https://www.youtube.com/@Reddemoninc' },
  },
  { t: 'Walk Cycle', tag: '2.5D · Loop', c: ['#2B6DE0', '#1E4FA8'] },
  { t: 'Street Pass', tag: 'Scene · Loop', c: ['#F58FC2', '#D96BA6'] },
  { t: 'City Drift', tag: 'Ambient', c: ['#F7C84B', '#E0A82E'] },
];

// looping embed. The iframe is only MOUNTED after the user clicks the thumbnail facade (no YouTube
// JS loads until then), so autoplay=1 here just means "play immediately on click". controls =
// interactive player; muted=false = sound on (allowed since a click started it).
const ytSrc = (id: string, opts: { controls: boolean; muted: boolean }) => {
  const origin = typeof window !== 'undefined' ? `&origin=${encodeURIComponent(window.location.origin)}` : '';
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=${opts.muted ? 1 : 0}&loop=1&playlist=${id}&controls=${opts.controls ? 1 : 0}&modestbranding=1&playsinline=1&rel=0&enablejsapi=1${origin}`;
};

// lightweight thumbnail for the facade (no iframe). mqdefault is 16:9 with no letterbox bars.
const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

// the featured loop also washes the wall behind the overlay (the "projection")
const FEATURED = WORKS.find((w) => w.yt);

// the "vintage projector" effect (blurred projection + dust/grain/vignette) behind the reels.
const VINTAGE = true;

export default function AnimationSection() {
  const ref = useSectionSpy<HTMLElement>('02', 'Animation');
  // the featured clip is a thumbnail facade until clicked - no YouTube iframe (or its ~1MB of JS)
  // loads until then, which is what made this section the slowest to load + jankiest to scroll into.
  const [started, setStarted] = useState(false);
  // mirror the interactive reel player onto the blurred background projection (only once started)
  useYouTubeProjection('yt-fg', 'yt-bg', VINTAGE && started && !!FEATURED?.yt);

  // gate the GPU-heavy vintage layers to when the band is on-screen AND the tab is visible, so the
  // effect can be strong without costing anything when you're elsewhere
  const bandRef = useRef<HTMLDivElement>(null);
  const [vintageOn, setVintageOn] = useState(false);
  useEffect(() => {
    if (!VINTAGE) return;
    const el = bandRef.current;
    if (!el) return;
    let inView = false;
    const apply = () => setVintageOn(inView && document.visibilityState === 'visible');
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        apply();
      },
      { rootMargin: '150px' },
    );
    io.observe(el);
    document.addEventListener('visibilitychange', apply);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', apply);
    };
  }, []);

  return (
    <section ref={ref} className="sel-anim relative w-full overflow-hidden">
      {/* ---- hero: the loop at its own 16:9 aspect (height follows the GIF's width) ---- */}
      <div className="relative aspect-video w-full">
        <AnimationHero />

        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-black/30 to-transparent" />

        <div className="pointer-events-none absolute inset-0 z-10 flex items-end p-6 md:p-12">
          <Reveal>
            <div className="flex items-end gap-3 md:gap-5" style={{ color: CREAM }}>
              <span
                className="font-anim leading-none"
                style={{ writingMode: 'vertical-rl', fontSize: 'clamp(36px, 7vw, 110px)', textShadow: '0 2px 22px rgba(8,14,34,0.6)' }}
              >
                動
              </span>
              <div>
                <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.35em]" style={{ textShadow: '0 1px 10px rgba(8,14,34,0.85)' }}>
                  02 / Poetry in motion
                </p>
                <h2 className="font-anim font-medium leading-[0.95]" style={{ fontSize: 'clamp(56px, 12vw, 190px)', textShadow: '0 4px 34px rgba(8,14,34,0.55)' }}>
                  Animation
                </h2>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ---- both galleries as film reels on a white projected-film ground (gate vignette + dust) ---- */}
      <div ref={bandRef} className="relative overflow-hidden bg-white py-16 text-ink">
        {/* projection: the featured loop, blurred + multiplied onto the white wall, behind the
            overlay so the dust/grain/vignette sit over it like a real projected image. Kept mounted
            (so the YT sync survives) but display:none'd when off-screen to drop the blur GPU cost. */}
        {VINTAGE && started && FEATURED?.yt && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{ display: vintageOn ? undefined : 'none' }}
          >
            <iframe
              id="yt-bg"
              src={ytSrc(FEATURED.yt, { controls: false, muted: true })}
              title=""
              tabIndex={-1}
              aria-hidden
              // rendered at half resolution then scaled up - invisible since it's heavily blurred, but
              // the blur runs on ~1/4 the pixels and YouTube serves a lighter stream. blur(8px)x2.24 ~= 16px
              className="absolute"
              style={{
                left: '25%',
                top: '25%',
                width: '50%',
                height: '50%',
                transform: 'scale(2.24)',
                transformOrigin: 'center',
                border: 0,
                filter: 'blur(8px) saturate(1.25)',
                mixBlendMode: 'multiply',
                opacity: 0.6,
              }}
            />
          </div>
        )}

        {/* overlay is mount-gated: zero cost (and no animations) while off-screen */}
        {VINTAGE && vintageOn && <FilmOverlay />}

        {/* completed works (Reel 01) */}
        <div className="relative z-10 px-4 md:px-8">
          <Reveal>
            <h3 className="font-anim text-3xl font-bold text-ink md:text-4xl" style={{ textShadow: HALO }}>
              Completed animated works
            </h3>
            <p className="mt-2 max-w-xl text-sm font-semibold text-ink" style={{ textShadow: HALO }}>
              Placeholder reel. The clip threaded here is not my work, it is a credited
              stand-in while my own finished loops are in progress. Drag or use the arrows
              to advance.
            </p>
          </Reveal>
        </div>
        <Reveal>
          <FilmReel tiles={WORKS} label="Reel 01 · completed works" started={started} onStart={() => setStarted(true)} />
        </Reveal>

        {/* selected loops (Reel 02) */}
        <div className="relative z-10 mt-16 px-4 md:px-8">
          <Reveal>
            <h3 className="font-anim text-3xl font-bold text-ink md:text-4xl" style={{ textShadow: HALO }}>
              Selected loops
            </h3>
            <p className="mt-2 max-w-xl text-sm font-semibold text-ink" style={{ textShadow: HALO }}>
              2.5D Japanese-street scenes and motion studies, dedouze-inspired. Every tile in
              this reel is an empty placeholder. My actual loops are still in progress.
            </p>
          </Reveal>
        </div>
        <Reveal>
          <FilmReel tiles={LOOPS} label="Reel 02 · selected loops" />
        </Reveal>
      </div>
    </section>
  );
}

// white halo so the dark headings stay legible over the busy film ground
const HALO = '0 0 2px #fff, 0 0 9px #fff, 0 0 18px rgba(255,255,255,0.95)';

// /public/filmstrip.svg is one black film-strip TILE (viewBox 17.07 x 15.42): a central rounded
// window + sprocket-hole rows top/bottom, all cut transparent, designed to tile horizontally. We lay
// it as a pointer-events-none overlay over each frame: the window shows the clip, the holes show the
// wall, and adjacent tiles butt into a continuous strip. One <img> per frame (cached, cheap).
const FILM_SVG = '/filmstrip.svg';
// the SVG is natively 17.07:15.42 (3:2 interior). Rendered a touch WIDER (1.313:1) so the interior
// becomes 16:9 - then a 16:9 clip fills it with no crop and no top/bottom bands. (Sprockets stretch
// ~18% wider as a side effect; the clip on top hides the stretched window corners.)
const FILM_ASPECT = '1.313 / 1';
// tile width per breakpoint (scaled down so the strip sits less thick); height follows the aspect
const FILM_PX = { base: 360, sm: 440, md: 520 };
const FILM_W = 'w-[360px] sm:w-[440px] md:w-[520px]';
// one arrow press = one tile width (matched to FILM_PX), so it advances exactly one frame
const filmStep = () => {
  if (typeof window === 'undefined') return FILM_PX.md;
  if (window.matchMedia('(min-width: 768px)').matches) return FILM_PX.md;
  if (window.matchMedia('(min-width: 640px)').matches) return FILM_PX.sm;
  return FILM_PX.base;
};
// the clip region = the film's interior window (edit to move the clip's edges). Nudged in slightly
// past the interior (~16:9) so the clip OVERLAPS the celluloid edge by a hair - kills the sub-pixel
// gap where the video edge and the interior edge round to different pixels.
const WIN = { top: '16%', right: '4.3%', bottom: '16%', left: '4.3%' };

function FilmTileImg() {
  return (
    <img src={FILM_SVG} alt="" aria-hidden draggable={false} className="pointer-events-none absolute inset-0 h-full w-full select-none" />
  );
}

/** a gallery rendered as a continuous film strip of SVG tiles (sprockets butt across the seams). */
function FilmReel({
  tiles,
  label,
  started = false,
  onStart,
}: {
  tiles: Tile[];
  label: string;
  started?: boolean;
  onStart?: () => void;
}) {
  // pad the strip with blank film tiles so it always overflows the viewport - otherwise on wide
  // screens (or when zoomed out, which enlarges the CSS-px viewport) the reel ends mid-screen and
  // you can see the cut end of the film. Recomputed on resize/zoom.
  const [fillers, setFillers] = useState(0);
  useEffect(() => {
    const compute = () => {
      const tileW = filmStep();
      // want (real tiles + fillers) to span the viewport plus a 2-tile buffer on the trailing side
      setFillers(Math.max(0, Math.ceil(window.innerWidth / tileW) + 2 - tiles.length));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [tiles.length]);

  return (
    <div className="relative z-10 mt-8">
      <HScroll
        snap={false}
        bleed
        gapClass="gap-0"
        label={label}
        arrowClass="border-ink text-ink hover:bg-ink hover:text-white !border-[3px] !px-4 !py-2 !text-base [-webkit-text-stroke:0.9px_currentColor]"
        labelClass="font-bold text-ink [text-shadow:0_0_8px_#fff,0_0_3px_#fff]"
        step={filmStep}
      >
        {/* overflow-hidden clips the ornamental tiles' bled halves so they stay off the scroll. On
            first view the strip threads in horizontally (frames sweep left->right) like a film reel. */}
        <motion.div
          className="flex w-max shrink-0 overflow-hidden"
          initial={{ x: '-28vw' }}
          whileInView={{ x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <OrnamentalFrame side="l" />
          {tiles.map((t) => (
            <FilmFrame key={t.t} t={t} started={started} onStart={onStart} />
          ))}
          {Array.from({ length: fillers }).map((_, i) => (
            <FillerFrame key={`filler-${i}`} />
          ))}
          <OrnamentalFrame side="r" />
        </motion.div>
      </HScroll>
    </div>
  );
}

/** a blank film tile (no clip window content) used to pad the strip out past the viewport edges. */
function FillerFrame() {
  return (
    <div aria-hidden className={`relative shrink-0 ${FILM_W}`} style={{ aspectRatio: FILM_ASPECT, marginRight: -1 }}>
      <FilmTileImg />
    </div>
  );
}

/** an ornamental blank tile (NOT in the data) that bleeds off a page edge by (tile width - heading
 *  pad), aligning the first real tile to the heading and capping the strip without a hard cut. */
function OrnamentalFrame({ side }: { side: 'l' | 'r' }) {
  const bleed =
    side === 'l'
      ? '-ml-[344px] sm:-ml-[424px] md:-ml-[488px]'
      : '-mr-[344px] sm:-mr-[424px] md:-mr-[488px]';
  return (
    <div
      aria-hidden
      className={`relative shrink-0 ${FILM_W} ${bleed}`}
      // leading tile overlaps the next by 1px to close sub-pixel seams
      style={{ aspectRatio: FILM_ASPECT, marginRight: side === 'l' ? -1 : undefined }}
    >
      <FilmTileImg />
    </div>
  );
}

/** one film-strip tile: the SVG sits behind, the clip renders ABOVE it (a rounded clip on the film,
 *  sprocket rows showing top/bottom). YouTube clips are a thumbnail FACADE until clicked (no iframe
 *  JS loads until then), then the real player mounts and plays. */
function FilmFrame({ t, started = false, onStart }: { t: Tile; started?: boolean; onStart?: () => void }) {
  return (
    // marginRight -1 overlaps the next tile by 1px to close sub-pixel seams between frames
    <div className={`relative shrink-0 ${FILM_W}`} style={{ aspectRatio: FILM_ASPECT, marginRight: -1 }}>
      <FilmTileImg />
      <div className="absolute overflow-hidden rounded-2xl md:rounded-3xl" style={{ top: WIN.top, right: WIN.right, bottom: WIN.bottom, left: WIN.left }}>
        {t.gif && <img src={t.gif} alt={t.t} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
        {t.yt && started && (
          <iframe
            id="yt-fg"
            src={ytSrc(t.yt, { controls: true, muted: false })}
            title={t.t}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            // the clip region is 16:9, so the player fills it exactly - full width, no side crop
            className="absolute inset-0 h-full w-full"
            style={{ border: 0 }}
          />
        )}
        {t.yt && !started && (
          <button
            type="button"
            onClick={onStart}
            aria-label={`Play ${t.t}`}
            className="group/play absolute inset-0 block cursor-pointer"
          >
            <img src={ytThumb(t.yt)} alt={t.t} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/55 pl-1 text-2xl text-white backdrop-blur transition-transform duration-200 group-hover/play:scale-110">
                ▶
              </span>
            </span>
          </button>
        )}
        {/* no media yet = a placeholder cell that says the real clip is coming */}
        {!t.gif && !t.yt && !t.clip && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-3 text-center"
            style={{ background: `linear-gradient(135deg, ${t.c[0]}, ${t.c[1]})` }}
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white/90">{t.t}</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/65">Coming soon</span>
          </div>
        )}
      </div>
      {t.credit && (
        <a
          href={t.credit.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-[7%] top-[20%] z-20 rounded-full border bg-black/45 px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-white backdrop-blur transition-colors hover:bg-black/70"
          style={{ borderColor: '#ffffff55' }}
        >
          Placeholder, not my work · by {t.credit.name} ↗
        </a>
      )}
    </div>
  );
}
