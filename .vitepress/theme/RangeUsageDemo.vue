<script setup lang="ts">
import { ref } from 'vue'
const value = ref(40), disabled = ref(false)
</script>
<template><section class="range-usage l-demo" aria-label="Range usage demonstration">
 <label for="guide-range">Fictitious threshold: {{ value }}%</label><input id="guide-range" v-model.number="value" type="range" min="10" max="90" step="5" :disabled="disabled" aria-describedby="guide-range-help"><small id="guide-range-help">10 to 90 percent in steps of 5. Local preview only.</small>
 <label class="choice"><input type="checkbox" v-model="disabled">Disable sample slider</label><button type="button" class="l-btn l-secondary" @click="value=40;disabled=false">Reset sample range</button><p>Current local value: {{ value }}%. Nothing is saved.</p>
</section></template>
<style scoped>
.range-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0; display:grid; gap:14px } label { font-weight:600 } input[type=range] { width:100%; min-width:0; min-height:44px; accent-color:var(--vp-c-brand-1); transition:opacity 120ms ease } input:disabled { opacity:.5 } .choice { display:flex; align-items:center; gap:10px; min-height:44px } button { min-height:44px; justify-self:start } :focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px } @media(prefers-reduced-motion:reduce) { input[type=range] { transition:none } }
</style>
