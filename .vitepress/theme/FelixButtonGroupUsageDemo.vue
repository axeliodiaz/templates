<script setup lang="ts">
import { ref } from 'vue'
const modes = ['Design', 'Code', 'Preview']
const mode = ref('Design'), bold = ref(false), italic = ref(false), message = ref('No sample action yet.')
</script>
<template>
  <section class="group-usage fg-demo" aria-label="Button group usage demonstration">
    <h3>Single view</h3>
    <div class="fg-segment" role="group" aria-label="Sample display mode">
      <button type="button" v-for="item in modes" :key="item" :aria-pressed="mode === item" :class="{'is-active':mode === item}" @click="mode = item">{{ item }}</button>
    </div>
    <p role="status">Selected view: {{ mode }}. Local sample content only.</p>
    <h3>Independent toggles</h3>
    <div class="fg-segment" role="group" aria-label="Sample formatting">
      <button type="button" :aria-pressed="bold" :class="{'is-active':bold}" @click="bold = !bold">Bold</button>
      <button type="button" :aria-pressed="italic" :class="{'is-active':italic}" @click="italic = !italic">Italic</button>
    </div>
    <p :style="{fontWeight:bold?'700':'400',fontStyle:italic?'italic':'normal'}">Fictitious sample text.</p>
    <h3>Action with adjacent disclosure</h3>
    <div class="fg-actions" role="group" aria-label="Sample export actions">
      <button type="button" class="fg-btn fg-primary" @click="message = 'Sample export selected. No file was created.'">Export sample</button>
      <details class="fg-dropdown"><summary>More sample actions</summary><div class="fg-menu"><button type="button" @click="message = 'Sample copy selected. Clipboard unchanged.'">Copy sample</button><button type="button" disabled>Unavailable action</button></div></details>
    </div>
    <p role="status">{{ message }}</p>
    <small>All data is fictitious. No files, clipboard, server or persistent state are changed.</small>
  </section>
</template>
<style scoped>
.group-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0 }
.group-usage .fg-dropdown { position:static; width:100% }
.group-usage .fg-dropdown summary { display:list-item; width:fit-content; cursor:pointer }
.group-usage .fg-menu { position:static; margin-top:10px; width:100%; max-width:320px }
.group-usage h3:first-child { margin-top:0 }
.group-usage .fg-segment, .group-usage .fg-actions { display:flex; flex-wrap:wrap; gap:8px }
.group-usage button, .group-usage summary { min-height:44px; padding:10px 14px; transition:background-color 120ms ease }
.group-usage button:focus-visible, .group-usage summary:focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px }
@media(prefers-reduced-motion:reduce) { .group-usage button, .group-usage summary { transition:none } }

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
