<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import { findProject, projects } from "@/data/projects";

/** Case-study page for one project, with prev / next navigation pinned at the bottom. */
definePageMeta({
  name: "project",
  validate: (route) => projects.some((p) => p.slug === route.params.slug),
});

const route = useRoute();
const index = computed(() => Math.max(0, findProject(String(route.params.slug))));
const project = computed(() => projects[index.value]);
const prev = computed(() => projects[(index.value - 1 + projects.length) % projects.length]);
const next = computed(() => projects[(index.value + 1) % projects.length]);
const pad = (n: number) => String(n).padStart(2, "0");
useHead({ title: () => `${project.value.name} — Bilel Sahraoui` });

const close = () => navigateTo({ path: "/", hash: "#travaux" });
const goTo = (slug: string) => navigateTo({ name: "project", params: { slug } });

function onKey(e: KeyboardEvent) {
  const typing = (e.target as HTMLElement)?.closest("input, textarea, [contenteditable]");
  if (typing || document.documentElement.classList.contains("menu-open")) return;
  if (e.key === "Escape") close();
}
onMounted(() => addEventListener("keydown", onKey));
onBeforeUnmount(() => removeEventListener("keydown", onKey));
</script>

<template>
  <main id="main" class="case" data-header="dark">
    <ProjectHero :project="project" :number="pad(index + 1)" :total="pad(projects.length)" />
    <ProjectCover :project="project" :index="index" />
    <div class="body">
      <ProjectFacts :project="project" />
      <ProjectStory :project="project" />
    </div>
    <ProjectNext :project="next" />
    <ProjectDock :project="project" :prev="prev" :next="next" @close="close" @go="goTo" />
  </main>
</template>

<style scoped>
.case { background: var(--lav); color: var(--ink); min-height: 100svh; padding-bottom: 120px; }
.body { display: grid; grid-template-columns: 280px 1fr; gap: clamp(28px, 5vw, 80px); padding: clamp(48px, 8vh, 96px) var(--pad); }
@media (max-width: 900px) { .body { grid-template-columns: 1fr; } }
</style>
