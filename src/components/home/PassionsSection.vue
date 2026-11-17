<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useContent } from "@/composables/useContent";
import { useInView } from "@/composables/useInView";
import { prefersReducedMotion } from "@/composables/useMedia";

/**
 * Passions as a scrollytelling block: a sticky 3D stage on one side, the passions scrolling by
 * on the other. The stage holds ONE voxel cloud that reshapes itself into the passion being
 * read (see voxelMorph.ts), driven by the scroll (smoothed by Lenis).
 * With reduced motion: no stage, just the list.
 */
const { copy } = useContent();
const items = computed(() => copy.value.passions.items);

const root = ref<HTMLElement | null>(null);
const steps = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const mode = ref<"morph" | "static">("morph");
const active = ref(0);
const inView = useInView(root, "200px");

type Morph = ReturnType<typeof import("@/components/passions/voxelMorph").createVoxelMorph>;
let morph: Morph | null = null;
let tried = false;
let raf = 0;
/** Eased morph position, chasing the scroll target. */
let t = 0;
let px = 0;
let py = 0;
let tx = 0;
let ty = 0;

/** Morph target from the scroll: step i centred in the viewport = shape i. */
function scrollTarget() {
  const el = steps.value;
  if (!el) return 0;
  const n = items.value.length;
  const r = el.getBoundingClientRect();
  const stepH = r.height / n;
  return Math.min(n - 1, Math.max(0, (innerHeight / 2 - r.top) / stepH - 0.5));
}

function frame(now: number) {
  raf = requestAnimationFrame(frame);
  const target = scrollTarget();
  t += (target - t) * 0.09;
  px += (tx - px) * 0.06;
  py += (ty - py) * 0.06;
  const a = Math.round(target);
  if (a !== active.value) active.value = a;
  morph?.render(t, now / 1000, px, py);
}

function resize() {
  const c = canvas.value;
  if (c && morph) morph.setSize(c.clientWidth, c.clientHeight);
}

async function init() {
  if (tried || !canvas.value) return;
  tried = true;
  try {
    const { createVoxelMorph } = await import("@/components/passions/voxelMorph");
    morph = createVoxelMorph(canvas.value);
    t = scrollTarget();
    resize();
  } catch {
    morph = null; // No WebGL: the stage keeps its big number, the texts still scroll.
  }
}

const onPointer = (e: PointerEvent) => {
  if (e.pointerType !== "mouse") return;
  tx = (e.clientX / innerWidth) * 2 - 1;
  ty = (e.clientY / innerHeight) * 2 - 1;
};

watch(inView, (v) => {
  if (mode.value !== "morph") return;
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
  addEventListener("resize", resize, { passive: true });
  addEventListener("pointermove", onPointer, { passive: true });
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  removeEventListener("resize", resize);
  removeEventListener("pointermove", onPointer);
  morph?.dispose();
});
</script>

<template>
  <section id="passions" ref="root" class="pas" :class="`is-${mode}`" aria-labelledby="pas-t">
    <header class="head">
      <h2 id="pas-t" v-reveal class="big-title rv">{{ $t("passions.title") }} <em>{{ $t("passions.titleEm") }}</em></h2>
      <p v-reveal class="intro rv">{{ copy.passions.intro }}</p>
    </header>
    <div class="scrolly">
      <div class="stage" aria-hidden="true">
        <span :key="active" class="ghost">0{{ active + 1 }}</span>
        <canvas ref="canvas" class="gl" />
        <div class="hud mono">
          <span v-for="(p, i) in items" :key="p.id" class="dot" :class="{ on: i === active }" />
          <span class="label">0{{ active + 1 }} / 0{{ items.length }} — {{ items[active]?.name }}</span>
        </div>
      </div>
      <ol ref="steps" class="steps">
        <li v-for="(p, i) in items" :key="p.id" class="step" :class="{ on: i === active }">
          <div class="txt">
            <span class="mono idx">0{{ i + 1 }} — {{ p.tag }}</span>
            <h3>{{ p.name }}</h3>
            <p>{{ p.text }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.pas { background: var(--base-2); padding: clamp(80px, 14vh, 160px) var(--pad) clamp(40px, 8vh, 96px); }
.intro { margin: 0; max-width: 40ch; font-size: clamp(17px, 1.6vw, 22px); color: var(--mist); }

.scrolly { display: grid; grid-template-columns: 1.35fr 1fr; gap: clamp(24px, 4vw, 72px); }
.stage { position: sticky; top: 0; height: 100vh; height: 100svh; display: grid; place-items: center; }
.gl { position: absolute; inset: 0; width: 100%; height: 100%; }
.ghost { font-size: clamp(160px, 26vw, 420px); font-weight: 700; letter-spacing: -.08em; line-height: 1; color: transparent; -webkit-text-stroke: 1px rgba(238, 237, 255, .12); animation: ghost-in .9s var(--ease); }
@keyframes ghost-in { from { opacity: 0; transform: translateY(30px) scale(.96); } }
.hud { position: absolute; left: 0; bottom: 32px; display: flex; align-items: center; gap: 8px; color: var(--mist); }
.dot { width: 22px; height: 2px; background: var(--line); transition: background .4s, width .4s var(--ease); }
.dot.on { width: 44px; background: var(--coral); }
.label { margin-left: 10px; }

.steps { list-style: none; margin: 0; padding: 0; }
.step { min-height: 100vh; min-height: 100svh; display: flex; align-items: center; }
.txt { max-width: 460px; opacity: .22; transform: translateY(24px); transition: opacity .6s var(--ease), transform .8s var(--ease); }
.step.on .txt { opacity: 1; transform: none; }
.idx { color: var(--mist); }
h3 { margin: 14px 0 14px; font-size: clamp(44px, 5.6vw, 92px); font-weight: 700; letter-spacing: -.05em; line-height: .95; }
.step.on h3 em, .step.on h3 { color: var(--lav); }
.txt p { margin: 0; font-size: 17px; line-height: 1.55; opacity: .9; }

/* Phones: the stage stays at the top, the texts scroll up under it. */
@media (max-width: 760px) {
  .scrolly { grid-template-columns: 1fr; gap: 0; }
  .stage { height: 52svh; z-index: 1; pointer-events: none; background: linear-gradient(var(--base-2) 82%, transparent); }
  .hud { bottom: 8px; }
  .step { min-height: 85svh; align-items: flex-end; padding-bottom: 12svh; }
  .txt p { font-size: 15px; }
}

/* Reduced motion: no stage, the passions simply stack. */
.is-static .scrolly { display: block; margin-top: 40px; }
.is-static .stage { display: none; }
.is-static .step { min-height: 0; padding: 32px 0; border-top: 1px solid var(--line); }
.is-static .txt { opacity: 1; transform: none; }
</style>
