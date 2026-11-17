/**
 * Every text of the site, in English (default) and French: interface and content alike.
 * src/data/ only keeps what does not change with the language (slugs, stacks, links, themes).
 *
 * `fr` is typed as `typeof en`: a key missing in one language is a type error.
 * vue-i18n reserves { } @ $ | in messages: write {'@'} for a literal @.
 */

const en = {
  meta: {
    title: "Bilel Sahraoui — Full Stack Developer",
    description: "Bilel Sahraoui, Full Stack Node.js / TypeScript developer. Business applications, SaaS in production, mods with 1.3 million downloads.",
    ogDescription: "Node.js, TypeScript, Vue, Next.js, C# / .NET, Azure. Open to a permanent position.",
    projectTitle: "{name} — Bilel Sahraoui",
    notFoundTitle: "Page not found — Bilel Sahraoui",
  },
  a11y: {
    skip: "Skip to content",
    home: "Bilel Sahraoui, home",
    mainNav: "Main navigation",
    language: "Lire en français",
    carouselRole: "carousel",
    carousel: "Projects. Left and right arrows to navigate, Enter to open.",
    carouselLive: "Project {n} of {count}: {name}, {tagline}",
    prevProject: "Previous project",
    nextProject: "Next project",
    prevNamed: "Previous project: {name}",
    nextNamed: "Next project: {name}",
    projectsNav: "Navigation between projects",
    backToProjects: "Back to projects",
    closeProject: "Close the project",
    quickMessage: "Quick message",
    architecture: "{name} architecture: {nodes}",
    preview: "Preview of {name}",
  },
  cursor: { go: "Go", write: "Write", view: "View", drag: "Drag" },
  nav: {
    menu: "Menu",
    close: "Close",
    manifesto: "Manifesto",
    stack: "Stack",
    work: "Work",
    career: "Career",
    passions: "Passions",
    contact: "Contact",
  },
  hero: {
    lede: "Substance on the surface, solid underneath.",
    approach:
      "Full Stack developer for over 3 years. Reliable APIs, well-modelled data and screens that respond to the touch, from architecture all the way to production.",
    ctaLine1: "See the",
    ctaLine2: "work ↓",
  },
  manifesto: {
    title: "Manifesto",
    text: "I build the full height of a product, from the data schema to a button's animation. Because an interface is never more reliable than what lies beneath it, and a good backend deserves to be felt on screen.",
    /** Words underlined once lit (matched by their start, lowercase). */
    hot: ["height", "reliable", "felt"],
  },
  stack: {
    title: "Raw",
    titleEm: "material.",
    categories: { front: "Frontend", back: "Backend & API", data: "Data", cloud: "Cloud & DevOps", quality: "Quality & method", notions: "Familiar with" },
    levels: {
      3: { short: "Production", long: "Daily use, in production" },
      2: { short: "Solid", long: "Solid command, shipped projects" },
      1: { short: "Basics", long: "Basics, occasional projects" },
    },
  },
  work: { title: "The", titleEm: "workshop.", hint: "Drag · arrows · click to open" },
  career: { title: "Groundwork.", education: "Education" },
  passions: {
    title: "Beyond the",
    titleEm: "code.",
    intro: "What drives me, on screen and off it.",
    items: [
      { id: "dev", name: "Development", tag: "Also a hobby", text: "Side projects, Minecraft mods, trying out the latest tools: I keep building for the pleasure of it." },
      { id: "onepiece", name: "One Piece", tag: "Manga · TCG", text: "A long-time reader of the saga, and a regular at the One Piece Card Game table." },
      { id: "cars", name: "Cars", tag: "Engineering · Design", text: "Machines where every detail is tuned, from the engine to the bodywork: the same care I put into a product." },
      { id: "space", name: "Space", tag: "Exploration", text: "Launches, missions, astrophysics: engineering at its most ambitious, where nothing is allowed to fail." },
    ],
  },
  contact: {
    titleBefore: "What are we",
    titleEm: "building",
    titleAfter: "?",
    ctaLine1: "Write",
    ctaLine2: "an e-mail",
    copy: "copy",
    copied: "Address copied",
    form: {
      name: "Name",
      namePlaceholder: "Your name",
      email: "E-mail",
      emailPlaceholder: "you{'@'}example.com",
      message: "Message",
      messagePlaceholder: "The role, the assignment, the project…",
      send: "Send",
      idle: "Opens your mail app with the message pre-filled.",
      invalid: "A field is missing, or the e-mail address is not valid.",
      opening: "Opening your mail app…",
      subject: "Portfolio contact — {name}",
    },
  },
  footer: { made: "Vue 3 · Three.js · hand-made WebGL shader" },
  case: {
    role: "Role",
    period: "Period",
    status: "Status",
    stack: "Stack",
    link: "Link",
    repo: "Source code",
    context: "Context",
    goals: "Goals",
    features: "Features",
    architecture: "Architecture",
    challenges: "Challenges → solutions",
    problem: "Problem",
    solution: "Solution",
    results: "Results",
    gallery: "Screenshots",
    next: "Next project",
    /** Breadcrumb shown by the "azure" theme. */
    crumb: "Home  ›  Projects  ›  ",
  },
  notFound: { label: "Error 404", title: "Nothing", titleEm: "here.", back: "← Back to home" },

  // ---- Content -------------------------------------------------------------------------------
  profile: {
    title: "Full Stack Developer",
    location: "Vaujours, Île-de-France",
    status: "Open to a permanent role",
    languages: ["French", "English (C1)"],
    /** Same order as `education` in src/data/profile.ts. */
    degrees: ["Master's degree · Web Development Expert (5-year degree)", "BTS SIO · SLAM option (2-year degree)"],
    facts: [
      { value: "3 yrs+", label: "in the industry, from work-study to production" },
      { value: "1.3M+", label: "downloads of Java mods" },
      { value: "10+", label: "business applications, 1,500 users" },
      { value: "99.9%", label: "availability after the Azure migration" },
    ],
  },
  experience: {
    noxtys: {
      period: "Jan. 2026 — Oct. 2026",
      role: "Founder · Full Stack Developer",
      summary: "Designed and built a TypeScript SaaS on my own, from architecture to production, and kept maintaining it.",
      highlights: [
        "Next.js 14 App Router, Express 5, PostgreSQL / Prisma, deployed on Railway",
        "Complete Stripe billing: webhooks, proration, Subscription Schedules, per-plan quotas",
        "DSA-compliant moderation pipeline, Cloudflare R2 storage, Vitest tests",
      ],
    },
    "athlon-dev": {
      period: "Sept. 2022 — Oct. 2025",
      role: "Full Stack Developer",
      summary: "Co-designed, built and maintained 10+ critical business applications used every day by more than 1,500 employees.",
      highlights: [
        "Unified monitoring across 50+ cloud applications: incident detection time cut in half",
        "Internal GDPR compliance application: encryption, decryption and purging across 4 TB",
        "Scheduled night-time batches: −80% daytime server load, +30% responsiveness",
        "Migration of 50+ applications to Azure: −25% costs, 99.9% availability",
      ],
    },
    "athlon-doc": {
      period: "June 2022 — Sept. 2022",
      role: "Technical Writer",
      summary: "Restructured and wrote 200+ documentation pages and architecture diagrams to support the move to Azure.",
      highlights: ["Architecture documentation that smoothed the engineering teams' onboarding onto the cloud"],
    },
    mods: {
      period: "Ongoing",
      role: "Minecraft mod author (Java)",
      summary: "Designing, publishing and maintaining mods that have passed 1.3 million downloads on CurseForge and Modrinth.",
      highlights: ["Client / server add-ons, multiplayer compatibility, several major game versions"],
    },
  },
  projects: {
    noxtys: {
      name: "Noxtys",
      kind: "SaaS · founder",
      period: "2026",
      status: "In production · continuously maintained",
      tagline: "A SaaS designed, coded, deployed and run single-handedly — from the database to the payments.",
      role: "Founder, Full Stack developer: architecture, development, deployment, operations",
      context:
        "Building a product of my own, in production, with real constraints: recurring payments, quotas, security, regulatory moderation. Not a side project running on localhost.",
      goals: [
        "A strictly modular API, typed end to end",
        "Reliable Stripe subscriptions, plan changes included",
        "DSA compliance designed in from the start, not bolted on afterwards",
      ],
      features: [
        "Stripe subscriptions: webhooks, proration, Subscription Schedules",
        "Per-plan quotas and access control (IDOR protection)",
        "Moderation pipeline: reporting, review, decisions",
        "Cloudflare R2 object storage, authentication, generated OpenAPI documentation",
      ],
      architecture: {
        summary:
          "Every module follows the same chain: schema → service → controller → routes → openapi. Zod is the single source of validation and typing; the documentation derives from it.",
        nodes: { web: "App Router", api: "modules", zod: "schema · types", db: "Prisma", stripe: "webhooks", r2: "storage" },
      },
      challenges: [
        {
          problem: "Mid-period plan changes: inconsistent amounts and quotas out of sync.",
          solution: "Stripe proration and Subscription Schedules, with webhooks as the single source of truth for entitlements.",
        },
        {
          problem: "Another user's resources could be reached by guessing an identifier (IDOR).",
          solution: "Systematic ownership checks at the service layer, covered by Vitest tests.",
        },
        {
          problem: "DSA obligations on user-published content.",
          solution: "A dedicated pipeline: reporting, review queue, traced and justified decisions.",
        },
      ],
      results: [
        { value: "Solo", label: "from architecture to production" },
        { value: "5", label: "layers per module, always the same" },
        { value: "1", label: "source of truth: the Zod schemas" },
      ],
    },
    observatory: {
      name: "Observatory",
      kind: "Interactive 3D · WebGL",
      period: "Nov. 2026",
      status: "Personal project, live",
      tagline: "Real planetary systems and procedural planets, rendered live in the browser.",
      role: "Solo: design, 3D engine, shaders and content",
      context:
        "A showcase site about space: a procedural planet you can art-direct, real planetary systems (the Solar System, TRAPPIST-1, Kepler-90, Proxima Centauri, HR 8799) and generated ones, a catalogue of objects, constellations and famous missions.",
      goals: [
        "Render planets and deep-sky objects in real time, on desktop and on phones",
        "Stay true to the data: real orbits and facts, each with its source",
        "Keep the 3D engine independent from the UI framework",
      ],
      features: [
        "Planet creator: classes, palettes and art styles to blend",
        "5 real planetary systems, plus reproducible generated ones",
        "Object catalogue: a black hole with gravitational lensing, nebulae, galaxies, comets, NASA spacecraft models",
        "Constellations and space missions (Apollo 11, Rosetta), in French and English",
      ],
      architecture: {
        summary: "Nuxt pages drive a framework-agnostic WebGL engine through composables. The engine stages one scene at a time with dedicated GLSL materials, fed by sourced data and baked cubemaps.",
        nodes: { pages: "pages · i18n", bridge: "composables", data: "sourced facts", engine: "render on demand", bake: "baked surfaces", shaders: "19 modules" },
      },
      challenges: [
        {
          problem: "Procedural planet surfaces are too expensive to compute every frame, especially on phones.",
          solution: "Fields baked once into cubemaps, strip by strip, at a resolution chosen for the device.",
        },
        {
          problem: "One site for high-end desktops and modest phones.",
          solution: "Three GPU quality tiers (bake size, pixel ratio, MSAA, ray-march steps) decided in one place, and a render loop that only draws when something moves.",
        },
        {
          problem: "Real sizes and distances cannot fit on one screen.",
          solution: "A real-to-display scale that compresses sizes, orbits and periods while keeping their order.",
        },
      ],
      results: [
        { value: "5", label: "real planetary systems" },
        { value: "19", label: "GLSL shader modules" },
        { value: "3", label: "GPU quality tiers" },
      ],
    },
    athlon: {
      name: "Athlon Car Lease",
      kind: "Business apps · Cloud",
      period: "2022 — 2025",
      status: "3 years in the company",
      tagline: "Critical applications for 1,500 employees, and their move to Azure.",
      role: "Full Stack developer (work-study), co-design and maintenance",
      context:
        "A long-term car leasing company whose teams rely on in-house tools every day. Those tools have to be available, fast and GDPR-compliant.",
      goals: [
        "Make 10+ critical business applications reliable",
        "Detect incidents before the users do",
        "Move the application estate to Azure without degrading the service",
      ],
      features: [
        "Unified monitoring: availability and HTTP error tracing across 50+ applications",
        "GDPR compliance application: encryption, decryption, automated purging",
        "Scheduled night-time jobs for batch processing",
        "Migration of 50+ business applications to Azure",
      ],
      architecture: {
        summary: "Node.js, .NET and Vue.js applications deployed to Azure through Azure DevOps, all wired to a shared monitoring layer.",
        nodes: { devops: "CI/CD", apps: "Node · .NET · Vue", batch: "scheduled at night", mon: "uptime · errors", rgpd: "4 TB encrypted" },
        /** Node names that differ by language (others come from src/data/projects.ts). */
        labels: { batch: "Batch jobs", rgpd: "GDPR" },
      },
      challenges: [
        {
          problem: "Production incidents discovered too late, one application at a time.",
          solution: "Unified monitoring across the whole estate: mean detection time cut in half.",
        },
        {
          problem: "Heavy processing slowing the applications down during office hours.",
          solution: "Moved to scheduled night-time jobs: −80% daytime load, +30% responsiveness.",
        },
        {
          problem: "Purging and protecting personal data in a 4 TB database.",
          solution: "A dedicated application for encryption, decryption and automated purging.",
        },
      ],
      results: [
        { value: "÷2", label: "incident detection time" },
        { value: "−25%", label: "infrastructure costs" },
        { value: "99.9%", label: "availability" },
      ],
    },
    "cobblemon-mods": {
      name: "Minecraft Mods",
      kind: "Open source · Java",
      period: "Ongoing",
      status: "Published · CurseForge & Modrinth",
      tagline: "Over 1.3 million downloads across Java mods maintained for Fabric and NeoForge.",
      role: "Author and maintainer",
      context:
        "Modding is development without a safety net: a sparsely documented game API, thousands of players in multiplayer, and instant feedback the moment something breaks.",
      goals: [
        "Extend Cobblemon with features the community asks for",
        "Support Fabric and NeoForge from a single codebase",
        "Stay fast on the server side in multiplayer",
      ],
      features: [
        "Ultra Beasts: a new dimension, Ultra Space, and its portals",
        "Just Enough Cobblemon: spawn locations in the Pokédex, JEI / EMI integration",
        "Cobblemon Marks: goals configurable in JSON",
        "Shiny Charm and Scoremons: items and statistics for scoreboards",
      ],
      architecture: {
        summary: "Multiloader projects: a common module holds the logic, two thin modules plug in Fabric and NeoForge.",
        nodes: { json: "config · datapacks", common: "shared logic", fabric: "entrypoints", neo: "entrypoints", cf: "Modrinth" },
      },
      challenges: [
        {
          problem: "A portal effect that has to pass a destination to client-side particles.",
          solution: "A dedicated invisible entity and zero-count particles whose velocity carries the coordinates.",
        },
        {
          problem: "Maintaining two loaders and several game versions without duplicating code.",
          solution: "Multiloader architecture with a common module and thin entry points.",
        },
      ],
      results: [
        { value: "1.3M+", label: "total downloads" },
        { value: "5", label: "Cobblemon mods maintained" },
        { value: "2", label: "loaders: Fabric + NeoForge" },
      ],
    },
  },
};

const fr: typeof en = {
  meta: {
    title: "Bilel Sahraoui — Développeur Full Stack",
    description: "Bilel Sahraoui, développeur Full Stack Node.js / TypeScript. Applications métier, SaaS en production, mods à 1,3 million de téléchargements.",
    ogDescription: "Node.js, TypeScript, Vue, Next.js, C# / .NET, Azure. Ouvert à un CDI.",
    projectTitle: "{name} — Bilel Sahraoui",
    notFoundTitle: "Page introuvable — Bilel Sahraoui",
  },
  a11y: {
    skip: "Aller au contenu",
    home: "Bilel Sahraoui, accueil",
    mainNav: "Navigation principale",
    language: "Read in English",
    carouselRole: "carrousel",
    carousel: "Projets. Flèches gauche et droite pour naviguer, Entrée pour ouvrir.",
    carouselLive: "Projet {n} sur {count} : {name}, {tagline}",
    prevProject: "Projet précédent",
    nextProject: "Projet suivant",
    prevNamed: "Projet précédent : {name}",
    nextNamed: "Projet suivant : {name}",
    projectsNav: "Navigation entre projets",
    backToProjects: "Retour aux projets",
    closeProject: "Fermer le projet",
    quickMessage: "Message rapide",
    architecture: "Architecture de {name} : {nodes}",
    preview: "Aperçu de {name}",
  },
  cursor: { go: "Go", write: "Écrire", view: "Voir", drag: "Glisser" },
  nav: {
    menu: "Menu",
    close: "Fermer",
    manifesto: "Manifeste",
    stack: "Stack",
    work: "Travaux",
    career: "Parcours",
    passions: "Passions",
    contact: "Contact",
  },
  hero: {
    lede: "De la matière en surface, du solide en dessous.",
    approach:
      "Développeur Full Stack depuis plus de 3 ans. Des API fiables, des données bien modélisées et des écrans qui réagissent sous la main, de l'architecture jusqu'à la mise en production.",
    ctaLine1: "Voir les",
    ctaLine2: "travaux ↓",
  },
  manifesto: {
    title: "Manifeste",
    text: "Je code toute la hauteur d'un produit, du schéma de données jusqu'à l'animation d'un bouton. Parce qu'une interface n'est jamais plus fiable que ce qu'il y a dessous, et qu'un bon backend mérite qu'on le sente à l'écran.",
    hot: ["hauteur", "fiable", "sente"],
  },
  stack: {
    title: "Matière",
    titleEm: "première.",
    categories: { front: "Frontend", back: "Backend & API", data: "Données", cloud: "Cloud & DevOps", quality: "Qualité & méthode", notions: "Notions" },
    levels: {
      3: { short: "Production", long: "Usage quotidien, en production" },
      2: { short: "Solide", long: "Maîtrise solide, projets livrés" },
      1: { short: "Notions", long: "Notions, projets ponctuels" },
    },
  },
  work: { title: "Les", titleEm: "chantiers.", hint: "Glisser · flèches · cliquer pour ouvrir" },
  career: { title: "Fondations.", education: "Formation" },
  passions: {
    title: "Au-delà du",
    titleEm: "code.",
    intro: "Ce qui m'anime, devant l'écran comme en dehors.",
    items: [
      { id: "dev", name: "Développement", tag: "Aussi une passion", text: "Projets perso, mods Minecraft, nouveaux outils à tester : je continue de construire pour le plaisir." },
      { id: "onepiece", name: "One Piece", tag: "Manga · TCG", text: "Lecteur de longue date de la saga, et joueur régulier du One Piece Card Game." },
      { id: "cars", name: "Automobile", tag: "Mécanique · Design", text: "Des machines où chaque détail est réglé, du moteur à la carrosserie : le même soin que je mets dans un produit." },
      { id: "space", name: "Espace", tag: "Exploration", text: "Lancements, missions, astrophysique : l'ingénierie à son niveau le plus ambitieux, là où rien n'a le droit d'échouer." },
    ],
  },
  contact: {
    titleBefore: "On construit",
    titleEm: "quoi",
    titleAfter: " ?",
    ctaLine1: "Écrire",
    ctaLine2: "un e-mail",
    copy: "copier",
    copied: "Adresse copiée",
    form: {
      name: "Nom",
      namePlaceholder: "Votre nom",
      email: "E-mail",
      emailPlaceholder: "vous{'@'}exemple.fr",
      message: "Message",
      messagePlaceholder: "Le poste, la mission, le projet…",
      send: "Envoyer",
      idle: "Ouvre votre messagerie avec le message prérempli.",
      invalid: "Il manque un champ, ou l'e-mail n'est pas valide.",
      opening: "Ouverture de votre messagerie…",
      subject: "Contact portfolio — {name}",
    },
  },
  footer: { made: "Vue 3 · Three.js · shader WebGL fait main" },
  case: {
    role: "Rôle",
    period: "Période",
    status: "Statut",
    stack: "Stack",
    link: "Lien",
    repo: "Code source",
    context: "Contexte",
    goals: "Objectifs",
    features: "Fonctionnalités",
    architecture: "Architecture",
    challenges: "Difficultés → solutions",
    problem: "Problème",
    solution: "Solution",
    results: "Résultats",
    gallery: "Captures",
    next: "Projet suivant",
    crumb: "Accueil  ›  Projets  ›  ",
  },
  notFound: { label: "Erreur 404", title: "Rien", titleEm: "ici.", back: "← Retour à l'accueil" },

  // ---- Contenu -------------------------------------------------------------------------------
  profile: {
    title: "Développeur Full Stack",
    location: "Vaujours, Île-de-France",
    status: "Ouvert à un CDI",
    languages: ["Français", "Anglais (C1)"],
    degrees: ["Master 2 · Expert en Développement Web (Bac+5)", "BTS SIO · option SLAM"],
    facts: [
      { value: "3 ans+", label: "en entreprise, de l'alternance à la prod" },
      { value: "1,3M+", label: "téléchargements de mods Java" },
      { value: "10+", label: "applications métier, 1 500 utilisateurs" },
      { value: "99,9 %", label: "de disponibilité après migration Azure" },
    ],
  },
  experience: {
    noxtys: {
      period: "Janv. 2026 — Oct. 2026",
      role: "Fondateur · Développeur Full Stack",
      summary: "Conception et développement solo d'un SaaS TypeScript, de l'architecture à la mise en production, maintenu en continu.",
      highlights: [
        "Next.js 14 App Router, Express 5, PostgreSQL / Prisma, déployé sur Railway",
        "Paiement Stripe complet : webhooks, proration, Subscription Schedules, quotas par plan",
        "Pipeline de modération conforme DSA, stockage Cloudflare R2, tests Vitest",
      ],
    },
    "athlon-dev": {
      period: "Sept. 2022 — Oct. 2025",
      role: "Développeur Full Stack",
      summary: "Co-conception, développement et maintenance de 10+ applications métier critiques utilisées chaque jour par plus de 1 500 collaborateurs.",
      highlights: [
        "Monitoring unifié sur 50+ applications cloud : temps de détection des incidents divisé par 2",
        "Application interne de conformité RGPD : chiffrement, déchiffrement et purge sur 4 To",
        "Batchs nocturnes planifiés : −80 % de charge serveur en journée, +30 % de réactivité",
        "Migration de 50+ applications vers Azure : −25 % de coûts, 99,9 % de disponibilité",
      ],
    },
    "athlon-doc": {
      period: "Juin 2022 — Sept. 2022",
      role: "Rédacteur technique",
      summary: "Restructuration et rédaction de 200+ fiches de documentation et schémas d'architecture pour accompagner la bascule vers Azure.",
      highlights: ["Documentation d'architecture qui a fluidifié l'intégration des équipes d'ingénierie sur le cloud"],
    },
    mods: {
      period: "En continu",
      role: "Auteur de mods Minecraft (Java)",
      summary: "Conception, publication et maintenance de mods atteignant plus de 1,3 million de téléchargements sur CurseForge et Modrinth.",
      highlights: ["Addons client / serveur, compatibilité multijoueur, plusieurs versions majeures du jeu"],
    },
  },
  projects: {
    noxtys: {
      name: "Noxtys",
      kind: "SaaS · fondateur",
      period: "2026",
      status: "En production · maintenu en continu",
      tagline: "Un SaaS conçu, codé, déployé et opéré seul — de la base de données au paiement.",
      role: "Fondateur, développeur Full Stack : architecture, développement, déploiement, exploitation",
      context:
        "Construire un produit à moi, en production, avec de vraies contraintes : paiement récurrent, quotas, sécurité, modération réglementaire. Pas un side project qui tourne en local.",
      goals: [
        "Une API strictement modulaire, typée de bout en bout",
        "Un abonnement Stripe fiable, y compris pour les changements de plan",
        "Une conformité DSA intégrée dès la conception, pas ajoutée après coup",
      ],
      features: [
        "Abonnements Stripe : webhooks, proration, Subscription Schedules",
        "Quotas par plan et contrôles d'accès (protection IDOR)",
        "Pipeline de modération : signalement, revue, décisions",
        "Stockage objet Cloudflare R2, authentification, documentation OpenAPI générée",
      ],
      architecture: {
        summary:
          "Chaque module suit la même chaîne : schema → service → controller → routes → openapi. Zod est la source unique de validation et de typage, la documentation en découle.",
        nodes: { web: "App Router", api: "modules", zod: "schema · types", db: "Prisma", stripe: "webhooks", r2: "stockage" },
      },
      challenges: [
        {
          problem: "Changements de plan en cours de période : montants incohérents et quotas désynchronisés.",
          solution: "Proration Stripe et Subscription Schedules, avec les webhooks comme seule source de vérité pour les droits.",
        },
        {
          problem: "Accès possible aux ressources d'un autre utilisateur en devinant un identifiant (IDOR).",
          solution: "Contrôle d'appartenance systématique au niveau service, couvert par des tests Vitest.",
        },
        {
          problem: "Obligations DSA sur les contenus publiés par les utilisateurs.",
          solution: "Pipeline dédié : signalement, file de revue, décision tracée et motivée.",
        },
      ],
      results: [
        { value: "Solo", label: "de l'architecture à la production" },
        { value: "5", label: "couches par module, toujours les mêmes" },
        { value: "1", label: "source de vérité : les schémas Zod" },
      ],
    },
    observatory: {
      name: "Observatory",
      kind: "3D interactive · WebGL",
      period: "Nov. 2026",
      status: "Projet perso, en ligne",
      tagline: "Des systèmes planétaires réels et des planètes procédurales, rendus en direct dans le navigateur.",
      role: "Seul : conception, moteur 3D, shaders et contenu",
      context:
        "Un site vitrine sur l'espace : une planète procédurale que l'on peut mettre en scène, des systèmes planétaires réels (le Système solaire, TRAPPIST-1, Kepler-90, Proxima du Centaure, HR 8799) et générés, un catalogue d'objets, des constellations et des missions célèbres.",
      goals: [
        "Rendre planètes et objets du ciel profond en temps réel, sur ordinateur comme sur téléphone",
        "Rester fidèle aux données : orbites et faits réels, chacun avec sa source",
        "Garder le moteur 3D indépendant du framework d'interface",
      ],
      features: [
        "Créateur de planètes : classes, palettes et styles artistiques à mélanger",
        "5 systèmes planétaires réels, plus des systèmes générés reproductibles",
        "Catalogue d'objets : trou noir avec lentille gravitationnelle, nébuleuses, galaxies, comètes, maquettes de sondes NASA",
        "Constellations et missions spatiales (Apollo 11, Rosetta), en français et en anglais",
      ],
      architecture: {
        summary: "Les pages Nuxt pilotent un moteur WebGL indépendant du framework via des composables. Le moteur met en scène une vue à la fois avec des matériaux GLSL dédiés, nourris par des données sourcées et des cubemaps pré-calculées.",
        nodes: { pages: "pages · i18n", bridge: "composables", data: "faits sourcés", engine: "rendu à la demande", bake: "surfaces pré-calculées", shaders: "19 modules" },
        labels: { data: "Données" },
      },
      challenges: [
        {
          problem: "Les surfaces de planètes procédurales coûtent trop cher à calculer à chaque image, surtout sur téléphone.",
          solution: "Champs pré-calculés une fois dans des cubemaps, bande par bande, à une résolution choisie selon l'appareil.",
        },
        {
          problem: "Un même site pour des ordinateurs puissants et des téléphones modestes.",
          solution: "Trois niveaux de qualité GPU (taille du pré-calcul, densité de pixels, MSAA, pas de ray-marching) décidés à un seul endroit, et une boucle de rendu qui ne dessine que quand quelque chose bouge.",
        },
        {
          problem: "Les tailles et distances réelles ne tiennent pas sur un écran.",
          solution: "Une échelle réel → affichage qui compresse tailles, orbites et périodes en gardant leur ordre.",
        },
      ],
      results: [
        { value: "5", label: "systèmes planétaires réels" },
        { value: "19", label: "modules de shaders GLSL" },
        { value: "3", label: "niveaux de qualité GPU" },
      ],
    },
    athlon: {
      name: "Athlon Car Lease",
      kind: "Applications métier · Cloud",
      period: "2022 — 2025",
      status: "3 ans en entreprise",
      tagline: "Des applications critiques pour 1 500 collaborateurs, et leur passage à Azure.",
      role: "Développeur Full Stack (alternance), co-conception et maintenance",
      context:
        "Un acteur de la location longue durée dont les équipes travaillent chaque jour sur des outils internes. Ces outils doivent être disponibles, rapides et conformes au RGPD.",
      goals: [
        "Fiabiliser 10+ applications métier critiques",
        "Détecter les incidents avant les utilisateurs",
        "Migrer le parc applicatif vers Azure sans dégrader le service",
      ],
      features: [
        "Monitoring unifié : disponibilité et traçage des erreurs HTTP sur 50+ applications",
        "Application de conformité RGPD : chiffrement, déchiffrement, purge automatisée",
        "Tâches planifiées nocturnes pour les traitements batch",
        "Migration de 50+ applications métier vers Azure",
      ],
      architecture: {
        summary: "Des applications Node.js, .NET et Vue.js déployées sur Azure via Azure DevOps, toutes reliées à une brique de monitoring commune.",
        nodes: { devops: "CI/CD", apps: "Node · .NET · Vue", batch: "planifiés la nuit", mon: "dispo · erreurs", rgpd: "4 To chiffrés" },
        labels: { batch: "Batchs", rgpd: "RGPD" },
      },
      challenges: [
        {
          problem: "Des incidents de production découverts trop tard, application par application.",
          solution: "Un monitoring unifié sur tout le parc : le temps moyen de détection a été divisé par 2.",
        },
        {
          problem: "Des traitements lourds qui ralentissaient les applications aux heures de bureau.",
          solution: "Bascule en tâches planifiées nocturnes : −80 % de charge en journée, +30 % de réactivité.",
        },
        {
          problem: "Purger et protéger des données personnelles sur une base de 4 To.",
          solution: "Une application dédiée au chiffrement, au déchiffrement et à la purge automatisée.",
        },
      ],
      results: [
        { value: "÷2", label: "temps de détection des incidents" },
        { value: "−25 %", label: "coûts d'infrastructure" },
        { value: "99,9 %", label: "de disponibilité" },
      ],
    },
    "cobblemon-mods": {
      name: "Mods Minecraft",
      kind: "Open source · Java",
      period: "En continu",
      status: "Publiés · CurseForge & Modrinth",
      tagline: "Plus de 1,3 million de téléchargements sur des mods Java maintenus pour Fabric et NeoForge.",
      role: "Auteur et mainteneur",
      context:
        "Le modding, c'est du développement sans filet : une API de jeu peu documentée, des milliers de joueurs en multijoueur, et des retours immédiats quand quelque chose casse.",
      goals: [
        "Étendre Cobblemon avec des fonctionnalités réclamées par la communauté",
        "Supporter Fabric et NeoForge depuis une seule base de code",
        "Rester performant côté serveur en multijoueur",
      ],
      features: [
        "Ultra Beasts : une nouvelle dimension, l'Ultra-Space, et ses portails",
        "Just Enough Cobblemon : lieux d'apparition dans le Pokédex, intégration JEI / EMI",
        "Cobblemon Marks : objectifs configurables en JSON",
        "Shiny Charm et Scoremons : objets et statistiques pour scoreboards",
      ],
      architecture: {
        summary: "Projets multiloader : un module commun porte la logique, deux modules fins branchent Fabric et NeoForge.",
        nodes: { json: "config · datapacks", common: "logique partagée", fabric: "entrypoints", neo: "entrypoints", cf: "Modrinth" },
      },
      challenges: [
        {
          problem: "Un effet de portail qui doit transmettre une destination aux particules côté client.",
          solution: "Une entité invisible dédiée et des particules à count zéro, dont la vélocité transporte les coordonnées.",
        },
        {
          problem: "Maintenir deux loaders et plusieurs versions du jeu sans dupliquer le code.",
          solution: "Architecture multiloader avec un module commun et des points d'entrée minces.",
        },
      ],
      results: [
        { value: "1,3M+", label: "téléchargements cumulés" },
        { value: "5", label: "mods Cobblemon maintenus" },
        { value: "2", label: "loaders : Fabric + NeoForge" },
      ],
    },
  },
};

/** Raw messages, also read directly by src/composables/useContent.ts for the (typed) content. */
export const messages = { en, fr };
export type Locale = keyof typeof messages;

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages,
}));
