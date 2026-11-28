<script setup>
import MarginExampleTabs from '../MarginExampleTabs.vue'
import MarginGuidePreview from '../MarginGuidePreview.vue'
import MarginPrLifecycleDemo from './MarginPrLifecycleDemo.vue'
import { LIFECYCLE_DEF } from './lifecycle-definition.mjs'
import { PRL_SCHEMA } from '../margin-example-schemas.mjs'

const demoCode = `<MarginPrLifecycle :motion="true" :autoplay="true" deep-link />`
</script>

<template>
  <MarginExampleTabs
    :definition="LIFECYCLE_DEF"
    json-path=".vitepress/theme/pr-lifecycle/pr-lifecycle.json"
    :schema-fields="PRL_SCHEMA"
    :code-snippet="demoCode"
    structure-id="mg-prl-structure"
    tabs-aria-label="PR lifecycle example"
  >
    <MarginGuidePreview label="Live lifecycle (autoplay once when visible)">
      <MarginPrLifecycleDemo />
    </MarginGuidePreview>
    <template #code-extra>
      <p class="mg-prl-doc-tabs__hint">
        Static frames use <code>state</code> and optional <code>open</code> props; see Reference states below for gallery
        ids from <code>galleryStates</code> in the JSON.
      </p>
    </template>
    <template #structure-intro>
      <p>
        Single source of truth: <code>.vitepress/theme/pr-lifecycle/pr-lifecycle.json</code>. Reuse the same renderer with
        any JSON where <code>type</code> is <code>lifecycle</code>.
      </p>
    </template>
  </MarginExampleTabs>
</template>