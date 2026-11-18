<script setup lang="ts">
/** Language-dependent <head>: lang, title, description, og:* (one URL per page, so no hreflang alternates). */
const { t, locale, locales } = useI18n();
const language = computed(() => locales.value.find((l) => l.code === locale.value)?.language ?? locale.value);
const route = useRoute();
/** Site address without its trailing slash; empty when unknown (see runtimeConfig in nuxt.config.ts). */
const site = useRuntimeConfig().public.siteUrl.replace(/\/+$/, "");
/** Share card: public/og.png, 1200 × 630. Absolute URLs only, so only when the site's address is known. */
const OG_IMAGE = { path: "/og.png", width: "1200", height: "630", type: "image/png" };
useHead(() => ({
  htmlAttrs: { lang: language.value },
  title: t("meta.title"),
  meta: [
    { name: "description", content: t("meta.description") },
    { property: "og:title", content: t("meta.title") },
    { property: "og:description", content: t("meta.ogDescription") },
    { property: "og:locale", content: language.value.replace("-", "_") },
    { name: "twitter:card", content: "summary_large_image" },
    ...(site
      ? [
          { property: "og:url", content: site + route.path },
          { property: "og:image", content: site + OG_IMAGE.path },
          { property: "og:image:type", content: OG_IMAGE.type },
          { property: "og:image:width", content: OG_IMAGE.width },
          { property: "og:image:height", content: OG_IMAGE.height },
          { property: "og:image:alt", content: t("meta.title") },
          { name: "twitter:image", content: site + OG_IMAGE.path },
        ]
      : []),
  ],
}));
</script>

<template>
  <a class="skip" href="#main">{{ $t("a11y.skip") }}</a>
  <div class="grain" aria-hidden="true" />
  <ScrollProgress />
  <ClientOnly><CursorDot /></ClientOnly>
  <SiteHeader />
  <!-- One key per page name: switching project keeps the page and ProjectCase fades between them. -->
  <NuxtPage :page-key="(route) => String(route.name)" />
  <ToastHost />
</template>

<style>
/* Film grain: one static SVG noise tile, texture without per-frame cost. */
.grain {
  position: fixed; inset: 0; pointer-events: none; z-index: 60; opacity: .07; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
</style>
