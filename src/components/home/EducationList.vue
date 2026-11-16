<script setup lang="ts">
import { education } from "@/data/profile";
</script>

<template>
  <div class="edu">
    <h3 class="mono">Formation</h3>
    <div v-for="ed in education" :key="ed.school" v-reveal class="rv item">
      <span class="mono">{{ ed.period }}</span><strong>{{ ed.degree }}</strong><span>{{ ed.school }}</span>
    </div>
  </div>
</template>

<style scoped>
.edu { margin-top: 72px; display: grid; }
h3 { margin: 0 0 14px; font-weight: 400; color: var(--mist); }
.item { display: grid; grid-template-columns: 200px 1fr auto; gap: 24px; align-items: baseline; padding: 16px 0; border-top: 1px solid var(--line); }
strong { font-size: clamp(20px, 2.2vw, 30px); font-weight: 600; letter-spacing: -.03em; }
@media (max-width: 900px) { .item { grid-template-columns: 1fr; gap: 6px; } }
</style>
