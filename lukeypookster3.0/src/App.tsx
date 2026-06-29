import { lazy } from 'react';
import { useLenis } from './lib/useLenis';
import { SectionProvider } from './lib/section';
import HUD from './components/hud/HUD';
import CustomCursor from './components/cursor/CustomCursor';
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

export default function App() {
  useLenis();

  return (
    <SectionProvider>
      <main className="grain relative w-full">
        <CustomCursor />
        <HUD />
        <HeroSection />
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
