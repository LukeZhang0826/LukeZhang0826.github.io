import { memo } from 'react';

/**
 * FilmOverlay - an old-projector "dirty film gate" filter. Renders, from back to front:
 * animated dust/speckle (two scales) + characterful hairs/blots, fine moving grain, the two
 * faint projector-gate lines at the thirds, and a heavy gate vignette (bright centre, dark
 * rounded edges).
 *
 * It is a translucent OVERLAY (absolute, pointer-events-none) designed to sit ABOVE the
 * projected backdrop and BELOW the section's foreground content. The default backdrop is the
 * section's white ground; later a blurred + grainy <video> can be dropped in behind this
 * overlay so a playing clip reads as projected onto the wall.
 */

// sparse black dust via thresholded fractal noise; `slope`/`offset` set the alpha cutoff
// (only the noise tail becomes opaque black -> scattered specks). Two scales: grit + flecks.
const dust = (freq: number, seed: number, slope: number, offset: number) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='340'%3E%3Cfilter id='d'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='2' seed='${seed}' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${slope} ${offset}'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23d)'/%3E%3C/svg%3E")`;

function FilmOverlayBase() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* fine grit + coarse flecks; paired layers flicker out of phase so the dirt keeps changing.
          The whole overlay is mount-gated to on-screen (AnimationSection), so 4 layers are fine. */}
      <div className="film-dust" style={{ backgroundImage: dust(0.9, 7, -18, 4.6) }} />
      <div className="film-dust" style={{ backgroundImage: dust(0.9, 31, -18, 4.6), animationDelay: '130ms' }} />
      <div className="film-dust film-dust--coarse" style={{ backgroundImage: dust(0.32, 11, -9, 3.3) }} />
      <div className="film-dust film-dust--coarse" style={{ backgroundImage: dust(0.32, 23, -9, 3.3), animationDelay: '210ms' }} />

      {/* fine moving grain (multiply -> dirties the white) */}
      <div className="noir-grain" />

      {/* two faint projector-gate lines at the thirds */}
      <div className="absolute inset-y-0 w-px bg-black/10" style={{ left: '33.33%' }} />
      <div className="absolute inset-y-0 w-px bg-black/10" style={{ left: '66.66%' }} />

      {/* gate vignette: bright centre, heavy dark blurry periphery. A pure radial gradient (GPU-native,
          cheap) does it - the old inset box-shadow blur repainted expensively on every scroll. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 108% at 50% 50%, transparent 12%, rgba(0,0,0,0.72) 46%, rgba(0,0,0,0.95) 74%, #000 94%)',
        }}
      />
    </div>
  );
}

export default memo(FilmOverlayBase);
