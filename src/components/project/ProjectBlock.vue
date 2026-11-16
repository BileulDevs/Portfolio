<script setup lang="ts">
/** One titled block of a case study ("Contexte", "Objectifs"…). */
defineProps<{ title: string }>();
</script>

<template>
  <section class="block">
    <h2>{{ title }}</h2>
    <slot />
  </section>
</template>

<style scoped>
.block + .block { margin-top: 56px; }
h2 { font-family: var(--mono); font-weight: 400; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; color: var(--slate); margin: 0 0 14px; }
</style>
