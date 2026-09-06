import StyleGallery from '../design/StyleGallery';
import WorkGallery from '../design/WorkGallery';
import DesignBackdrop from '../design/DesignBackdrop';
import { useSectionSpy } from '../../lib/section';
import Reveal from '../util/Reveal';

/**
 * Section 03 - Design. Two horizontal galleries:
 *   1. THE DICTIONARY - a reference wall of clashing graphic-design styles, every card
 *      its own unrelated world (color/font/motif). Deliberately incoherent.
 *   2. UI & GRAPHICS - selected work (placeholders for now).
 * Compact by design (scroll sideways, not down). 100% DOM/CSS.
 */
export default function DesignSection() {
  const ref = useSectionSpy<HTMLElement>('03', 'Graphics & Design');

  return (
    <section ref={ref} className="sel-swiss relative w-full overflow-hidden bg-bone py-12 text-ink">
      {/* International Typographic ("Swiss") poster ground */}
      <DesignBackdrop />

      {/* header band - hard cut from dark Development to bright paper */}
      <div className="relative z-10 px-4 md:px-8">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink/60">
            03 / A field guide to styles
          </p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <h2 className="font-grotesk text-[12vw] font-bold uppercase leading-[0.82] tracking-brutal md:text-[6.5vw]">
              Graphics &amp; Design
            </h2>
            <span className="hidden max-w-xs whitespace-normal text-right font-mono text-[11px] uppercase leading-relaxed text-ink/50 md:block">
              A dictionary, not a house style - every card its own world. Scroll sideways.
            </span>
          </div>
        </Reveal>
      </div>

      {/* 1 - the style dictionary */}
      <div className="relative z-10 mt-8">
        <Reveal>
          <h3 className="px-4 font-mono text-sm uppercase tracking-widest text-ink/70 md:px-8">
            // Style Dictionary
          </h3>
        </Reveal>
        <div className="mt-3">
          <StyleGallery />
        </div>
      </div>

      {/* 2 - UI / web product work */}
      <div className="relative z-10 mt-14">
        <Reveal>
          <h3 className="px-4 font-mono text-sm uppercase tracking-widest text-ink/70 md:px-8">
            // UI &amp; Web - product / interface
          </h3>
          <p className="mt-1 px-4 font-mono text-[11px] uppercase tracking-widest text-ink/45 md:px-8">
            Placeholder slots. None of these are real pieces yet.
          </p>
        </Reveal>
        <div className="mt-3">
          <WorkGallery kind="ui" label="UI / web · drag →" />
        </div>
      </div>

      {/* 3 - graphics / posters (print, Illustrator) */}
      <div className="relative z-10 mt-14">
        <Reveal>
          <h3 className="px-4 font-mono text-sm uppercase tracking-widest text-ink/70 md:px-8">
            // Graphics &amp; Posters - print / illustration
          </h3>
          <p className="mt-1 px-4 font-mono text-[11px] uppercase tracking-widest text-ink/45 md:px-8">
            Placeholder slots. None of these are real pieces yet.
          </p>
        </Reveal>
        <div className="mt-3">
          <WorkGallery kind="graphic" label="Graphics · drag →" />
        </div>
      </div>
    </section>
  );
}
