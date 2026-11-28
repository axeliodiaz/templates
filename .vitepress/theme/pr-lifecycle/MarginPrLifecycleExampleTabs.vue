<script setup>
import { ref, computed } from 'vue'
import MarginGuidePreview from '../MarginGuidePreview.vue'
import MarginPrLifecycleDemo from './MarginPrLifecycleDemo.vue'
import PrlCopyBlock from './PrlCopyBlock.vue'
import { LIFECYCLE_DEF } from './lifecycle-definition.mjs'

const tab = ref('Preview')
const tabs = ['Preview', 'Code', 'Structure']
const jsonText = computed(() => JSON.stringify(LIFECYCLE_DEF, null, 2))
const demoCode = `<MarginPrLifecycle :motion="true" :autoplay="true" deep-link />`

async function copyJson() {
  try {
    await navigator.clipboard.writeText(jsonText.value)
  } catch {
    /* noop */
  }
}
</script>

<template>
  <div class="mg-prl-doc-tabs">
    <div class="l-tabs" role="tablist" aria-label="PR lifecycle example">
      <button
        v-for="name in tabs"
        :key="name"
        type="button"
        role="tab"
        :aria-selected="tab === name"
        :aria-pressed="tab === name"
        :class="{ 'is-active': tab === name }"
        @click="tab = name"
      >
        {{ name }}
      </button>
    </div>

    <div v-show="tab === 'Preview'" class="l-tabpanel" role="tabpanel">
      <MarginGuidePreview label="Live lifecycle (autoplay once when visible)">
        <MarginPrLifecycleDemo />
      </MarginGuidePreview>
    </div>

    <div v-show="tab === 'Code'" class="l-tabpanel" role="tabpanel">
      <PrlCopyBlock label="Live demo" :code="demoCode" />
      <p class="mg-prl-doc-tabs__hint">
        Static frames use <code>state</code> and optional <code>open</code> props; see Reference states
        below for gallery ids from <code>galleryStates</code> in the JSON definition.
      </p>
    </div>

    <div v-show="tab === 'Structure'" class="l-tabpanel mg-prl-structure-panel" role="tabpanel" id="mg-prl-structure">
      <p>
        Single source of truth:
        <code>.vitepress/theme/pr-lifecycle/pr-lifecycle.json</code> (imported as
        <code>LIFECYCLE_DEF</code>). <code>type</code> is <code>"lifecycle"</code> so other process
        diagrams can reuse the same renderer with a different JSON file.
      </p>
      <table class="mg-prl-schema-table">
        <thead>
          <tr><th>Field</th><th>Role</th></tr>
        </thead>
        <tbody>
          <tr><td><code>type</code></td><td>Schema discriminator (<code>lifecycle</code>).</td></tr>
          <tr><td><code>meta</code></td><td>PR title, branch, author, merge commit (panel + headlines).</td></tr>
          <tr><td><code>phases</code></td><td>Nodes: id, label, step, grid, notch, connector, running marker rules.</td></tr>
          <tr><td><code>lanes</code></td><td>Nested steps under a spine phase (e.g. Resolve under Review).</td></tr>
          <tr><td><code>loops</code></td><td>Fix &amp; push and Review ⇄ Resolve arcs, counters, stack chips.</td></tr>
          <tr><td><code>panels</code>, <code>metrics</code>, <code>headlines</code></td><td>Detail rows, node subtitles, and chip copy.</td></tr>
          <tr><td><code>galleryStates</code></td><td>Reference-state gallery ids and model patches.</td></tr>
          <tr><td><code>deepLink</code></td><td>Hash pattern for <code>#phase-&lt;id&gt;</code> panel deep links.</td></tr>
          <tr><td><code>autoplay</code></td><td>Timed demo script (unchanged motion handlers).</td></tr>
        </tbody>
      </table>
      <div class="mg-prl-structure-copy vp-doc">
        <div class="mg-prl-copy__head">
          <span>pr-lifecycle.json</span>
          <button type="button" class="mg-prl-copy__btn" @click="copyJson">Copy JSON</button>
        </div>
        <pre class="mg-prl-copy__pre mg-prl-structure-pre"><code class="language-json">{{ jsonText }}</code></pre>
      </div>
    </div>
  </div>
</template>