<script setup lang="ts">
import { ICONS, type IconName } from "@/utils/icons";

/** A decorative line icon from src/utils/icons.ts, sized by `size` and coloured by `currentColor`. */
withDefaults(defineProps<{ name: IconName; size?: number }>(), { size: 14 });
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -- static markup from src/utils/icons.ts -->
  <svg
    class="icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    v-html="ICONS[name]"
  />
</template>

<style scoped>
.icon { flex: none; display: inline-block; vertical-align: -2px; }
</style>
