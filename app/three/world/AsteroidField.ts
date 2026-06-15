import {
  Color, Group, IcosahedronGeometry, InstancedMesh, MeshStandardMaterial, Object3D, Vector3,
} from 'three'

/** Champ d'astéroïdes — InstancedMesh (un seul draw call) pour la performance. */
export class AsteroidField {
  group = new Group()
  private mesh: InstancedMesh
  private geo: IcosahedronGeometry
  private mat: MeshStandardMaterial

  constructor(center: Vector3, count: number) {
    this.group.position.copy(center)

    this.geo = new IcosahedronGeometry(1, 1)
    this.mat = new MeshStandardMaterial({
      color: new Color('#6b5d52'),
      roughness: 1,
      metalness: 0,
      flatShading: true,
    })
    this.mesh = new InstancedMesh(this.geo, this.mat, count)

    const dummy = new Object3D()
    const region = new Vector3(140, 70, 200)
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * region.x,
        (Math.random() - 0.5) * region.y,
        (Math.random() - 0.5) * region.z,
      )
      dummy.rotation.set(Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28)
      const s = 0.4 + Math.random() * Math.random() * 4
      dummy.scale.set(s, s * (0.7 + Math.random() * 0.6), s)
      dummy.updateMatrix()
      this.mesh.setMatrixAt(i, dummy.matrix)
    }
    this.mesh.instanceMatrix.needsUpdate = true
    this.group.add(this.mesh)
  }

  update(_elapsed: number, delta: number) {
    // dérive lente de l'ensemble → impression de navigation
    this.group.rotation.y += delta * 0.01
  }

  dispose() {
    this.geo.dispose()
    this.mat.dispose()
    this.mesh.dispose()
  }
}
