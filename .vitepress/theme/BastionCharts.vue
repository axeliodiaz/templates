<script setup>
import { computed, onMounted, ref } from 'vue'

const range = ref('24h')
const ready = ref(false)
const selected = ref('api')
const series = {
  '24h': { points: '0,40 16,36 32,38 48,28 64,30 80,18 96,16 112,10', bars: [18, 62, 24, 11] },
  '7d': { points: '0,30 16,34 32,22 48,26 64,18 80,20 96,12 112,14', bars: [22, 48, 31, 16] },
}
const names = ['api', 'worker', 'db', 'cache']
const active = computed(() => series[range.value])
onMounted(() => { ready.value = true })
</script>

<template>
  <div class="bst-root" data-bs-theme="dark">
    <div class="bst" :class="{ 'is-ready': ready }">
      <p class="bst-sample"><strong>SAMPLE</strong><span>Chart figures are fictitious. The number next to each bar is the value, not only the length.</span></p>
      <div class="row g-2">
        <div class="col-12 md:col-6">
          <section class="bst-panel">
            <header class="bst-ph"><span>Uptime sparkline</span><span class="bst-rule" aria-hidden="true"></span></header>
            <div class="bst-body bst-chart-card">
              <div class="bst-row" role="group" aria-label="Sample range">
                <button v-for="item in ['24h', '7d']" :key="item" type="button" class="btn-outline theme-success btn-sm" :aria-pressed="range === item" @click="range = item">{{ item }}</button>
              </div>
              <svg class="bst-spark" viewBox="0 0 112 48" style="width:100%;height:72px" role="img" :aria-label="`Sample uptime trend, ${range}`">
                <polyline :points="active.points" />
              </svg>
              <p class="bst-note">Stroke draws once. Reduced motion shows the finished line.</p>
            </div>
          </section>
        </div>
        <div class="col-12 md:col-6">
          <section class="bst-panel">
            <header class="bst-ph"><span>CPU meters</span><span class="bst-rule" aria-hidden="true"></span></header>
            <div class="bst-body">
              <div v-for="(name, i) in names" :key="name" class="bst-meter-wrap" style="margin-bottom:8px">
                <span class="bst-svc" style="width:64px">{{ name }}</span>
                <div class="progress bst-meter" role="progressbar" :aria-valuenow="active.bars[i]" aria-valuemin="0" aria-valuemax="100" :aria-label="`${name} CPU ${active.bars[i]} percent`">
                  <div class="progress-bar" :class="active.bars[i] >= 60 ? 'theme-warning' : 'theme-success'" :style="{ '--w': active.bars[i] + '%' }"></div>
                </div>
                <span class="bst-pct" :class="{ 'is-warn': active.bars[i] >= 60 }">{{ active.bars[i] }}%</span>
              </div>
            </div>
          </section>
        </div>
        <div class="col-12">
          <section class="bst-panel">
            <header class="bst-ph"><span>Request bars</span><span class="bst-rule" aria-hidden="true"></span></header>
            <div class="bst-body">
              <div class="bst-bars" role="img" aria-label="Sample request counts by service">
                <button v-for="(name, i) in names" :key="name" type="button" :class="{ 'is-warn': active.bars[i] >= 60 }" :style="{ height: active.bars[i] + '%' }" :aria-pressed="selected === name" :aria-label="`${name} ${active.bars[i]} percent`" @click="selected = name"></button>
              </div>
              <p class="bst-note" role="status">Selected {{ selected }}. Counts are sample percentages, not live traffic.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
