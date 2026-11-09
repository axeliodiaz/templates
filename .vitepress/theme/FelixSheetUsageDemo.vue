<script setup lang="ts">
import {onBeforeUnmount,ref} from 'vue'
const sheet=ref<HTMLDialogElement|null>(null),opener=ref<HTMLButtonElement|null>(null),selected=ref('compact'),notice=ref('Fictitious local details. No request changes.')
function show(){sheet.value?.showModal()}
function close(){sheet.value?.close()}
function restore(){opener.value?.focus()}
function tab(e:KeyboardEvent){if(e.key!=='Tab')return;const a=[...sheet.value!.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];if(e.shiftKey&&document.activeElement===a[0]){e.preventDefault();a[a.length-1].focus()}else if(!e.shiftKey&&document.activeElement===a[a.length-1]){e.preventDefault();a[0].focus()}}
function inspect(){notice.value='Sample details acknowledged locally. Nothing saved.';close()}
onBeforeUnmount(close)
</script>
<template><section class="sheet-usage" aria-label="Sheet usage demonstration"><label>Sheet size<select v-model="selected"><option>compact</option><option>wide</option></select></label><button ref="opener" type="button" @click="show">Open sample sheet</button><p role="status">{{notice}}</p><dialog ref="sheet" :class="selected" aria-labelledby="sheet-guide-title" aria-describedby="sheet-guide-copy" @keydown="tab" @close="restore"><header><h2 id="sheet-guide-title">Fictitious transfer details</h2><button autofocus type="button" @click="close">Close sheet</button></header><p id="sheet-guide-copy">This is a review-only sheet, not a transfer confirmation. All amounts and destinations are fictitious.</p><dl><dt>Amount</dt><dd>$60.00 USD (sample)</dd><dt>Destination</dt><dd>Example recipient</dd><dt>Fee</dt><dd>$0.00 (sample)</dd></dl><footer><button type="button" @click="inspect">Acknowledge sample</button></footer></dialog></section></template>
<style scoped>
.sheet-usage{padding:20px;border:1px solid var(--vp-c-divider);border-radius:12px;margin:20px 0}.sheet-usage>label{display:flex;align-items:center;gap:10px;margin-bottom:12px}button,select{min-height:44px;padding:8px;border:1px solid var(--vp-c-divider);border-radius:8px;background:var(--vp-c-bg-soft)}dialog{position:fixed;inset:0 0 0 auto;margin:0;width:min(440px,100vw);height:100dvh;max-height:100dvh;max-width:100vw;padding:24px;border:1px solid var(--vp-c-divider);overflow:auto;background:var(--vp-c-bg);color:var(--vp-c-text-1)}dialog[open]{animation:sheet-in 180ms ease-out}dialog::backdrop{background:#0009}dialog.wide{width:min(640px,100vw)}header{display:flex;gap:12px;align-items:start;justify-content:space-between}h2{margin:0!important;border:0!important;font-size:20px!important}header button{flex-shrink:0}dt{font-weight:600}dd{margin:0 0 16px}footer{border-top:1px solid var(--vp-c-divider);padding-top:16px;margin-top:24px}:focus-visible{outline:3px solid var(--vp-c-brand-1);outline-offset:3px}@keyframes sheet-in{from{opacity:.5;translate:8px 0}to{opacity:1;translate:0 0}}@media(prefers-reduced-motion:reduce){dialog[open]{animation:none;translate:none}}

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
