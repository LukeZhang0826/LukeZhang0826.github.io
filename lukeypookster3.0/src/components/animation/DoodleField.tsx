/**
 * Self-drawing grease-pencil doodles behind the Animation "Selected loops" content: loose
 * hand-drawn marks (waves, stars, a spiral, a cloud, sparks, a little tram) that draw
 * themselves on a loop and fade out, staggered. Pure SVG/CSS, cream strokes, low opacity -
 * a cheap animated layer over the grainy gradient. Respects prefers-reduced-motion.
 */

const STROKE = '#FBF6EE';

// [path d, animation duration (s), delay (s)]
const DOODLES: [string, number, number][] = [
  ['M40 520 q40 -60 80 0 t80 0 t80 0 t80 0', 9, 0], // wave, bottom-left
  ['M1090 90 l16 34 37 5 -28 25 8 37 -33 -19 -33 19 8 -37 -28 -25 37 -5 z', 7, 1.4], // star, top-right
  ['M180 150 c0 -45 70 -45 70 5 c0 55 -95 55 -95 -10 c0 -75 120 -75 120 15', 11, 0.6], // spiral loop, top-left
  ['M880 470 h150 v-60 a12 12 0 0 0 -12 -12 h-126 a12 12 0 0 0 -12 12 z', 8.5, 2.2], // tram body, bottom-right
  ['M905 490 a10 10 0 1 0 0.1 0 M1000 490 a10 10 0 1 0 0.1 0', 6, 3], // tram wheels
  ['M520 120 q30 -34 64 0 q30 -34 64 0 q22 26 -8 40 q4 30 -28 30 q-32 16 -52 -8 q-40 6 -40 -30 q-26 -20 0 -32 z', 12, 1.8], // cloud, top-center
  ['M300 470 h44 M308 484 h44 M316 498 h44', 5.5, 2.6], // speed lines
  ['M700 470 l0 -46 q20 -8 20 10 M700 424 a8 7 0 1 0 0.1 0', 7.5, 3.4], // music note
];

export default function DoodleField() {
  return (
    <svg
      aria-hidden
      className="doodle pointer-events-none absolute inset-0 h-full w-full opacity-45"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke={STROKE}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {DOODLES.map(([d, dur, delay], i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          style={{ strokeDasharray: 1, animation: `doodle-draw ${dur}s ease-in-out ${delay}s infinite` }}
        />
      ))}
    </svg>
  );
}
