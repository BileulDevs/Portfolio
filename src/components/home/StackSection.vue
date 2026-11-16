<script setup lang="ts">
import { stack } from "@/data/stack";
</script>

<template>
  <section id="stack" class="band spectrum" aria-labelledby="stack-t">
    <h2 id="stack-t" v-reveal class="big-title rv">Matière <em>première.</em></h2>
    <div v-for="cat in stack" :key="cat.id" class="row">
      <h3 class="mono">{{ cat.label }}</h3>
      <ul>
        <SkillWord v-for="t in cat.items" :key="t.name" :tech="t" />
      </ul>
    </div>
    <LevelLegend />
  </section>
</template>

<style scoped>
.spectrum { background: var(--base-2); }
.row { display: grid; grid-template-columns: 220px 1fr; gap: 24px; padding: 22px 0; border-top: 1px solid rgba(238, 237, 255, .18); align-items: baseline; }
h3 { margin: 0; font-weight: 400; color: var(--mist); }
ul { display: flex; flex-wrap: wrap; gap: 4px 28px; margin: 0; padding: 0; list-style: none; }
@media (max-width: 900px) { .row { grid-template-columns: 1fr; gap: 8px; } }
</style>
