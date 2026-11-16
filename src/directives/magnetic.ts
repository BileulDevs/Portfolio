import type { Directive } from "vue";
import { prefersReducedMotion } from "@/composables/useMedia";

/** Fraction of the pointer offset the element follows; above ~0.4 it starts to feel slippery. */
const STRENGTH = 0.3;

interface MagneticEl extends HTMLElement {
  _magnetic?: { move: (e: PointerEvent) => void; leave: () => void };
}

/** `v-magnetic`: the element leans toward a mouse pointer hovering it. No-op on touch / reduced motion. */
export const vMagnetic: Directive<MagneticEl> = {
  mounted(el) {
    if (prefersReducedMotion() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.transition = "";
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * STRENGTH}px, ${(e.clientY - r.top - r.height / 2) * STRENGTH}px)`;
    };
    const leave = () => {
      el.style.transition = "transform .6s var(--ease)";
      el.style.transform = "";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    el._magnetic = { move, leave };
  },
  unmounted(el) {
    if (!el._magnetic) return;
    el.removeEventListener("pointermove", el._magnetic.move);
    el.removeEventListener("pointerleave", el._magnetic.leave);
  },
};
