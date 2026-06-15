import { reactive } from 'vue'
import { INTRO_STATION } from './camera/stations'

/**
 * PONT scroll ↔ 3D, volontairement découplé.
 *
 * - `camProxy` : objet JS *simple* (pas de réactivité Vue) que GSAP anime à
 *   60 fps et que le moteur Three lit à chaque frame. Aucune surcharge Vue.
 * - `journeyHud` : état *réactif* minimal pour le HUD (valeurs qui changent peu).
 */

export const camProxy = {
  px: INTRO_STATION.p[0],
  py: INTRO_STATION.p[1],
  pz: INTRO_STATION.p[2],
  tx: INTRO_STATION.t[0],
  ty: INTRO_STATION.t[1],
  tz: INTRO_STATION.t[2],
  // intensité du « warp » (0..1), montée pendant le trou de ver
  warp: 0,
}

export const journeyHud = reactive({
  progress: 0, // 0..1 global
  chapterIndex: 0,
  started: false,
})
