<script setup>
import { inject, ref } from 'vue'
import MarginSquashForcePush from './MarginSquashForcePush.vue'

const dark = inject('marginGuidePreviewDark', ref(false))
const squashRef = ref(null)
const motionOn = ref(true)

function replay() {
  squashRef.value?.replay()
}
</script>

<template>
  <div
    class="mg-squash-lab lab"
    :class="{ 'lab-dark': dark }"
    data-tpl="margin"
  >
    <div class="mg-squash-lab__toolbar" aria-label="Demo controls">
      <button type="button" class="btn btn-outline-secondary btn-sm" @click="replay">
        Replay
      </button>
      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        :class="{ active: !motionOn }"
        :aria-pressed="!motionOn"
        @click="motionOn = !motionOn"
      >
        {{ motionOn ? 'Motion on' : 'Motion off' }}
      </button>
    </div>
    <MarginSquashForcePush ref="squashRef" :motion="motionOn" />
  </div>
</template>