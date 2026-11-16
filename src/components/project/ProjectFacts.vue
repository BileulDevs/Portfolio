<script setup lang="ts">
import type { Project } from "@/data/types";

/** Sticky fact sheet beside the case study. */
defineProps<{ project: Project }>();
</script>

<template>
  <dl class="facts">
    <div><dt>Rôle</dt><dd>{{ project.role }}</dd></div>
    <div><dt>Période</dt><dd>{{ project.period }}</dd></div>
    <div><dt>Statut</dt><dd>{{ project.status }}</dd></div>
    <div><dt>Stack</dt><dd>{{ project.stack.join(", ") }}</dd></div>
    <div v-if="project.url">
      <dt>Lien</dt>
      <dd><a :href="project.url" target="_blank" rel="noopener">{{ project.urlLabel ?? project.url }} ↗</a></dd>
    </div>
  </dl>
</template>

<style scoped>
.facts { align-self: start; position: sticky; top: 96px; display: grid; gap: 16px; margin: 0; font-size: 15px; }
dt { font-family: var(--mono); font-size: 11px; text-transform: uppercase; color: var(--slate); }
dd { margin: 2px 0 0; font-weight: 500; }
@media (max-width: 900px) { .facts { position: static; grid-template-columns: 1fr 1fr; } }
</style>
