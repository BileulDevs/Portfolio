# Portfolio — Bilel Sahraoui · V1

Nuxt 4 (Vue 3) + TypeScript, d'après le concept 05 « Matière ».
Pas de framework CSS, une seule dépendance lourde : Three.js, uniquement pour le carrousel des projets, et chargé à la demande.

## Lancer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # type-check (nuxt typecheck) puis site statique pré-rendu dans .output/public/
npx serve .output/public   # sert le build comme en production
```

Node 20+ requis (Nuxt 4).

## Déployer

`npm run build` génère un site statique : chaque page (accueil, une page par projet) est pré-rendue en HTML dans `.output/public/`, plus un `404.html`. Aucune réécriture d'URL n'est nécessaire : publier ce dossier sur Netlify, Vercel, Cloudflare Pages ou n'importe quel hébergeur statique.

Les routes des projets sont listées dans `nuxt.config.ts` à partir de `src/data/projects.ts` : un nouveau projet est pré-rendu automatiquement.

## Structure

```
src/
├── app.vue                coque : header, curseur, barre de progression, toasts, <NuxtPage>
├── error.vue              page 404
├── pages/                 index.vue (accueil), projets/[slug].vue (étude de cas)
├── components/            auto-importés par nom de fichier (pas besoin d'import)
│   ├── ui/                briques réutilisables : BlobLink (CTA rond), PillNav (← nom →), ProjectArt (visuel généré)
│   ├── layout/            SiteHeader + MenuOverlay, SiteFooter, ScrollProgress, ToastHost, CursorDot
│   ├── home/              une section = un composant (Hero, Manifesto, Stack, Projects, Experience, Contact)
│   │                      + leurs morceaux : SkillWord, LevelLegend, ExperienceItem, EducationList, ContactLinks, ContactForm
│   ├── project/           étude de cas : ProjectHero, ProjectCover, ProjectFacts, ProjectStory (+ ProjectBlock),
│   │                      ArchitectureDiagram, ProjectNext, ProjectDock
│   └── carousel/          CurvedCarousel (Three.js) + CarouselTrack (repli natif) + CarouselHud, threeParts (imports Three)
├── data/                  ← tout le contenu du site (le seul dossier à toucher pour les textes)
│   ├── types.ts           types partagés
│   ├── profile.ts         identité, liens, formation, chiffres clés
│   ├── stack.ts           technos par domaine + niveau (3 production / 2 solide / 1 notions)
│   ├── projects.ts        projets (carrousel + pages /projets/:slug)
│   └── experience.ts      parcours
├── composables/           useMedia (reduced motion, pointeur), useScrollProgress, useInView, useToast, useClipboard
├── directives/            v-reveal (apparition au scroll), v-magnetic (boutons aimantés)
├── plugins/directives.ts  enregistre v-reveal et v-magnetic
├── utils/projectArt.ts    dessin des visuels génératifs (en attendant les vraies captures)
├── router.options.ts      défilement vers les ancres après la transition de page
└── styles/main.css        tokens (palette, typos, easing) et styles globaux
```

Conventions :
- un composant = un fichier court, avec ses styles `scoped` ; la taille et la position d'un composant `ui/` viennent du parent (classe sur la racine).
- WebGL et curseur ne s'affichent que dans le navigateur : ils sont enveloppés dans `<ClientOnly>` là où ils sont utilisés.
- les données restent dans `data/`, les composants les reçoivent en props ou les importent directement.

## Ajouter un projet

1. Ajouter un objet dans `src/data/projects.ts` (le `slug` devient l'URL).
2. Optionnel : déposer des images dans `public/projects/<slug>/` et renseigner `cover` et `gallery`.
   Sans `cover`, un visuel est généré selon `art` (`rings`, `grid`, `voxels`, `monitor`).

Le carrousel, la page projet, la navigation précédent / suivant et le titre de l'onglet suivent automatiquement.

## Le carrousel des projets

Il s'inspire de mathiasadolfsson.dev : des panneaux posés sur un cylindre, qui se courbent davantage et séparent leurs canaux RVB quand ils bougent, puis se stabilisent sur le projet centré.

- **Contrôles** : glisser (souris ou doigt), molette horizontale / trackpad, `Maj + molette`, flèches, clavier (`←` `→` `Entrée`). Clic au centre : ouvre le projet. Clic sur un côté : le centre.
- **Molette verticale** : jamais capturée, la page défile normalement (pas de scroll hijacking).
- **Performance** : textures générées une fois, rendu arrêté dès que tout est immobile ou hors écran, DPR plafonné, Three.js tree-shaké et chargé en différé (~128 Ko gzip).
- **Repli** : si `prefers-reduced-motion` est actif ou si WebGL est absent, une piste horizontale native prend le relais, avec les mêmes contrôles.

## Accessibilité et préférences

- `prefers-reduced-motion` : shader figé, carrousel natif, aucune animation ni défilement doux.
- Curseur personnalisé et effets aimantés : seulement à la souris. Le curseur natif reste visible.
- Contrastes vérifiés : sur le corail, le texte utilise une encre foncée dérivée de `#475465` (4,9:1).
- Menu au clavier (focus, `Échap`), page projet fermable avec `Échap`, région du carrousel annoncée aux lecteurs d'écran.

## Contenus à valider

| Élément | Situation |
|---|---|
| **SpotR** | Absent du CV : l'architecture (6 services), la stack et les chiffres sont des **hypothèses**. À corriger ou à retirer. |
| **Noxtys** | Période « janv. – oct. 2026 » reprise du CV. Il manque une phrase qui dit *ce que fait* le produit pour l'utilisateur. |
| **LinkedIn** | Absent du CV, donc absent du site. Il suffit de l'ajouter dans `profile.links`. |
| **Téléphone** | Volontairement non affiché (spam). |
| **Visuels** | Générés par code : à remplacer par de vraies captures ou de courtes vidéos. |
| **Niveaux de stack** | Déduits du CV (« Notions » → niveau 1). À ajuster dans `stack.ts`. |
