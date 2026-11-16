<script setup lang="ts">
import type { Project } from "@/data/types";

/** Bottom bar of a case study: back, previous / next project, close. */
defineProps<{ project: Project; prev: Project; next: Project }>();
defineEmits<{ close: []; go: [slug: string] }>();
</script>

<template>
  <nav class="dock" aria-label="Navigation entre projets">
    <button class="round" type="button" aria-label="Retour aux projets" @click="$emit('close')">←</button>
    <PillNav
      class="pill"
      :prev-label="`Projet précédent : ${prev.name}`"
      :next-label="`Projet suivant : ${next.name}`"
      @prev="$emit('go', prev.slug)"
      @next="$emit('go', next.slug)"
    >
      <span>{{ project.name }}</span>
    </PillNav>
    <button class="round" type="button" aria-label="Fermer le projet" @click="$emit('close')">✕</button>
  </nav>
</template>

<style scoped>
.dock { position: fixed; z-index: 40; left: 0; right: 0; bottom: 18px; display: flex; justify-content: space-between; align-items: center; padding: 0 var(--pad); pointer-events: none; }
.dock > * { pointer-events: auto; }
.round { width: 48px; height: 48px; border-radius: 50%; border: 0; background: var(--ink); color: var(--lav); cursor: pointer; font-size: 17px; }
.round:hover { background: var(--coral); color: var(--ink); }
.pill { background: var(--ink); color: var(--lav); }
.pill span { min-width: 180px; text-align: center; font-weight: 700; letter-spacing: -.02em; }
@media (max-width: 900px) { .pill span { min-width: 110px; font-size: 15px; } }
</style>
