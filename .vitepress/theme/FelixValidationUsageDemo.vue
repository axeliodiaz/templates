<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
const email = ref(''), touched = ref(false), submitted = ref(false), result = ref('Fictitious local validation. Nothing is sent.')
const field = ref<HTMLInputElement|null>(null)
const error = computed(() => !email.value.trim() ? 'Enter a sample email address.' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? '' : 'Use an address such as sample@example.test.')
const show = computed(() => touched.value || submitted.value)
async function submit() { submitted.value = true; if(error.value) { result.value = 'Sample not accepted. Correct the email field.'; await nextTick(); field.value?.focus() } else { result.value = 'Sample format accepted locally. Address ownership is not verified.' } }
function reset() { email.value=''; touched.value=false; submitted.value=false; result.value='Sample reset locally.' }
</script>
<template>
 <section class="validation-usage fg-demo" aria-label="Validation usage demonstration">
  <form novalidate @submit.prevent="submit">
   <label for="validation-email">Fictitious email (required)</label>
   <input id="validation-email" ref="field" v-model="email" type="email" required autocomplete="off" :aria-invalid="show && !!error ? 'true' : undefined" :aria-describedby="show ? 'validation-help validation-feedback' : 'validation-help'" :class="{invalid:show && error,valid:show && !error}" @blur="touched=true">
   <small id="validation-help">Use a fictitious address such as sample@example.test. No mail is sent.</small>
   <p v-if="show" id="validation-feedback" :class="error?'error':'valid-text'">{{ error || 'Sample format looks valid. Not a verified mailbox.' }}</p>
   <div class="fg-actions"><button class="fg-btn fg-primary" type="submit">Check sample</button><button class="fg-btn fg-secondary" type="button" @click="reset">Reset validation</button></div>
  </form>
  <p role="status">{{ result }}</p>
 </section>
</template>
<style scoped>
.validation-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0 } form { display:grid; gap:12px } label { font-weight:600 } input { min-width:0; width:100%; min-height:44px; padding:10px; background:var(--vp-c-bg-soft); color:inherit; font:inherit; border:1px solid var(--vp-c-divider); border-radius:8px; transition:border-color 120ms ease } input.invalid { border-color:var(--fg-danger) } input.valid { border-color:var(--vp-c-brand-1) } .error { color:var(--fg-danger) } .valid-text { color:var(--vp-c-brand-1) } .fg-actions { display:flex; flex-wrap:wrap; gap:10px } button { min-height:44px } :focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px } @media(prefers-reduced-motion:reduce) { input { transition:none } }

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
