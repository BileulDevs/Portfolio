<script setup lang="ts">
import { computed } from 'vue'
import { journeyHud } from '~/three/journeyState'
import { chapters } from '~/data/profile'

const current = computed(() => chapters[journeyHud.chapterIndex] ?? chapters[0])
const pct = computed(() => Math.round(journeyHud.progress * 100))
const idx = computed(() => String(journeyHud.chapterIndex + 1).padStart(2, '0'))
const total = String(chapters.length).padStart(2, '0')
</script>

<template>
  <div v-show="journeyHud.started" class="hud" aria-hidden="true">
    <!-- coin haut-gauche : chapitre courant -->
    <div class="hud__corner hud__corner--tl">
      <span class="hud__k">CHAPITRE</span>
      <span class="hud__v">{{ idx }} <i>/ {{ total }}</i></span>
      <span class="hud__label">{{ current.label }}</span>
    </div>

    <!-- coin haut-droit : corps céleste visé -->
    <div class="hud__corner hud__corner--tr">
      <span class="hud__k">POSITION</span>
      <span class="hud__body">{{ current.body }}</span>
    </div>

    <!-- rail de trajectoire (droite) -->
    <div class="hud__rail">
      <div class="hud__rail-track">
        <div class="hud__rail-fill" :style="{ height: pct + '%' }" />
        <div class="hud__rail-cursor" :style="{ top: pct + '%' }" />
      </div>
      <span class="hud__rail-pct">{{ pct }}%</span>
    </div>

    <!-- coin bas-gauche : télémétrie décorative -->
    <div class="hud__corner hud__corner--bl">
      <span class="hud__k">TRAJECTOIRE</span>
      <span class="hud__telemetry">NOMINALE · VITESSE STABLE</span>
    </div>

    <!-- équerres d'angle -->
    <span class="bracket bracket--tl" />
    <span class="bracket bracket--tr" />
    <span class="bracket bracket--bl" />
    <span class="bracket bracket--br" />
  </div>
</template>

<style scoped>
.hud {
  position: fixed;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  font-family: var(--font-mono);
  color: var(--plasma);
}
.hud__corner {
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.66rem;
  letter-spacing: 0.18em;
}
.hud__corner--tl { top: 1.6rem; left: 1.6rem; }
.hud__corner--tr { top: 1.6rem; right: 1.6rem; text-align: right; align-items: flex-end; }
.hud__corner--bl { bottom: 1.6rem; left: 1.6rem; }

.hud__k { color: var(--text-faint); letter-spacing: 0.28em; }
.hud__v { font-size: 1.1rem; color: var(--text); letter-spacing: 0.1em; }
.hud__v i { color: var(--text-faint); font-style: normal; font-size: 0.8rem; }
.hud__label { color: var(--ember); letter-spacing: 0.22em; text-transform: uppercase; }
.hud__body { color: var(--plasma-soft); font-size: 0.78rem; letter-spacing: 0.16em; }
.hud__telemetry { color: var(--text-dim); }

/* rail de trajectoire vertical */
.hud__rail {
  position: fixed;
  top: 50%;
  right: 1.7rem;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-direction: column;
}
.hud__rail-track {
  position: relative;
  width: 2px;
  height: 34vh;
  background: var(--panel-line);
}
.hud__rail-fill {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  background: linear-gradient(var(--plasma), var(--ember));
}
.hud__rail-cursor {
  position: absolute;
  left: 50%;
  width: 9px; height: 9px;
  border: 1px solid var(--plasma);
  background: var(--void);
  transform: translate(-50%, -50%) rotate(45deg);
}
.hud__rail-pct { font-size: 0.62rem; color: var(--text-faint); letter-spacing: 0.1em; }

/* équerres d'angle */
.bracket { position: fixed; width: 16px; height: 16px; opacity: 0.5; }
.bracket--tl { top: 1rem; left: 1rem; border-top: 1px solid var(--plasma); border-left: 1px solid var(--plasma); }
.bracket--tr { top: 1rem; right: 1rem; border-top: 1px solid var(--plasma); border-right: 1px solid var(--plasma); }
.bracket--bl { bottom: 1rem; left: 1rem; border-bottom: 1px solid var(--plasma); border-left: 1px solid var(--plasma); }
.bracket--br { bottom: 1rem; right: 1rem; border-bottom: 1px solid var(--plasma); border-right: 1px solid var(--plasma); }

@media (max-width: 720px) {
  .hud__rail { display: none; }
  .hud__corner { font-size: 0.6rem; }
}
</style>
