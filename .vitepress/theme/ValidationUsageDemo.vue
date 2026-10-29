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
 <section class="validation-usage l-demo" aria-label="Validation usage demonstration">
  <form novalidate @submit.prevent="submit">
   <label for="validation-email">Fictitious email (required)</label>
   <input id="validation-email" ref="field" v-model="email" type="email" required autocomplete="off" :aria-invalid="show && !!error ? 'true' : undefined" :aria-describedby="show ? 'validation-help validation-feedback' : 'validation-help'" :class="{invalid:show && error,valid:show && !error}" @blur="touched=true">
   <small id="validation-help">Use a fictitious address such as sample@example.test. No mail is sent.</small>
   <p v-if="show" id="validation-feedback" :class="error?'error':'valid-text'">{{ error || 'Sample format looks valid. Not a verified mailbox.' }}</p>
   <div class="l-actions"><button class="l-btn l-primary" type="submit">Check sample</button><button class="l-btn l-secondary" type="button" @click="reset">Reset validation</button></div>
  </form>
  <p role="status">{{ result }}</p>
 </section>
</template>
<style scoped>
.validation-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0 } form { display:grid; gap:12px } label { font-weight:600 } input { min-width:0; width:100%; min-height:44px; padding:10px; background:var(--vp-c-bg-soft); color:inherit; font:inherit; border:1px solid var(--vp-c-divider); border-radius:8px; transition:border-color 120ms ease } input.invalid { border-color:#ee8693 } input.valid { border-color:#77c4a0 } .error { color:#ee8693 } .valid-text { color:#77c4a0 } .l-actions { display:flex; flex-wrap:wrap; gap:10px } button { min-height:44px } :focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px } @media(prefers-reduced-motion:reduce) { input { transition:none } }
</style>
