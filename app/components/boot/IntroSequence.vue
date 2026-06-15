<script setup lang="ts">
import { onMounted, ref } from 'vue'

const emit = defineEmits<{ engage: [] }>()

const phase = ref(0) // 0 boot, 1 countdown, 2 ready
const count = ref(3)
const leaving = ref(false)

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const lines = [
  'SYSTÈMES DE NAVIGATION ........ EN LIGNE',
  'RÉACTEUR ....................... STABLE',
  'TRAJECTOIRE .............. VERROUILLÉE',
]

onMounted(() => {
  const step = reduced ? 0 : 700
  setTimeout(() => (phase.value = 1), step * 1.5)
  if (!reduced) {
    const tick = setInterval(() => {
      count.value -= 1
      if (count.value <= 0) {
        clearInterval(tick)
        phase.value = 2
      }
    }, 800)
  } else {
    phase.value = 2
  }
})

function engage() {
  leaving.value = true
  emit('engage')
}
</script>

<template>
  <div class="intro" :class="{ 'intro--leaving': leaving }">
    <div class="intro__inner">
      <p class="intro__id">MISSION — PORTFOLIO / BILEL SAHRAOUI</p>

      <ul class="intro__lines">
        <li v-for="(l, i) in lines" :key="i" :style="{ animationDelay: `${0.3 + i * 0.35}s` }">
          {{ l }}
        </li>
      </ul>

      <div v-if="phase === 1" class="intro__count">{{ count }}</div>

      <transition name="fade">
        <div v-if="phase === 2" class="intro__ready">
          <p class="intro__engine">MOTEUR EN MARCHE</p>
          <button class="btn btn--primary intro__cta" @click="engage">
            Entrer dans la simulation
          </button>
          <p class="intro__hint">Le scroll pilote le vaisseau</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.intro {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  background: var(--void);
  transition: opacity 1.2s var(--ease);
}
.intro--leaving { opacity: 0; pointer-events: none; }

.intro__inner {
  text-align: center;
  font-family: var(--font-mono);
  color: var(--text-dim);
  padding: 2rem;
}
.intro__id {
  font-size: var(--step--1);
  letter-spacing: 0.34em;
  color: var(--plasma);
  margin-bottom: 2.5rem;
}
.intro__lines { list-style: none; font-size: var(--step--1); letter-spacing: 0.12em; }
.intro__lines li {
  opacity: 0;
  margin: 0.35rem 0;
  animation: lineIn 0.6s var(--ease) forwards;
}
@keyframes lineIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 0.7; transform: none; } }

.intro__count {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(4rem, 14vw, 9rem);
  color: var(--text);
  margin-top: 2rem;
  line-height: 1;
}
.intro__ready { margin-top: 2.5rem; }
.intro__engine {
  font-size: var(--step--1);
  letter-spacing: 0.3em;
  color: var(--ember);
  margin-bottom: 1.4rem;
}
.intro__cta { font-size: var(--step-0); }
.intro__hint {
  margin-top: 1.6rem;
  font-size: var(--step--1);
  letter-spacing: 0.18em;
  color: var(--text-faint);
}

.fade-enter-active { transition: opacity 0.8s var(--ease); }
.fade-enter-from { opacity: 0; }
</style>
