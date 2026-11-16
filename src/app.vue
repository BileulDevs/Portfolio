<template>
  <a class="skip" href="#main">Aller au contenu</a>
  <div class="grain" aria-hidden="true" />
  <ScrollProgress />
  <ClientOnly><CursorDot /></ClientOnly>
  <SiteHeader />
  <NuxtPage :page-key="(route) => (route.name === 'project' ? route.fullPath : String(route.name))" />
  <ToastHost />
</template>

<style>
/* Film grain: one static SVG noise tile, texture without per-frame cost. */
.grain {
  position: fixed; inset: 0; pointer-events: none; z-index: 60; opacity: .07; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
</style>
