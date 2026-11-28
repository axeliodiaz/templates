<script setup>
import { inject, ref } from 'vue'
import MarginPrLifecycle from './MarginPrLifecycle.vue'

const dark = inject('marginGuidePreviewDark', ref(false))
const prlRef = ref(null)
</script>

<template>
  <div class="mg-prl-lab lab" :class="{ 'lab-dark': dark }" data-tpl="margin">
    <MarginPrLifecycle
      ref="prlRef"
      :deep-link="true"
      :motion="true"
      :autoplay="true"
    />
  </div>
</template>