<script setup>
import { inject, onMounted, ref, computed, watch } from 'vue'
import FelixJsonChart from './FelixJsonChart.vue'
import chartExamples from './felix-chart-examples.json'

const variant = ref('multiple')
const chartRef = ref(null)
const state = ref('ready')
const motionReady = ref(false)
const previewDark = inject('marginGuidePreviewDark', ref(false))

const bundle = computed(() => {
  const base = structuredClone(chartExamples.examples.arc)
  const sources = structuredClone(chartExamples.sources)
  if (variant.value === 'single') {
    base.data.source = 'sample.arc.single'
    base.options = {
      ...base.options,
      arcMode: 'single',
      title: 'Single limit',
    }
    base.title = 'Single arc limit'
  } else if (variant.value === 'compact') {
    base.options = {
      ...base.options,
      strokeWidth: 10,
      baseRadius: 72,
      ringGap: 14,
    }
    base.title = 'Compact multi-series'
  } else if (variant.value === 'unavailable') {
    base.title = 'With unavailable series'
  } else {
    base.title = 'Independent usage limits'
  }
  const sourceId = base.data.source
  return {
    spec: base,
    sources: {
      [sourceId]: structuredClone(sources[sourceId]),
    },
  }
})

watch(variant, () => chartRef.value?.replay())

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
    <div class="mg-graph-toolbar" role="toolbar" aria-label="Arc meter preview controls">
      <button type="button" class="btn btn-outline-secondary btn-sm" @click="replay">Replay</button>
      <button type="button" class="btn btn-outline-secondary btn-sm" @click="shuffle">Shuffle data</button>
      <label class="mg-graph-variant">
        Variant
        <select v-model="variant">
          <option value="single">Single</option>
          <option value="multiple">Multiple (2–4 rings)</option>
          <option value="unavailable">With unavailable</option>
          <option value="compact">Compact size</option>
        </select>
      </label>
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
.mg-graph-variant,
.mg-graph-state {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink);
}
.mg-graph-variant select,
.mg-graph-state select {
  font: inherit;
  font-size: 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 7px 10px;
  background: var(--surface);
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