<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
const dialog=ref<HTMLDialogElement|null>(null), trigger=ref<HTMLButtonElement|null>(null), result=ref('Fictitious modal. No record changes.')
function show(){dialog.value?.showModal()}
function finish(confirmed=false){result.value=confirmed?'Confirmed local sample. No record changed.':'Sample dismissed. Nothing changed.';dialog.value?.close()}
function trap(e:KeyboardEvent){if(e.key!=='Tab')return;const items=[...dialog.value!.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
function closed(){trigger.value?.focus()}
function backdrop(e:MouseEvent){if(e.target===dialog.value){const r=dialog.value.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)finish()}}
onBeforeUnmount(()=>dialog.value?.close())
</script>
<template><section class="modal-usage fg-demo" aria-label="Modal usage demonstration"><button ref="trigger" type="button" class="fg-btn fg-secondary" @click="show">Open sample modal</button><p role="status">{{result}}</p><dialog ref="dialog" aria-labelledby="guide-modal-title" aria-describedby="guide-modal-description" @keydown="trap" @close="closed" @cancel="result='Sample dismissed with Escape. Nothing changed.'" @click="backdrop"><h2 id="guide-modal-title">Review fictitious action</h2><p id="guide-modal-description">This native modal contains focus while open. Confirm changes local feedback only. No record is saved or deleted.</p><div class="actions"><button autofocus type="button" @click="finish()">Cancel sample</button><button type="button" @click="finish(true)">Confirm local sample</button></div></dialog></section></template>
<style scoped>
.modal-usage{padding:20px;border:1px solid var(--vp-c-divider);border-radius:12px;margin:20px 0}dialog{width:min(520px,calc(100vw - 32px));max-height:calc(100dvh - 32px);overflow:auto;margin:auto;padding:24px;border:1px solid var(--vp-c-divider);border-radius:12px;background:var(--vp-c-bg);color:var(--vp-c-text-1)}dialog[open]{animation:modal-appear 120ms ease-out}dialog::backdrop{background:#0009}h2{margin-top:0!important;border:0!important}.actions{display:flex;flex-wrap:wrap;gap:10px}.actions button{padding:10px;border:1px solid var(--vp-c-divider);border-radius:8px}button{min-height:44px}:focus-visible{outline:3px solid var(--vp-c-brand-1);outline-offset:3px}@keyframes modal-appear{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){dialog[open]{animation:none}}

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
