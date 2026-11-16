import { onScopeDispose, ref, type Ref } from "vue";

/** Reactive matchMedia; listeners are removed with the calling scope. */
export function useMedia(query: string): Ref<boolean> {
  const matches = ref(false);
  if (import.meta.server) return matches;
  const mql = window.matchMedia(query);
  matches.value = mql.matches;
  const onChange = (e: MediaQueryListEvent) => (matches.value = e.matches);
  mql.addEventListener("change", onChange);
  onScopeDispose(() => mql.removeEventListener("change", onChange));
  return matches;
}

/** Users who asked the OS for less motion: every animation in the site checks this. */
export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");

/** Mouse-like pointers: custom cursor, magnetic buttons and hover previews only exist there. */
export const useFinePointer = () => useMedia("(hover: hover) and (pointer: fine)");

/** Non-reactive snapshot, for code that runs once (directives, render loops). */
export const prefersReducedMotion = () => import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
