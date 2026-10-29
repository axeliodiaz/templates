<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
const viewport=ref<HTMLElement|null>(null)
const draft=ref('')
const items=ref(Array.from({length:8},(_,i)=>({id:i+1,text:`Fictitious history entry ${i+1}. Local content only.`,fresh:false})))
const nearBottom=ref(true)
const unseen=ref(0)
const status=ref('Eight fictitious local history entries. Nothing sent.')
let serial=8
function measure(){const e=viewport.value;if(e){nearBottom.value=e.scrollHeight-e.scrollTop-e.clientHeight<24;if(nearBottom.value)unseen.value=0}}
async function bottom(){await nextTick();const e=viewport.value;if(e)e.scrollTop=e.scrollHeight;nearBottom.value=true;unseen.value=0}
async function append(){const value=draft.value.trim();if(!value)return;const follow=nearBottom.value;items.value.push({id:++serial,text:value,fresh:true});draft.value='';status.value='Added one local entry. Nothing transmitted.';await nextTick();if(follow)await bottom();else{unseen.value++;measure()}}
function empty(){items.value=[];unseen.value=0;nearBottom.value=true;status.value='Local thread cleared. No remote messages deleted.'}
async function reset(){serial=8;items.value=Array.from({length:8},(_,i)=>({id:i+1,text:`Fictitious history entry ${i+1}. Local content only.`,fresh:false}));draft.value='';status.value='Eight fictitious local history entries. Nothing sent.';await bottom()}
onMounted(bottom)
</script>
<template>
<section class="scroller-demo" aria-label="Message scroller example"><header><h3>Fictitious local thread</h3><p>No recipient, delivery state or server connection.</p></header><div ref="viewport" class="scroller-viewport" tabindex="0" role="region" aria-label="Local message history" @scroll="measure"><p v-if="!items.length">No local entries. Add a fictitious entry below.</p><ol v-else><li v-for="item in items" :key="item.id" :class="{fresh:item.fresh}"><small>Example entry {{ item.id }}</small><p>{{ item.text }}</p></li></ol></div><button v-if="!nearBottom" type="button" class="scroller-bottom" @click="bottom">Jump to bottom{{ unseen?' ('+unseen+' new local entry)':'' }}</button><form @submit.prevent="append"><label>Local draft<input v-model="draft" type="text" maxlength="240"></label><button type="submit" :disabled="!draft.trim()">Add local entry</button></form><div class="scroller-actions"><button type="button" @click="empty">Show empty state</button><button type="button" @click="reset">Reset example</button></div><p role="status" aria-atomic="true">{{ status }} {{ unseen?unseen+' new local entry below.':'' }}</p></section>
</template>
<style scoped>
.scroller-demo{border:1px solid var(--vp-c-divider);border-radius:14px;padding:20px;margin:20px 0}.scroller-demo h3{margin:0}.scroller-demo header p{font-size:14px;color:var(--vp-c-text-2)}.scroller-viewport{height:260px;overflow-y:auto;border:1px solid var(--vp-c-divider);background:var(--vp-c-bg-soft);border-radius:10px;padding:12px;overflow-anchor:none;scroll-behavior:auto!important}.scroller-viewport ol{list-style:none;padding:0;margin:0}.scroller-viewport li{border:1px solid var(--vp-c-divider);border-radius:12px;padding:10px;margin:0 0 12px;overflow-wrap:anywhere}.scroller-viewport li p{margin:4px 0 0;white-space:pre-wrap}.scroller-viewport small{color:var(--vp-c-text-2)}.scroller-demo form{display:flex;flex-wrap:wrap;align-items:end;gap:8px;margin:16px 0}.scroller-demo label{display:grid;gap:6px;font-weight:600;flex:1;min-width:180px}.scroller-demo input{font:inherit;color:inherit;background:var(--vp-c-bg-soft);border:1px solid var(--vp-c-divider);padding:8px;border-radius:8px;width:100%;box-sizing:border-box}.scroller-demo button{border:1px solid var(--vp-c-divider);border-radius:8px;padding:8px 12px;background:var(--vp-c-bg-soft)}.scroller-demo button:disabled{opacity:.5;cursor:not-allowed}.scroller-actions{display:flex;flex-wrap:wrap;gap:8px}.scroller-bottom{margin-top:10px}.scroller-demo button:focus-visible,.scroller-demo input:focus-visible,.scroller-viewport:focus-visible{outline:2px solid var(--vp-c-brand-1);outline-offset:3px}.scroller-viewport li.fresh{animation:scroller-entry .18s ease-out}@keyframes scroller-entry{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.scroller-viewport li.fresh{animation:none}}
</style>
