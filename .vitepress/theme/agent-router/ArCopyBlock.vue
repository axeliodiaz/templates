<script setup>
import { ref } from 'vue'

defineProps({
  label: { type: String, default: 'Example' },
  code: { type: String, required: true },
})
const copied = ref(false)
async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
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
  <div class="mg-ar-copy vp-doc">
    <div class="mg-ar-copy__head">
      <span>{{ label }}</span>
      <button type="button" class="mg-ar-copy__btn" @click="copy">
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </div>
    <pre class="mg-ar-copy__pre"><code>{{ code }}</code></pre>
  </div>
</template>