import { AmbientLight, Camera, DirectionalLight, Scene, Vector3 } from 'three'
import type { QualityProfile } from '../core/Quality'
import { WORLD } from '../camera/stations'
import { Starfield } from './Starfield'
import { Sun } from './Sun'
import { Planet } from './Planet'
import { Nebula } from './Nebula'
import { Wormhole } from './Wormhole'
import { AsteroidField } from './AsteroidField'
import { BlackHole } from './BlackHole'
import { Galaxy } from './Galaxy'

/** Le monde — instancie et orchestre tous les éléments cosmiques. */
export class World {
  private starfield: Starfield
  private galaxy: Galaxy
  private sun: Sun
  private nebula: Nebula
  private wormhole: Wormhole
  private asteroids: AsteroidField
  private blackhole: BlackHole
  private planets: Planet[] = []
  private disposables: Array<{ dispose: () => void }> = []

  constructor(scene: Scene, q: QualityProfile, pixelRatio: number) {
    const seg = q.sphereSegments

    // Étoiles englobantes
    this.starfield = new Starfield(q.starCount, pixelRatio)
    scene.add(this.starfield.points)

    // Soleil (source d'éclairage logique pour les shaders de planètes)
    this.sun = new Sun(WORLD.sun, 14)
    scene.add(this.sun.group)
    const sunPos = this.sun.position

    // Chapitre 1 — Terre + Lune
    this.addPlanet({
      position: WORLD.earth, radius: 6, type: 0,
      colorLow: '#0b3d66', colorMid: '#2e6b3a', colorHigh: '#cdbd92',
      atmosphere: '#4a90e2', segments: seg, rotationSpeed: 0.05, tilt: 0.41,
    }, sunPos, scene)
    this.addPlanet({
      position: WORLD.moon, radius: 1.6, type: 2,
      colorLow: '#3a3a3f', colorMid: '#8a8a90', colorHigh: '#d8d8dc',
      segments: Math.min(seg, 48), rotationSpeed: 0.02,
    }, sunPos, scene)

    // Chapitre 2 — Système solaire
    this.addPlanet({
      position: WORLD.mars, radius: 3.2, type: 2,
      colorLow: '#5a2c1e', colorMid: '#a4532e', colorHigh: '#d98f5b',
      atmosphere: '#c9683c', segments: seg, rotationSpeed: 0.05,
    }, sunPos, scene)
    this.addPlanet({
      position: WORLD.jupiter, radius: 9, type: 1,
      colorLow: '#6b4f3a', colorMid: '#c8a877', colorHigh: '#efe2c4',
      segments: seg, rotationSpeed: 0.08,
    }, sunPos, scene)
    this.addPlanet({
      position: WORLD.saturn, radius: 7, type: 1,
      colorLow: '#7a6244', colorMid: '#b89b6e', colorHigh: '#e6d3a6',
      ring: { inner: 9, outer: 15, color: '#cbb487' }, segments: seg, rotationSpeed: 0.07, tilt: 0.47,
    }, sunPos, scene)

    // Chapitre 3 — Nébuleuse
    this.nebula = new Nebula(WORLD.nebula, q.nebulaPlanes)
    scene.add(this.nebula.group)

    // Chapitre 4 — Trou de ver
    this.wormhole = new Wormhole(WORLD.wormhole)
    scene.add(this.wormhole.group)

    // Chapitre 5 — Exoplanètes (chaque planète = un projet)
    const exoStyles: Array<Pick<ConstructorParameters<typeof Planet>[0], 'type' | 'colorLow' | 'colorMid' | 'colorHigh' | 'atmosphere'>> = [
      { type: 0, colorLow: '#0a2e4d', colorMid: '#1f7a6b', colorHigh: '#c7e0d0', atmosphere: '#37c9a8' },
      { type: 1, colorLow: '#3a1d52', colorMid: '#9a5fb0', colorHigh: '#e0c2ef' },
      { type: 2, colorLow: '#4a2a12', colorMid: '#b07433', colorHigh: '#e8c98a', atmosphere: '#d98f3c' },
      { type: 0, colorLow: '#102a52', colorMid: '#3a6bd0', colorHigh: '#cfe0ff', atmosphere: '#5a9bff' },
    ]
    WORLD.exoplanets.forEach((pos, i) => {
      const s = exoStyles[i % exoStyles.length]
      this.addPlanet({
        position: pos, radius: 2.4 + (i % 3), type: s.type,
        colorLow: s.colorLow, colorMid: s.colorMid, colorHigh: s.colorHigh,
        atmosphere: s.atmosphere, segments: Math.min(seg, 64), rotationSpeed: 0.06 + i * 0.01,
      }, sunPos, scene)
    })

    // Chapitre 6 — Champ d'astéroïdes (+ éclairage directionnel, pour le MeshStandard)
    this.asteroids = new AsteroidField(WORLD.asteroids, q.asteroidCount)
    scene.add(this.asteroids.group)
    const key = new DirectionalLight(0xfff0e0, 2.2)
    key.position.set(1, 0.6, 1)
    scene.add(key, new AmbientLight(0x33405a, 0.4))

    // Chapitre 7 — Trou noir
    this.blackhole = new BlackHole(WORLD.blackhole, 12)
    scene.add(this.blackhole.group)

    // Chapitre 8 — Nouvelle galaxie
    this.galaxy = new Galaxy(WORLD.galaxy, q.galaxyCount, pixelRatio)
    scene.add(this.galaxy.group)
  }

  private addPlanet(cfg: ConstructorParameters<typeof Planet>[0], sunPos: Vector3, scene: Scene) {
    const p = new Planet(cfg, sunPos)
    this.planets.push(p)
    this.disposables.push(p)
    scene.add(p.group)
  }

  setPixelRatio(pr: number) {
    this.starfield.setPixelRatio(pr)
    this.galaxy.setPixelRatio(pr)
  }

  update(elapsed: number, delta: number, camera: Camera, warp: number) {
    this.starfield.update(elapsed)
    this.sun.update(elapsed)
    this.planets.forEach((p) => p.update(elapsed, delta))
    this.nebula.update(elapsed, delta, camera)
    this.wormhole.update(elapsed, warp)
    this.asteroids.update(elapsed, delta)
    this.blackhole.update(elapsed, delta)
    this.galaxy.update(elapsed, delta)
  }

  dispose() {
    this.starfield.dispose()
    this.sun.dispose()
    this.nebula.dispose()
    this.wormhole.dispose()
    this.asteroids.dispose()
    this.blackhole.dispose()
    this.galaxy.dispose()
    this.disposables.forEach((d) => d.dispose())
  }
}
