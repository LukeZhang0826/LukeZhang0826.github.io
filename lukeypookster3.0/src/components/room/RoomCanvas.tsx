import { Suspense, useEffect, useMemo, useRef, useState, type ElementRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { ROOM_VERT, makePortalMaterial } from '../../lib/portalShader';
import { usePageVisible } from '../../lib/usePageVisible';

/**
 * Section 06 - "The Room" stage.
 *
 *  idle  (entered=false): only the portal-fire MONITOR renders - a glowing screen in
 *        the void - with the camera parked right in front of it. No textures loaded.
 *  enter (entered=true) : the rest of the room (baked-texture props) streams in; once
 *        ready the camera zooms OUT to reveal the full room.
 *  leave (leaving=true) : camera zooms back onto the monitor, then onExited fires.
 *
 * Camera coordinates are the proven values from the 2.0 site (the monitor faces +X, so
 * the camera must sit in front of it on the same Z - guessing the Z is what hid it).
 */

const URL = '/model/PortfolioRoom.glb';

// the baked-lighting textures. Converted from ~23MB of JPGs to WebP q90 (same resolution,
// ~2.3MB total) to cut load + GPU-upload cost. Keyed to the BAKED groups below.
const BAKES = {
  hobby: '/model/HobbyStationBake.webp',
  dragon: '/model/DragonBake.webp',
  work: '/model/WorkStationBake.webp',
  music: '/model/MusicStationBake.webp',
  portfolio: '/model/PortfolioImagesBake.webp',
  structure: '/model/StructureAndDeco.webp',
};

const TARGET = new THREE.Vector3(-0.87, 0.55, -0.49); // the monitor
const MONITOR = new THREE.Vector3(-0.69, 0.57, -0.49); // in front of the screen
const OVERVIEW = new THREE.Vector3(0, 0.65, 0.2); // whole room

// camera-move tuning
const PULL_SPEED = 3; // zoom-OUT to the overview (deliberate reveal)
const LEAVE_SPEED = 3.4; // zoom-IN back onto the monitor
const HOLD_MS = 600; // keep the loaded room framed before pulling back, so it never
//                      zooms out over an empty/un-painted scene

// orbit clamp - confine "looking around" to the visible front slice of the room
// (azimuth/polar of OVERVIEW measured about TARGET; a narrow window around it).
const ORBIT_AZ = 0.899; // azimuth of OVERVIEW about TARGET
const ORBIT_AZ_RANGE = 0.8; // ± horizontal swing (~46° each way → ~90° total, an octant)
const ORBIT_POLAR_MIN = 0.92; // how far up you can tilt
const ORBIT_POLAR_MAX = 1.62; // how far down (kept above the floor)

const BAKED: [string, string][] = [
  ['PottedPlant', 'hobby'],
  ['HobbyStation', 'hobby'],
  ['StructureAndDeco', 'structure'],
  ['GreenDino', 'dragon'],
  ['MusicStation', 'music'],
  ['WorkStation', 'work'],
  ['SmallPlant001', 'work'],
  ['Speaker1001', 'work'],
  ['Speaker2001', 'work'],
  ['Speaker3001', 'work'],
  ['Speaker4001', 'work'],
  ['Mouse001', 'work'],
  ['Posters', 'portfolio'],
  ['Portraits', 'portfolio'],
];

const GRADIENTS: [string, number][] = [
  ['Gradient1', 0x3db3ce],
  ['Gradient2', 0x51abaa],
  ['Gradient3', 0x78d968],
  ['Gradient4', 0xe3f27c],
  ['Gradient5', 0xffd460],
];

/** Just the monitor screen - geometry only, renders the moment the GLB loads.
 *  Once inside the room, clicking it leaves (same as the Leave button). */
function Monitor({
  material,
  entered,
  onLeave,
}: {
  material: THREE.ShaderMaterial;
  entered: boolean;
  onLeave: () => void;
}) {
  const { nodes } = useGLTF(URL) as unknown as { nodes: Record<string, THREE.Mesh> };
  const m = nodes.MonitorScreen;
  if (!m) return null;
  return (
    <mesh
      geometry={m.geometry}
      position={m.position}
      rotation={m.rotation}
      material={material}
      onClick={(e) => {
        if (!entered) return;
        e.stopPropagation();
        onLeave();
      }}
      onPointerOver={(e) => {
        if (!entered) return;
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = '';
      }}
    />
  );
}

/** The textured room - suspends until the baked JPGs load. Only mounted on Play. */
function RoomProps({ onReady }: { onReady: () => void }) {
  const { nodes } = useGLTF(URL) as unknown as { nodes: Record<string, THREE.Mesh> };
  const maps = useTexture(BAKES) as Record<string, THREE.Texture>;

  useEffect(() => {
    onReady();
  }, [onReady]);

  return (
    <group>
      {BAKED.map(([name, key]) => {
        const node = nodes[name];
        if (!node) return null;
        return (
          <mesh key={name} geometry={node.geometry} position={node.position} rotation={node.rotation}>
            <meshBasicMaterial map={maps[key]} map-flipY={false} map-colorSpace={THREE.SRGBColorSpace} />
          </mesh>
        );
      })}
      {GRADIENTS.map(([name, color]) => {
        const node = nodes[name];
        if (!node) return null;
        return (
          <mesh key={name} geometry={node.geometry} position={node.position} rotation={node.rotation}>
            <meshBasicMaterial color={color} />
          </mesh>
        );
      })}
      <Sparkles size={6} scale={[4, 2, 4]} position-y={1} speed={1} count={30} />
    </group>
  );
}

function Rig({
  entered,
  ready,
  leaving,
  onExited,
}: {
  entered: boolean;
  ready: boolean;
  leaving: boolean;
  onExited: () => void;
}) {
  const { camera } = useThree();
  const controls = useRef<ElementRef<typeof OrbitControls>>(null);
  const [arrived, setArrived] = useState(false);
  const readyAt = useRef<number | null>(null);

  useEffect(() => {
    camera.position.copy(MONITOR);
    camera.lookAt(TARGET);
  }, [camera]);

  useEffect(() => {
    if (!entered) {
      setArrived(false);
      readyAt.current = null;
    }
  }, [entered]);

  // stamp the moment the room finished loading so we can hold before zooming out
  useEffect(() => {
    if (ready && readyAt.current === null) readyAt.current = performance.now();
  }, [ready]);

  useFrame((_, delta) => {
    if (entered && arrived && !leaving) return; // OrbitControls owns the camera now

    // only pull back once the room is loaded AND has been framed for HOLD_MS, so the
    // reveal never plays over a still-loading scene
    const settled =
      ready && readyAt.current !== null && performance.now() - readyAt.current > HOLD_MS;
    const pullBack = entered && settled && !leaving;
    const goal = pullBack ? OVERVIEW : MONITOR;

    // frame-rate-independent exponential approach (consistent on 60Hz vs 144Hz)
    const alpha = 1 - Math.exp(-(leaving ? LEAVE_SPEED : PULL_SPEED) * delta);
    camera.position.lerp(goal, alpha);
    camera.lookAt(TARGET);

    if (pullBack && !arrived && camera.position.distanceTo(OVERVIEW) < 0.02) {
      camera.position.copy(OVERVIEW); // snap exact, then hand off cleanly (no pop)
      camera.lookAt(TARGET);
      controls.current?.update();
      setArrived(true);
    }
    if (leaving && camera.position.distanceTo(MONITOR) < 0.03) {
      camera.position.copy(MONITOR);
      camera.lookAt(TARGET);
      onExited();
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enabled={entered && arrived && !leaving}
      target={TARGET}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      maxDistance={4}
      minDistance={0.5}
      // clamp the orbit to the visible front slice once handed off; left wide open
      // during the scripted intro/outro so those moves are never snapped into range
      minAzimuthAngle={arrived ? ORBIT_AZ - ORBIT_AZ_RANGE : -Infinity}
      maxAzimuthAngle={arrived ? ORBIT_AZ + ORBIT_AZ_RANGE : Infinity}
      minPolarAngle={arrived ? ORBIT_POLAR_MIN : 0}
      maxPolarAngle={arrived ? ORBIT_POLAR_MAX : Math.PI / 1.9}
    />
  );
}

function Scene({
  entered,
  leaving,
  onExited,
  onMonitorClick,
  fireOn,
  onFireReady,
}: {
  entered: boolean;
  leaving: boolean;
  onExited: () => void;
  onMonitorClick: () => void;
  fireOn: boolean;
  onFireReady: () => void;
}) {
  const [ready, setReady] = useState(false);
  const fired = useRef(false);
  const portalMat = useMemo(() => makePortalMaterial(ROOM_VERT), []);
  useFrame((_, delta) => {
    portalMat.uniforms.uTime.value += delta;
    // slowly bring the fire alive the first time the room is seen (~4s ramp)
    if (fireOn) {
      const r = Math.min(1, portalMat.uniforms.uReveal.value + delta * 0.28);
      portalMat.uniforms.uReveal.value = r;
      if (r >= 0.85 && !fired.current) {
        fired.current = true;
        onFireReady(); // fire is mostly alive → let the Play button appear
      }
    }
  });

  useEffect(() => {
    if (!entered) setReady(false);
  }, [entered]);

  return (
    <>
      <Monitor material={portalMat} entered={entered && !leaving} onLeave={onMonitorClick} />
      {entered && (
        <Suspense fallback={null}>
          <RoomProps onReady={() => setReady(true)} />
        </Suspense>
      )}
      <Rig entered={entered} ready={ready} leaving={leaving} onExited={onExited} />
    </>
  );
}

export default function RoomCanvas({
  entered,
  leaving,
  onExited,
  onMonitorClick,
  fireOn,
  onFireReady,
}: {
  entered: boolean;
  leaving: boolean;
  onExited: () => void;
  onMonitorClick: () => void;
  fireOn: boolean;
  onFireReady: () => void;
}) {
  // pause the render loop when the room is scrolled off-screen. The canvas mounts ~2200px
  // early and stays mounted, so without this it would keep rendering the room (portal noise
  // + full scene after Play) every frame for the rest of the page. Stay active while
  // `entered` (Play locks the section in view) as a guard for the zoom sequence.
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const visible = usePageVisible(); // also pause when the tab is backgrounded
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        className="!absolute inset-0"
        frameloop={(inView || entered) && visible ? 'always' : 'never'}
        dpr={[1, 1.5]} /* cap retina DPR for cheaper rendering */
        // NoToneMapping so the WebGL bg/monitor render #061519 as true sRGB - matching the
        // CSS section bg exactly (ACES was darkening it, causing the load color flip). The
        // room is baked (unlit meshBasicMaterial) so it wants no tone mapping anyway.
        gl={{ toneMapping: THREE.NoToneMapping }}
        camera={{ fov: 45, near: 0.01, far: 100, position: [MONITOR.x, MONITOR.y, MONITOR.z] }}
      >
        <color args={['#000000']} attach="background" />
        <Scene
          entered={entered}
          leaving={leaving}
          onExited={onExited}
          onMonitorClick={onMonitorClick}
          fireOn={fireOn}
          onFireReady={onFireReady}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload(URL);
// warm the baked textures as soon as this (lazy) module loads - which happens while the
// room is still ~2200px away - so pressing Play doesn't hitch on a 28MB texture decode
// (that hitch froze the fire mid-animation, then jumped a frame before the camera moved).
Object.values(BAKES).forEach((u) => useTexture.preload(u));
