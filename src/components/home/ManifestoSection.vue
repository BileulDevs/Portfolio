<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useScrollProgress } from "@/composables/useScrollProgress";
import { prefersReducedMotion } from "@/composables/useMedia";
import { useContent } from "@/composables/useContent";

const { copy, keyFacts } = useContent();
/** The paragraph, word by word; "hot" words (the ideas it hinges on) are underlined in coral once lit. */
const words = computed(() =>
  copy.value.manifesto.text.split(" ").map((w) => ({ w, hot: copy.value.manifesto.hot.some((h) => w.toLowerCase().startsWith(h)) })),
);

const para = ref<HTMLElement | null>(null);
const progress = useScrollProgress(para);
// Read after hydration so the server HTML and the first client render match.
const reduced = ref(false);
onMounted(() => (reduced.value = prefersReducedMotion()));
const lit = computed(() => (reduced.value ? words.value.length : Math.round(progress.value * words.value.length)));
</script>

<template>
  <section id="manifeste" class="band" aria-labelledby="mani-t">
    <h2 id="mani-t" class="sr-only">{{ $t("manifesto.title") }}</h2>
    <p ref="para" class="text">
      <template v-for="(item, i) in words" :key="i"><span class="word" :class="{ lit: i < lit, hot: item.hot }">{{ item.w }}</span>{{ " " }}</template>
    </p>
    <div class="facts">
      <div v-for="f in keyFacts" :key="f.value" v-reveal class="rv"><strong>{{ f.value }}</strong><span>{{ f.label }}</span></div>
    </div>
  </section>
</template>

<style scoped>
.text { margin: 0; font-size: clamp(30px, 4.6vw, 72px); line-height: 1.04; letter-spacing: -.04em; font-weight: 500; max-width: 21ch; }
.word { color: rgba(238, 237, 255, .2); transition: color .25s; }
.word.lit { color: var(--lav); }
.word.hot.lit { text-decoration: underline; text-decoration-color: var(--coral); text-decoration-thickness: .08em; text-underline-offset: .12em; }
.facts { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: clamp(48px, 6vw, 96px); border-top: 1px solid var(--line); }
.facts div { padding: 18px 18px 0 0; }
.facts strong { display: block; font-size: clamp(36px, 4vw, 60px); font-weight: 700; letter-spacing: -.05em; line-height: 1; }
.facts span { font-size: 14px; opacity: .85; }
@media (max-width: 900px) { .facts { grid-template-columns: 1fr 1fr; row-gap: 18px; } }
</style>
