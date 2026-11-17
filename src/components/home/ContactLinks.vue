<script setup lang="ts">
import { profile } from "@/data/profile";
import { useClipboard } from "@/composables/useClipboard";

/** E-mail (click copies it) and external profiles, as large rows. */
const { copy } = useClipboard();
</script>

<template>
  <div class="links">
    <button type="button" @click="copy(profile.email, $t('contact.copied'))">{{ profile.email }}<small>{{ $t("contact.copy") }}</small></button>
    <a v-for="l in profile.links" :key="l.label" :href="l.href" target="_blank" rel="noopener">{{ l.label }}<small>{{ l.display }} ↗</small></a>
  </div>
</template>

<style scoped>
a, button { display: flex; width: 100%; justify-content: space-between; align-items: baseline; gap: 16px; padding: 16px 0; border: 0; border-top: 1px solid rgba(31, 38, 48, .3); background: none; text-decoration: none; text-align: left; cursor: pointer; font-size: clamp(20px, 2.4vw, 34px); font-weight: 600; letter-spacing: -.03em; color: inherit; }
a:hover, button:hover { font-style: italic; }
small { font-family: var(--mono); font-size: 12px; font-weight: 400; letter-spacing: 0; font-style: normal; }
</style>
