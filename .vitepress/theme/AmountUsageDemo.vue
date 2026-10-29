<script setup lang="ts">
import { ref, computed } from 'vue'
const minor=ref(20000)
const currency=ref<'USD'|'CLP'>('USD')
const locale=ref('en-US')
const scale=computed(()=>currency.value==='USD'?100:1)
const formatted=computed(()=>new Intl.NumberFormat(locale.value,{style:'currency',currency:currency.value}).format(minor.value/scale.value))
function change(delta:number){minor.value=Math.max(0,Math.min(1000000,minor.value+delta))}
function reset(){minor.value=20000;currency.value='USD';locale.value='en-US'}
</script>
<template>
<section class="amount-demo" aria-label="Illustrative amount formatting"><p>Illustrative local value. Not a balance, quote, exchange rate or payment.</p><div class="amount-controls"><label>Currency interpretation <select v-model="currency"><option value="USD">USD (minor unit 0.01)</option><option value="CLP">CLP (minor unit 1)</option></select></label><label>Display locale <select v-model="locale"><option value="en-US">en-US</option><option value="es-CL">es-CL</option></select></label></div><p class="amount-value"><span :key="formatted">{{ formatted }}</span><small>{{ currency }}</small></p><p>Raw minor units: {{ minor }}. Divisor: {{ scale }}. Currency switch reinterprets the same integer; it does not convert money.</p><div class="amount-actions"><button type="button" :disabled="minor===0" @click="change(-2500)">Subtract 2500 minor units</button><button type="button" :disabled="minor===1000000" @click="change(2500)">Add 2500 minor units</button><button type="button" @click="reset">Reset example</button></div><p role="status">Local example: {{ formatted }} {{ currency }}.</p></section>
</template>
<style scoped>
.amount-demo{border:1px solid var(--vp-c-divider);border-radius:14px;padding:20px;margin:20px 0;overflow-wrap:anywhere}.amount-controls{display:flex;gap:14px;flex-wrap:wrap}.amount-controls label{display:grid;gap:6px;min-width:0;max-width:100%}.amount-demo select{font:inherit;color:inherit;border:1px solid var(--vp-c-divider);border-radius:8px;padding:8px;background:var(--vp-c-bg-soft);max-width:100%}.amount-value{font-size:clamp(30px,6vw,48px);font-weight:700;font-variant-numeric:tabular-nums;line-height:1.3}.amount-value span{display:inline-block;animation:amount-in .18s ease-out}.amount-value small{font-size:14px;margin-left:10px}.amount-actions{display:flex;flex-wrap:wrap;gap:8px}.amount-demo button{border:1px solid var(--vp-c-divider);border-radius:8px;padding:8px 12px;background:var(--vp-c-bg-soft)}.amount-demo button:disabled{opacity:.45;cursor:not-allowed}.amount-demo button:focus-visible,.amount-demo select:focus-visible{outline:2px solid var(--vp-c-brand-1);outline-offset:3px}@keyframes amount-in{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.amount-value span{animation:none}}
</style>
