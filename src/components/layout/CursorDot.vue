<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useFinePointer, useReducedMotion } from "@/composables/useMedia";

/**
 * Follower dot for mouse users. The native cursor stays visible (accessibility);
 * the dot grows over interactive elements and shows the label of the nearest [data-cursor]
 * (as a small pill instead of a big disc when that element also has data-cursor-size="small").
 * Inside [data-cursor-quiet], it stays a plain dot.
 */
const fine = useFinePointer();
const reduced = useReducedMotion();
const dot = ref<HTMLElement | null>(null);
const label = ref("");
const big = ref(false);
const small = ref(false);
const shown = ref(false);
let raf = 0, x = 0, y = 0, tx = 0, ty = 0;

/** Easing factor per frame: lower = lazier follow. */
const FOLLOW = 0.2;

const loop = () => {
  x += (tx - x) * FOLLOW;
  y += (ty - y) * FOLLOW;
  if (dot.value) dot.value.style.transform = `translate(${x}px, ${y}px)`;
  // Stop the loop once the dot has caught up: no idle per-frame work.
  raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(loop) : 0;
};
const onMove = (e: PointerEvent) => {
  if (e.pointerType !== "mouse") return;
  tx = e.clientX; ty = e.clientY; shown.value = true;
  const target = e.target as Element | null;
  // Small controls (a volume bar) keep the plain dot: a disc or a label would cover them.
  const quiet = !!target?.closest("[data-cursor-quiet]");
  const labelled = quiet ? null : target?.closest<HTMLElement>("[data-cursor]");
  label.value = labelled?.dataset.cursor ?? "";
  small.value = labelled?.dataset.cursorSize === "small";
  big.value = !quiet && (!!labelled || !!target?.closest("a, button, summary, [role=button], .fill"));
  if (!raf) raf = requestAnimationFrame(loop);
};
const onLeave = () => (shown.value = false);

// The element under the pointer disappears on navigation: drop its label until the next move.
const route = useRoute();
watch(() => route.fullPath, () => { label.value = ""; big.value = false; });

onMounted(() => {
  addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
});
onBeforeUnmount(() => {
  removeEventListener("pointermove", onMove);
  document.documentElement.removeEventListener("pointerleave", onLeave);
  cancelAnimationFrame(raf);
});
</script>

<template>
  <div v-if="fine && !reduced" ref="dot" class="cursor" :class="{ big, labelled: !!label, small: !!label && small, shown }" aria-hidden="true">
    <span>{{ label }}</span>
  </div>
</template>

<style scoped>
.cursor { position: fixed; z-index: 70; left: 0; top: 0; width: 10px; height: 10px; margin: -5px 0 0 -5px; border-radius: 50%; background: var(--coral); pointer-events: none; opacity: 0; display: grid; place-items: center; transition: width .35s var(--ease), height .35s var(--ease), margin .35s var(--ease), background .3s, opacity .2s; mix-blend-mode: difference; }
.cursor.shown { opacity: 1; }
.cursor.big { width: 56px; height: 56px; margin: -28px 0 0 -28px; background: var(--lav); }
.cursor.labelled { width: 88px; height: 88px; margin: -44px 0 0 -44px; background: var(--coral); mix-blend-mode: normal; }
.cursor span { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: var(--ink); opacity: 0; transition: opacity .2s; }
.cursor.labelled span { opacity: 1; }
/* Small label (e.g. over a 3D scene, where the big disc would hide what it points at). */
.cursor.labelled.small { width: 76px; height: 24px; margin: 16px 0 0 -38px; border-radius: 12px; } /* just under the pointer */
.cursor.small span { font-size: 10px; letter-spacing: .04em; }
</style>
