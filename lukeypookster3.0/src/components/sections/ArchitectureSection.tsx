import { motion } from 'framer-motion';
import { useSectionSpy } from '../../lib/section';
import Reveal from '../util/Reveal';

/**
 * Section 04 - Frame & Form. Dark matte, Apple-quiet, Swiss-grid gallery. Organised as themed
 * editorial blocks: each theme has a title + description/analysis and a SCRAPBOOK gallery of
 * several shots (justified rows - fixed-ish height, varied width, so it stays short instead of
 * one giant photo per screen). The old building-plan work is gone; this is renders + models +
 * photography. Add a shot = one `{ src, caption }` entry (no src = a "coming soon" tile).
 */

const BG = '#0A0B0D'; // deep matte near-black
const SURFACE = '#131517';
const HAIR = 'rgba(255,255,255,0.08)';

type Shot = {
  id: string;
  src?: string; // no src = placeholder tile
  caption: string;
  tag?: string;
  ar: number; // aspect ratio w/h - drives the justified row layout
};

type Theme = {
  id: string;
  title: string;
  meta: string; // small mono tag
  blurb: string; // description
  analysis?: string; // a more analytical second line
  shots: Shot[];
};

const THEMES: Theme[] = [
  {
    id: 'renders',
    title: 'Renders',
    meta: '3D - light - material',
    blurb: 'Where the work is heading: scenes built and lit in 3D rather than drawn in plan.',
    analysis:
      'Less about the blueprint, more about mood - pushing light, material and form until a still feels like a place you could stand in.',
    shots: [
      { id: 'classhroom', src: '/renders/classhroom.webp', caption: 'Classhroom', tag: 'Timber pavilion', ar: 0.75 },
      { id: 'portfolio-room', src: '/renders/portfolio-room.webp', caption: 'Portfolio Room', tag: 'Isometric', ar: 1.451 },
      { id: 'r-soon-1', caption: 'Render', tag: 'Coming soon', ar: 1.4 },
    ],
  },
  {
    id: 'models',
    title: 'Models & Craft',
    meta: 'SWON - basswood',
    blurb: 'Miniature furniture and sectional studies built by hand at SWON.',
    analysis:
      'Laser-cut basswood, assembled and lit on black so a model at scale reads like the real room - the tactile end of the same instinct the renders chase digitally.',
    shots: [
      { id: 'swon-furniture', src: '/photos/SwonWoodModels.webp', caption: 'Furniture Studies', tag: 'Scale models', ar: 1.5 },
      { id: 'swon-top-floor', src: '/photos/swon-top-floor.webp', caption: 'Top Floor Section', tag: 'Sectional model', ar: 1.778 },
    ],
  },
  {
    id: 'photography',
    title: 'Photography',
    meta: '35mm - digital',
    blurb: 'Off the screen - frames I have taken, gathered by feel rather than subject.',
    shots: [
      { id: 'p-soon-1', caption: 'Frame', tag: 'Coming soon', ar: 1.5 },
      { id: 'p-soon-2', caption: 'Frame', tag: 'Coming soon', ar: 0.78 },
      { id: 'p-soon-3', caption: 'Frame', tag: 'Coming soon', ar: 1.4 },
    ],
  },
];

const n2 = (n: number) => String(n).padStart(2, '0');

/** A scrapbook row: figures share a fixed height while their width follows each image's
 *  natural aspect (real images via `w-auto`, placeholders via `aspect-ratio`). The fixed
 *  height keeps the box definite - so the photos actually render - and the whole theme reads
 *  as a short gallery. Each figure animates in (fade + rise + settle) on first view, staggered. */
function Gallery({ shots }: { shots: Shot[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {shots.map((s, i) => (
        <motion.figure
          key={s.id}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.08 }}
          className="group relative h-48 overflow-hidden md:h-64"
          style={s.src ? { background: SURFACE } : { background: SURFACE, aspectRatio: String(s.ar) }}
        >
          {s.src ? (
            <img
              src={s.src}
              alt={s.caption}
              loading="lazy"
              className="block h-full w-auto max-w-none object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center px-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/25">
              Coming soon
            </span>
          )}
          {/* top scrim so the index stays legible over busy images */}
          {s.src && (
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/40 to-transparent" />
          )}
          <span className="absolute left-2 top-2 z-10 font-mono text-[10px] uppercase tracking-wider text-white/55">
            {n2(i + 1)}
          </span>
          <figcaption
            className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider"
            style={{ backgroundColor: 'rgba(19,21,23,0.85)' }}
          >
            <span className="font-bold text-white/85">{s.caption}</span>
            {s.tag && <span className="text-white/40">{s.tag}</span>}
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}

function ThemeBlock({ theme, n }: { theme: Theme; n: number }) {
  return (
    <div className="px-4 pb-14 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        {/* editorial header - title + description/analysis on the Swiss grid */}
        <Reveal>
          <div className="mb-6 grid grid-cols-12 gap-x-6 gap-y-3 border-t pt-6" style={{ borderColor: HAIR }}>
            <div className="col-span-12 flex items-baseline gap-4 md:col-span-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/35">{n2(n)}</span>
              <h3 className="font-arch text-2xl font-bold uppercase tracking-tight text-white/90 md:text-3xl">
                {theme.title}
              </h3>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-6">
              <p className="text-sm leading-relaxed text-white/70">{theme.blurb}</p>
              {theme.analysis && (
                <p className="mt-2 text-xs leading-relaxed text-white/40">{theme.analysis}</p>
              )}
            </div>
            <div className="col-span-12 md:col-span-1 md:col-start-12 md:text-right">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">{theme.meta}</span>
            </div>
          </div>
        </Reveal>
        <Gallery shots={theme.shots} />
      </div>
    </div>
  );
}

export default function ArchitectureSection() {
  const ref = useSectionSpy<HTMLElement>('04', 'Photo / Arch');

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden text-white/90 selection:bg-white/20 selection:text-white"
      style={{ backgroundColor: BG }}
    >
      {/* faint Swiss column field - the modular grid the content snaps to, kept matte */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex justify-center px-4 md:px-8">
        <div
          className="h-full w-full max-w-[1400px] opacity-[0.6]"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, ${HAIR} 0, ${HAIR} 1px, transparent 1px, transparent calc(100% / 12))`,
          }}
        />
      </div>

      {/* header band */}
      <div className="relative z-10 border-y px-4 py-12 md:px-8 md:py-16" style={{ borderColor: HAIR }}>
        <Reveal>
          <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6">
            <div className="col-span-12 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.35em] text-white/40">
              <span>04 / Frame &amp; light</span>
              <span>Renders - Models - Photography</span>
            </div>
            <h2 className="col-span-12 mt-6 font-arch text-[13vw] font-bold uppercase leading-[0.92] tracking-tight text-white md:col-span-8 md:text-[7vw]">
              Frame &amp; Form
            </h2>
            <span className="col-span-12 mt-4 font-mono text-[11px] uppercase leading-relaxed tracking-wider text-white/40 md:col-span-4 md:mt-6 md:self-end">
              Renders, models and the way light falls - a workspace, not a building set.
            </span>
          </div>
        </Reveal>
      </div>

      {/* themed scrapbook blocks */}
      <div className="relative z-10 pt-14">
        {THEMES.map((t, i) => (
          <ThemeBlock key={t.id} theme={t} n={i + 1} />
        ))}
      </div>
    </section>
  );
}
