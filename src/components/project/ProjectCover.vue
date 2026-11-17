<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Project } from "@/data/types";
import { prefersReducedMotion } from "@/composables/useMedia";

/** Real cover when the project has one, generated artwork otherwise (animated by LiveScene). */
const props = defineProps<{ project: Project; index: number }>();

// Read after hydration (the server cannot know); with reduced motion the picture stays complete and still.
const reduced = ref(true);
onMounted(() => (reduced.value = prefersReducedMotion()));
const live = computed(() => !props.project.cover && !reduced.value);
</script>

<template>
  <figure class="cover">
    <img v-if="project.cover" :src="project.cover" :alt="$t('a11y.preview', { name: project.name })" />
    <ProjectArt v-else :project="project" :index="index" :live="live ? 'cover' : undefined" />
    <LiveScene v-if="live" :art="project.art" />
  </figure>
</template>

<style scoped>
.cover { position: relative; margin: 0 var(--pad); aspect-ratio: 21 / 9; border-radius: 8px; overflow: hidden; background: var(--base); }
/* The picture sits between LiveScene's back layer (z 0) and front layer (z 2). */
.cover > img, .cover > canvas { position: relative; z-index: 1; width: 100%; height: 100%; object-fit: cover; }
@media (max-width: 900px) { .cover { aspect-ratio: 16 / 10; } }
</style>
