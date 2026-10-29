<script setup lang="ts">
import { ref } from 'vue'
const date = ref('2026-10-15')
const localTime = ref('')
const feedback = ref('')
function save() { feedback.value = `Local selection: ${date.value}${localTime.value ? `; local date/time ${localTime.value}` : ''}. Nothing booked or sent.` }
function clear() { date.value = ''; localTime.value = ''; feedback.value = '' }
function example() { date.value = '2026-10-15'; localTime.value = '2026-10-15T14:30'; feedback.value = '' }
</script>
<template>
<section class="date-demo" aria-label="Local date selection example">
<p>Example window: 1-31 October 2026. Date required; local date/time optional. No timezone or booking is implied.</p>
<form @submit.prevent="save">
<label>Date <input v-model="date" type="date" min="2026-10-01" max="2026-10-31" required @input="feedback = ''"></label>
<label>Local date and time <input v-model="localTime" type="datetime-local" min="2026-10-01T00:00" max="2026-10-31T23:59" @input="feedback = ''"></label>
<div class="date-actions"><button type="submit">Review selection</button><button type="button" @click="example">Use example</button><button type="button" @click="clear">Clear</button></div>
</form>
<dl><dt>Date value</dt><dd>{{ date || 'Empty' }}</dd><dt>Local date/time value</dt><dd>{{ localTime || 'Empty' }}</dd></dl>
<p class="date-result" role="status"><span v-if="feedback" :key="feedback">{{ feedback }}</span><span v-else>Not reviewed. Values stay in this demo.</span></p>
</section>
</template>
<style scoped>
.date-demo{border:1px solid var(--vp-c-divider);border-radius:14px;padding:20px;margin:20px 0}.date-demo form{display:grid;gap:14px}.date-demo label{display:grid;gap:6px;font-weight:600}.date-demo input{font:inherit;color:inherit;color-scheme:light dark;background:var(--vp-c-bg-soft);border:1px solid var(--vp-c-divider);padding:10px;border-radius:8px;width:100%;min-width:0;box-sizing:border-box}.date-actions{display:flex;flex-wrap:wrap;gap:8px}.date-demo button{border:1px solid var(--vp-c-divider);border-radius:8px;padding:8px 12px;background:var(--vp-c-bg-soft);transition:background .15s,transform .15s}.date-demo button:hover{background:var(--vp-c-default-soft)}.date-demo button:active{transform:translateY(1px)}.date-demo button:focus-visible,.date-demo input:focus-visible{outline:2px solid var(--vp-c-brand-1);outline-offset:3px}.date-demo dd{margin:0 0 8px;overflow-wrap:anywhere}.date-demo dt{font-weight:600}.date-result{min-height:3em;overflow-wrap:anywhere}.date-result span{display:block;animation:date-result .16s ease-out}@keyframes date-result{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.date-demo button{transition:none}.date-demo button:active{transform:none}.date-result span{animation:none}}
</style>
