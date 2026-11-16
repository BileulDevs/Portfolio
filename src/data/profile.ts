import type { Education, Profile } from "./types";

export const profile: Profile = {
  firstName: "Bilel",
  lastName: "Sahraoui",
  title: "Développeur Full Stack",
  specialty: "Node.js • TypeScript",
  location: "Vaujours, Île-de-France",
  email: "bsahraoui.mail@gmail.com",
  status: "Ouvert à un CDI",
  languages: ["Français", "Anglais (C1)"],
  links: [
    { label: "GitHub", href: "https://github.com/BileulDevs", display: "github.com/BileulDevs" },
    { label: "CurseForge", href: "https://www.curseforge.com/members/darcosse/projects", display: "curseforge.com/members/darcosse" },
    { label: "Noxtys", href: "https://noxtys.com/", display: "noxtys.com" },
  ],
};

export const education: Education[] = [
  { period: "2022 — 2025", school: "Paris Ynov Campus", degree: "Master 2 · Expert en Développement Web (Bac+5)" },
  { period: "2020 — 2022", school: "Lycée Polyvalent de Cachan", degree: "BTS SIO · option SLAM" },
];

/** Headline numbers, all taken from the CV. */
export const keyFacts = [
  { value: "3 ans+", label: "en entreprise, de l'alternance à la prod" },
  { value: "1,3M+", label: "téléchargements de mods Java" },
  { value: "10+", label: "applications métier, 1 500 utilisateurs" },
  { value: "99,9 %", label: "de disponibilité après migration Azure" },
];
