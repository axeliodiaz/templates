<script setup>
import {ref} from 'vue'
import TickProgress from './TickProgress.vue'
const percent=ref(31)
</script>
<template><section class="tick-demo" aria-label="Workflow-OPS tick progress examples"><p>Fictitious capacity data. Sixty separate ticks use the Workflow-OPS shape; text retains the exact value.</p><label>Sample capacity used: {{percent}}%<input v-model.number="percent" type="range" min="0" max="100"></label><TickProgress :value="percent" label="Sample capacity used" color="#3b82f6"/><p>Small value: 0.23% used</p><TickProgress :value=".23" label="Small sample capacity: 0.23% used" color="#d97706"/><p>Unknown amount: unavailable, not 0%</p><TickProgress :value="null" label="Sample capacity unavailable"/></section></template>
<style scoped>.tick-demo{border:1px solid var(--vp-c-divider);border-radius:12px;padding:20px;margin:20px 0}.tick-demo input{display:block;width:100%;margin:12px 0}.tick-demo p{margin-top:20px}</style>
