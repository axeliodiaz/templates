<script setup lang="ts">
import { computed } from 'vue'
import MarginGuidePreview from './MarginGuidePreview.vue'

const props = defineProps<{ area: string; slug: string; label?: string }>()

const demos: Record<string, string> = {
  'layout/grid': `<div class="container"><div class="row g-2"><div class="col-md-4"><div class="p-3 border rounded">Column</div></div><div class="col-md-4"><div class="p-3 border rounded">Column</div></div><div class="col-md-4"><div class="p-3 border rounded">Column</div></div></div></div>`,
  'layout/containers': `<div class="container border py-2 mb-2">.container</div><div class="container-fluid border py-2">.container-fluid</div>`,
  'utilities/flex': `<div class="d-flex gap-2"><span class="badge text-bg-secondary">One</span><span class="badge text-bg-secondary">Two</span></div>`,
  'utilities/display': `<div class="d-inline p-2 border">.d-inline</div> <span class="d-none d-md-inline p-2 border">.d-md-inline</span>`,
  'helpers/focus-ring': `<button type="button" class="btn btn-solid theme-primary">Tab for focus ring</button>`,
  'components/drawer': `<button type="button" class="btn btn-outline theme-secondary" data-bs-toggle="drawer" data-bs-target="#mg-demo-drawer">Open drawer</button>`,
  'components/dialog': `<button type="button" class="btn btn-outline theme-secondary" onclick="document.getElementById('mg-demo-dialog')?.showModal()">Open dialog</button>`,
  'customize/overview': `<p class="mb-2">Margin maps <code>.lab</code> tokens into scoped <code>b2-margin</code> Bootstrap 6 via <code>scripts/build-margin-bs6-catalog.mjs</code>.</p>`,
  'getting-started/introduction': `<p>Margin docs mirror <a href="https://getbootstrap.com/docs/6.0/" rel="noopener">Bootstrap v6.0</a> section names with the <code>#6389ea</code> lab palette.</p>`,
  'guides/quickstart': `<div class="lab b2-bs6 b2-margin p-3 border rounded"><button type="button" class="btn btn-solid theme-primary">Primary</button></div>`,
}

const key = computed(() => `${props.area}/${props.slug}`)
const html = computed(
  () =>
    demos[key.value] ??
    `<p class="mb-2"><strong>${props.label ?? props.slug}</strong> — live preview uses Margin <code>.lab</code> / <code>b2-margin</code> tokens. Toggle <strong>Dark preview</strong> for AA contrast.</p><div class="p-3 border rounded"><code>.${props.area}-${props.slug}</code></div>`
)
</script>
<template>
  <MarginGuidePreview :label="label ?? slug">
    <div class="lab b2-bs6 b2-margin margin-bs6-generic" v-html="html" />
  </MarginGuidePreview>
  <details class="mg-code"><summary>Copy shell</summary>
    <pre><code>&lt;div class="lab b2-bs6 b2-margin"&gt;
  &lt;!-- {{ area }}/{{ slug }} --&gt;
&lt;/div&gt;</code></pre>
  </details>
</template>
<style scoped>
.mg-code { margin-top: 12px; font-size: 12px; }
.margin-bs6-generic :deep(code) { font-size: 12px; }
</style>