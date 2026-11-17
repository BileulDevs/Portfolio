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

## Langues

Anglais par défaut, français au choix, avec le module `@nuxtjs/i18n`. La langue n'apparaît jamais dans l'URL (une seule URL par page : `/`, `/projects/<slug>`) : le bouton EN / FR du header change la langue sur place et la retient dans un cookie `lang` (1 an), réappliqué à la visite suivante (`src/composables/useLanguage.ts`, `src/plugins/language.client.ts`). Pas de détection selon la langue du navigateur.

Les pages sont pré-générées en anglais : un visiteur qui a choisi le français voit la page passer en français juste après le chargement.

**Tous les textes sont dans `i18n/i18n.config.ts`** : l'interface (menu, boutons, libellés, accessibilité) comme le contenu (projets, parcours, profil, stack). `fr` est typé sur `en` : une clé oubliée dans une langue est une erreur de type. Attention, vue-i18n réserve `{ } @ $ |` dans les messages : écrire `{'@'}` pour un @.

`src/data/` ne garde que ce qui ne se traduit pas (slugs, stacks, liens, thèmes, nœuds des schémas), et `useContent()` assemble les deux dans la langue courante.

## Structure

```
src/
├── app.vue                coque : header, curseur, barre de progression, toasts, <NuxtPage>
├── error.vue              page 404
├── pages/                 index.vue (accueil), projects/[slug].vue (étude de cas)
├── components/            auto-importés par nom de fichier (pas besoin d'import)
│   ├── ui/                briques réutilisables : BlobLink (CTA rond), PillNav (← nom →), ProjectArt (visuel généré)
│   ├── layout/            SiteHeader + MenuOverlay, SiteFooter, ScrollProgress, ToastHost, CursorDot
│   ├── home/              une section = un composant (Hero, Manifesto, Stack, Projects, Experience, Contact)
│   │                      + leurs morceaux : SkillWord, LevelLegend, ExperienceItem, EducationList, ContactLinks, ContactForm
│   ├── project/           étude de cas : ProjectCase (assemble ProjectHero, ProjectCover, ProjectFacts, ProjectStory
│   │                      + ProjectBlock, ArchitectureDiagram, ProjectNext, ProjectDock) et ProjectModal
│   └── carousel/          CurvedCarousel (Three.js) + CarouselTrack (repli natif) + CarouselHud, threeParts (imports Three)
├── data/                  structure du contenu (ce qui ne se traduit pas) ; les textes sont dans i18n/i18n.config.ts
│   ├── types.ts           types partagés
│   ├── profile.ts         identité, liens, formation, chiffres clés
│   ├── stack.ts           technos par domaine + niveau (3 production / 2 solide / 1 notions)
│   ├── projects.ts        projets (carrousel + pages projet)
│   └── experience.ts      parcours
├── composables/           useContent (contenu dans la langue courante), useMedia (reduced motion, pointeur), useScrollProgress, useInView, useToast, useClipboard,
│                          useProjectModal (ouvrir la modale projet depuis n'importe où)
├── directives/            v-reveal (apparition au scroll), v-magnetic (boutons aimantés)
├── plugins/directives.ts  enregistre v-reveal et v-magnetic
├── utils/projectArt.ts    dessin des visuels génératifs (en attendant les vraies captures)
├── router.options.ts      défilement vers les ancres après la transition de page
└── styles/
    ├── main.css           tokens (palette, typos, easing) et styles globaux
    └── themes/            un fichier par thème de projet (minecraft, noxtys, azure)
```

Conventions :
- un composant = un fichier court, avec ses styles `scoped` ; la taille et la position d'un composant `ui/` viennent du parent (classe sur la racine).
- WebGL et curseur ne s'affichent que dans le navigateur : ils sont enveloppés dans `<ClientOnly>` là où ils sont utilisés.
- les données restent dans `data/`, les composants les reçoivent en props ou les importent directement.

## Ajouter un projet

1. Ajouter un objet dans `src/data/projects.ts` (le `slug` devient l'URL), puis ses textes sous `projects.<slug>` dans les deux langues de `i18n/i18n.config.ts`.
2. Optionnel : déposer des images dans `public/projects/<slug>/` et renseigner `cover` et `gallery`.
   Sans `cover`, un visuel est généré selon `art` (`rings`, `voxels`, `monitor`).

Le carrousel, la page projet, la navigation précédent / suivant et le titre de l'onglet suivent automatiquement.

## Modale projet et thèmes

Cliquer un projet dans le carrousel ouvre son étude de cas en modale, comme une app qui se lance sur iPhone : l'étude de cas est déjà là, réduite, à l'intérieur du panneau cliqué, et cette « fenêtre » s'agrandit jusqu'au plein écran (0,9 s, départ doux et longue arrivée, coins arrondis pendant le vol). Une copie identique au panneau (l'« icône ») s'efface dans les premiers instants ; derrière, la page zoome légèrement et s'assombrit. À la fermeture, la fenêtre se rétracte dans le panneau (0,65 s), depuis l'endroit où on avait défilé, et dans le panneau du projet affiché : si on a changé de projet avec les flèches, le carrousel s'est placé dessus. Même comportement sur mobile (vérifié à 375 et 320 px de large). Sur écran tactile, depuis le haut de l'étude de cas, on peut aussi tirer vers le bas pour fermer, comme pour quitter une app sur iPhone : la fenêtre suit le doigt en rétrécissant ; relâchée assez loin (140 px) ou assez vite, elle se referme depuis là, sinon elle revient en place. La modale vit dans l'URL (`/?projet=<slug>`) : le bouton retour du navigateur la ferme, le lien se partage, `Échap` ou ✕ la ferment. Les pages projet (`/projects/<slug>`) restent disponibles (liens directs, référencement) et affichent le même contenu.

Chaque projet peut avoir un thème (`theme` dans `src/data/projects.ts`), appliqué à la modale comme à la page :

- **minecraft** (Mods Minecraft) : police pixel, bloc d'herbe et de terre, panneaux biseautés et boutons en pierre façon interface du jeu.
- **noxtys** (Noxtys) : reprend le design de noxtys.com — ciel étoilé, dégradés violets, cartes en verre dépoli, Space Grotesk, Instrument Sans et JetBrains Mono.
- **azure** (Athlon Car Lease) : style portail Azure / Fluent, fil d'Ariane, cartes blanches sur fond gris, bleu Azure, Segoe UI.

Ajouter un thème : l'ajouter au type `ProjectTheme` (`src/data/types.ts`), créer `src/styles/themes/<nom>.css` sur le modèle de `minecraft.css` (redéfinir les tokens, puis cibler les éléments sous `:root .case[data-theme="<nom>"]`) et l'ajouter à `css` dans `nuxt.config.ts`.

## Le carrousel des projets

Il s'inspire de mathiasadolfsson.dev : des panneaux posés sur un cylindre, qui se courbent davantage et séparent leurs canaux RVB quand ils bougent, puis se stabilisent sur le projet centré.

- **Contrôles** : glisser (souris ou doigt), molette horizontale / trackpad, `Maj + molette`, flèches, clavier (`←` `→` `Entrée`). Clic au centre : ouvre le projet en modale. Clic sur un côté : le centre.
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
| **Noxtys** | Période « janv. – oct. 2026 » reprise du CV. Il manque une phrase qui dit *ce que fait* le produit pour l'utilisateur. |
| **LinkedIn** | Absent du CV, donc absent du site. Il suffit de l'ajouter dans `profile.links`. |
| **Téléphone** | Volontairement non affiché (spam). |
| **Visuels** | Générés par code : à remplacer par de vraies captures ou de courtes vidéos. |
| **Niveaux de stack** | Déduits du CV (« Notions » → niveau 1). À ajuster dans `stack.ts`. |
