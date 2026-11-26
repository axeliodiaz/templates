<script setup lang="ts">
import { computed, onMounted } from 'vue'
import MarginGuidePreview from './MarginGuidePreview.vue'
import { marginBs6GenericHtml } from './margin-bs6-generic-demos'
import { initMarginBs6 } from './margin-bs6-live'

const props = defineProps<{ area: string; slug: string; label?: string }>()

const html = computed(() => marginBs6GenericHtml(props.area, props.slug, props.label))
onMounted(() => initMarginBs6())
</script>
<template>
  <MarginGuidePreview :label="label ?? slug">
<<<<<<< HEAD
    <div class="lab b2-bs6 b2-margin margin-bs6-root margin-bs6-generic" v-html="html" />
=======
    <div class="lab b2-bs6 b2-margin margin-bs6-generic" v-html="html" />
>>>>>>> origin/main
  </MarginGuidePreview>
</template>
<style scoped>
.margin-bs6-generic :deep(code) { font-size: 12px; }
</style>