import { projects } from "./src/data/projects";

export default defineNuxtConfig({
  compatibilityDate: "2026-11-01",
  srcDir: "src/",
  // Components are auto-imported by file name, whatever their folder (layout/, home/, project/…).
  components: [{ path: "~/components", pathPrefix: false, extensions: [".vue"] }],
  css: [
    "@fontsource-variable/bricolage-grotesque",
    "@fontsource/dm-mono/400.css",
    "@fontsource/dm-mono/500.css",
    "~/styles/main.css",
  ],
  app: {
    // Name and mode match the .page-* classes in main.css and PAGE_TRANSITION_MS in router.options.ts.
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      htmlAttrs: { lang: "fr" },
      title: "Bilel Sahraoui — Développeur Full Stack",
      meta: [
        { name: "description", content: "Bilel Sahraoui, développeur Full Stack Node.js / TypeScript. Applications métier, SaaS en production, mods à 1,3 million de téléchargements." },
        { name: "theme-color", content: "#475465" },
        { property: "og:title", content: "Bilel Sahraoui — Développeur Full Stack" },
        { property: "og:description", content: "Node.js, TypeScript, Vue, Next.js, C# / .NET, Azure. Ouvert à un CDI." },
        { property: "og:type", content: "website" },
      ],
      link: [{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
    },
  },
  // Project links live in the client-only carousel, so the crawler cannot find them: list them here.
  nitro: { prerender: { routes: projects.map((p) => `/projets/${p.slug}`) } },
  // Same strictness as the pre-Nuxt tsconfig (Nuxt adds noUncheckedIndexedAccess by default).
  typescript: { tsConfig: { compilerOptions: { noUncheckedIndexedAccess: false, noUnusedLocals: true, noUnusedParameters: true } } },
  // The lazy Three.js chunk (~128 kB gzip) is expected; it only loads with the projects carousel.
  vite: { build: { chunkSizeWarningLimit: 600 } },
});
