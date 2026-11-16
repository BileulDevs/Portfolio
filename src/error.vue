<script setup lang="ts">
useHead({ title: "Page introuvable — Bilel Sahraoui" });
</script>

<template>
  <main id="main" class="nf">
    <p class="mono">Erreur 404</p>
    <h1>Rien <em>ici.</em></h1>
    <a href="/" class="back" @click.prevent="clearError({ redirect: '/' })">← Retour à l'accueil</a>
  </main>
</template>

<style scoped>
.nf { min-height: 100svh; display: grid; align-content: center; padding: var(--pad); }
h1 { margin: 8px 0 24px; font-size: clamp(64px, 14vw, 220px); font-weight: 800; letter-spacing: -.07em; line-height: .85; }
h1 em { font-weight: 200; }
.back { font-size: 20px; font-weight: 600; }
</style>
