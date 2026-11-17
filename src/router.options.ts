import type { RouterConfig } from "@nuxt/schema";
import { prefersReducedMotion } from "~/composables/useMedia";

export default {
  scrollBehavior(to, from, saved) {
    // Only the query changed (the project modal opening / closing): keep the page where it is.
    if (to.path === from.path && to.hash === from.hash) return false;
    // Smooth only within the same page; after a page change, jump straight to the anchor.
    const behavior: ScrollBehavior = prefersReducedMotion() || to.name !== from.name ? "instant" : "smooth";
    const target = saved ?? (to.hash ? { el: to.hash, behavior } : { top: 0 });
    const nuxtApp = useNuxtApp();
    // Anchor on the same page: let Lenis glide there (a native smooth scroll would fight its inertia).
    const lenis = nuxtApp.$lenis as import("lenis").default | null | undefined;
    if (lenis && to.name === from.name && to.hash && !saved) {
      lenis.scrollTo(to.hash);
      return false;
    }
    // Same page, or first load (the page is already server-rendered): scroll now.
    if (to.name === from.name || !from.matched.length) return target;
    // Another page: wait for the out-in page transition to swap pages, so the anchor exists.
    return new Promise((resolve) =>
      nuxtApp.hooks.hookOnce("page:transition:finish", () => void requestAnimationFrame(() => resolve(target))),
    );
  },
} satisfies RouterConfig;
