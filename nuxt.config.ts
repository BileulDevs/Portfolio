import { defineNuxtConfig } from 'nuxt/config'

const SITE = {
  url: 'https://bilelsahraoui.netlify.app/',
  name: 'Bilel Sahraoui — Développeur Full Stack',
  description:
    "Portfolio immersif de Bilel Sahraoui, développeur Full Stack (Node.js, TypeScript, .NET). Un voyage spatial à travers compétences, projets et expériences.",
  image: '/og-image.jpg',
  lang: 'fr',
  locale: 'fr_FR',
}

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Le contenu (texte du CV) est rendu côté serveur dans les overlays HTML :
  // le 3D est une amélioration progressive, ce qui préserve un SEO solide.
  css: ['~/assets/css/main.css'],

  // Noms de composants sans préfixe de dossier (<MissionHud/> et non <HudMissionHud/>).
  // Le suffixe .client (SpaceExperience.client.vue) reste géré par Nuxt → rendu client only.
  components: [{ path: '~/components', pathPrefix: false }],

  app: {
    head: {
      htmlAttrs: { lang: SITE.lang },
      title: SITE.name,
      titleTemplate: '%s',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: SITE.description },
        { name: 'theme-color', content: '#05070d' },
        { name: 'author', content: 'Bilel Sahraoui' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: SITE.name },
        { property: 'og:title', content: SITE.name },
        { property: 'og:description', content: SITE.description },
        { property: 'og:image', content: SITE.url + SITE.image },
        { property: 'og:url', content: SITE.url },
        { property: 'og:locale', content: SITE.locale },
        // Twitter / X
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: SITE.name },
        { name: 'twitter:description', content: SITE.description },
        { name: 'twitter:image', content: SITE.url + SITE.image },
      ],
      link: [
        { rel: 'canonical', href: SITE.url },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        // Polices : couche display (Space Grotesk), télémétrie (Space Mono), corps (Inter)
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href:
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap',
        },
      ],
    },
  },

  // Tolérance de build : on ne bloque pas le dev sur des types d'addons Three.
  typescript: {
    typeCheck: false,
    tsConfig: { compilerOptions: { skipLibCheck: true } },
  },

  // Expose l'URL du site aux server routes (sitemap) et au client si besoin.
  runtimeConfig: {
    public: { siteUrl: SITE.url },
  },

  vite: {
    // Three (et surtout ses addons) doivent passer par le même pré-bundle :
    // sinon, en dev, les addons peuvent charger une 2e instance de Three et
    // le rendu casse silencieusement (canvas vide).
    optimizeDeps: {
      include: [
        'three',
        'gsap',
        'lenis',
        'three/addons/postprocessing/EffectComposer.js',
        'three/addons/postprocessing/RenderPass.js',
        'three/addons/postprocessing/UnrealBloomPass.js',
        'three/addons/postprocessing/OutputPass.js',
        'three/addons/postprocessing/ShaderPass.js',
        'three/addons/shaders/FXAAShader.js',
      ],
    },
    build: {
      // Découpage : le moteur 3D dans son propre chunk.
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three'],
            gsap: ['gsap'],
          },
        },
      },
    },
  },

  nitro: {
    // Compression des réponses HTML/JS.
    compressPublicAssets: true,
  },
})
