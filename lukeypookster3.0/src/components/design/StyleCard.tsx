import { useState, type CSSProperties, type ReactNode } from 'react';
import { STYLE_NOTE, type StyleCard as StyleCardData, type StyleFont, type StyleMotif } from '../../data/design';

const FONT_STACK: Record<StyleFont, string> = {
  grotesk: '"Space Grotesk", system-ui, sans-serif',
  mono: '"Space Mono", ui-monospace, monospace',
  serif: 'Georgia, "Times New Roman", serif',
  slab: 'Rockwell, "Roboto Slab", Georgia, serif',
  system: 'system-ui, "Segoe UI", sans-serif',
  condensed: '"Arial Narrow", "Helvetica Neue", sans-serif',
  fantasy: 'fantasy, "Comic Sans MS", cursive',
  cursive: '"Brush Script MT", cursive',
};

/** rough em-per-char for bold uppercase, used to auto-fit the specimen to one line */
const CHAR_FACTOR: Record<StyleFont, number> = {
  grotesk: 0.6,
  mono: 0.62,
  serif: 0.55,
  slab: 0.6,
  system: 0.58,
  condensed: 0.42,
  fantasy: 0.62,
  cursive: 0.5,
};

type Align = 'left' | 'center' | 'right';
const JUSTIFY: Record<Align, string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

type TagStyle = 'chip' | 'bracket' | 'slash' | 'underline';

const YELLOW = '#F9D71C';
const CARD_BOX =
  'style-card group relative h-[420px] w-[260px] shrink-0 cursor-pointer snap-start [perspective:1400px] md:h-[460px] md:w-[300px]';
const FACE = 'absolute inset-0 overflow-hidden border-2 [backface-visibility:hidden]';

/**
 * A single dictionary entry. Self-contained palette/font/motif, a per-card RANDOM
 * composition (seeded off the id), AND a click-to-FLIP back face with a longer
 * description. The Mondrian card is special-cased into a real De Stijl composition
 * with its own white text cell.
 */
export default function StyleCard({ style, n }: { style: StyleCardData; n: number }) {
  const [flipped, setFlipped] = useState(false);
  const front = style.motif === 'mondrian' ? <MondrianFront style={style} n={n} /> : <NormalFront style={style} n={n} />;

  return (
    <div className={CARD_BOX} onClick={() => setFlipped((f) => !f)}>
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {front}
        <BackFace style={style} n={n} />
      </div>
    </div>
  );
}

/* ---------- front face (generic) ---------- */

function NormalFront({ style, n }: { style: StyleCardData; n: number }) {
  const { name, era, blurb, traits, bg, bg2, fg, accent, font, motif, sample } = style;
  const L = layoutFor(style.id, font);

  const background = bg2 ? `linear-gradient(135deg, ${bg}, ${bg2})` : bg;

  // auto-fit the specimen to one line, then clamp by the seeded random max so cards vary.
  const fit = 12.8 / Math.max(3, sample.length * CHAR_FACTOR[font]);
  const specimenSize = Math.max(1.5, Math.min(L.specimenSize, fit));
  const specimenColor = legible(bg, accent, fg);

  const blocks: Record<'meta' | 'specimen' | 'entry', ReactNode> = {
    meta: (
      <header
        key="meta"
        className="relative z-[2] flex gap-3 text-[10px] uppercase tracking-[0.25em] opacity-70"
        style={{ justifyContent: JUSTIFY[L.metaAlign], fontFamily: FONT_STACK[L.metaFont] }}
      >
        <span>{String(n).padStart(2, '0')}</span>
        <span>{era}</span>
      </header>
    ),
    specimen: (
      <div
        key="specimen"
        className="relative z-[2] whitespace-nowrap font-bold uppercase"
        style={{
          fontFamily: FONT_STACK[font],
          color: specimenColor,
          fontSize: `${specimenSize}rem`,
          lineHeight: L.specimenLh,
          textAlign: L.specimenAlign,
          transform: `rotate(${L.specimenRotate}deg)`,
        }}
      >
        {sample}
      </div>
    ),
    entry: (
      <footer key="entry" className="relative z-[2]" style={{ textAlign: L.entryAlign }}>
        <h4
          className="font-bold leading-[1.02] tracking-tight"
          style={{
            fontFamily: FONT_STACK[L.nameFont],
            fontSize: `${L.nameSize}rem`,
            textTransform: L.nameUpper ? 'uppercase' : 'none',
          }}
        >
          {name}
        </h4>
        <p
          className="mt-1.5 text-[11px] leading-snug opacity-80"
          style={{ fontFamily: FONT_STACK[L.blurbFont], fontStyle: L.blurbItalic ? 'italic' : 'normal' }}
        >
          {blurb}
        </p>
        <Tags traits={traits} fg={fg} variant={L.tagStyle} align={L.entryAlign} />
      </footer>
    ),
  };

  return (
    <article
      className={`${FACE} flex flex-col justify-between p-5`}
      style={
        {
          background,
          color: fg,
          borderColor: fg,
          '--accent': accent,
          '--accent2': style.accent2 ?? accent,
        } as CSSProperties
      }
    >
      <Motif motif={motif} fg={fg} accent={accent} accent2={style.accent2 ?? accent} />
      {L.order.map((k) => blocks[k])}
    </article>
  );
}

/* ---------- back face (description) ---------- */

function BackFace({ style, n }: { style: StyleCardData; n: number }) {
  const { name, era, traits, bg, bg2, fg, motif } = style;
  const background = motif === 'mondrian' ? '#FFFFFF' : bg2 ? `linear-gradient(135deg, ${bg}, ${bg2})` : bg;
  const ink = motif === 'mondrian' ? '#0A0A0A' : fg;
  const desc = STYLE_NOTE[style.id] ?? style.blurb;

  return (
    <article
      className={`${FACE} flex flex-col justify-between p-5 [transform:rotateY(180deg)]`}
      style={{ background, color: ink, borderColor: ink }}
    >
      <header className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] opacity-70">
        <span>
          {String(n).padStart(2, '0')} · {era}
        </span>
        <span>↩ flip</span>
      </header>

      <div>
        <h4 className="font-grotesk text-xl font-bold uppercase leading-tight tracking-tight">{name}</h4>
        <p className="mt-3 text-[12px] leading-relaxed opacity-90">{desc}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {traits.map((t) => (
          <span
            key={t}
            className="whitespace-nowrap border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider"
            style={{ borderColor: ink, opacity: 0.7 }}
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}

/* ---------- Mondrian: a dedicated De Stijl composition ---------- */

function MondrianFront({ style, n }: { style: StyleCardData; n: number }) {
  const black = '#0A0A0A';
  const red = style.accent;
  const blue = style.accent2 ?? '#0029FF';
  const line = (s: CSSProperties) => <span className="absolute" style={{ background: black, ...s }} />;

  return (
    <article className={FACE} style={{ background: '#FFFFFF', color: black, borderColor: black }}>
      {/* primary-color cells */}
      <span className="absolute" style={{ left: '60%', right: 0, top: 0, height: '30%', background: red }} />
      <span className="absolute" style={{ left: '60%', right: 0, top: '30%', height: '34%', background: blue }} />
      <span className="absolute" style={{ left: 0, width: '60%', top: '64%', bottom: 0, background: YELLOW }} />

      {/* thick black grid lines */}
      {line({ left: '60%', top: 0, bottom: 0, width: '7px', transform: 'translateX(-50%)' })}
      {line({ left: 0, right: 0, top: '64%', height: '7px', transform: 'translateY(-50%)' })}
      {line({ left: '60%', right: 0, top: '30%', height: '7px', transform: 'translateY(-50%)' })}

      {/* white text cell (top-left) */}
      <div className="absolute z-[2] flex flex-col" style={{ left: 0, top: 0, width: '60%', height: '64%', padding: '16px' }}>
        <header className="flex gap-2 font-mono text-[9px] uppercase tracking-[0.25em] opacity-60">
          <span>{String(n).padStart(2, '0')}</span>
          <span>{style.era}</span>
        </header>
        <h4 className="mt-auto font-grotesk text-lg font-bold uppercase leading-[0.95] tracking-tight">{style.name}</h4>
        <p className="mt-2 text-[11px] leading-snug opacity-80">{style.blurb}</p>
        <Tags traits={style.traits} fg={black} variant="bracket" align="left" />
      </div>
    </article>
  );
}

/* ---------- trait tags ---------- */

function Tags({ traits, fg, variant, align }: { traits: string[]; fg: string; variant: TagStyle; align: Align }) {
  if (variant === 'chip') {
    return (
      <div className="mt-2.5 flex flex-wrap gap-1.5" style={{ justifyContent: JUSTIFY[align] }}>
        {traits.map((t) => (
          <span
            key={t}
            className="whitespace-nowrap border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider"
            style={{ borderColor: fg, opacity: 0.7 }}
          >
            {t}
          </span>
        ))}
      </div>
    );
  }
  if (variant === 'bracket') {
    return (
      <p className="mt-2.5 font-mono text-[10px] uppercase tracking-wider opacity-70">
        {traits.map((t) => `[${t}]`).join(' ')}
      </p>
    );
  }
  if (variant === 'slash') {
    return (
      <p className="mt-2.5 text-[10px] uppercase tracking-[0.2em] opacity-70" style={{ fontFamily: FONT_STACK.condensed }}>
        {traits.join(' / ')}
      </p>
    );
  }
  return (
    <p
      className="mt-2.5 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-wider opacity-70"
      style={{ justifyContent: JUSTIFY[align] }}
    >
      {traits.map((t) => (
        <span key={t} className="underline decoration-1 underline-offset-2">
          {t}
        </span>
      ))}
    </p>
  );
}

/* ---------- seeded per-card layout ---------- */

type Layout = {
  order: ReadonlyArray<'meta' | 'specimen' | 'entry'>;
  metaAlign: Align;
  specimenAlign: Align;
  entryAlign: Align;
  specimenSize: number;
  specimenRotate: number;
  specimenLh: number;
  nameFont: StyleFont;
  nameUpper: boolean;
  nameSize: number;
  metaFont: StyleFont;
  blurbFont: StyleFont;
  blurbItalic: boolean;
  tagStyle: TagStyle;
};

function layoutFor(id: string, font: StyleFont): Layout {
  const rng = mulberry32(hashSeed(id));
  const pick = <T,>(a: readonly T[]): T => a[Math.floor(rng() * a.length)];
  const range = (lo: number, hi: number) => lo + rng() * (hi - lo);

  return {
    order: shuffle(['meta', 'specimen', 'entry'] as const, rng),
    metaAlign: pick(['left', 'left', 'center', 'right'] as const),
    specimenAlign: pick(['left', 'left', 'center', 'right'] as const),
    entryAlign: pick(['left', 'left', 'left', 'center', 'right'] as const),
    specimenSize: range(2.2, 3.7),
    specimenRotate: pick([0, 0, 0, 0, -3, 3, -6, 6, -2, 2]),
    specimenLh: pick([0.82, 0.86, 0.95, 1.05]),
    nameFont: pick([font, font, 'grotesk', 'mono', 'serif', 'slab', 'condensed', 'system'] as const),
    nameUpper: rng() > 0.4,
    nameSize: range(0.95, 1.45),
    metaFont: pick(['mono', 'mono', 'grotesk', 'condensed'] as const),
    blurbFont: pick(['system', 'system', 'serif', 'mono', 'grotesk'] as const),
    blurbItalic: rng() > 0.72,
    tagStyle: pick(['chip', 'chip', 'bracket', 'slash', 'underline'] as const),
  };
}

function shuffle<T>(arr: readonly T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** FNV-1a string hash → 32-bit seed. */
function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Small deterministic PRNG in [0, 1). */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- legibility ---------- */

/** Prefer the accent for the specimen; fall back to fg, then black/white, if it'd blend. */
function legible(bg: string, accent: string, fg: string): string {
  if (contrast(accent, bg) >= 3) return accent;
  const better = contrast(accent, bg) >= contrast(fg, bg) ? accent : fg;
  if (contrast(better, bg) >= 3) return better;
  return contrast('#000000', bg) >= contrast('#FFFFFF', bg) ? '#000000' : '#FFFFFF';
}

function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

function luminance(hex: string): number {
  const { r, g, b } = rgb(hex);
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function rgb(hex: string) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function hexA(hex: string, a: number): string {
  const { r, g, b } = rgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/* ---------- motif decoration ---------- */

// classic space-invader sprite (11x8) for the 8-bit motif, drawn via box-shadow pixels
const INVADER = [
  '00100000100',
  '00010001000',
  '00111111100',
  '01101110110',
  '11111111111',
  '10111111101',
  '10100000101',
  '00011011000',
];

/** Decoration layer - each motif paints with the card's own palette. */
function Motif({ motif, fg, accent, accent2 }: { motif: StyleMotif; fg: string; accent: string; accent2: string }) {
  const base = 'pointer-events-none absolute inset-0 z-[1]';
  const black = '#0A0A0A';

  switch (motif) {
    case 'grid':
      return (
        <div
          className={base}
          style={{
            backgroundImage: `linear-gradient(${hexA(fg, 0.12)} 1px, transparent 1px), linear-gradient(90deg, ${hexA(fg, 0.12)} 1px, transparent 1px)`,
            backgroundSize: '26px 26px',
          }}
        />
      );
    case 'bauhaus':
      return (
        <div className={base}>
          <span className="absolute rounded-full" style={{ right: '-6%', top: '8%', width: '44%', height: '44%', background: accent }} />
          <span className="absolute" style={{ left: '6%', bottom: '8%', width: '30%', height: '30%', background: accent2 }} />
          <span
            className="absolute"
            style={{ left: '40%', top: '14%', width: 0, height: 0, borderLeft: '38px solid transparent', borderRight: '38px solid transparent', borderBottom: `64px solid ${YELLOW}` }}
          />
        </div>
      );
    case 'blocks':
      // neubrutalism: flat blocks with hard offset drop-shadows.
      return (
        <div className={base}>
          <span className="absolute" style={{ left: '14%', top: '15%', width: '34%', height: '24%', background: accent, boxShadow: `7px 7px 0 ${black}` }} />
          <span className="absolute" style={{ right: '12%', bottom: '17%', width: '30%', height: '22%', background: accent2, boxShadow: `7px 7px 0 ${black}` }} />
        </div>
      );
    case 'stripes':
      return (
        <div className={base} style={{ backgroundImage: `repeating-linear-gradient(45deg, ${hexA(accent, 0.18)} 0 12px, transparent 12px 24px)` }} />
      );
    case 'sun':
      return (
        <div className={base} style={{ backgroundImage: `repeating-conic-gradient(from 0deg at 50% 120%, ${hexA(accent, 0.16)} 0deg 6deg, transparent 6deg 12deg)` }} />
      );
    case 'bloom':
      // solarpunk: soft organic sun rays + concentric bloom rising from the base.
      return (
        <div className={base}>
          <div className="absolute inset-0" style={{ backgroundImage: `repeating-conic-gradient(from 0deg at 50% 100%, ${hexA(accent, 0.13)} 0 4deg, transparent 4deg 16deg)` }} />
          <div className="absolute inset-0" style={{ backgroundImage: `repeating-radial-gradient(circle at 50% 100%, ${hexA(accent, 0.14)} 0 11px, transparent 11px 22px)` }} />
        </div>
      );
    case 'psychedelic':
      return (
        <div className={base} style={{ backgroundImage: `repeating-radial-gradient(circle at 50% 42%, ${hexA(accent, 0.4)} 0 7px, ${hexA(accent2, 0.4)} 7px 14px)` }} />
      );
    case 'opart':
      // pure black-and-white concentric rings tuned to vibrate.
      return (
        <div className={base} style={{ backgroundImage: `repeating-radial-gradient(circle at 50% 46%, ${hexA(fg, 0.85)} 0 7px, transparent 7px 14px)` }} />
      );
    case 'atomic':
      return (
        <div className={base}>
          <div className="absolute inset-0" style={{ backgroundImage: `repeating-conic-gradient(from 0deg at 80% 16%, ${hexA(accent, 0.22)} 0deg 1.6deg, transparent 1.6deg 15deg)` }} />
          <span className="absolute rounded-full" style={{ left: '12%', bottom: '15%', width: '48%', height: '24%', border: `2px solid ${hexA(accent2, 0.6)}`, transform: 'rotate(-24deg)' }} />
          <span className="absolute rounded-full" style={{ left: '12%', bottom: '15%', width: '48%', height: '24%', border: `2px solid ${hexA(accent, 0.55)}`, transform: 'rotate(34deg)' }} />
          <span className="absolute rounded-full" style={{ left: '32%', bottom: '24%', width: '10px', height: '10px', background: accent }} />
        </div>
      );
    case 'columns':
      // editorial: a column grid + a baseline rule.
      return (
        <div className={base}>
          {[33, 66].map((x) => (
            <span key={x} className="absolute bottom-0 top-0" style={{ left: `${x}%`, width: '1px', background: hexA(fg, 0.16) }} />
          ))}
          <span className="absolute left-0 right-0" style={{ top: '18%', height: '1px', background: hexA(fg, 0.2) }} />
        </div>
      );
    case 'hairline':
      // architecture monograph: thin inset frame + corner crop marks.
      return (
        <div className={base}>
          <span className="absolute inset-3" style={{ border: `1px solid ${hexA(fg, 0.22)}` }} />
          <span className="absolute" style={{ left: '10px', top: '10px', width: '14px', height: '1px', background: hexA(fg, 0.4) }} />
          <span className="absolute" style={{ left: '10px', top: '10px', width: '1px', height: '14px', background: hexA(fg, 0.4) }} />
          <span className="absolute" style={{ right: '10px', bottom: '10px', width: '14px', height: '1px', background: hexA(fg, 0.4) }} />
          <span className="absolute" style={{ right: '10px', bottom: '10px', width: '1px', height: '14px', background: hexA(fg, 0.4) }} />
        </div>
      );
    case 'glitch':
      // RGB channel-shifted slices over fine scanlines.
      return (
        <div className={base}>
          <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(0deg, ${hexA(fg, 0.05)} 0 2px, transparent 2px 5px)` }} />
          <span className="absolute" style={{ left: '-4%', top: '27%', width: '70%', height: '8px', background: hexA(accent, 0.5) }} />
          <span className="absolute" style={{ right: '-4%', top: '51%', width: '60%', height: '6px', background: hexA(accent2, 0.5) }} />
          <span className="absolute" style={{ left: '8%', top: '69%', width: '50%', height: '4px', background: hexA(accent, 0.4) }} />
        </div>
      );
    case 'memphis':
      // squiggle + confetti shapes + faint dot field.
      return (
        <div className={base}>
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${hexA(fg, 0.12)} 1.4px, transparent 1.6px)`, backgroundSize: '18px 18px' }} />
          <span className="absolute rounded-full" style={{ left: '12%', top: '14%', width: '14px', height: '14px', background: accent }} />
          <span className="absolute" style={{ right: '14%', top: '20%', width: '16px', height: '16px', background: accent2, transform: 'rotate(20deg)' }} />
          <span className="absolute" style={{ left: '20%', bottom: '20%', width: 0, height: 0, borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderBottom: `16px solid ${YELLOW}` }} />
          <svg className="absolute" style={{ right: '8%', bottom: '14%', width: '74px', height: '22px' }} viewBox="0 0 74 22" fill="none">
            <path d="M2 11 q 9 -13 18 0 t 18 0 t 18 0 t 18 0" stroke={accent} strokeWidth="3" fill="none" />
          </svg>
        </div>
      );
    case 'boxlogo':
      // streetwear: a bold framed box logo.
      return (
        <div className={base}>
          <span className="absolute" style={{ left: '50%', top: '44%', transform: 'translate(-50%,-50%)', width: '68%', height: '22%', border: `4px solid ${hexA(fg, 0.85)}` }} />
        </div>
      );
    case 'overprint':
      // risograph: two fluoro spot circles multiplied with a registration offset.
      return (
        <div className={base}>
          <span className="absolute rounded-full" style={{ left: '8%', top: '10%', width: '58%', height: '42%', background: hexA(accent, 0.55), mixBlendMode: 'multiply' }} />
          <span className="absolute rounded-full" style={{ right: '4%', top: '20%', width: '58%', height: '42%', background: hexA(accent2, 0.55), mixBlendMode: 'multiply' }} />
        </div>
      );
    case 'maximal':
      // more is more: clashing stripes + dots + a circle + a triangle.
      return (
        <div className={base}>
          <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${hexA(accent, 0.2)} 0 10px, transparent 10px 20px)` }} />
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${hexA(accent2, 0.3)} 2px, transparent 2.4px)`, backgroundSize: '16px 16px' }} />
          <span className="absolute rounded-full" style={{ right: '-8%', top: '6%', width: '46%', height: '46%', background: hexA(accent, 0.5) }} />
          <span className="absolute" style={{ left: '6%', bottom: '8%', width: 0, height: 0, borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderBottom: `52px solid ${hexA(YELLOW, 0.6)}` }} />
        </div>
      );
    case 'ornate':
      return (
        <div className="pointer-events-none absolute inset-2 z-[1] border-2" style={{ borderColor: hexA(accent, 0.5), outline: `1px solid ${hexA(accent, 0.3)}`, outlineOffset: '3px' }} />
      );
    case 'dots':
      return (
        <div className={base} style={{ backgroundImage: `radial-gradient(${hexA(accent, 0.35)} 1.6px, transparent 1.8px)`, backgroundSize: '12px 12px' }} />
      );
    case 'scan':
      return (
        <div className={base} style={{ backgroundImage: `repeating-linear-gradient(0deg, ${hexA(fg, 0.1)} 0 1px, transparent 1px 3px)` }} />
      );
    case 'terminal':
      // CRT scanlines + a blinking cursor block.
      return (
        <div className={base}>
          <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(0deg, ${hexA(fg, 0.08)} 0 1px, transparent 1px 3px)` }} />
          <span className="absolute animate-blink" style={{ left: '16px', bottom: '18px', width: '10px', height: '18px', background: hexA(fg, 0.8) }} />
        </div>
      );
    case 'noise':
      return <div className={`${base} style-noise`} />;
    case 'pixel':
      return (
        <div className={base} style={{ backgroundImage: `linear-gradient(${hexA(accent, 0.14)} 2px, transparent 2px), linear-gradient(90deg, ${hexA(accent, 0.14)} 2px, transparent 2px)`, backgroundSize: '8px 8px' }} />
      );
    case 'vaporwave':
      // mini outrun world: a FLAT retro sun (warm->magenta) with slit gaps cut into its
      // lower half, over a perspective grid floor. No glossy highlight (that read as a ball).
      return (
        <div className={base}>
          <div
            className="absolute inset-x-0 bottom-0"
            style={{
              height: '42%',
              backgroundImage: `repeating-linear-gradient(90deg, ${hexA(fg, 0.55)} 0 1px, transparent 1px 26px), repeating-linear-gradient(0deg, ${hexA(fg, 0.5)} 0 1px, transparent 1px 26px)`,
              transform: 'perspective(160px) rotateX(64deg)',
              transformOrigin: 'center bottom',
            }}
          />
          <span
            className="absolute overflow-hidden rounded-full"
            style={{
              left: '50%',
              top: '13%',
              width: '150px',
              height: '150px',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(180deg, #FFE16B 0%, #FF6AD5 58%, #C774E8 100%)',
            }}
          >
            {/* slit gaps in the lower half */}
            <span className="absolute inset-x-0 bottom-0" style={{ height: '46%', backgroundImage: 'repeating-linear-gradient(0deg, rgba(20,4,30,0.6) 0 4px, transparent 4px 9px)' }} />
          </span>
        </div>
      );
    case 'y2k': {
      // Frutiger Aero: glossy aqua bubbles + a diagonal sheen.
      const bubble = (l: string, t: string, s: string): CSSProperties => ({
        position: 'absolute',
        left: l,
        top: t,
        width: s,
        height: s,
        borderRadius: '9999px',
        background: `radial-gradient(circle at 32% 26%, rgba(255,255,255,0.95) 0 8%, ${hexA(accent, 0.85)} 42%, ${hexA(accent, 0.16)} 100%)`,
        boxShadow: 'inset 0 -8px 14px rgba(0,20,60,0.22), 0 6px 14px rgba(0,30,70,0.16)',
      });
      return (
        <div className={base}>
          <span style={bubble('8%', '12%', '86px')} />
          <span style={bubble('60%', '42%', '60px')} />
          <span style={bubble('32%', '66%', '44px')} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, transparent 42%, rgba(255,255,255,0.28) 50%, transparent 58%)' }} />
        </div>
      );
    }
    case 'acidhouse':
      // warped checkerboard + the acid smiley.
      return (
        <div className={base}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `conic-gradient(${hexA(accent, 0.16)} 0 90deg, transparent 90deg 180deg, ${hexA(accent, 0.16)} 180deg 270deg, transparent 270deg)`,
              backgroundSize: '38px 38px',
            }}
          />
          <svg className="absolute" style={{ left: '50%', top: '28%', width: '96px', height: '96px', transform: 'translateX(-50%)' }} viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="44" stroke={accent} strokeWidth="6" />
            <circle cx="36" cy="40" r="6" fill={accent} />
            <circle cx="64" cy="40" r="6" fill={accent} />
            <path d="M30 60 q20 22 40 0" stroke={accent} strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'webbrut':
      // raw HTML: dashed default border, a horizontal rule, "default blue link" underlines.
      return (
        <div className={base}>
          <span className="absolute" style={{ inset: '10px', border: `2px dashed ${hexA(fg, 0.4)}` }} />
          <span className="absolute" style={{ left: 0, right: 0, top: '34%', height: '2px', background: hexA(fg, 0.3) }} />
          <span className="absolute" style={{ left: '16px', top: '44%', width: '58%', height: '12px', borderBottom: `2px solid ${fg}` }} />
          <span className="absolute" style={{ left: '16px', top: '54%', width: '40%', height: '12px', borderBottom: `2px solid ${fg}` }} />
          <span className="absolute" style={{ right: '14%', top: '13%', width: '15px', height: '15px', border: `2px solid ${hexA(fg, 0.6)}` }} />
        </div>
      );
    case 'cyberpunk': {
      // neon noir: scanlines + a neon perspective grid + glow scan bar + HUD corners.
      const corner = (s: CSSProperties): CSSProperties => ({ position: 'absolute', width: '16px', height: '16px', boxShadow: `0 0 6px ${hexA(accent, 0.6)}`, ...s });
      return (
        <div className={base}>
          <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(0deg, ${hexA(fg, 0.07)} 0 1px, transparent 1px 3px)` }} />
          <div
            className="absolute inset-x-0 bottom-0"
            style={{
              height: '40%',
              backgroundImage: `repeating-linear-gradient(90deg, ${hexA(fg, 0.4)} 0 1px, transparent 1px 24px), repeating-linear-gradient(0deg, ${hexA(fg, 0.32)} 0 1px, transparent 1px 24px)`,
              transform: 'perspective(150px) rotateX(66deg)',
              transformOrigin: 'center bottom',
            }}
          />
          <span className="absolute" style={{ left: 0, right: 0, top: '40%', height: '2px', background: accent, boxShadow: `0 0 10px ${accent}` }} />
          <span style={corner({ left: '8px', top: '8px', borderLeft: `2px solid ${accent}`, borderTop: `2px solid ${accent}` })} />
          <span style={corner({ right: '8px', top: '8px', borderRight: `2px solid ${accent}`, borderTop: `2px solid ${accent}` })} />
          <span style={corner({ left: '8px', bottom: '8px', borderLeft: `2px solid ${accent}`, borderBottom: `2px solid ${accent}` })} />
          <span style={corner({ right: '8px', bottom: '8px', borderRight: `2px solid ${accent}`, borderBottom: `2px solid ${accent}` })} />
        </div>
      );
    }
    case 'popart':
      // Lichtenstein: Ben-Day dots + a comic sunburst.
      return (
        <div className={base}>
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${hexA(accent, 0.4)} 2.4px, transparent 2.8px)`, backgroundSize: '14px 14px' }} />
          <span className="absolute rounded-full" style={{ left: '6%', bottom: '8%', width: '86px', height: '86px', background: `repeating-conic-gradient(${hexA(accent2, 0.85)} 0 9deg, transparent 9deg 18deg)` }} />
        </div>
      );
    case 'eightbit': {
      // pixel grid + dither + a box-shadow space-invader sprite.
      const u = 6;
      const sprite = INVADER.flatMap((row, y) => [...row].map((c, x) => (c === '1' ? `${x * u}px ${y * u}px 0 ${accent}` : '')))
        .filter(Boolean)
        .join(', ');
      return (
        <div className={base}>
          <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(${hexA(accent, 0.16)} 1px, transparent 1px), linear-gradient(90deg, ${hexA(accent, 0.16)} 1px, transparent 1px)`, backgroundSize: '9px 9px' }} />
          <div className="absolute" style={{ right: 0, bottom: 0, width: '52%', height: '40%', backgroundImage: `repeating-conic-gradient(${hexA(fg, 0.16)} 0 90deg, transparent 90deg 180deg)`, backgroundSize: '8px 8px' }} />
          <span aria-hidden className="absolute" style={{ left: `calc(50% - ${(11 * u) / 2}px)`, top: '22%', width: `${u}px`, height: `${u}px`, boxShadow: sprite }} />
        </div>
      );
    }
    case 'grunge':
      // distressed: noise + irregular ink splatters + scratches + a torn strip.
      return (
        <div className={base}>
          <div className="absolute inset-0 style-noise" />
          <span className="absolute" style={{ left: '12%', top: '14%', width: '40px', height: '34px', background: hexA(accent, 0.6), borderRadius: '47% 53% 62% 38% / 55% 42% 58% 45%' }} />
          <span className="absolute" style={{ right: '14%', bottom: '18%', width: '54px', height: '46px', background: hexA(accent, 0.42), borderRadius: '63% 37% 41% 59% / 44% 62% 38% 56%' }} />
          <span className="absolute" style={{ left: '8%', top: '52%', width: '72%', height: '2px', background: hexA(fg, 0.4), transform: 'rotate(-7deg)' }} />
          <span className="absolute" style={{ left: '18%', top: '66%', width: '58%', height: '1px', background: hexA(fg, 0.3), transform: 'rotate(4deg)' }} />
          <span className="absolute left-0 right-0 top-0" style={{ height: '13px', background: 'rgba(0,0,0,0.6)', clipPath: 'polygon(0 0,100% 0,100% 50%,90% 100%,80% 45%,68% 95%,56% 40%,44% 92%,32% 45%,20% 95%,10% 48%,0 92%)' }} />
        </div>
      );
    case 'xerox':
      // photocopy grit: heavy toner speckle + faint vertical streaks + torn black tape on
      // the top/bottom EDGES (kept off-center so it never sits under the text).
      return (
        <div className={base}>
          <div className="absolute inset-0 style-noise" style={{ opacity: 0.9, mixBlendMode: 'multiply' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.5) 0.7px, transparent 1.2px)', backgroundSize: '5px 5px', mixBlendMode: 'multiply', opacity: 0.5 }} />
          <span className="absolute bottom-0 top-0" style={{ left: '18%', width: '3px', background: 'rgba(0,0,0,0.1)' }} />
          <span className="absolute bottom-0 top-0" style={{ left: '62%', width: '6px', background: 'rgba(0,0,0,0.08)' }} />
          <span className="absolute bottom-0 top-0" style={{ left: '84%', width: '2px', background: 'rgba(0,0,0,0.12)' }} />
          <span className="absolute left-0 right-0 top-0" style={{ height: '13px', background: '#0A0A0A', clipPath: 'polygon(0 0,100% 0,100% 50%,90% 100%,80% 45%,68% 95%,56% 40%,44% 92%,32% 45%,20% 95%,10% 48%,0 92%)' }} />
          <span className="absolute left-0 right-0 bottom-0" style={{ height: '13px', background: '#0A0A0A', clipPath: 'polygon(0 100%,100% 100%,100% 50%,90% 0,80% 55%,68% 5%,56% 60%,44% 8%,32% 55%,20% 5%,10% 52%,0 8%)' }} />
        </div>
      );
    case 'gradient':
    case 'solid':
    default:
      return null;
  }
}
