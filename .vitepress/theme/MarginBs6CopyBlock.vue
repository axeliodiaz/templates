<script setup lang="ts">
import { computed, ref } from 'vue'
import { marginBs6CopyMarkup } from './margin-bs6-copy'

const props = defineProps<{ area: string; slug: string }>()
const copied = ref(false)

const markup = computed(() => marginBs6CopyMarkup(props.area, props.slug))
const isPlaceholder = computed(() => /<!--\s*[\w-]+\/[\w-]+\s*-->/.test(markup.value))

async function copy() {
  try {
    await navigator.clipboard.writeText(markup.value)
    copied.value = true
    window.setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    /* clipboard may be unavailable */
  }
}
</script>
<template>
  <div class="margin-bs6-doc-code vp-doc" :class="{ 'is-gap': isPlaceholder }">
    <div class="margin-bs6-doc-code-head">
      <span>Example markup</span>
      <button type="button" class="margin-bs6-copy-btn" @click="copy">{{ copied ? 'Copied' : 'Copy' }}</button>
    </div>
    <pre class="language-html"><code>{{ markup }}</code></pre>
    <p v-if="isPlaceholder" class="margin-bs6-doc-code-gap">Copy snippet pending for this route.</p>
  </div>
</template>
<style scoped>
.margin-bs6-doc-code {
  margin: 1.25rem 0 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  background: var(--vp-code-block-bg);
}
.margin-bs6-doc-code-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 12px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  border-bottom: 1px solid var(--vp-c-divider);
}
.margin-bs6-copy-btn {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  padding: 2px 10px;
  font-size: 12px;
  cursor: pointer;
}
.margin-bs6-copy-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.margin-bs6-doc-code pre {
  margin: 0;
  border-radius: 0;
  font-size: 13px;
  line-height: 1.45;
  max-height: 28rem;
  overflow: auto;
}
.margin-bs6-doc-code-gap {
  margin: 0;
  padding: 8px 12px 12px;
  font-size: 12px;
  color: var(--vp-c-warning);
}
</style>