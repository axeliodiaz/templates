<script setup lang="ts">
import { computed, onMounted } from 'vue'
import MarginGuidePreview from './MarginGuidePreview.vue'
import { marginBs6GenericHtml } from './margin-bs6-generic-demos'
import { initMarginBs6 } from './margin-bs6-live'

const props = defineProps<{ area: string; slug: string; label?: string }>()

const html = computed(() => marginBs6GenericHtml(props.area, props.slug, props.label))
const copyText = computed(() => `<div class="lab b2-bs6 b2-margin">\n${html.value}\n</div>`)

onMounted(() => initMarginBs6())
</script>
<template>
  <MarginGuidePreview :label="label ?? slug">
    <div class="lab b2-bs6 b2-margin margin-bs6-generic" v-html="html" />
  </MarginGuidePreview>
  <details class="mg-code"><summary>Copy markup</summary>
    <pre><code>{{ copyText }}</code></pre>
  </details>
</template>
<style scoped>
.mg-code { margin-top: 12px; font-size: 12px; }
.margin-bs6-generic :deep(code) { font-size: 12px; }
.mg-code pre {
  overflow: auto;
  padding: 10px 12px;
  border: 1px solid var(--line, #e0e3e9);
  border-radius: 8px;
  background: var(--surface, #fff);
}
</style>