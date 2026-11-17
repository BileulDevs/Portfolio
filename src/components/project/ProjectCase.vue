<script setup lang="ts">
import { computed, ref, watch } from "vue";
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
/** `swapped`: the previous project has faded out, the host scrolls back to the top before the next fades in. */
const emit = defineEmits<{ close: []; swapped: [] }>();
const { t } = useI18n();
const { projects } = useContent();

const at = (i: number) => projects.value[(i + projects.value.length) % projects.value.length];
/**
 * The project on screen lags behind `index`: a switch first fades the current one out, and only then
 * swaps texts and theme (fonts, colours), so nothing changes while it is still visible.
 */
const shown = ref(props.index);
const visible = ref(true);
watch(() => props.index, (i) => { if (i !== shown.value) visible.value = false; });
function onLeft() {
  shown.value = props.index;
  emit("swapped");
  visible.value = true;
}
const project = computed(() => at(shown.value));
const prev = computed(() => at(shown.value - 1));
const next = computed(() => at(shown.value + 1));
const pad = (n: number) => String(n).padStart(2, "0");
const go = (slug: string) => navigateTo(props.linkTo(slug), { replace: props.replace });
</script>

<template>
  <div class="case" :data-theme="project.theme" :style="{ '--crumb': JSON.stringify(t('case.crumb')) }">
    <Transition name="case" @after-leave="onLeft">
      <div v-if="visible">
        <ProjectHero :project="project" :number="pad(shown + 1)" :total="pad(projects.length)" />
        <div class="showcase">
          <ProjectCover :project="project" :index="shown" />
          <ProjectFacts :project="project" />
        </div>
        <div class="body">
          <ProjectStory :project="project" />
        </div>
        <ProjectNext :project="next" :to="linkTo(next.slug)" :replace="replace" />
      </div>
    </Transition>
    <ProjectDock :project="project" :prev="prev" :next="next" @close="$emit('close')" @go="go" />
  </div>
</template>

<style scoped>
.case { background: var(--lav); color: var(--ink); min-height: 100svh; padding-bottom: 120px; }
/* Content column capped at --case-w on wide screens: the side padding grows instead (the dock keeps the page edges). */
.case > div { --case-w: 1200px; --pad: max(clamp(18px, 4vw, 64px), calc((100% - var(--case-w)) / 2)); }
/* The animated cover and the key facts side by side, same height. */
.showcase { display: grid; grid-template-columns: 1fr 260px; gap: 16px; padding: 0 var(--pad); }
/* Wide: the cover fills the row, as tall as the facts (never shorter than 340px). */
.showcase > :deep(.cover) { margin: 0; aspect-ratio: auto; min-height: 340px; }
/* Site look (no theme, e.g. Observatory): the facts sit on a raised card beside the cover. */
.case:not([data-theme]) .showcase > :deep(.facts) {
  padding: 20px 22px; border-radius: 8px; background: var(--lav);
  box-shadow: 0 1px 2px rgba(31, 38, 48, .06), 0 10px 30px -8px rgba(31, 38, 48, .18);
}
@media (max-width: 900px) { .showcase { grid-template-columns: 1fr; } .showcase > :deep(.cover) { aspect-ratio: 16 / 10; min-height: 0; } }
.body { padding: clamp(40px, 6vh, 72px) var(--pad); }
/* Switching project: the old one fades out, the new one fades in (the dock stays put). */
.case-leave-active { transition: opacity .25s ease; }
.case-enter-active { transition: opacity .6s ease, transform .6s var(--ease); }
.case-leave-to, .case-enter-from { opacity: 0; }
.case-enter-from { transform: translateY(16px); }
@media (prefers-reduced-motion: reduce) { .case-enter-active, .case-leave-active { transition: none; } .case-enter-from { transform: none; } }
</style>
