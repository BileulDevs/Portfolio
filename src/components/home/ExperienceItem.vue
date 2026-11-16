<script setup lang="ts">
import type { Experience } from "@/data/types";

/** One job as a native disclosure: period, company and role; details on open. */
defineProps<{ item: Experience; open?: boolean }>();
</script>

<template>
  <details class="stratum" :open="open">
    <summary>
      <span class="when mono">{{ item.period }}</span>
      <span class="org">{{ item.org }}<small>{{ item.role }}</small></span>
      <span class="plus" aria-hidden="true">+</span>
    </summary>
    <div class="inner">
      <span />
      <div>
        <p class="sum">{{ item.summary }}</p>
        <ul class="hl"><li v-for="h in item.highlights" :key="h">{{ h }}</li></ul>
        <div class="pills"><span v-for="t in item.tags" :key="t">{{ t }}</span></div>
      </div>
    </div>
  </details>
</template>

<style scoped>
.stratum { border-top: 1px solid var(--line); }
summary { list-style: none; display: grid; grid-template-columns: 200px 1fr auto; gap: 24px; align-items: center; padding: 24px 0; cursor: pointer; }
summary::-webkit-details-marker { display: none; }
.when { color: var(--mist); }
.org { font-size: clamp(32px, 5vw, 76px); font-weight: 700; letter-spacing: -.055em; line-height: .95; transition: color .3s, transform .5s var(--ease); }
.org small { display: block; font-size: 16px; font-weight: 500; letter-spacing: -.01em; margin-top: 8px; color: var(--mist); }
summary:hover .org { color: var(--coral); transform: translateX(10px); }
summary:hover .org small { color: var(--mist); }
.plus { width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(238, 237, 255, .4); display: grid; place-items: center; transition: transform .4s var(--ease), background .3s; }
.stratum[open] .plus { transform: rotate(45deg); background: var(--coral); border-color: var(--coral); color: var(--ink); }
.inner { display: grid; grid-template-columns: 200px 1fr; gap: 24px; padding: 0 0 32px; }
.sum { margin: 0 0 14px; font-size: 20px; max-width: 56ch; }
.hl { margin: 0 0 16px; padding: 0; list-style: none; display: grid; gap: 8px; max-width: 70ch; }
.hl li { padding-left: 22px; position: relative; }
.hl li::before { content: ""; position: absolute; left: 0; top: .7em; width: 10px; height: 2px; background: var(--coral); }
.pills { display: flex; flex-wrap: wrap; gap: 6px; }
.pills span { border: 1px solid rgba(238, 237, 255, .35); border-radius: 999px; padding: 3px 12px; font-size: 13px; }
@media (max-width: 900px) {
  summary { grid-template-columns: 1fr auto; }
  .when { grid-column: 1 / -1; }
  .inner { grid-template-columns: 1fr; gap: 6px; }
}
</style>
