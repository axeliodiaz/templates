<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
const open=ref(false),root=ref<HTMLElement|null>(null),trigger=ref<HTMLButtonElement|null>(null),result=ref('Fictitious local actions. Nothing is sent or saved.')
async function close(restore=true){open.value=false;if(restore){await nextTick();trigger.value?.focus()}}
function pick(action:string){result.value=`${action} selected locally. No record changed.`;close()}
function outside(e:PointerEvent){if(open.value&&!root.value?.contains(e.target as Node))close(false)}
onMounted(()=>document.addEventListener('pointerdown',outside));onBeforeUnmount(()=>document.removeEventListener('pointerdown',outside))
</script>
<template><section class="dropdown-usage l-demo" aria-label="Dropdown usage demonstration"><div ref="root" @keydown.esc.stop.prevent="close()"><button ref="trigger" type="button" class="l-btn l-secondary" aria-controls="guide-dropdown-actions" :aria-expanded="open" @click="open=!open">Sample actions <span aria-hidden="true">⌄</span></button><div v-if="open" id="guide-dropdown-actions" class="action-panel"><strong>Local sample</strong><button type="button" @click="pick('Preview')">Preview sample</button><button type="button" @click="pick('Duplicate')">Duplicate sample</button><hr><button type="button" disabled>Unavailable action</button></div></div><p role="status">{{result}}</p></section></template>
<style scoped>
.dropdown-usage{padding:20px;border:1px solid var(--vp-c-divider);border-radius:12px;margin:20px 0;min-height:330px}.action-panel{display:grid;gap:6px;margin-top:8px;padding:12px;max-width:280px;border:1px solid var(--vp-c-divider);border-radius:8px;background:var(--vp-c-bg-soft)}button{min-height:44px}.action-panel button{text-align:left;padding:8px;border-radius:6px;transition:background-color 120ms ease}.action-panel button:hover{background:var(--vp-c-brand-soft)}button:disabled{opacity:.5;cursor:not-allowed}hr{margin:3px 0}:focus-visible{outline:3px solid var(--vp-c-brand-1);outline-offset:3px}@media(prefers-reduced-motion:reduce){.action-panel button{transition:none}}
</style>
