import {
  AdditiveBlending, Camera, Color, Group, Mesh, PlaneGeometry, ShaderMaterial, Vector3,
} from 'three'
import { nebulaVertex, nebulaFragment } from '../shaders/nebula'

/** Nébuleuse « faux-volumétrique » : plans additifs orientés caméra. */
export class Nebula {
  group = new Group()
  private materials: ShaderMaterial[] = []
  private meshes: Mesh[] = []
  private disposables: Array<{ dispose: () => void }> = []

  constructor(center: Vector3, planeCount: number) {
    this.group.position.copy(center)
    const geo = new PlaneGeometry(1, 1)
    this.disposables.push(geo)

    for (let i = 0; i < planeCount; i++) {
      const mat = new ShaderMaterial({
        vertexShader: nebulaVertex,
        fragmentShader: nebulaFragment,
        uniforms: {
          uTime: { value: 0 },
          uSeed: { value: Math.random() * 100 },
          uColorA: { value: new Color('#ff7a4d') }, // cœur chaud
          uColorB: { value: new Color('#3a1d6e') }, // violet profond
          uColorC: { value: new Color('#46b6ff') }, // accents cyan
          uOpacity: { value: 0.5 },
        },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      })
      const mesh = new Mesh(geo, mat)
      const spread = 120
      mesh.position.set(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread * 0.6,
        (Math.random() - 0.5) * spread,
      )
      const scale = 90 + Math.random() * 90
      mesh.scale.set(scale, scale, 1)
      this.group.add(mesh)
      this.materials.push(mat)
      this.meshes.push(mesh)
      this.disposables.push(mat)
    }
  }

  update(elapsed: number, _delta: number, camera: Camera) {
    for (const m of this.materials) m.uniforms.uTime.value = elapsed
    // billboard : chaque plan fait face à la caméra → impression de volume
    for (const mesh of this.meshes) {
      mesh.quaternion.copy(camera.quaternion)
    }
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose())
  }
}
