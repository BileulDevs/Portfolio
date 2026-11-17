<script setup lang="ts">
import { computed } from "vue";
import type { RouteLocationRaw } from "vue-router";
import { useContent } from "@/composables/useContent";

/**
 * A full case study, shared by the project page and the home-page modal.
 * `linkTo` builds the URL of another project, so each host keeps its own navigation.
 */
const props = defineProps<{
  index: number;
  linkTo: (slug: string) => RouteLocationRaw;
  /** Replace the history entry when switching project (the modal), instead of pushing one. */
  replace?: boolean;
}>();
defineEmits<{ close: [] }>();
const { t } = useI18n();
const { projects } = useContent();

const at = (i: number) => projects.value[(i + projects.value.length) % projects.value.length];
const project = computed(() => at(props.index));
const prev = computed(() => at(props.index - 1));
const next = computed(() => at(props.index + 1));
const pad = (n: number) => String(n).padStart(2, "0");
const go = (slug: string) => navigateTo(props.linkTo(slug), { replace: props.replace });
</script>

<template>
  <div class="case" :data-theme="project.theme" :style="{ '--crumb': JSON.stringify(t('case.crumb')) }">
    <ProjectHero :project="project" :number="pad(index + 1)" :total="pad(projects.length)" />
    <ProjectCover :project="project" :index="index" />
    <div class="body">
      <ProjectFacts :project="project" />
      <ProjectStory :project="project" />
    </div>
    <ProjectNext :project="next" :to="linkTo(next.slug)" :replace="replace" />
    <ProjectDock :project="project" :prev="prev" :next="next" @close="$emit('close')" @go="go" />
  </div>
</template>

<style scoped>
.case { background: var(--lav); color: var(--ink); min-height: 100svh; padding-bottom: 120px; }
.body { display: grid; grid-template-columns: 280px 1fr; gap: clamp(28px, 5vw, 80px); padding: clamp(48px, 8vh, 96px) var(--pad); }
@media (max-width: 900px) { .body { grid-template-columns: 1fr; } }
</style>
