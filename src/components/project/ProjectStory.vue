<script setup lang="ts">
import type { Project } from "@/data/types";

/** Main column of a case study: context → goals → features → architecture → challenges → results. */
defineProps<{ project: Project }>();
</script>

<template>
  <div>
    <ProjectBlock title="Contexte">
      <p class="lead">{{ project.context }}</p>
    </ProjectBlock>

    <ProjectBlock title="Objectifs">
      <ul class="cols"><li v-for="g in project.goals" :key="g">{{ g }}</li></ul>
    </ProjectBlock>

    <ProjectBlock title="Fonctionnalités">
      <ul class="cols"><li v-for="f in project.features" :key="f">{{ f }}</li></ul>
    </ProjectBlock>

    <ProjectBlock title="Architecture">
      <p class="lead small">{{ project.architecture.summary }}</p>
      <div class="arch"><ArchitectureDiagram :project="project" /></div>
    </ProjectBlock>

    <ProjectBlock title="Difficultés → solutions">
      <div v-for="c in project.challenges" :key="c.problem" class="cols versus">
        <div><b>Problème</b>{{ c.problem }}</div>
        <div><b>Solution</b>{{ c.solution }}</div>
      </div>
    </ProjectBlock>

    <ProjectBlock title="Résultats">
      <div class="nums">
        <div v-for="r in project.results" :key="r.label"><strong>{{ r.value }}</strong><span>{{ r.label }}</span></div>
      </div>
    </ProjectBlock>

    <ProjectBlock v-if="project.gallery?.length" title="Captures">
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
.arch { background: var(--base); border-radius: 8px; padding: 12px; }
.nums { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.nums strong { display: block; font-size: clamp(48px, 6vw, 96px); font-weight: 800; letter-spacing: -.06em; line-height: .9; }
.nums span { font-size: 15px; }
.gallery { display: grid; gap: 16px; }
.gallery img { width: 100%; border-radius: 8px; }
@media (max-width: 900px) { .cols, .nums { grid-template-columns: 1fr; } }
</style>
