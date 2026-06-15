import {
  AdditiveBlending, BufferAttribute, BufferGeometry, Color, Points, ShaderMaterial,
} from 'three'
import { starfieldVertex, starfieldFragment } from '../shaders/starfield'

/** Champ d'étoiles GPU englobant tout le trajet. */
export class Starfield {
  points: Points
  private material: ShaderMaterial
  private geometry: BufferGeometry

  constructor(count: number, pixelRatio: number) {
    this.geometry = new BufferGeometry()
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const seeds = new Float32Array(count)
    const colors = new Float32Array(count * 3)

    const warm = new Color('#ffd9a8')
    const white = new Color('#f3f6ff')
    const blue = new Color('#a9c8ff')
    const tmp = new Color()

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // boîte large couvrant l'axe du voyage (z de +120 à -1150)
      positions[i3] = (Math.random() - 0.5) * 900
      positions[i3 + 1] = (Math.random() - 0.5) * 700
      positions[i3 + 2] = 120 - Math.random() * 1300
      scales[i] = 0.5 + Math.random() * Math.random() * 2.5
      seeds[i] = Math.random()

      // température de couleur réaliste : majorité blanches, quelques chaudes/bleues
      const r = Math.random()
      if (r < 0.7) tmp.copy(white)
      else if (r < 0.86) tmp.lerpColors(white, warm, Math.random())
      else tmp.lerpColors(white, blue, Math.random())
      colors[i3] = tmp.r; colors[i3 + 1] = tmp.g; colors[i3 + 2] = tmp.b
    }

    this.geometry.setAttribute('position', new BufferAttribute(positions, 3))
    this.geometry.setAttribute('aScale', new BufferAttribute(scales, 1))
    this.geometry.setAttribute('aSeed', new BufferAttribute(seeds, 1))
    this.geometry.setAttribute('aColor', new BufferAttribute(colors, 3))

    this.material = new ShaderMaterial({
      vertexShader: starfieldVertex,
      fragmentShader: starfieldFragment,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 8 },
        uPixelRatio: { value: pixelRatio },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })

    this.points = new Points(this.geometry, this.material)
    this.points.frustumCulled = false
  }

  setPixelRatio(pr: number) {
    this.material.uniforms.uPixelRatio.value = pr
  }

  update(elapsed: number) {
    this.material.uniforms.uTime.value = elapsed
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
  }
}
