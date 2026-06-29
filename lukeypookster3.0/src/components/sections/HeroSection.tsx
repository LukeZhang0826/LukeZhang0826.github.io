import { Suspense, useCallback, useState } from 'react';
import { useSectionSpy } from '../../lib/section';
import { scrollToY } from '../../lib/useLenis';
import { HERO_STYLES } from '../hero/heroStyles';
import StyleControl from '../hero/StyleControl';

/**
 * Section 00 - "The Index". Shell that renders ONE of several clashing, art-directed
 * hero "worlds" (one per design genre) and lets the user randomize between them. A
 * random style is chosen on each load; the bottom control labels the active style and
 * reshuffles. Each style owns its own font, palette, background, and intro animation -
 * the landing itself demonstrates the "maximum clash" thesis.
 */
export default function HeroSection() {
  const ref = useSectionSpy<HTMLElement>('00', 'The Index');

  const [idx, setIdx] = useState(() => Math.floor(Math.random() * HERO_STYLES.length));
  // bumped on every shuffle so the style component remounts and replays its intro,
  // even when there's only one style to "randomize" to
  const [nonce, setNonce] = useState(0);

  const shuffle = useCallback(() => {
    setIdx((cur) => {
      if (HERO_STYLES.length <= 1) return cur;
      let next = cur;
      while (next === cur) next = Math.floor(Math.random() * HERO_STYLES.length);
      return next;
    });
    setNonce((n) => n + 1);
  }, []);

  const onEnter = useCallback(() => scrollToY(window.innerHeight), []);

  const style = HERO_STYLES[idx];
  const StyleComponent = style.component;

  return (
    <section ref={ref} className="relative h-[100svh] w-full select-none overflow-hidden bg-black">
      <Suspense fallback={null}>
        <StyleComponent
          key={`${style.id}-${nonce}`}
          onEnter={onEnter}
          control={<StyleControl label={style.label} theme={style.control} onShuffle={shuffle} />}
        />
      </Suspense>
    </section>
  );
}
