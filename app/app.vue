<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useScrollJourney } from '~/composables/useScrollJourney'
import { personSchema } from '~/data/profile'
import SpaceExperience from '~/components/SpaceExperience.vue'

const showIntro = ref(true)
const config = useRuntimeConfig()
const journey = useScrollJourney()

// Données structurées (SEO) — rendu côté serveur dans le <head>.
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(personSchema(config.public.siteUrl as string)),
    },
  ],
})

function onEngage() {
  journey.start()
  // retire l'overlay une fois le fondu terminé
  setTimeout(() => (showIntro.value = false), 1300)
}

function onReturn() {
  journey.scrollToTop()
}

onMounted(() => {
  journey.setup()
})

onBeforeUnmount(() => {
  journey.destroy()
})
</script>

<template>
  <div>
    <!-- couche 3D (client only) -->
    <ClientOnly>
      <SpaceExperience />
    </ClientOnly>

    <!-- HUD de mission persistant -->
    <MissionHud />

    <!-- contenu / chapitres (SSR, indexable) -->
    <ChapterLayer />

    <!-- bouton de retour au début (apparaît à la toute fin) -->
    <ReturnToStart @return="onReturn" />

    <!-- séquence d'introduction -->
    <IntroSequence v-if="showIntro" @engage="onEngage" />
  </div>
</template>
