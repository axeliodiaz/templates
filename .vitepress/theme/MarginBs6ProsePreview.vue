<script setup lang="ts">
import { computed, onMounted } from 'vue'
import MarginGuidePreview from './MarginGuidePreview.vue'
import { marginBs6PreviewHtml } from './margin-bs6-prose'
import { initMarginBs6 } from './margin-bs6-live'

const props = defineProps<{ area: string; slug: string; label?: string }>()
const html = computed(() => marginBs6PreviewHtml(props.area, props.slug))

onMounted(() => {
  if (html.value) initMarginBs6()
})
</script>
<template>
  <MarginGuidePreview v-if="html" :label="label ?? slug">
    <div class="lab b2-bs6 b2-margin margin-bs6-root kit kit-margin margin-bs6-generic" v-html="html" />
  </MarginGuidePreview>
</template>