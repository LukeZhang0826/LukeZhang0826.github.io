import { useEffect, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>*';

/**
 * Decode-scramble a string: random glyphs that resolve left-to-right into `text` over
 * `duration` ms (after an optional `delay`). Freezes to the final text under
 * prefers-reduced-motion. Keep this inside a small leaf component so only it re-renders.
 */
export function useScramble(text: string, duration = 900, delay = 0): string {
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOut(text);
      return;
    }
    let raf = 0;
    let start = 0;
    const scramble = (revealed: number) => {
      let s = '';
      for (let i = 0; i < text.length; i++) {
        s += text[i] === ' ' ? ' ' : i < revealed ? text[i] : CHARS[(Math.random() * CHARS.length) | 0];
      }
      return s;
    };
    const run = (t: number) => {
      if (!start) start = t;
      const elapsed = t - start - delay;
      if (elapsed < 0) {
        setOut(scramble(0));
        raf = requestAnimationFrame(run);
        return;
      }
      const p = Math.min(1, elapsed / duration);
      setOut(scramble(Math.floor(p * text.length)));
      if (p < 1) raf = requestAnimationFrame(run);
      else setOut(text);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [text, duration, delay]);

  return out;
}
