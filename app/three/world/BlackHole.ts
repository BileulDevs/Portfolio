import {
  AdditiveBlending, Color, Group, Mesh, MeshBasicMaterial, RingGeometry, ShaderMaterial,
  SphereGeometry, Vector2, Vector3,
} from 'three'
import {
  diskVertex, diskFragment, photonRingVertex, photonRingFragment,
} from '../shaders/blackhole'

/** Trou noir : horizon des événements + anneau de photons + disque d'accrétion. */
export class BlackHole {
  group = new Group()
  private diskMat: ShaderMaterial
  private disposables: Array<{ dispose: () => void }> = []
  private disk: Mesh

  constructor(center: Vector3, horizon = 12) {
    this.group.position.copy(center)
    // légère inclinaison pour révéler le disque
    this.group.rotation.x = -0.35

    // --- horizon des événements : sphère noire ---
    const hGeo = new SphereGeometry(horizon, 64, 64)
    const hMat = new MeshBasicMaterial({ color: 0x000000 })
    this.group.add(new Mesh(hGeo, hMat))
    this.disposables.push(hGeo, hMat)

    // --- anneau de photons : liseré incandescent (fresnel) ---
    const pGeo = new SphereGeometry(horizon * 1.08, 64, 64)
    const pMat = new ShaderMaterial({
      vertexShader: photonRingVertex,
      fragmentShader: photonRingFragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    this.group.add(new Mesh(pGeo, pMat))
    this.disposables.push(pGeo, pMat)

    // --- disque d'accrétion (plan, posé à plat) ---
    const inner = horizon * 1.5
    const outer = horizon * 5.5
    const dGeo = new RingGeometry(inner, outer, 220, 1)
    this.diskMat = new ShaderMaterial({
      vertexShader: diskVertex,
      fragmentShader: diskFragment,
      uniforms: {
        uTime: { value: 0 },
        uInner: { value: inner },
        uOuter: { value: outer },
        uDopplerDir: { value: new Vector2(1, 0) }, // côté +X plus brillant
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    this.disk = new Mesh(dGeo, this.diskMat)
    this.disk.rotation.x = Math.PI / 2 // couche le disque dans le plan horizontal
    this.group.add(this.disk)
    this.disposables.push(dGeo, this.diskMat)
  }

  update(elapsed: number, delta: number) {
    this.diskMat.uniforms.uTime.value = elapsed
    this.disk.rotation.z += delta * 0.05
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose())
  }
}
