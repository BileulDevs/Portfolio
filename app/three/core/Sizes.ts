/** Suivi des dimensions du viewport + devicePixelRatio plafonné. */
export class Sizes {
  width = 0
  height = 0
  pixelRatio = 1
  private callbacks: Array<() => void> = []
  private onResize = () => this.update()

  constructor() {
    this.update()
    window.addEventListener('resize', this.onResize)
  }

  private update() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    // plafond à 2 : au-delà, coût GPU élevé pour un gain visuel marginal
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    this.callbacks.forEach((cb) => cb())
  }

  on(cb: () => void) {
    this.callbacks.push(cb)
  }

  dispose() {
    window.removeEventListener('resize', this.onResize)
    this.callbacks = []
  }
}
