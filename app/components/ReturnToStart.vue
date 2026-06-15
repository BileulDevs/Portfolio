<script setup lang="ts">
import { computed } from 'vue'
import { journeyHud } from '~/three/journeyState'

const emit = defineEmits<{ return: [] }>()
// apparaît tout à la fin, quand la galaxie occupe l'écran
const show = computed(() => journeyHud.started && journeyHud.progress > 0.965)
</script>

<template>
  <transition name="rise">
    <div v-if="show" class="end">
      <p class="end__label">Fin de la transmission</p>
      <button class="btn btn--primary" @click="emit('return')">↑ Revenir au début</button>
    </div>
  </transition>
</template>

<style scoped>
.end {
  position: fixed;
  left: 50%;
  bottom: clamp(2rem, 7vh, 5.5rem);
  transform: translateX(-50%);
  z-index: 20;
  text-align: center;
  pointer-events: auto;
}
.end__label {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--plasma);
  margin-bottom: 0.95rem;
}
.rise-enter-active { transition: opacity 0.9s var(--ease), transform 0.9s var(--ease); }
.rise-enter-from { opacity: 0; transform: translate(-50%, 18px); }
.rise-leave-active { transition: opacity 0.4s var(--ease); }
.rise-leave-to { opacity: 0; }
</style>
