<script setup lang="ts">
import { ref } from 'vue'
const modes = ['Design', 'Code', 'Preview']
const mode = ref('Design'), bold = ref(false), italic = ref(false), message = ref('No sample action yet.')
</script>
<template>
  <section class="group-usage l-demo" aria-label="Button group usage demonstration">
    <h3>Single view</h3>
    <div class="l-segment" role="group" aria-label="Sample display mode">
      <button type="button" v-for="item in modes" :key="item" :aria-pressed="mode === item" :class="{'is-active':mode === item}" @click="mode = item">{{ item }}</button>
    </div>
    <p role="status">Selected view: {{ mode }}. Local sample content only.</p>
    <h3>Independent toggles</h3>
    <div class="l-segment" role="group" aria-label="Sample formatting">
      <button type="button" :aria-pressed="bold" :class="{'is-active':bold}" @click="bold = !bold">Bold</button>
      <button type="button" :aria-pressed="italic" :class="{'is-active':italic}" @click="italic = !italic">Italic</button>
    </div>
    <p :style="{fontWeight:bold?'700':'400',fontStyle:italic?'italic':'normal'}">Fictitious sample text.</p>
    <h3>Action with adjacent disclosure</h3>
    <div class="l-actions" role="group" aria-label="Sample export actions">
      <button type="button" class="l-btn l-primary" @click="message = 'Sample export selected. No file was created.'">Export sample</button>
      <details class="l-dropdown"><summary>More sample actions</summary><div class="l-menu"><button type="button" @click="message = 'Sample copy selected. Clipboard unchanged.'">Copy sample</button><button type="button" disabled>Unavailable action</button></div></details>
    </div>
    <p role="status">{{ message }}</p>
    <small>All data is fictitious. No files, clipboard, server or persistent state are changed.</small>
  </section>
</template>
<style scoped>
.group-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0 }
.group-usage .l-dropdown { position:static; width:100% }
.group-usage .l-dropdown summary { display:list-item; width:fit-content; cursor:pointer }
.group-usage .l-menu { position:static; margin-top:10px; width:100%; max-width:320px }
.group-usage h3:first-child { margin-top:0 }
.group-usage .l-segment, .group-usage .l-actions { display:flex; flex-wrap:wrap; gap:8px }
.group-usage button, .group-usage summary { min-height:44px; padding:10px 14px; transition:background-color 120ms ease }
.group-usage button:focus-visible, .group-usage summary:focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px }
@media(prefers-reduced-motion:reduce) { .group-usage button, .group-usage summary { transition:none } }
</style>
