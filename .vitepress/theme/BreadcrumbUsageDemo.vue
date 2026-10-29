<script setup lang="ts">
import { ref } from 'vue'
const separator=ref('/')
const items=[{label:'Templates',href:'/'},{label:'Lustro',href:'/lustro'},{label:'Breadcrumb guide',href:null}]
</script>
<template><section class="breadcrumb-usage l-demo" aria-label="Breadcrumb usage demonstration">
 <label for="breadcrumb-separator">Decorative separator</label><select id="breadcrumb-separator" v-model="separator"><option value="/">Slash</option><option value="›">Chevron</option><option value="·">Dot</option></select>
 <nav aria-label="Guide breadcrumb"><ol><li v-for="(item,i) in items" :key="item.label"><span v-if="i" aria-hidden="true" class="separator">{{separator}}</span><a v-if="item.href" :href="item.href">{{item.label}}</a><span v-else aria-current="page">{{item.label}}</span></li></ol></nav><p>Links navigate to real documentation pages. Changing the separator is local; no data is saved.</p>
</section></template>
<style scoped>
.breadcrumb-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0 } label { display:block; font-weight:600; margin-bottom:8px } select { padding:10px; min-height:44px; width:100%; background:var(--vp-c-bg-soft); color:inherit; border:1px solid var(--vp-c-divider); border-radius:8px } ol { display:flex; flex-wrap:wrap; list-style:none; gap:0; padding:0!important; margin:18px 0!important } li { display:flex; align-items:baseline; min-width:0; margin:0!important; max-width:100% } a,[aria-current] { padding:10px 0; overflow-wrap:anywhere; min-height:44px } a { transition:color 120ms ease } .separator { padding:10px; color:var(--vp-c-text-2) } [aria-current] { font-weight:600 } :focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px } @media(prefers-reduced-motion:reduce) { a { transition:none } }
</style>
