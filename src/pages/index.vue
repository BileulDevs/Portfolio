<script setup lang="ts">
definePageMeta({ name: "home" });
</script>

<template>
  <div>
    <main id="main">
      <HeroSection />
      <ManifestoSection />
      <StackSection />
      <ProjectsSection />
      <ExperienceSection />
      <PassionsSection />
      <ContactSection />
    </main>
    <SiteFooter />
    <ProjectModal />
  </div>
</template>
