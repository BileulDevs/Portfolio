<script setup lang="ts">
import type { Project } from "@/data/types";

/** Sticky fact sheet beside the case study. */
defineProps<{ project: Project }>();
</script>

<template>
  <dl class="facts">
    <div><dt><AppIcon name="role" :size="12" />{{ $t("case.role") }}</dt><dd>{{ project.role }}</dd></div>
    <div><dt><AppIcon name="period" :size="12" />{{ $t("case.period") }}</dt><dd>{{ project.period }}</dd></div>
    <div><dt><AppIcon name="status" :size="12" />{{ $t("case.status") }}</dt><dd>{{ project.status }}</dd></div>
    <div><dt><AppIcon name="stack" :size="12" />{{ $t("case.stack") }}</dt><dd>{{ project.stack.join(", ") }}</dd></div>
    <div v-if="project.url">
      <dt><AppIcon name="link" :size="12" />{{ $t("case.link") }}</dt>
      <dd><a :href="project.url" target="_blank" rel="noopener">{{ project.urlLabel ?? project.url }} ↗</a></dd>
    </div>
    <div v-if="project.repo">
      <dt><AppIcon name="repo" :size="12" />{{ $t("case.repo") }}</dt>
      <dd><a :href="project.repo" target="_blank" rel="noopener">GitHub ↗</a></dd>
    </div>
  </dl>
</template>

<style scoped>
.facts { display: grid; align-content: start; gap: 14px; margin: 0; font-size: 14px; }
@media (max-width: 900px) { .facts { grid-template-columns: 1fr 1fr; } }
dt { display: flex; align-items: center; gap: 6px; font-family: var(--mono); font-size: 11px; text-transform: uppercase; color: var(--slate); }
dd { margin: 2px 0 0; font-weight: 500; }
</style>
