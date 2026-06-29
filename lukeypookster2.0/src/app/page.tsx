'use client'
import Landing from './components/landing/Landing';
import SideBar from './components/sideBar/SideBar';
import About from './components/about/About';
import Info from './components/info/Info';
import { useEffect, useState } from 'react';
import End from './components/end/End';
import { IconHoverProvider } from './IconHoverContext';
import CameraContext from './CameraContext';
import LoadingScreen from './components/loading/Loading';
import RoomScene from './components/roomScene/RoomScene';

export default function Home() {
  const [cameraPosition, setCameraPosition] = useState({x: 0, y: 0, z: 0});
  const [hideElements, setHideElements] = useState(false);
  const [sectionZIndex, setSectionZIndex] = useState(3);
  const [sectionDisplay, setSectionDisplay] = useState('block');

  useEffect(() => {
    const preventScroll = (e: WheelEvent) => e.preventDefault();
    
    window.addEventListener('wheel', preventScroll, { passive: false });

    return () => {
      window.removeEventListener('wheel', preventScroll);
    };
  }, []);
  return (
    <main>
      <IconHoverProvider>
        <SideBar />
        <Landing />
        <About />
        <Info />
        <CameraContext.Provider 
          value={{
            cameraPosition,
            setCameraPosition,
            hideElements,
            setHideElements,
            sectionZIndex,
            setSectionZIndex,
            sectionDisplay,
            setSectionDisplay
          }}
        >
          <RoomScene />
          <End />
        </CameraContext.Provider>
      </IconHoverProvider>
    </main>
  )
}