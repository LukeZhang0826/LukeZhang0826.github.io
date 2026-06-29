import { motion } from 'framer-motion';
import type { Experience } from '../../data/experience';

/**
 * Section 05's performing history as a manuscript timeline - not the Dev-style
 * accordion. Reads as a journey: earliest credit at the top flowing down to Now.
 * Just where Luke plays + when; no role descriptions. Note-head markers sit on a
 * vertical staff line (the spine), each punched clean through with a paper ring.
 */
export default function MusicTimeline({ roles }: { roles: Experience[] }) {
  return (
    <ol className="relative ml-2 border-l-2 border-ink/25 pl-9 md:ml-4">
      {roles.map((x, i) => (
        <motion.li
          key={`${x.company}-${x.start}`}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-12%' }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="relative pb-12 last:pb-2"
        >
          {/* note-head marker on the spine */}
          <span
            aria-hidden
            className="absolute top-1.5 -left-[42px] h-3.5 w-3.5 -rotate-[20deg] rounded-full border-[3px] border-bone bg-ink"
          />

          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/55">
            {x.start} - {x.end}
          </p>

          {x.url ? (
            <a
              href={x.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-music text-3xl font-bold italic underline decoration-ink/40 decoration-2 underline-offset-4 transition-colors hover:text-ink/60 md:text-4xl"
            >
              {x.company} <span className="text-xl no-underline">↗</span>
            </a>
          ) : (
            <h4 className="font-music text-3xl font-bold italic md:text-4xl">{x.company}</h4>
          )}

          <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-ink/50">
            {x.role} · {x.location}
          </p>
        </motion.li>
      ))}

      {/* the journey continues */}
      <li className="relative pb-1">
        <span
          aria-hidden
          className="absolute top-1.5 -left-[42px] h-3.5 w-3.5 rounded-full border-[3px] border-ink bg-bone"
        />
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/55">Now</p>
        <p className="font-music text-2xl italic text-ink/55 md:text-3xl">still playing -</p>
      </li>
    </ol>
  );
}
