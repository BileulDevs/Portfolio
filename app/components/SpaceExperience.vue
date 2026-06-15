<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { engineStatus } from '~/three/diagnostics'

const canvas = ref<HTMLCanvasElement | null>(null)
// type souple : Experience est chargé dynamiquement côté client
let xp: { pause(): void; resume(): void; dispose(): void; quality: { tier: string } } | null = null
let onVis: (() => void) | null = null

function probeWebGL(): 'ok' | 'absent' {
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    return gl ? 'ok' : 'absent'
  } catch {
    return 'absent'
  }
}

onMounted(async () => {
  // On renseigne le diagnostic AVANT toute chose (inconditionnel).
  engineStatus.webgl = probeWebGL()

  if (!canvas.value) {
    engineStatus.state = 'erreur'
    engineStatus.message = 'Canvas introuvable (la ref n’est pas montée).'
    return
  }
  if (engineStatus.webgl === 'absent') {
    engineStatus.state = 'erreur'
    engineStatus.message = 'WebGL indisponible — active l’accélération matérielle du navigateur.'
    return
  }

  try {
    // Import dynamique : le moteur Three n’est chargé que côté client.
    const { Experience } = await import('~/three/Experience')
    xp = new Experience(canvas.value)
    console.info('[cosmos] Expérience 3D démarrée — palier de qualité :', xp.quality.tier)
  } catch (err) {
    engineStatus.state = 'erreur'
    engineStatus.message = err instanceof Error ? err.message : String(err)
    console.error('[cosmos] Échec du démarrage WebGL :', err)
    return
  }

  onVis = () => {
    if (!xp) return
    if (document.hidden) xp.pause()
    else xp.resume()
  }
  document.addEventListener('visibilitychange', onVis)
})

onBeforeUnmount(() => {
  if (onVis) document.removeEventListener('visibilitychange', onVis)
  xp?.dispose()
  xp = null
})
</script>

<template>
  <div class="scene-layer" aria-hidden="true">
    <canvas ref="canvas" />
  </div>
</template>
