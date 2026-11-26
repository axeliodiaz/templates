<script setup lang="ts">
import MarginGuidePreview from './MarginGuidePreview.vue'
import MarginBs6Catalog from './MarginBs6Catalog.vue'
defineProps<{ section: string; label?: string }>()
</script>
<template>
  <MarginGuidePreview :label="label">
    <MarginBs6Catalog embedded :section="section" />
  </MarginGuidePreview>
</template>