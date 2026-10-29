<script setup lang="ts">
import { computed, ref } from 'vue'
const size=ref('md')
const state=ref('idle')
const runs=ref(0)
const busy=computed(()=>state.value==='loading')
const status=computed(()=>({idle:'Ready. No lookup has started.',loading:'Looking up the fictitious local record. Choose an outcome below.',success:'Local example found a fictitious record.',error:'Local example failed. Retry is available.',cancelled:'Local lookup example cancelled.'})[state.value])
function start(){if(busy.value)return;runs.value++;state.value='loading'}
function finish(outcome:string){if(!busy.value)return;state.value=outcome}
function reset(){state.value='idle';runs.value=0;size.value='md'}
</script>
<template>
<section class="dots-demo" aria-label="Inline dots lifecycle example">
<label>Dot size<select v-model="size"><option value="sm">Small (4px)</option><option value="md">Medium (6px)</option><option value="lg">Large (8px)</option></select></label>
<p>Local manual lookup. No request is sent and no hidden timer finishes it.</p>
<div class="dots-inline"><button type="button" class="dots-start" :disabled="busy" @click="start"><span>{{ busy?'Looking up':state==='error'?'Retry lookup':'Look up example' }}</span><span v-if="busy" class="dots-indicator" :class="size" aria-hidden="true"><i></i><i></i><i></i></span></button><span>Accepted starts: {{ runs }}</span></div>
<p role="status" aria-atomic="true">{{ status }}</p>
<div class="dots-result" :aria-busy="busy">{{ state==='success'?'Example record: SAMPLE-001 (fictitious)':busy?'Waiting for your outcome choice':'No result to show' }}</div>
<div class="dots-actions"><button type="button" :disabled="!busy" @click="finish('success')">Finish lookup</button><button type="button" :disabled="!busy" @click="finish('error')">Fail lookup</button><button type="button" :disabled="!busy" @click="finish('cancelled')">Cancel lookup</button><button type="button" @click="reset">Reset example</button></div>
</section>
</template>
<style scoped>
.dots-demo{border:1px solid var(--vp-c-divider);border-radius:14px;padding:20px;margin:20px 0}.dots-demo label{display:grid;gap:6px;font-weight:600;max-width:250px}.dots-demo select{font:inherit;color:inherit;background:var(--vp-c-bg-soft);border:1px solid var(--vp-c-divider);padding:8px;border-radius:8px;width:100%}.dots-inline{display:flex;align-items:center;flex-wrap:wrap;gap:12px}.dots-demo button{border:1px solid var(--vp-c-divider);border-radius:8px;padding:8px 12px;background:var(--vp-c-bg-soft)}.dots-start{display:inline-flex;align-items:center;justify-content:center;gap:12px;min-width:175px;min-height:44px}.dots-indicator{display:inline-flex;align-items:center;gap:4px;flex:none}.dots-indicator i{display:block;width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.4;animation:dots-pulse 1s ease-in-out infinite}.dots-indicator.sm i{width:4px;height:4px}.dots-indicator.lg i{width:8px;height:8px}.dots-indicator i:nth-child(2){animation-delay:.15s}.dots-indicator i:nth-child(3){animation-delay:.3s}.dots-result{padding:16px;margin-bottom:16px;background:var(--vp-c-bg-soft);border-radius:10px;overflow-wrap:anywhere}.dots-actions{display:flex;flex-wrap:wrap;gap:8px}.dots-demo button:disabled{cursor:not-allowed}.dots-start:disabled{color:var(--vp-c-text-1)}.dots-actions button:disabled{opacity:.5}.dots-demo button:focus-visible,.dots-demo select:focus-visible{outline:2px solid var(--vp-c-brand-1);outline-offset:3px}@keyframes dots-pulse{50%{opacity:1}}@media(prefers-reduced-motion:reduce){.dots-indicator i{animation:none;opacity:1}}
</style>
