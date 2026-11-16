import type { Project } from "./types";

/**
 * Projects shown in the carousel and on /projets/:slug, in display order.
 * Adding a project = adding one object here (plus optional images in /public/projects/<slug>/).
 */
export const projects: Project[] = [
  {
    slug: "noxtys",
    name: "Noxtys",
    kind: "SaaS · fondateur",
    period: "2026",
    status: "En production · maintenu en continu",
    tagline: "Un SaaS conçu, codé, déployé et opéré seul — de la base de données au paiement.",
    role: "Fondateur, développeur Full Stack : architecture, développement, déploiement, exploitation",
    stack: ["TypeScript", "Next.js 14", "Express 5", "PostgreSQL", "Prisma", "Zod", "Stripe", "Cloudflare R2", "Vitest", "Railway"],
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
      nodes: [
        { id: "web", label: "Next.js 14", sub: "App Router" },
        { id: "api", label: "Express 5", sub: "modules" },
        { id: "zod", label: "Zod", sub: "schema · types" },
        { id: "db", label: "PostgreSQL", sub: "Prisma" },
        { id: "stripe", label: "Stripe", sub: "webhooks" },
        { id: "r2", label: "R2", sub: "stockage" },
      ],
      links: [["web", "api"], ["zod", "api"], ["api", "db"], ["api", "stripe"], ["api", "r2"]],
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
    art: "rings",
    url: "https://noxtys.com/",
    urlLabel: "noxtys.com",
  },
  {
    slug: "athlon",
    name: "Athlon Car Lease",
    kind: "Applications métier · Cloud",
    period: "2022 — 2025",
    status: "3 ans en entreprise",
    tagline: "Des applications critiques pour 1 500 collaborateurs, et leur passage à Azure.",
    role: "Développeur Full Stack (alternance), co-conception et maintenance",
    stack: ["Node.js", "C# / .NET", "Vue.js", "Azure", "Azure DevOps", "CI/CD", "Winston"],
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
      summary:
        "Des applications Node.js, .NET et Vue.js déployées sur Azure via Azure DevOps, toutes reliées à une brique de monitoring commune.",
      nodes: [
        { id: "devops", label: "Azure DevOps", sub: "CI/CD" },
        { id: "apps", label: "50+ apps", sub: "Node · .NET · Vue" },
        { id: "batch", label: "Batchs", sub: "planifiés la nuit" },
        { id: "mon", label: "Monitoring", sub: "dispo · erreurs" },
        { id: "rgpd", label: "RGPD", sub: "4 To chiffrés" },
      ],
      links: [["devops", "apps"], ["apps", "mon"], ["apps", "batch"], ["apps", "rgpd"]],
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
    art: "monitor",
  },
  {
    slug: "cobblemon-mods",
    name: "Mods Minecraft",
    kind: "Open source · Java",
    period: "En continu",
    status: "Publiés · CurseForge & Modrinth",
    tagline: "Plus de 1,3 million de téléchargements sur des mods Java maintenus pour Fabric et NeoForge.",
    role: "Auteur et mainteneur",
    stack: ["Java", "Fabric", "NeoForge", "Gradle", "JSON"],
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
      nodes: [
        { id: "json", label: "JSON", sub: "config · datapacks" },
        { id: "common", label: "common", sub: "logique partagée" },
        { id: "fabric", label: "Fabric", sub: "entrypoints" },
        { id: "neo", label: "NeoForge", sub: "entrypoints" },
        { id: "cf", label: "CurseForge", sub: "Modrinth" },
      ],
      links: [["json", "common"], ["common", "fabric"], ["common", "neo"], ["fabric", "cf"], ["neo", "cf"]],
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
    art: "voxels",
    url: "https://www.curseforge.com/members/darcosse/projects",
    urlLabel: "CurseForge",
  },
  {
    slug: "spotr",
    name: "SpotR",
    kind: "Réseau social · microservices",
    period: "En cours",
    status: "En développement",
    tagline: "Le réseau social des carspotters : photographier, localiser et partager les voitures rares croisées dans la rue.",
    role: "Architecture et développement Full Stack",
    stack: ["TypeScript", "Node.js", "Microservices", "Docker", "PostgreSQL", "MongoDB"],
    context:
      "Les carspotters publient leurs photos sur des réseaux généralistes où elles se perdent. SpotR leur donne un fil, une carte et un profil pensés pour ça.",
    goals: [
      "Découper le domaine en services indépendants, déployables séparément",
      "Absorber les pics d'upload de photos sans ralentir le fil",
      "Garder une expérience mobile rapide malgré des médias lourds",
    ],
    features: [
      "Publication de spots avec photo, modèle et localisation",
      "Fil d'actualité, likes et commentaires",
      "Carte des spots par zone",
      "Notifications en temps réel",
    ],
    architecture: {
      summary: "Une API gateway route vers des services spécialisés ; les traitements lourds passent par une file de messages.",
      nodes: [
        { id: "gw", label: "Gateway", sub: "routage · auth" },
        { id: "auth", label: "Auth", sub: "JWT" },
        { id: "spots", label: "Spots", sub: "posts · carte" },
        { id: "feed", label: "Social", sub: "fil · likes" },
        { id: "media", label: "Media", sub: "upload · resize" },
        { id: "notif", label: "Notifs", sub: "temps réel" },
      ],
      links: [["gw", "auth"], ["gw", "spots"], ["gw", "feed"], ["spots", "media"], ["feed", "notif"]],
    },
    challenges: [
      {
        problem: "Cohérence des données réparties entre plusieurs services.",
        solution: "Événements de domaine publiés sur une file et consommés de façon idempotente.",
      },
      {
        problem: "Des photos de plusieurs Mo qui bloquent les requêtes.",
        solution: "Upload découplé : le service Media traite et redimensionne en asynchrone.",
      },
    ],
    results: [
      { value: "6", label: "services indépendants" },
      { value: "Async", label: "traitement des médias" },
      { value: "Mobile", label: "pensé d'abord pour le terrain" },
    ],
    art: "grid",
  },
];

export const findProject = (slug: string) => projects.findIndex((p) => p.slug === slug);
