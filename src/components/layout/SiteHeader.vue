<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useLanguage } from "@/composables/useLanguage";

/** Fixed header + menu toggle. The header switches to dark ink over the coral bands. */
const open = ref(false);
const onCoral = ref(false);
const btn = ref<HTMLButtonElement | null>(null);
const route = useRoute();
const localePath = useLocalePath();
/** The switch offers the language not shown, and remembers the choice (no language in the URL). */
const { other, switchTo } = useLanguage();

function toggle(force?: boolean) {
  open.value = force ?? !open.value;
  document.documentElement.classList.toggle("menu-open", open.value);
}
const onKey = (e: KeyboardEvent) => {
  if (e.key === "Escape" && open.value) { toggle(false); btn.value?.focus(); }
};

// The header colour follows whatever band sits under it: coral bands need dark ink.
let io: IntersectionObserver | undefined;
function watchCoral() {
  io?.disconnect();
  onCoral.value = false;
  const coral = document.querySelectorAll("[data-header='dark']");
  if (!coral.length) return;
  io = new IntersectionObserver((es) => (onCoral.value = es.some((e) => e.isIntersecting)), { rootMargin: "0px 0px -92% 0px" });
  coral.forEach((el) => io!.observe(el));
}
watch(() => route.fullPath, () => { toggle(false); setTimeout(watchCoral, 500); });
onMounted(() => { addEventListener("keydown", onKey); setTimeout(watchCoral, 100); });
onBeforeUnmount(() => { removeEventListener("keydown", onKey); io?.disconnect(); });
</script>

<template>
  <header class="top" :class="{ dark: onCoral && !open }">
    <NuxtLink class="logo" :to="localePath('/')" :aria-label="$t('a11y.home')">bs<span>.</span></NuxtLink>
    <div class="actions">
      <button class="lang" type="button" :lang="other" :aria-label="$t('a11y.language')" @click="switchTo(other)">{{ other }}</button>
      <button ref="btn" class="menu-btn" :aria-expanded="open" aria-controls="overlay-nav" @click="toggle()">
        <span>{{ open ? $t("nav.close") : $t("nav.menu") }}</span><i aria-hidden="true" />
      </button>
    </div>
  </header>
  <MenuOverlay :open="open" @close="toggle(false)" />
</template>

<style scoped>
.top { position: fixed; z-index: 50; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: center; padding: 18px var(--pad); color: var(--lav); transition: color .3s; pointer-events: none; }
.top > * { pointer-events: auto; }
.top.dark { color: var(--ink); }
:global(.menu-open) .top { color: var(--ink); }
.actions { display: flex; align-items: center; gap: 22px; }
.lang { background: none; border: 0; cursor: pointer; color: inherit; font-family: var(--mono); font-size: 12px; text-transform: uppercase; letter-spacing: .06em; text-decoration: none; padding: 8px 0; }
.lang:hover { text-decoration: underline; }
.logo { font-weight: 800; font-size: 22px; letter-spacing: -.04em; text-decoration: none; }
.logo span { color: var(--coral); }
.top.dark .logo span, :global(.menu-open) .logo span { color: inherit; }
.menu-btn { background: none; border: 0; cursor: pointer; display: flex; align-items: center; gap: 10px; padding: 8px 0; font-family: var(--mono); font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: inherit; }
.menu-btn i { width: 26px; height: 8px; position: relative; display: inline-block; }
.menu-btn i::before, .menu-btn i::after { content: ""; position: absolute; left: 0; right: 0; height: 1.5px; background: currentColor; transition: transform .4s var(--ease); }
.menu-btn i::before { top: 0; }
.menu-btn i::after { bottom: 0; }
.menu-btn[aria-expanded="true"] i::before { transform: translateY(3.25px) rotate(45deg); }
.menu-btn[aria-expanded="true"] i::after { transform: translateY(-3.25px) rotate(-45deg); }
</style>
