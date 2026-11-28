<script setup>
import MarginExampleTabs from '../MarginExampleTabs.vue'
import MarginGuidePreview from '../MarginGuidePreview.vue'
import MarginSquashStateGallery from '../squash-force-push/MarginSquashStateGallery.vue'
import { SQUASH_DEF } from '../squash-force-push/squash-definition.mjs'
import { GIT_GRAPH_SCHEMA } from '../margin-example-schemas.mjs'
</script>
<template>
  <MarginExampleTabs
    :definition="SQUASH_DEF"
    json-path=".vitepress/theme/squash-force-push/squash-force-push.json"
    :schema-fields="GIT_GRAPH_SCHEMA"
    code-snippet='<MarginSquashForcePush state="squashed" :motion="false" />'
    tabs-aria-label="Squash reference frames"
  >
    <MarginGuidePreview label="State gallery">
      <MarginSquashStateGallery />
    </MarginGuidePreview>
  </MarginExampleTabs>
</template>