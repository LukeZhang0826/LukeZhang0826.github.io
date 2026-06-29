import { useClock } from '../../lib/useClock';
import { useActiveSection } from '../../lib/section';
import { useScrollProgress } from '../../lib/useScrollProgress';
import { useGeo } from '../../lib/useGeo';
import { scrollToTop, scrollToBottom } from '../../lib/useLenis';

// which discipline(s) each section lights up in the "Eng / Design / Music" rail
// (a section can span more than one)
const SECTION_DISCIPLINE: Record<string, ('eng' | 'design' | 'music')[]> = {
  '01': ['eng'],
  '02': ['music', 'design'], // animation - motion + design
  '03': ['design'],
  '04': ['design', 'eng'], // photography & architecture
  '05': ['music'],
};

/**
 * The one piece of shared "spine" that survives the max-clash brief: a fixed
 * brutalist HUD. mix-blend-difference keeps it legible over whatever each section
 * throws behind it. Monospace, all-caps, instrument-panel energy.
 */
export default function HUD() {
  const { time, zone } = useClock();
  const active = useActiveSection();
  const { city, weather } = useGeo();
  const discs = SECTION_DISCIPLINE[active.index] ?? [];
  const lit = (d: 'eng' | 'design' | 'music') =>
    discs.includes(d) ? 'font-bold underline underline-offset-2' : 'opacity-50';
  // underline the name on the bookend sections (the index + the room finale)
  const nameLit = active.index === '00' || active.index === '06';

  return (
    <header className="pointer-events-none fixed inset-0 z-50 mix-blend-difference text-bone">
      {/* top rail - explicit columns so a hidden middle never shifts the right block */}
      <div className="grid grid-cols-3 items-start p-4 font-mono text-[11px] uppercase tracking-wide md:text-xs">
        <div className="col-start-1 leading-tight" style={{ animation: 'hud-in 0.7s ease-out 0.2s both' }}>
          <div className={`font-bold ${nameLit ? 'underline underline-offset-2' : ''}`}>Luke Zhang</div>
          <div className="mt-0.5">
            <span className={lit('eng')}>Eng</span>
            <span className="opacity-50"> / </span>
            <span className={lit('design')}>Design</span>
            <span className="opacity-50"> / </span>
            <span className={lit('music')}>Music</span>
          </div>
        </div>

        <div
          className="col-start-2 hidden justify-self-center text-center leading-tight sm:block"
          style={{ animation: 'hud-in 0.7s ease-out 0.4s both' }}
        >
          <div className="opacity-70">Section</div>
          <div className="font-bold">
            {active.index} - {active.label}
          </div>
        </div>

        <div
          className="col-start-3 justify-self-end text-right leading-tight"
          style={{ animation: 'hud-in 0.7s ease-out 0.35s both' }}
        >
          <div className="font-bold tabular-nums">{time}</div>
          <div className="opacity-70">{city} · {zone}</div>
          {weather && <div className="opacity-70">{weather.temp}° {weather.label}</div>}
        </div>
      </div>

      {/* bottom rail */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 font-mono text-[11px] uppercase tracking-wide md:text-xs"
        style={{ animation: 'hud-in 0.7s ease-out 0.55s both' }}
      >
        <div className="opacity-70">©2026 - v3.0</div>
        <ScrollArrow />
      </div>
    </header>
  );
}

/**
 * Position-aware scroll arrow: ↓ at the top (click → bottom), ↑ at the bottom
 * (click → top), ↕ in between (click → top). pointer-events-auto because the HUD
 * itself is click-through.
 */
function ScrollArrow() {
  const progress = useScrollProgress();
  const atTop = progress < 0.02;
  const atBottom = progress > 0.98;
  const glyph = atTop ? '↓' : atBottom ? '↑' : '↕';
  const label = atTop ? 'Down' : atBottom ? 'Top' : 'Scroll';

  return (
    <button
      onClick={atTop ? scrollToBottom : scrollToTop}
      className="pointer-events-auto flex items-center gap-2 transition-opacity hover:opacity-60"
      aria-label={label}
    >
      <span className="opacity-70">{label}</span>
      {/* animate-blink isolates this from the header's mix-blend-difference (so it no longer inverts)
          - given an explicit text-bone color so it stays visible. Blink > invert here (Luke's call). */}
      <span className="animate-blink text-base leading-none text-bone">{glyph}</span>
    </button>
  );
}
