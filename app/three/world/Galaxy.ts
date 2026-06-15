import {
  AdditiveBlending, BufferAttribute, BufferGeometry, Color, Group, Points, ShaderMaterial, Vector3,
} from 'three'
import { galaxyVertex, galaxyFragment } from '../shaders/galaxy'

/** Galaxie spirale procédurale (générateur logarithmique). */
export class Galaxy {
  group = new Group()
  private mat: ShaderMaterial
  private geo: BufferGeometry

  constructor(center: Vector3, count: number, pixelRatio: number) {
    this.group.position.copy(center)
    this.group.rotation.x = -0.6

    const params = {
      radius: 220, branches: 5, spin: 1.1, randomness: 0.4, randomnessPower: 3.2,
    }
    const inside = new Color('#ffcf8a')
    const outside = new Color('#3a6bff')

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const tmp = new Color()

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const radius = Math.pow(Math.random(), 1.6) * params.radius
      const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2
      const spinAngle = radius * (params.spin / params.radius) * 6.0

      const rp = () =>
        Math.pow(Math.random(), params.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius

      const rx = rp(), ry = rp() * 0.35, rz = rp()
      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + rx
      positions[i3 + 1] = ry
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + rz

      tmp.copy(inside).lerp(outside, radius / params.radius)
      colors[i3] = tmp.r; colors[i3 + 1] = tmp.g; colors[i3 + 2] = tmp.b
      scales[i] = 0.5 + Math.random() * 2
    }

    this.geo = new BufferGeometry()
    this.geo.setAttribute('position', new BufferAttribute(positions, 3))
    this.geo.setAttribute('color', new BufferAttribute(colors, 3))
    this.geo.setAttribute('aScale', new BufferAttribute(scales, 1))

    this.mat = new ShaderMaterial({
      vertexShader: galaxyVertex,
      fragmentShader: galaxyFragment,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 5 },
        uPixelRatio: { value: pixelRatio },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      vertexColors: true,
    })

    const points = new Points(this.geo, this.mat)
    points.frustumCulled = false
    this.group.add(points)
  }

  setPixelRatio(pr: number) {
    this.mat.uniforms.uPixelRatio.value = pr
  }

  update(elapsed: number, delta: number) {
    this.mat.uniforms.uTime.value = elapsed
    this.group.rotation.y += delta * 0.015
  }

  dispose() {
    this.geo.dispose()
    this.mat.dispose()
  }
}
