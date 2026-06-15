import {
  AdditiveBlending, BackSide, CatmullRomCurve3, Group, Mesh, ShaderMaterial, TubeGeometry, Vector3,
} from 'three'
import { wormholeVertex, wormholeFragment } from '../shaders/wormhole'

/** Trou de ver : tunnel parcouru de stries d'énergie, vu de l'intérieur (BackSide). */
export class Wormhole {
  group = new Group()
  private mat: ShaderMaterial
  private disposables: Array<{ dispose: () => void }> = []

  constructor(center: Vector3) {
    this.group.position.copy(center)

    // tube le long de l'axe Z, légèrement sinueux
    const path = new CatmullRomCurve3([
      new Vector3(0, 0, 60),
      new Vector3(3, -2, 20),
      new Vector3(-3, 2, -20),
      new Vector3(0, 0, -60),
    ])
    const geo = new TubeGeometry(path, 120, 14, 32, false)
    this.mat = new ShaderMaterial({
      vertexShader: wormholeVertex,
      fragmentShader: wormholeFragment,
      uniforms: { uTime: { value: 0 }, uWarp: { value: 0 } },
      transparent: true,
      side: BackSide,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    this.group.add(new Mesh(geo, this.mat))
    this.disposables.push(geo, this.mat)
  }

  /** `warp` 0..1 — intensité, pilotée par le scroll au passage. */
  update(elapsed: number, warp: number) {
    this.mat.uniforms.uTime.value = elapsed
    this.mat.uniforms.uWarp.value = warp
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose())
  }
}
