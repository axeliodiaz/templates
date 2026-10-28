<script setup lang="ts">
import { ref } from 'vue'
const username = ref('sample'), amount = ref('24.00'), query = ref('')
const size = ref('default'), result = ref('Fictitious local values. Nothing is sent or saved.')
function search() { result.value = query.value.trim() ? `Local search sample: ${query.value.trim()}. No request sent.` : 'Enter a fictitious search term first.' }
</script>
<template>
 <section class="input-group-usage l-demo" aria-label="Input group usage demonstration">
  <label for="ig-size">Group size</label><select id="ig-size" v-model="size"><option value="small">Small</option><option value="default">Default</option><option value="large">Large</option></select>
  <label for="ig-username">Sample username</label>
  <div class="ig-row" :class="size"><span aria-hidden="true" class="addon">@</span><input id="ig-username" v-model="username" aria-describedby="ig-username-help"></div>
  <small id="ig-username-help">Username without the @ prefix. Fictitious values only.</small>
  <label for="ig-amount">Sample amount in USD</label>
  <div class="ig-row" :class="size"><span class="addon" aria-hidden="true">$</span><input id="ig-amount" v-model="amount" inputmode="decimal" aria-describedby="ig-amount-help"><span class="addon" aria-hidden="true">USD</span></div>
  <small id="ig-amount-help">Visual prefix and suffix do not validate or convert currency.</small>
  <form @submit.prevent="search"><label for="ig-search">Fictitious search</label><div class="ig-row" :class="size"><input id="ig-search" v-model="query" maxlength="80"><button type="submit">Search locally</button></div></form>
  <label for="ig-disabled">Unavailable sample</label><div class="ig-row"><span class="addon" aria-hidden="true">@</span><input id="ig-disabled" disabled value="Unavailable"></div>
  <p role="status">{{ result }}</p>
 </section>
</template>
<style scoped>
.input-group-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0; display:grid; gap:9px }
label { display:block; font-weight:600; margin-top:10px } .ig-row { display:flex; min-width:0; border:1px solid var(--vp-c-divider); border-radius:8px; overflow:visible; transition:border-color 120ms ease; background:var(--vp-c-bg-soft) }
.ig-row:focus-within { border-color:var(--vp-c-brand-1) } input { min-width:0; width:100%; flex:1; background:transparent; color:inherit; padding:10px; font:inherit; border:0; border-radius:8px }
select { padding:10px; background:var(--vp-c-bg-soft); color:inherit; border:1px solid var(--vp-c-divider); border-radius:8px; min-height:44px }
.addon { padding:10px; display:flex; align-items:center; color:var(--vp-c-text-2) } button { padding:10px; border-left:1px solid var(--vp-c-divider); color:var(--vp-c-brand-1); font-weight:600; flex-shrink:0 }
input,button { min-height:44px } .small { font-size:14px } .small input,.small .addon { padding:8px } .large { font-size:18px } .large input,.large .addon { padding:14px } input:disabled { opacity:.55; cursor:not-allowed }
:focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:2px } @media(max-width:420px) { form .ig-row { flex-wrap:wrap } form button { flex-basis:100%; border-left:0; border-top:1px solid var(--vp-c-divider) } }
@media(prefers-reduced-motion:reduce) { .ig-row { transition:none } }
</style>
