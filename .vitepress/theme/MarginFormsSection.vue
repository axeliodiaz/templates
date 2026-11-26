<script setup lang="ts">
import MarginGuidePreview from './MarginGuidePreview.vue'
import MarginBs6FormsDemo from './MarginBs6FormsDemo.vue'
defineProps<{ section: string; label?: string }>()
</script>
<template>
  <MarginGuidePreview :label="label">
    <MarginBs6FormsDemo :section="section" />
  </MarginGuidePreview>
</template>