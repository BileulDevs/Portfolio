<script setup lang="ts">
import { experience } from "@/data/experience";
</script>

<template>
  <section id="parcours" class="band" aria-labelledby="str-t">
    <h2 id="str-t" v-reveal class="big-title rv">Strates.</h2>
    <div class="strata">
      <ExperienceItem v-for="(e, i) in experience" :key="e.id" :item="e" :open="i === 1" />
    </div>
    <EducationList />
  </section>
</template>

<style scoped>
.strata { border-bottom: 1px solid var(--line); }
</style>
