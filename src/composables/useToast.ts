import { ref } from "vue";

/** Duration a toast stays visible; long enough to read an e-mail address. */
const TOAST_MS = 2400;

const message = ref("");
const visible = ref(false);
let timer: number | undefined;

/** App-wide singleton: any component can announce a short status message. */
export function useToast() {
  function show(text: string) {
    message.value = text;
    visible.value = true;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => (visible.value = false), TOAST_MS);
  }
  return { message, visible, show };
}
