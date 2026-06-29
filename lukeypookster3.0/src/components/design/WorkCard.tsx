import type { CSSProperties } from 'react';
import type { WorkPiece } from '../../data/design';

/**
 * A UI/graphics work tile. The preview is a placeholder gradient block until a real
 * thumbnail lands (add a `thumb` field + swap the gradient for an <img>).
 */
export default function WorkCard({ piece }: { piece: WorkPiece }) {
  const { title, kind, category, year, tags, bg, bg2, fg, placeholder } = piece;

  return (
    <article className="group relative flex h-[400px] w-[300px] shrink-0 snap-start flex-col overflow-hidden border-2 border-ink bg-bone md:w-[340px]">
      {/* preview */}
      <div
        className="relative flex flex-1 flex-col justify-between p-4"
        style={{ background: `linear-gradient(135deg, ${bg}, ${bg2})`, color: fg } as CSSProperties}
      >
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
          <span className="border px-1.5 py-0.5" style={{ borderColor: fg }}>
            {kind === 'ui' ? 'UI / UX' : 'Graphic'}
          </span>
          {placeholder && <span className="opacity-60">Coming soon</span>}
        </div>
        <h4 className="font-grotesk text-3xl font-bold uppercase leading-[0.9] tracking-brutal">
          {title}
        </h4>
      </div>

      {/* meta */}
      <div className="bg-bone p-4 text-ink">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">
          <span>{category}</span>
          <span>{year}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="border border-ink/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-ink/70"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
