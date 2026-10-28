<script setup lang="ts">
import { nextTick, ref } from 'vue'
const visible = ref(true), message = ref('No real review is pending. This is fictitious data.')
const restore = ref<HTMLButtonElement|null>(null), dismiss = ref<HTMLButtonElement|null>(null)
async function hide() { visible.value = false; message.value = 'Sample warning dismissed locally.'; await nextTick(); restore.value?.focus() }
async function show() { visible.value = true; message.value = 'Sample warning restored locally.'; await nextTick(); dismiss.value?.focus() }
</script>
<template>
 <section class="alert-usage l-demo" aria-label="Alerts usage demonstration">
  <div v-if="visible" class="l-alert l-alert-warn">
   <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
   <div><strong>Sample draft needs review</strong><p>Two fictitious checks need attention before continuing.</p><button type="button" class="l-btn l-secondary" @click="message = 'Sample checks opened locally. Nothing was submitted.'">Review sample checks</button></div>
   <button ref="dismiss" type="button" class="l-icon-btn" aria-label="Dismiss sample warning" @click="hide"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
  </div>
  <button v-else ref="restore" type="button" class="l-btn l-secondary" @click="show">Restore sample warning</button>
  <div class="l-alert l-alert-success"><div><strong>Sample saved</strong><p>Success style only. No record was saved to a server.</p></div></div>
  <div class="l-alert"><div><strong>Sample information</strong><p>Informational content stays visible without interrupting focus.</p></div></div>
  <div class="l-alert alert-guide-error"><div><strong>Sample validation failed</strong><p>Explain the field that needs fixing and how to retry. No real form failed.</p></div></div>
  <p role="status">{{ message }}</p>
  <small>Fictitious data. Dismissal changes local visibility only; reload resets it.</small>
 </section>
</template>
<style scoped>
.alert-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0 }
.alert-usage .l-alert { display:flex; align-items:flex-start; gap:12px; margin-bottom:14px; animation:alert-guide-in 150ms ease-out }
.alert-usage .alert-guide-error { background:#3d2029; border-color:#9b4e62 }
.alert-usage .l-alert > div { min-width:0; flex:1 }
.alert-usage .l-alert button { min-height:44px; margin-top:8px }
.alert-usage .l-icon-btn { min-width:44px; flex:none; margin:0!important }
.alert-usage :focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px }
@keyframes alert-guide-in { from {opacity:.4} to {opacity:1} }
@media(prefers-reduced-motion:reduce) { .alert-usage .l-alert { animation:none } }
</style>
