<script setup lang="ts">
import { computed, onMounted } from 'vue'
import MarginGuidePreview from './MarginGuidePreview.vue'
import { useMarginPreviewDark } from './useMarginPreviewDark'
import { marginBs6GenericHtml } from './margin-bs6-generic-demos'
import { initMarginBs6 } from './margin-bs6-live'

const props = defineProps<{ area: string; slug: string; label?: string }>()
const previewDark = useMarginPreviewDark()

const html = computed(() => marginBs6GenericHtml(props.area, props.slug, props.label))
onMounted(() => {
  if (html.value) initMarginBs6()
})
</script>
<template>
  <MarginGuidePreview v-if="html" :label="label ?? slug">
    <div
      class="lab b2-bs6 b2-margin margin-bs6-root kit kit-margin margin-bs6-generic"
      :class="{ 'lab-dark': previewDark }"
      v-html="html"
    />
  </MarginGuidePreview>
</template>
<style scoped>
.margin-bs6-generic :deep(code) { font-size: 12px; }
</style>