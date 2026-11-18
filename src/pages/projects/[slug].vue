<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import { findProject, projects } from "@/data/projects";
import { useContent } from "@/composables/useContent";

/** Case-study page for one project (direct links, SEO); the home page shows the same content in a modal. */
definePageMeta({
  name: "project",
  validate: (route) => projects.some((p) => p.slug === route.params.slug),
});

const route = useRoute();
const index = computed(() => Math.max(0, findProject(String(route.params.slug))));
const { t } = useI18n();
const localePath = useLocalePath();
const content = useContent();
useHead({
  title: () => t("meta.projectTitle", { name: content.projects.value[index.value].name }),
  // The page's scrollbar in the project's colours (rules in main.css and src/styles/themes/).
  htmlAttrs: { "data-scroll": () => content.projects.value[index.value].theme ?? "site" },
});

const nuxtApp = useNuxtApp();
/** Previous project faded out: back to the top (instant) before the next one fades in. */
function toTop() {
  const lenis = nuxtApp.$lenis as import("lenis").default | null | undefined;
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo({ top: 0 });
}
const close = () => navigateTo(localePath({ path: "/", hash: "#travaux" }));
const linkTo = (slug: string) => localePath({ name: "project", params: { slug } });

function onKey(e: KeyboardEvent) {
  const typing = (e.target as HTMLElement)?.closest("input, textarea, [contenteditable]");
  if (typing || document.documentElement.classList.contains("menu-open")) return;
  if (e.key === "Escape") close();
}
onMounted(() => addEventListener("keydown", onKey));
onBeforeUnmount(() => removeEventListener("keydown", onKey));
</script>

<template>
  <main id="main" data-header="dark">
    <ProjectCase :index="index" :link-to="linkTo" @close="close" @swapped="toTop" />
  </main>
</template>
