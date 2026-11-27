<script setup lang="ts">
import MarginGuidePreview from './MarginGuidePreview.vue'
import MarginSquashForcePushDemo from './squash-force-push/MarginSquashForcePushDemo.vue'
import MarginSquashStateGallery from './squash-force-push/MarginSquashStateGallery.vue'
</script>

<template>
  <div class="margin-squash-doc">
    <p>
      Pixel-close to
      <a href="https://x.com/pitus_/status/2126383874775118012" rel="noopener noreferrer">@pitus_</a>:
      composed card <strong>autoplays</strong> below; reference frames use
      <code>state="loading" | "expanded" | "rebasing" | "squashed" | "pushing" | "pr-running" | "pr-passed"</code>
      on the same <code>MarginSquashForcePush</code> component.
    </p>
    <MarginGuidePreview label="Composed card (autoplay)">
      <MarginSquashForcePushDemo />
    </MarginGuidePreview>

    <h2 id="reference-frames">Reference frames (X sequence)</h2>
    <p>Full white cards on a light gray stage — 2 columns desktop, 1 column at 390px.</p>
    <MarginGuidePreview label="State gallery">
      <MarginSquashStateGallery />
    </MarginGuidePreview>

    <h2>Motion &amp; timing</h2>
    <ul>
      <li>Autoplay: 2s load → expanded → squash → 2s hold → purple PR + checks.</li>
      <li>Static frames: <code>:motion="false" :autoplay="false"</code>.</li>
      <li><code>--mg-squash-motion: 0</code> respects reduced motion.</li>
    </ul>
  </div>
</template>