# Cosmos — Portfolio immersif de Bilel Sahraoui

Un portfolio one-page conçu comme un **voyage spatial cinématique** : le scroll
pilote un vaisseau qui traverse huit environnements cosmiques, chacun racontant
une facette du parcours de Bilel — de la Terre (présentation) à une nouvelle
galaxie (contact), en passant par le système solaire (compétences), une nébuleuse
(parcours), un trou de ver (transition), des exoplanètes (projets), un champ
d'astéroïdes (réalisations) et un trou noir (vision).

Stack : **Nuxt 4 · Vue 3 (Composition API) · TypeScript · Three.js · GSAP +
ScrollTrigger · Lenis · shaders GLSL · post-processing (bloom)**.

---

## Démarrage

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

Autres commandes :

```bash
npm run build       # build de production (SSR / Node)
npm run generate    # site statique (si tu préfères un hébergement statique)
npm run preview     # prévisualise le build
npm run typecheck   # vérification TypeScript (optionnelle)
```

> Node 18.18+ ou 20+ recommandé (requis par Nuxt 4).

---

## Ce qui est livré

- **Moteur 3D complet et autonome** (`app/three/`) : rendu WebGL, caméra pilotée
  par le scroll, boucle de rendu lissée, post-processing bloom, et **tous les
  corps célestes générés procéduralement par shaders** (aucune texture externe) :
  étoiles GPU, Terre + atmosphère, Soleil + couronne, Mars/Jupiter/Saturne (avec
  anneaux), nébuleuse volumétrique, tunnel de trou de ver, exoplanètes, champ
  d'astéroïdes en `InstancedMesh`, trou noir (disque d'accrétion + anneau de
  photons + asymétrie Doppler), et galaxie spirale.
- **Voyage scrollytelling synchronisé** : une timeline GSAP scrubbée par
  ScrollTrigger interpole la caméra entre huit « stations », avec une enveloppe
  de *warp* au passage du trou de ver. Scroll fluide via Lenis.
- **Contenu rendu côté serveur (SSR)** : tout le texte du CV est dans le HTML →
  indexable par Google et lisible même sans WebGL (amélioration progressive).
- **HUD de mission** : cadre de télémétrie persistant (chapitre, position,
  trajectoire) — l'élément signature de l'interface.
- **SEO** : meta + Open Graph + Twitter Card, données structurées JSON-LD
  (`schema.org/Person`), `sitemap.xml` (route serveur) et `robots.txt`.
- **Performance adaptative** : détection d'un palier de qualité (low/medium/high)
  qui ajuste densité de particules, bloom, segments de sphères et `pixelRatio`.
- **Accessibilité** : respect de `prefers-reduced-motion` (scroll natif, pas
  d'envol cinématique, contenu révélé immédiatement) et focus visibles.

---

## Structure des dossiers

```
cosmos-portfolio/
├─ app/
│  ├─ app.vue                     # assemblage + orchestration au montage
│  ├─ assets/css/main.css         # design system (tokens, typo, panneaux, HUD)
│  ├─ data/profile.ts             # ★ TOUT le contenu du CV (à éditer)
│  ├─ components/
│  │  ├─ SpaceExperience.client.vue   # monte le moteur Three (client only)
│  │  ├─ boot/IntroSequence.vue       # écran de lancement + compte à rebours
│  │  ├─ hud/MissionHud.vue           # HUD de télémétrie
│  │  └─ chapters/ChapterLayer.vue    # les 8 sections de contenu (SSR)
│  ├─ composables/
│  │  └─ useScrollJourney.ts      # Lenis + ScrollTrigger + timeline caméra
│  └─ three/
│     ├─ Experience.ts            # hub moteur : renderer, caméra, bloom, RAF
│     ├─ journeyState.ts          # état partagé (pont scroll ↔ 3D)
│     ├─ core/                    # Sizes, Clock, Quality (palier de perf)
│     ├─ camera/stations.ts       # ★ positions des corps + trajectoire caméra
│     ├─ shaders/                 # GLSL : bruit, étoiles, planètes, soleil,
│     │                           #        nébuleuse, trou noir, trou de ver, galaxie
│     └─ world/                   # objets : Starfield, Planet, Sun, Nebula,
│                                 #          Wormhole, AsteroidField, BlackHole,
│                                 #          Galaxy + World (assemblage)
├─ server/routes/sitemap.xml.ts   # sitemap (Nitro)
├─ public/                        # favicon, robots.txt, (og-image, CV à déposer)
└─ nuxt.config.ts
```

> Le `★` marque les deux fichiers à toucher en priorité pour personnaliser.

---

## Architecture (en deux couches découplées)

1. **Le moteur Three** (`app/three/`) est *agnostique* du framework. Il ne connaît
   pas Vue. À chaque frame, il **lit** un objet d'état partagé `camProxy`
   (position/visée de caméra + intensité de warp) et met à jour la scène.
2. **La couche scroll** (`useScrollJourney`) **écrit** dans ce même `camProxy`
   via une timeline GSAP pilotée par le scroll. Le HUD lit un petit état réactif
   `journeyHud` (progression, index de chapitre).

`camProxy` est un objet JS *simple* (pas de réactivité Vue) : GSAP l'anime à
60 fps et Three le lit directement, sans surcharge du système de réactivité.

```
scroll ──> Lenis ──> ScrollTrigger ──(scrub)──> timeline GSAP ──> camProxy
                                                                     │
                                                          (lecture par frame)
                                                                     ▼
                                                              Experience (Three)
```

---

## Personnaliser le contenu

- **Textes, compétences, projets, métriques, contact** : tout est dans
  `app/data/profile.ts`. Édite ce fichier — les composants se mettent à jour seuls.
- **Liens à remplacer** dans `profile.ts` : `github`, `portfolio`, `cv`.
- **Domaine** : dans `nuxt.config.ts` (constante `SITE.url`) et `public/robots.txt`.

## Personnaliser le voyage 3D

- **Positions des planètes et trajectoire caméra** : `app/three/camera/stations.ts`.
  `WORLD` définit où se trouve chaque corps ; `STATIONS` définit la position et le
  point visé de la caméra pour chaque chapitre. Les deux partagent les mêmes
  coordonnées, donc tout reste synchronisé.
- **Couleurs / type d'une planète** : dans `app/three/world/World.ts`, chaque appel
  `addPlanet({...})` accepte `type` (0 tellurique, 1 gazeuse, 2 rocheuse), les trois
  couleurs de palette, une `atmosphere` et un `ring` optionnels.
- **Ajouter une texture ou une HDRI** (optionnel) : le projet est volontairement
  100 % procédural pour rester léger et sans dépendance d'assets. Pour utiliser une
  texture, charge-la avec `TextureLoader` dans le composant `world/` concerné et
  remplace l'échantillonnage procédural du fragment shader par un `texture2D`.

## Performance

- Le palier est détecté dans `app/three/core/Quality.ts` (UA, cœurs CPU, mémoire).
  Ajuste les chiffres par palier si besoin (densité particules, bloom, segments).
- `pixelRatio` est plafonné (2 max, moins sur mobile) pour limiter la charge GPU.
- Le champ d'astéroïdes utilise un `InstancedMesh` (un seul draw call).
- La boucle se met en pause quand l'onglet passe en arrière-plan.

## À déposer avant mise en ligne

Voir `public/ASSETS-A-REMPLACER.txt` :

- `public/og-image.jpg` (1200×630) — image de partage social.
- `public/cv-bilel-sahraoui.pdf` — le CV téléchargeable.

---

Conçu pour être **lancé immédiatement** (`npm install && npm run dev`) puis
étendu sereinement : le contenu vit dans un seul fichier de données, le 3D dans
un moteur clairement séparé.
