<script setup lang="ts">
import MarginExampleTabs from './MarginExampleTabs.vue'
import MarginGuidePreview from './MarginGuidePreview.vue'
import MarginSquashForcePushDemo from './squash-force-push/MarginSquashForcePushDemo.vue'
import MarginSquashChecksSubmodule from './squash-force-push/MarginSquashChecksSubmodule.vue'
import MarginSquashStateGallery from './squash-force-push/MarginSquashStateGallery.vue'
import { SQUASH_DEF } from './squash-force-push/squash-definition.mjs'
import { GIT_GRAPH_SCHEMA } from './margin-example-schemas.mjs'
</script>

<template>
  <div class="margin-squash-doc">
    <p>
      The composed card <strong>autoplays</strong> below; reference frames use
      <code>state="loading" | "expanded" | "rebasing" | "squashed" | "pushing" | "pr-running" | "pr-passed"</code>
      on the same <code>MarginSquashForcePush</code> component.
    </p>
    <MarginExampleTabs
      :definition="SQUASH_DEF"
      json-path=".vitepress/theme/squash-force-push/squash-force-push.json"
      :schema-fields="GIT_GRAPH_SCHEMA"
      code-snippet='<MarginSquashForcePush :motion="true" :autoplay="true" />'
      tabs-aria-label="Squash force push"
    >
      <MarginGuidePreview label="Composed card (autoplay)">
        <MarginSquashForcePushDemo />
      </MarginGuidePreview>
    </MarginExampleTabs>

    <h2 id="reference-frames">Reference frames</h2>
    <p>
      Full white cards (~580px) on a light gray stage — one column until the viewport is at least
      1240px (then two columns), full width with ellipsized messages at 390px.
    </p>
    <MarginGuidePreview label="State gallery">
      <MarginSquashStateGallery />
    </MarginGuidePreview>

    <h2>Sub-modules</h2>
    <MarginSquashChecksSubmodule />

    <h2>Motion &amp; timing</h2>
    <ul>
      <li>
        Autoplay: 2s load → expanded → squash → 2s hold → purple PR + checks (click status to
        expand the six check rows).
      </li>
      <li>Static frames: <code>:motion="false" :autoplay="false"</code>.</li>
      <li><code>--mg-squash-motion: 0</code> respects reduced motion.</li>
    </ul>
  </div>
</template>