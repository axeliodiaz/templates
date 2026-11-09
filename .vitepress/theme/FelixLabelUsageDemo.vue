<script setup lang="ts">
import { computed, ref, useId } from 'vue'
const id=useId()
const value=ref('')
const required=ref(true)
const disabled=ref(false)
const attempted=ref(false)
const result=ref('No local validation yet.')
const error=computed(()=>attempted.value && !disabled.value && required.value && !value.value.trim())
function validate(){attempted.value=true;result.value=disabled.value?'Disabled field skipped. No data sent.':error.value?'Enter an example name. No data sent.':'Local validation passed. Nothing was submitted.'}
function reset(){value.value='';required.value=true;disabled.value=false;attempted.value=false;result.value='No local validation yet.'}
</script>
<template>
<section class="label-demo" aria-label="Label association example"><div class="label-controls"><label><input v-model="required" type="checkbox" @change="attempted=false"> Require example name</label><label><input v-model="disabled" type="checkbox" @change="attempted=false"> Disable example field</label></div><form novalidate @submit.prevent="validate"><label class="example-label" :for="id+'-name'">Example name <span>({{ disabled?'disabled':required?'required':'optional' }})</span></label><input :id="id+'-name'" v-model="value" class="example-input" type="text" maxlength="80" :required="required" :disabled="disabled" :aria-invalid="error?'true':undefined" :aria-describedby="id+'-help'+(error?' '+id+'-error':'')" @input="attempted=false"><p :id="id+'-help'" class="label-help">Fictitious text only, up to 80 characters. Click the label to focus its enabled field.</p><p v-if="error" :id="id+'-error'" class="label-error">Enter an example name.</p><div class="label-actions"><button type="submit">Validate locally</button><button type="button" @click="reset">Reset example</button></div></form><p role="status" aria-atomic="true">{{ result }}</p><p>The label names the field; required and disabled belong to the input. No request is sent.</p></section>
</template>
<style scoped>
.label-demo{border:1px solid var(--vp-c-divider);border-radius:14px;padding:20px;margin:20px 0}.label-controls{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:24px}.label-controls label{display:flex;align-items:center;gap:8px}.label-controls input{accent-color:var(--vp-c-brand-1)}.example-label{display:block;font-weight:650;margin-bottom:8px}.example-label span{font-weight:400}.example-input{display:block;width:100%;box-sizing:border-box;font:inherit;color:inherit;background:var(--vp-c-bg-soft);border:1px solid var(--vp-c-divider);border-radius:8px;padding:10px;transition:border-color .15s ease,background-color .15s ease}.example-input[aria-invalid=true]{border-color:var(--vp-c-danger-1);background:var(--vp-c-danger-soft)}.example-input:disabled{opacity:.5;cursor:not-allowed}.label-help{font-size:14px;color:var(--vp-c-text-2)}.label-error{color:var(--vp-c-danger-1)}.label-actions{display:flex;flex-wrap:wrap;gap:8px}.label-actions button{border:1px solid var(--vp-c-divider);border-radius:8px;padding:8px 12px;background:var(--vp-c-bg-soft)}.label-demo input:focus-visible,.label-demo button:focus-visible{outline:2px solid var(--vp-c-brand-1);outline-offset:3px}@media(prefers-reduced-motion:reduce){.example-input{transition:none}}
</style>
