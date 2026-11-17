<script setup lang="ts">
import { useContent } from "@/composables/useContent";

const { profile } = useContent();

const marquee = ["TypeScript", "Node.js", "Vue.js", "Next.js", "C# / .NET", "PostgreSQL", "Azure", "Stripe", "Prisma", "Three.js"];
</script>

<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <ClientOnly><MatterShader /></ClientOnly>
    <div class="meta mono">
      <span>{{ profile.title }} · {{ profile.specialty }}</span>
      <span>{{ profile.location }}</span>
      <span>{{ profile.status }}</span>
    </div>
    <div class="inner">
      <h1 id="hero-title"><span class="w"><span>bilel</span></span><span class="w"><span>sahraoui<i>.</i></span></span></h1>
      <div class="row">
        <p class="lede">{{ $t("hero.lede") }}</p>
        <p class="approach">{{ $t("hero.approach") }}</p>
        <BlobLink class="blob" tone="light" :to="{ hash: '#travaux' }" :cursor="$t('cursor.go')">
          {{ $t("hero.ctaLine1") }}<br />{{ $t("hero.ctaLine2") }}
        </BlobLink>
      </div>
    </div>
    <div class="marquee mono" aria-hidden="true">
      <div><span v-for="(w, i) in [...marquee, ...marquee]" :key="i">{{ w }}</span></div>
    </div>
  </section>
</template>

<style scoped>
.hero { position: relative; height: 100svh; min-height: 640px; overflow: hidden; display: grid; grid-template-rows: 1fr auto; }
.meta { position: absolute; z-index: 2; top: 80px; left: var(--pad); right: var(--pad); display: flex; justify-content: space-between; gap: 8px 16px; flex-wrap: wrap; }
.inner { position: relative; z-index: 2; align-self: end; padding: 0 var(--pad) clamp(24px, 4vh, 48px); }
h1 { margin: 0; font-weight: 800; font-size: clamp(64px, 14.5vw, 250px); line-height: .8; letter-spacing: -.065em; }
.w { display: block; overflow: hidden; padding-bottom: .02em; }
.w > span { display: inline-block; transform: translateY(102%); animation: up 1.4s var(--ease) forwards; }
.w:nth-child(2) > span { animation-delay: .1s; padding-left: .5em; }
h1 i { font-style: normal; color: var(--coral); }
@keyframes up { to { transform: none; } }
.row { display: grid; grid-template-columns: 1fr 1.2fr auto; gap: 24px; align-items: end; margin-top: clamp(18px, 3vh, 32px); }
.lede { margin: 0; font-size: clamp(20px, 2vw, 28px); line-height: 1.15; font-weight: 500; letter-spacing: -.02em; max-width: 22ch; }
.approach { margin: 0; font-size: 15px; max-width: 48ch; }
.blob { width: 132px; height: 132px; font-size: 15px; }
.marquee { position: relative; z-index: 2; border-top: 1px solid var(--line); overflow: hidden; white-space: nowrap; padding: 12px 0; }
.marquee div { display: inline-block; animation: marquee 34s linear infinite; }
.marquee span { margin: 0 22px; }
.marquee span:nth-child(odd) { color: var(--mist); }
@keyframes marquee { to { transform: translateX(-50%); } }
@media (max-width: 900px) {
  .row { grid-template-columns: 1fr; }
  .blob { width: 104px; height: 104px; position: absolute; right: var(--pad); top: -128px; }
}
@media (prefers-reduced-motion: reduce) { .w > span { transform: none; } }
</style>
