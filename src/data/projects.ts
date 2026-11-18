import type { ProjectData } from "./types";

/**
 * Projects shown in the carousel and on the project pages, in display order.
 * Adding a project = one object here (structure) + its texts under `projects.<slug>` in both
 * languages of i18n/i18n.config.ts (+ optional images in /public/projects/<slug>/).
 */
export const projects: ProjectData[] = [
  {
    slug: "noxtys",
    stack: ["TypeScript", "Next.js 14", "Express 5", "PostgreSQL", "Prisma", "Zod", "Stripe", "Cloudflare R2", "Vitest", "Railway"],
    art: "night",
    theme: "noxtys",
    url: "https://noxtys.com/",
    urlLabel: "noxtys.com",
  },
  {
    slug: "observatory",
    stack: ["Nuxt 4", "Vue 3", "TypeScript", "Three.js", "GLSL", "@nuxtjs/i18n", "Netlify"],
    art: "space",
    url: "https://space-observatory.netlify.app/",
    urlLabel: "space-observatory.netlify.app",
    repo: "https://github.com/BileulDevs/observatory",
  },
  {
    slug: "athlon",
    stack: ["Node.js", "C# / .NET", "Vue.js", "Azure", "Azure DevOps", "CI/CD", "Winston"],
    art: "office",
    theme: "azure",
  },
  {
    slug: "cobblemon-mods",
    stack: ["Java", "Fabric", "NeoForge", "Gradle", "JSON"],
    art: "blocks",
    theme: "minecraft",
    url: "https://www.curseforge.com/members/darcosse/projects",
    urlLabel: "CurseForge",
    // One item per published mod, in the same order as the texts' `features`.
    featureItems: [
      { model: "poke_ball", companions: ["pikachu"], links: [{ name: "Just Enough Cobblemon", logo: "/projects/cobblemon-mods/logos/just-enough-cobblemon.png", url: "https://www.curseforge.com/minecraft/mc-mods/just-enough-cobblemon", repo: "https://github.com/BileulDevs/JustEnoughCobblemon" }] },
      { model: "safari_ball", companions: ["chansey", "tauros", "kangaskhan"], links: [{ name: "Cobblemon Safari", logo: "/projects/cobblemon-mods/logos/safari.png", url: "https://www.curseforge.com/minecraft/mc-mods/cobblemon-safari", repo: "https://github.com/BileulDevs/Cobblemon-Safari" }] },
      { model: "command", links: [{ name: "Cobblemon Scoremons", logo: "/projects/cobblemon-mods/logos/scoremons.png", url: "https://www.curseforge.com/minecraft/mc-mods/cobblemon-scoremons", repo: "https://github.com/BileulDevs/Cobblemon-Scoremons" }] },
      { model: "shiny_charm", links: [{ name: "Cobblemon ShinyDex", logo: "/projects/cobblemon-mods/logos/shiny-dex.png", url: "https://www.curseforge.com/minecraft/mc-mods/cobblemon-shiny-dex", repo: "https://github.com/BileulDevs/Cobblemon-ShinyDex" }] },
      { model: "marks_ribbon", links: [{ name: "Cobblemon Marks Quests", logo: "/projects/cobblemon-mods/logos/cobblemon-marks.png", url: "https://www.curseforge.com/minecraft/mc-mods/cobblemon-marks-quests", repo: "https://github.com/BileulDevs/Cobblemon-Marks" }] },
      { model: "spawner", links: [{ name: "Cobblemon Spawner", logo: "/projects/cobblemon-mods/logos/spawner.png", url: "https://www.curseforge.com/minecraft/mc-mods/cobblemon-spawner", repo: "https://github.com/BileulDevs/Cobblemon-Spawner" }] },
      { model: "beast_ball", companions: ["poipole"], links: [{ name: "Cobblemon Ultra-Beasts", logo: "/projects/cobblemon-mods/logos/ultra-beasts.png", url: "https://www.curseforge.com/minecraft/mc-mods/cobblemon-ultra-beasts", repo: "https://github.com/BileulDevs/Cobblemon-Ultra-Beasts" }] },
    ],
  },
];

export const findProject = (slug: string) => projects.findIndex((p) => p.slug === slug);
