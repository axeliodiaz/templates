<script setup>
import { inject, onMounted, ref, computed } from 'vue'
import FelixJsonChart from './FelixJsonChart.vue'
import chartExamples from './felix-chart-examples.json'

const props = defineProps({
  exampleKey: { type: String, required: true },
})

const chartRef = ref(null)
const state = ref('ready')
const motionReady = ref(false)
const previewDark = inject('marginGuidePreviewDark', ref(false))

const bundle = computed(() => {
  const spec = structuredClone(chartExamples.examples[props.exampleKey])
  const sourceId = spec.data.source
  const sources = { [sourceId]: structuredClone(chartExamples.sources[sourceId]) }
  return { spec, sources }
})

onMounted(() => {
  requestAnimationFrame(() => {
    motionReady.value = true
  })
})

function replay() {
  chartRef.value?.replay()
}
function shuffle() {
  chartRef.value?.shuffleData()
}
</script>
<template>
  <div class="mg-graph-lab lab b2-margin" :class="{ 'lab-dark': previewDark }">
    <div class="mg-graph-toolbar" role="toolbar" aria-label="Chart preview controls">
      <button type="button" class="btn btn-outline-secondary btn-sm" @click="replay">Replay</button>
      <button type="button" class="btn btn-outline-secondary btn-sm" @click="shuffle">Shuffle data</button>
      <label class="mg-graph-state">
        <span class="visually-hidden">Data state</span>
        Data state
        <select v-model="state">
          <option value="ready">Ready</option>
          <option value="loading">Loading</option>
          <option value="empty">Empty</option>
        </select>
      </label>
    </div>
    <FelixJsonChart
      ref="chartRef"
      embedded
      hide-chrome
      :preview-state="state"
      :motion-ready="motionReady"
      :spec="bundle.spec"
      :sources="bundle.sources"
    />
  </div>
</template>
<style scoped>
.mg-graph-state {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink);
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>