<script setup lang="ts">
import { computed } from "vue";
import type { Project } from "@/data/types";

/** Controls under the carousel: progress arc, "← name →" pill, counter. */
const props = defineProps<{ current: Project; active: number; count: number }>();
defineEmits<{ prev: []; next: [] }>();

const pad = (n: number) => String(n).padStart(2, "0");
/** Position of the progress dot on the arc, 0 → 1. */
const arcT = computed(() => (props.count > 1 ? props.active / (props.count - 1) : 0.5));
</script>

<template>
  <div class="hud">
    <svg class="arc" viewBox="0 0 200 40" aria-hidden="true">
      <path d="M10 36 Q100 -6 190 36" />
      <circle :cx="10 + 180 * arcT" :cy="36 - 84 * arcT * (1 - arcT)" r="4" />
    </svg>
    <PillNav class="pill" prev-label="Projet précédent" next-label="Projet suivant" @prev="$emit('prev')" @next="$emit('next')">
      <NuxtLink class="name" :to="{ name: 'project', params: { slug: current.slug } }">
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
.arc circle { fill: var(--coral); transition: cx .6s var(--ease), cy .6s var(--ease); }
.pill { background: var(--base-2); border: 1px solid var(--line); }
.name { min-width: 220px; text-align: center; font-weight: 700; font-size: 20px; letter-spacing: -.03em; text-decoration: none; padding: 0 12px; }
.name:hover { color: var(--coral); }
.meta { display: flex; gap: 18px; margin: 4px 0 0; color: var(--mist); }
.swap-enter-active, .swap-leave-active { transition: opacity .25s, transform .35s var(--ease); }
.swap-enter-from { opacity: 0; transform: translateY(8px); }
.swap-leave-to { opacity: 0; transform: translateY(-8px); }
@media (max-width: 760px) { .name { min-width: 150px; font-size: 17px; } }
</style>
