/**
 * Palier de qualité — adapte la charge GPU au matériel.
 * Heuristique simple, sans dépendance externe (pas de detect-gpu).
 */
export type Tier = 'low' | 'medium' | 'high'

export interface QualityProfile {
  tier: Tier
  bloom: boolean
  bloomStrength: number
  starCount: number
  galaxyCount: number
  nebulaPlanes: number
  asteroidCount: number
  sphereSegments: number
  maxPixelRatio: number
}

export function detectQuality(): QualityProfile {
  const ua = navigator.userAgent
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua)
  const cores = navigator.hardwareConcurrency || 4
  const mem = (navigator as any).deviceMemory || 4

  let tier: Tier = 'high'
  if (isMobile || cores <= 4 || mem <= 4) tier = 'medium'
  if (isMobile && (cores <= 4 || mem <= 3)) tier = 'low'

  const profiles: Record<Tier, QualityProfile> = {
    high: {
      tier: 'high', bloom: true, bloomStrength: 0.55,
      starCount: 14000, galaxyCount: 28000, nebulaPlanes: 9,
      asteroidCount: 420, sphereSegments: 128, maxPixelRatio: 2,
    },
    medium: {
      tier: 'medium', bloom: true, bloomStrength: 0.35,
      starCount: 8000, galaxyCount: 16000, nebulaPlanes: 6,
      asteroidCount: 240, sphereSegments: 96, maxPixelRatio: 2,
    },
    low: {
      tier: 'low', bloom: false, bloomStrength: 0,
      starCount: 4000, galaxyCount: 8000, nebulaPlanes: 4,
      asteroidCount: 120, sphereSegments: 64, maxPixelRatio: 1.5,
    },
  }
  return profiles[tier]
}
