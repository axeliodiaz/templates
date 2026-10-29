<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
const state=ref<'failed'|'pending'|'loaded'>('failed')
const succeeds=ref(true)
const attempts=ref(0)
let timer: ReturnType<typeof setTimeout> | undefined
function retry() { if(state.value==='pending')return; const outcome=succeeds.value; attempts.value++;state.value='pending';timer=setTimeout(()=>{state.value=outcome?'loaded':'failed';timer=undefined},700) }
function reset() { if(timer)clearTimeout(timer);timer=undefined;state.value='failed';attempts.value=0 }
onBeforeUnmount(()=>{if(timer)clearTimeout(timer)})
</script>
<template>
<section class="error-demo" aria-label="Simulated error recovery"><p>Local simulation only. No request, connection check or data save occurs.</p><label><input v-model="succeeds" type="checkbox" :disabled="state==='pending'"> Next attempt succeeds (simulation)</label><div class="error-panel" :aria-busy="state==='pending'"><div :key="state" class="error-state"><h3>{{ state==='failed'?'Could not load example items':state==='pending'?'Trying local simulation':'Example items loaded locally' }}</h3><p>{{ state==='failed'?'The example has no loaded items. Adjust the simulated result and retry.':state==='pending'?'Wait for the 700ms demo timer. No remote request is running.':'The local simulation succeeded. This does not prove a network connection was restored.' }}</p><ul v-if="state==='loaded'"><li>Fictitious item A</li><li>Fictitious item B</li></ul></div><div class="error-actions"><button type="button" :disabled="state==='pending'||state==='loaded'" @click="retry">{{ state==='pending'?'Trying…':'Try local retry' }}</button><button type="button" @click="reset">Reset simulation</button></div></div><p role="status">{{ state==='pending'?'Local retry pending.':state==='loaded'?'Local simulation complete.':'Local simulation failed.' }} Attempts: {{ attempts }}.</p></section>
</template>
<style scoped>
.error-demo{border:1px solid var(--vp-c-divider);border-radius:14px;padding:20px;margin:20px 0}.error-demo label{display:flex;gap:8px;align-items:center}.error-panel{margin-top:16px;border:1px solid var(--vp-c-divider);border-radius:10px;padding:16px;background:var(--vp-c-bg-soft)}.error-demo h3{margin-top:0}.error-state{animation:error-in .18s ease-out;overflow-wrap:anywhere}.error-actions{display:flex;gap:8px;flex-wrap:wrap}.error-demo button{border:1px solid var(--vp-c-divider);border-radius:8px;padding:8px 12px;background:var(--vp-c-bg)}.error-demo button:disabled{opacity:.5;cursor:not-allowed}.error-demo button:focus-visible,.error-demo input:focus-visible{outline:2px solid var(--vp-c-brand-1);outline-offset:3px}.error-demo [role=status]{min-height:1.5em}@keyframes error-in{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.error-state{animation:none}}
</style>
