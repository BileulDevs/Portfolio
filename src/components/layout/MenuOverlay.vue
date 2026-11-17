<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { profile } from "@/data/profile";

/** Full-screen coral menu, opened from the header. */
const props = defineProps<{ open: boolean }>();
defineEmits<{ close: [] }>();

const localePath = useLocalePath();
/** Section anchors on the home page, with their label key under `nav.`. */
const items = [
  { hash: "#manifeste", key: "manifesto" },
  { hash: "#stack", key: "stack" },
  { hash: "#travaux", key: "work" },
  { hash: "#parcours", key: "career" },
  { hash: "#contact", key: "contact" },
] as const;

const nav = ref<HTMLElement | null>(null);
watch(() => props.open, (o) => o && nextTick(() => nav.value?.querySelector("a")?.focus()));
</script>

<template>
  <nav id="overlay-nav" ref="nav" class="overlay" :class="{ open }" :aria-label="$t('a11y.mainNav')" :inert="!open">
    <ol>
      <li v-for="(item, i) in items" :key="item.hash" :style="{ '--d': `${i * 0.05}s` }">
        <NuxtLink :to="localePath({ path: '/', hash: item.hash })" @click="$emit('close')">{{ $t(`nav.${item.key}`) }}</NuxtLink>
      </li>
    </ol>
    <div class="foot mono">
      <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
      <a v-for="l in profile.links" :key="l.label" :href="l.href" target="_blank" rel="noopener">{{ l.label }} ↗</a>
    </div>
  </nav>
</template>

<style scoped>
.overlay { position: fixed; inset: 0; z-index: 45; background: var(--coral); color: var(--ink); display: grid; align-content: center; padding: var(--pad); clip-path: circle(0% at calc(100% - 60px) 36px); transition: clip-path .8s var(--ease), visibility 0s .8s; visibility: hidden; }
.overlay.open { clip-path: circle(150% at calc(100% - 60px) 36px); visibility: visible; transition: clip-path .8s var(--ease); }
ol { list-style: none; margin: 0; padding: 0; counter-reset: m; }
li { counter-increment: m; overflow: hidden; }
li a { display: inline-flex; align-items: baseline; gap: 18px; font-size: clamp(44px, 9vw, 120px); font-weight: 700; letter-spacing: -.05em; line-height: 1.02; text-decoration: none; transform: translateY(100%); transition: transform .7s var(--ease) var(--d); }
li a::before { content: "0" counter(m); font-family: var(--mono); font-size: 14px; font-weight: 400; letter-spacing: 0; }
li a:hover { font-style: italic; }
.open li a { transform: none; }
.foot { display: flex; gap: 24px; flex-wrap: wrap; margin-top: 40px; }
.foot a { text-decoration: none; }
.foot a:hover { text-decoration: underline; }
</style>
