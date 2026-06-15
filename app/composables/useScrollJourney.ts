import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { camProxy, journeyHud } from '~/three/journeyState'
import { STATIONS, INTRO_STATION } from '~/three/camera/stations'

/**
 * Orchestration du voyage :
 * - Lenis pilote le scroll (synchronisé avec le ticker GSAP)
 * - une timeline GSAP scrubbée par ScrollTrigger déplace la caméra (camProxy)
 *   le long des stations, en synchronisation parfaite avec le scroll
 * - enveloppe de « warp » au passage du trou de ver
 * - révélation des panneaux de contenu
 *
 * Découplé du moteur 3D : on n'écrit que dans l'état partagé `camProxy`.
 */
export function useScrollJourney() {
  let lenis: Lenis | null = null
  let masterST: ScrollTrigger | null = null
  let tickerFn: ((t: number) => void) | null = null
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function setup() {
    gsap.registerPlugin(ScrollTrigger)

    // position initiale (intro)
    Object.assign(camProxy, {
      px: INTRO_STATION.p[0], py: INTRO_STATION.p[1], pz: INTRO_STATION.p[2],
      tx: INTRO_STATION.t[0], ty: INTRO_STATION.t[1], tz: INTRO_STATION.t[2], warp: 0,
    })

    if (!reduced) {
      lenis = new Lenis({
        autoRaf: false,        // on pilote depuis le ticker GSAP (une seule boucle)
        duration: 1.4,
        syncTouch: false,      // meilleure perf tactile
        wheelMultiplier: 0.9,
      })
      lenis.stop() // verrouillé jusqu'au lancement
      lenis.on('scroll', ScrollTrigger.update)
      tickerFn = (time: number) => lenis?.raf(time * 1000)
      gsap.ticker.add(tickerFn)
      gsap.ticker.lagSmoothing(0)
    }

    // révélations de contenu (sautées si reduced-motion : CSS les affiche déjà)
    if (!reduced) {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
        })
      })
    }
  }

  /**
   * Construit la timeline caméra, alignée sur la position réelle des sections
   * (mesurée dans le DOM → robuste si on change les hauteurs). Chaque station est
   * atteinte quand sa section est lue ; la dernière (galaxie) est atteinte un peu
   * en avance puis MAINTENUE jusqu'en bas (la galaxie occupe seule la fin).
   */
  function buildCameraTimeline() {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.chapter'))
    const range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const vh = window.innerHeight

    // fraction de scroll où chaque station doit être atteinte
    const at: number[] = sections.map((sec, i) => {
      if (i === 0) return 0 // Terre : station dès le départ (héros ancré en haut)
      const center = sec.offsetTop + sec.offsetHeight / 2 - vh / 2
      return Math.min(1, Math.max(0, center / range))
    })
    // dernière station (galaxie) : atteinte un peu avant le centre de sa section,
    // pour qu'elle soit en place pendant la lecture du contact, puis maintenue.
    if (at.length > 1) {
      const last = sections[sections.length - 1]
      const earlier = (last.offsetTop + last.offsetHeight * 0.22 - vh / 2) / range
      at[at.length - 1] = Math.min(0.95, Math.max(at[at.length - 2] + 0.04, earlier))
    }

    const tl = gsap.timeline({ defaults: { ease: 'power1.inOut' } })
    for (let i = 1; i < STATIONS.length; i++) {
      const s = STATIONS[i]
      tl.to(camProxy, {
        px: s.p[0], py: s.p[1], pz: s.p[2],
        tx: s.t[0], ty: s.t[1], tz: s.t[2],
        duration: Math.max(0.02, at[i] - at[i - 1]),
      }, at[i - 1])
    }
    // maintien sur la galaxie jusqu'à la fin (étend la timeline à une durée de 1.0,
    // pour que la fraction de scroll = temps de timeline).
    const lastAt = at[STATIONS.length - 1]
    tl.to({ h: 0 }, { h: 1, duration: Math.max(0.02, 1 - lastAt) }, lastAt)

    // enveloppe de warp au trou de ver (station 3)
    const wAt = at[3] ?? 0.42
    tl.to(camProxy, { warp: 1, duration: 0.05, ease: 'power2.in' }, Math.max(0, wAt - 0.05))
    tl.to(camProxy, { warp: 0, duration: 0.08, ease: 'power2.out' }, wAt + 0.02)

    masterST = ScrollTrigger.create({
      animation: tl,
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        journeyHud.progress = self.progress
        let idx = 0
        for (let i = 0; i < at.length; i++) if (self.progress >= at[i] - 0.03) idx = i
        journeyHud.chapterIndex = idx
      },
    })
    ScrollTrigger.refresh()
  }

  /** Lancement : transition intro → première station, puis déverrouille le scroll. */
  function start() {
    journeyHud.started = true

    if (reduced) {
      // pas d'envol cinématique : on se cale directement sur la station 0
      Object.assign(camProxy, {
        px: STATIONS[0].p[0], py: STATIONS[0].p[1], pz: STATIONS[0].p[2],
        tx: STATIONS[0].t[0], ty: STATIONS[0].t[1], tz: STATIONS[0].t[2],
      })
      buildCameraTimeline()
      return
    }

    const s0 = STATIONS[0]
    gsap.timeline()
      .to(camProxy, { warp: 0.5, duration: 0.6, ease: 'power2.in' }, 0)
      .to(camProxy, {
        px: s0.p[0], py: s0.p[1], pz: s0.p[2],
        tx: s0.t[0], ty: s0.t[1], tz: s0.t[2],
        duration: 3.2, ease: 'power3.inOut',
      }, 0)
      .to(camProxy, { warp: 0, duration: 1.2, ease: 'power2.out' }, 1.0)
      .add(() => {
        buildCameraTimeline()
        lenis?.start()
      })
  }

  /** Ramène en haut en douceur — la caméra rembobine le voyage jusqu'à la Terre. */
  function scrollToTop() {
    if (lenis) lenis.scrollTo(0, { duration: 2.2 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function destroy() {
    masterST?.kill()
    ScrollTrigger.getAll().forEach((st) => st.kill())
    if (tickerFn) gsap.ticker.remove(tickerFn)
    lenis?.destroy()
    lenis = null
  }

  return { setup, start, destroy, scrollToTop }
}
