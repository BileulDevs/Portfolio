<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { Project } from "@/data/types";
import { paintProject, type Live } from "@/utils/projectArt";

/** Generated artwork of a project, repainted at its CSS size whenever it resizes. */
const props = defineProps<{
  project: Project;
  index: number;
  /** Moving details are animated on top (LiveScene, or the carousel shader): leave them out of the picture. */
  live?: Live;
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
const paint = () => canvas.value && paintProject(canvas.value, props.project, props.index, { live: props.live });
let resizeObserver: ResizeObserver | undefined;

onMounted(() => {
  resizeObserver = new ResizeObserver(paint);
  resizeObserver.observe(canvas.value!);
});
watch(() => [props.project, props.live], paint);
onBeforeUnmount(() => resizeObserver?.disconnect());
</script>

<template>
  <canvas ref="canvas" aria-hidden="true" />
</template>
