/**
 * État de diagnostic du moteur 3D (objet JS simple, non réactif).
 * Le moteur l'alimente ; le badge de debug le lit par sondage.
 * N'apparaît qu'en développement (voir DebugBadge.vue).
 */
export const engineStatus = {
  webgl: 'inconnu' as 'inconnu' | 'ok' | 'absent',
  state: 'en attente' as 'en attente' | 'actif' | 'erreur',
  tier: '' as string,
  bloom: false,
  frames: 0,
  canvasSize: '' as string,
  windowSize: '' as string,
  message: '' as string,
}
