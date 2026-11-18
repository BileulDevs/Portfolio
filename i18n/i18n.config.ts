/**
 * Every text of the site, in English (default) and French: interface and content alike.
 * src/data/ only keeps what does not change with the language (slugs, stacks, links, themes).
 *
 * `fr` is typed as `typeof en`: a key missing in one language is a type error.
 * vue-i18n reserves { } @ $ | in messages: write {'@'} for a literal @.
 */

const en = {
  meta: {
    title: "Bilel Sahraoui • Full Stack Developer",
    description: "Bilel Sahraoui, Full Stack Node.js / TypeScript developer. Business applications, SaaS in production, mods with 1.3 million downloads.",
    ogDescription: "Node.js, TypeScript, Vue, Next.js, C# / .NET, Azure. Open to a permanent position.",
    projectTitle: "{name} • Bilel Sahraoui",
    notFoundTitle: "Page not found • Bilel Sahraoui",
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
    preview: "Preview of {name}",
  },
  cursor: { go: "Go", write: "Write", view: "View", drag: "Drag", pet: "Pet" },
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
  footer: { made: "Nuxt.js {version} · Three.js" },
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
    architecture: "Architecture: key decisions",
    challenges: "Challenges → solutions",
    problem: "Problem",
    solution: "Solution",
    results: "Results",
    gallery: "Screenshots",
    next: "Next project",
    featuresCarousel: "carousel",
    featuresHint: "Click an item to see the details",
    tech: "Key techniques",
    openFeature: "Show details: {name}",
    prevFeature: "Previous feature",
    nextFeature: "Next feature",
    sound: "Sound",
    volume: "Volume",
    /** Credit shown under the feature carousel when it uses Cobblemon models. */
    cobblemonCredit: "3D models from Cobblemon (MPL-2.0; Pokémon models: CC BY-NC 3.0). Pokémon © Nintendo, Game Freak, The Pokémon Company",
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
          "Two applications: a Next.js 14 front end and an Express 5 REST API. Only the API reaches the PostgreSQL database (through Prisma) and the outside services: Stripe for billing, object storage for user files, and the moderation queue.",
        decisions: [
          {
            choice: "Zod schemas as the single source of truth",
            why: "Request validation, TypeScript types and the OpenAPI documentation all derive from the same schema, so they cannot drift apart.",
          },
          {
            choice: "The same five layers in every module",
            why: "schema → service → controller → routes → openapi: any module reads the same way, and ownership checks live in one place, the service layer, where they are tested.",
          },
          {
            choice: "Stripe webhooks decide entitlements",
            why: "Plans, quotas and access follow what Stripe confirms, not what the front end asks for: payments and rights never disagree, even after a mid-period plan change.",
          },
          {
            choice: "Managed services over self-hosting",
            why: "Railway, PostgreSQL and Cloudflare R2: as the only operator, my time goes into the product rather than servers, and R2 charges nothing for serving user files.",
          },
        ],
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
        summary: "Each page asks for one scene: the home observatory, the orrery of a planetary system, a catalogue or a single object. The engine loads that scene, draws it through a post-processing chain, and swaps it when the route changes.",
        decisions: [
          {
            choice: "A WebGL engine with no Vue import",
            why: "The renderer, stages and shaders are plain TypeScript; pages talk to them through two composables. The 3D stays testable and reusable, and Vue reactivity never runs inside the render loop.",
          },
          {
            choice: "Render on demand",
            why: "A frame is drawn only when something moves: a still page costs no GPU time, which matters on laptops and phones.",
          },
          {
            choice: "Procedural surfaces baked once",
            why: "Noise fields are computed once into cubemaps, strip by strip, then sampled as textures: the per-frame cost stays low whatever the planet's detail.",
          },
          {
            choice: "Static site, reproducible generated systems",
            why: "Built with nuxt generate and served by Netlify, no backend. A generated system comes from its seed (gen-<seed>), so any link can be shared and shows the same system.",
          },
        ],
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
    "space-journey": {
      name: "Space Journey",
      kind: "Interactive 3D · WebGL",
      period: "2026",
      status: "Personal project, live",
      tagline: "A scroll-driven journey from Earth orbit to a new galaxy, rendered live in WebGL.",
      role: "Solo: design, 3D engine, shaders and sound",
      context: "A cinematic space voyage told in one continuous camera move: scrolling flies from low Earth orbit through the Solar System, a nebula and a wormhole, past exoplanets, an asteroid field and a black hole, to a new galaxy.",
      goals: [
        "Make scrolling feel like piloting a camera, not reading a page",
        "Stay smooth on phones as well as on desktops",
        "Ship no image or sound file: everything generated in code",
      ],
      features: [
        "Eight scroll-driven chapters, with a mission HUD to jump to any of them",
        "Procedural planets: continents, gas bands, craters, lava, clouds and city lights, no texture",
        "A black hole with an accretion disc (temperature gradient, Doppler brightening) and a photon ring",
        "A wormhole warp: wider field of view, camera shake, radial streaks and a synthesized sound that rises with it",
      ],
      architecture: {
        summary: "A Nuxt page renders the chapters as plain HTML sections; a client-only component starts a standalone Three.js engine behind them. Scrolling drives a GSAP timeline that moves the camera from station to station, and the engine draws the scene through a bloom, FXAA and film-grain chain.",
        decisions: [
          {
            choice: "Scroll and 3D share one plain object",
            why: "GSAP animates a plain JavaScript camera object and the engine reads it every frame; Vue reactivity is kept for the HUD only, so nothing reactive runs inside the render loop.",
          },
          {
            choice: "A camera timeline measured on the page",
            why: "Each station is reached when its section is read, from positions measured in the DOM, through travelling waypoints; frame-rate independent smoothing and banking in turns give the piloted feel.",
          },
          {
            choice: "Everything procedural",
            why: "Planets, nebula, galaxy and black hole are noise-based shaders, and the soundtrack is synthesized with the Web Audio API: the site downloads code only.",
          },
          {
            choice: "One loop for scroll and animation",
            why: "Lenis is driven from GSAP's ticker instead of its own requestAnimationFrame, and Three.js ships in its own chunk.",
          },
        ],
      },
      challenges: [
        {
          problem: "Bloom on a multisampled float target flickered depending on the GPU.",
          solution: "A single-sample half-float render target, with anti-aliasing moved to an FXAA pass.",
        },
        {
          problem: "In development, Three.js add-ons loaded a second copy of Three.js and the canvas stayed blank.",
          solution: "Three.js and its add-ons forced through the same Vite pre-bundle.",
        },
        {
          problem: "One experience for high-end desktops and modest phones.",
          solution: "Three quality tiers picked from the device (stars, asteroids, sphere detail, bloom, pixel ratio).",
        },
      ],
      results: [
        { value: "8", label: "chapters in one camera move" },
        { value: "0", label: "image or audio files" },
        { value: "1", label: "draw call for the asteroid field" },
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
        summary: "10+ critical business applications in Node.js, .NET and Vue.js, within an estate of 50+ applications, used every day by 1,500 employees.",
        decisions: [
          {
            choice: "One monitoring layer for the whole estate",
            why: "Availability and HTTP errors of 50+ applications watched in one place instead of app by app: incidents surface sooner, detection time halved.",
          },
          {
            choice: "Heavy processing moved to the night",
            why: "Batch work runs as scheduled night-time jobs: −80% daytime server load and more responsive applications for users.",
          },
          {
            choice: "The same CI/CD path for every application",
            why: "Node.js, .NET and Vue.js apps all deploy through Azure DevOps pipelines, which made moving 50+ applications to Azure repeatable.",
          },
          {
            choice: "GDPR handled by a dedicated application",
            why: "Encryption, decryption and purging centralised in one tool rather than spread across apps: one place to audit, applied to 4 TB of data.",
          },
        ],
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
      /** Replaces the "Features" heading for this project. */
      featuresTitle: "Mods",
      period: "2024 — Ongoing",
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
        "Just Enough Cobblemon: a spawn tab in the Pokédex (biome, time, weather, rarity) and every drop table in JEI",
        "Cobblemon Safari: a daily-changing Safari island with timed hunts, missions, events and a shop",
        "Cobblemon Scoremons: scoreboard-ready trainer stats, plus server-wide shiny and legendary catch announcements",
        "Cobblemon ShinyDex: complete the National Dex to earn the Shiny Charm, with advancements and admin commands",
        "Cobblemon Marks Quests: marks earned through objectives instead of luck, every condition configurable in JSON",
        "Cobblemon Spawner: a Pokémon spawner block for adventure maps, set up from a 3D interface",
        "Cobblemon Ultra-Beasts: a wormhole into Ultra Space, a dimension built to hunt every Ultra Beast",
      ],
      /** Technical details per mod, in the same order as `features`: shown when a mod is opened. */
      featureDetails: [
        [
          "Pokédex tab added by mixin, out of reach of Cobblemon's casts",
          "Spawn data sent once on join, cached on the client",
          "Jade code loaded only by Jade: no crash without it",
        ],
        [
          "Site search off the server thread (CompletableFuture)",
          "Houses prebuilt by chunk tickets, paused when the server lags",
          "Live daily reset: the level swapped in a single tick",
        ],
        [
          "Every write through a single StatAwarder",
          "Lowest-priority listeners, mixins where Cobblemon has no event",
          "Pokédex stats rebuilt from state, never counted",
        ],
        [
          "Throttling removed 4,000 Pokédex lookups per player per tick",
          "Species resolved once into an immutable cache",
          "Shiny boost checked at spawn in two map lookups",
        ],
        [
          "Polymorphic Gson adapter for the JSON conditions",
          "Progress stored in the Pokémon's own NBT",
          "Counters synced to the client as they change",
        ],
        [
          "Pokémon tagged with the spawner's position, no UUID tracking",
          "Weighted draw filtered by time and weather",
          "Hand-drawn Kotlin screens with animated 3D models",
        ],
        [
          "One-player lease that survives restarts",
          "Bounding boxes: ~885,000 fewer NBT entries per save",
          "Structure meshes preloaded before the cinematic",
        ],
      ],
      architecture: {
        summary: "Java projects built with Gradle that add content on top of Cobblemon, itself a Minecraft mod: items, entities, a dimension and spawn data, released for each supported game version on CurseForge and Modrinth.",
        decisions: [
          {
            choice: "Multiloader: a common module, thin loader modules",
            why: "The game logic is written once; Fabric and NeoForge modules only hold their entry points, so each feature ships on both loaders.",
          },
          {
            choice: "Behaviour configured in JSON",
            why: "Server owners tune goals and content through config files and datapacks, without a new build: one jar fits very different servers.",
          },
          {
            choice: "The server decides, the client displays",
            why: "In multiplayer the server stays authoritative and light; clients only receive what they need to draw, such as portal coordinates carried by particles.",
          },
          {
            choice: "Integrate with existing mods rather than rebuild",
            why: "Spawn data goes into the JEI / EMI recipe viewers players already use, instead of a new interface to learn and maintain.",
          },
        ],
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
    title: "Bilel Sahraoui • Développeur Full Stack",
    description: "Bilel Sahraoui, développeur Full Stack Node.js / TypeScript. Applications métier, SaaS en production, mods à 1,3 million de téléchargements.",
    ogDescription: "Node.js, TypeScript, Vue, Next.js, C# / .NET, Azure. Ouvert à un CDI.",
    projectTitle: "{name} • Bilel Sahraoui",
    notFoundTitle: "Page introuvable • Bilel Sahraoui",
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
    preview: "Aperçu de {name}",
  },
  cursor: { go: "Go", write: "Écrire", view: "Voir", drag: "Glisser", pet: "Caresser" },
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
  footer: { made: "Nuxt.js {version} · Three.js" },
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
    architecture: "Architecture : choix structurants",
    challenges: "Difficultés → solutions",
    problem: "Problème",
    solution: "Solution",
    results: "Résultats",
    gallery: "Captures",
    next: "Projet suivant",
    featuresCarousel: "carrousel",
    featuresHint: "Clique sur un objet pour voir le détail",
    tech: "Techniques clés",
    openFeature: "Voir le détail : {name}",
    prevFeature: "Fonctionnalité précédente",
    nextFeature: "Fonctionnalité suivante",
    sound: "Son",
    volume: "Volume",
    cobblemonCredit: "Modèles 3D issus de Cobblemon (MPL-2.0 ; modèles de Pokémon : CC BY-NC 3.0). Pokémon © Nintendo, Game Freak, The Pokémon Company",
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
          "Deux applications : un front Next.js 14 et une API REST Express 5. Seule l'API accède à la base PostgreSQL (via Prisma) et aux services extérieurs : Stripe pour la facturation, un stockage objet pour les fichiers des utilisateurs, et la file de modération.",
        decisions: [
          {
            choice: "Les schémas Zod comme source de vérité unique",
            why: "Validation des requêtes, types TypeScript et documentation OpenAPI découlent du même schéma : ils ne peuvent pas diverger.",
          },
          {
            choice: "Les mêmes cinq couches dans chaque module",
            why: "schéma → service → contrôleur → routes → openapi : chaque module se lit de la même façon, et les contrôles de propriété vivent à un seul endroit, la couche service, où ils sont testés.",
          },
          {
            choice: "Les webhooks Stripe décident des droits",
            why: "Formules, quotas et accès suivent ce que Stripe confirme, pas ce que demande le front : paiements et droits ne divergent jamais, même après un changement de formule en cours de période.",
          },
          {
            choice: "Des services managés plutôt que de l'auto-hébergement",
            why: "Railway, PostgreSQL et Cloudflare R2 : seul à opérer le produit, je passe mon temps sur le produit plutôt que sur les serveurs, et R2 ne facture pas la diffusion des fichiers.",
          },
        ],
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
        summary: "Chaque page demande une scène : l'observatoire d'accueil, l'orrery d'un système planétaire, un catalogue ou un objet seul. Le moteur charge cette scène, la dessine à travers une chaîne de post-traitement, et la remplace quand la route change.",
        decisions: [
          {
            choice: "Un moteur WebGL sans aucun import de Vue",
            why: "Rendu, scènes et shaders sont en TypeScript pur ; les pages leur parlent via deux composables. La 3D reste testable et réutilisable, et la réactivité de Vue ne tourne jamais dans la boucle de rendu.",
          },
          {
            choice: "Rendu à la demande",
            why: "Une image n'est dessinée que quand quelque chose bouge : une page immobile ne coûte rien au GPU, ce qui compte sur portable et téléphone.",
          },
          {
            choice: "Surfaces procédurales pré-calculées une fois",
            why: "Les champs de bruit sont calculés une seule fois dans des cubemaps, bande par bande, puis lus comme des textures : le coût par image reste bas quel que soit le détail de la planète.",
          },
          {
            choice: "Site statique, systèmes générés reproductibles",
            why: "Construit avec nuxt generate et servi par Netlify, sans backend. Un système généré vient de sa graine (gen-<seed>) : n'importe quel lien se partage et affiche le même système.",
          },
        ],
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
    "space-journey": {
      name: "Space Journey",
      kind: "3D interactive · WebGL",
      period: "2026",
      status: "Projet perso, en ligne",
      tagline: "Un voyage piloté au scroll, de l'orbite terrestre à une nouvelle galaxie, rendu en direct en WebGL.",
      role: "Seul : design, moteur 3D, shaders et son",
      context: "Un voyage spatial cinématique raconté en un seul mouvement de caméra : le scroll fait passer de l'orbite basse au Système solaire, à une nébuleuse et un trou de ver, puis devant des exoplanètes, un champ d'astéroïdes et un trou noir, jusqu'à une nouvelle galaxie.",
      goals: [
        "Que scroller donne l'impression de piloter une caméra, pas de lire une page",
        "Rester fluide sur téléphone comme sur ordinateur",
        "Aucun fichier image ni son : tout est généré par le code",
      ],
      features: [
        "Huit chapitres pilotés au scroll, avec un HUD de mission pour aller à chacun",
        "Planètes procédurales : continents, bandes gazeuses, cratères, lave, nuages et lumières des villes, sans texture",
        "Un trou noir avec disque d'accrétion (gradient de température, effet Doppler) et anneau de photons",
        "Le passage du trou de ver : champ de vision élargi, tremblement, stries radiales et un son synthétisé qui monte avec",
      ],
      architecture: {
        summary: "Une page Nuxt affiche les chapitres en simples sections HTML ; un composant client démarre derrière elles un moteur Three.js autonome. Le scroll pilote une timeline GSAP qui déplace la caméra de station en station, et le moteur dessine la scène à travers une chaîne bloom, FXAA et grain de film.",
        decisions: [
          {
            choice: "Le scroll et la 3D partagent un simple objet",
            why: "GSAP anime un objet caméra en JavaScript simple que le moteur lit à chaque frame ; la réactivité Vue est réservée au HUD, rien de réactif ne tourne dans la boucle de rendu.",
          },
          {
            choice: "Une timeline caméra mesurée sur la page",
            why: "Chaque station est atteinte quand sa section est lue, d'après les positions mesurées dans le DOM, en passant par des points de travelling ; un lissage indépendant du framerate et une inclinaison dans les virages donnent la sensation de pilotage.",
          },
          {
            choice: "Tout en procédural",
            why: "Planètes, nébuleuse, galaxie et trou noir sont des shaders à base de bruit, et la bande-son est synthétisée avec la Web Audio API : le site ne télécharge que du code.",
          },
          {
            choice: "Une seule boucle pour le scroll et l'animation",
            why: "Lenis est piloté par le ticker de GSAP plutôt que par son propre requestAnimationFrame, et Three.js est servi dans son propre chunk.",
          },
        ],
      },
      challenges: [
        {
          problem: "Le bloom sur une cible flottante multi-échantillonnée scintillait selon le GPU.",
          solution: "Une cible de rendu demi-flottante mono-échantillon, et l'anti-aliasing confié à une passe FXAA.",
        },
        {
          problem: "En développement, les add-ons de Three.js chargeaient une deuxième copie de Three.js et le canvas restait vide.",
          solution: "Three.js et ses add-ons forcés dans le même pré-bundle Vite.",
        },
        {
          problem: "Une même expérience pour des ordinateurs puissants et des téléphones modestes.",
          solution: "Trois paliers de qualité choisis selon l'appareil (étoiles, astéroïdes, détail des sphères, bloom, densité de pixels).",
        },
      ],
      results: [
        { value: "8", label: "chapitres en un seul mouvement de caméra" },
        { value: "0", label: "fichier image ou audio" },
        { value: "1", label: "draw call pour le champ d'astéroïdes" },
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
        summary: "Plus de 10 applications métier critiques en Node.js, .NET et Vue.js, au sein d'un parc de 50+ applications, utilisées chaque jour par 1 500 collaborateurs.",
        decisions: [
          {
            choice: "Une seule couche de supervision pour tout le parc",
            why: "Disponibilité et erreurs HTTP de 50+ applications surveillées au même endroit plutôt qu'appli par appli : les incidents remontent plus tôt, temps de détection divisé par deux.",
          },
          {
            choice: "Les traitements lourds déplacés la nuit",
            why: "Les batchs tournent en tâches planifiées la nuit : −80 % de charge serveur en journée et des applications plus réactives pour les utilisateurs.",
          },
          {
            choice: "Le même chemin CI/CD pour toutes les applications",
            why: "Applis Node.js, .NET et Vue.js déployées par les mêmes pipelines Azure DevOps, ce qui a rendu reproductible la migration de 50+ applications vers Azure.",
          },
          {
            choice: "Le RGPD confié à une application dédiée",
            why: "Chiffrement, déchiffrement et purge centralisés dans un seul outil plutôt qu'éparpillés dans les applis : un seul endroit à auditer, appliqué à 4 To de données.",
          },
        ],
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
      featuresTitle: "Mods",
      period: "2024 — En cours",
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
        "Just Enough Cobblemon : un onglet d'apparition dans le Pokédex (biome, heure, météo, rareté) et toutes les tables de drop dans JEI",
        "Cobblemon Safari : une île Safari qui change chaque jour, avec chasses chronométrées, missions, événements et boutique",
        "Cobblemon Scoremons : des statistiques de dresseur prêtes pour les scoreboards, et l'annonce des captures shiny et légendaires",
        "Cobblemon ShinyDex : compléter le Pokédex National pour obtenir le Charme Chroma, avec progrès et commandes d'administration",
        "Cobblemon Marks Quests : des marques obtenues par objectifs plutôt que par chance, chaque condition configurable en JSON",
        "Cobblemon Spawner : un bloc spawner de Pokémon pour les maps d'aventure, réglé depuis une interface 3D",
        "Cobblemon Ultra-Beasts : un trou de ver vers l'Ultra-Space, une dimension pensée pour chasser toutes les Ultra-Chimères",
      ],
      featureDetails: [
        [
          "Onglet Pokédex ajouté par mixin, hors de portée des casts de Cobblemon",
          "Données d'apparition envoyées une fois à la connexion, en cache côté client",
          "Code Jade chargé par Jade seul : aucun crash sans lui",
        ],
        [
          "Recherche de sites hors du thread serveur (CompletableFuture)",
          "Refuges préconstruits par tickets de chunk, en pause si le serveur rame",
          "Régénération à chaud : le niveau remplacé en un seul tick",
        ],
        [
          "Toutes les écritures passent par un seul StatAwarder",
          "Écouteurs en priorité minimale, mixins là où Cobblemon n'a pas d'événement",
          "Stats du Pokédex recalculées depuis l'état, jamais comptées",
        ],
        [
          "Un throttling qui évite 4 000 lectures du Pokédex par joueur et par tick",
          "Espèces résolues une fois dans un cache immuable",
          "Bonus shiny vérifié à l'apparition en deux lectures de map",
        ],
        [
          "Adaptateur Gson polymorphe pour les conditions JSON",
          "Progression stockée dans le NBT du Pokémon",
          "Compteurs synchronisés au client dès qu'ils changent",
        ],
        [
          "Pokémon marqués avec la position du spawner, sans suivi par UUID",
          "Tirage pondéré filtré par l'heure et la météo",
          "Écrans Kotlin dessinés à la main, modèles 3D animés",
        ],
        [
          "Bail « un joueur à la fois » qui survit aux redémarrages",
          "Boîtes englobantes : ~885 000 entrées NBT en moins par sauvegarde",
          "Maillages de la structure préchargés avant la cinématique",
        ],
      ],
      architecture: {
        summary: "Des projets Java construits avec Gradle qui ajoutent du contenu à Cobblemon, lui-même un mod Minecraft : objets, entités, une dimension et des données d'apparition, publiés pour chaque version du jeu supportée sur CurseForge et Modrinth.",
        decisions: [
          {
            choice: "Multiloader : un module commun, des modules de loader minces",
            why: "La logique du jeu est écrite une fois ; les modules Fabric et NeoForge ne contiennent que leurs points d'entrée, chaque fonctionnalité sort donc sur les deux loaders.",
          },
          {
            choice: "Un comportement configuré en JSON",
            why: "Les admins de serveurs règlent objectifs et contenu via des fichiers de config et des datapacks, sans nouvelle version : un même jar s'adapte à des serveurs très différents.",
          },
          {
            choice: "Le serveur décide, le client affiche",
            why: "En multijoueur, le serveur reste l'autorité et reste léger ; les clients ne reçoivent que ce qu'il faut pour dessiner, comme les coordonnées d'un portail portées par des particules.",
          },
          {
            choice: "S'intégrer aux mods existants plutôt que tout refaire",
            why: "Les données d'apparition vont dans JEI / EMI, que les joueurs utilisent déjà, plutôt que dans une nouvelle interface à apprendre et à maintenir.",
          },
        ],
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
