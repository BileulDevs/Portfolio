import {
  AdditiveBlending, BackSide, Color, Group, Mesh, ShaderMaterial, SphereGeometry, Vector3,
} from 'three'
import { sunVertex, sunFragment, coronaVertex, coronaFragment } from '../shaders/sun'

/** Le Soleil — surface émissive + couronne. Sert aussi de source d'éclairage logique. */
export class Sun {
  group = new Group()
  position: Vector3
  private mat: ShaderMaterial
  private disposables: Array<{ dispose: () => void }> = []

  constructor(position: Vector3, radius = 14) {
    this.position = position.clone()
    this.group.position.copy(position)

    const geo = new SphereGeometry(radius, 64, 64)
    this.mat = new ShaderMaterial({
      vertexShader: sunVertex,
      fragmentShader: sunFragment,
      uniforms: { uTime: { value: 0 } },
    })
    this.group.add(new Mesh(geo, this.mat))
    this.disposables.push(geo, this.mat)

    // couronne
    const coronaGeo = new SphereGeometry(radius * 1.6, 48, 48)
    const coronaMat = new ShaderMaterial({
      vertexShader: coronaVertex,
      fragmentShader: coronaFragment,
      uniforms: { uColor: { value: new Color('#ff8a3c') } },
      transparent: true,
      side: BackSide,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    this.group.add(new Mesh(coronaGeo, coronaMat))
    this.disposables.push(coronaGeo, coronaMat)
  }

  update(elapsed: number) {
    this.mat.uniforms.uTime.value = elapsed
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose())
  }
}
