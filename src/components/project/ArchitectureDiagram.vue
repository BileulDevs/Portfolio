<script setup lang="ts">
import { computed } from "vue";
import type { Project } from "@/data/types";

/**
 * Architecture graph laid out in columns by longest path from the sources.
 * The first node of the data is the "core" and is drawn in coral.
 */
const props = defineProps<{ project: Project }>();
const { t } = useI18n();

const WIDTH = 900;
/** Vertical room per node in the busiest column; labels need ~80 units under each node. */
const ROW_H = 96;
const PAD = 74;

const layout = computed(() => {
  const { nodes, links } = props.project.architecture;
  const depth: Record<string, number> = Object.fromEntries(nodes.map((n) => [n.id, 0]));
  // Relax |nodes| times: enough for any DAG of this size to settle.
  for (let i = 0; i < nodes.length; i++) links.forEach(([a, b]) => (depth[b] = Math.max(depth[b], depth[a] + 1)));
  const cols: Record<number, typeof nodes> = {};
  nodes.forEach((n) => (cols[depth[n.id]] ??= []).push(n));
  const nCols = Object.keys(cols).length;
  const rows = Math.max(...Object.values(cols).map((l) => l.length));
  const height = rows * ROW_H + PAD * 2;
  const pos: Record<string, { x: number; y: number }> = {};
  Object.entries(cols).forEach(([c, list]) =>
    list.forEach((n, i) => {
      pos[n.id] = {
        x: PAD + (nCols === 1 ? (WIDTH - 2 * PAD) / 2 : (+c * (WIDTH - 2 * PAD)) / (nCols - 1)),
        y: PAD + (i + 0.5) * ROW_H + ((rows - list.length) * ROW_H) / 2,
      };
    }),
  );
  const paths = links.map(([a, b]) => {
    const A = pos[a], B = pos[b], mx = (A.x + B.x) / 2;
    return `M${A.x},${A.y} C${mx},${A.y} ${mx},${B.y} ${B.x},${B.y}`;
  });
  return { height, pos, paths };
});
const label = computed(() =>
  t("a11y.architecture", { name: props.project.name, nodes: props.project.architecture.nodes.map((n) => n.label).join(", ") }),
);
</script>

<template>
  <svg :viewBox="`0 0 ${WIDTH} ${layout.height}`" role="img" :aria-label="label">
    <path v-for="(d, i) in layout.paths" :key="i" :d="d" class="link" />
    <g v-for="(n, i) in project.architecture.nodes" :key="n.id">
      <circle :cx="layout.pos[n.id].x" :cy="layout.pos[n.id].y" :r="i === 0 ? 30 : 22" :class="i === 0 ? 'core' : 'node'" />
      <text :x="layout.pos[n.id].x" :y="layout.pos[n.id].y + (i === 0 ? 52 : 44)" class="t">{{ n.label }}</text>
      <text :x="layout.pos[n.id].x" :y="layout.pos[n.id].y + (i === 0 ? 68 : 60)" class="s">{{ n.sub }}</text>
    </g>
  </svg>
</template>

<style scoped>
svg { width: 100%; height: auto; }
.link { fill: none; stroke: var(--mist); stroke-width: 2; opacity: .6; }
.core { fill: var(--coral); }
.node { fill: var(--slate); }
.t { fill: var(--lav); font-family: var(--display); font-weight: 700; font-size: 17px; text-anchor: middle; }
.s { fill: var(--mist); font-family: var(--mono); font-size: 11px; text-anchor: middle; }
</style>
