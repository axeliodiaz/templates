<script setup lang="ts">
import { nextTick, ref } from 'vue'
const tabs = [{id:'overview',label:'Overview',text:'Fictitious overview panel.'},{id:'activity',label:'Activity',text:'Fictitious activity panel.'},{id:'settings',label:'Settings',text:'Fictitious settings panel.'}]
const selected = ref('overview'), vertical = ref(false)
async function key(e: KeyboardEvent) {
 const i=tabs.findIndex(t=>t.id===selected.value)
 const forward=vertical.value?'ArrowDown':'ArrowRight',back=vertical.value?'ArrowUp':'ArrowLeft'
 let n=i
 if(e.key===forward)n=(i+1)%tabs.length
 else if(e.key===back)n=(i+tabs.length-1)%tabs.length
 else if(e.key==='Home')n=0
 else if(e.key==='End')n=tabs.length-1
 else return
 e.preventDefault();selected.value=tabs[n].id;await nextTick();document.getElementById('guide-tab-'+selected.value)?.focus()
}
</script>
<template><section class="tabs-usage l-demo" aria-label="Tabs usage demonstration">
 <label class="orientation"><input type="checkbox" v-model="vertical">Vertical tabs</label>
 <div class="tabs-layout" :class="{vertical}"><div role="tablist" aria-label="Fictitious workspace" :aria-orientation="vertical?'vertical':'horizontal'" @keydown="key"><button v-for="tab in tabs" :key="tab.id" type="button" role="tab" :id="'guide-tab-'+tab.id" :aria-controls="'guide-panel-'+tab.id" :aria-selected="selected===tab.id" :tabindex="selected===tab.id?0:-1" @click="selected=tab.id">{{tab.label}}</button></div><section v-for="tab in tabs" :key="tab.id" v-show="selected===tab.id" role="tabpanel" tabindex="0" :id="'guide-panel-'+tab.id" :aria-labelledby="'guide-tab-'+tab.id"><h3>{{tab.label}}</h3><p>{{tab.text}} Nothing is sent or saved.</p></section></div>
</section></template>
<style scoped>
.tabs-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0 } .orientation { display:flex; align-items:center; gap:10px; min-height:44px; margin-bottom:14px } [role=tablist] { display:flex; flex-wrap:wrap; gap:6px } [role=tab] { padding:10px; min-height:44px; border:1px solid var(--vp-c-divider); border-radius:8px; transition:background-color 120ms ease } [aria-selected=true] { background:var(--vp-c-brand-soft); color:var(--vp-c-brand-1); font-weight:600 } [role=tabpanel] { padding:16px; border:1px solid var(--vp-c-divider); border-radius:8px; margin-top:10px; min-width:0 } .vertical { display:grid; grid-template-columns:110px minmax(0,1fr); gap:10px } .vertical [role=tablist] { flex-direction:column; align-self:start } .vertical [role=tabpanel] { margin-top:0 } h3 { margin:0 } :focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px } @media(max-width:420px) { .vertical { grid-template-columns:90px minmax(0,1fr) } .vertical [role=tabpanel] { padding:10px } } @media(prefers-reduced-motion:reduce) { [role=tab] { transition:none } }
</style>
