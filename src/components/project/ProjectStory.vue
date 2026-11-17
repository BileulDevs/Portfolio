<script setup lang="ts">
import type { Project } from "@/data/types";

/** Main column of a case study: context → goals → features → architecture decisions → challenges → results. */
defineProps<{ project: Project }>();
</script>

<template>
  <div>
    <ProjectBlock :title="$t('case.context')">
      <p class="lead">{{ project.context }}</p>
    </ProjectBlock>

    <ProjectBlock :title="$t('case.goals')">
      <ul class="cols"><li v-for="g in project.goals" :key="g">{{ g }}</li></ul>
    </ProjectBlock>

    <ProjectBlock :title="$t('case.features')">
      <ul class="cols"><li v-for="f in project.features" :key="f">{{ f }}</li></ul>
    </ProjectBlock>

    <ProjectBlock :title="$t('case.architecture')">
      <p class="lead small">{{ project.architecture.summary }}</p>
      <ol class="decisions">
        <li v-for="(d, i) in project.architecture.decisions" :key="d.choice">
          <span class="num mono">{{ String(i + 1).padStart(2, "0") }}</span>
          <div><strong>{{ d.choice }}</strong><p>{{ d.why }}</p></div>
        </li>
      </ol>
    </ProjectBlock>

    <ProjectBlock :title="$t('case.challenges')">
      <div v-for="c in project.challenges" :key="c.problem" class="cols versus">
        <div><b>{{ $t("case.problem") }}</b>{{ c.problem }}</div>
        <div><b>{{ $t("case.solution") }}</b>{{ c.solution }}</div>
      </div>
    </ProjectBlock>

    <ProjectBlock :title="$t('case.results')">
      <div class="nums">
        <div v-for="r in project.results" :key="r.label"><strong>{{ r.value }}</strong><span>{{ r.label }}</span></div>
      </div>
    </ProjectBlock>

    <ProjectBlock v-if="project.gallery?.length" :title="$t('case.gallery')">
      <div class="gallery"><img v-for="g in project.gallery" :key="g.src" :src="g.src" :alt="g.alt" loading="lazy" /></div>
    </ProjectBlock>
  </div>
</template>

<style scoped>
.lead { margin: 0; font-size: clamp(20px, 1.8vw, 26px); line-height: 1.4; max-width: 50ch; letter-spacing: -.01em; }
.lead.small { font-size: 19px; margin-bottom: 18px; }
.cols { margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 0 32px; }
.cols li, .versus { padding: 14px 0; border-top: 1px solid rgba(71, 84, 101, .25); font-size: 17px; }
.versus { padding: 18px 0; }
.versus b { display: block; font-family: var(--mono); font-weight: 400; font-size: 11px; text-transform: uppercase; color: var(--slate); margin-bottom: 4px; }
.decisions { margin: 0; padding: 0; list-style: none; }
.decisions li { display: grid; grid-template-columns: 56px 1fr; gap: 16px; padding: 18px 0; border-top: 1px solid rgba(71, 84, 101, .25); }
.decisions .num { padding-top: 4px; color: var(--coral); }
.decisions strong { display: block; font-size: 19px; font-weight: 700; letter-spacing: -.02em; }
.decisions p { margin: 6px 0 0; max-width: 62ch; font-size: 16px; line-height: 1.55; opacity: .85; }
.nums { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.nums strong { display: block; font-size: clamp(48px, 6vw, 96px); font-weight: 800; letter-spacing: -.06em; line-height: .9; }
.nums span { font-size: 15px; }
.gallery { display: grid; gap: 16px; }
.gallery img { width: 100%; border-radius: 8px; }
@media (max-width: 900px) { .cols, .nums { grid-template-columns: 1fr; } }
</style>
