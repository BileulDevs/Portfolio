import { computed } from "vue";
import { messages, type Locale } from "~~/i18n/i18n.config";
import { projects as projectData } from "@/data/projects";
import { experience as experienceData } from "@/data/experience";
import { education as educationData, profile as profileData } from "@/data/profile";
import { stack as stackData } from "@/data/stack";
import type { Education, Experience, Profile, Project, StackCategory } from "@/data/types";

/**
 * The site's content in the current language: each structure from src/data/ merged with its texts
 * from i18n/i18n.config.ts. Components receive the same shapes as before (Project, Experience…),
 * so they never deal with translation keys for content.
 */
export function useContent() {
  const { locale } = useI18n();
  const copy = computed(() => messages[locale.value as Locale] ?? messages.en);

  const projects = computed<Project[]>(() =>
    projectData.map((p) => ({ ...p, ...copy.value.projects[p.slug as keyof typeof copy.value.projects] })),
  );

  const experience = computed<Experience[]>(() =>
    experienceData.map((e) => ({ ...e, ...copy.value.experience[e.id as keyof typeof copy.value.experience] })),
  );

  const profile = computed<Profile>(() => {
    const { title, location, status, languages } = copy.value.profile;
    return { ...profileData, title, location, status, languages };
  });
  const education = computed<Education[]>(() => educationData.map((e, i) => ({ ...e, degree: copy.value.profile.degrees[i] ?? "" })));
  const keyFacts = computed(() => copy.value.profile.facts);

  const stack = computed<StackCategory[]>(() => stackData.map((c) => ({ ...c, label: copy.value.stack.categories[c.id] })));
  const levels = computed(() => copy.value.stack.levels);

  /** Raw messages of the current language, for content read as data (e.g. the manifesto's words). */
  return { copy, projects, experience, profile, education, keyFacts, stack, levels };
}
