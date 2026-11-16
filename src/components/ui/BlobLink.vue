<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

/** Round, magnetic call-to-action. Size and position come from the parent (class on the root). */
defineProps<{
  to: RouteLocationRaw;
  /** "light" on dark bands, "dark" on coral ones. */
  tone: "light" | "dark";
  /** Label shown in the custom cursor. */
  cursor?: string;
}>();
</script>

<template>
  <NuxtLink v-magnetic class="blob" :class="tone" :to="to" :data-cursor="cursor"><slot /></NuxtLink>
</template>

<style scoped>
.blob { border-radius: 50%; display: grid; place-items: center; text-align: center; text-decoration: none; font-weight: 600; line-height: 1.1; transition: background .3s, color .3s; }
.light { background: var(--lav); color: var(--ink); }
.light:hover { background: var(--coral); }
.dark { background: var(--ink); color: var(--lav); }
.dark:hover { background: var(--lav); color: var(--ink); }
</style>
