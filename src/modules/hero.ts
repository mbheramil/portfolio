// WebGL hero — instanced glowing particle field with mouse-reactive parallax.
// Uses a custom shader so it stays unique and performant.
import * as THREE from 'three';

export function initHero() {
  const canvas = document.getElementById('heroCanvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: true,
    powerPreference: 'high-performance'
  });
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 6);

  // ───────── particle field ─────────
  const COUNT = 1800;
  const positions = new Float32Array(COUNT * 3);
  const seeds     = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    // Distribute on a thick disk
    const r = Math.pow(Math.random(), 0.7) * 12;
    const theta = Math.random() * Math.PI * 2;
    positions[i * 3]     = Math.cos(theta) * r;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = Math.sin(theta) * r - 3;
    seeds[i] = Math.random();
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('aSeed',    new THREE.BufferAttribute(seeds, 1));

  const uniforms = {
    uTime:   { value: 0 },
    uMouse:  { value: new THREE.Vector2(0, 0) },
    uPxRatio:{ value: dpr },
    uAccent: { value: new THREE.Color(0xf0a648) },
    uSecond: { value: new THREE.Color(0x7b8fa3) }
  };

  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform vec2  uMouse;
      uniform float uPxRatio;
      attribute float aSeed;
      varying float vAlpha;
      varying float vSeed;
      void main() {
        vSeed = aSeed;
        vec3 p = position;

        // gentle wave
        float t = uTime * 0.18 + aSeed * 6.28;
        p.y += sin(t) * 0.35;
        p.x += cos(t * .9) * 0.15;

        // subtle parallax toward mouse
        vec2 m = uMouse * 1.2;
        p.x += m.x * (0.4 + aSeed * 0.6);
        p.y += m.y * (0.4 + aSeed * 0.6);

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;

        // size by depth
        float size = mix(1.0, 4.5, aSeed);
        gl_PointSize = size * uPxRatio * (60.0 / -mv.z);

        // fade by distance + flicker
        float depthFade = clamp(1.0 - (-mv.z - 2.0) / 12.0, 0.0, 1.0);
        float flick = 0.6 + 0.4 * sin(t * 2.3 + aSeed * 12.0);
        vAlpha = depthFade * flick;
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform vec3 uAccent;
      uniform vec3 uSecond;
      varying float vAlpha;
      varying float vSeed;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;
        // soft glow
        float core = smoothstep(0.5, 0.0, d);
        float halo = smoothstep(0.5, 0.15, d) * 0.5;
        vec3 col = mix(uSecond, uAccent, vSeed);
        gl_FragColor = vec4(col, (core + halo) * vAlpha);
      }
    `
  });

  const points = new THREE.Points(geom, mat);
  scene.add(points);

  // ───────── floating wireframe icosahedron (subtle) ─────────
  const ico = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.4, 1)),
    new THREE.LineBasicMaterial({ color: 0xf0a648, transparent: true, opacity: 0.08 })
  );
  ico.position.set(0, 0, 0);
  scene.add(ico);

  // ───────── resize ─────────
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ───────── mouse + scroll ─────────
  const mouseTarget = new THREE.Vector2();
  window.addEventListener('mousemove', (e) => {
    mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseTarget.y = -((e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });

  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  // ───────── render loop ─────────
  const clock = new THREE.Clock();
  let frame = 0;
  function tick() {
    const dt = clock.getDelta();
    uniforms.uTime.value += dt;
    uniforms.uMouse.value.x += (mouseTarget.x - uniforms.uMouse.value.x) * 0.05;
    uniforms.uMouse.value.y += (mouseTarget.y - uniforms.uMouse.value.y) * 0.05;

    points.rotation.y += dt * 0.04;
    ico.rotation.y    += dt * 0.08;
    ico.rotation.x    += dt * 0.04;

    // camera drift on scroll
    camera.position.y = -scrollY * 0.0015;
    camera.position.z = 6 + Math.min(scrollY * 0.001, 2.5);

    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  }
  tick();

  // pause when offscreen / hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else tick();
  });
}
