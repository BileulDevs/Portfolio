import type { Directive } from "vue";
import { prefersReducedMotion } from "@/composables/useMedia";

/** Shared observer: one IntersectionObserver for every revealed element on the page. */
let observer: IntersectionObserver | null = null;
function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        observer?.unobserve(entry.target);
      }),
    // Trigger slightly before the element is fully in view so the motion is seen, not caught mid-way.
    { rootMargin: "0px 0px -10% 0px" },
  );
  return observer;
}

/** `v-reveal`: adds `.in` once the element enters the viewport (immediately with reduced motion). */
export const vReveal: Directive<HTMLElement> = {
  mounted(el) {
    if (prefersReducedMotion()) el.classList.add("in");
    else getObserver().observe(el);
  },
  unmounted(el) {
    observer?.unobserve(el);
  },
};
