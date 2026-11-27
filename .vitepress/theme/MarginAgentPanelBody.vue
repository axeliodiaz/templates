<script setup lang="ts">
defineProps<{
  mode: 'rendered' | 'markdown'
  rendered: string
  raw: string
  loadError: string
  copied: boolean
  open: boolean
}>()

const emit = defineEmits<{
  'update:mode': ['rendered' | 'markdown']
  copy: []
}>()

function setMode(next: 'rendered' | 'markdown') {
  emit('update:mode', next)
}
</script>
<template>
  <section
    id="mg-agent-panel-body"
    class="mg-agent-panel__body"
    :class="{ 'mg-agent-panel__body--open': open }"
    role="region"
    aria-label="Agent instructions"
  >
    <div class="mg-agent-panel__modes" role="tablist" aria-label="Agent instruction view">
      <button
        type="button"
        role="tab"
        :aria-selected="mode === 'rendered'"
        :class="{ active: mode === 'rendered' }"
        @click="setMode('rendered')"
      >
        Rendered
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="mode === 'markdown'"
        :class="{ active: mode === 'markdown' }"
        @click="setMode('markdown')"
      >
        Markdown
      </button>
      <button type="button" class="mg-agent-panel__copy" :disabled="!raw" @click="emit('copy')">
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </div>
    <p v-if="loadError" class="mg-agent-panel__error">{{ loadError }}</p>
    <div v-else-if="mode === 'rendered'" class="mg-agent-panel__render vp-doc" v-html="rendered" />
    <pre v-else class="mg-agent-panel__raw"><code>{{ raw }}</code></pre>
  </section>
</template>