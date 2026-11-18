/**
 * Small line icons (24×24 grid, drawn with `currentColor` strokes) used to dress up the case studies.
 * Each entry is the SVG's inner markup: static, written here, never user content.
 */
export const ICONS = {
  context: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  goals: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  features: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 16v4M17 18h4"/>',
  architecture: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  challenges: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  results: '<path d="M3 20h18M6 16v-4M11 16V7M16 16v-6M20 16V4"/>',
  gallery: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
  role: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  period: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  status: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  stack: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>',
  link: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  repo: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="7" r="2"/><path d="M6 7v10M18 9a6 6 0 0 1-6 6H6"/>',
  check: '<path d="M5 12l4 4 10-10"/>',
  problem: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/>',
  solution: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
} as const;

export type IconName = keyof typeof ICONS;
