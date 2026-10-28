<script setup lang="ts">
import { ref, nextTick } from 'vue'
const step = ref(0)
const title = ref('')
const error = ref('')
const heading = ref<HTMLElement>()
const input = ref<HTMLInputElement>()
const labels = ['Details', 'Review', 'Done']
async function move(next: number) { step.value = next; error.value = ''; await nextTick(); heading.value?.focus() }
function forward() { if (step.value === 0 && !title.value.trim()) { error.value = 'Enter an example title before review.'; input.value?.focus(); return } if (step.value < 2) move(step.value + 1) }
function restart() { title.value = ''; move(0) }
</script>
<template>
<section class="step-demo" aria-label="Local stepper example">
<ol><li v-for="(label,index) in labels" :key="label" :aria-current="index===step?'step':undefined" :class="{current:index===step}"><span>{{ index+1 }}. {{ label }}</span><small>{{ index<step?'Passed':index===step?'Current':'Upcoming' }}</small></li></ol>
<div class="step-panel" :key="step"><h3 ref="heading" tabindex="-1">{{ labels[step] }}</h3>
<div v-if="step===0"><label>Example title <input ref="input" v-model="title" type="text" maxlength="120" required :aria-invalid="error?'true':undefined" @input="error=''" @keydown.enter.prevent="forward"></label><p>Required local example, maximum 120 characters. Nothing is sent.</p></div>
<p v-else-if="step===1">Review title: <strong>{{ title.trim() }}</strong>. Continue completes this local walkthrough only.</p>
<p v-else>Walkthrough complete for <strong>{{ title.trim() }}</strong>. No record was created or sent.</p>
</div><p role="alert">{{ error }}</p><div class="step-actions"><button type="button" :disabled="step===0" @click="move(step-1)">Back</button><button type="button" :disabled="step===2" @click="forward">{{ step===1?'Complete example':'Continue' }}</button><button type="button" @click="restart">Restart</button></div>
</section>
</template>
<style scoped>
.step-demo{border:1px solid var(--vp-c-divider);border-radius:14px;padding:20px;margin:20px 0}.step-demo ol{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:10px}.step-demo li{flex:1;min-width:100px;border:1px solid var(--vp-c-divider);border-radius:8px;padding:10px;transition:background .16s,border-color .16s}.step-demo li small{display:block}.step-demo li.current{border-color:var(--vp-c-brand-1);background:var(--vp-c-brand-soft)}.step-demo h3{margin-top:18px}.step-demo h3:focus{outline:2px solid var(--vp-c-brand-1);outline-offset:4px}.step-demo label{display:grid;gap:6px;font-weight:600}.step-demo input{font:inherit;color:inherit;background:var(--vp-c-bg-soft);border:1px solid var(--vp-c-divider);padding:10px;border-radius:8px;min-width:0;width:100%;box-sizing:border-box}.step-actions{display:flex;gap:8px;flex-wrap:wrap}.step-demo button{padding:8px 12px;border:1px solid var(--vp-c-divider);border-radius:8px;background:var(--vp-c-bg-soft)}.step-demo button:disabled{opacity:.45;cursor:not-allowed}.step-demo button:focus-visible,.step-demo input:focus-visible{outline:2px solid var(--vp-c-brand-1);outline-offset:3px}.step-panel{animation:step-in .18s ease-out;overflow-wrap:anywhere}.step-demo [role=alert]{color:var(--vp-c-danger-1);min-height:1.5em}@keyframes step-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.step-panel{animation:none}.step-demo li{transition:none}}
</style>
