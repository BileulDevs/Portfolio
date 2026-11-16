<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

/** Reading progress bar; one transform write per frame at most. */
const bar = ref<HTMLElement | null>(null);
let ticking = false;
const update = () => {
  ticking = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  if (bar.value) bar.value.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
};
const onScroll = () => {
  if (!ticking) { ticking = true; requestAnimationFrame(update); }
};
onMounted(() => { addEventListener("scroll", onScroll, { passive: true }); update(); });
onBeforeUnmount(() => removeEventListener("scroll", onScroll));
</script>

<template><div ref="bar" class="progress" aria-hidden="true" /></template>

<style scoped>
.progress { position: fixed; z-index: 51; left: 0; top: 0; height: 3px; width: 100%; background: var(--coral); transform-origin: left; transform: scaleX(0); }
</style>
