<script setup>
import { ref } from 'vue'

const props = defineProps({
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
  <div class="mg-sq-copy vp-doc">
    <div class="mg-sq-copy__head">
      <span>{{ label }}</span>
      <button type="button" class="mg-sq-copy__btn" @click="copy">
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </div>
    <pre class="mg-sq-copy__pre"><code>{{ code }}</code></pre>
  </div>
</template>