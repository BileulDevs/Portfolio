import { projects } from "./src/data/projects";

export default defineNuxtConfig({
  compatibilityDate: "2026-11-01",
  srcDir: "src/",
  modules: ["@nuxtjs/i18n"],
  // English by default, French on demand. Every text (interface and content) is in i18n/i18n.config.ts.
  i18n: {
    locales: [
      { code: "en", language: "en-US", name: "English" },
      { code: "fr", language: "fr-FR", name: "Français" },
    ],
    defaultLocale: "en",
    // The language never shows in the URL: one URL per page. The visitor's choice (EN / FR button)
    // is kept in a cookie by src/composables/useLanguage.ts, not guessed from the browser.
    strategy: "no_prefix",
    detectBrowserLanguage: false,
  },
  // Components are auto-imported by file name, whatever their folder (layout/, home/, project/…).
  components: [{ path: "~/components", pathPrefix: false, extensions: [".vue"] }],
  css: [
    "@fontsource-variable/bricolage-grotesque",
    "@fontsource/dm-mono/400.css",
    "@fontsource/dm-mono/500.css",
    "~/styles/main.css",
    // Project themes: only fonts + selectors scoped to [data-theme], nothing loads until used.
    "~/styles/themes/minecraft.css",
    "@fontsource-variable/space-grotesk",
    "@fontsource-variable/instrument-sans",
    "@fontsource-variable/jetbrains-mono",
    "~/styles/themes/noxtys.css",
    "~/styles/themes/azure.css",
  ],
  app: {
    // Name and mode match the .page-* classes in main.css and PAGE_TRANSITION_MS in router.options.ts.
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      // lang, title, description and og:* depend on the language: set in app.vue.
      meta: [
        { name: "theme-color", content: "#475465" },
        { property: "og:type", content: "website" },
      ],
      link: [{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
    },
  },
  // Project links live in the client-only carousel, so the crawler cannot find them: list them here
  nitro: { prerender: { routes: projects.map((p) => `/projects/${p.slug}`) } },
  // Same strictness as the pre-Nuxt tsconfig (Nuxt adds noUncheckedIndexedAccess by default).
  typescript: { tsConfig: { compilerOptions: { noUncheckedIndexedAccess: false, noUnusedLocals: true, noUnusedParameters: true } } },
  // The lazy Three.js chunk (~128 kB gzip) is expected; it only loads with the projects carousel.
  vite: { build: { chunkSizeWarningLimit: 600 } },
});
