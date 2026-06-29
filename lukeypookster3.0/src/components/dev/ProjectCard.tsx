import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import type { Project } from '../../data/projects';

/**
 * Tofu-inspired project tile: featured cards span the full grid width with oversized
 * type; the rest sit in a 2-up grid. Pure DOM/CSS - no WebGL - so this whole section
 * stays featherweight. Accent fills the card on hover via CSS vars. Clicking opens
 * the full case study.
 */
export default function ProjectCard({
  project,
  n,
  onOpen,
}: {
  project: Project;
  n: number;
  onOpen: (p: Project) => void;
}) {
  const { title, year, category, stack, blurb, accent, accentFg, featured } = project;

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(project)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ '--accent': accent, '--accent-fg': accentFg } as CSSProperties}
      className={`project-card text-left ${featured ? 'md:col-span-2 md:min-h-[340px] md:p-10' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-xs uppercase tracking-widest opacity-70">
          {String(n).padStart(2, '0')} / {year}
        </span>
        <span className="project-tag px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider">
          {category}
        </span>
      </div>

      <div className="mt-10">
        <h4
          className={`font-dev uppercase leading-[0.9] tracking-tight ${
            featured ? 'text-5xl md:text-7xl' : 'text-3xl md:text-4xl'
          }`}
        >
          {title}
        </h4>
        <p
          className={`mt-4 max-w-2xl opacity-80 ${
            featured ? 'text-base md:text-lg' : 'text-sm'
          }`}
        >
          {blurb}
        </p>
      </div>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {stack.map((s) => (
            <span key={s} className="project-chip font-mono">
              {s}
            </span>
          ))}
        </div>
        <span className="whitespace-nowrap font-mono text-xs font-bold uppercase tracking-widest">
          Case Study →
        </span>
      </div>
    </motion.button>
  );
}
