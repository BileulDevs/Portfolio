import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { prefersReducedMotion } from "~/composables/useMedia";

/**
 * Smooth, inertial page scroll. Lenis still drives the native window scroll, so every
 * scroll listener of the site (progress bar, manifesto, passions morph) keeps working as is.
 * Off with reduced motion: the page then scrolls natively.
 */
export default defineNuxtPlugin(() => {
  const lenis = prefersReducedMotion()
    ? null
    : new Lenis({
        autoRaf: true,
        lerp: 0.1,
        // The project modal scrolls its own window: leave every gesture to the browser while it is open.
        prevent: () => document.documentElement.classList.contains("modal-open"),
      });
  return { provide: { lenis } };
});
