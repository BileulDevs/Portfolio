<script setup lang="ts">
import type { Project } from "@/data/types";

/** Real cover when the project has one, generated artwork otherwise. */
defineProps<{ project: Project; index: number }>();
</script>

<template>
  <figure class="cover">
    <img v-if="project.cover" :src="project.cover" :alt="$t('a11y.preview', { name: project.name })" />
    <ProjectArt v-else :project="project" :index="index" />
  </figure>
</template>

<style scoped>
.cover { margin: 0 var(--pad); aspect-ratio: 21 / 9; border-radius: 8px; overflow: hidden; background: var(--base); }
.cover > * { width: 100%; height: 100%; object-fit: cover; }
@media (max-width: 900px) { .cover { aspect-ratio: 16 / 10; } }
</style>
