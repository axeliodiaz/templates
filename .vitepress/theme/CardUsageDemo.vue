<script setup lang="ts">
import { ref } from 'vue'
const selected = ref(false), message = ref('No sample action yet.')
</script>
<template>
 <section class="card-usage l-demo" aria-label="Card usage demonstration">
  <article class="l-card">
   <header><span class="l-eyebrow">FICTITIOUS PROJECT · SAMPLE-024</span><h3>Review design tokens</h3><span class="l-badge l-badge-warn">Needs review</span></header>
   <p>Compare spacing and focus states before the sample release. This is a summary, not the full task.</p>
   <footer class="l-card-foot"><span>2 sample checks</span><button type="button" class="l-btn l-secondary" @click="message = 'Sample details opened locally. No navigation or request.'">Open sample details</button></footer>
  </article>
  <article class="l-card card-highlight" :class="{'card-selected':selected}">
   <header><h3>Highlighted sample</h3></header><p>A selected card still needs a semantic control. The surface itself is not a disguised button.</p>
   <button type="button" class="l-btn l-secondary" :aria-pressed="selected" @click="selected = !selected; message = selected ? 'Highlighted sample selected locally.' : 'Highlighted sample unselected locally.'">Select sample</button>
  </article>
  <p role="status">{{ message }}</p><small>All names and data are fictitious. No task, account or stored record changes.</small>
 </section>
</template>
<style scoped>
.card-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0 }
.card-usage .l-card { margin:0 0 18px; min-width:0 }
.card-usage .l-card-foot { display:flex; align-items:center; flex-wrap:wrap; gap:12px; justify-content:space-between }
.card-usage button { min-height:44px }
.card-usage :focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px }
.card-highlight { border:2px solid var(--vp-c-divider); transition:border-color 140ms ease }
.card-selected { border-color:var(--vp-c-brand-1) }
@media(prefers-reduced-motion:reduce) { .card-highlight { transition:none } }
</style>
