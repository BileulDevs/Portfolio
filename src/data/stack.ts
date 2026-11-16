import type { Level, StackCategory } from "./types";

export const levels: Record<Level, { short: string; long: string }> = {
  3: { short: "Production", long: "Usage quotidien, en production" },
  2: { short: "Solide", long: "Maîtrise solide, projets livrés" },
  1: { short: "Notions", long: "Notions, projets ponctuels" },
};

export const stack: StackCategory[] = [
  {
    id: "front",
    label: "Frontend",
    items: [
      { name: "TypeScript", level: 3 },
      { name: "Vue.js / Nuxt", level: 3 },
      { name: "React / Next.js", level: 3 },
      { name: "HTML / CSS", level: 3 },
      { name: "Tailwind", level: 2 },
      { name: "Three.js", level: 2 },
      { name: "Angular", level: 1 },
      { name: "React Native", level: 1 },
    ],
  },
  {
    id: "back",
    label: "Backend & API",
    items: [
      { name: "Node.js / Express", level: 3 },
      { name: "C# / .NET", level: 3 },
      { name: "REST · OpenAPI", level: 3 },
      { name: "Prisma · Zod", level: 3 },
      { name: "Clean Architecture", level: 2 },
      { name: "Microservices", level: 2 },
      { name: "Java", level: 2 },
      { name: "Laravel / Symfony", level: 1 },
    ],
  },
  {
    id: "data",
    label: "Données",
    items: [
      { name: "PostgreSQL", level: 3 },
      { name: "MySQL", level: 2 },
      { name: "MongoDB", level: 2 },
      { name: "Supabase", level: 2 },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    items: [
      { name: "Azure", level: 3 },
      { name: "Azure DevOps", level: 3 },
      { name: "CI/CD", level: 3 },
      { name: "Stripe", level: 3 },
      { name: "Docker", level: 2 },
      { name: "Railway", level: 2 },
      { name: "Cloudflare R2", level: 2 },
    ],
  },
  {
    id: "quality",
    label: "Qualité & méthode",
    items: [
      { name: "Code review", level: 3 },
      { name: "Scrum", level: 3 },
      { name: "RGPD · DSA", level: 3 },
      { name: "Tests (Vitest)", level: 2 },
    ],
  },
];
