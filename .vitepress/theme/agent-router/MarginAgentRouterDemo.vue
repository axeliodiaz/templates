<script setup>
import { inject, ref } from 'vue'
import MarginAgentRouter from './MarginAgentRouter.vue'

const dark = inject('marginGuidePreviewDark', ref(false))
const routerRef = ref(null)
const motionOn = ref(true)
const autoplayOn = ref(true)

function replay() {
  routerRef.value?.replay()
}
</script>

<template>
  <div class="mg-ar-lab lab" :class="{ 'lab-dark': dark }" data-tpl="margin">
    <div class="mg-ar-lab__toolbar" aria-label="Demo controls">
      <button type="button" class="btn btn-outline-secondary btn-sm" @click="replay">Replay</button>
      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        :class="{ active: !motionOn }"
        :aria-pressed="!motionOn"
        @click="motionOn = !motionOn"
      >
        {{ motionOn ? 'Motion on' : 'Motion off' }}
      </button>
      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        :class="{ active: !autoplayOn }"
        :aria-pressed="!autoplayOn"
        @click="autoplayOn = !autoplayOn"
      >
        {{ autoplayOn ? 'Autoplay on' : 'Autoplay off' }}
      </button>
    </div>
    <MarginAgentRouter ref="routerRef" :motion="motionOn" :autoplay="autoplayOn" />
  </div>
</template>