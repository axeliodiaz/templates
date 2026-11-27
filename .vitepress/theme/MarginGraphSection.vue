<script setup lang="ts">
import MarginGuidePreview from './MarginGuidePreview.vue'
import MarginGraphDemo from './MarginGraphDemo.vue'

defineProps<{ exampleKey: string; label?: string }>()
</script>
<template>
  <MarginGuidePreview :label="label">
    <MarginGraphDemo :example-key="exampleKey" />
  </MarginGuidePreview>
</template>