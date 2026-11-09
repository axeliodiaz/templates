<script setup lang="ts">
import { computed, ref } from 'vue'
const size=ref('md')
const state=ref('idle')
const runs=ref(0)
const busy=computed(()=>state.value==='loading')
const status=computed(()=>({idle:'Ready for a fictitious local wait.',loading:'Waiting for the local example. No transfer is running.',success:'Local example finished. No money moved.',error:'Local example failed. Retry or reset is available.',cancelled:'Local example cancelled. No transfer occurred.'})[state.value])
function start(){if(busy.value)return;runs.value++;state.value='loading'}
function finish(outcome:string){if(!busy.value)return;state.value=outcome}
function reset(){state.value='idle';size.value='md';runs.value=0}
</script>
<template>
<section class="coin-demo" aria-label="Coin loader lifecycle example">
<label>Coin size<select v-model="size"><option value="sm">Small (24px)</option><option value="md">Medium (36px)</option><option value="lg">Large (56px)</option></select></label>
<p>Fictitious manual wait. Choose an outcome; there is no timer, request or financial operation.</p>
<div class="coin-result" :aria-busy="busy"><span v-if="busy" class="coin-symbol" :class="size" aria-hidden="true"></span><span>{{ busy ? 'Waiting for your outcome choice' : 'No active wait' }}</span></div>
<p role="status" aria-atomic="true">{{ status }}</p>
<div class="coin-actions"><button type="button" :disabled="busy" @click="start">{{ state==='error'?'Retry example':'Start example' }}</button><button type="button" :disabled="!busy" @click="finish('success')">Finish example</button><button type="button" :disabled="!busy" @click="finish('error')">Fail example</button><button type="button" :disabled="!busy" @click="finish('cancelled')">Cancel example</button><button type="button" @click="reset">Reset example</button></div>
<p>Accepted local starts: {{ runs }}. The coin is indeterminate, not a percentage.</p>
</section>
</template>
<style scoped>
.coin-demo{border:1px solid var(--vp-c-divider);border-radius:14px;padding:20px;margin:20px 0}.coin-demo label{display:grid;gap:6px;font-weight:600;max-width:250px}.coin-demo select{font:inherit;color:inherit;background:var(--vp-c-bg-soft);border:1px solid var(--vp-c-divider);padding:8px;border-radius:8px;width:100%}.coin-result{display:flex;align-items:center;gap:16px;min-height:92px;padding:16px;background:var(--vp-c-bg-soft);border-radius:12px}.coin-symbol{flex:none;display:block;width:36px;height:36px;box-sizing:border-box;border-radius:50%;border:3px double var(--vp-c-brand-1);background:radial-gradient(circle at 30% 30%,var(--vp-c-bg),var(--vp-c-brand-soft));animation:coin-turn 1.2s linear infinite}.coin-symbol.sm{width:24px;height:24px}.coin-symbol.lg{width:56px;height:56px}.coin-actions{display:flex;flex-wrap:wrap;gap:8px}.coin-demo button{border:1px solid var(--vp-c-divider);border-radius:8px;padding:8px 12px;background:var(--vp-c-bg-soft)}.coin-demo button:disabled{opacity:.5;cursor:not-allowed}.coin-demo button:focus-visible,.coin-demo select:focus-visible{outline:2px solid var(--vp-c-brand-1);outline-offset:3px}@keyframes coin-turn{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.coin-symbol{animation:none}}
</style>
