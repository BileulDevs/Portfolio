/**
 * Two kinds of types: `…Data` is what src/data/ holds (language-independent structure), and the
 * plain names are what components receive: the same object with its texts in the current language
 * (merged by src/composables/useContent.ts from i18n/i18n.config.ts).
 */

/** Mastery scale used across the site: 3 = daily production use, 2 = solid, 1 = basics. */
export type Level = 1 | 2 | 3;

export interface ProfileData {
  firstName: string;
  lastName: string;
  specialty: string;
  email: string;
  links: { label: string; href: string; display: string }[];
}
export interface Profile extends ProfileData {
  title: string;
  location: string;
  status: string;
  languages: string[];
}

export interface Tech {
  name: string;
  level: Level;
}

export interface StackCategoryData {
  id: "front" | "back" | "data" | "cloud" | "quality" | "notions";
  items: Tech[];
}
export interface StackCategory extends StackCategoryData {
  label: string;
}

/** A structuring technical choice and the reason behind it. */
export interface Decision {
  choice: string;
  why: string;
}

/** A published release a feature points to (e.g. a mod page), shown with its logo. */
export interface FeatureLink {
  name: string;
  /** Path under /public. */
  logo: string;
  url: string;
  /** The mod's source code on GitHub, shown as a second line under its CurseForge page. */
  repo?: string;
}

/** One feature shown as a 3D item (feature carousel): its texts, model and published pages. */
export interface FeatureItem {
  title: string;
  body: string;
  model: import("@/components/project/blockItems").ItemKind;
  /** Pokémon that come out of the item and roam beside the details. */
  companions?: import("@/components/project/pokemon").Companion[];
  links: FeatureLink[];
}

export interface Challenge {
  problem: string;
  solution: string;
}

export interface Metric {
  value: string;
  label: string;
}

/** Scene painted as a project's artwork (carousel panel, cover) until real screenshots exist. */
export type ArtStyle = "night" | "office" | "blocks" | "space";

/** Visual theme of a case study (styles in src/styles/themes/). Absent = the site's own look. */
export type ProjectTheme = "minecraft" | "noxtys" | "azure";

export interface ProjectData {
  slug: string;
  stack: string[];
  art: ArtStyle;
  theme?: ProjectTheme;
  /** Optional real cover (path under /public). When absent, a generative artwork is painted. */
  cover?: string;
  /** Optional screenshots (paths under /public), shown on the project page. */
  gallery?: { src: string; alt: string }[];
  url?: string;
  urlLabel?: string;
  /** Optional link to the source code, shown beside `url`. */
  repo?: string;
  /**
   * Optional 3D item and links per feature, in the same order as the texts' `features`. When present,
   * the features are shown as a carousel of items instead of a plain list.
   */
  featureItems?: Omit<FeatureItem, "title" | "body">[];
}
export interface Project extends ProjectData {
  name: string;
  kind: string;
  period: string;
  status: string;
  tagline: string;
  role: string;
  context: string;
  goals: string[];
  features: string[];
  /** Optional heading replacing "Features" (e.g. "Mods"). */
  featuresTitle?: string;
  /** How it is built: a one-paragraph summary, then the structuring choices and their reasons. */
  architecture: {
    summary: string;
    decisions: Decision[];
  };
  challenges: Challenge[];
  results: Metric[];
}

export interface ExperienceData {
  id: string;
  org: string;
  tags: string[];
}
export interface Experience extends ExperienceData {
  period: string;
  role: string;
  summary: string;
  highlights: string[];
}

export interface EducationData {
  period: string;
  school: string;
}
export interface Education extends EducationData {
  degree: string;
}
