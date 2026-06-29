import { shaderMaterial, Sparkles, Center, useGLTF, OrbitControls, CameraControls, PerspectiveCamera} from '@react-three/drei'
import * as THREE from 'three'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import React, { useContext, useEffect, useRef, useState } from 'react'
import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'
// import * as dat from 'dat.gui';
import CameraContext from '../../CameraContext';
import gsap from 'gsap';

// const useDatGui = (material) => {
//     useEffect(() => {
//         if (material.current) {
//             const gui = new dat.GUI();
//             const colors = {
//                 colorStart: material.current.uniforms.uColorStart.value.getStyle(),
//                 colorEnd: material.current.uniforms.uColorEnd.value.getStyle(),
//             };

//             gui.addColor(colors, 'colorStart').onChange((color) => {
//                 material.current.uniforms.uColorStart.value.setStyle(color);
//             });

//             gui.addColor(colors, 'colorEnd').onChange((color) => {
//                 material.current.uniforms.uColorEnd.value.setStyle(color);
//             });

//             return () => {
//                 gui.destroy();
//             };
//         }
//     }, [material]);
// };

const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color('#bdde87'),
    uColorEnd: new THREE.Color('#159971'),
  },
  portalVertexShader,
  portalFragmentShader
);

extend({ PortalMaterial });


const PortalAnimator = () => {
  const material = useRef();

  // useDatGui(material)

  useFrame((state, delta) => {
    if (material.current) {
      material.current.uTime += delta;
    }
  });

  return <portalMaterial ref={material} />;
};

const MonitorWithClickHandler = () => {
  const { nodes } = useGLTF('/model/PortfolioRoom.glb');
  const { setCameraPosition, setHideElements, setSectionZIndex, setSectionDisplay } = useContext(CameraContext);

  const onMonitorClick = () => {
    setCameraPosition(cameraPositions[0]);
    // Use GSAP onComplete callback to ensure that these changes only happen after the animation is completed.
    gsap.delayedCall(1.5, () => {
      setHideElements(false);
      setSectionZIndex(3);
      setSectionDisplay('block');
    });
  };

  return (
    <mesh
      geometry={nodes.MonitorScreen.geometry}
      position={nodes.MonitorScreen.position}
      rotation={nodes.MonitorScreen.rotation}
      onClick={onMonitorClick}
    >
      <PortalAnimator />
    </mesh>
  );
};

const cameraPositions = [
  {x: -0.67, y: 0.58, z: -0.49},
  {x: 0.0, y: 0.65, z: 0.2},
]

const CameraUpdater = () => {
  const { camera } = useThree();
  const { cameraPosition } = useContext(CameraContext);
  const tween = useRef();
  const isFirstRun = useRef(true); // Add this ref to track the first execution

  useEffect(() => {
    if (isFirstRun.current) { 
      camera.position.set(cameraPositions[0].x, cameraPositions[0].y, cameraPositions[0].z);
      isFirstRun.current = false; 
      return;
    }

    if (tween.current) {
      tween.current.kill();
    }

    const target = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };

    tween.current = gsap.to(target, {
      x: cameraPosition.x,
      y: cameraPosition.y,
      z: cameraPosition.z,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.position.set(target.x, target.y, target.z);
        camera.updateProjectionMatrix();
      },
      onComplete: () => {
        camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
      },
    });

    return () => {
      if (tween.current) {
        tween.current.kill();
      }
    };
  }, [camera, cameraPosition]);

  return null;
};

const RoomScene = () => {

  const { nodes } = useGLTF('/model/PortfolioRoom.glb')
  const hobbyStation = new THREE.TextureLoader().load('/model/HobbyStationBake.jpg') 
  const dragon = new THREE.TextureLoader().load('/model/DragonBake.jpg')
  const workStation = new THREE.TextureLoader().load('/model/WorkStationBake.jpg')
  const musicStation = new THREE.TextureLoader().load('/model/MusicStationBake.jpg')
  const portfolioImages = new THREE.TextureLoader().load('/model/PortfolioImagesBake.jpg')
  const structureAndDeco = new THREE.TextureLoader().load('/model/StructureAndDeco.jpg')

  return (
    <Canvas
      camera={{ fov: 45, near: 0.01, far: 100, position: [cameraPositions[0].x, cameraPositions[0].y, cameraPositions[0].z] }}
      style={{ position: 'absolute', top: '300vh', left: 0, width: '100%', height: '100%', zIndex: 2 }}
    >
      <color args={['#061519']} attach="background" />
      <OrbitControls 
        makeDefault 
        target={new THREE.Vector3(-0.87, 0.55, -0.49)} 
        enablePan={false} 
        enableDamping={true} 
        maxDistance={5} 
      />
      <CameraUpdater />
      <MonitorWithClickHandler />

      <mesh geometry={nodes.PottedPlant.geometry} position={nodes.PottedPlant.position} rotation={nodes.PottedPlant.rotation}>
        <meshBasicMaterial map={hobbyStation} map-flipY={false} />
      </mesh>
      <mesh geometry={nodes.HobbyStation.geometry} position={nodes.HobbyStation.position} rotation={nodes.HobbyStation.rotation}>
        <meshBasicMaterial map={hobbyStation} map-flipY={false} />
      </mesh>

      <mesh geometry={nodes.StructureAndDeco.geometry} position={nodes.StructureAndDeco.position} rotation={nodes.StructureAndDeco.rotation}>
        <meshBasicMaterial map={structureAndDeco} map-flipY={false} />
      </mesh>

      <mesh geometry={nodes.GreenDino.geometry} position={nodes.GreenDino.position} rotation={nodes.GreenDino.rotation}>
        <meshBasicMaterial map={dragon} map-flipY={false} />
      </mesh>

      <mesh geometry={nodes.MusicStation.geometry} position={nodes.MusicStation.position} rotation={nodes.MusicStation.rotation}>
        <meshBasicMaterial map={musicStation} map-flipY={false} />
      </mesh>

      <mesh geometry={nodes.WorkStation.geometry} position={nodes.WorkStation.position} rotation={nodes.WorkStation.rotation}>
        <meshBasicMaterial map={workStation} map-flipY={false} />
      </mesh>
      <mesh geometry={nodes.SmallPlant001.geometry} position={nodes.SmallPlant001.position} rotation={nodes.SmallPlant001.rotation}>
        <meshBasicMaterial map={workStation} map-flipY={false} />
      </mesh>
      <mesh geometry={nodes.Speaker1001.geometry} position={nodes.Speaker1001.position} rotation={nodes.Speaker1001.rotation}>
        <meshBasicMaterial map={workStation} map-flipY={false} />
      </mesh>
      <mesh geometry={nodes.Speaker2001.geometry} position={nodes.Speaker2001.position} rotation={nodes.Speaker2001.rotation}>
        <meshBasicMaterial map={workStation} map-flipY={false} />
      </mesh>
      <mesh geometry={nodes.Speaker3001.geometry} position={nodes.Speaker3001.position} rotation={nodes.Speaker3001.rotation}>
        <meshBasicMaterial map={workStation} map-flipY={false} />
      </mesh>
      <mesh geometry={nodes.Speaker4001.geometry} position={nodes.Speaker4001.position} rotation={nodes.Speaker4001.rotation}>
        <meshBasicMaterial map={workStation} map-flipY={false} />
      </mesh>
      <mesh geometry={nodes.Mouse001.geometry} position={nodes.Mouse001.position} rotation={nodes.Mouse001.rotation}>
        <meshBasicMaterial map={workStation} map-flipY={false} />
      </mesh>

      <mesh geometry={nodes.Posters.geometry} position={nodes.Posters.position} rotation={nodes.Posters.rotation}>
        <meshBasicMaterial map={portfolioImages} map-flipY={false} />
      </mesh>
      <mesh geometry={nodes.Portraits.geometry} position={nodes.Portraits.position} rotation={nodes.Portraits.rotation}>
        <meshBasicMaterial map={portfolioImages} map-flipY={false} />
      </mesh>

      <mesh geometry={nodes.Gradient1.geometry} position={nodes.Gradient1.position} rotation={nodes.Gradient1.rotation}>
        <meshBasicMaterial color={0x3DB3CE} />
      </mesh>
      <mesh geometry={nodes.Gradient2.geometry} position={nodes.Gradient2.position} rotation={nodes.Gradient2.rotation}>
        <meshBasicMaterial color={0x51ABAA} />
      </mesh>
      <mesh geometry={nodes.Gradient3.geometry} position={nodes.Gradient3.position} rotation={nodes.Gradient3.rotation}>
        <meshBasicMaterial color={0x78D968} />
      </mesh>
      <mesh geometry={nodes.Gradient4.geometry} position={nodes.Gradient4.position} rotation={nodes.Gradient4.rotation}>
        <meshBasicMaterial color={0xE3F27C} />
      </mesh>
      <mesh geometry={nodes.Gradient5.geometry} position={nodes.Gradient5.position} rotation={nodes.Gradient5.rotation}>
        <meshBasicMaterial color={0xFFD460} />
      </mesh>

      <Sparkles
        size={6}
        scale={[4, 2, 4]}
        position-y={1}
        speed={1}
        count={30} 
      />

    </Canvas>
  )
}

export default React.memo(RoomScene)