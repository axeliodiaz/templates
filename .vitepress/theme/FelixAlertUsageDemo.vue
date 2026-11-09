<script setup lang="ts">
import { nextTick, ref } from 'vue'
const visible = ref(true), message = ref('No real review is pending. This is fictitious data.')
const restore = ref<HTMLButtonElement|null>(null), dismiss = ref<HTMLButtonElement|null>(null)
async function hide() { visible.value = false; message.value = 'Sample warning dismissed locally.'; await nextTick(); restore.value?.focus() }
async function show() { visible.value = true; message.value = 'Sample warning restored locally.'; await nextTick(); dismiss.value?.focus() }
</script>
<template>
 <section class="alert-usage fg-demo" aria-label="Alerts usage demonstration">
  <div v-if="visible" class="fg-alert fg-alert-warn">
   <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
   <div><strong>Sample draft needs review</strong><p>Two fictitious checks need attention before continuing.</p><button type="button" class="fg-btn fg-secondary" @click="message = 'Sample checks opened locally. Nothing was submitted.'">Review sample checks</button></div>
   <button ref="dismiss" type="button" class="fg-icon-btn" aria-label="Dismiss sample warning" @click="hide"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
  </div>
  <button v-else ref="restore" type="button" class="fg-btn fg-secondary" @click="show">Restore sample warning</button>
  <div class="fg-alert fg-alert-success"><div><strong>Sample saved</strong><p>Success style only. No record was saved to a server.</p></div></div>
  <div class="fg-alert"><div><strong>Sample information</strong><p>Informational content stays visible without interrupting focus.</p></div></div>
  <div class="fg-alert alert-guide-error"><div><strong>Sample validation failed</strong><p>Explain the field that needs fixing and how to retry. No real form failed.</p></div></div>
  <p role="status">{{ message }}</p>
  <small>Fictitious data. Dismissal changes local visibility only; reload resets it.</small>
 </section>
</template>
<style scoped>
.alert-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0 }
.alert-usage .fg-alert { display:flex; align-items:flex-start; gap:12px; margin-bottom:14px; animation:alert-guide-in 150ms ease-out }
.alert-usage .alert-guide-error { background:var(--vp-c-danger-soft); border-color:var(--fg-danger); color:var(--vp-c-text-1) }
.alert-usage .fg-alert > div { min-width:0; flex:1 }
.alert-usage .fg-alert button { min-height:44px; margin-top:8px }
.alert-usage .fg-icon-btn { min-width:44px; flex:none; margin:0!important }
.alert-usage :focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px }
@keyframes alert-guide-in { from {opacity:.4} to {opacity:1} }
@media(prefers-reduced-motion:reduce) { .alert-usage .fg-alert { animation:none } }

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
