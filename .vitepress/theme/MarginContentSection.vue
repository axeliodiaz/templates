<script setup lang="ts">
import MarginGuidePreview from './MarginGuidePreview.vue'
import MarginContentDemo from './MarginContentDemo.vue'
defineProps<{ section: string; label?: string }>()
</script>
<template>
  <MarginGuidePreview :label="label">
    <MarginContentDemo :section="section" />
  </MarginGuidePreview>
</template>