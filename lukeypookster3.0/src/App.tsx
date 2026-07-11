import { lazy, useState } from 'react';
import { useLenis } from './lib/useLenis';
import { SectionProvider } from './lib/section';
import HUD from './components/hud/HUD';
import CustomCursor from './components/cursor/CustomCursor';
import LoadingScreen from './components/loading/LoadingScreen';
import { enterHero } from './lib/heroGate';
import HeroSection from './components/sections/HeroSection';
import RoomSection from './components/sections/RoomSection';
import LazySection from './components/util/LazySection';

// below-the-fold sections are code-split + mounted on approach (LazySection) so their JS
// stays out of the initial bundle. Hero is eager (landing); Room is eager because it
// already lazy-loads its heavy canvas with its own careful preload timing.
const DevelopmentSection = lazy(() => import('./components/sections/DevelopmentSection'));
const AnimationSection = lazy(() => import('./components/sections/AnimationSection'));
const DesignSection = lazy(() => import('./components/sections/DesignSection'));
const ArchitectureSection = lazy(() => import('./components/sections/ArchitectureSection'));
const MusicSection = lazy(() => import('./components/sections/MusicSection'));

// loading curtain enabled: hero canvas warms up behind it, Start lifts the curtain.
const SHOW_LOADER = true;
if (!SHOW_LOADER) enterHero();

export default function App() {
  useLenis();

  // pre-reveal loading curtain: revealed = Start clicked (hero intro replays via
  // introNonce), gone = curtain finished lifting (loader unmounts + scroll unlocks)
  const [revealed, setRevealed] = useState(!SHOW_LOADER);
  const [gone, setGone] = useState(!SHOW_LOADER);

  return (
    <SectionProvider>
      <main className="grain relative w-full">
        {/* native cursor while the loader sits idle; the moment Start is pressed (revealed) the hero
            cursor takes over immediately, riding along as the curtain lifts */}
        {revealed && <CustomCursor />}
        <HUD />
        {!gone && (
          <LoadingScreen
            onStart={() => {
              setRevealed(true);
              enterHero(); // resume the hero canvas the instant Start is pressed
            }}
            onGone={() => setGone(true)}
          />
        )}
        <HeroSection introNonce={revealed ? 1 : 0} />
        <LazySection>
          <DevelopmentSection />
        </LazySection>
        <LazySection>
          <AnimationSection />
        </LazySection>
        <LazySection>
          <DesignSection />
        </LazySection>
        <LazySection>
          <ArchitectureSection />
        </LazySection>
        <LazySection>
          <MusicSection />
        </LazySection>
        <RoomSection />
      </main>
    </SectionProvider>
  );
}
