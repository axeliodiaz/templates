<script setup lang="ts">
import { ref } from 'vue'
const value = ref(40), disabled = ref(false)
</script>
<template><section class="range-usage fg-demo" aria-label="Range usage demonstration">
 <label for="guide-range">Fictitious threshold: {{ value }}%</label><input id="guide-range" v-model.number="value" type="range" min="10" max="90" step="5" :disabled="disabled" aria-describedby="guide-range-help"><small id="guide-range-help">10 to 90 percent in steps of 5. Local preview only.</small>
 <label class="choice"><input type="checkbox" v-model="disabled">Disable sample slider</label><button type="button" class="fg-btn fg-secondary" @click="value=40;disabled=false">Reset sample range</button><p>Current local value: {{ value }}%. Nothing is saved.</p>
</section></template>
<style scoped>
.range-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0; display:grid; gap:14px } label { font-weight:600 } input[type=range] { width:100%; min-width:0; min-height:44px; accent-color:var(--vp-c-brand-1); transition:opacity 120ms ease } input:disabled { opacity:.5 } .choice { display:flex; align-items:center; gap:10px; min-height:44px } button { min-height:44px; justify-self:start } :focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px } @media(prefers-reduced-motion:reduce) { input[type=range] { transition:none } }

/* Local Felix guide classes, not an installed component API. */
:global(.felix-dark) .fg-demo{--fg-danger:#fda4af}
.fg-demo{--fg-danger:#a91c38;background:var(--vp-c-bg);color:var(--vp-c-text-1)}
.fg-btn,.fg-icon-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 14px;min-height:44px;border:1px solid var(--vp-c-divider);border-radius:10px;font:inherit;color:var(--vp-c-text-1);background:var(--vp-c-bg-soft);cursor:pointer}
.fg-primary{background:var(--vp-c-brand-1);border-color:var(--vp-c-brand-1);color:var(--vp-c-bg)}
.fg-quiet{background:transparent;border-color:transparent}.fg-danger{border-color:var(--fg-danger);color:var(--fg-danger);background:transparent}
.fg-btn:disabled{opacity:.5;cursor:not-allowed}.fg-btn:hover:not(:disabled){box-shadow:inset 0 0 0 1px currentColor}.fg-btn:focus-visible,.fg-icon-btn:focus-visible{outline:3px solid var(--vp-c-brand-1);outline-offset:3px}
.fg-actions{display:flex;gap:10px;flex-wrap:wrap}.fg-segment button{border:1px solid var(--vp-c-divider);border-radius:8px;background:var(--vp-c-bg-soft)}.fg-segment button.is-active{background:var(--vp-c-brand-soft);color:var(--vp-c-brand-1)}
.fg-badge{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--vp-c-divider);border-radius:99px;padding:3px 8px;background:var(--vp-c-bg-soft);color:var(--vp-c-text-1);font-size:12px;line-height:1.5}
.fg-badge-success,.fg-alert-success{background:var(--vp-c-brand-soft);color:var(--vp-c-text-1);border-color:var(--vp-c-brand-1)}
.fg-badge-warn,.fg-alert-warn{background:var(--vp-c-warning-soft);color:var(--vp-c-text-1);border-color:var(--vp-c-warning-1)}
.fg-badge-error{background:var(--vp-c-danger-soft);color:var(--fg-danger);border-color:var(--fg-danger)}
.fg-alert{padding:16px;border:1px solid var(--vp-c-divider);border-radius:10px;background:var(--vp-c-bg-soft);color:var(--vp-c-text-1)}
.fg-menu{border:1px solid var(--vp-c-divider);border-radius:10px;padding:8px;background:var(--vp-c-bg)}
:is(input[type=range],input[type=checkbox],input[type=radio]){accent-color:var(--vp-c-brand-1)}

.fg-alert.fg-alert-success{border-color:var(--vp-c-brand-1);background:var(--vp-c-brand-soft)}
.fg-alert.fg-alert-warn{border-color:var(--vp-c-warning-1);background:var(--vp-c-warning-soft)}
</style>
