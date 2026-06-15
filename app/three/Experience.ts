import {
  ACESFilmicToneMapping, Color, HalfFloatType, PerspectiveCamera, Scene, SRGBColorSpace,
  Vector2, Vector3, WebGLRenderer, WebGLRenderTarget,
} from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js'

import { Sizes } from './core/Sizes'
import { Clock } from './core/Clock'
import { detectQuality, type QualityProfile } from './core/Quality'
import { World } from './world/World'
import { camProxy } from './journeyState'
import { engineStatus } from './diagnostics'

/**
 * Moteur 3D autonome (indépendant de Vue/GSAP).
 * Il LIT l'état partagé (camProxy / journeyHud) que la couche scroll écrit.
 */
export class Experience {
  private renderer: WebGLRenderer
  private scene = new Scene()
  private camera: PerspectiveCamera
  private composer?: EffectComposer
  private bloom?: UnrealBloomPass
  private fxaa?: ShaderPass
  private sizes: Sizes
  private clock = new Clock()
  private world: World
  readonly quality: QualityProfile
  private raf = 0
  private running = true

  // lissage caméra (cibles vers lesquelles on interpole)
  private camPos = new Vector3()
  private lookAt = new Vector3()

  constructor(canvas: HTMLCanvasElement) {
    this.quality = detectQuality()
    this.sizes = new Sizes()

    this.scene.background = new Color('#05070d')

    this.camera = new PerspectiveCamera(55, this.sizes.width / this.sizes.height, 0.1, 4000)
    this.camPos.set(camProxy.px, camProxy.py, camProxy.pz)
    this.lookAt.set(camProxy.tx, camProxy.ty, camProxy.tz)
    this.camera.position.copy(this.camPos)
    this.camera.lookAt(this.lookAt)

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: this.quality.tier !== 'low',
      powerPreference: 'high-performance',
      alpha: false,
    })
    this.renderer.outputColorSpace = SRGBColorSpace
    this.renderer.toneMapping = ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.1
    this.applySize()

    this.world = new World(this.scene, this.quality, this.renderer.getPixelRatio())

    // Bloom activable/désactivable : ajoute ?nobloom à l'URL pour isoler le
    // post-processing (utile pour diagnostiquer un canvas vide).
    const noBloom = new URLSearchParams(location.search).has('nobloom')
    if (this.quality.bloom && !noBloom) this.setupComposer()
    console.info('[cosmos] post-processing (bloom) :', this.composer ? 'actif' : 'désactivé')

    // diagnostic
    engineStatus.tier = this.quality.tier
    engineStatus.bloom = !!this.composer
    engineStatus.canvasSize = `${canvas.width}×${canvas.height}`
    engineStatus.windowSize = `${this.sizes.width}×${this.sizes.height}`
    engineStatus.state = 'actif'

    this.sizes.on(() => this.applySize())
    this.loop()
  }

  private setupComposer() {
    // Cible de rendu HDR (demi-flottant) MONO-échantillon : compatibilité maximale
    // et dégradés sans banding. L'anti-aliasing est confié à une passe FXAA — fiable
    // avec le post-processing, là où le MSAA sur cible flottante scintille selon le GPU.
    const rt = new WebGLRenderTarget(this.sizes.width, this.sizes.height, {
      type: HalfFloatType,
    })
    this.composer = new EffectComposer(this.renderer, rt)
    this.composer.setPixelRatio(this.renderer.getPixelRatio())
    this.composer.setSize(this.sizes.width, this.sizes.height)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.bloom = new UnrealBloomPass(
      new Vector2(this.sizes.width, this.sizes.height),
      this.quality.bloomStrength, // force
      0.6, // rayon
      0.08, // seuil de luminance
    )
    this.composer.addPass(this.bloom)
    this.composer.addPass(new OutputPass())
    // Anti-aliasing FXAA en dernier (sur l'image finale).
    this.fxaa = new ShaderPass(FXAAShader)
    this.updateFxaaResolution()
    this.composer.addPass(this.fxaa)
  }

  private updateFxaaResolution() {
    if (!this.fxaa) return
    const pr = this.renderer.getPixelRatio()
    this.fxaa.material.uniforms['resolution'].value.set(
      1 / (this.sizes.width * pr),
      1 / (this.sizes.height * pr),
    )
  }

  private applySize() {
    const pr = Math.min(this.sizes.pixelRatio, this.quality.maxPixelRatio)
    this.camera.aspect = this.sizes.width / this.sizes.height
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(pr)
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.world?.setPixelRatio(pr)
    if (this.composer) {
      this.composer.setPixelRatio(pr)
      this.composer.setSize(this.sizes.width, this.sizes.height)
    }
    this.bloom?.resolution.set(this.sizes.width, this.sizes.height)
    this.updateFxaaResolution()
  }

  private loop = () => {
    if (!this.running) return
    try {
      const delta = this.clock.tick()
      const e = this.clock.elapsed

      // cible caméra (depuis le scroll) + dérive subtile « pilotage »
      const driftX = Math.sin(e * 0.25) * 0.5 + Math.sin(e * 0.7) * 0.15
      const driftY = Math.cos(e * 0.32) * 0.35

      const targetPos = this._tmpPos.set(
        camProxy.px + driftX,
        camProxy.py + driftY,
        camProxy.pz,
      )
      const targetLook = this._tmpLook.set(camProxy.tx, camProxy.ty, camProxy.tz)

      // lissage indépendant du framerate
      const k = 1 - Math.pow(0.0015, delta)
      this.camPos.lerp(targetPos, k)
      this.lookAt.lerp(targetLook, k)
      this.camera.position.copy(this.camPos)
      this.camera.lookAt(this.lookAt)
      // léger roulis pour l'effet vaisseau
      this.camera.rotation.z = Math.sin(e * 0.2) * 0.02 + camProxy.warp * 0.15

      this.world.update(e, delta, this.camera, camProxy.warp)

      if (this.composer) this.composer.render()
      else this.renderer.render(this.scene, this.camera)

      engineStatus.frames++
    } catch (err) {
      // une frame a planté : on capture l'erreur et on arrête (évite le spam)
      this.running = false
      engineStatus.state = 'erreur'
      engineStatus.message = err instanceof Error ? err.message : String(err)
      console.error('[cosmos] Erreur dans la boucle de rendu :', err)
      return
    }
    this.raf = requestAnimationFrame(this.loop)
  }

  private _tmpPos = new Vector3()
  private _tmpLook = new Vector3()

  /** À appeler quand l'onglet repasse au premier plan (évite un gros delta). */
  resume() {
    if (!this.running) {
      this.running = true
      this.clock.tick()
      this.loop()
    }
  }

  pause() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  dispose() {
    this.pause()
    this.sizes.dispose()
    this.world.dispose()
    this.composer?.dispose()
    this.renderer.dispose()
  }
}
