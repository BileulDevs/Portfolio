<script setup lang="ts">
const { t } = useI18n();
const home = useLocalePath()("/");
useHead({ title: () => t("meta.notFoundTitle") });
</script>

<template>
  <main id="main" class="nf">
    <p class="mono">{{ $t("notFound.label") }}</p>
    <h1>{{ $t("notFound.title") }} <em>{{ $t("notFound.titleEm") }}</em></h1>
    <a :href="home" class="back" @click.prevent="clearError({ redirect: home })">{{ $t("notFound.back") }}</a>
  </main>
</template>

<style scoped>
.nf { min-height: 100svh; display: grid; align-content: center; padding: var(--pad); }
h1 { margin: 8px 0 24px; font-size: clamp(64px, 14vw, 220px); font-weight: 800; letter-spacing: -.07em; line-height: .85; }
h1 em { font-weight: 200; }
.back { font-size: 20px; font-weight: 600; }
</style>
