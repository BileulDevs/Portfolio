import type { ExperienceData } from "./types";

/** Career, newest first. Texts (period, role, summary, highlights) live in i18n/i18n.config.ts under `experience.<id>`. */
export const experience: ExperienceData[] = [
  { id: "noxtys", org: "Noxtys", tags: ["TypeScript", "Next.js", "Express", "Prisma", "Stripe"] },
  { id: "athlon-dev", org: "Athlon Car Lease", tags: ["Node.js", "C# / .NET", "Vue.js", "Azure", "Azure DevOps"] },
  { id: "athlon-doc", org: "Athlon Car Lease", tags: ["Architecture", "Documentation", "Azure"] },
  { id: "mods", org: "Open source", tags: ["Java", "Fabric", "NeoForge"] },
];
