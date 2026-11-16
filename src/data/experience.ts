import type { Experience } from "./types";

export const experience: Experience[] = [
  {
    id: "noxtys",
    period: "Janv. 2026 — Oct. 2026",
    org: "Noxtys",
    role: "Fondateur · Développeur Full Stack",
    summary: "Conception et développement solo d'un SaaS TypeScript, de l'architecture à la mise en production, maintenu en continu.",
    highlights: [
      "Next.js 14 App Router, Express 5, PostgreSQL / Prisma, déployé sur Railway",
      "Paiement Stripe complet : webhooks, proration, Subscription Schedules, quotas par plan",
      "Pipeline de modération conforme DSA, stockage Cloudflare R2, tests Vitest",
    ],
    tags: ["TypeScript", "Next.js", "Express", "Prisma", "Stripe"],
  },
  {
    id: "athlon-dev",
    period: "Sept. 2022 — Oct. 2025",
    org: "Athlon Car Lease",
    role: "Développeur Full Stack",
    summary: "Co-conception, développement et maintenance de 10+ applications métier critiques utilisées chaque jour par plus de 1 500 collaborateurs.",
    highlights: [
      "Monitoring unifié sur 50+ applications cloud : temps de détection des incidents divisé par 2",
      "Application interne de conformité RGPD : chiffrement, déchiffrement et purge sur 4 To",
      "Batchs nocturnes planifiés : −80 % de charge serveur en journée, +30 % de réactivité",
      "Migration de 50+ applications vers Azure : −25 % de coûts, 99,9 % de disponibilité",
    ],
    tags: ["Node.js", "C# / .NET", "Vue.js", "Azure", "Azure DevOps"],
  },
  {
    id: "athlon-doc",
    period: "Juin 2022 — Sept. 2022",
    org: "Athlon Car Lease",
    role: "Rédacteur technique",
    summary: "Restructuration et rédaction de 200+ fiches de documentation et schémas d'architecture pour accompagner la bascule vers Azure.",
    highlights: ["Documentation d'architecture qui a fluidifié l'intégration des équipes d'ingénierie sur le cloud"],
    tags: ["Architecture", "Documentation", "Azure"],
  },
  {
    id: "mods",
    period: "En continu",
    org: "Open source",
    role: "Auteur de mods Minecraft (Java)",
    summary: "Conception, publication et maintenance de mods atteignant plus de 1,3 million de téléchargements sur CurseForge et Modrinth.",
    highlights: ["Addons client / serveur, compatibilité multijoueur, plusieurs versions majeures du jeu"],
    tags: ["Java", "Fabric", "NeoForge"],
  },
];
