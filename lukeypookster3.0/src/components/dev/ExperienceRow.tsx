import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Experience } from '../../data/experience';

/**
 * Expandable experience entry. Collapsed = company (linked) + role + one-line
 * summary. Click anywhere on the header to reveal the full detail bullets; the
 * company link stops propagation so it navigates instead of toggling.
 */
export default function ExperienceRow({ exp }: { exp: Experience }) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((o) => !o);

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.5 }}
      className="border-t border-bone/20"
    >
      {/* header (clickable) */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
        className="grid cursor-pointer grid-cols-1 gap-2 py-6 transition-colors hover:bg-bone/[0.03] md:grid-cols-[160px_1fr] md:gap-8"
      >
        <div className="font-mono text-xs uppercase text-bone/60">
          <div className="text-bone">{exp.start}</div>
          <div>- {exp.end}</div>
          <div className="mt-1">{exp.location}</div>
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {exp.url ? (
                <a
                  href={exp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-grotesk text-2xl font-bold underline decoration-acid decoration-2 underline-offset-4 transition-colors hover:text-acid md:text-3xl"
                >
                  {exp.company} <span className="text-acid">↗</span>
                </a>
              ) : (
                <h4 className="font-grotesk text-2xl font-bold md:text-3xl">{exp.company}</h4>
              )}
              <span className="font-mono text-sm text-acid">{exp.role}</span>
            </div>
            <span
              className={`shrink-0 select-none font-mono text-2xl leading-none transition-transform duration-300 ${
                open ? 'rotate-45' : ''
              }`}
              aria-hidden
            >
              +
            </span>
          </div>

          <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-bone/40">
            {exp.companyNote}
          </p>
          <p className="mt-2 max-w-3xl text-bone/70">{exp.summary}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {exp.tags.map((t) => (
              <span
                key={t}
                className="border border-bone/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-bone/60"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* expandable detail */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-2 pb-8 md:grid-cols-[160px_1fr] md:gap-8">
              <div className="hidden md:block" />
              <ul className="space-y-3 border-l-2 border-acid/40 pl-4">
                {exp.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 text-sm text-bone/80">
                    <span className="mt-1 font-mono text-[10px] text-acid">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="max-w-3xl">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
