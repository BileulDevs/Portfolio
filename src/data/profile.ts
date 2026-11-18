import type { EducationData, ProfileData } from "./types";

/** Texts (title, location, status, languages, degrees, key facts) live in i18n/i18n.config.ts. */
export const profile: ProfileData = {
  firstName: "Bilel",
  lastName: "Sahraoui",
  specialty: "Node.js • TypeScript",
  email: "bsahraoui.mail@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/BileulDevs", display: "github.com/BileulDevs" },
    { label: "CurseForge", href: "https://www.curseforge.com/members/darcosse/projects", display: "curseforge.com/members/darcosse" },
  ],
};

/** Same order as `profile.degrees` in the i18n messages. */
export const education: EducationData[] = [
  { period: "2022 — 2025", school: "Paris Ynov Campus" },
  { period: "2020 — 2022", school: "Lycée Polyvalent de Cachan" },
];
