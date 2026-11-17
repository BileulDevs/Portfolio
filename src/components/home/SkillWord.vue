<script setup lang="ts">
import type { Tech } from "@/data/types";
import { useContent } from "@/composables/useContent";

/** Outlined word filled in proportion to mastery: the fill is the information. */
defineProps<{ tech: Tech }>();
const { levels } = useContent();
</script>

<template>
  <li v-reveal class="fill" :class="`l${tech.level}`" :style="{ '--target': tech.level / 3 }" tabindex="0">
    {{ tech.name }}<span class="sr-only">, {{ levels[tech.level].long }}</span>
  </li>
</template>

<style scoped>
.fill {
  --f: 0;
  position: relative; cursor: default;
  font-size: clamp(28px, 4vw, 60px); font-weight: 700; letter-spacing: -.05em; line-height: 1.08;
  color: transparent; -webkit-text-stroke: 1.2px rgba(238, 237, 255, .55);
  background: linear-gradient(90deg, var(--lav) calc(var(--f) * 100%), transparent calc(var(--f) * 100%));
  -webkit-background-clip: text; background-clip: text;
  transition: --f 1.2s var(--ease);
}
.fill.in { --f: var(--target); }
.fill.l3 { -webkit-text-stroke-color: var(--coral); background-image: linear-gradient(90deg, var(--coral) calc(var(--f) * 100%), transparent calc(var(--f) * 100%)); }
</style>

<style>
/* Registered so the gradient stop can animate (Chromium, Safari, Firefox 128+). */
@property --f { syntax: "<number>"; inherits: false; initial-value: 0; }
</style>
