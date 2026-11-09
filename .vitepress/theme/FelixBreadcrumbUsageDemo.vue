<script setup lang="ts">
import { ref } from 'vue'
const separator=ref('/')
const items=[{label:'Templates',href:'/'},{label:'Felix',href:'/felix'},{label:'Breadcrumb guide',href:null}]
</script>
<template><section class="breadcrumb-usage fg-demo" aria-label="Breadcrumb usage demonstration">
 <label for="breadcrumb-separator">Decorative separator</label><select id="breadcrumb-separator" v-model="separator"><option value="/">Slash</option><option value="›">Chevron</option><option value="·">Dot</option></select>
 <nav aria-label="Guide breadcrumb"><ol><li v-for="(item,i) in items" :key="item.label"><span v-if="i" aria-hidden="true" class="separator">{{separator}}</span><a v-if="item.href" :href="item.href">{{item.label}}</a><span v-else aria-current="page">{{item.label}}</span></li></ol></nav><p>Links navigate to real documentation pages. Changing the separator is local; no data is saved.</p>
</section></template>
<style scoped>
.breadcrumb-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0 } label { display:block; font-weight:600; margin-bottom:8px } select { padding:10px; min-height:44px; width:100%; background:var(--vp-c-bg-soft); color:inherit; border:1px solid var(--vp-c-divider); border-radius:8px } ol { display:flex; flex-wrap:wrap; list-style:none; gap:0; padding:0!important; margin:18px 0!important } li { display:flex; align-items:baseline; min-width:0; margin:0!important; max-width:100% } a,[aria-current] { padding:10px 0; overflow-wrap:anywhere; min-height:44px } a { transition:color 120ms ease } .separator { padding:10px; color:var(--vp-c-text-2) } [aria-current] { font-weight:600 } :focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px } @media(prefers-reduced-motion:reduce) { a { transition:none } }

/* Local Felix guide classes, not an installed component API. */
:global(html.felix-dark .fg-demo){--fg-danger:#fda4af}
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
