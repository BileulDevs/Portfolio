import { computed } from "vue";

export type Lang = "en" | "fr";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Cookie keeping the visitor's language: the URL never carries it (i18n strategy "no_prefix"). */
export const useLangCookie = () => useCookie<Lang | null>("lang", { maxAge: ONE_YEAR, sameSite: "lax" });

/** Current language, the other one, and a switch that remembers the choice. Component setup only. */
export function useLanguage() {
  const { locale, setLocale } = useI18n();
  const saved = useLangCookie();
  const other = computed<Lang>(() => (locale.value === "en" ? "fr" : "en"));

  async function switchTo(lang: Lang) {
    saved.value = lang;
    await setLocale(lang);
  }

  return { locale, other, switchTo };
}
