<script setup lang="ts">
import { useContent } from "@/composables/useContent";

const { levels } = useContent();
</script>

<template>
  <p class="legend mono">
    <span><b class="sw full" />{{ levels[3].short }}</span>
    <span><b class="sw two" />{{ levels[2].short }}</span>
    <span><b class="sw one" />{{ levels[1].short }}</span>
  </p>
</template>

<style scoped>
.legend { display: flex; gap: 28px; flex-wrap: wrap; margin: 28px 0 0; }
.sw { display: inline-block; width: 40px; height: 14px; border: 1px solid var(--lav); vertical-align: middle; margin-right: 8px; }
.sw.full { background: var(--coral); border-color: var(--coral); }
.sw.two { background: linear-gradient(90deg, var(--lav) 66%, transparent 66%); }
.sw.one { background: linear-gradient(90deg, var(--lav) 33%, transparent 33%); }
</style>
