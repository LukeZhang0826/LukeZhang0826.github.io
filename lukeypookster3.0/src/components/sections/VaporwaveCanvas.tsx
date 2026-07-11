import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePageVisible } from '../../lib/usePageVisible';
import { useHeroEntered } from '../../lib/heroGate';

/**
 * Section 00 backdrop: a WebGL vaporwave / outrun scene - an infinite magenta grid road
 * scrolling toward you under a starry nebula sky. (The slitted retro sun + its floor
 * reflection were CUT 2026-07-05: the statue poster is the centerpiece now and the sun
 * fought it.) Lazy-loaded so three.js stays out of the hero's critical path.
 *
 * Most of the look lives in a few constants up top - easy to tune the framing.
 */

/* shared noise + starfield helpers (used by the sky AND its floor reflection) */
const NOISE_GLSL = /* glsl */ `
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 3; i++) { v += a * vnoise(p); p = p * 2.0 + 7.0; a *= 0.5; } // 3 octaves: cheaper, near-identical look
    return v;
  }
  // one twinkling star per sparse cell
  float starLayer(vec2 uv, float t) {
    vec2 cell = floor(uv);
    vec2 f = fract(uv) - 0.5;
    float r = hash21(cell);
    float present = step(0.92, r); // ~8% of cells hold a star
    float glow = smoothstep(0.16, 0.0, length(f)) * present;
    float twinkle = 0.5 + 0.5 * sin(t * 2.5 + r * 50.0);
    return glow * twinkle;
  }
  // same, but corrected for grazing-angle foreshortening so the dot stays ROUND on a
  // tilted floor instead of squashing into an oval (fwidth = screen footprint per axis).
  // small + crisp so they read as sparkles, not blobs.
  float starRoundFloor(vec2 uv, float t) {
    vec2 cell = floor(uv);
    vec2 f = fract(uv) - 0.5;
    vec2 g = fwidth(uv);
    float aspect = clamp(g.x / max(g.y, 1e-5), 0.18, 1.0); // stretch the compressed axis (clamped)
    f.y *= aspect;
    float r = hash21(cell);
    float present = step(0.94, r);                          // sparse
    float glow = smoothstep(0.09, 0.0, length(f)) * present; // small, crisp dot
    float twinkle = 0.5 + 0.5 * sin(t * 2.5 + r * 50.0);
    return glow * twinkle;
  }
`;

/* ---- neon grid road ---- */
const GRID_VERT = /* glsl */ `
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const GRID_FRAG = /* glsl */ `
  varying vec2 vUv;
  varying float vDepth;
  uniform float uTime;
  void main() {
    vec2 uv = vec2(vUv.x * 90.0, vUv.y * 220.0 + uTime * 4.0);
    vec2 f = abs(fract(uv) - 0.5);
    vec2 d = f / fwidth(uv);
    float line = min(d.x, d.y);
    float a = 1.0 - clamp(line - 1.4, 0.0, 1.0); // a touch thinner
    float fade = clamp(1.0 - vDepth / 250.0, 0.0, 1.0); // reach the horizon line
    a *= fade;
    if (a < 0.02) discard;
    gl_FragColor = vec4(vec3(1.0, 0.30, 0.82) * a, a); // pink
  }
`;

function Grid() {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, -70]} renderOrder={2}>
      <planeGeometry args={[400, 320]} />
      <shaderMaterial
        ref={mat}
        vertexShader={GRID_VERT}
        fragmentShader={GRID_FRAG}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ---- floor reflection: a faded, mirror-ish wash of the sky (nebula + stars) on the
   ground plane, concentrated near the horizon and dying out toward the viewer, like a
   wet reflective surface. Drawn under the grid (renderOrder 1 < grid's 2). ---- */
const FLOOR_FRAG = /* glsl */ `
  varying vec2 vUv;
  varying float vDepth;
  uniform float uTime;
  ${NOISE_GLSL}
  void main() {
    float fade = clamp(1.0 - vDepth / 250.0, 0.0, 1.0); // 1 at the horizon, 0 near camera
    vec2 ruv = vec2(vUv.x * 1.74, vUv.y * 2.2);
    vec2 np = ruv * 2.6 + vec2(uTime * 0.015, uTime * 0.006);
    float neb = smoothstep(0.32, 0.85, fbm(np));
    vec3 nebCol = mix(vec3(1.0, 0.30, 0.70), vec3(0.18, 0.89, 0.90), fbm(np + 4.0));
    vec3 col = nebCol * neb;
    float stars = starRoundFloor(ruv * 95.0, uTime) + starRoundFloor(ruv * 150.0 + 19.0, uTime) * 0.6;
    col += vec3(0.9, 0.85, 1.0) * stars;
    col *= fade * 0.5; // dim + concentrate near the horizon (more faded than the real sky)
    gl_FragColor = vec4(col, 1.0);
  }
`;

function FloorReflection() {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, -70]} renderOrder={1}>
      <planeGeometry args={[400, 320]} />
      <shaderMaterial
        ref={mat}
        vertexShader={GRID_VERT}
        fragmentShader={FLOOR_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

/* ---- world-space vertex shader: passes world Y so the fragment can clip hard at the
   horizon plane (y=0). Kept from the removed retro sun - the sky still uses it. ---- */
const SUN_VERT = /* glsl */ `
  varying vec2 vUv;
  varying float vWorldY;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldY = wp.y;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

/* ---- darker-purple sky with a HARD horizon (clipped at world y=0) ----
   plus a procedural starfield, drifting nebula haze, and a neon mountain ridge so the
   upper sky isn't bare. All baked into this one shader (no extra meshes). */
const SKY_FRAG = /* glsl */ `
  varying vec2 vUv;
  varying float vWorldY;
  uniform float uTime;
  ${NOISE_GLSL}
  void main() {
    if (vWorldY < 0.0) discard; // hard stop at the horizon line - no sky below it
    float h = vWorldY;
    vec3 hor = vec3(0.34, 0.08, 0.38);
    vec3 mid = vec3(0.15, 0.04, 0.27);
    vec3 dark = vec3(0.025, 0.01, 0.06);
    vec3 col = h < 70.0 ? mix(hor, mid, h / 70.0) : mix(mid, dark, clamp((h - 70.0) / 170.0, 0.0, 1.0));

    vec2 suv = vec2(vUv.x * 1.74, vUv.y); // de-stretch the wide (800x460) plane

    // nebula: drifting pink<->cyan haze, strongest up high (covers more sky + brighter)
    vec2 np = suv * 2.6 + vec2(uTime * 0.015, uTime * 0.006);
    float neb = smoothstep(0.32, 0.85, fbm(np));
    vec3 nebCol = mix(vec3(1.0, 0.30, 0.70), vec3(0.18, 0.89, 0.90), fbm(np + 4.0));
    col += nebCol * neb * smoothstep(2.0, 120.0, h) * 0.9;

    // starfield: two layers, denser up high, fading toward the horizon
    float stars = starLayer(suv * 95.0, uTime) + starLayer(suv * 150.0 + 19.0, uTime) * 0.6;
    col += vec3(1.0, 0.95, 1.0) * stars * smoothstep(6.0, 55.0, h);

    col += vec3(1.0, 0.30, 0.70) * smoothstep(2.5, 0.0, h) * 0.8; // glowing horizon line
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Sky() {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <mesh position={[0, 40, -230]}>
      <planeGeometry args={[800, 460]} />
      <shaderMaterial
        ref={mat}
        vertexShader={SUN_VERT}
        fragmentShader={SKY_FRAG}
        uniforms={uniforms}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}

export default function VaporwaveCanvas() {
  // pause the render loop entirely when the hero is scrolled off-screen (no wasted GPU
  // work on shader passes the user can't see)
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const visible = usePageVisible(); // also pause when the tab is backgrounded
  const entered = useHeroEntered(); // false while the loading curtain is still down
  // while the loader is up the canvas is hidden behind it: render just long enough to warm
  // up + upload shaders, then park the frameloop until the visitor actually enters
  const [warm, setWarm] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setWarm(false), 700);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = active && visible && (entered || warm);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        frameloop={running ? 'always' : 'never'}
        dpr={[1, 1.5]} /* cap retina DPR: per-pixel fbm cost scales with dpr^2 (~26% lighter than 1.75) */
        gl={{ antialias: true }}
        camera={{ position: [0, 6, 22], fov: 55, near: 0.1, far: 500 }}
        onCreated={({ camera }) => camera.lookAt(0, 3, -80)}
      >
        <color attach="background" args={['#050109']} />
        <Sky />
        <FloorReflection />
        <Grid />
      </Canvas>

      {/* halftone print texture over the scene */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(5,1,9,0.7) 1px, transparent 1.5px)',
          backgroundSize: '5px 5px',
          mixBlendMode: 'multiply',
          opacity: 0.5,
        }}
      />
      {/* film grain to dither the gradients (kills the visible banding) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          mixBlendMode: 'overlay',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
