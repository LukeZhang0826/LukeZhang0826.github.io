import { lazy, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react';

/**
 * Hero style registry. Section 00 can render in one of several clashing art-directed
 * "worlds" (one per design genre) that the user randomizes between - the landing itself
 * becomes a showcase of the "maximum clash" thesis. Each style is a self-contained
 * component; add a genre = add one entry here.
 *
 * Only the ART DIRECTION differs per style (font, colors, background, intro animation).
 * The CONTENT below is shared so every style says the same thing.
 */
export interface HeroStyleProps {
  /** scroll the user into the next section (wired to each style's Enter CTA) */
  onEnter: () => void;
  /** the shared style label + shuffle control; each style places it in its own world */
  control: ReactNode;
}

/** Colors for the shared style control so it always reads as part of the active world. */
export interface HeroControlTheme {
  text: string;
  accent: string;
  bg: string;
  border: string;
}

export interface HeroStyle {
  id: string;
  label: string; // shown in the bottom style control, e.g. "Vaporwave"
  control: HeroControlTheme; // themes the shuffle widget to match this world
  component: LazyExoticComponent<ComponentType<HeroStyleProps>>;
}

export const HERO_STYLES: HeroStyle[] = [
  {
    id: 'vaporwave',
    label: 'Vaporwave',
    control: { text: '#2DE2E6', accent: '#FF49C7', bg: 'rgba(11,5,24,0.85)', border: '#FF49C7' },
    component: lazy(() => import('./styles/VaporwaveHero')),
  },
  // future genres slot in here (e.g. heavy-typography brutalist - home of the glitch
  // treatment lifted off the vaporwave landing).
];

/* ---- shared hero content (every style renders these) ---- */
export const HERO_NAME = { first: 'LUKE', last: 'ZHANG' };
export const HERO_STATUS = 'Available for work · currently @ BitGo';
export const HERO_ROLE = 'Software Engineer / Creative Developer / Artist';
export const HERO_DISCIPLINES = [
  'DEVELOPMENT',
  '3D DESIGN',
  'GRAPHIC DESIGN',
  'MUSIC',
  'TYPOGRAPHY',
  'ANIMATION',
  'PRODUCTION',
];
