<script setup>
import { computed } from 'vue'
import { checksForPhase } from '../checks-data.mjs'

const props = defineProps({
  checksState: { type: String, default: 'running' },
  open: { type: Boolean, default: false },
  checks: { type: Array, default: null },
  panelId: { type: String, default: 'mg-sq-checks-panel' },
})

const items = computed(
  () => props.checks ?? checksForPhase(props.checksState === 'passed' ? 'passed' : 'running'),
)
</script>

<template>
  <div
    :id="panelId"
    class="mg-sq-checks__panel"
    :class="{ 'is-open': open }"
    role="region"
    :aria-hidden="!open"
  >
    <ul class="mg-sq-checks__list" role="list">
      <li v-for="row in items" :key="row.id" class="mg-sq-checks__row" role="listitem">
        <span class="mg-sq-checks__icon" aria-hidden="true">
          <span v-if="row.status === 'passed'" class="mg-sq-checks__pass">✓</span>
          <span v-else class="mg-sq-spin mg-sq-spin--sm" />
        </span>
        <span class="mg-sq-checks__name">{{ row.name }}</span>
        <span class="mg-sq-checks__dur">{{ row.duration }}</span>
      </li>
    </ul>
  </div>
</template>