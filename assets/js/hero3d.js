/* ============================================================
   hero3d.js — Immersive 3D data-platform experience
   ------------------------------------------------------------
   A living point-cloud "data network" — the Braud Data Platform
   made physical — rendered as a fixed full-viewport backdrop. As
   the visitor scrolls, the camera FLIES THROUGH the network along
   the pipeline (Ingest → Transform → Warehouse → Serve → Product →
   Orchestrate). Content stays HTML and fully readable on top.

   Also owns: the branded preloader (real download progress), a
   custom cursor, and smooth-wheel (inertia) scrolling.

   Progressive enhancement / non-negotiables:
   - prefers-reduced-motion → one static frame, no camera motion,
     no custom cursor, no smooth scroll.
   - No WebGL → clean flat dark layout (no canvas), cursor still on.
   - Mobile / touch → lighter scene, no parallax, no smooth-wheel;
     native scrolling; all content reachable.
   - Render loop pauses when the tab is hidden (battery saver).

   No build step: Three.js r160 is streamed from a CDN as an ES
   module with genuine byte-level progress.
   ============================================================ */

'use strict';

/* ---- Palette (from main.css tokens) ---- */
const COLOR_BG = 0x070a0f;          // deep space
const COLOR_NODE = 0x1847b1;        // --accent-deep (palette blue)
const COLOR_NODE_HI = 0x8fb3ff;     // brighter tint of the same hue
const COLOR_LINK = 0x2f5fd0;

const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';
// Decompressed byte size of the pinned build (CDN serves gzip/chunked with
// no Content-Length). The fetch stream reports decompressed bytes, so this
// gives genuinely real, monotonic progress.
const THREE_BYTES = 670681;

/* ---- Environment ---- */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
const hasHover = window.matchMedia('(hover: hover)').matches;
const isMobile = window.matchMedia('(max-width: 768px)').matches || isTouch;
const hasWebGL = !document.documentElement.classList.contains('no-webgl');

/* ---- Scene sizing ---- */
const NODE_COUNT = isMobile ? 240 : 620;
const LINK_DISTANCE = 9.0;
const MAX_LINKS_PER_NODE = 3;
const FOG_DENSITY = 0.02;

/* Tunnel geometry — six pipeline-stage clusters along -Z */
const STAGE_Z = [10, -46, -102, -158, -214, -270];
const CAM_START = 46;
const CAM_TRAVEL = 340;

/* ---- Elements ---- */
const canvas = document.getElementById('bg-canvas');
const preloaderEl = document.getElementById('preloader');
const fillEl = document.getElementById('preloader-fill');
const pctEl = document.getElementById('preloader-pct');

/* Curved tunnel axis: where the "center" of the tube sits at depth z. */
function axisX(z) { return Math.sin(z * 0.03) * 9; }
function axisY(z) { return Math.cos(z * 0.024) * 6; }

/* ============================================================
   Kick everything off. Cursor + rail + smooth-scroll are
   independent of WebGL; the 3D scene is gated.
   ============================================================ */
initCursor();
initPipelineRail();

if (hasWebGL && canvas) {
  boot();
} else {
  // No WebGL: nothing to load — the flat dark layout is already visible.
  releaseHero();
}

function releaseHero() { document.documentElement.classList.remove('exp-loading'); }
function dismissPreloader() { if (preloaderEl) preloaderEl.classList.add('is-done'); }
function fallback() { releaseHero(); dismissPreloader(); document.documentElement.classList.add('no-webgl'); }

function setProgress(v) {
  const pct = Math.max(0, Math.min(100, Math.round(v * 100)));
  if (fillEl) fillEl.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';
  if (preloaderEl) preloaderEl.setAttribute('aria-valuenow', String(pct));
}

async function boot() {
  const startedAt = performance.now();

  // Hard guarantee: no matter what happens during load, the preloader is
  // never allowed to sit on top of the page and trap clicks/scroll.
  const hardStop = setTimeout(() => { releaseHero(); dismissPreloader(); }, 7000);

  let THREE;
  try {
    THREE = await loadThree((p) => setProgress(p * 0.78));
  } catch (err) {
    console.warn('[hero3d] Three.js failed to load; flat fallback.', err);
    fallback();
    return;
  }

  let ctx;
  try {
    setProgress(0.82);
    ctx = buildScene(THREE);
    setProgress(0.94);
    ctx.renderer.render(ctx.scene, ctx.camera); // warm first frame
    setProgress(1);
  } catch (err) {
    console.warn('[hero3d] Scene build failed; flat fallback.', err);
    try { if (ctx && ctx.dispose) ctx.dispose(); } catch (_) {}
    fallback();
    return;
  }

  const reveal = () => {
    clearTimeout(hardStop);
    canvas.classList.add('is-live');
    releaseHero();
    dismissPreloader();
  };
  const MIN_SHOW = 350;
  const elapsed = performance.now() - startedAt;
  setTimeout(reveal, Math.max(0, MIN_SHOW - elapsed));

  if (prefersReduced) ctx.renderStatic();
  else ctx.start();
}

/* ------------------------------------------------------------
   Stream Three.js with real byte-level progress.
   ------------------------------------------------------------ */
async function loadThree(onProgress) {
  try {
    const res = await fetch(THREE_URL, { mode: 'cors' });
    if (!res.ok || !res.body) throw new Error('bad response');

    const total = Number(res.headers.get('content-length')) || THREE_BYTES;
    const reader = res.body.getReader();
    const chunks = [];
    let received = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      onProgress(Math.min(0.99, received / total));
    }
    onProgress(1);

    const blob = new Blob(chunks, { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const mod = await import(/* @vite-ignore */ url);
    URL.revokeObjectURL(url);
    return mod;
  } catch (streamErr) {
    onProgress(0.5);
    const mod = await import(/* @vite-ignore */ THREE_URL);
    onProgress(1);
    return mod;
  }
}

/* ------------------------------------------------------------
   Build the tunnel-of-nodes scene.
   ------------------------------------------------------------ */
function buildScene(THREE) {
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: !isMobile, alpha: false, powerPreference: 'high-performance',
  });
  const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.75);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(COLOR_BG, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(COLOR_BG, FOG_DENSITY);

  const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 400);
  camera.position.set(axisX(CAM_START), axisY(CAM_START), CAM_START);

  const graph = new THREE.Group();
  scene.add(graph);

  /* ---- Nodes ---- */
  const positions = new Float32Array(NODE_COUNT * 3);
  const scales = new Float32Array(NODE_COUNT);
  const phases = new Float32Array(NODE_COUNT);
  const colors = new Float32Array(NODE_COUNT * 3);
  const cNode = new THREE.Color(COLOR_NODE);
  const cHi = new THREE.Color(COLOR_NODE_HI);
  const pts = [];

  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

  for (let i = 0; i < NODE_COUNT; i++) {
    let x, y, z, big = false;
    if (Math.random() < 0.64) {
      // Clustered around a pipeline stage
      const s = (Math.random() * STAGE_Z.length) | 0;
      z = STAGE_Z[s] + gauss() * 12;
      const rad = Math.abs(gauss()) * 9;
      const ang = Math.random() * Math.PI * 2;
      x = axisX(z) + Math.cos(ang) * rad;
      y = axisY(z) + Math.sin(ang) * rad;
      big = Math.random() < 0.06;
    } else {
      // Scattered along the whole tube for continuous walls
      z = 20 - Math.random() * 300;
      const rad = 4 + Math.random() * 13;
      const ang = Math.random() * Math.PI * 2;
      x = axisX(z) + Math.cos(ang) * rad;
      y = axisY(z) + Math.sin(ang) * rad;
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    pts.push([x, y, z]);

    scales[i] = big ? 2.6 + Math.random() * 1.6 : 0.5 + Math.random() * Math.random() * 1.7;
    phases[i] = Math.random() * Math.PI * 2;

    const t = big ? 0.8 : Math.pow(Math.random(), 2.2) * 0.5;
    const col = cNode.clone().lerp(cHi, t);
    colors[i * 3] = col.r; colors[i * 3 + 1] = col.g; colors[i * 3 + 2] = col.b;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
  pGeo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  pGeo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

  const glowTex = makeGlowTexture(THREE);

  const pMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: (isMobile ? 24 : 32) * pixelRatio },
      uMaxSize: { value: 130 * pixelRatio },
      uTex: { value: glowTex },
      uFog: { value: FOG_DENSITY },
    },
    vertexShader: /* glsl */ `
      attribute float aScale;
      attribute float aPhase;
      attribute vec3 aColor;
      uniform float uTime;
      uniform float uSize;
      uniform float uMaxSize;
      uniform float uFog;
      varying vec3 vColor;
      varying float vFog;
      varying float vPulse;
      void main() {
        vColor = aColor;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float pulse = 0.66 + 0.34 * sin(uTime * 1.5 + aPhase);
        vPulse = pulse;
        float size = uSize * aScale * pulse * (1.0 / -mv.z);
        gl_PointSize = min(size, uMaxSize);
        float d = -mv.z;
        vFog = 1.0 - clamp(exp(-uFog * uFog * d * d), 0.0, 1.0);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uTex;
      varying vec3 vColor;
      varying float vFog;
      varying float vPulse;
      void main() {
        vec4 tex = texture2D(uTex, gl_PointCoord);
        float a = tex.a * (1.0 - vFog) * vPulse;
        if (a < 0.01) discard;
        gl_FragColor = vec4(vColor * (0.55 + 0.45 * vPulse), a);
      }
    `,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(pGeo, pMat);
  graph.add(points);

  /* ---- Links ---- */
  const linkPos = [];
  const linkCol = [];
  const linkCounts = new Uint8Array(NODE_COUNT);
  const maxSq = LINK_DISTANCE * LINK_DISTANCE;
  const cLink = new THREE.Color(COLOR_LINK);

  for (let i = 0; i < NODE_COUNT; i++) {
    if (linkCounts[i] >= MAX_LINKS_PER_NODE) continue;
    const a = pts[i];
    for (let j = i + 1; j < NODE_COUNT; j++) {
      if (linkCounts[i] >= MAX_LINKS_PER_NODE) break;
      if (linkCounts[j] >= MAX_LINKS_PER_NODE) continue;
      const b = pts[j];
      const dx = a[0] - b[0], dy = a[1] - b[1], dz = a[2] - b[2];
      const dSq = dx * dx + dy * dy + dz * dz;
      if (dSq > maxSq) continue;
      const t = 1.0 - Math.sqrt(dSq) / LINK_DISTANCE;
      const al = 0.05 + t * 0.35;
      linkPos.push(a[0], a[1], a[2], b[0], b[1], b[2]);
      linkCol.push(cLink.r * al, cLink.g * al, cLink.b * al, cLink.r * al, cLink.g * al, cLink.b * al);
      linkCounts[i]++; linkCounts[j]++;
    }
  }

  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute('position', new THREE.Float32BufferAttribute(linkPos, 3));
  lGeo.setAttribute('color', new THREE.Float32BufferAttribute(linkCol, 3));
  const lMat = new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, fog: true,
  });
  const links = new THREE.LineSegments(lGeo, lMat);
  graph.add(links);

  /* ---- Sizing ---- */
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }
  resize();

  /* ---- Pointer parallax (desktop) ---- */
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  function onPointerMove(e) {
    ptr.tx = (e.clientX / window.innerWidth) * 2 - 1;
    ptr.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }
  if (!isMobile) window.addEventListener('pointermove', onPointerMove, { passive: true });

  /* ---- Scroll → camera flythrough ---- */
  function scrollProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }
  let sp = scrollProgress();

  /* ---- Render loop ---- */
  const clock = new THREE.Clock();
  let rafId = null, running = false;

  function frame() {
    if (!running) return;
    const t = clock.getElapsedTime();
    const dt = Math.min(clock.getDelta(), 0.05);

    pMat.uniforms.uTime.value = t;

    // Damp toward the true scroll position for inertial camera glide
    sp += (scrollProgress() - sp) * 0.11;
    const camZ = CAM_START - sp * CAM_TRAVEL;

    // Idle + pointer parallax around the tunnel axis
    if (!isMobile) {
      ptr.x += (ptr.tx - ptr.x) * 0.045;
      ptr.y += (ptr.ty - ptr.y) * 0.045;
    }
    const idleX = Math.sin(t * 0.25) * 1.4;
    const idleY = Math.cos(t * 0.21) * 1.0;
    camera.position.set(
      axisX(camZ) + ptr.x * 6 + idleX,
      axisY(camZ) + -ptr.y * 4 + idleY,
      camZ
    );
    camera.lookAt(axisX(camZ - 34) + ptr.x * 2, axisY(camZ - 34) - ptr.y * 1.5, camZ - 34);

    // Subtle life in the graph itself
    graph.rotation.z = Math.sin(t * 0.08) * 0.04;

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(frame);
  }

  function play() {
    if (running || document.hidden) return;
    running = true;
    clock.getDelta();
    rafId = requestAnimationFrame(frame);
  }
  function pause() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function onVisibility() { if (document.hidden) pause(); else play(); }
  document.addEventListener('visibilitychange', onVisibility);

  let resizeQueued = false;
  function onResize() {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(() => {
      resizeQueued = false;
      resize();
      if (!running) renderer.render(scene, camera);
    });
  }
  window.addEventListener('resize', onResize, { passive: true });

  function dispose() {
    pause();
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('resize', onResize);
    if (!isMobile) window.removeEventListener('pointermove', onPointerMove);
    pGeo.dispose(); pMat.dispose(); lGeo.dispose(); lMat.dispose();
    glowTex.dispose(); renderer.dispose();
  }

  return {
    scene, camera, renderer,
    start: play,
    renderStatic: () => renderer.render(scene, camera),
    dispose,
  };
}

/* Soft radial glow sprite — cheap bloom substitute, no post-processing. */
function makeGlowTexture(THREE) {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0.0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,0.85)');
  grad.addColorStop(0.5, 'rgba(255,255,255,0.32)');
  grad.addColorStop(1.0, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

/* ============================================================
   Custom cursor (dot + trailing ring). Fine pointer only.
   ============================================================ */
function initCursor() {
  if (prefersReduced || isTouch || !hasHover) return;
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  document.documentElement.classList.add('has-cursor');

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('pointermove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  }, { passive: true });

  const interactive = 'a, button, .btn, [role="button"], input, textarea, .project-card, .stage, .surface-card';
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest && e.target.closest(interactive)) {
      document.documentElement.classList.add('cursor-active');
    }
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest && e.target.closest(interactive)) {
      document.documentElement.classList.remove('cursor-active');
    }
  });

  (function ringLoop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(ringLoop);
  })();
}

/* ============================================================
   Pipeline rail — reveal during the flagship, highlight the
   stage nearest the viewport center. Pure DOM; no WebGL needed.
   ============================================================ */
function initPipelineRail() {
  const rail = document.getElementById('pipeline-rail');
  const flagship = document.getElementById('platform');
  const stages = Array.prototype.slice.call(document.querySelectorAll('.stage[data-stage]'));
  if (!rail || !flagship || !stages.length) return;

  const items = {};
  rail.querySelectorAll('.pipeline-rail__item').forEach((el) => { items[el.dataset.stage] = el; });

  // Show the rail only while the flagship section is in view.
  const vis = new IntersectionObserver((entries) => {
    rail.classList.toggle('is-visible', entries[0].isIntersecting);
  }, { threshold: 0, rootMargin: '-10% 0px -10% 0px' });
  vis.observe(flagship);

  let queued = false;
  function update() {
    queued = false;
    const mid = window.innerHeight / 2;
    let best = null, bestDist = Infinity;
    for (const s of stages) {
      const r = s.getBoundingClientRect();
      const c = r.top + r.height / 2;
      const d = Math.abs(c - mid);
      if (d < bestDist) { bestDist = d; best = s.dataset.stage; }
    }
    for (const key in items) items[key].classList.toggle('is-active', key === best);
  }
  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}
