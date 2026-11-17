<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { FeatureItem } from "@/data/types";
import { useInView } from "@/composables/useInView";
import { prefersReducedMotion } from "@/composables/useMedia";
import { curveRadius } from "@/components/carousel/curve";
import { isBall, type Item, type ItemRenderer } from "./blockItems";
import type { DetailScene, SoundSettings } from "./detailScene";

/**
 * Features as the home page's curved carousel, but with the items alone: real 3D blocks set around a
 * turnstile, one per feature, the whole ring visible (the centred one in front, the others to the
 * left, right and at the back). The ring tightens a little while it turns, like the home carousel. Clicking the centred block opens its details (the
 * block on the left, the texts on the right). Drag, horizontal wheel, arrows and keyboard move it.
 * Reduced motion or no WebGL: every feature is shown directly in its detail layout.
 */
/** `label`: the section's heading ("Features", "Mods"…), also the back button's text. */
const props = defineProps<{ items: FeatureItem[]; label: string }>();
const { t } = useI18n();

// ---- Tunables -------------------------------------------------------------------------------------
/** Block edge, in world units. */
const BLOCK = 1.25;
/** Turnstile radius at rest, how much it tightens with speed, and its floor. */
const REST_RADIUS = 4;
const BEND_PER_SPEED = 10;
const MIN_RADIUS = 3.4;
/** With many items the ring grows, so neighbours always stay this far apart (world units). */
const NEIGHBOUR_GAP = 3.2;
/** Camera height above the ring, in block edges: high enough to see the back blocks over the front one. */
const VIEW_HEIGHT = 1.15;
/** Opacity of the blocks beyond the left and right ones (at the back of the ring). */
const BACK_OPACITY = 0.3;
/** The centred block is a bit bigger, more when hovered. */
const SCALE_ACTIVE = 1.15;
const SCALE_HOVER = 1.24;
/** Downward tilt of every block, so their tops show. */
const TILT = 0.22;
const EASE = 0.085;
const WHEEL_PX_PER_PANEL = 420;
const WHEEL_SNAP_MS = 140;
const CLICK_SLOP_PX = 6;
/** Click within this share of the spacing from the centre = the centred block. */
const HIT = 0.35;
const MAX_DPR = 1.75;
/** Spin speeds (radians per second): the centred block, and the others. */
const SPIN_ACTIVE = 0.9;
const SPIN_IDLE = 0.3;

const root = ref<HTMLElement | null>(null);
const stage = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const detailCanvas = ref<HTMLCanvasElement | null>(null);
/** Sound of the open feature's scene (a Pokémon's cry), remembered in this browser. */
const SOUND_KEY = "portfolio.sound";
function loadSound(): SoundSettings {
  try {
    const saved = JSON.parse(localStorage.getItem(SOUND_KEY) ?? "null") as Partial<SoundSettings> | null;
    return { on: saved?.on ?? true, level: typeof saved?.level === "number" ? Math.min(1, Math.max(0, saved.level)) : 0.7 };
  } catch {
    return { on: true, level: 0.7 }; // storage unavailable (private mode…): defaults for this visit
  }
}
const sound = ref<SoundSettings>({ on: true, level: 0.7 });
watch(sound, (next) => {
  detailScene?.setSound(next);
  try {
    localStorage.setItem(SOUND_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable: the setting just lasts for this visit
  }
}, { deep: true });
/** The open feature's own scene (its item and the Pokémon that roams around it), when it has one. */
const sceneCanvas = ref<HTMLCanvasElement | null>(null);
const listCanvases = ref<HTMLCanvasElement[]>([]);
const mode = ref<"webgl" | "list">(prefersReducedMotion() ? "list" : "webgl");
const active = ref(0);
const open = ref(false);
const inView = useInView(root, "100px");
const count = computed(() => props.items.length);
const current = computed(() => props.items[active.value]);
/** Some items are Cobblemon models: their licence asks for a credit. */
const usesCobblemon = computed(() => props.items.some((item) => isBall(item.model)));

let pos = 0;
let target = 0;
let velocity = 0;
let raf = 0;
let wheelTimer = 0;
let drag: { x: number; target: number; moved: boolean; lastX: number; lastT: number; v: number } | null = null;
/** Angle between neighbouring blocks on the ring, and how far right the next block sits at rest. */
const stepAngle = () => (2 * Math.PI) / count.value;
const ringRadius = () => Math.max(REST_RADIUS, NEIGHBOUR_GAP / (2 * Math.sin(stepAngle() / 2)));
const sideX = () => ringRadius() * Math.sin(Math.min(Math.PI / 2, stepAngle()));
/** Screen pixels per world unit at the front block. */
let unitPx = 1;
let hovering = false;
let lastTime = 0;
const angles = props.items.map((_, i) => 0.6 + i * 0.4);

const wrapIndex = (i: number) => ((Math.round(i) % count.value) + count.value) % count.value;
const smoothstep = (a: number, b: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};
function go(delta: number) {
  target = Math.round(target) + delta;
  wake();
}
/**
 * Click / Enter on the centred item: a Poké Ball first turns to face the viewer, opens (in the
 * carousel), then the details show.
 */
function requestOpen() {
  if (open.value || openingSince) return;
  if (isBall(current.value.model) && renderer && openSeconds > 0) {
    const now = performance.now();
    openingSlot = active.value;
    // Its button (on its −z side) faces the camera at a turn of π: the nearest such angle.
    const from = angles[openingSlot];
    facing = { from, to: from + Math.atan2(Math.sin(Math.PI - from), Math.cos(Math.PI - from)), since: now };
    openingSince = now + FACE_TURN_S * 1000;
    window.setTimeout(() => {
      openingSince = 0;
      facing = null;
      openDetail();
    }, (FACE_TURN_S + openSeconds + OPEN_PAUSE_S) * 1000);
    wake();
    return;
  }
  openDetail();
}
async function openDetail() {
  openedAt = performance.now();
  open.value = true;
  wake();
  const companions = current.value.companions;
  if (!companions?.length) return;
  await nextTick();
  if (!sceneCanvas.value || !open.value) return;
  try {
    const { createDetailScene } = await import("./detailScene");
    const made = await createDetailScene(sceneCanvas.value, current.value.model, companions, {
      sound: { ...sound.value },
      cursor: { pet: t("cursor.pet"), drag: t("cursor.drag") },
    });
    if (open.value) detailScene = made;
    else made.dispose();
  } catch (error) {
    console.warn("Feature carousel: the detail scene could not load", error);
  }
}
function close() {
  open.value = false;
  detailScene?.dispose();
  detailScene = null;
  stage.value?.focus({ preventScroll: true });
  wake();
}

// ---- WebGL ----------------------------------------------------------------------------------------
type Parts = typeof import("@/components/carousel/threeParts");
let renderer: InstanceType<Parts["WebGLRenderer"]> | null = null;
let scene: InstanceType<Parts["Scene"]> | null = null;
let camera: InstanceType<Parts["PerspectiveCamera"]> | null = null;
let slots: { item: Item; slot: number }[] = [];
let disposeScene: (() => void) | null = null;
let resizeObserver: ResizeObserver | undefined;
/** Single-item pictures: the open feature's item and the reduced-motion list. */
let pictures: ItemRenderer | null = null;
/** When the details opened (ms, performance clock), to play the item's opening animation. */
let openedAt = 0;
/** A Poké Ball opening in the carousel before its details show: since when (ms, 0 = none), which slot. */
let openingSince = 0;
let openingSlot = -1;
/** The ball turning to face the viewer before it opens: from / to angles, and since when (ms). */
let facing: { from: number; to: number; since: number } | null = null;
const FACE_TURN_S = 0.35;
/** How long the ball takes to open, and the pause after it before the details show (seconds). */
let openSeconds = 0;
const OPEN_PAUSE_S = 0.2;
let detailScene: DetailScene | null = null;

async function initWebGL(T: Parts, items: typeof import("./blockItems")) {
  try {
    renderer = new T.WebGLRenderer({ canvas: canvas.value!, antialias: true, alpha: true });
  } catch {
    mode.value = "list";
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, MAX_DPR));
  renderer.outputColorSpace = T.SRGBColorSpace;
  scene = new T.Scene();
  camera = new T.PerspectiveCamera(30, 1, 0.1, 100);
  const factory = await items.createItemFactory();
  openSeconds = factory.openSeconds;
  for (let slot = 0; slot < count.value; slot++) {
    // Each item has its own materials (textures stay shared), so each can fade on its own.
    const item = factory.make(props.items[slot].model);
    scene.add(item.object);
    slots.push({ item, slot });
  }
  disposeScene = () => factory.dispose();
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage.value!);
  resize();
}

/** Frames the whole ring (on narrow screens, mostly the front block), seen from slightly above. */
function resize() {
  if (!renderer || !camera || !stage.value) return;
  const w = stage.value.clientWidth, h = stage.value.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  const tan = Math.tan((camera.fov * Math.PI) / 360);
  const across = w < 760 ? BLOCK * 3 : sideX() * 2 + BLOCK * 1.4;
  const z = Math.max(across / (2 * tan * camera.aspect), (BLOCK * 3.2) / (2 * tan));
  camera.position.set(0, BLOCK * VIEW_HEIGHT, z);
  camera.lookAt(0, 0, -ringRadius() * 0.6);
  camera.updateProjectionMatrix();
  unitPx = h / (2 * z * tan);
  wake();
}

/** One frame: spin and animate the items and move them around the ring (or draw the open feature's item). */
function frame(now: number) {
  raf = 0;
  const dt = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 0;
  lastTime = now;
  props.items.forEach((_, i) => {
    if (facing && i === openingSlot) {
      const k = Math.min(1, (now - facing.since) / (FACE_TURN_S * 1000));
      angles[i] = facing.from + (facing.to - facing.from) * (1 - (1 - k) ** 3);
    } else angles[i] += dt * (i === active.value ? SPIN_ACTIVE : SPIN_IDLE);
  });

  if (open.value) {
    if (detailScene) detailScene.tick(now);
    else if (pictures && detailCanvas.value) {
      pictures.draw(detailCanvas.value, current.value.model, angles[active.value], now / 1000, (now - openedAt) / 1000);
    }
  } else if (renderer && scene && camera) {
    const prev = pos;
    pos += (target - pos) * EASE;
    velocity += (pos - prev - velocity) * 0.25;
    const radius = curveRadius(velocity, ringRadius(), BEND_PER_SPEED, MIN_RADIUS * ringRadius() / REST_RADIUS);
    for (const { item, slot } of slots) {
      const mesh = item.object;
      const th = (slot - pos) * stepAngle();
      mesh.position.set(radius * Math.sin(th), 0, radius * Math.cos(th) - radius);
      /** Distance from the front, in items: 0 in front, 1 at the left / right, more behind. */
      const away = Math.abs(Math.atan2(Math.sin(th), Math.cos(th))) / stepAngle();
      const near = 1 - smoothstep(0, 1, away);
      mesh.scale.setScalar(BLOCK * (1 + near * ((hovering ? SCALE_HOVER : SCALE_ACTIVE) - 1)));
      const opacity = 1 - (1 - BACK_OPACITY) * smoothstep(1.05, 1.6, away);
      item.materials.forEach((m) => {
        m.opacity = opacity;
        m.depthWrite = opacity > 0.99; // faded blocks do not hide what is behind them
      });
      mesh.rotation.set(TILT, angles[slot] - th, 0);
      const opening = openingSince && slot === openingSlot && now >= openingSince;
      item.update(now / 1000, opening ? (now - openingSince) / 1000 : null);
    }
    renderer.render(scene, camera);
    const idx = wrapIndex(pos);
    if (idx !== active.value) active.value = idx;
  }
  if (inView.value && mode.value === "webgl") raf = requestAnimationFrame(frame);
}
function wake() {
  if (!raf && mode.value === "webgl" && inView.value) raf = requestAnimationFrame(frame);
}
watch(inView, (v) => v && wake());

/** Still pictures for the list layout (reduced motion, or no WebGL). */
function drawList() {
  if (!pictures) return;
  listCanvases.value.forEach((c, i) => c && pictures!.draw(c, props.items[i].model, angles[i]));
}
watch(mode, (m) => m === "list" && requestAnimationFrame(drawList));

// ---- Input ----------------------------------------------------------------------------------------
/** Pointer position from the stage's centre, in items (one item = the gap to the next block). */
function relX(clientX: number) {
  const r = stage.value!.getBoundingClientRect();
  return (clientX - (r.left + r.width / 2)) / (sideX() * unitPx);
}
function onDown(e: PointerEvent) {
  if (open.value || e.button !== 0) return;
  stage.value!.setPointerCapture(e.pointerId);
  drag = { x: e.clientX, target, moved: false, lastX: e.clientX, lastT: performance.now(), v: 0 };
  stage.value!.dataset.cursor = "";
}
function onMove(e: PointerEvent) {
  if (open.value) return;
  if (!drag) {
    const centred = Math.abs(relX(e.clientX)) < HIT;
    stage.value!.dataset.cursor = centred ? t("cursor.view") : t("cursor.drag");
    hovering = centred;
    return;
  }
  const dx = e.clientX - drag.x;
  if (Math.abs(dx) > CLICK_SLOP_PX) drag.moved = true;
  const now = performance.now();
  drag.v = (e.clientX - drag.lastX) / Math.max(1, now - drag.lastT);
  drag.lastX = e.clientX;
  drag.lastT = now;
  target = drag.target - dx / (sideX() * unitPx);
  wake();
}
function onUp(e: PointerEvent) {
  if (!drag) return;
  if (!drag.moved) {
    const rel = relX(e.clientX);
    if (Math.abs(rel) < HIT) requestOpen();
    else go(Math.round(rel) || Math.sign(rel));
  } else {
    target = Math.round(target - (drag.v * 180) / (sideX() * unitPx));
  }
  drag = null;
  wake();
}
function onCancel() {
  drag = null;
  target = Math.round(target);
}
function onWheel(e: WheelEvent) {
  if (open.value || mode.value !== "webgl") return;
  const dx = e.shiftKey ? e.deltaY : e.deltaX;
  if (!e.shiftKey && Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
  e.preventDefault();
  target += dx / WHEEL_PX_PER_PANEL;
  clearTimeout(wheelTimer);
  wheelTimer = window.setTimeout(() => (target = Math.round(target)), WHEEL_SNAP_MS);
  wake();
}
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape" && open.value) close();
  else if (open.value) return;
  else if (e.key === "ArrowRight") go(1);
  else if (e.key === "ArrowLeft") go(-1);
  else if (e.key === "Enter") requestOpen();
  else return;
  e.preventDefault();
}

onMounted(async () => {
  sound.value = loadSound();
  stage.value?.addEventListener("wheel", onWheel, { passive: false });
  try {
    const [T, items] = await Promise.all([import("@/components/carousel/threeParts"), import("./blockItems")]);
    pictures = await items.createItemRenderer();
    if (mode.value === "webgl") await initWebGL(T, items);
    if (mode.value === "list") drawList();
  } catch (error) {
    console.warn("Feature carousel: 3D unavailable, showing the list", error);
    mode.value = "list";
  }
  wake();
});
onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  clearTimeout(wheelTimer);
  stage.value?.removeEventListener("wheel", onWheel);
  resizeObserver?.disconnect();
  disposeScene?.();
  renderer?.dispose();
  renderer?.forceContextLoss();
  pictures?.dispose();
  detailScene?.dispose();
  slots = [];
});
</script>

<template>
  <div ref="root" class="fc" :class="[mode, { open }]">
    <template v-if="mode === 'webgl'">
      <div
        ref="stage"
        class="stage"
        tabindex="0"
        role="region"
        :aria-roledescription="$t('case.featuresCarousel')"
        :aria-label="label"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointercancel="onCancel"
        @pointerleave="hovering = false"
        @keydown="onKey"
      >
        <canvas ref="canvas" aria-hidden="true" />

        <Transition name="detail">
          <div v-if="open" class="detail" role="dialog" :aria-label="current.title" @keydown.stop="onKey">
            <div v-if="current.companions?.length" class="scene-wrap">
              <canvas ref="sceneCanvas" class="scene" aria-hidden="true" />
              <div class="sound" role="group" :aria-label="$t('case.sound')">
                <button type="button" class="toggle" :aria-pressed="sound.on" @click="sound.on = !sound.on">
                  {{ $t("case.sound") }} · {{ sound.on ? "ON" : "OFF" }}
                </button>
                <input
                  v-model.number="sound.level"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  :disabled="!sound.on"
                  :aria-label="$t('case.volume')"
                  :aria-valuetext="`${Math.round(sound.level * 100)} %`"
                />
              </div>
            </div>
            <canvas v-else ref="detailCanvas" class="item" width="440" height="440" aria-hidden="true" />
            <div class="text">
              <h3>{{ current.title }}</h3>
              <p v-if="current.body">{{ current.body }}</p>
              <ul class="links">
                <li v-for="m in current.links" :key="m.url">
                  <a :href="m.url" target="_blank" rel="noopener noreferrer"><img :src="m.logo" alt="" width="28" height="28" loading="lazy" />{{ m.name }} · CurseForge ↗</a>
                </li>
              </ul>
              <button type="button" class="back" @click="close">← {{ label }}</button>
            </div>
          </div>
        </Transition>
      </div>

      <div class="controls" :class="{ hidden: open }">
        <button type="button" class="arrow" :tabindex="open ? -1 : 0" :aria-label="$t('case.prevFeature')" @click="go(-1)">←</button>
        <button type="button" class="name" :tabindex="open ? -1 : 0" :aria-label="$t('case.openFeature', { name: current.title })" @click="requestOpen">{{ current.title }}</button>
        <button type="button" class="arrow" :tabindex="open ? -1 : 0" :aria-label="$t('case.nextFeature')" @click="go(1)">→</button>
      </div>
      <p class="hint" :class="{ hidden: open }">{{ $t("case.featuresHint") }}</p>
      <p class="sr-only" aria-live="polite">{{ current.title }}</p>
    </template>

    <!-- Reduced motion / no WebGL: every feature in its detail layout. -->
    <ul v-else class="list">
      <li v-for="(item, i) in items" :key="item.title" class="detail static">
        <canvas :ref="(el) => { if (el) listCanvases[i] = el as HTMLCanvasElement }" class="item" width="440" height="440" aria-hidden="true" />
        <div class="text">
          <h3>{{ item.title }}</h3>
          <p v-if="item.body">{{ item.body }}</p>
          <ul class="links">
            <li v-for="m in item.links" :key="m.url">
              <a :href="m.url" target="_blank" rel="noopener noreferrer"><img :src="m.logo" alt="" width="28" height="28" loading="lazy" />{{ m.name }} · CurseForge ↗</a>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <p v-if="usesCobblemon" class="credit">
      <a href="https://gitlab.com/cable-mc/cobblemon" target="_blank" rel="noopener noreferrer">{{ $t("case.cobblemonCredit") }} ↗</a>
    </p>
  </div>
</template>

<style scoped>
.fc { position: relative; }
.stage { position: relative; height: clamp(260px, 38vh, 400px); outline-offset: -4px; touch-action: pan-y; user-select: none; cursor: grab; }
.stage:active { cursor: grabbing; }
.stage > canvas { width: 100%; height: 100%; display: block; transition: opacity .35s ease; }
.open .stage > canvas { opacity: 0; }
.open .stage { cursor: auto; }

/* Detail: the item on the left, the texts beside it (no frame). */
.detail { position: absolute; inset: 0; display: grid; grid-template-columns: minmax(0, 2fr) 3fr; align-items: center; gap: clamp(16px, 3vw, 40px); }
.detail .item { width: min(100%, 220px); aspect-ratio: 1; height: auto; justify-self: center; }
/*
 * The item's little world (an open ball and its Pokémon). Its column frames the scene, but the canvas
 * spans the whole detail, under the texts: a Pokémon at the column's edge (a tail) is never cut.
 */
.scene-wrap { width: 100%; height: 100%; max-height: 400px; }
.detail .scene { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.text { position: relative; z-index: 1; }
/* Sound bar, in the scene's bottom corner. */
.sound { position: absolute; z-index: 1; left: 8px; bottom: 8px; display: flex; align-items: center; gap: 10px; padding: 6px 10px; border-radius: 999px; background: rgba(0, 0, 0, .35); color: #fff; font-family: var(--mono); font-size: 11px; }
.sound .toggle { padding: 0; border: 0; background: none; color: inherit; font: inherit; letter-spacing: .04em; cursor: pointer; min-width: 64px; text-align: left; }
.sound input { width: 90px; accent-color: var(--coral); cursor: pointer; }
.sound input:disabled { opacity: .4; cursor: default; }
.text { display: grid; gap: 12px; }
.text h3 { margin: 0; font-size: clamp(22px, 2.2vw, 30px); letter-spacing: -.02em; }
.text p { margin: 0; font-size: 16px; line-height: 1.55; max-width: 46ch; }
.links { list-style: none; margin: 4px 0 0; padding: 0; display: grid; gap: 8px; }
.links a { display: inline-flex; align-items: center; gap: 10px; color: var(--coral); font-size: 14.5px; }
.links img { width: 28px; height: 28px; border-radius: 4px; }
.back { justify-self: start; margin-top: 8px; padding: 0; border: 0; background: none; color: inherit; font: inherit; font-size: 13px; opacity: .7; cursor: pointer; }
.back:hover { opacity: 1; }
.detail-enter-active { transition: opacity .45s ease .1s; }
.detail-enter-active .item, .detail-enter-active .scene-wrap > * { transition: transform .6s var(--ease) .1s; }
.detail-enter-active .text { transition: transform .6s var(--ease) .15s; }
.detail-leave-active { transition: opacity .2s ease; }
.detail-enter-from, .detail-leave-to { opacity: 0; }
.detail-enter-from .item, .detail-enter-from .sound { transform: translateX(40%) scale(.85); }
/* The scene canvas is wider than its column: the same slide, scaled about the column's centre. */
.detail-enter-from .scene { transform: translateX(16%) scale(.85); transform-origin: 20% 50%; }
.detail-enter-from .text { transform: translateX(24px); }

/* Under the stage: arrows around the centred feature's name, like the home carousel. */
.controls { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 8px; transition: opacity .3s; }
.arrow { width: 40px; height: 40px; border: 1px solid currentColor; border-radius: 50%; background: none; color: inherit; cursor: pointer; font-size: 16px; }
.arrow:hover { background: var(--coral); border-color: var(--coral); color: var(--lav); }
/* Fixed width: the arrows never move when the name changes, so they can be clicked again in place. */
.name { flex: none; width: min(280px, calc(100vw - 160px)); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 8px 14px; border: 0; background: none; color: inherit; font: inherit; font-weight: 700; cursor: pointer; }
.hint { margin: 6px 0 0; text-align: center; font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: .04em; opacity: .7; transition: opacity .3s; }
.controls.hidden, .hint.hidden { opacity: 0; pointer-events: none; }

.credit { margin: 10px 0 0; text-align: center; font-size: 11px; opacity: .6; }
.credit a { color: inherit; }
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 28px; }
.detail.static { position: static; }

@media (max-width: 700px) {
  .open .stage { height: 460px; }
  .detail { grid-template-columns: 1fr; align-content: center; }
  /* Stacked layout: the scene keeps to its own block above the texts. */
  .scene-wrap { position: relative; }
  .detail .scene { position: static; }
  .detail .item { width: 150px; }
}
</style>
