<script setup lang="ts">
import { projects } from "@/data/projects";
</script>

<template>
  <section id="travaux" class="band work" aria-labelledby="work-t">
    <div class="head">
      <h2 id="work-t" v-reveal class="big-title rv">Les <em>chantiers.</em></h2>
      <p class="hint mono">Glisser · flèches · cliquer pour ouvrir</p>
    </div>
    <!-- Browser-only: WebGL and reduced-motion checks at setup. -->
    <ClientOnly><CurvedCarousel :projects="projects" /></ClientOnly>
  </section>
</template>

<style scoped>
.work { padding-left: 0; padding-right: 0; overflow: hidden; }
.head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; padding: 0 var(--pad); }
.hint { color: var(--mist); margin: 0 0 clamp(14px, 2.4vw, 32px); }
.head :deep(.big-title) { margin-bottom: clamp(8px, 2vw, 24px); }
.work { padding-top: clamp(64px, 10vh, 120px); padding-bottom: clamp(64px, 10vh, 120px); }
</style>
