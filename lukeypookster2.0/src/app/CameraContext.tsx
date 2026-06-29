import React from 'react';

const CameraContext = React.createContext({
    cameraPosition: { x: 0, y: 0, z: 0 },
    setCameraPosition: (position: any) => {},
    hideElements: false,
    setHideElements: (boolean: any) => {},
    sectionZIndex: 3,
    setSectionZIndex: (int: any) => {},
    sectionDisplay: 'block',
    setSectionDisplay: (string: any) => {}
});

export default CameraContext;