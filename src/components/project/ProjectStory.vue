<script setup lang="ts">
import { computed } from "vue";
import type { FeatureItem, Project } from "@/data/types";

/** Main column of a case study: context → goals → features → architecture decisions → challenges → results. */
const props = defineProps<{ project: Project }>();

/** "Name: what it does" → its two halves, for the feature carousel (no colon: all of it is the title). */
const split = (text: string) => {
  const at = text.indexOf(":");
  return at < 0 ? { title: text, body: "" } : { title: text.slice(0, at).trim(), body: text.slice(at + 1).trim() };
};

const { t } = useI18n();
const featuresTitle = computed(() => props.project.featuresTitle ?? t("case.features"));

/** Features as 3D items when the project defines them (texts from i18n, models and links from data). */
const featureItems = computed<FeatureItem[] | null>(() => {
  const items = props.project.featureItems;
  if (!items) return null;
  const details = props.project.featureDetails;
  return props.project.features.map((f, i) => ({ ...split(f), details: details?.[i], tech: items[i]?.tech, model: items[i]?.model ?? "grass", companions: items[i]?.companions, links: items[i]?.links ?? [] }));
});
</script>

<template>
  <div>
    <!-- Context and goals side by side: the goals read as the answer to the context. -->
    <div class="pair">
      <ProjectBlock :title="$t('case.context')" icon="context">
        <p class="lead">{{ project.context }}</p>
      </ProjectBlock>
      <ProjectBlock :title="$t('case.goals')" icon="goals">
        <ul class="stack"><li v-for="g in project.goals" :key="g"><AppIcon name="check" class="tick" />{{ g }}</li></ul>
      </ProjectBlock>
    </div>

    <ProjectBlock :title="featuresTitle" icon="features">
      <FeatureCarousel v-if="featureItems" :items="featureItems" :label="featuresTitle" />
      <ul v-else class="cols"><li v-for="f in project.features" :key="f">{{ f }}</li></ul>
    </ProjectBlock>

    <ProjectBlock :title="$t('case.architecture')" icon="architecture">
      <p class="lead small">{{ project.architecture.summary }}</p>
      <ol class="decisions">
        <li v-for="(d, i) in project.architecture.decisions" :key="d.choice">
          <span class="num mono">{{ String(i + 1).padStart(2, "0") }}</span>
          <div><strong>{{ d.choice }}</strong><p>{{ d.why }}</p></div>
        </li>
      </ol>
    </ProjectBlock>

    <ProjectBlock :title="$t('case.challenges')" icon="challenges">
      <div v-for="c in project.challenges" :key="c.problem" class="cols versus">
        <div><b><AppIcon name="problem" :size="12" />{{ $t("case.problem") }}</b>{{ c.problem }}</div>
        <div><b><AppIcon name="solution" :size="12" />{{ $t("case.solution") }}</b>{{ c.solution }}</div>
      </div>
    </ProjectBlock>

    <ProjectBlock :title="$t('case.results')" icon="results">
      <div class="nums">
        <div v-for="r in project.results" :key="r.label"><strong>{{ r.value }}</strong><span>{{ r.label }}</span></div>
      </div>
    </ProjectBlock>

    <ProjectBlock v-if="project.gallery?.length" :title="$t('case.gallery')" icon="gallery">
      <div class="gallery"><img v-for="g in project.gallery" :key="g.src" :src="g.src" :alt="g.alt" loading="lazy" /></div>
    </ProjectBlock>
  </div>
</template>

<style scoped>
.lead { margin: 0; font-size: clamp(18px, 1.4vw, 21px); line-height: 1.4; max-width: 50ch; letter-spacing: -.01em; }
.lead.small { font-size: 17px; margin-bottom: 14px; }
.cols { margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 0 28px; }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: stretch; margin-bottom: 44px; }
.pair > :deep(.block) { margin: 0; }
.stack { margin: 0; padding: 0; list-style: none; }
.stack li { display: flex; gap: 10px; align-items: baseline; }
.tick { color: var(--coral); transform: translateY(2px); }
.stack li, .cols li, .versus { padding: 11px 0; border-top: 1px solid rgba(71, 84, 101, .25); font-size: 15px; }
.versus { padding: 14px 0; }
.versus b { display: flex; align-items: center; gap: 6px; font-family: var(--mono); font-weight: 400; font-size: 11px; text-transform: uppercase; color: var(--slate); margin-bottom: 4px; }
.decisions { margin: 0; padding: 0; list-style: none; }
.decisions li { display: grid; grid-template-columns: 40px 1fr; gap: 12px; padding: 14px 0; border-top: 1px solid rgba(71, 84, 101, .25); }
.decisions .num { padding-top: 3px; color: var(--coral); }
.decisions strong { display: block; font-size: 16px; font-weight: 700; letter-spacing: -.02em; }
.decisions p { margin: 4px 0 0; max-width: 64ch; font-size: 14.5px; line-height: 1.55; opacity: .85; }
/* One equal column per result, whatever their number (Space Journey has two). */
.nums { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 16px; }
.nums strong { display: block; font-size: clamp(38px, 4.2vw, 64px); font-weight: 800; letter-spacing: -.06em; line-height: .9; }
.nums span { font-size: 14px; }
.gallery { display: grid; gap: 16px; }
.gallery img { width: 100%; border-radius: 8px; }
@media (max-width: 900px) { .pair, .cols, .nums { grid-template-columns: 1fr; } .nums { grid-auto-flow: row; } }
</style>
