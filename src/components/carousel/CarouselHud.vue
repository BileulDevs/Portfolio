<script setup lang="ts">
import { computed } from "vue";
import type { Project } from "@/data/types";
import { useProjectModal } from "@/composables/useProjectModal";

/** Controls under the carousel: progress arc, "← name →" pill, counter. */
const props = defineProps<{
  current: Project;
  active: number;
  count: number;
  /** Where the dot is along the arc, 0 → 1, updated every frame from the carousel's live position. */
  progress: number;
}>();
/** `pick`: the name link was clicked, right before the modal opens. */
defineEmits<{ prev: []; next: []; pick: [] }>();
const { linkTo } = useProjectModal();

const pad = (n: number) => String(n).padStart(2, "0");
/** The dot sits on the arc's own curve (the quadratic Bézier M10 36 Q100 -6 190 36), never off it. */
const dot = computed(() => {
  const t = props.progress;
  return { x: 10 + 180 * t, y: 36 - 84 * t * (1 - t) };
});
</script>

<template>
  <div class="hud">
    <svg class="arc" viewBox="0 0 200 40" aria-hidden="true">
      <path d="M10 36 Q100 -6 190 36" />
      <circle :cx="dot.x" :cy="dot.y" r="4" />
    </svg>
    <PillNav class="pill" :prev-label="$t('a11y.prevProject')" :next-label="$t('a11y.nextProject')" @prev="$emit('prev')" @next="$emit('next')">
      <NuxtLink class="name" :to="linkTo(current.slug)" @click="$emit('pick')">
        <Transition name="swap" mode="out-in">
          <span :key="current.slug">{{ current.name }}</span>
        </Transition>
      </NuxtLink>
    </PillNav>
    <p class="meta mono"><span>{{ pad(active + 1) }} / {{ pad(count) }}</span><span>{{ current.kind }}</span></p>
  </div>
</template>

<style scoped>
.hud { display: grid; justify-items: center; gap: 6px; margin-top: clamp(4px, 1.5vh, 16px); padding: 0 var(--pad); }
.arc { width: 160px; height: 32px; overflow: visible; }
.arc path { fill: none; stroke: var(--line); stroke-width: 1.5; }
/* No CSS transition: the motion comes from the carousel itself, frame by frame. */
.arc circle { fill: var(--coral); }
.pill { background: var(--base-2); border: 1px solid var(--line); }
.name { min-width: 220px; text-align: center; font-weight: 700; font-size: 20px; letter-spacing: -.03em; text-decoration: none; padding: 0 12px; }
.name:hover { color: var(--coral); }
.meta { display: flex; gap: 18px; margin: 4px 0 0; color: var(--mist); }
.swap-enter-active, .swap-leave-active { transition: opacity .25s, transform .35s var(--ease); }
.swap-enter-from { opacity: 0; transform: translateY(8px); }
.swap-leave-to { opacity: 0; transform: translateY(-8px); }
@media (max-width: 760px) { .name { min-width: 150px; font-size: 17px; } }
</style>
