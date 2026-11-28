<script setup lang="ts">
import MarginExampleTabs from '../MarginExampleTabs.vue'
import MarginGuidePreview from '../MarginGuidePreview.vue'
import MarginAgentRouterDemo from './MarginAgentRouterDemo.vue'
import MarginAgentRouterStateGallery from './MarginAgentRouterStateGallery.vue'
import { ROUTER_DEF } from './router-data.mjs'
import { ROUTER_SCHEMA } from '../margin-example-schemas.mjs'
</script>

<template>
  <div class="margin-ar-doc">
    <p>
      Incoming work is classified, confidence is shown, and cases route to Billing, Tech support, Sales,
      or a human. Synthetic data only.
    </p>
    <MarginExampleTabs
      :definition="ROUTER_DEF"
      json-path=".vitepress/theme/agent-router/router.json"
      :schema-fields="ROUTER_SCHEMA"
      code-snippet='<MarginAgentRouter :motion="true" :autoplay="true" />'
      tabs-aria-label="Agent router"
    >
      <MarginGuidePreview label="Live router (autoplay)">
        <MarginAgentRouterDemo />
      </MarginGuidePreview>
    </MarginExampleTabs>

    <h2 id="reference-states">Reference states</h2>
    <p>Full cards (~600px) — empty, loading, error, routing, routed, and escalated.</p>
    <MarginGuidePreview label="State gallery">
      <MarginAgentRouterStateGallery />
    </MarginGuidePreview>
  </div>
</template>