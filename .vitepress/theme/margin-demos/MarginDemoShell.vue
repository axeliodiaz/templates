<script setup>
import { ref } from 'vue'
import MarginGuidePreview from '../MarginGuidePreview.vue'

const props = defineProps({
  label: { type: String, default: 'Live demo' },
  copy: { type: String, required: true },
})
const copied = ref(false)
async function copy() {
  try {
    await navigator.clipboard.writeText(props.copy)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    /* clipboard unavailable */
  }
}
</script>

<template>
  <div class="mg-margin-demo" data-tpl="margin">
    <MarginGuidePreview :label="label">
      <slot />
    </MarginGuidePreview>
    <div class="mg-margin-demo__copy vp-doc">
      <div class="mg-margin-demo__copy-head">
        <span>Copy markup</span>
        <button type="button" class="mg-margin-demo__copy-btn" @click="copy">
          {{ copied ? 'Copied' : 'Copy' }}
        </button>
      </div>
      <pre class="mg-margin-demo__copy-pre"><code>{{ copy }}</code></pre>
    </div>
    <p class="mg-margin-demo__hint">
      Use the preview toolbar for light/dark; layout is checked at 390px in Margin docs. Fictitious data only.
    </p>
  </div>
</template>