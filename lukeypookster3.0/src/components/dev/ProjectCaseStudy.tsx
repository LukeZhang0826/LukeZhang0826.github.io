import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import type { Project } from '../../data/projects';
import { lockScroll, unlockScroll } from '../../lib/useLenis';

/**
 * Full-height case-study drawer. Opens when a project card is clicked; the live
 * link lives inside here so the card click goes "deeper" rather than navigating
 * away. Locks the Lenis background scroll while open, closes on ✕ / ESC / backdrop.
 */
export default function ProjectCaseStudy({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[100] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ '--accent': project.accent, '--accent-fg': project.accentFg } as CSSProperties}
        >
          {/* backdrop */}
          <button
            aria-label="Close case study"
            onClick={onClose}
            className="absolute inset-0 cursor-pointer bg-ink/70 backdrop-blur-sm"
          />

          {/* panel */}
          <motion.aside
            data-lenis-prevent
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-full w-full max-w-3xl overflow-y-auto bg-ink text-bone"
          >
            {/* sticky top bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-bone/20 bg-ink/90 px-6 py-4 backdrop-blur md:px-10">
              <span className="font-mono text-xs uppercase tracking-widest text-bone/60">
                Case Study / {project.year}
              </span>
              <button
                onClick={onClose}
                className="font-mono text-sm font-bold uppercase tracking-widest transition-colors hover:text-acid"
              >
                Close ✕
              </button>
            </div>

            <div className="px-6 py-10 md:px-10 md:py-14">
              {/* category */}
              <span
                className="inline-block px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider"
                style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
              >
                {project.category}
              </span>

              {/* title */}
              <h2 className="mt-5 font-grotesk text-5xl font-bold uppercase leading-[0.9] tracking-brutal md:text-7xl">
                {project.title}
              </h2>

              {/* meta */}
              <div className="mt-6 flex flex-wrap gap-x-10 gap-y-2 border-y border-bone/20 py-4 font-mono text-xs uppercase tracking-wide text-bone/60">
                <div>
                  <span className="text-bone/40">Role - </span>
                  <span className="text-bone">{project.role}</span>
                </div>
                <div>
                  <span className="text-bone/40">Year - </span>
                  <span className="text-bone">{project.year}</span>
                </div>
              </div>

              {/* overview */}
              <p className="mt-8 max-w-2xl font-grotesk text-xl text-bone/90 md:text-2xl">
                {project.overview}
              </p>

              {/* highlights */}
              <h3 className="mt-12 font-mono text-sm uppercase tracking-widest text-acid">
                // Highlights
              </h3>
              <ul className="mt-5 space-y-4 border-l-2 border-acid/40 pl-5">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex gap-4 text-bone/80">
                    <span className="mt-1 font-mono text-xs text-acid">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="max-w-2xl">{h}</span>
                  </li>
                ))}
              </ul>

              {/* stack */}
              <h3 className="mt-12 font-mono text-sm uppercase tracking-widest text-acid">
                // Stack
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <span
                    key={s}
                    className="border border-bone/30 px-3 py-1 font-mono text-xs uppercase tracking-wider text-bone/70"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* live link */}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-12 inline-flex items-center gap-3 px-6 py-4 font-mono text-sm font-bold uppercase tracking-widest transition-transform hover:-translate-y-0.5"
                style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
              >
                Visit Live ↗
              </a>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
