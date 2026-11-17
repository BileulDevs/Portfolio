import { useLangCookie } from "@/composables/useLanguage";

/**
 * Puts back the language the visitor chose last time (English otherwise). Done once the page is
 * hydrated: pages are prerendered in English, switching earlier would make the server HTML and the
 * first client render disagree. (A plugin is not a component: i18n is reached through nuxtApp.)
 */
export default defineNuxtPlugin((nuxtApp) => {
  const saved = useLangCookie();
  nuxtApp.hook("app:mounted", () => {
    const i18n = nuxtApp.$i18n;
    if (saved.value && saved.value !== i18n.locale.value) i18n.setLocale(saved.value);
  });
});
