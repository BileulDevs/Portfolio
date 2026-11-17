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

export interface ArchitectureNode {
  id: string;
  label: string;
  sub: string;
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
  /** Diagram structure; each node's caption (`sub`) is translated. */
  architecture: {
    nodes: Omit<ArchitectureNode, "sub">[];
    links: [string, string][];
  };
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
}
export interface Project extends Omit<ProjectData, "architecture"> {
  name: string;
  kind: string;
  period: string;
  status: string;
  tagline: string;
  role: string;
  context: string;
  goals: string[];
  features: string[];
  architecture: {
    summary: string;
    nodes: ArchitectureNode[];
    links: [string, string][];
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
