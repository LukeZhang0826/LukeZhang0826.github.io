import { lazy, Suspense, useEffect, useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { HERO_DISCIPLINES, HERO_NAME, HERO_ROLE, HERO_STATUS, type HeroStyleProps } from '../heroStyles';
import { RepelNode, RepelProvider, RepelText, type RepelWord } from '../repel';
import NeonDraw from '../NeonDraw';

// WebGL outrun scene, code-split so three.js stays out of the hero's critical path
const VaporwaveCanvas = lazy(() => import('../../sections/VaporwaveCanvas'));

// repeated enough times that translateX(-50%) always leaves a full track on screen
const MARQUEE = [...HERO_DISCIPLINES, ...HERO_DISCIPLINES, ...HERO_DISCIPLINES, ...HERO_DISCIPLINES];

const TEXT_HALO = '0 1px 3px rgba(5,1,9,1), 0 2px 14px rgba(5,1,9,0.95), 0 0 6px rgba(5,1,9,0.9)';
const NAME_SIZE = 'text-[32vw] md:text-[18vw]';

const tc = (s: string) => s.charAt(0) + s.slice(1).toLowerCase(); // "LUKE" -> "Luke"
const toWords = (s: string): RepelWord[] => s.split(' ').map((t) => ({ t }));

const NAME_WORDS: RepelWord[] = [
  { t: tc(HERO_NAME.first), c: 'neon-pink' },
  { t: tc(HERO_NAME.last), c: 'neon-cyan' },
];
const NAME_LABEL = `${tc(HERO_NAME.first)} ${tc(HERO_NAME.last)}`;
const STATUS_WORDS = toWords(HERO_STATUS);
const ROLE_WORDS = toWords(HERO_ROLE);
const INTRO_WORDS: RepelWord[] = [
  { t: 'An' },
  { t: 'eclectic' },
  { t: 'playground' },
  { t: 'of' },
  { t: 'development,', c: 'vapor-word' },
  { t: 'animation,', c: 'vapor-word' },
  { t: 'design,', c: 'vapor-word' },
  { t: 'and' },
  { t: 'music.', c: 'vapor-word' },
];
const INTRO_LABEL = 'An eclectic playground of development, animation, design, and music.';

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 * i },
  }),
};

/**
 * Hero style 01 - VAPORWAVE. A WebGL outrun world (grid floor, sunk retro sun, starry
 * nebula sky + floor reflection). All the copy (name + status + role + intro) scatters
 * away from the cursor via the shared RepelProvider (one listener, one rAF loop).
 */
export default function VaporwaveHero({ onEnter, control }: HeroStyleProps) {
  return (
    <div className="sel-vapor absolute inset-0 flex flex-col bg-[#160A2B]">
      {/* canvas + content area - fills everything ABOVE the marquee (canvas ends here) */}
      <div className="relative flex-1 overflow-hidden">
        {/* vaporwave / outrun backdrop (WebGL) */}
        <Suspense fallback={null}>
          <VaporwaveCanvas />
        </Suspense>

        {/* click + drag to draw a neon line that fades out */}
        <NeonDraw />

        <RepelProvider>
          <div className="relative z-10 flex h-full flex-col justify-center px-4 md:px-8">
            {/* live status */}
            <motion.div
              custom={0}
              variants={fade}
              initial="hidden"
              animate="show"
              aria-label={HERO_STATUS}
              style={{ textShadow: TEXT_HALO }}
              className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-[#FDEFF9]"
            >
              <RepelNode className="relative mr-2.5 inline-flex h-2 w-2 align-middle">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2DE2E6] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2DE2E6]" />
              </RepelNode>
              <RepelText words={STATUS_WORDS} />
            </motion.div>

            <motion.p
              custom={1}
              variants={fade}
              initial="hidden"
              animate="show"
              aria-label={HERO_ROLE}
              style={{ textShadow: TEXT_HALO }}
              className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#FDEFF9]"
            >
              <RepelText words={ROLE_WORDS} />
            </motion.p>

            {/* neon name - "powers on" (blur+fade, no layout shift so repel stays accurate) */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(14px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            >
              <h1 className="font-graffiti leading-none" aria-label={NAME_LABEL}>
                <RepelText words={NAME_WORDS} letterClass={NAME_SIZE} promote />
              </h1>
            </motion.div>

            <motion.p
              custom={4}
              variants={fade}
              initial="hidden"
              animate="show"
              aria-label={INTRO_LABEL}
              style={{ textShadow: TEXT_HALO }}
              className="mt-6 max-w-2xl font-grotesk text-base font-bold text-[#FDEFF9] md:text-lg"
            >
              <RepelText words={INTRO_WORDS} />
            </motion.p>

            {/* WIP flag - the site is still being built */}
            <motion.p
              custom={5}
              variants={fade}
              initial="hidden"
              animate="show"
              style={{ textShadow: TEXT_HALO }}
              className="mt-4 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-[#2DE2E6]"
            >
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF6AD5]" />
              Work in progress
            </motion.p>

            {/* magnetic enter CTA */}
            <motion.div custom={6} variants={fade} initial="hidden" animate="show" className="mt-8">
              <MagneticButton onClick={onEnter}>Enter</MagneticButton>
            </motion.div>
          </div>
        </RepelProvider>

        {/* style label + dice shuffle - vertical, docked on the right edge. opacity-only
            fade so framer doesn't clobber the -translate-y-1/2 centering transform. */}
        <motion.div
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
        >
          {control}
        </motion.div>
      </div>

      {/* neon marquee - the very bottom strip; the canvas ends right above it (no overlap).
          no entrance animation: it's a flush bottom strip, so a slide-in just exposed blank
          space below it. */}
      <div className="w-full shrink-0 border-t-2 border-[#FF49C7] bg-[#0B0518]/95">
        <div className="flex w-max animate-marquee whitespace-nowrap py-2">
          {MARQUEE.map((d, i) => (
            <span key={i} className="font-mono text-sm font-bold uppercase tracking-widest text-[#2DE2E6]">
              {d}
              {/* star is the separator, equal margin both sides so it sits BETWEEN words */}
              <span className="mx-6 text-[#FF49C7]">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** A button that leans toward the cursor when the pointer comes near (magnetic). */
function MagneticButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < 130) {
        x.set(dx * 0.3);
        y.set(dy * 0.3);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [x, y]);

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      style={{ x, y, boxShadow: '0 0 26px rgba(255,106,213,0.45)' }}
      className="inline-flex items-center border-2 border-white bg-transparent px-9 py-3.5 font-mono text-sm font-black uppercase tracking-[0.2em] text-white"
    >
      {children}
    </motion.button>
  );
}
