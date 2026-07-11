import{r as n,j as r}from"./motion-BxvpI9LN.js";import{S as M,D as T,a as x,C as j,V as P,N as O,u as S,b as z,d as R,e as B,f as I,g as D,O as C}from"./three-MouWZUKs.js";import{u as G}from"./usePageVisible-C8NG6ISJ.js";const U=`
  varying vec2 vUv;
  void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vUv = uv;
  }
`,L=`
  uniform float uTime;
  uniform float uReveal; // 0 = unlit (background color), 1 = full fire (ramps up on first visit)
  uniform vec3 uColorStart;
  uniform vec3 uColorEnd;
  uniform vec3 uBackground; // the room/section background - the screen's "off" color (no flip on load)
  varying vec2 vUv;

  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  vec3 fade(vec3 t){ return t*t*t*(t*(t*6.0-15.0)+10.0); }

  float cnoise(vec3 P){
    vec3 Pi0 = floor(P); vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod(Pi0, 289.0); Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz; vec4 iz1 = Pi1.zzzz;
    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0); vec4 ixy1 = permute(ixy + iz1);
    vec4 gx0 = ixy0 / 7.0; vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5; gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0); vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    vec4 gx1 = ixy1 / 7.0; vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5; gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1); vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x); vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z); vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x); vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z); vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
    vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000), dot(g010,g010), dot(g100,g100), dot(g110,g110)));
    g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001), dot(g011,g011), dot(g101,g101), dot(g111,g111)));
    g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);
    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000,n100,n010,n110), vec4(n001,n101,n011,n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    return 2.2 * mix(n_yz.x, n_yz.y, fade_xyz.x);
  }

  void main(){
    vec2 displacedUv = vUv + cnoise(vec3(vUv * 5.0, uTime * 0.1));
    float strength = cnoise(vec3(displacedUv * 5.0, uTime * 0.2));
    float outerGlow = distance(vUv, vec2(0.5)) * 5.0 - 1.4;
    strength += outerGlow;
    strength += step(-0.2, strength) * 0.8;
    vec3 color = mix(uColorStart, uColorEnd, strength);
    // the fire "comes alive" by growing UP from the bottom of the screen on first
    // visit: a soft, flickering front rises from vUv.y=0 to the top as uReveal 0->1
    float band = 0.35;                              // softness of the rising edge
    float front = uReveal * (1.0 + band);          // sweeps past the top at uReveal=1
    float wobble = cnoise(vec3(vUv.x * 4.0, uTime * 0.3, 0.0)) * 0.06; // irregular flame edge
    float rise = smoothstep(front, front - band, vUv.y - wobble);
    // unlit screen sits at the background color (matches the canvas/section bg) so the
    // monitor never flashes black on first load - the fire grows up out of it
    gl_FragColor = vec4(mix(uBackground, color, rise), 1.0);
  }
`;function V(o){return new M({uniforms:{uTime:{value:0},uReveal:{value:0},uColorStart:{value:new x("#bdde87")},uColorEnd:{value:new x("#159971")},uBackground:{value:new x("#000000")}},vertexShader:o,fragmentShader:L,side:T})}const b="/model/PortfolioRoom.glb",A={hobby:"/model/HobbyStationBake.webp",dragon:"/model/DragonBake.webp",work:"/model/WorkStationBake.webp",music:"/model/MusicStationBake.webp",portfolio:"/model/PortfolioImagesBake.webp",structure:"/model/StructureAndDeco.webp"},d=new P(-.87,.55,-.49),m=new P(-.69,.57,-.49),y=new P(0,.65,.2),N=3,F=3.4,q=600,w=.899,k=.8,H=.92,W=1.62,K=[["PottedPlant","hobby"],["HobbyStation","hobby"],["StructureAndDeco","structure"],["GreenDino","dragon"],["MusicStation","music"],["WorkStation","work"],["SmallPlant001","work"],["Speaker1001","work"],["Speaker2001","work"],["Speaker3001","work"],["Speaker4001","work"],["Mouse001","work"],["Posters","portfolio"],["Portraits","portfolio"]],Z=[["Gradient1",4043726],["Gradient2",5352362],["Gradient3",7919976],["Gradient4",14938748],["Gradient5",16766048]];function X({material:o,entered:s,onLeave:a}){const{nodes:i}=z(b),e=i.MonitorScreen;return e?r.jsx("mesh",{geometry:e.geometry,position:e.position,rotation:e.rotation,material:o,onClick:t=>{s&&(t.stopPropagation(),a())},onPointerOver:t=>{s&&(t.stopPropagation(),document.body.style.cursor="pointer")},onPointerOut:()=>{document.body.style.cursor=""}}):null}function Y({onReady:o}){const{nodes:s}=z(b),a=R(A);return n.useEffect(()=>{o()},[o]),r.jsxs("group",{children:[K.map(([i,e])=>{const t=s[i];return t?r.jsx("mesh",{geometry:t.geometry,position:t.position,rotation:t.rotation,children:r.jsx("meshBasicMaterial",{map:a[e],"map-flipY":!1,"map-colorSpace":B})},i):null}),Z.map(([i,e])=>{const t=s[i];return t?r.jsx("mesh",{geometry:t.geometry,position:t.position,rotation:t.rotation,children:r.jsx("meshBasicMaterial",{color:e})},i):null}),r.jsx(I,{size:6,scale:[4,2,4],"position-y":1,speed:1,count:30})]})}function J({entered:o,ready:s,leaving:a,onExited:i}){const{camera:e}=D(),t=n.useRef(null),[c,u]=n.useState(!1),l=n.useRef(null);return n.useEffect(()=>{e.position.copy(m),e.lookAt(d)},[e]),n.useEffect(()=>{o||(u(!1),l.current=null)},[o]),n.useEffect(()=>{s&&l.current===null&&(l.current=performance.now())},[s]),S((f,p)=>{var h;if(o&&c&&!a)return;const g=s&&l.current!==null&&performance.now()-l.current>q,v=o&&g&&!a,E=v?y:m,_=1-Math.exp(-(a?F:N)*p);e.position.lerp(E,_),e.lookAt(d),v&&!c&&e.position.distanceTo(y)<.02&&(e.position.copy(y),e.lookAt(d),(h=t.current)==null||h.update(),u(!0)),a&&e.position.distanceTo(m)<.03&&(e.position.copy(m),e.lookAt(d),i())}),r.jsx(C,{ref:t,makeDefault:!0,enabled:o&&c&&!a,target:d,enablePan:!1,enableDamping:!0,dampingFactor:.08,maxDistance:4,minDistance:.5,minAzimuthAngle:c?w-k:-1/0,maxAzimuthAngle:c?w+k:1/0,minPolarAngle:c?H:0,maxPolarAngle:c?W:Math.PI/1.9})}function Q({entered:o,leaving:s,onExited:a,onMonitorClick:i,fireOn:e,onFireReady:t}){const[c,u]=n.useState(!1),l=n.useRef(!1),f=n.useMemo(()=>V(U),[]);return S((p,g)=>{if(f.uniforms.uTime.value+=g,e){const v=Math.min(1,f.uniforms.uReveal.value+g*.28);f.uniforms.uReveal.value=v,v>=.85&&!l.current&&(l.current=!0,t())}}),n.useEffect(()=>{o||u(!1)},[o]),r.jsxs(r.Fragment,{children:[r.jsx(X,{material:f,entered:o&&!s,onLeave:i}),o&&r.jsx(n.Suspense,{fallback:null,children:r.jsx(Y,{onReady:()=>u(!0)})}),r.jsx(J,{entered:o,ready:c,leaving:s,onExited:a})]})}function te({entered:o,leaving:s,onExited:a,onMonitorClick:i,fireOn:e,onFireReady:t}){const c=n.useRef(null),[u,l]=n.useState(!0),f=G();return n.useEffect(()=>{const p=c.current;if(!p)return;const g=new IntersectionObserver(([v])=>l(v.isIntersecting),{threshold:0});return g.observe(p),()=>g.disconnect()},[]),r.jsx("div",{ref:c,className:"absolute inset-0",children:r.jsxs(j,{className:"!absolute inset-0",frameloop:(u||o)&&f?"always":"never",dpr:[1,1.5],gl:{toneMapping:O},camera:{fov:45,near:.01,far:100,position:[m.x,m.y,m.z]},children:[r.jsx("color",{args:["#000000"],attach:"background"}),r.jsx(Q,{entered:o,leaving:s,onExited:a,onMonitorClick:i,fireOn:e,onFireReady:t})]})})}z.preload(b);Object.values(A).forEach(o=>R.preload(o));export{te as default};
