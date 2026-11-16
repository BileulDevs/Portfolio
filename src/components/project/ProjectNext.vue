<script setup lang="ts">
import type { Project } from "@/data/types";

/** Full-width link to the next case study. */
defineProps<{ project: Project }>();
</script>

<template>
  <NuxtLink class="next" :to="{ name: 'project', params: { slug: project.slug } }">
    <span class="mono">Projet suivant</span>
    <strong>{{ project.name }} →</strong>
  </NuxtLink>
</template>

<style scoped>
.next { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; padding: 48px var(--pad); background: var(--base); color: var(--lav); text-decoration: none; }
strong { font-size: clamp(36px, 6vw, 96px); font-weight: 800; letter-spacing: -.06em; transition: color .3s, transform .5s var(--ease); }
.next:hover strong { color: var(--coral); transform: translateX(-10px); }
</style>
