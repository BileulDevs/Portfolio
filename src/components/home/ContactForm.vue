<script setup lang="ts">
import { reactive, ref } from "vue";
import { profile } from "@/data/profile";

/**
 * No backend in V1: the form validates, then opens the visitor's mail client with a
 * pre-filled message. Swapping in an API (Formspree, a Netlify function…) only touches submit().
 */
const form = reactive({ name: "", email: "", message: "" });
const note = ref("Ouvre votre messagerie avec le message prérempli.");
const formEl = ref<HTMLFormElement | null>(null);

function submit() {
  const el = formEl.value!;
  if (!el.checkValidity()) {
    note.value = "Il manque un champ, ou l'e-mail n'est pas valide.";
    el.querySelector<HTMLElement>(":invalid")?.focus();
    return;
  }
  const subject = encodeURIComponent(`Contact portfolio — ${form.name}`);
  const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
  window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  note.value = "Ouverture de votre messagerie…";
}
</script>

<template>
  <form ref="formEl" class="mini" novalidate aria-label="Message rapide" @submit.prevent="submit">
    <label>Nom<input v-model="form.name" name="name" autocomplete="name" required placeholder="Votre nom" /></label>
    <label>E-mail<input v-model="form.email" name="email" type="email" autocomplete="email" required placeholder="vous@exemple.fr" /></label>
    <label>Message<input v-model="form.message" name="message" required placeholder="Le poste, la mission, le projet…" /></label>
    <button type="submit">Envoyer</button>
    <p class="note" aria-live="polite">{{ note }}</p>
  </form>
</template>

<style scoped>
.mini { margin-top: clamp(40px, 6vw, 80px); display: grid; grid-template-columns: 1fr 1fr 2fr auto; gap: 12px; align-items: end; }
label { display: grid; gap: 4px; font-family: var(--mono); font-size: 11px; text-transform: uppercase; }
input { font: 500 17px/1.3 var(--display); background: transparent; border: 0; border-bottom: 2px solid var(--ink); color: var(--ink); padding: 8px 0; border-radius: 0; min-width: 0; }
input::placeholder { color: rgba(31, 38, 48, .7); }
input:focus { outline: none; border-bottom-color: var(--lav); }
button { border: 0; background: var(--ink); color: var(--lav); padding: 14px 22px; border-radius: 999px; cursor: pointer; font-weight: 600; }
button:hover { background: var(--lav); color: var(--ink); }
.note { grid-column: 1 / -1; margin: 0; font-size: 14px; }
@media (max-width: 900px) { .mini { grid-template-columns: 1fr; } }
</style>
