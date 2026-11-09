<script setup lang="ts">
import { computed, ref } from 'vue'
const selected = ref(['design']), channel = ref('email'), enabled = ref(false)
const choices = [{value:'design',label:'Design sample'},{value:'review',label:'Review sample'}]
const all = computed(() => selected.value.length === choices.length)
const mixed = computed(() => selected.value.length > 0 && !all.value)
function toggleAll() { selected.value = all.value ? [] : choices.map(x=>x.value) }
</script>
<template>
 <section class="choice-usage fg-demo" aria-label="Choice controls usage demonstration">
  <fieldset><legend>Fictitious sample filters</legend><label><input type="checkbox" :checked="all" :indeterminate="mixed" @change="toggleAll">Select all sample filters</label><label v-for="choice in choices" :key="choice.value"><input type="checkbox" v-model="selected" :value="choice.value">{{ choice.label }}</label><label><input type="checkbox" disabled checked>Unavailable selected sample</label></fieldset>
  <fieldset><legend>Fictitious delivery channel</legend><label><input type="radio" name="guide-channel" v-model="channel" value="email">Email sample</label><label><input type="radio" name="guide-channel" v-model="channel" value="inbox">Inbox sample</label></fieldset>
  <button type="button" role="switch" :aria-checked="enabled" class="sample-switch" @click="enabled=!enabled"><span aria-hidden="true" class="track"><i :class="{on:enabled}"></i></span>Enable local sample alerts</button>
  <p role="status">{{ selected.length }} of 2 sample filters. Channel: {{ channel }}. Sample alerts: {{ enabled?'on':'off' }}. Nothing is sent or saved.</p>
 </section>
</template>
<style scoped>
.choice-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0 } fieldset { border:1px solid var(--vp-c-divider); border-radius:8px; padding:14px; margin-bottom:18px; min-width:0 } legend { font-weight:600; padding:0 6px } label { display:flex; align-items:center; gap:10px; min-height:44px } input { width:18px; height:18px; flex-shrink:0; accent-color:var(--vp-c-brand-1) } .sample-switch { display:flex; align-items:center; gap:12px; min-height:44px; text-align:left; border:1px solid var(--vp-c-divider); padding:10px; border-radius:8px; width:100% } .track { display:block; width:38px; height:22px; background:var(--vp-c-divider); border-radius:20px; padding:3px; flex-shrink:0 } .track i { display:block; width:16px; height:16px; background:var(--vp-c-text-1); border-radius:50%; transition:transform 120ms ease } .track i.on { transform:translateX(16px); background:var(--vp-c-brand-1) } :focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px } @media(prefers-reduced-motion:reduce) { .track i { transition:none } }

/* Local Felix guide classes, not an installed component API. */
:global(html.felix-dark .fg-demo){--fg-danger:#fda4af}
.fg-demo{--fg-danger:#a91c38;background:var(--vp-c-bg);color:var(--vp-c-text-1)}
.fg-btn,.fg-icon-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 14px;min-height:44px;border:1px solid var(--vp-c-divider);border-radius:10px;font:inherit;color:var(--vp-c-text-1);background:var(--vp-c-bg-soft);cursor:pointer}
.fg-primary{background:var(--vp-c-brand-1);border-color:var(--vp-c-brand-1);color:var(--vp-c-bg)}
.fg-quiet{background:transparent;border-color:transparent}.fg-danger{border-color:var(--fg-danger);color:var(--fg-danger);background:transparent}
.fg-btn:disabled{opacity:.5;cursor:not-allowed}.fg-btn:hover:not(:disabled){box-shadow:inset 0 0 0 1px currentColor}.fg-btn:focus-visible,.fg-icon-btn:focus-visible{outline:3px solid var(--vp-c-brand-1);outline-offset:3px}
.fg-actions{display:flex;gap:10px;flex-wrap:wrap}.fg-segment button{border:1px solid var(--vp-c-divider);border-radius:8px;background:var(--vp-c-bg-soft)}.fg-segment button.is-active{background:var(--vp-c-brand-soft);color:var(--vp-c-brand-1)}
.fg-badge{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--vp-c-divider);border-radius:99px;padding:3px 8px;background:var(--vp-c-bg-soft);color:var(--vp-c-text-1);font-size:12px;line-height:1.5}
.fg-badge-success,.fg-alert-success{background:var(--vp-c-brand-soft);color:var(--vp-c-text-1);border-color:var(--vp-c-brand-1)}
.fg-badge-warn,.fg-alert-warn{background:var(--vp-c-warning-soft);color:var(--vp-c-text-1);border-color:var(--vp-c-warning-1)}
.fg-badge-error{background:var(--vp-c-danger-soft);color:var(--fg-danger);border-color:var(--fg-danger)}
.fg-alert{padding:16px;border:1px solid var(--vp-c-divider);border-radius:10px;background:var(--vp-c-bg-soft);color:var(--vp-c-text-1)}
.fg-menu{border:1px solid var(--vp-c-divider);border-radius:10px;padding:8px;background:var(--vp-c-bg)}
:is(input[type=range],input[type=checkbox],input[type=radio]){accent-color:var(--vp-c-brand-1)}

.fg-alert.fg-alert-success{border-color:var(--vp-c-brand-1);background:var(--vp-c-brand-soft)}
.fg-alert.fg-alert-warn{border-color:var(--vp-c-warning-1);background:var(--vp-c-warning-soft)}
</style>
