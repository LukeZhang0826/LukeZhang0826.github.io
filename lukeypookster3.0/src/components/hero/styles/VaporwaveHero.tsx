import { lazy, Suspense, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { HERO_DISCIPLINES, HERO_NAME, type HeroStyleProps } from '../heroStyles';
import { RepelNode, RepelProvider, RepelText, type RepelWord } from '../repel';
import NeonDraw from '../NeonDraw';

// WebGL outrun scene, code-split so three.js stays out of the hero's critical path
const VaporwaveCanvas = lazy(() => import('../../sections/VaporwaveCanvas'));

// repeated enough times that translateX(-50%) always leaves a full track on screen
const MARQUEE = [...HERO_DISCIPLINES, ...HERO_DISCIPLINES, ...HERO_DISCIPLINES, ...HERO_DISCIPLINES];

const tc = (s: string) => s.charAt(0) + s.slice(1).toLowerCase(); // "LUKE" -> "Luke"

// wordmark across the top, tracked-out caps (precedent: the "V A P O R W A V E" title).
// Fusterd graffiti benched for now - Luke wants to see a normal typeface here.
const NAME_WORDS: RepelWord[] = [{ t: HERO_NAME.first }, { t: HERO_NAME.last }];
const NAME_LABEL = `${tc(HERO_NAME.first)} ${tc(HERO_NAME.last)}`;
// chromatic-aberration text shadow (em-based so it scales with each font size)
const CHROMA = '-0.045em 0.02em 0 rgba(255,73,199,0.85), 0.045em -0.02em 0 rgba(45,226,230,0.85)';

// --- poster tuning knobs ---
const STATUE_SRC = '/photos/vaporwave-statue.webp'; // 562x854 greyscale David head, transparent
const GLASSES_SRC = '/photos/8bit-glasses.png'; // 1024x228 pixel-art strip (arm on the LEFT)
// statue box height follows the viewport's short side so the poster reflows portrait/landscape
const STATUE_H = 'h-[min(50svh,110vw)] md:h-[min(66svh,58vw)]';
// where the glasses land, as fractions of the statue box. the strip is CENTER-anchored on
// this point, and its lenses sit right of the strip's own center (the left arm), so `left`
// is a touch LEFT of the eyes (eyes ~x52% y33% of the bust); nudge to taste
const GLASSES = { top: '35%', left: '44%', width: '80%', tilt: -3 };
// chromatic-aberration ghosts: the bust is greyscale, so sepia->hue-rotate tints it clean
const TINT_PINK = 'sepia(1) saturate(8) hue-rotate(285deg) brightness(1.1)';
const TINT_CYAN = 'sepia(1) saturate(8) hue-rotate(140deg) brightness(1.15)';
// gradient MAP for the statue body itself (the fringe alone left the middle boring grey):
// a multiply wash masked to the bust's alpha, so white marble takes the gradient fully
// while the shading stays. Opacity = how hard the duotone hits.
const TINT_WASH = 'linear-gradient(150deg, #FF6AD5 0%, #E06AF0 34%, #7A5FFF 68%, #2DE2E6 100%)';
const TINT_WASH_OPACITY = 0.78;
// flat gradient balls (precedent 1/4 style: plain linear pink->blue discs, NOT glossy 3D).
// every disc gets its OWN angle + stop mix so no two read the same
const ORB_GRADS = [
  'linear-gradient(140deg, #FF9DE2 0%, #FF49C7 30%, #7A5FFF 65%, #2DE2E6 100%)',
  'linear-gradient(205deg, #B7FBFF 0%, #2DE2E6 40%, #5E7CFF 75%, #FF49C7 100%)',
  'linear-gradient(320deg, #2DE2E6 0%, #7A5FFF 45%, #FF49C7 80%, #FFB3EA 100%)',
  'linear-gradient(75deg, #FF49C7 0%, #C368F9 40%, #2DE2E6 100%)',
  'linear-gradient(255deg, #FFB3EA 0%, #FF6AD5 25%, #5E7CFF 60%, #B7FBFF 100%)',
  'linear-gradient(30deg, #5E7CFF 0%, #2DE2E6 35%, #FF9DE2 75%, #FF49C7 100%)',
];
// low-alpha diagonal wash over the whole canvas (precedent 1's pink->blue gradient field)
const SHEET_WASH = 'linear-gradient(160deg, rgba(255,73,199,0.16) 0%, rgba(94,124,255,0.07) 45%, rgba(45,226,230,0.15) 100%)';

// shard gradients (match the old SVG defs: vw-tri ran top-left->bottom-right, vw-tri2 mirrored)
const TRI_GRAD1 = 'linear-gradient(135deg, #FF49C7, #2DE2E6)';
const TRI_GRAD2 = 'linear-gradient(225deg, #2DE2E6, #7A5FFF)';


const fade = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 * i },
  }),
};

// name "powers on" (blur+fade only - no layout shift, so the repel homes stay accurate)
const powerOn = (delay: number) => ({
  initial: { opacity: 0, filter: 'blur(14px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay },
});

/**
 * Hero style 01 - VAPORWAVE, composed as a POSTER over the WebGL outrun world (grid floor,
 * starry nebula sky + floor reflection; the retro sun was cut - the bust is the star).
 * Centerpiece = the David bust: gradient-MAPPED body (multiply wash masked to its alpha),
 * pink/cyan chromatic-aberration ghosts, pixel deal-with-it shades that spring onto the eye
 * line, and hairline precedent triangles crossing the face. Around it: the tracked-caps
 * wordmark with a chromatic split shadow (Fusterd benched for now - Luke wants a normal
 * typeface; letters still repel the cursor), a katakana sub-line, big stacked kanji, three
 * glossy gradient orbs, an outlined "01", a hairline frame, and a low-alpha gradient wash
 * over the whole sheet. Copy stays poster-minimal: name, Enter CTA, marquee.
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

        {/* low-alpha gradient wash over the whole scene (precedent 1's pink->blue field) */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: SHEET_WASH }} />

        {/* click + drag to draw a neon line that fades out */}
        <NeonDraw />

        <RepelProvider>
          <div className="relative z-10 h-full">
            {/* poster frame - thin hairline inset from the edges + ornament glyphs. sits UNDER
                the bust and the name (z-0) so the composition overlaps it like a real print */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-3 z-0 border border-[#FDEFF9]/30 md:inset-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <span className="absolute right-2 top-1.5 text-sm text-[#FF6AD5]">✦</span>
              <span className="absolute bottom-1.5 left-2 text-sm text-[#2DE2E6]">✦</span>
              {/* print crop marks - little registration ticks outside each corner */}
              <span className="absolute -left-3 top-0 h-px w-2 bg-[#FDEFF9]/40" />
              <span className="absolute -top-3 left-0 h-2 w-px bg-[#FDEFF9]/40" />
              <span className="absolute -right-3 top-0 h-px w-2 bg-[#FDEFF9]/40" />
              <span className="absolute -top-3 right-0 h-2 w-px bg-[#FDEFF9]/40" />
              <span className="absolute -left-3 bottom-0 h-px w-2 bg-[#FDEFF9]/40" />
              <span className="absolute -bottom-3 left-0 h-2 w-px bg-[#FDEFF9]/40" />
              <span className="absolute -right-3 bottom-0 h-px w-2 bg-[#FDEFF9]/40" />
              <span className="absolute -bottom-3 right-0 h-2 w-px bg-[#FDEFF9]/40" />
            </motion.div>

            {/* gradient balls - flat discs packed tight around the central figure, each with
                its own gradient direction/mix */}
            <Orb className="right-[6%] top-[11%] z-[4] md:right-[30%] md:top-[12%]" size="clamp(90px, 13vw, 200px)" delay={0.8} drift={12} background={ORB_GRADS[0]} ring />
            <Orb className="left-[-6%] top-[34%] z-[3] md:left-[28%] md:top-[21%]" size="clamp(80px, 11vw, 170px)" delay={0.9} drift={10} background={ORB_GRADS[1]} />
            <Orb className="bottom-[22%] left-[17%] z-[4] md:left-[34%] md:bottom-[26%]" size="clamp(48px, 7vw, 110px)" delay={1.0} drift={8} background={ORB_GRADS[2]} />
            <Orb className="left-[35%] top-[11%] z-[3] md:left-[44%] md:top-[6%]" size="clamp(36px, 5vw, 80px)" delay={1.05} drift={7} background={ORB_GRADS[3]} />
            <Orb className="bottom-[17%] right-[7%] z-[3] md:right-[32%] md:bottom-[24%]" size="clamp(44px, 6.5vw, 100px)" delay={1.1} drift={9} background={ORB_GRADS[4]} />
            <Orb className="bottom-[14%] right-[28%] z-20 md:right-[39%] md:bottom-[21%]" size="clamp(24px, 3.5vw, 52px)" delay={1.2} drift={6} background={ORB_GRADS[5]} />

            {/* ---- poster furniture, packed against the central figure ---- */}
            <motion.div {...powerOn(0.85)} aria-hidden className="pointer-events-none absolute inset-0 z-[4]">
              {/* pattern patches hugging the bust */}
              <Mesh className="left-[33%] top-[7%] h-52 w-52 -rotate-6 opacity-30" color="#FF6AD5" />
              <Mesh className="bottom-[13%] right-[33%] h-32 w-32 opacity-25" color="#2DE2E6" />
              <Dots className="right-[33%] top-[13%] h-36 w-44 opacity-40" color="rgba(253,239,249,0.35)" />
              <Dots className="bottom-[13%] left-[36%] h-28 w-36 opacity-30" color="rgba(255,106,213,0.4)" />
              {/* viewfinder corner brackets - centered on the SCREEN (the bust sits at 53%,
                  so anchoring these to its box read visibly off-center; Luke wants them true) */}
              <span className="absolute left-1/2 top-1/2 h-[80%] w-[92%] -translate-x-1/2 -translate-y-1/2 md:h-[84%] md:w-[46%]">
                <span className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-[#FDEFF9]/70" />
                <span className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-[#FDEFF9]/70" />
                <span className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-[#FDEFF9]/70" />
                <span className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-[#FDEFF9]/70" />
              </span>
              {/* micro spec labels (real data: section index, site version, Toronto coords) */}
              <span className="absolute bottom-[25%] right-[4.5%] font-mono text-[9px] tracking-[0.35em] text-[#FDEFF9]/55">
                <RepelNode>SEC.00 ✦ V3.0</RepelNode>
              </span>
              <span className="absolute left-[4%] top-[8%] font-mono text-[9px] tracking-[0.3em] text-[#FDEFF9]/45">
                <RepelNode>43.65 N / 79.38 W</RepelNode>
              </span>
            </motion.div>

            {/* bust - centered, chromatic-aberration ghosts behind, pixel shades on the eyes,
                slow idle float. the translate centering lives on a PLAIN wrapper so framer's
                transform animations can't clobber it */}
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                {/* idle float lives in CSS (poster-float), NOT framer - see index.css */}
                <div
                  className={`poster-float relative ${STATUE_H}`}
                  style={{ animation: 'poster-float 9s ease-in-out infinite', '--float': '-9px' } as CSSProperties}
                >
                  <img
                    src={STATUE_SRC}
                    alt=""
                    aria-hidden
                    draggable={false}
                    className="absolute inset-0 h-full w-auto max-w-none opacity-70"
                    style={{ filter: TINT_PINK, transform: 'translate(-1.6%, 1.2%)' }}
                  />
                  <img
                    src={STATUE_SRC}
                    alt=""
                    aria-hidden
                    draggable={false}
                    className="absolute inset-0 h-full w-auto max-w-none opacity-70"
                    style={{ filter: TINT_CYAN, transform: 'translate(1.6%, -1.2%)' }}
                  />
                  <img
                    src={STATUE_SRC}
                    alt="Plaster bust of Michelangelo's David wearing pixel sunglasses"
                    draggable={false}
                    className="relative h-full w-auto max-w-none"
                    style={{ filter: 'brightness(1.08)' }}
                  />
                  {/* gradient map: multiply wash masked to the bust's own alpha, so the marble
                      takes the pink->purple->cyan run while its shading survives */}
                  <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background: TINT_WASH,
                      mixBlendMode: 'multiply',
                      opacity: TINT_WASH_OPACITY,
                      WebkitMaskImage: `url(${STATUE_SRC})`,
                      maskImage: `url(${STATUE_SRC})`,
                      WebkitMaskSize: '100% 100%',
                      maskSize: '100% 100%',
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                    }}
                  />
                  {/* the hip beat: deal-with-it shades drop onto the eye line after the bust lands */}
                  <span
                    aria-hidden
                    className="absolute z-10"
                    style={{ top: GLASSES.top, left: GLASSES.left, width: GLASSES.width, transform: 'translate(-50%, -50%)' }}
                  >
                    <RepelNode className="block w-full">
                      <motion.img
                        src={GLASSES_SRC}
                        alt=""
                        draggable={false}
                        className="w-full [image-rendering:pixelated]"
                        initial={{ opacity: 0, y: -90, rotate: GLASSES.tilt - 10 }}
                        animate={{ opacity: 1, y: 0, rotate: GLASSES.tilt }}
                        transition={{ type: 'spring', stiffness: 170, damping: 14, delay: 1.15 }}
                      />
                    </RepelNode>
                  </span>
                  {/* triangle constellation in the statue's box (tracks the bust across
                      breakpoints). Outline trio = SVG, repelling as ONE unit (SVG polygons
                      can't take the repel transform without clobbering their rotate attr);
                      gradient shards = clip-path divs so EACH repels on its own. Every shape
                      keeps its own rotation - uniform upright triangles read machine-made. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[120%] w-[165%] -translate-x-1/2 -translate-y-1/2"
                  >
                    <RepelNode className="block h-full w-full">
                      <motion.svg
                        {...powerOn(0.9)}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className="h-full w-full overflow-visible"
                      >
                        <polygon points="50,14 90,82 10,82" fill="none" stroke="#FF49C7" strokeWidth="2.5" vectorEffect="non-scaling-stroke" opacity="0.85" transform="rotate(11 50 59)" />
                        <polygon points="54,19 94,87 14,87" fill="none" stroke="#2DE2E6" strokeWidth="2" vectorEffect="non-scaling-stroke" opacity="0.65" transform="rotate(-16 54 64)" />
                        <polygon points="64,6 100,30 72,54" fill="none" stroke="#FDEFF9" strokeWidth="1.5" vectorEffect="non-scaling-stroke" opacity="0.45" transform="rotate(-63 79 30)" />
                      </motion.svg>
                    </RepelNode>
                    {/* translucent gradient shards (Luke's favorite), same geometry as the old
                        SVG polygons, each with its own repel */}
                    <Shard className="left-[12%] top-[52%] h-[42%] w-[46%]" rotate={-31} clip="polygon(0% 0%, 100% 33%, 26% 100%)" gradient={TRI_GRAD1} opacity={0.24} delay={0.9} />
                    <Shard className="left-[68%] top-[28%] h-[44%] w-[30%]" rotate={72} clip="polygon(0% 0%, 100% 32%, 33% 100%)" gradient={TRI_GRAD2} opacity={0.22} delay={0.95} />
                    <Shard className="left-[36%] top-[2%] h-[30%] w-[26%]" rotate={-58} clip="polygon(0% 0%, 100% 20%, 31% 100%)" gradient={TRI_GRAD1} opacity={0.18} delay={1.0} />
                    <Shard className="left-[28%] top-[72%] h-[26%] w-[58%]" rotate={24} clip="polygon(0% 0%, 100% 31%, 41% 100%)" gradient={TRI_GRAD2} opacity={0.15} delay={1.05} />
                    <Shard className="left-[2%] top-[20%] h-[28%] w-[20%]" rotate={115} clip="polygon(0% 0%, 100% 21%, 30% 100%)" gradient={TRI_GRAD2} opacity={0.18} delay={1.1} />
                  </span>
                  {/* glitch slices - thin displaced scan bars, kept tight to the bust so they
                      read as slices of IT (full-bleed versions floated like random slabs).
                      blend + opacity live on the OUTER span: the repel wrapper is a stacking
                      context, so a blend INSIDE it would stop compositing against the statue */}
                  <span
                    aria-hidden
                    className="absolute left-[-6%] top-[44%] z-30 h-[1.6%] w-[62%]"
                    style={{ mixBlendMode: 'screen', opacity: 0.65 }}
                  >
                    <RepelNode className="block h-full w-full">
                      <span className="block h-full w-full" style={{ background: 'linear-gradient(90deg, #FF49C7, #2DE2E6)' }} />
                    </RepelNode>
                  </span>
                  <span
                    aria-hidden
                    className="absolute right-[-8%] top-[62%] z-30 h-[1.2%] w-[55%]"
                    style={{ mixBlendMode: 'screen', opacity: 0.5 }}
                  >
                    <RepelNode className="block h-full w-full">
                      <span className="block h-full w-full" style={{ background: '#2DE2E6' }} />
                    </RepelNode>
                  </span>
                </div>
              </motion.div>
            </div>

            {/* the name - big type running DOWN the left edge (precedent 4's edge-bleed
                title; letters turn sideways via vertical-rl and still repel the cursor) */}
            <motion.h1
              {...powerOn(0.35)}
              aria-label={NAME_LABEL}
              style={{ textShadow: CHROMA }}
              className="absolute left-[2%] top-[12%] z-20 font-grotesk text-[7svh] font-bold uppercase leading-none tracking-[0.2em] text-[#FDEFF9] [writing-mode:vertical-rl] md:left-[3.5%] md:text-[9svh]"
            >
              <RepelText words={NAME_WORDS} promote />
            </motion.h1>

            {/* the Japanese block - tategaki on the RIGHT BORDER (columns read top-to-bottom,
                right-to-left: 蒸気波 first, then ポートフォリオ ✦ 2026). ヴェイパーウェイヴ was
                cut as the least meaningful column (third rendering of "vaporwave" - the kanji
                and the StyleControl pill already say it). Sits above the style pill. */}
            <motion.div {...powerOn(0.7)} aria-hidden className="absolute right-[3%] top-[20%] z-[5] md:right-[2.5%] md:top-[10%]">
              <span className="flex gap-3 md:gap-4">
                <span className="pt-1 font-mono text-[10px] font-bold tracking-[0.5em] text-[#2DE2E6] [writing-mode:vertical-rl] [text-orientation:upright] md:text-xs">
                  <RepelText words={[{ t: 'ポートフォリオ' }, { t: '✦' }, { t: '2026' }]} />
                </span>
                <span style={{ textShadow: CHROMA }} className="text-4xl font-bold tracking-[0.35em] text-[#FDEFF9]/90 [writing-mode:vertical-rl] md:text-6xl">
                  <RepelText words={[{ t: '蒸気波' }]} promote />
                </span>
              </span>
            </motion.div>

            {/* style numeral - filled solid, hashed to the hero style it belongs to */}
            <motion.span
              {...powerOn(0.8)}
              aria-hidden
              className="absolute bottom-[5%] right-[4%] z-[4] font-grotesk text-[15vw] font-bold leading-none text-[#FDEFF9] md:text-[8vw]"
            >
              <RepelText words={[{ t: '#01' }]} promote />
            </motion.span>

            {/* fake print barcode - bottom-left corner chip (poster furniture; 0826 = Luke's handle digits) */}
            <motion.div {...powerOn(1.0)} aria-hidden className="absolute bottom-[6%] left-[4%] z-30">
              <RepelNode className="flex flex-col gap-1.5">
                <span
                  className="block h-6 w-16 opacity-80"
                  style={{
                    background:
                      'repeating-linear-gradient(90deg, #FDEFF9 0 2px, transparent 2px 3px, #FDEFF9 3px 5px, transparent 5px 8px, #FDEFF9 8px 9px, transparent 9px 12px)',
                  }}
                />
                <span className="font-mono text-[9px] tracking-[0.3em] text-[#FDEFF9]/60">LZ·0826</span>
              </RepelNode>
            </motion.div>

            {/* magnetic enter CTA - bottom center (flex centering, NOT a translate, so the
                fade variant's y animation can't clobber the centering transform) */}
            <motion.div
              custom={9}
              variants={fade}
              initial="hidden"
              animate="show"
              className="absolute inset-x-0 bottom-[5%] z-30 flex justify-center"
            >
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

/** A flat gradient disc that fades/scales in (one-shot framer), then floats forever via
 *  the CSS `poster-float` keyframe - compositor-driven, zero per-frame JS. `ring` wraps
 *  it in a thin Saturn ellipse. Durations vary with drift so the cluster doesn't sync. */
function Orb({ className, size, delay, drift, background, ring }: { className: string; size: string; delay: number; drift: number; background: string; ring?: boolean }) {
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* repel wraps the float span: the repel loop writes THIS span's transform while the
          CSS keyframe animates the child, so the two transforms never fight */}
      <RepelNode className="block h-full w-full">
        <span
          className="poster-float relative block h-full w-full rounded-full"
          style={
            {
              background,
              animation: `poster-float ${6.5 + drift * 0.3}s ease-in-out ${delay}s infinite`,
              '--float': `${-drift}px`,
            } as CSSProperties
          }
        >
          {ring && (
            <span className="absolute left-1/2 top-1/2 h-[44%] w-[160%] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] rounded-full border border-[#FDEFF9]/45" />
          )}
        </span>
      </RepelNode>
    </motion.div>
  );
}

/** A translucent gradient triangle (clip-path div, so unlike an SVG polygon it can carry
 *  the repel transform on a wrapper without clobbering its own rotation). */
function Shard({ className, rotate, clip, gradient, opacity, delay }: { className: string; rotate: number; clip: string; gradient: string; opacity: number; delay: number }) {
  return (
    <motion.span {...powerOn(delay)} aria-hidden className={`absolute ${className}`} style={{ transform: `rotate(${rotate}deg)` }}>
      <RepelNode className="block h-full w-full">
        <span className="block h-full w-full" style={{ background: gradient, opacity, clipPath: clip }} />
      </RepelNode>
    </motion.span>
  );
}

/** A small square patch of 1px grid mesh (precedent 2's wire patch). */
function Mesh({ className, color }: { className: string; color: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      style={{
        backgroundImage: `repeating-linear-gradient(0deg, ${color} 0 1px, transparent 1px 12px), repeating-linear-gradient(90deg, ${color} 0 1px, transparent 1px 12px)`,
      }}
    />
  );
}

/** A patch of halftone dots. */
function Dots({ className, color }: { className: string; color: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      style={{ backgroundImage: `radial-gradient(${color} 1px, transparent 1.4px)`, backgroundSize: '10px 10px' }}
    />
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
