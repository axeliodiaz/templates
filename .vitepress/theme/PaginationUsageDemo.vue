<script setup lang="ts">
import { computed, ref } from 'vue'
const records = Array.from({length:8},(_,i)=>({id:`sample-${i+1}`,label:`Fictitious record ${i+1}`}))
const page=ref(1), pageSize=3, pages=Math.ceil(records.length/pageSize)
const visible=computed(()=>records.slice((page.value-1)*pageSize,page.value*pageSize))
function go(n:number){page.value=Math.max(1,Math.min(pages,n))}
</script>
<template><section class="pagination-usage l-demo" aria-label="Pagination usage demonstration">
 <ul><li v-for="record in visible" :key="record.id">{{record.label}}</li></ul>
 <nav aria-label="Fictitious record pages"><button type="button" :disabled="page===1" @click="go(1)">First</button><button type="button" :disabled="page===1" @click="go(page-1)">Previous</button><button type="button" v-for="n in pages" :key="n" :aria-label="'Page '+n" :aria-current="page===n?'page':undefined" @click="go(n)">{{n}}</button><button type="button" :disabled="page===pages" @click="go(page+1)">Next</button><button type="button" :disabled="page===pages" @click="go(pages)">Last</button></nav>
 <p role="status">Page {{page}} of {{pages}}. Showing {{(page-1)*pageSize+1}} to {{Math.min(page*pageSize,records.length)}} of {{records.length}} fictitious records. Nothing is fetched or saved.</p>
</section></template>
<style scoped>
.pagination-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0 } ul { min-height:100px } nav { display:flex; flex-wrap:wrap; gap:8px } button { min-height:44px; min-width:44px; padding:10px; border:1px solid var(--vp-c-divider); border-radius:8px; transition:background-color 120ms ease } [aria-current=page] { color:var(--vp-c-brand-1); background:var(--vp-c-brand-soft); font-weight:600 } button:disabled { opacity:.5; cursor:not-allowed } :focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px } @media(prefers-reduced-motion:reduce) { button { transition:none } }
</style>
