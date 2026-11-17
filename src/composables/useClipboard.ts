import { useToast } from "./useToast";

/** Copies text and confirms with a toast; falls back to displaying the text (file:// or old browsers). */
export function useClipboard() {
  const { show } = useToast();
  async function copy(text: string, confirmation: string) {
    try {
      await navigator.clipboard.writeText(text);
      show(confirmation);
    } catch {
      show(text);
    }
  }
  return { copy };
}
