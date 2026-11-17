<script setup lang="ts">
import { ref } from "vue";
import type { Project } from "@/data/types";
import { prefersReducedMotion } from "@/composables/useMedia";
import { useProjectModal } from "@/composables/useProjectModal";

/** Native horizontal track: the carousel's fallback when WebGL is missing or motion is reduced. */
defineProps<{ projects: Project[] }>();
const emit = defineEmits<{ active: [index: number] }>();

const { origin, linkTo } = useProjectModal();
const GAP_PX = 20; // must match the flex gap below

const track = ref<HTMLElement | null>(null);
const cardStep = () => (track.value?.querySelector<HTMLElement>("li")?.offsetWidth ?? 300) + GAP_PX;

function onScroll() {
  if (track.value) emit("active", Math.round(track.value.scrollLeft / cardStep()));
}
/** Scrolls by `delta` cards; used by the HUD and keyboard arrows. */
function scrollByCards(delta: number) {
  track.value?.scrollBy({ left: delta * cardStep(), behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
/** Shows card `i` at once (no smooth scroll) and returns its artwork's screen rectangle. */
function showCard(i: number) {
  if (!track.value) return null;
  track.value.scrollLeft = i * cardStep();
  return track.value.querySelectorAll("canvas")[i]?.getBoundingClientRect() ?? null;
}
defineExpose({ scrollByCards, showCard });

/** The modal dives out of the clicked card's artwork. */
const pick = (e: MouseEvent) => (origin.value = (e.currentTarget as HTMLElement).querySelector("canvas")?.getBoundingClientRect() ?? null);
</script>

<template>
  <ul ref="track" class="track" @scroll.passive="onScroll">
    <li v-for="(p, i) in projects" :key="p.slug">
      <NuxtLink :to="linkTo(p.slug)" class="card" @click="pick">
        <ProjectArt :project="p" :index="i" />
        <span class="meta"><b>{{ p.name }}</b><span class="mono">{{ p.kind }}</span></span>
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
.track { list-style: none; margin: 0; display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory; padding: 0 var(--pad) 18px; scrollbar-width: thin; scrollbar-color: var(--coral) transparent; }
li { flex: 0 0 min(78vw, 640px); scroll-snap-align: center; }
.card { display: grid; gap: 12px; text-decoration: none; }
.card canvas { width: 100%; aspect-ratio: 16 / 10; border-radius: 8px; }
.meta { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.meta b { font-size: clamp(26px, 3vw, 40px); letter-spacing: -.04em; }
.card:hover b { color: var(--coral); }
</style>
