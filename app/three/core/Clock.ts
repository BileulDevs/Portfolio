/** Horloge : temps écoulé + delta par frame (borné pour éviter les sauts). */
export class Clock {
  elapsed = 0
  delta = 0.016
  private last = performance.now()

  tick() {
    const now = performance.now()
    this.delta = Math.min((now - this.last) / 1000, 0.05) // borne anti-saut (retour d'onglet)
    this.last = now
    this.elapsed += this.delta
    return this.delta
  }
}
