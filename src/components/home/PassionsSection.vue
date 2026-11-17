<script setup lang="ts">
import { useContent } from "@/composables/useContent";

const { copy } = useContent();
</script>

<template>
  <section id="passions" class="band spectrum" aria-labelledby="pas-t">
    <h2 id="pas-t" v-reveal class="big-title rv">{{ $t("passions.title") }} <em>{{ $t("passions.titleEm") }}</em></h2>
    <p v-reveal class="intro rv">{{ copy.passions.intro }}</p>
    <ul class="grid">
      <li v-for="(p, i) in copy.passions.items" :key="p.id" v-reveal class="rv card" :style="{ transitionDelay: `${i * 0.08}s` }">
        <span class="mono idx">0{{ i + 1 }} — {{ p.tag }}</span>
        <h3>{{ p.name }}</h3>
        <p>{{ p.text }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.spectrum { background: var(--base-2); }
.intro { margin: 0 0 clamp(32px, 4vw, 56px); max-width: 40ch; font-size: clamp(17px, 1.6vw, 22px); color: var(--mist); }
.grid { display: grid; grid-template-columns: repeat(2, 1fr); margin: 0; padding: 0; list-style: none; border-top: 1px solid var(--line); }
.card { padding: clamp(22px, 3vw, 40px) clamp(0px, 3vw, 40px) clamp(22px, 3vw, 40px) 0; border-bottom: 1px solid var(--line); }
.card:nth-child(odd) { border-right: 1px solid var(--line); }
.card:nth-child(even) { padding-left: clamp(20px, 3vw, 40px); }
.idx { color: var(--mist); }
h3 { margin: 14px 0 10px; font-size: clamp(32px, 4vw, 60px); font-weight: 700; letter-spacing: -.05em; line-height: 1; transition: color .3s; }
.card:hover h3 { color: var(--coral); font-style: italic; }
.card p { margin: 0; max-width: 46ch; font-size: 16px; line-height: 1.5; opacity: .9; }
@media (max-width: 900px) {
  .grid { grid-template-columns: 1fr; }
  .card:nth-child(odd) { border-right: 0; }
  .card:nth-child(even) { padding-left: 0; }
}
</style>
