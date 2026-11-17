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
    architecture: {
      nodes: [
        { id: "web", label: "Next.js 14" },
        { id: "api", label: "Express 5" },
        { id: "zod", label: "Zod" },
        { id: "db", label: "PostgreSQL" },
        { id: "stripe", label: "Stripe" },
        { id: "r2", label: "R2" },
      ],
      links: [["web", "api"], ["zod", "api"], ["api", "db"], ["api", "stripe"], ["api", "r2"]],
    },
    art: "night",
    theme: "noxtys",
    url: "https://noxtys.com/",
    urlLabel: "noxtys.com",
  },
  {
    slug: "athlon",
    stack: ["Node.js", "C# / .NET", "Vue.js", "Azure", "Azure DevOps", "CI/CD", "Winston"],
    architecture: {
      nodes: [
        { id: "devops", label: "Azure DevOps" },
        { id: "apps", label: "50+ apps" },
        { id: "batch", label: "Batchs" },
        { id: "mon", label: "Monitoring" },
        { id: "rgpd", label: "RGPD" },
      ],
      links: [["devops", "apps"], ["apps", "mon"], ["apps", "batch"], ["apps", "rgpd"]],
    },
    art: "office",
    theme: "azure",
  },
  {
    slug: "cobblemon-mods",
    stack: ["Java", "Fabric", "NeoForge", "Gradle", "JSON"],
    architecture: {
      nodes: [
        { id: "json", label: "JSON" },
        { id: "common", label: "common" },
        { id: "fabric", label: "Fabric" },
        { id: "neo", label: "NeoForge" },
        { id: "cf", label: "CurseForge" },
      ],
      links: [["json", "common"], ["common", "fabric"], ["common", "neo"], ["fabric", "cf"], ["neo", "cf"]],
    },
    art: "blocks",
    theme: "minecraft",
    url: "https://www.curseforge.com/members/darcosse/projects",
    urlLabel: "CurseForge",
  },
];

export const findProject = (slug: string) => projects.findIndex((p) => p.slug === slug);
