<script setup lang="ts">
import MarginGuidePreview from './MarginGuidePreview.vue'
import MarginColorSwatchGrid from './MarginColorSwatchGrid.vue'

defineProps<{ label?: string; modeModes?: boolean }>()

const labLight = [
  { label: '--bg', value: '#f5f5f7', bg: '#f5f5f7' },
  { label: '--surface', value: '#ffffff', bg: '#ffffff' },
  { label: '--ink', value: '#22252b', bg: '#22252b' },
  { label: '--muted', value: '#676e7b', bg: '#676e7b' },
  { label: '--line', value: '#e0e3e9', bg: '#e0e3e9' },
  { label: '--soft', value: '#eceef5', bg: '#eceef5' },
  { label: 'accent', value: '#6389ea', bg: '#6389ea' },
]

const labDark = [
  { label: '--bg', value: '#181b22', bg: '#181b22' },
  { label: '--surface', value: '#242833', bg: '#242833' },
  { label: '--ink', value: '#f1f3f8', bg: '#f1f3f8' },
  { label: '--muted', value: '#aab3c3', bg: '#aab3c3' },
  { label: '--line', value: '#404757', bg: '#404757' },
  { label: '--soft', value: '#303747', bg: '#303747' },
  { label: 'accent', value: '#6389ea', bg: '#6389ea' },
]
</script>
<template>
  <template v-if="!modeModes">
    <MarginGuidePreview label="Light tokens">
      <MarginColorSwatchGrid :swatches="labLight" />
    </MarginGuidePreview>
    <MarginGuidePreview label="Dark tokens">
      <MarginColorSwatchGrid :swatches="labDark" />
    </MarginGuidePreview>
  </template>
  <MarginGuidePreview v-else :label="label ?? 'Color modes'">
    <p class="mg-note">Use <code>.lab</code> and <code>.lab-dark</code> on a root surface, or toggle the preview chrome. Dashboard shells use <code>.margin.lab-dark</code>.</p>
    <MarginColorSwatchGrid :swatches="labLight" />
  </MarginGuidePreview>
</template>