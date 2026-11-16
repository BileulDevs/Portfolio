<script setup lang="ts">
import { useToast } from "@/composables/useToast";
const { message, visible } = useToast();
</script>

<template>
  <div class="toast" :class="{ on: visible }" role="status" aria-live="polite">{{ message }}</div>
</template>

<style scoped>
.toast { position: fixed; left: 50%; bottom: 24px; transform: translate(-50%, 16px); z-index: 90; background: var(--ink); color: var(--lav); padding: 12px 18px; border-radius: 999px; opacity: 0; transition: .3s; pointer-events: none; }
.toast.on { opacity: 1; transform: translate(-50%, 0); }
</style>
