<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
const busy = ref(false), pressed = ref(false), result = ref('Ready. All actions are local and fictitious.')
let timer: ReturnType<typeof setTimeout> | undefined
function save() {
  if (busy.value) return
  busy.value = true; result.value = 'Saving sample draft locally...'
  timer = setTimeout(() => { busy.value = false; result.value = 'Sample draft saved. Nothing was sent or persisted.' }, 1000)
}
onBeforeUnmount(() => clearTimeout(timer))
</script>
<template>
  <section class="button-usage l-demo" aria-label="Buttons usage demonstration">
    <div class="l-actions">
      <button type="button" class="l-btn l-primary" :disabled="busy" :aria-busy="busy" @click="save">{{ busy ? 'Saving sample...' : 'Save sample draft' }}</button>
      <button type="button" class="l-btn l-secondary" @click="result = 'Preview opened locally. No navigation or network request.'">Preview sample</button>
      <button type="button" class="l-btn l-quiet" :aria-pressed="pressed" @click="pressed = !pressed; result = pressed ? 'Favorite enabled locally.' : 'Favorite disabled locally.'">Favorite</button>
      <button type="button" class="l-btn l-secondary" disabled>Unavailable</button>
      <button type="button" class="l-btn l-danger" @click="result = 'Destructive style preview only. No record was deleted.'">Delete sample</button>
    </div>
    <p role="status">{{ result }}</p>
    <small>Fictitious data. Local state resets on reload; no request, storage or deletion.</small>
  </section>
</template>
<style scoped>
.button-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0 }
.button-usage .l-actions { display:flex; flex-wrap:wrap; gap:10px }
.button-usage button { min-height:44px; transition:transform 120ms ease, opacity 120ms ease }
.button-usage button:active:not(:disabled) { transform:translateY(1px) }
.button-usage button:focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px }
.button-usage button[aria-pressed="true"] { box-shadow:inset 0 0 0 2px currentColor }
.button-usage p { margin:16px 0 8px }
@media (prefers-reduced-motion:reduce) { .button-usage button { transition:none } .button-usage button:active:not(:disabled) { transform:none } }
</style>
