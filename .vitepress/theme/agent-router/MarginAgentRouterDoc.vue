<script setup lang="ts">
import MarginGuidePreview from '../MarginGuidePreview.vue'
import MarginAgentRouterDemo from './MarginAgentRouterDemo.vue'
import MarginAgentRouterStateGallery from './MarginAgentRouterStateGallery.vue'
</script>

<template>
  <div class="margin-ar-doc">
    <p>
      Incoming work is classified, confidence is shown, and cases route to Billing, Tech support, Sales,
      or a human. Synthetic data only.
    </p>
    <MarginGuidePreview label="Live router (autoplay)">
      <MarginAgentRouterDemo />
    </MarginGuidePreview>

    <h2 id="reference-states">Reference states</h2>
    <p>Full cards (~600px) — empty, loading, error, routing, routed, and escalated.</p>
    <MarginGuidePreview label="State gallery">
      <MarginAgentRouterStateGallery />
    </MarginGuidePreview>
  </div>
</template>