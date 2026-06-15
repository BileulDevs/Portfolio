<script setup lang="ts">
import {
  identity, competences, parcours, projets, realisations, vision, contact,
} from '~/data/profile'
</script>

<template>
  <div class="journey">
    <!-- ░░ CHAPITRE 1 — TERRE : origine ░░ -->
    <section id="earth" class="chapter chapter--top">
      <div class="chapter__inner">
        <div class="panel reveal">
          <p class="eyebrow">Chapitre 01 — Origine</p>
          <h1 class="hero-name">{{ identity.name }}</h1>
          <p class="hero-role">{{ identity.role }}</p>
          <p class="meta-row">{{ identity.stack }} · {{ identity.location }}</p>
          <p class="hero-slogan">{{ identity.slogan }}</p>
          <div class="cta-row">
            <a class="btn btn--primary" :href="`mailto:${identity.email}`">Me contacter</a>
            <a class="btn" :href="identity.cv" download>Télécharger le CV</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ░░ CHAPITRE 2 — SYSTÈME SOLAIRE : compétences ░░ -->
    <section id="system" class="chapter">
      <div class="chapter__inner">
        <div class="panel panel--right panel--lg reveal">
          <p class="eyebrow">Chapitre 02 — Compétences</p>
          <h2 class="section-title">Un système de compétences</h2>
          <p class="lead">Chaque corps céleste concentre un domaine de mon expertise.</p>
          <div class="skill-grid">
            <article v-for="p in competences" :key="p.id" class="skill">
              <h3>{{ p.name }}</h3>
              <p class="skill__domain">{{ p.domain }}</p>
              <div class="tags">
                <span v-for="it in p.items" :key="it" class="tag">{{ it }}</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- ░░ CHAPITRE 3 — NÉBULEUSE : parcours ░░ -->
    <section id="nebula" class="chapter">
      <div class="chapter__inner">
        <div class="panel panel--lg reveal">
          <p class="eyebrow">Chapitre 03 — Parcours</p>
          <h2 class="section-title">Là où tout s'est condensé</h2>
          <div class="cards">
            <article v-for="(job, i) in parcours" :key="i" class="card">
              <h3>{{ job.title }}</h3>
              <p class="meta-row">{{ job.org }} · {{ job.period }}</p>
              <ul class="bullets">
                <li v-for="(pt, j) in job.points" :key="j">{{ pt }}</li>
              </ul>
            </article>
          </div>
                  <div class="diplomas">
          <div v-for="(d, i) in realisations.diplomas" :key="i" class="diploma">
            <strong>{{ d.title }}</strong>
            <span class="meta-row">{{ d.org }}<template v-if="d.period"> · {{ d.period }}</template></span>
          </div>
        </div>
        </div>
      </div>
    </section>

    <!-- ░░ CHAPITRE 4 — TROU DE VER : transition ░░ -->
    <section id="wormhole" class="chapter chapter--wide">
      <div class="chapter__inner">
        <div class="panel panel--center reveal">
          <p class="eyebrow" style="justify-content:center">Chapitre 04 — Transition</p>
          <h2 class="section-title">Pliage de l'espace-temps</h2>
          <p class="lead" style="margin-inline:auto">
            Un raccourci entre ce que j'ai construit et ce que je construis. Maintenez le cap.
          </p>
        </div>
      </div>
    </section>

    <!-- ░░ CHAPITRE 5 — EXOPLANÈTES : projets ░░ -->
    <section id="exoplanets" class="chapter">
      <div class="chapter__inner">
        <div class="panel panel--right panel--lg reveal">
          <p class="eyebrow">Chapitre 05 — Projets</p>
          <h2 class="section-title">Des mondes que j'ai bâtis</h2>
          <div class="cards">
            <article v-for="p in projets" :key="p.id" class="card">
              <h3>{{ p.name }}</h3>
              <p class="meta-row">{{ p.tagline }}</p>
              <p>{{ p.description }}</p>
              <div class="tags">
                <span v-for="t in p.stack" :key="t" class="tag">{{ t }}</span>
              </div>
              <p v-if="p.link" style="margin-top:0.8rem">
                <a :href="p.link.url" target="_blank" rel="noopener">{{ p.link.label }} →</a>
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- ░░ CHAPITRE 6 — CHAMP D'ASTÉROÏDES : réalisations ░░ -->
    <section id="asteroids" class="chapter">
      <div class="chapter__inner">
        <div class="panel panel--lg reveal">
          <p class="eyebrow">Chapitre 06 — Réalisations</p>
          <h2 class="section-title">Impacts mesurés</h2>
          <div class="metrics">
            <div v-for="(m, i) in realisations.metrics" :key="i" class="metric">
              <span class="n">{{ m.n }}</span>
              <span class="l">{{ m.l }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ░░ CHAPITRE 7 — TROU NOIR : vision ░░ -->
    <section id="blackhole" class="chapter">
      <div class="chapter__inner">
        <div class="panel panel--right reveal">
          <p class="eyebrow">Chapitre 07 — Vision</p>
          <h2 class="section-title">{{ vision.title }}</h2>
          <p v-for="(para, i) in vision.paragraphs" :key="i" class="lead">{{ para }}</p>
        </div>
      </div>
    </section>

    <!-- ░░ CHAPITRE 8 — NOUVELLE GALAXIE : contact ░░ -->
    <section id="galaxy" class="chapter chapter--wide">
      <div class="chapter__inner">
        <div class="panel panel--center panel--lg reveal">
          <p class="eyebrow" style="justify-content:center">Chapitre 08 — Contact</p>
          <h2 class="section-title">{{ contact.headline }}</h2>
          <p class="lead" style="margin-inline:auto">{{ contact.subline }}</p>
          <div class="cta-row" style="justify-content:center">
            <a class="btn btn--primary" :href="`mailto:${identity.email}`">{{ identity.email }}</a>
            <a class="btn" :href="`tel:${identity.phone.replace(/\s/g, '')}`">{{ identity.phone }}</a>
            <a class="btn" :href="identity.github" target="_blank" rel="noopener">GitHub</a>
            <a class="btn" :href="identity.cv" download>CV (PDF)</a>
          </div>
          <p class="meta-row" style="margin-top:1.6rem">{{ identity.location }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1px;
  margin-top: 1.6rem;
  background: var(--panel-line);
}
.skill { background: var(--deep); padding: 1.2rem 1.3rem; }
.skill h3 { font-size: var(--step-1); }
.skill__domain {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--ember);
  letter-spacing: 0.08em;
  margin: 0.3rem 0 0.8rem;
}
.bullets { list-style: none; margin-top: 0.8rem; display: grid; gap: 0.6rem; }
.bullets li {
  position: relative;
  padding-left: 1.2rem;
  color: var(--text-dim);
  font-size: var(--step-0);
}
.bullets li::before {
  content: '';
  position: absolute;
  left: 0; top: 0.65em;
  width: 6px; height: 6px;
  background: var(--plasma);
  transform: rotate(45deg);
}
.diplomas { margin-top: 1.8rem; display: grid; gap: 0.9rem; }
.diploma { display: flex; flex-direction: column; gap: 0.2rem; }
.diploma strong { font-family: var(--font-display); font-weight: 500; color: var(--text); }
</style>
