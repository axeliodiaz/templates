<script setup>
import { onMounted, ref } from 'vue'
import { reducedMotion } from './bastion-motion'

const reduced = ref(false)
const play = ref(0)
const width = ref('0%')
onMounted(() => {
  reduced.value = reducedMotion()
  width.value = reduced.value ? '62%' : '0%'
  requestAnimationFrame(() => { width.value = '62%' })
})
function replay() {
  play.value += 1
  width.value = '0%'
  requestAnimationFrame(() => { width.value = '62%' })
}
</script>

<template>
  <div class="bst-root" data-bs-theme="dark">
    <div class="bst is-ready">
      <p class="bst-sample"><strong>SAMPLE</strong><span>{{ reduced ? 'Reduced motion is on. Indicators stay visible and still.' : 'Motion is on. Lamps blink, the meter fills, and the scan is slow.' }}</span></p>
      <div class="row g-2">
        <div class="col-12 md:col-4">
          <section class="bst-panel" :key="'led' + play">
            <header class="bst-ph"><span>Status lamp</span></header>
            <div class="bst-body"><p class="bst-nominal"><span class="bst-led" aria-hidden="true"></span>ALL SYSTEMS NOMINAL</p><p class="bst-note">2.2s blink. The words carry the state.</p></div>
          </section>
        </div>
        <div class="col-12 md:col-4">
          <section class="bst-panel">
            <header class="bst-ph"><span>Meter</span></header>
            <div class="bst-body">
              <div class="progress bst-meter" role="progressbar" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100" aria-label="Worker CPU 62 percent">
                <div class="progress-bar theme-warning" :style="{ width }"></div>
              </div>
              <p class="bst-note">Fills over 800ms on the dashboard. Value stays 62%.</p>
            </div>
          </section>
        </div>
        <div class="col-12 md:col-4">
          <section class="bst-panel" :key="'ping' + play">
            <header class="bst-ph"><span>Map ping</span></header>
            <div class="bst-body">
              <svg viewBox="0 0 80 48" width="80" height="48" aria-hidden="true">
                <circle class="ping stroke-ok" cx="24" cy="24" r="6" />
                <circle class="city fill-ok" cx="24" cy="24" r="3" />
              </svg>
              <p class="bst-note">2.4s ring. A text list on the dashboard names each city.</p>
            </div>
          </section>
        </div>
      </div>
      <p class="bst-note" style="margin-top:10px">Entrance 450ms. Sparkline draw 1.2s. Log line 350ms. Scan sweep 7.5s. Buttons move 1px. Reduced motion removes animation and transition and keeps the final numbers.</p>
      <button type="button" class="btn-outline theme-success btn-sm" @click="replay">Replay sample</button>
    </div>
  </div>
</template>
