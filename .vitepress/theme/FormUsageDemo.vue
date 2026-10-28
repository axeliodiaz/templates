<script setup lang="ts">
import { ref } from 'vue'
const form = ref<HTMLFormElement|null>(null)
const name = ref('Sample workspace'), notes = ref(''), filename = ref('No file selected.'), message = ref('Fictitious local form. Nothing is sent or stored.')
function fileChanged(e: Event) { filename.value = (e.target as HTMLInputElement).files?.[0]?.name || 'No file selected.' }
function submit() { message.value = `Local sample accepted for ${name.value.trim()}. No server request or upload.` }
function reset() { name.value = 'Sample workspace'; notes.value = ''; filename.value = 'No file selected.'; message.value = 'Sample reset locally.'; form.value?.reset() }
</script>
<template>
 <section class="form-usage l-demo" aria-label="Forms usage demonstration">
  <form ref="form" @submit.prevent="submit">
   <label for="guide-workspace">Workspace name (required)</label>
   <input id="guide-workspace" name="workspace" v-model="name" required maxlength="80" aria-describedby="guide-workspace-help">
   <small id="guide-workspace-help">Use a fictitious name, up to 80 characters.</small>
   <label for="guide-notes">Sample notes (optional)</label>
   <textarea id="guide-notes" name="notes" v-model="notes" rows="3" maxlength="240" aria-describedby="guide-notes-help"></textarea>
   <small id="guide-notes-help">{{ notes.length }} / 240 characters. Do not enter private information.</small>
   <label for="guide-file">Sample attachment (optional)</label>
   <input id="guide-file" type="file" @change="fileChanged" aria-describedby="guide-file-help">
   <small id="guide-file-help">Only the filename is displayed locally. File contents are not read or uploaded. {{ filename }}</small>
   <label for="guide-locked">Read-only sample ID</label><input id="guide-locked" readonly value="SAMPLE-024">
   <div class="l-actions"><button type="submit" class="l-btn l-primary">Submit local sample</button><button type="button" class="l-btn l-secondary" @click="reset">Reset sample</button></div>
  </form>
  <p role="status">{{ message }}</p>
 </section>
</template>
<style scoped>
.form-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0 }
.form-usage form { display:grid; gap:9px }
.form-usage label { font-weight:600; margin-top:10px }
.form-usage input,.form-usage textarea { width:100%; min-width:0; max-width:100%; min-height:44px; padding:10px; color:inherit; background:var(--vp-c-bg-soft); border:1px solid var(--vp-c-divider); border-radius:8px; font:inherit; transition:border-color 120ms ease }
.form-usage input[type=file] { font-size:12px; overflow-wrap:anywhere }
.form-usage .l-actions { margin-top:16px; display:flex; flex-wrap:wrap; gap:10px }
.form-usage button { min-height:44px }
.form-usage :focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px }
@media(prefers-reduced-motion:reduce) { .form-usage input,.form-usage textarea { transition:none } }
</style>
