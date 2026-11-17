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
  },
];

export const findProject = (slug: string) => projects.findIndex((p) => p.slug === slug);
