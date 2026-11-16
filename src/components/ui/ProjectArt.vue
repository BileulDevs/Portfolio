<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { Project } from "@/data/types";
import { paintProject } from "@/utils/projectArt";

/** Generated artwork of a project, repainted at its CSS size whenever it resizes. */
const props = defineProps<{ project: Project; index: number }>();

const canvas = ref<HTMLCanvasElement | null>(null);
const paint = () => canvas.value && paintProject(canvas.value, props.project, props.index);
let resizeObserver: ResizeObserver | undefined;

onMounted(() => {
  resizeObserver = new ResizeObserver(paint);
  resizeObserver.observe(canvas.value!);
});
watch(() => props.project, paint);
onBeforeUnmount(() => resizeObserver?.disconnect());
</script>

<template>
  <canvas ref="canvas" aria-hidden="true" />
</template>
