<script setup lang="ts">
import MarginColorSwatch from './MarginColorSwatch.vue'

defineProps<{
  swatches: { label: string; value: string; bg: string }[]
}>()
</script>

<template>
  <div class="mg-swatch-grid">
    <MarginColorSwatch v-for="s in swatches" :key="s.label + s.bg" v-bind="s" />
  </div>
</template>

<style scoped>
.mg-swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}
</style>