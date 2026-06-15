import { Vector3 } from 'three'

/**
 * SOURCE DE VÉRITÉ SPATIALE
 * Positions des corps célestes ET trajectoire caméra, au même endroit,
 * pour qu'objets 3D et chorégraphie restent synchronisés.
 *
 * Le vaisseau vole le long de l'axe -Z. Plus on scrolle, plus z décroît.
 */

export const WORLD = {
  earth: new Vector3(0, 0, 0),
  moon: new Vector3(34, 7, -12),
  sun: new Vector3(-72, 14, -34),

  mars: new Vector3(16, -3, -78),
  jupiter: new Vector3(-26, 5, -132),
  saturn: new Vector3(20, -2, -188),

  nebula: new Vector3(0, 0, -330),
  wormhole: new Vector3(0, 0, -440),

  exoplanets: [
    new Vector3(-12, 2, -520),
    new Vector3(10, -3, -552),
    new Vector3(-4, 6, -585),
    new Vector3(14, 4, -612),
  ],

  asteroids: new Vector3(0, 0, -680),
  blackhole: new Vector3(0, 0, -800),
  galaxy: new Vector3(0, -10, -1010),
}

export interface Station {
  /** position de la caméra */
  p: [number, number, number]
  /** point visé */
  t: [number, number, number]
}

/**
 * Une station par chapitre (8). GSAP interpole entre elles, piloté par le scroll.
 * L'index correspond à `chapters[i]` dans profile.ts.
 */
export const STATIONS: Station[] = [
  // 0 — Terre (héros) : Terre légèrement décentrée, Lune au loin
  { p: [7, 2.4, 16], t: [0, 0, 0] },
  // 1 — Système solaire : on plonge vers les géantes
  { p: [9, 0, -52], t: [-26, 5, -132] },
  // 2 — Nébuleuse : on entre dans le nuage
  { p: [3, 6, -250], t: [0, 0, -330] },
  // 3 — Trou de ver : alignement sur le tunnel
  { p: [0, 0, -412], t: [0, 0, -470] },
  // 4 — Exoplanètes : on slalome entre les mondes
  { p: [10, -2, -498], t: [-12, 2, -560] },
  // 5 — Champ d'astéroïdes : navigation latérale
  { p: [-9, 3, -648], t: [6, -2, -700] },
  // 6 — Trou noir : approche prudente, légèrement au-dessus du disque
  { p: [0, 9, -724], t: [0, 0, -800] },
  // 7 — Nouvelle galaxie : recul contemplatif, vue panoramique
  { p: [0, 22, -912], t: [0, -10, -1010] },
]

/** Position/visée de départ avant le lancement (intro). */
export const INTRO_STATION: Station = { p: [2, 1.5, 40], t: [0, 0, 0] }
