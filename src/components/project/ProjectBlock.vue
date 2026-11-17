<script setup lang="ts">
import type { IconName } from "@/utils/icons";

/** One titled block of a case study ("Contexte", "Objectifs"…), its title led by an optional icon. */
defineProps<{ title: string; icon?: IconName }>();
</script>

<template>
  <section class="block">
    <h2><AppIcon v-if="icon" :name="icon" class="ico" />{{ title }}</h2>
    <slot />
  </section>
</template>

<style scoped>
.block + .block { margin-top: 44px; }
h2 { display: flex; align-items: center; gap: 8px; font-family: var(--mono); font-weight: 400; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: var(--slate); margin: 0 0 14px; }
.ico { color: var(--coral); }
</style>
