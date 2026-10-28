<script setup lang="ts">
import { ref, useId } from 'vue'
const name = useId()
const selected = ref('weekly')
const options = [
  { value: 'weekly', title: 'Weekly summary', description: 'One local example summary per week.', disabled: false },
  { value: 'daily', title: 'Daily summary', description: 'One local example summary per day.', disabled: false },
  { value: 'instant', title: 'Instant updates', description: 'Unavailable in this example.', disabled: true }
]
function reset() { selected.value = 'weekly' }
</script>
<template>
<section class="choice-demo" aria-label="Choice card example">
<fieldset><legend>Summary frequency</legend><p>Choose one. This changes only the local example, not notification settings.</p>
<div class="choice-grid"><label v-for="option in options" :key="option.value" class="choice-option" :class="{selected:selected===option.value, unavailable:option.disabled}"><input v-model="selected" type="radio" :name="name" :value="option.value" :disabled="option.disabled"><span><strong>{{ option.title }}</strong><span class="choice-description">{{ option.description }}</span><span v-if="selected===option.value" class="choice-marker">Selected</span><span v-if="option.disabled" class="choice-marker">Unavailable</span></span></label></div>
</fieldset><p role="status">Local value: {{ selected }}. Nothing saved or sent.</p><button type="button" @click="reset">Reset to weekly</button>
</section>
</template>
<style scoped>
.choice-demo{border:1px solid var(--vp-c-divider);border-radius:14px;padding:20px;margin:20px 0}.choice-demo fieldset{border:0;padding:0;margin:0;min-width:0}.choice-demo legend{font-weight:650}.choice-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:12px}.choice-option{display:flex;align-items:flex-start;gap:10px;padding:16px;border:1px solid var(--vp-c-divider);border-radius:10px;background:var(--vp-c-bg-soft);cursor:pointer;transition:border-color .16s,background .16s,transform .16s}.choice-option input{margin-top:5px;accent-color:var(--vp-c-brand-1);flex:none}.choice-option.selected{border-color:var(--vp-c-brand-1);background:var(--vp-c-brand-soft)}.choice-option:focus-within{outline:2px solid var(--vp-c-brand-1);outline-offset:3px}.choice-option:not(.unavailable):active{transform:translateY(1px)}.choice-option.unavailable{opacity:.65;cursor:not-allowed}.choice-description,.choice-marker{display:block;overflow-wrap:anywhere}.choice-description{font-size:14px;line-height:1.6;margin-top:6px}.choice-marker{font-size:12px;font-weight:650;margin-top:8px;animation:choice-enter .16s ease-out}.choice-demo button{border:1px solid var(--vp-c-divider);border-radius:8px;padding:8px 12px;background:var(--vp-c-bg-soft)}.choice-demo button:focus-visible{outline:2px solid var(--vp-c-brand-1);outline-offset:3px}@keyframes choice-enter{from{opacity:0;transform:translateY(2px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.choice-option{transition:none}.choice-marker{animation:none}.choice-option:not(.unavailable):active{transform:none}}
</style>
