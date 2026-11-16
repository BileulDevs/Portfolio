import { vReveal } from "~/directives/reveal";
import { vMagnetic } from "~/directives/magnetic";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("reveal", vReveal).directive("magnetic", vMagnetic);
});
