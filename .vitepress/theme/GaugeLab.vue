<script setup>
import { ref, computed } from 'vue'
import Gauge from './Gauge.vue'
const props = defineProps({ theme: { type: String, default: 'pulsefit' } })
const T = {
  lustro: ['#0b0b18', 'rgba(148,140,255,.08)', '#fff', '#a5b4fc', 'rgba(148,140,255,.22)', '#6366f1', '#34d399', '#fbbf24', '#f472b6', "'DM Sans',sans-serif", '16px', '#fff'],
  felix: ['#fefcf9', '#fff', '#082422', '#636158', '#e3ded3', '#065958', '#1b8a4b', '#b77900', '#c0392b', "'Saans',sans-serif", '12px', '#fff'],
  pulsefit: ['#f5f5f5', '#fff', '#212121', '#5f666d', '#e0e0e0', '#C9A66B', '#198754', '#b77900', '#dc3545', "'Rubik',sans-serif", '16px', '#212121'],
  scopecraft: ['#f4f4f5', '#fff', '#111113', '#6b6f76', '#e6e6e8', '#111113', '#17803d', '#a05a00', '#c62828', 'ui-sans-serif,system-ui,sans-serif', '8px', '#fff'],
  lumen: ['#fbfbfa', '#fff', '#17171a', '#74767d', '#e7e7e9', '#7c6cf0', '#1b9a4b', '#d9770a', '#d23b3b', "'Plus Jakarta Sans',sans-serif", '14px', '#fff']
}
const v = computed(() => { const t = T[props.theme] || T.pulsefit; return { '--g-bg': t[0], '--g-surf': t[1], '--g-ink': t[2], '--g-mut': t[3], '--g-track': t[4], '--g-pri': t[5], '--g-ok': t[6], '--g-warn': t[7], '--g-bad': t[8], '--g-font': t[9], '--g-r': t[10], '--g-prit': t[11] } })
const val = ref(62), min = ref(0), max = ref(100), start = ref(-135), end = ref(135), width = ref(12), mode = ref('both'), ticks = ref(10), cap = ref('round')
const zones = computed(() => [{ from: min.value, to: min.value + (max.value - min.value) * .6, color: 'var(--g-pri)' }, { from: min.value + (max.value - min.value) * .6, to: min.value + (max.value - min.value) * .85, color: 'var(--g-warn)' }, { from: min.value + (max.value - min.value) * .85, to: max.value, color: 'var(--g-bad)' }])
const presets = [
  { n: 'Simple', value: 62, mode: 'arc', unit: '%' },
  { n: 'Speedometer', value: 132, min: 0, max: 240, mode: 'needle', ticks: 12, labels: ['0', '40', '80', '120', '160', '200', '240'], unit: 'km/h', zones: [{ from: 200, to: 240, color: 'var(--g-bad)' }] },
  { n: 'Fuel', value: 38, min: 0, max: 100, start: -60, end: 60, mode: 'needle', ticks: 4, labels: ['E', '', 'F'], unit: '%' },
  { n: 'Temperature', value: 21.5, min: 10, max: 30, mode: 'arc', unit: '°C', decimals: 1 },
  { n: 'Progress ring', value: 74, mode: 'arc', start: 0, end: 359.9, unit: '%', cap: 'butt' },
  { n: 'Power meter', value: 3, min: -10, max: 10, start: -100, end: 100, mode: 'needle', ticks: 8, labels: ['-10', '-5', '0', '5', '10'], unit: 'kW' },
  { n: 'Battery', value: 64, mode: 'arc', start: -120, end: 120, unit: '%', zones: [{ from: 0, to: 20, color: 'var(--g-bad)' }] },
  { n: 'CPU load', value: 41, mode: 'both', ticks: 10, unit: '%', zones: [{ from: 85, to: 100, color: 'var(--g-bad)' }] }
]
const cur = ref(0)
const p = computed(() => presets[cur.value])
const rnd = () => { val.value = Math.round(min.value + Math.random() * (max.value - min.value)) }
</script>

<template>
  <div class="gl" :style="v">
    <div class="gl-grid">
      <div class="gl-card" v-for="(g, i) in presets" :key="g.n"><Gauge :value="g.value" :min="g.min ?? 0" :max="g.max ?? 100" :start="g.start ?? -135" :end="g.end ?? 135" :mode="g.mode" :ticks="g.ticks ?? 0" :labels="g.labels ?? []" :zones="g.zones ?? []" :unit="g.unit ?? ''" :label="g.n" :cap="g.cap ?? 'round'" :decimals="g.decimals ?? 0" :size="150" /></div>
    </div>
    <div class="gl-lab">
      <div class="gl-prev"><Gauge :value="val" :min="min" :max="max" :start="start" :end="end" :mode="mode" :ticks="ticks" :zones="zones" :width="width" :cap="cap" unit="units" label="Playground" :size="240" /></div>
      <div class="gl-ctl" role="group" aria-label="Gauge controls">
        <label>Value <input type="range" :min="min" :max="max" v-model.number="val" /><b>{{ val }}</b></label>
        <label>Min <input type="number" v-model.number="min" /></label>
        <label>Max <input type="number" v-model.number="max" /></label>
        <label>Start angle <input type="range" min="-180" max="0" v-model.number="start" /><b>{{ start }}</b></label>
        <label>End angle <input type="range" min="0" max="360" v-model.number="end" /><b>{{ end }}</b></label>
        <label>Track width <input type="range" min="4" max="28" v-model.number="width" /><b>{{ width }}</b></label>
        <label>Ticks <input type="range" min="0" max="20" v-model.number="ticks" /><b>{{ ticks }}</b></label>
        <label>Mode <select v-model="mode"><option value="arc">Arc</option><option value="needle">Needle</option><option value="both">Arc + needle</option></select></label>
        <label>Cap <select v-model="cap"><option value="round">Round</option><option value="butt">Butt</option></select></label>
        <button type="button" @click="rnd">Random value</button>
      </div>
    </div>
  </div>
</template>

<style>
.gl{background:var(--g-bg);border:1px solid var(--g-track);border-radius:calc(var(--g-r) + 4px);padding:18px;margin:12px 0;font-family:var(--g-font);color:var(--g-ink)}
.gl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:12px}
.gl-card{background:var(--g-surf);border:1px solid var(--g-track);border-radius:var(--g-r);padding:10px 4px 8px}
.gl-lab{display:grid;grid-template-columns:260px 1fr;gap:18px;margin-top:16px;background:var(--g-surf);border:1px solid var(--g-track);border-radius:var(--g-r);padding:14px;align-items:center}
.gl-ctl{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}
.gl-ctl label{display:grid;grid-template-columns:90px 1fr 36px;gap:8px;align-items:center;font-size:12px;color:var(--g-mut)}
.gl-ctl label:has(input[type=number]),.gl-ctl label:has(select){grid-template-columns:90px 1fr}
.gl-ctl b{color:var(--g-ink);font-size:12px;text-align:right}
.gl-ctl input,.gl-ctl select{accent-color:var(--g-pri);font:12px var(--g-font);background:var(--g-bg);color:var(--g-ink);border:1px solid var(--g-track);border-radius:6px;padding:3px 6px;min-width:0}
.gl-ctl input[type=range]{padding:0;border:0;background:none}
.gl-ctl button{border:0;border-radius:calc(var(--g-r) - 4px);background:var(--g-pri);color:var(--g-prit);font:600 12px var(--g-font);padding:8px 12px;cursor:pointer;grid-column:1/-1}
.gl button:focus-visible,.gl input:focus-visible,.gl select:focus-visible{outline:2px solid var(--g-pri);outline-offset:2px}
@media(max-width:700px){.gl-lab{grid-template-columns:1fr}}
</style>
