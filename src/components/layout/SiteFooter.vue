<template>
  <footer class="mono">
    <span>Bilel Sahraoui · {{ new Date().getFullYear() }}</span>
    <span>Vue 3 · Three.js · shader WebGL fait main</span>
  </footer>
</template>

<style scoped>
footer { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 24px var(--pad); background: var(--coral); color: var(--ink); border-top: 1px solid rgba(31, 38, 48, .25); }
</style>
