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
        <ProjectCover :project="project" :index="shown" />
        <div class="body">
          <ProjectFacts :project="project" />
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
.body { display: grid; grid-template-columns: 280px 1fr; gap: clamp(28px, 5vw, 80px); padding: clamp(48px, 8vh, 96px) var(--pad); }
/* Switching project: the old one fades out, the new one fades in (the dock stays put). */
.case-leave-active { transition: opacity .25s ease; }
.case-enter-active { transition: opacity .6s ease, transform .6s var(--ease); }
.case-leave-to, .case-enter-from { opacity: 0; }
.case-enter-from { transform: translateY(16px); }
@media (prefers-reduced-motion: reduce) { .case-enter-active, .case-leave-active { transition: none; } .case-enter-from { transform: none; } }
@media (max-width: 900px) { .body { grid-template-columns: 1fr; } }
</style>
