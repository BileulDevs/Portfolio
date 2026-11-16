import { onBeforeUnmount, onMounted, ref, type Ref } from "vue";

/** Whether an element intersects the viewport; used to pause render loops off-screen. */
export function useInView(target: Ref<HTMLElement | null>, rootMargin = "0px") {
  const inView = ref(false);
  let io: IntersectionObserver | undefined;
  onMounted(() => {
    if (!target.value) return;
    io = new IntersectionObserver(([entry]) => (inView.value = entry.isIntersecting), { rootMargin });
    io.observe(target.value);
  });
  onBeforeUnmount(() => io?.disconnect());
  return inView;
}
