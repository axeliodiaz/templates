<script setup lang="ts">
import { computed } from 'vue'
import { ICONS, type IconName } from './icons'

const props = withDefaults(defineProps<{ name: IconName; size?: number; active?: boolean }>(), { size: 16, active: false })
const icon = computed(() => ICONS[props.name])
const paths = computed(() => {
  if (!icon.value) return ''
  if (props.active) return icon.value.paths.replace(/opacity="0\.2"/g, 'opacity="1"')
  return icon.value.paths
})
</script>
<template>
  <svg
    class="crew-icon"
    :class="{ 'crew-icon--active': active }"
    :width="size"
    :height="size"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="icon?.viewBox ?? '0 0 256 256'"
    fill="currentColor"
    v-html="paths"
  />
</template>