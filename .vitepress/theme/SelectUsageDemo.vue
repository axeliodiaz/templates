<script setup lang="ts">
import { ref } from 'vue'
const options = [{ value:'weekly',label:'Weekly sample' },{value:'monthly',label:'Monthly sample'},{value:'yearly',label:'Yearly sample',disabled:true}]
const selected = ref(''), size = ref('default'), suggestion = ref(''), result = ref('Fictitious local choices. Nothing is saved.')
function submit() { result.value = `Local choice: ${selected.value}. Suggestion text: ${suggestion.value || '(empty)'}. No request sent.` }
</script>
<template>
 <section class="select-usage l-demo" aria-label="Select usage demonstration"><form @submit.prevent="submit">
  <label for="select-size">Visual size</label><select id="select-size" v-model="size"><option value="small">Small</option><option value="default">Default</option><option value="large">Large</option></select>
  <label for="select-interval">Sample interval (required)</label><select id="select-interval" v-model="selected" required :class="size" aria-describedby="select-help"><option disabled value="">Choose an interval</option><option v-for="option in options" :key="option.value" :value="option.value" :disabled="option.disabled">{{ option.label }}</option></select><small id="select-help">Yearly is unavailable in this fictitious example.</small>
  <label for="select-suggestion">Sample tag (optional suggestions)</label><input id="select-suggestion" v-model="suggestion" list="select-tags" aria-describedby="select-suggestion-help"><datalist id="select-tags"><option value="Design sample"/><option value="Review sample"/><option value="Draft sample"/></datalist><small id="select-suggestion-help">Suggestions allow other text. This is not a restricted select.</small>
  <label for="select-disabled">Unavailable select</label><select id="select-disabled" disabled><option>Unavailable example</option></select>
  <div class="l-actions"><button class="l-btn l-primary" type="submit">Use local choice</button></div>
 </form><p role="status">{{ result }}</p></section>
</template>
<style scoped>
.select-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0 } form { display:grid; gap:10px } label { font-weight:600; margin-top:10px } select,input { min-width:0; width:100%; min-height:44px; padding:10px; background:var(--vp-c-bg-soft); color:inherit; font:inherit; border:1px solid var(--vp-c-divider); border-radius:8px; transition:border-color 120ms ease } select.small { font-size:14px; padding:8px } select.large { font-size:18px; padding:14px } select:disabled { opacity:.55; cursor:not-allowed } button { min-height:44px } :focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px } @media(prefers-reduced-motion:reduce) { select,input { transition:none } }
</style>
