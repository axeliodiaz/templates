<script setup>
defineProps({
  checksState: { type: String, default: 'running' },
  expanded: { type: Boolean, default: false },
  panelId: { type: String, default: 'mg-sq-checks-panel' },
})
defineEmits(['toggle'])

const label = (state) => (state === 'passed' ? '6 checks passed' : 'Checks running')
</script>

<template>
  <button
    type="button"
    class="mg-sq-checks__trigger"
    :class="{ 'is-passed': checksState === 'passed' }"
    :aria-expanded="expanded"
    :aria-controls="panelId"
    @click="$emit('toggle')"
    @keydown.enter.prevent="$emit('toggle')"
    @keydown.space.prevent="$emit('toggle')"
  >
    <span v-if="checksState === 'running'" class="mg-sq-spin" aria-hidden="true" />
    <span v-else class="mg-sq-checks__ok" aria-hidden="true">✓</span>
    {{ label(checksState) }}
    <span class="mg-sq-checks__chevron" aria-hidden="true">{{ expanded ? '▾' : '▸' }}</span>
  </button>
</template>