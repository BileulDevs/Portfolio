import { onBeforeUnmount, onMounted, ref, type Ref } from "vue";

/**
 * Progress (0 → 1) of an element through the viewport, updated at most once per frame.
 * `startAt` / `extra` are viewport fractions: progress starts when the top of the element
 * reaches `startAt * innerHeight`, and the travel distance is the element height plus `extra`.
 */
export function useScrollProgress(target: Ref<HTMLElement | null>, startAt = 0.8, extra = 0.2) {
  const progress = ref(0);
  let ticking = false;
  const update = () => {
    ticking = false;
    const el = target.value;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = (innerHeight * startAt - r.top) / (r.height + innerHeight * extra);
    progress.value = Math.min(1, Math.max(0, p));
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  onMounted(() => {
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    update();
  });
  onBeforeUnmount(() => {
    removeEventListener("scroll", onScroll);
    removeEventListener("resize", onScroll);
  });
  return progress;
}
