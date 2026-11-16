<script setup lang="ts">
import type { Project } from "@/data/types";

defineProps<{ project: Project; number: string; total: string }>();
</script>

<template>
  <header class="hero">
    <p class="mono">{{ number }} / {{ total }} · {{ project.kind }} · {{ project.period }}</p>
    <h1>{{ project.name }}</h1>
    <p class="tagline">{{ project.tagline }}</p>
  </header>
</template>

<style scoped>
.hero { padding: clamp(110px, 16vh, 170px) var(--pad) 40px; }
.mono { color: var(--slate); margin: 0; }
h1 { margin: 12px 0 0; font-size: clamp(60px, 12vw, 210px); font-weight: 800; letter-spacing: -.07em; line-height: .84; }
.tagline { font-size: clamp(22px, 2.6vw, 38px); line-height: 1.1; letter-spacing: -.03em; font-weight: 500; max-width: 28ch; margin: 24px 0 0; }
</style>
