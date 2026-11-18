<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { findProject } from "@/data/projects";
import { useContent } from "@/composables/useContent";
import { useProjectModal } from "@/composables/useProjectModal";
import { prefersReducedMotion } from "@/composables/useMedia";
import { PANEL_RADIUS, paintPanel } from "@/utils/projectArt";

/**
 * Home-page modal driven by `?projet=<slug>`, opening like an app launching on iPhone: the case study
 * is already inside the clicked carousel panel (shrunk), and that window grows to full screen while
 * the panel's picture fades away and the page behind zooms slightly and dims. Closing shrinks it back.
 * The URL drives everything, so the browser's back button closes it and links can be shared.
 */
const OPEN_MS = 900;
const CLOSE_MS = 650;
/** Gentle start, long soft landing, no overshoot (an unhurried take on the iOS launch). */
const OPEN_EASE = "cubic-bezier(.4, .1, .1, 1)";
/** Closing pulls back a little more evenly. */
const CLOSE_EASE = "cubic-bezier(.4, 0, .2, 1)";
/** Corner radius the window passes through mid-flight (the panel's own radius at the ends). */
const FLIGHT_RADIUS = 28;
/** The page behind zooms this much toward the panel, and dims to this opacity of black. */
const PAGE_ZOOM = 1.06;
const DIM = 0.45;

const route = useRoute();
const router = useRouter();
const { origin, locate, linkTo } = useProjectModal();
const { t } = useI18n();
const localePath = useLocalePath();
const { projects } = useContent();

const wanted = computed(() => {
  const i = findProject(String(route.query.projet ?? ""));
  return i >= 0 ? i : null;
});
/** Index on screen; lags behind `wanted` while the closing animation plays. */
const shown = ref<number | null>(null);
const root = ref<HTMLElement | null>(null);
/** The "app window": scrolls the case study, clipped to the panel's shape during the flight. */
const win = ref<HTMLElement | null>(null);
const dim = ref<HTMLElement | null>(null);
/** Pixel-identical copy of the panel (the "icon"), fading out as the window grows. */
const snap = ref<HTMLCanvasElement | null>(null);
let returnFocus: HTMLElement | null = null;

useHead({ title: () => (shown.value === null ? undefined : t("meta.projectTitle", { name: projects.value[shown.value].name })) });

/** Where the launch starts: the clicked panel, or a centred box when unknown (shared link). */
const originRect = () => origin.value ?? new DOMRect(innerWidth * 0.3, innerHeight * 0.3, innerWidth * 0.4, innerHeight * 0.4);
const lerp = (a: DOMRect, b: DOMRect, t: number) =>
  new DOMRect(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.width + (b.width - a.width) * t, a.height + (b.height - a.height) * t);

/**
 * The "app window" occupying screen rectangle `q`: its content scaled uniformly to cover `q` (cropped
 * by the clip, like iOS) and its clip-path. Opening, closing and the swipe all describe the window
 * this way, so any of them can take over from another without a jump.
 */
function windowAt(q: DOMRect, radius: number, clipTo = q) {
  const box = win.value!.getBoundingClientRect(), W = win.value!.clientWidth, H = win.value!.clientHeight;
  const s = Math.max(q.width / W, q.height / H);
  return {
    content: `translate(${q.left + q.width / 2 - box.left - (W * s) / 2}px, ${q.top + q.height / 2 - box.top - (H * s) / 2}px) scale(${s})`,
    clip: `inset(${clipTo.top - box.top}px ${box.right - clipTo.right}px ${box.bottom - clipTo.bottom}px ${clipTo.left - box.left}px round ${radius}px)`,
  };
}
/** The full-screen window: content at rest, clip covering the whole box (scrollbar included). */
function fullWindow() {
  const box = win.value!.getBoundingClientRect();
  return { rect: new DOMRect(box.left, box.top, win.value!.clientWidth, win.value!.clientHeight), clip: box };
}

/** Set by a swipe that ends in a close: where the window was under the finger, so closing starts there. */
let swiped: { rect: DOMRect; radius: number } | null = null;
/** An open / close animation is playing: swipes are ignored meanwhile. */
let busy = false;

/** Opening (forward) or closing. Resolves when done; instant with reduced motion. */
async function launch(forward: boolean) {
  const content = win.value?.querySelector<HTMLElement>(".case");
  const from = forward ? null : swiped;
  swiped = null;
  if (prefersReducedMotion() || !win.value || !dim.value || !snap.value || !content || shown.value === null) return;
  const page = document.getElementById("main");
  if (!forward) {
    // Close into the project now on screen (it may differ after prev / next): the carousel puts it in
    // the centre and measures it. The page is measured unzoomed (its final state); the window covers
    // everything at this instant, so dropping the zoom here is invisible and it is replayed below.
    page?.getAnimations().forEach((a) => a.cancel());
    origin.value = locate.value?.(projects.value[shown.value].slug) ?? origin.value;
  }
  const r = originRect();
  const timing: KeyframeAnimationOptions = forward
    ? { duration: OPEN_MS, easing: OPEN_EASE, fill: "forwards" }
    : { duration: CLOSE_MS, easing: CLOSE_EASE, fill: "forwards" };

  const dock = content.querySelector<HTMLElement>(".dock");
  if (!forward) {
    // Shrink what is on screen: trade the scroll offset for a margin (same frame), and hide the dock,
    // which would otherwise jump once the content is transformed.
    const top = win.value.scrollTop;
    content.style.marginTop = `${-top}px`;
    win.value.scrollTop = 0;
    if (dock) dock.style.opacity = "0";
  }

  // The two ends: the panel (the "icon"), and the open window (full screen, or wherever a swipe left it).
  const full = fullWindow();
  const openRect = from?.rect ?? full.rect, openClip = from?.rect ?? full.clip;
  const panel = windowAt(r, PANEL_RADIUS * r.height);
  const open = windowAt(openRect, from?.radius ?? 0, openClip);
  // Rounder mid-flight: 60% of the way out, 40% of the way back.
  const at = forward ? 0.6 : 0.4;
  const mid = windowAt(lerp(r, openRect, at), FLIGHT_RADIUS, lerp(r, openClip, at)).clip;
  /** [start, end] of a value, from its panel and open-window versions. */
  const ends = <T,>(atPanel: T, atOpen: T): [T, T] => (forward ? [atPanel, atOpen] : [atOpen, atPanel]);

  const [c0, c1] = ends(panel.content, open.content);
  const grow = content.animate([{ transform: c0, transformOrigin: "0 0" }, { transform: c1, transformOrigin: "0 0" }], timing);
  const [k0, k1] = ends(panel.clip, open.clip);
  const shape = win.value.animate([{ clipPath: k0 }, { clipPath: mid, offset: at }, { clipPath: k1 }], timing);
  // A swipe's inline styles are covered by the animations from here on.
  content.style.transform = win.value.style.clipPath = "";

  // The "icon": the panel's own picture, stretched over the same rectangle, gone early in the flight.
  paintPanel(snap.value, projects.value[shown.value], shown.value);
  const sw = snap.value.offsetWidth, sh = snap.value.offsetHeight;
  const over = (q: DOMRect) => `translate(${q.left}px, ${q.top}px) scale(${q.width / sw}, ${q.height / sh})`;
  const [i0, i1] = ends({ transform: over(r), opacity: 1 }, { transform: over(openRect), opacity: 0 });
  snap.value.animate([i0, { opacity: 0, offset: forward ? 0.35 : 0.65 }, i1], timing);

  const [d0, d1] = ends(0, DIM);
  dim.value.animate([{ opacity: d0 }, { opacity: d1 }], timing);
  // The page zooms toward the panel and stays zoomed (filled) while the modal is open.
  if (page) {
    const pb = page.getBoundingClientRect();
    page.style.transformOrigin = `${r.left + r.width / 2 - pb.left}px ${r.top + r.height / 2 - pb.top}px`;
  }
  const [z0, z1] = ends("none", `scale(${PAGE_ZOOM})`);
  const zoom = page?.animate([{ transform: z0 }, { transform: z1 }], timing);

  await grow.finished;
  if (!forward) zoom?.cancel(); // back to normal: its end state is the natural one
  if (forward) {
    // Landed: drop the filled end states (equal to the natural ones) so the dock is fixed to the screen again.
    grow.cancel();
    shape.cancel();
    dock?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: "ease-out" });
  }
}

// ---- Swipe down to close (touch) ---------------------------------------------------------------
/**
 * From the top of the case study, pulling down grabs the window: it follows the finger, shrinking
 * and rounding its corners. Released far or fast enough, it closes from there; otherwise it springs back.
 */
const SWIPE = {
  /** Finger travel before the window lets go of the page and follows. */
  startPx: 8,
  /** Releasing past this distance, or faster than this (px/ms), closes. */
  closePx: 140,
  closeSpeed: 0.6,
  /** Smallest the window gets, and its corner radius once well grabbed. */
  minScale: 0.7,
  radius: 32,
};
let touch: { x: number; y: number; atTop: boolean; on: boolean; dy: number; lastT: number; speed: number } | null = null;
const caseEl = () => win.value?.querySelector<HTMLElement>(".case") ?? null;
const dockEl = () => win.value?.querySelector<HTMLElement>(".dock") ?? null;

function onTouchStart(e: TouchEvent) {
  if (busy || e.touches.length !== 1 || !win.value) return;
  const t = e.touches[0];
  touch = { x: t.clientX, y: t.clientY, atTop: win.value.scrollTop <= 0, on: false, dy: 0, lastT: e.timeStamp, speed: 0 };
}

function onTouchMove(e: TouchEvent) {
  const content = caseEl();
  if (!touch || !win.value || !content) return;
  const t = e.touches[0];
  const dx = t.clientX - touch.x, dy = t.clientY - touch.y;
  if (!touch.on) {
    // Anything but a downward pull from the top is ordinary scrolling.
    if (!touch.atTop || dy < 0 || Math.abs(dx) > Math.abs(dy)) return void (touch = null);
    e.preventDefault(); // no overscroll / pull-to-refresh while deciding
    if (dy < SWIPE.startPx) return;
    touch.on = true;
    const dock = dockEl();
    if (dock) dock.style.opacity = "0"; // it would jump once the content is transformed
  }
  e.preventDefault();
  touch.speed = (dy - touch.dy) / Math.max(1, e.timeStamp - touch.lastT);
  touch.dy = dy;
  touch.lastT = e.timeStamp;

  // Scale around the point first touched, so that point stays under the finger.
  const box = win.value.getBoundingClientRect(), W = win.value.clientWidth, H = win.value.clientHeight;
  const k = Math.max(SWIPE.minScale, 1 - (dy / H) * 0.6);
  const q = new DOMRect(t.clientX - (touch.x - box.left) * k, t.clientY - (touch.y - box.top) * k, W * k, H * k);
  const radius = SWIPE.radius * Math.min(1, dy / 120);
  const g = windowAt(q, radius);
  content.style.transformOrigin = "0 0";
  content.style.transform = g.content;
  win.value.style.clipPath = g.clip;
  swiped = { rect: q, radius };
}

function onTouchEnd() {
  const gesture = touch;
  touch = null;
  const content = caseEl();
  if (!gesture?.on || !win.value || !content || !swiped) return;
  // Closing starts from `swiped`, where the finger left the window.
  if (gesture.dy > SWIPE.closePx || gesture.speed > SWIPE.closeSpeed) return close();

  // Spring back to full screen, then hand the window back to its normal state.
  const from = windowAt(swiped.rect, swiped.radius), to = fullWindow();
  const back: KeyframeAnimationOptions = { duration: 380, easing: "cubic-bezier(.2, .9, .3, 1)" };
  content.animate([{ transform: from.content, transformOrigin: "0 0" }, { transform: windowAt(to.rect, 0).content, transformOrigin: "0 0" }], back);
  win.value.animate([{ clipPath: from.clip }, { clipPath: windowAt(to.rect, 0, to.clip).clip }], back);
  content.style.transform = win.value.style.clipPath = "";
  swiped = null;
  const dock = dockEl();
  if (dock) {
    dock.style.opacity = "";
    dock.animate([{ opacity: 0 }, { opacity: 1 }], { ...back, delay: 200, fill: "backwards" });
  }
}

/**
 * Stops the page from scrolling behind the modal without changing its width: the scrollbar that
 * disappears is replaced by the same amount of padding, so nothing reflows on open or close.
 */
function lockPage(lock: boolean) {
  const html = document.documentElement;
  html.style.paddingRight = lock ? `${innerWidth - html.clientWidth}px` : "";
  html.classList.toggle("modal-open", lock);
}

/**
 * The page's scrollbar and the window's sit at the same place (the window spans 100vw), but the
 * window's is clipped away while it flies. So the page is locked (its scrollbar removed) only once the
 * window has landed, and unlocked as soon as it takes off: a scrollbar stays on screen throughout.
 * Meanwhile the page must not scroll under the flying window: wheel, touch and scroll keys are held.
 */
const SCROLL_KEYS = new Set([" ", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown"]);
function holdScroll(e: Event) {
  if (!busy) return;
  if (e instanceof KeyboardEvent && !SCROLL_KEYS.has(e.key)) return;
  e.preventDefault();
}
const HOLD_EVENTS = ["wheel", "touchmove", "keydown"] as const;
function holdPage(hold: boolean) {
  for (const type of HOLD_EVENTS) {
    if (hold) addEventListener(type, holdScroll, { passive: false });
    else removeEventListener(type, holdScroll);
  }
}

async function show(i: number) {
  returnFocus = document.activeElement as HTMLElement | null;
  shown.value = i;
  await nextTick();
  root.value?.focus();
  busy = true;
  holdPage(true);
  await launch(true);
  lockPage(true);
  holdPage(false);
  busy = false;
}
async function hide() {
  busy = true;
  holdPage(true);
  lockPage(false);
  await launch(false);
  holdPage(false);
  busy = false;
  shown.value = null;
  returnFocus?.focus({ preventScroll: true });
}

watch(wanted, async (i, before) => {
  if (i !== null && shown.value === null) await show(i);
  else if (i === null && shown.value !== null) await hide();
  else if (i !== null && i !== before) {
    // Switching project inside the modal: ProjectCase fades it, then `swapped` brings the view to the top.
    shown.value = i;
  }
});

/** Back to the page when the modal was opened from it, otherwise just drop the query. */
function close() {
  const cameFromPage = typeof history.state?.back === "string" && !history.state.back.includes("projet=");
  if (cameFromPage) router.back();
  else navigateTo(localePath({ path: "/", hash: "#travaux" }), { replace: true });
}
const onKey = (e: KeyboardEvent) => e.key === "Escape" && shown.value !== null && close();

onMounted(() => {
  addEventListener("keydown", onKey);
  // Shared link (?projet=…): the page is prerendered without it, so open once hydrated.
  if (wanted.value !== null) show(wanted.value);
});
onBeforeUnmount(() => {
  removeEventListener("keydown", onKey);
  holdPage(false);
  lockPage(false);
});
</script>

<template>
  <div
    v-if="shown !== null"
    ref="root"
    class="modal"
    role="dialog"
    aria-modal="true"
    :aria-label="projects[shown].name"
    tabindex="-1"
  >
    <div ref="dim" class="dim" aria-hidden="true" />
    <div
      ref="win"
      class="window"
      :data-scroll="projects[shown].theme ?? 'site'"
      @touchstart.passive="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <ProjectCase :index="shown" :link-to="linkTo" replace @close="close" @swapped="win?.scrollTo({ top: 0 })" />
      <canvas ref="snap" class="snap" aria-hidden="true" />
    </div>
  </div>
</template>

<style scoped>
.modal { position: fixed; inset: 0; z-index: 65; outline: none; }
.dim { position: fixed; inset: 0; background: #000; opacity: 0; }
/*
 * Stable gutter: the scrollbar comes and goes as the content scales; without it the width (and layout) would jump.
 * 100vw, not right: 0: the window keeps the same width whether the page behind still shows its
 * scrollbar (while the window flies) or not (once it has landed), and its scrollbar takes that one's place.
 */
.window { position: fixed; top: 0; bottom: 0; left: 0; width: 100vw; overflow-y: auto; overscroll-behavior: contain; scrollbar-gutter: stable; scrollbar-width: thin; }
/* Above the content, at full-window size; squeezed onto the panel by the animation. */
.snap { position: fixed; left: 0; top: 0; width: 100%; height: 100%; transform-origin: 0 0; opacity: 0; pointer-events: none; }
</style>
