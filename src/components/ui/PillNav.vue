<script setup lang="ts">
/** "← label →" pill: previous / next buttons around a slot. Background comes from the parent. */
defineProps<{ prevLabel: string; nextLabel: string }>();
defineEmits<{ prev: []; next: [] }>();
</script>

<template>
  <div class="pill">
    <button type="button" :aria-label="prevLabel" @click="$emit('prev')">←</button>
    <slot />
    <button type="button" :aria-label="nextLabel" @click="$emit('next')">→</button>
  </div>
</template>

<style scoped>
.pill { display: flex; align-items: center; gap: 4px; border-radius: 999px; padding: 4px; }
button { width: 44px; height: 44px; border-radius: 50%; border: 0; background: none; cursor: pointer; font-size: 18px; }
button:hover { background: var(--lav); color: var(--ink); }
</style>
