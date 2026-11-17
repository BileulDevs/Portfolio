<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import CarouselTrack from "./CarouselTrack.vue";
import type { Project } from "@/data/types";
import { useInView } from "@/composables/useInView";
import { prefersReducedMotion } from "@/composables/useMedia";
import { useProjectModal } from "@/composables/useProjectModal";
import { paintPanel } from "@/utils/projectArt";

/**
 * Projects carousel: panels laid on a cylinder that bends further and splits its RGB
 * channels while it moves, then settles flat-ish on the centred project.
 * Inputs: drag, horizontal wheel / trackpad, arrows, keyboard. Vertical wheel is never
 * captured, so the page always scrolls normally.
 * Falls back to a native horizontal track when WebGL is missing or motion is reduced.
 */
const props = defineProps<{ projects: Project[] }>();
const { t } = useI18n();

// ---- Tunables ---------------------------------------------------------------
/** Panel size in world units; the 1.6 ratio matches the 1600×1000 textures. */
const PANEL_W = 4.8;
const PANEL_H = 3;
const GAP = 0.45;
const STEP = PANEL_W + GAP;
/** Cylinder radius at rest. Smaller = more curved. */
const REST_RADIUS = 10;
/** How much the radius shrinks with speed, and its floor (below ~5 panels fold onto themselves). */
const BEND_PER_SPEED = 32;
const MIN_RADIUS = 5.5;
/** Share of the stage width the centred panel takes (desktop / narrow screens). */
const FILL_WIDE = 0.5;
const FILL_NARROW = 0.8;
const NARROW_PX = 760;
/** …but never more than this share of the stage height: on wide, short stages the width rule alone
 *  made the panel taller than the stage, cropping its top and bottom. */
const FILL_HEIGHT = 0.86;
/** Easing toward the target index per frame; higher = snappier. */
const EASE = 0.085;
/** Pixels of horizontal wheel delta per panel. */
const WHEEL_PX_PER_PANEL = 420;
/** Idle delay before a wheel gesture snaps to the nearest panel. */
const WHEEL_SNAP_MS = 140;
/** Pointer travel under which a press counts as a click, not a drag. */
const CLICK_SLOP_PX = 6;
/** The ring needs enough panels that the wrap-around seam stays off-screen. */
const MIN_PANELS = 7;
/** DPR cap: beyond this the fill cost grows with no visible gain on soft textures. */
const MAX_DPR = 1.75;

const root = ref<HTMLElement | null>(null);
const stage = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const track = ref<InstanceType<typeof CarouselTrack> | null>(null);
const mode = ref<"webgl" | "dom">(prefersReducedMotion() ? "dom" : "webgl");
const active = ref(0);
/** HUD dot along its arc, 0 → 1: follows the panels' live position, not the index, so it glides. */
const arc = ref(0);
const inView = useInView(root, "100px");

const count = computed(() => props.projects.length);
const current = computed(() => props.projects[active.value]);

// ---- Shared state between input and render loop -----------------------------
let pos = 0; // current index (float)
let target = 0;
let velocity = 0;
let raf = 0;
let wheelTimer = 0;
let drag: { x: number; target: number; moved: boolean; lastX: number; lastT: number; v: number } | null = null;
let panelPx = 1;

/**
 * Arc position for a (fractional) carousel position. Between the last and the first panel the
 * ring keeps going, so the dot glides back along the arc during that step instead of jumping.
 */
function arcAt(p: number) {
  const n = count.value;
  if (n < 2) return 0.5;
  const q = ((p % n) + n) % n;
  return q <= n - 1 ? q / (n - 1) : 1 - (q - (n - 1));
}
function wrapIndex(i: number) {
  return ((Math.round(i) % count.value) + count.value) % count.value;
}
function go(delta: number) {
  target = Math.round(target) + delta;
  wake();
  if (mode.value === "dom") track.value?.scrollByCards(delta);
}
const modal = useProjectModal();
/**
 * Screen rectangle of the centred panel, where the project modal dives from. Read from the frame
 * itself (render once, then scan the middle row and column for opaque pixels), so it matches what
 * is on screen whatever the camera, curvature or canvas size.
 */
function centreRect() {
  const r = stage.value!.getBoundingClientRect();
  const h = panelPx * (PANEL_H / PANEL_W);
  const flat = new DOMRect(r.left + (r.width - panelPx) / 2, r.top + (r.height - h) / 2, panelPx, h);
  if (!renderer || !scene || !camera) return flat;
  renderer.render(scene, camera);
  const gl = renderer.getContext();
  const W = gl.drawingBufferWidth, H = gl.drawingBufferHeight, cx = W >> 1, cy = H >> 1;
  const row = new Uint8Array(W * 4), col = new Uint8Array(H * 4);
  gl.readPixels(0, cy, W, 1, gl.RGBA, gl.UNSIGNED_BYTE, row);
  gl.readPixels(cx, 0, 1, H, gl.RGBA, gl.UNSIGNED_BYTE, col);
  const opaque = (px: Uint8Array, i: number) => px[i * 4 + 3] > 127;
  if (!opaque(row, cx) || !opaque(col, cy)) return flat;
  let left = cx, right = cx, bottom = cy, top = cy;
  while (left > 0 && opaque(row, left - 1)) left--;
  while (right < W - 1 && opaque(row, right + 1)) right++;
  while (bottom > 0 && opaque(col, bottom - 1)) bottom--;
  while (top < H - 1 && opaque(col, top + 1)) top++;
  // Drawing-buffer pixels → CSS pixels (WebGL rows start at the bottom).
  const kx = W / r.width, ky = H / r.height;
  return new DOMRect(r.left + left / kx, r.top + (H - 1 - top) / ky, (right + 1 - left) / kx, (top + 1 - bottom) / ky);
}
/** Brings project `slug` to the centre at once and returns its panel's screen rectangle (see useProjectModal). */
function locate(slug: string) {
  const i = props.projects.findIndex((p) => p.slug === slug);
  if (i < 0) return null;
  active.value = i;
  if (mode.value === "dom") return track.value?.showCard(i) ?? null;
  // Shortest way round the ring to that project, then settle there without animating.
  const n = count.value, base = Math.round(pos);
  let delta = (((i - wrapIndex(base)) % n) + n) % n;
  if (delta > n / 2) delta -= n;
  target = pos = base + delta;
  velocity = 0;
  cancelAnimationFrame(raf);
  starsOnly = false; // this frame must not be skipped: it places the panels that are measured next
  frame(); // places the panels for the new position (centreRect then renders and measures them)
  return centreRect();
}
function open(i = active.value) {
  modal.open(props.projects[i].slug, centreRect());
}

// ---- WebGL ------------------------------------------------------------------
type Three = typeof import("./threeParts");
let three: Three | null = null;
let renderer: import("three").WebGLRenderer | null = null;
let scene: import("three").Scene | null = null;
let camera: import("three").PerspectiveCamera | null = null;
let meshes: { mesh: import("three").Mesh; mat: import("three").ShaderMaterial; slot: number }[] = [];
let textures: import("./threeParts").Texture[] = [];
let resizeObserver: ResizeObserver | undefined;
/** Clock of the animated scenes (shooting stars, office, clouds), in seconds; one uniform shared by all panels. */
const time = { value: 0 };
/** Scene id passed to the shader for each artwork (see uScene in FRAG). */
const SCENES: Record<Project["art"], number> = { night: 1, office: 2, blocks: 3 };
/** When only the scenes move (carousel still), render at this rate instead of the screen's (half the work at 60 Hz). */
const STARS_FPS = 30;
/** Half a frame of slack, so 60 Hz screens land on every other frame instead of every third. */
const STARS_SLACK_MS = 4;
/** Settled, with only the scenes animating: frames in between are skipped. Cleared by wake(). */
let starsOnly = false;
let lastRender = 0;

const VERT = /* glsl */ `
  uniform float uX;
  uniform float uR;
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    vUv = uv;
    // Wrap the flat panel around a vertical cylinder whose front touches z = 0.
    float x = position.x + uX;
    float th = x / uR;
    vec3 p = vec3(uR * sin(th), position.y, uR * cos(th) - uR);
    vFacing = cos(th);
    gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
  }`;
const FRAG = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uVel;
  uniform float uHover;
  uniform float uTime;
  // Animated scene painted on this panel: 1 night sky, 2 office, 3 blocky landscape (0 = still).
  uniform float uScene;
  varying vec2 vUv;
  varying float vFacing;
  float roundedMask(vec2 uv) {
    // 0.018 = PANEL_RADIUS (utils/projectArt.ts), so the modal can start with the same corners.
    vec2 q = abs(uv - 0.5) * vec2(1.6, 1.0) - vec2(0.8, 0.5) + 0.018;
    return 1.0 - smoothstep(0.0, 0.004, length(max(q, 0.0)) - 0.018);
  }
  // A shooting star crossing the panel's sky. p is in panel units (x × 1.6, height = 1, y up);
  // it flies from start for the first 22% of its period, then rests until the next pass.
  float meteor(vec2 p, vec2 start, float period, float offset) {
    float k = fract((uTime + offset) / period);
    if (k > 0.22) return 0.0;
    float t = k / 0.22;
    vec2 dir = normalize(vec2(-0.91, -0.42));
    vec2 head = start + dir * t * 0.6;
    vec2 tail = head - dir * 0.24;
    vec2 pa = p - tail, ba = head - tail;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    float dist = length(pa - ba * h);
    // Thin bright core and a soft halo, both fading toward the tail; in and out over the flight.
    float trail = (smoothstep(0.0035, 0.0, dist) + 0.35 * smoothstep(0.012, 0.0, dist)) * h * h;
    float head_ = smoothstep(0.012, 0.0, length(p - head)) * 0.8;
    return (trail + head_) * smoothstep(0.0, 0.12, t) * smoothstep(1.0, 0.75, t);
  }
  // The scenes below use q = position as the painter draws it: x and y from the top-left, 0 to 1.
  // Office: a refresh line sweeping the monitor's dashboard, and steam rising from the mug.
  vec3 office(vec2 q, vec3 c) {
    float screen = step(0.44, q.x) * step(q.x, 0.82) * step(0.156, q.y) * step(q.y, 0.544);
    float sweep = 0.41 + fract(uTime / 3.5) * 0.44;
    c += vec3(0.72, 0.8, 0.91) * screen * smoothstep(0.035, 0.0, abs(q.x - sweep)) * 0.16;
    for (int i = 0; i < 2; i++) {
      float f = float(i);
      float life = fract(uTime / 2.6 + f * 0.5);
      float y = 0.70 - life * 0.15;
      float x = 0.862 + f * 0.008 + sin(q.y * 45.0 + uTime * 2.0 + f * 3.0) * 0.005;
      // Soft and wide enough to read at the panel's on-screen size (a few pixels across).
      float body = smoothstep(0.014, 0.0, abs(q.x - x) * 1.6) * smoothstep(0.05, 0.0, abs(q.y - y));
      c += vec3(1.0) * body * step(q.y, 0.705) * (1.0 - life) * 0.45;
    }
    return c;
  }
  // Block cloud (two rectangles, like the painter's) drifting right; wraps around off-screen.
  float cloud(vec2 q, float start, float y, float n, float speed) {
    float S = 1.0 / 32.0, Sy = 1.6 / 32.0;
    float x = fract(start + uTime * speed) * 1.4 - 0.2;
    vec2 a = step(vec2(x, y), q) * step(q, vec2(x + S * n, y + Sy * 0.8));
    vec2 b = step(vec2(x + S, y - Sy * 0.6), q) * step(q, vec2(x + S * (n - 1.0), y + Sy * 0.1));
    return max(a.x * a.y, b.x * b.y);
  }
  // Blocky landscape: clouds drift across the sky, only where the picture shows sky (clearly blue
  // pixels), so they pass behind the sun, the tree and the terrain.
  vec3 blocks(vec2 q, vec3 c, vec3 base) {
    float sky = smoothstep(0.08, 0.16, base.b - base.r);
    float m = max(cloud(q, 0.2, 0.12, 5.0, 0.012), max(cloud(q, 0.55, 0.2, 4.0, 0.009), cloud(q, 0.85, 0.07, 3.0, 0.015)));
    return mix(c, vec3(1.0), m * sky * 0.92);
  }
  void main() {
    // Chromatic split proportional to speed: the motion cue of the carousel.
    vec2 s = vec2(uVel * 0.035, 0.0);
    vec3 base = texture2D(uTex, vUv).rgb;
    vec3 c = vec3(texture2D(uTex, vUv + s).r, base.g, texture2D(uTex, vUv - s).b);
    vec2 q = vec2(vUv.x, 1.0 - vUv.y);
    if (uScene > 0.5 && uScene < 1.5) {
      // Night sky (Noxtys): three shooting stars with staggered timing.
      vec2 p = vec2(vUv.x * 1.6, vUv.y);
      float m = meteor(p, vec2(1.35, 0.92), 5.0, 0.0) + meteor(p, vec2(1.0, 0.98), 7.0, 2.6) + meteor(p, vec2(1.55, 0.78), 9.0, 5.1);
      c += vec3(0.93, 0.92, 1.0) * min(m, 1.0);
    } else if (uScene > 1.5 && uScene < 2.5) {
      c = office(q, c);
    } else if (uScene > 2.5) {
      c = blocks(q, c, base);
    }
    c *= mix(0.45, 1.0, smoothstep(0.55, 1.0, vFacing));
    c += uHover * 0.06;
    float a = roundedMask(vUv) * smoothstep(-0.1, 0.45, vFacing);
    gl_FragColor = vec4(c, a);
  }`;

async function initWebGL() {
  try {
    three = await import("./threeParts");
  } catch (err) {
    console.info("Carousel falls back to a native track:", (err as Error).message);
    mode.value = "dom";
    return;
  }
  const T = three;
  const el = canvas.value!;
  try {
    renderer = new T.WebGLRenderer({ canvas: el, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    mode.value = "dom";
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, MAX_DPR));
  scene = new T.Scene();
  camera = new T.PerspectiveCamera(30, 1, 0.1, 100);

  // Textures need the display font, otherwise the first paint uses the fallback face.
  await document.fonts.ready;
  textures = props.projects.map((p, i) => {
    const c = document.createElement("canvas");
    paintPanel(c, p, i);
    const tex = new T.CanvasTexture(c);
    // Raw colours in, raw colours out: the shader writes exactly the canvas pixels.
    tex.colorSpace = T.NoColorSpace;
    tex.anisotropy = renderer!.capabilities.getMaxAnisotropy();
    tex.generateMipmaps = true;
    tex.minFilter = T.LinearMipmapLinearFilter;
    return tex;
  });

  const geo = new T.PlaneGeometry(PANEL_W, PANEL_H, 48, 1);
  const copies = Math.max(1, Math.ceil(MIN_PANELS / count.value));
  for (let slot = 0; slot < count.value * copies; slot++) {
    const mat = new T.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      uniforms: {
        uTex: { value: textures[slot % count.value] },
        uX: { value: 0 },
        uR: { value: REST_RADIUS },
        uVel: { value: 0 },
        uHover: { value: 0 },
        uTime: time, // shared by every panel
        uScene: { value: SCENES[props.projects[slot % count.value].art] },
      },
    });
    const mesh = new T.Mesh(geo, mat);
    // Vertices are moved in the shader, so the CPU bounding sphere is meaningless.
    mesh.frustumCulled = false;
    scene.add(mesh);
    meshes.push({ mesh, mat, slot });
  }

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage.value!);
  resize();
  wake();
}

function resize() {
  if (!renderer || !camera || !stage.value) return;
  const w = stage.value.clientWidth, h = stage.value.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  const fill = w < NARROW_PX ? FILL_NARROW : FILL_WIDE;
  // Camera distance: far enough that the panel covers at most `fill` of the visible width AND at
  // most FILL_HEIGHT of the visible height, whichever needs the camera further back.
  const tan = Math.tan((camera.fov * Math.PI) / 360);
  const fitWidth = PANEL_W / (fill * 2 * tan * camera.aspect);
  const fitHeight = PANEL_H / (FILL_HEIGHT * 2 * tan);
  const z = Math.max(fitWidth, fitHeight);
  camera.position.set(0, 0, z);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
  // On-screen width of the centred panel (drag and click maths use it).
  panelPx = (w * PANEL_W) / (2 * z * tan * camera.aspect);
  wake();
}

let hovering = false;
function frame() {
  raf = 0;
  if (!renderer || !scene || !camera) return;
  const now = performance.now();
  if (starsOnly && now - lastRender < 1000 / STARS_FPS - STARS_SLACK_MS) {
    if (inView.value) raf = requestAnimationFrame(frame);
    return;
  }
  lastRender = now;
  const prev = pos;
  pos += (target - pos) * EASE;
  velocity += (pos - prev - velocity) * 0.25;
  const radius = Math.max(MIN_RADIUS, REST_RADIUS - Math.abs(velocity) * BEND_PER_SPEED);
  const total = meshes.length;
  time.value = now / 1000;
  /** A panel with an animated scene is on screen: keep rendering even when nothing else moves. */
  let animated = false;
  for (const { mat, slot } of meshes) {
    // Signed distance of this slot from the centre, wrapped around the ring.
    let d = (slot - pos) % total;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    mat.uniforms.uX.value = d * STEP;
    mat.uniforms.uR.value = radius;
    mat.uniforms.uVel.value = velocity;
    mat.uniforms.uHover.value = hovering && Math.abs(d) < 0.5 ? 1 : 0;
    if (mat.uniforms.uScene.value && Math.abs(d) < 1.5) animated = true;
  }
  renderer.render(scene, camera);
  const idx = wrapIndex(pos);
  if (idx !== active.value) active.value = idx;
  arc.value = arcAt(pos);
  const settled = Math.abs(target - pos) < 0.0005 && Math.abs(velocity) < 0.00005 && !drag;
  // Idle when settled (and no shooting stars on screen) or off-screen: no per-frame cost while nothing moves.
  starsOnly = settled && animated;
  if ((!settled || animated) && inView.value) raf = requestAnimationFrame(frame);
}
function wake() {
  // Something moved (input, resize, hover): back to full rate from the very next frame.
  starsOnly = false;
  if (!raf && mode.value === "webgl" && renderer) raf = requestAnimationFrame(frame);
}
watch(inView, (v) => v && wake());
// The panels show each project's name and kind: repaint them when the language changes.
watch(
  () => props.projects,
  (list) => {
    textures.forEach((tex, i) => {
      paintPanel(tex.image as HTMLCanvasElement, list[i], i);
      tex.needsUpdate = true;
    });
    wake();
  },
);

// ---- Input (WebGL mode) ----------------------------------------------------------
function relX(clientX: number) {
  const r = stage.value!.getBoundingClientRect();
  return (clientX - (r.left + r.width / 2)) / panelPx;
}
function onDown(e: PointerEvent) {
  if (mode.value !== "webgl" || e.button !== 0) return;
  stage.value!.setPointerCapture(e.pointerId);
  drag = { x: e.clientX, target, moved: false, lastX: e.clientX, lastT: performance.now(), v: 0 };
  stage.value!.dataset.cursor = "";
}
function onMove(e: PointerEvent) {
  if (mode.value !== "webgl") return;
  if (!drag) {
    const centred = Math.abs(relX(e.clientX)) < 0.5;
    stage.value!.dataset.cursor = centred ? t("cursor.view") : t("cursor.drag");
    // Only a change of hover state needs a new frame; plain mouse moves leave the rate alone.
    if (centred !== hovering) {
      hovering = centred;
      wake();
    }
    return;
  }
  const dx = e.clientX - drag.x;
  if (Math.abs(dx) > CLICK_SLOP_PX) drag.moved = true;
  const now = performance.now();
  drag.v = (e.clientX - drag.lastX) / Math.max(1, now - drag.lastT);
  drag.lastX = e.clientX;
  drag.lastT = now;
  target = drag.target - dx / panelPx;
  wake();
}
function onUp(e: PointerEvent) {
  if (!drag) return;
  if (!drag.moved) {
    const rel = relX(e.clientX);
    if (Math.abs(rel) < 0.5) open();
    else go(Math.round(rel));
  } else {
    // Fling: carry the release speed (px/ms) a little further before snapping.
    target = Math.round(target - (drag.v * 180) / panelPx);
  }
  drag = null;
  wake();
}
function onCancel() {
  drag = null;
  target = Math.round(target);
  wake();
}
function onWheel(e: WheelEvent) {
  if (mode.value !== "webgl") return;
  const dx = e.shiftKey ? e.deltaY : e.deltaX;
  // Vertical intent belongs to the page: never hijack it.
  if (!e.shiftKey && Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
  e.preventDefault();
  target += dx / WHEEL_PX_PER_PANEL;
  clearTimeout(wheelTimer);
  wheelTimer = window.setTimeout(() => { target = Math.round(target); wake(); }, WHEEL_SNAP_MS);
  wake();
}
function onKey(e: KeyboardEvent) {
  if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
  else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  else if (e.key === "Enter" && mode.value === "webgl") { e.preventDefault(); open(); }
}

onMounted(() => {
  modal.locate.value = locate;
  stage.value!.addEventListener("wheel", onWheel, { passive: false });
  if (mode.value === "webgl") initWebGL();
});

onBeforeUnmount(() => {
  if (modal.locate.value === locate) modal.locate.value = null;
  cancelAnimationFrame(raf);
  clearTimeout(wheelTimer);
  stage.value?.removeEventListener("wheel", onWheel);
  resizeObserver?.disconnect();
  meshes.forEach(({ mesh, mat }) => { mat.dispose(); mesh.geometry.dispose(); });
  textures.forEach((t) => t.dispose());
  renderer?.dispose();
  renderer?.forceContextLoss();
  meshes = [];
});
</script>

<template>
  <div ref="root" class="carousel" :class="mode">
    <div
      ref="stage"
      class="stage"
      tabindex="0"
      role="region"
      :aria-roledescription="$t('a11y.carouselRole')"
      :aria-label="$t('a11y.carousel')"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onCancel"
      @pointerleave="hovering = false"
      @keydown="onKey"
    >
      <canvas v-if="mode === 'webgl'" ref="canvas" aria-hidden="true" />
      <CarouselTrack v-else ref="track" :projects="projects" @active="(i) => (active = Math.min(count - 1, i))" />
    </div>

    <CarouselHud :current="current" :active="active" :count="count" :progress="mode === 'webgl' ? arc : arcAt(active)" @prev="go(-1)" @next="go(1)" @pick="modal.origin.value = mode === 'webgl' ? centreRect() : null" />
    <p class="sr-only" aria-live="polite">{{ $t("a11y.carouselLive", { n: active + 1, count, name: current.name, tagline: current.tagline }) }}</p>
  </div>
</template>

<style scoped>
.carousel { position: relative; }
.stage { position: relative; height: clamp(320px, 54vh, 620px); outline-offset: -4px; touch-action: pan-y; user-select: none; cursor: grab; }
.webgl .stage:active { cursor: grabbing; }
.stage canvas { width: 100%; height: 100%; display: block; }

/* Native fallback: reduced motion or no WebGL. */
.dom .stage { height: auto; cursor: auto; }

@media (max-width: 760px) {
  .stage { height: clamp(230px, 34vh, 360px); }
}
</style>
