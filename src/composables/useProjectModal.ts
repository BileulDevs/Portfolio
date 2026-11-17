import { ref, shallowRef } from "vue";

/**
 * Screen rectangle the project modal dives from (and shrinks back to).
 * Set by whoever opens it, right before the `?projet=` navigation; null = a centred box.
 * Only written in the browser (clicks, closing), so it never holds server-side state.
 */
const origin = ref<DOMRect | null>(null);
/**
 * Registered by the carousel: brings a project's panel to the centre at once and returns where it
 * is on screen, so the modal can close into the project it ends on (after prev / next inside it).
 */
const locate = shallowRef<((slug: string) => DOMRect | null) | null>(null);

export function useProjectModal() {
  const localePath = useLocalePath();
  const linkTo = (slug: string) => localePath({ path: "/", query: { projet: slug } });
  /** Opens a project in the home-page modal, diving from `rect` when given. */
  function open(slug: string, rect?: DOMRect) {
    origin.value = rect ?? null;
    return navigateTo(linkTo(slug));
  }
  return { origin, locate, linkTo, open };
}
