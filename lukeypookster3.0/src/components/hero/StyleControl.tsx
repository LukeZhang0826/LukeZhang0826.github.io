import type { HeroControlTheme } from './heroStyles';

/**
 * Shared style control for Section 00: a pulsing dice that randomizes the hero style, the
 * accent star, and the active style's name (read downward, letters upright). Themed per
 * active style (via `theme`) so it always reads as part of that world.
 */
export default function StyleControl({
  label,
  theme,
  onShuffle,
}: {
  label: string;
  theme: HeroControlTheme;
  onShuffle: () => void;
}) {
  return (
    <div
      className="flex select-none flex-col items-center gap-2.5 border-2 px-1.5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.25em] backdrop-blur"
      style={{ borderColor: theme.border, background: theme.bg, color: theme.text }}
    >
      {/* dice scales big/small to signal it's clickable. w-full + text-center so the emoji
          sits on the same vertical axis as the letters below (it was off by its glyph bearing) */}
      <button
        type="button"
        onClick={onShuffle}
        aria-label="Randomize hero style"
        className="dice-pulse w-full text-center text-lg leading-none tracking-normal"
      >
        🎲
      </button>
      {/* star between the dice and the name; name reads top-to-bottom, letters upright */}
      <span className="flex items-center" style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>
        <span style={{ color: theme.accent }}>✦</span> {label}
      </span>
    </div>
  );
}
