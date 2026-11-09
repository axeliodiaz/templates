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
  <section class="button-usage fg-demo" aria-label="Buttons usage demonstration">
    <div class="fg-actions">
      <button type="button" class="fg-btn fg-primary" :disabled="busy" :aria-busy="busy" @click="save">{{ busy ? 'Saving sample...' : 'Save sample draft' }}</button>
      <button type="button" class="fg-btn fg-secondary" @click="result = 'Preview opened locally. No navigation or network request.'">Preview sample</button>
      <button type="button" class="fg-btn fg-quiet" :aria-pressed="pressed" @click="pressed = !pressed; result = pressed ? 'Favorite enabled locally.' : 'Favorite disabled locally.'">Favorite</button>
      <button type="button" class="fg-btn fg-secondary" disabled>Unavailable</button>
      <button type="button" class="fg-btn fg-danger" @click="result = 'Destructive style preview only. No record was deleted.'">Delete sample</button>
    </div>
    <p role="status">{{ result }}</p>
    <small>Fictitious data. Local state resets on reload; no request, storage or deletion.</small>
  </section>
</template>
<style scoped>
.button-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0 }
.button-usage .fg-actions { display:flex; flex-wrap:wrap; gap:10px }
.button-usage button { min-height:44px; transition:transform 120ms ease, opacity 120ms ease }
.button-usage button:active:not(:disabled) { transform:translateY(1px) }
.button-usage button:focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px }
.button-usage button[aria-pressed="true"] { box-shadow:inset 0 0 0 2px currentColor }
.button-usage p { margin:16px 0 8px }
@media (prefers-reduced-motion:reduce) { .button-usage button { transition:none } .button-usage button:active:not(:disabled) { transform:none } }

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
