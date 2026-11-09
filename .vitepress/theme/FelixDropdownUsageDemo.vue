<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
const open=ref(false),root=ref<HTMLElement|null>(null),trigger=ref<HTMLButtonElement|null>(null),result=ref('Fictitious local actions. Nothing is sent or saved.')
async function close(restore=true){open.value=false;if(restore){await nextTick();trigger.value?.focus()}}
function pick(action:string){result.value=`${action} selected locally. No record changed.`;close()}
function outside(e:PointerEvent){if(open.value&&!root.value?.contains(e.target as Node))close(false)}
onMounted(()=>document.addEventListener('pointerdown',outside));onBeforeUnmount(()=>document.removeEventListener('pointerdown',outside))
</script>
<template><section class="dropdown-usage fg-demo" aria-label="Dropdown usage demonstration"><div ref="root" @keydown.esc.stop.prevent="close()"><button ref="trigger" type="button" class="fg-btn fg-secondary" aria-controls="guide-dropdown-actions" :aria-expanded="open" @click="open=!open">Sample actions <span aria-hidden="true">⌄</span></button><div v-if="open" id="guide-dropdown-actions" class="action-panel"><strong>Local sample</strong><button type="button" @click="pick('Preview')">Preview sample</button><button type="button" @click="pick('Duplicate')">Duplicate sample</button><hr><button type="button" disabled>Unavailable action</button></div></div><p role="status">{{result}}</p></section></template>
<style scoped>
.dropdown-usage{padding:20px;border:1px solid var(--vp-c-divider);border-radius:12px;margin:20px 0;min-height:330px}.action-panel{display:grid;gap:6px;margin-top:8px;padding:12px;max-width:280px;border:1px solid var(--vp-c-divider);border-radius:8px;background:var(--vp-c-bg-soft)}button{min-height:44px}.action-panel button{text-align:left;padding:8px;border-radius:6px;transition:background-color 120ms ease}.action-panel button:hover{background:var(--vp-c-brand-soft)}button:disabled{opacity:.5;cursor:not-allowed}hr{margin:3px 0}:focus-visible{outline:3px solid var(--vp-c-brand-1);outline-offset:3px}@media(prefers-reduced-motion:reduce){.action-panel button{transition:none}}

/* Local Felix guide classes, not an installed component API. */
:global(.felix-dark) .fg-demo{--fg-danger:#fda4af}
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
