<script setup lang="ts">
import { profile } from "@/data/profile";
</script>

<template>
  <section id="contact" class="band contact" data-header="dark" aria-labelledby="contact-t">
    <h2 id="contact-t">{{ $t("contact.titleBefore") }} <em>{{ $t("contact.titleEm") }}</em>{{ $t("contact.titleAfter") }}</h2>
    <div class="grid">
      <BlobLink class="blob" tone="dark" :to="`mailto:${profile.email}`" :cursor="$t('cursor.write')">
        {{ $t("contact.ctaLine1") }}<br />{{ $t("contact.ctaLine2") }}
      </BlobLink>
      <ContactLinks />
    </div>
    <ContactForm />
  </section>
</template>

<style scoped>
.contact { background: var(--coral); color: var(--ink); overflow: hidden; }
h2 { margin: 0; font-size: clamp(64px, 13vw, 230px); font-weight: 800; letter-spacing: -.075em; line-height: .8; }
h2 em { font-weight: 200; font-style: italic; }
.grid { display: grid; grid-template-columns: auto 1fr; gap: clamp(28px, 5vw, 80px); align-items: center; margin-top: clamp(32px, 5vw, 64px); }
.blob { width: clamp(150px, 16vw, 220px); height: clamp(150px, 16vw, 220px); font-size: 18px; }
@media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
</style>
