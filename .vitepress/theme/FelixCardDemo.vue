<script setup lang="ts">
import { ref } from 'vue'
const selected = ref(false)
const message = ref('No sample action yet.')
</script>

<template>
  <section class="felix-card-demo" aria-label="Felix card demonstration">
    <article class="fx-card">
      <header>
        <span class="sample-label">FICTITIOUS TRANSFER</span>
        <h3 class="fx-card-title">Recipient summary</h3>
      </header>
      <p>Maria Sample · Bank ending in 1234</p>
      <p class="fx-amount">1,020<span>.00</span> <small>MXN</small></p>
      <footer>
        <span>Review before continuing</span>
        <button type="button" class="fx-btn fx-btn-primary" @click="message = 'Sample details opened locally. No transfer or request.'">Open sample details</button>
      </footer>
    </article>
    <article class="fx-card selectable" :class="{ selected }">
      <header><h3 class="fx-card-title">Saved recipient</h3></header>
      <p>A selected card still needs an explicit control. The card surface is not a button.</p>
      <button type="button" class="fx-btn fx-btn-line" :aria-pressed="selected" @click="selected = !selected; message = selected ? 'Sample recipient selected locally.' : 'Sample recipient unselected locally.'">Select sample recipient</button>
    </article>
    <p role="status">{{ message }}</p>
    <small>All names and values are fictitious. No transfer, account or stored record changes.</small>
  </section>
</template>

<style scoped>
.felix-card-demo { padding: 20px; border: 1px solid var(--vp-c-divider); border-radius: 16px; margin: 24px 0; }
.felix-card-demo .fx-card { margin: 0 0 20px; min-width: 0; max-width: 100%; box-shadow: none; background: var(--vp-c-bg-elv); color: var(--vp-c-text-1); border: 1px solid var(--vp-c-divider); }
.sample-label { font-size: 12px; font-weight: 700; letter-spacing: .07em; color: var(--vp-c-text-2); }
.felix-card-demo h3 { margin-top: 8px; }
.felix-card-demo footer { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; justify-content: space-between; }
.felix-card-demo button { min-height: 44px; max-width: 100%; white-space: normal; }
.felix-card-demo :focus-visible { outline: 3px solid var(--vp-c-brand-1); outline-offset: 4px; }
.felix-card-demo .selectable { border-width: 2px; }
.felix-card-demo .selected { border-color: var(--vp-c-brand-1); }
.felix-card-demo p, .felix-card-demo small { overflow-wrap: anywhere; }
@media (max-width: 400px) { .felix-card-demo { padding: 12px; } .felix-card-demo .fx-card { padding: 16px; } }
</style>
