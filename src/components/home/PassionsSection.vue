<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useContent } from "@/composables/useContent";
import { useInView } from "@/composables/useInView";
import { prefersReducedMotion } from "@/composables/useMedia";

/**
 * Passions as a horizontal rail: the section is pinned while the vertical scroll (smoothed by
 * Lenis) slides one screen-wide panel per passion sideways. A fixed 3D stage beside the texts
 * holds ONE voxel cloud that reshapes itself into the passion on screen (see voxelMorph.ts)
 * and sways with the rail's speed. With reduced motion: a plain vertical list.
 */
const { copy } = useContent();
const items = computed(() => copy.value.passions.items);

const root = ref<HTMLElement | null>(null);
const pin = ref<HTMLElement | null>(null);
const rail = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const bar = ref<HTMLElement | null>(null);
const mode = ref<"rail" | "static">("rail");
/** Passion on screen (the intro counts as the first one). */
const active = ref(0);
const inView = useInView(root, "200px");

/**
 * Where the shape sits in the full-width canvas (shares of its width / height) and how high the
 * voxels' rainbow climbs between two panels. Wide screens: the shape in the left column, the
 * rainbow high enough to clear the text on the right. Phones: the shape centred in the top half
 * (the text is below it), a low arc. Same breakpoint as the CSS below.
 */
const NARROW = "(max-width: 760px)";
const FRAME_WIDE = { stage: 0.56, anchor: 0.28, rise: 0.33 };
const FRAME_NARROW = { stage: 1, anchor: 0.5, rise: 0.14 };

type Morph =ReturnType<typeof import("@/components/passions/voxelMorph").createVoxelMorph>;
let morph: Morph | null = null;
let tried = false;
let raf = 0;
/** Rail length beyond the screen, and one panel's width (panels are one screen wide). */
let dist = 0;
let panelW = 1;
let panels: HTMLElement[] = [];
let lastX = 0;
let speed = 0;
let px = 0;
let py = 0;
let tx = 0;
let ty = 0;

function measure() {
  if (!root.value || !pin.value || !rail.value) return;
  panelW = pin.value.clientWidth;
  // Panels are exactly one pin wide (100vw would include the scrollbar and drift).
  rail.value.style.setProperty("--pw", `${panelW}px`);
  panels = [...rail.value.querySelectorAll<HTMLElement>(".panel")];
  dist = panelW * (panels.length - 1);
  root.value.style.height = `${dist + pin.value.clientHeight}px`;
  const c = canvas.value;
  if (c && morph) morph.setSize(c.clientWidth, c.clientHeight, matchMedia(NARROW).matches ? FRAME_NARROW : FRAME_WIDE);
}

function frame(now: number) {
  raf = requestAnimationFrame(frame);
  if (!root.value || !rail.value) return;
  const p = dist ? Math.min(1, Math.max(0, -root.value.getBoundingClientRect().top / dist)) : 0;
  const x = p * dist;
  rail.value.style.transform = `translate3d(${-x}px,0,0)`;
  if (bar.value) bar.value.style.transform = `scaleX(${p})`;
  speed += (x - lastX - speed) * 0.12;
  lastX = x;
  px += (tx - px) * 0.06;
  py += (ty - py) * 0.06;

  // Rail position in panels: 0 = intro (raw matter), 1 = first passion… One shape per panel.
  // Not eased: each shape is pinned to its panel, so the morph must follow the rail exactly
  // (Lenis already smooths the scroll).
  const pos = x / panelW;
  const n = items.value.length;
  const t = Math.min(n, Math.max(0, pos));
  panels.forEach((el, i) => el.style.setProperty("--k", Math.max(0, 1 - Math.abs(i - pos) * 1.4).toFixed(3)));
  const a = Math.min(n - 1, Math.max(0, Math.round(pos) - 1));
  if (a !== active.value) active.value = a;
  morph?.render(t, now / 1000, px, py, Math.max(-1, Math.min(1, speed / 40)));
}

async function init() {
  if (tried || !canvas.value) return;
  tried = true;
  try {
    const { createVoxelMorph } = await import("@/components/passions/voxelMorph");
    morph = createVoxelMorph(canvas.value);
    measure();
  } catch {
    morph = null; // No WebGL: the rail still slides, the panels keep their big numbers.
  }
}

const onPointer = (e: PointerEvent) => {
  if (e.pointerType !== "mouse") return;
  tx = (e.clientX / innerWidth) * 2 - 1;
  ty = (e.clientY / innerHeight) * 2 - 1;
};

watch(inView, (v) => {
  if (mode.value !== "rail") return;
  cancelAnimationFrame(raf);
  if (!v) return;
  void init();
  raf = requestAnimationFrame(frame);
});

onMounted(() => {
  if (prefersReducedMotion()) {
    mode.value = "static";
    return;
  }
  measure();
  addEventListener("resize", measure, { passive: true });
  addEventListener("pointermove", onPointer, { passive: true });
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  removeEventListener("resize", measure);
  removeEventListener("pointermove", onPointer);
  morph?.dispose();
});
</script>

<template>
  <section id="passions" ref="root" class="pas" :class="`is-${mode}`" aria-labelledby="pas-t">
    <div ref="pin" class="pin">
      <div ref="rail" class="rail">
        <header class="panel intro">
          <div class="txt">
            <h2 id="pas-t" class="big-title">{{ $t("passions.title") }} <em>{{ $t("passions.titleEm") }}</em></h2>
            <p class="lede">{{ copy.passions.intro }}</p>
          </div>
        </header>
        <article v-for="(p, i) in items" :key="p.id" class="panel item">
          <span class="ghost" aria-hidden="true">0{{ i + 1 }}</span>
          <div class="txt">
            <span class="mono idx"><b>0{{ i + 1 }}</b>{{ p.tag }}</span>
            <h3>{{ p.name }}</h3>
            <p>{{ p.text }}</p>
          </div>
        </article>
      </div>
      <canvas ref="canvas" class="gl" aria-hidden="true" />
      <div class="hud mono" aria-hidden="true">
        <span>0{{ active + 1 }} / 0{{ items.length }}</span>
        <span>{{ items[active]?.name }}</span>
        <span class="track"><i ref="bar" /></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pas { position: relative; background: var(--base-2); min-height: 100vh; }
.pin { position: sticky; top: 0; height: 100vh; height: 100svh; overflow: hidden; }
/* Out of the flow: the rail is several screens wide and must not widen the page. */
.rail { position: absolute; top: 0; left: 0; display: flex; height: 100%; will-change: transform; }
/* Full width, over the panels, so the voxels can fly above the text; the shape itself sits on the left (FRAME_WIDE). */
.gl { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }

.panel { --k: 0; position: relative; flex: none; width: var(--pw, 100vw); height: 100%; display: flex; align-items: center; padding: calc(var(--header-h) + 24px) var(--pad) 80px calc(var(--pw, 100vw) * .56); }
.txt { max-width: 480px; opacity: calc(.15 + .85 * var(--k)); transform: translateX(calc((1 - var(--k)) * 80px)); }
.lede { margin: 0; max-width: 30ch; font-size: clamp(18px, 1.8vw, 26px); color: var(--mist); }
.ghost { position: absolute; left: 6%; top: 50%; translate: 0 -50%; font-size: clamp(160px, 28vw, 440px); font-weight: 700; letter-spacing: -.08em; line-height: 1; color: transparent; -webkit-text-stroke: 1px rgba(238, 237, 255, .12); }
.idx { color: var(--mist); }
.idx b { font-weight: 500; color: var(--coral); margin-right: 14px; }
h3 { margin: 14px 0 14px; font-size: clamp(44px, 5.6vw, 92px); font-weight: 700; letter-spacing: -.05em; line-height: .95; }
.txt p { margin: 0; font-size: 17px; line-height: 1.55; opacity: .9; }

.hud { position: absolute; left: var(--pad); right: var(--pad); bottom: 28px; z-index: 2; display: flex; align-items: center; gap: 18px; color: var(--mist); }
.track { flex: 1; height: 1px; background: var(--line); }
.track i { display: block; height: 100%; background: var(--coral); transform-origin: left; transform: scaleX(0); }

/* Phones: the stage takes the top half, each panel's text the bottom half. */
@media (max-width: 760px) {
  .gl { width: 100%; height: 50%; top: var(--header-h); }
  .panel { align-items: flex-end; padding: 0 var(--pad) 84px; }
  .ghost { left: 50%; top: calc(var(--header-h) + 25%); translate: -50% -50%; font-size: 58vw; }
  .txt { transform: translateX(calc((1 - var(--k)) * 40px)); }
  .txt p { font-size: 15px; }
}

/* Reduced motion: no pin, no 3D, the panels simply stack. */
.is-static { min-height: 0; }
.is-static .pin { position: static; height: auto; overflow: visible; }
.is-static .rail { position: static; flex-direction: column; transform: none !important; }
.is-static .panel { --k: 1; width: auto; height: auto; padding: 48px var(--pad); }
.is-static .intro { padding-top: clamp(80px, 14vh, 160px); }
.is-static .item { border-top: 1px solid var(--line); }
.is-static .gl, .is-static .hud, .is-static .ghost { display: none; }
</style>
