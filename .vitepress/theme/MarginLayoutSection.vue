<script setup lang="ts">
import MarginGuidePreview from './MarginGuidePreview.vue'
import MarginLayoutDemo from './MarginLayoutDemo.vue'
defineProps<{ section: string; label?: string }>()
</script>
<template>
  <MarginGuidePreview :label="label">
    <MarginLayoutDemo :section="section" />
  </MarginGuidePreview>
</template>