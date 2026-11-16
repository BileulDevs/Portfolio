import type { RouterConfig } from "@nuxt/schema";
import { prefersReducedMotion } from "~/composables/useMedia";

export default {
  scrollBehavior(to, from, saved) {
    // Smooth only within the same page; after a page change, jump straight to the anchor.
    const behavior: ScrollBehavior = prefersReducedMotion() || to.name !== from.name ? "instant" : "smooth";
    const target = saved ?? (to.hash ? { el: to.hash, behavior } : { top: 0 });
    // Same page, or first load (the page is already server-rendered): scroll now.
    if (to.name === from.name || !from.matched.length) return target;
    // Another page: wait for the out-in page transition to swap pages, so the anchor exists.
    const nuxtApp = useNuxtApp();
    return new Promise((resolve) =>
      nuxtApp.hooks.hookOnce("page:transition:finish", () => void requestAnimationFrame(() => resolve(target))),
    );
  },
} satisfies RouterConfig;
