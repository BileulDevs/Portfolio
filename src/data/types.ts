/** Mastery scale used across the site: 3 = daily production use, 2 = solid, 1 = notions. */
export type Level = 1 | 2 | 3;

export interface Profile {
  firstName: string;
  lastName: string;
  title: string;
  specialty: string;
  location: string;
  email: string;
  status: string;
  languages: string[];
  links: { label: string; href: string; display: string }[];
}

export interface Tech {
  name: string;
  level: Level;
}

export interface StackCategory {
  id: string;
  label: string;
  items: Tech[];
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

/** Visual identity of a project's generated artwork (used until real screenshots exist). */
export type ArtStyle = "rings" | "grid" | "voxels" | "monitor";

export interface Project {
  slug: string;
  name: string;
  kind: string;
  period: string;
  status: string;
  tagline: string;
  role: string;
  stack: string[];
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
  art: ArtStyle;
  /** Optional real cover (path under /public). When absent, a generative artwork is painted. */
  cover?: string;
  /** Optional screenshots (paths under /public), shown on the project page. */
  gallery?: { src: string; alt: string }[];
  url?: string;
  urlLabel?: string;
}

export interface Experience {
  id: string;
  period: string;
  org: string;
  role: string;
  summary: string;
  highlights: string[];
  tags: string[];
}

export interface Education {
  period: string;
  school: string;
  degree: string;
}
