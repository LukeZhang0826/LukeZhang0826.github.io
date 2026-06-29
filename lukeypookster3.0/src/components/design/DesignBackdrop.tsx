/**
 * Section 03 backdrop - International Typographic ("Swiss") poster.
 * A busy Müller-Brockmann field in black + red on bone paper: a layered modular grid,
 * red rule lines, concentric arcs, a big outline numeral, a tick baseline and rotated
 * wordmarks. Strictly red/black/bone and low-contrast, so the loud, deliberately-
 * incoherent style cards on top still pop. Pure CSS/SVG - no JS, no extra bundle cost.
 */
export default function DesignBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* coarse modular grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(10,10,10,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,10,0.05) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      {/* fine sub-grid for density */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(10,10,10,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,10,0.03) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />

      {/* bold red column spine + a second hairline axis */}
      <div className="absolute inset-y-0 left-[7%] w-[3px] bg-mond-red/80" />
      <div className="absolute inset-y-0 left-[38%] w-px bg-ink/10" />
      <div className="absolute inset-y-0 right-[14%] w-px bg-mond-red/30" />

      {/* horizontal red rules */}
      <div className="absolute left-0 right-0 top-[18%] h-[2px] bg-mond-red/50" />
      <div className="absolute left-[7%] right-0 bottom-[20%] h-px bg-ink/15" />

      {/* filled red block (Brockmann accent) */}
      <div className="absolute left-[7%] top-[18%] h-[14vh] w-[8vw] max-h-32 max-w-28 bg-mond-red/15" />

      {/* concentric red arcs sweeping out of the top-right corner */}
      <svg
        viewBox="0 0 100 100"
        className="absolute right-0 top-0 h-[78vh] w-[78vh] max-h-[760px] max-w-[760px] translate-x-1/2 -translate-y-1/2 text-mond-red"
      >
        {[14, 22, 30, 38, 46, 54, 62].map((r) => (
          <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
        ))}
      </svg>

      {/* a smaller arc cluster bleeding off the bottom-left */}
      <svg
        viewBox="0 0 100 100"
        className="absolute bottom-0 left-0 h-[40vh] w-[40vh] max-h-96 max-w-96 -translate-x-1/2 translate-y-1/2 text-ink"
      >
        {[16, 26, 36, 46].map((r) => (
          <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
        ))}
      </svg>

      {/* giant outline numeral */}
      <span
        className="absolute right-[8%] top-[6%] select-none font-grotesk text-[28vw] font-bold leading-none md:text-[18vw]"
        style={{ WebkitTextStroke: '2px rgba(229,18,31,0.14)', color: 'transparent' }}
      >
        03
      </span>

      {/* huge rotated wordmark down the right edge */}
      <span
        style={{ writingMode: 'vertical-rl' }}
        className="absolute right-[2%] top-1/2 -translate-y-1/2 select-none font-grotesk text-[20vw] font-bold uppercase leading-none tracking-brutal text-ink/[0.05]"
      >
        Grafik
      </span>

      {/* a second, smaller rotated wordmark on the left */}
      <span
        style={{ writingMode: 'vertical-rl' }}
        className="absolute left-[12%] top-[44%] select-none font-grotesk text-[9vw] font-bold uppercase leading-none tracking-brutal text-ink/[0.04]"
      >
        Raster
      </span>

      {/* tick baseline along the bottom */}
      <div
        className="absolute bottom-[10%] left-[7%] right-[6%] h-3"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(10,10,10,0.18) 0 1px, transparent 1px 28px)',
        }}
      />

      {/* precise Swiss caption running up the spine */}
      <span
        style={{ writingMode: 'vertical-rl' }}
        className="absolute bottom-6 left-[7%] ml-2 rotate-180 select-none font-mono text-[10px] uppercase tracking-[0.4em] text-mond-red/70"
      >
        International Typographic Style · 03
      </span>
    </div>
  );
}
