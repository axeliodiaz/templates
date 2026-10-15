<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ language: { type: String, default: 'lustro' } })
// Fictitious monthly spend per category. null = no payment that month. The last period is the current one (incomplete).
const periods = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
const series = [
  { id: 'power', label: 'Power', values: [96, 88, 81, 79, 70, 64, 31] },
  { id: 'water', label: 'Water', values: [24, 26, null, 25, 29, 31, 12] },
  { id: 'internet', label: 'Internet', values: [38, 38, 38, 41, 41, 41, 41] },
  { id: 'gym', label: 'Gym', values: [null, null, 45, 45, 52, 52, 52] },
]
const sel = ref('all')
const run = ref(0)
const options = [{ id: 'all', label: 'All' }, ...series.map((s) => ({ id: s.id, label: s.label }))]
function choose(id) { sel.value = id; run.value++ }
const values = computed(() => periods.map((_, i) => {
  const rows = sel.value === 'all' ? series : series.filter((s) => s.id === sel.value)
  const vs = rows.map((s) => s.values[i]).filter((v) => v !== null)
  return vs.length ? vs.reduce((a, b) => a + b, 0) : null
}))
const complete = computed(() => values.value.slice(0, -1))
const max = computed(() => Math.max(10, ...values.value.filter((v) => v !== null)) * 1.15)
const W = 360, H = 190, L = 34, B = 24, T = 14
const bw = computed(() => (W - L - 8) / periods.length)
const x = (i) => L + i * bw.value + bw.value * 0.18
const y = (v) => T + (H - T - B) * (1 - v / max.value)
const fit = computed(() => {
  const pts = complete.value.map((v, i) => [i, v]).filter((p) => p[1] !== null)
  if (pts.length < 3) return null
  const n = pts.length, sx = pts.reduce((a, p) => a + p[0], 0), sy = pts.reduce((a, p) => a + p[1], 0)
  const sxy = pts.reduce((a, p) => a + p[0] * p[1], 0), sxx = pts.reduce((a, p) => a + p[0] * p[0], 0)
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx)
  const icpt = (sy - slope * sx) / n
  return { slope, icpt }
})
const line = computed(() => {
  if (!fit.value) return ''
  const a = fit.value.icpt, b = fit.value.slope, last = complete.value.length - 1
  const px = (i) => x(i) + bw.value * 0.32
  return `M${px(0)} ${y(a)} L${px(last)} ${y(a + b * last)}`
})
const note = computed(() => {
  if (!fit.value) return 'Not enough data: the trend needs 3 or more complete months.'
  const s = fit.value.slope
  return `${s < 0 ? 'Falls' : 'Rises'} about $${Math.abs(Math.round(s)).toLocaleString('en-US')} per month (complete months only).`
})
const label = computed(() => `Monthly spend, ${options.find((o) => o.id === sel.value).label}. ${note.value}`)
const ticks = computed(() => [0, 0.5, 1].map((t) => Math.round((max.value / 1.15) * t)))
</script>

<template>
<div class="st" :class="[`cg`, `cg-${props.language}`]">
  <div class="st-bar" role="group" aria-label="Series filter">
    <button v-for="o in options" :key="o.id" type="button" class="st-btn" :aria-pressed="sel === o.id" @click="choose(o.id)">{{ o.label }}</button>
  </div>
  <svg :key="run" class="st-plot" :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="label">
    <g v-for="t in ticks" :key="t"><line :x1="L" :x2="W - 4" :y1="y(t)" :y2="y(t)" class="st-grid"/><text :x="L - 6" :y="y(t) + 4" text-anchor="end" class="st-tick">${{ t }}</text></g>
    <g v-for="(v, i) in values" :key="periods[i]">
      <rect v-if="v !== null" :x="x(i)" :y="y(v)" :width="bw * 0.64" :height="H - B - y(v)" rx="4" class="st-bar-rect" :class="{ 'is-current': i === periods.length - 1 }" :style="{ animationDelay: `${i * 60}ms` }"/>
      <text v-else :x="x(i) + bw * 0.32" :y="H - B - 6" text-anchor="middle" class="st-tick">—</text>
      <text :x="x(i) + bw * 0.32" :y="H - 8" text-anchor="middle" class="st-tick">{{ periods[i] }}</text>
      <text v-if="v !== null" :x="x(i) + bw * 0.32" :y="y(v) - 4" text-anchor="middle" class="st-val" :style="{ animationDelay: `${i * 60 + 250}ms` }">{{ v }}</text>
    </g>
    <path v-if="line" :d="line" class="st-trend" vector-effect="non-scaling-stroke"/>
  </svg>
  <p class="st-note">{{ note }} Sep is the current month and is left out.</p>
  <table class="st-list"><tbody>
    <tr v-for="(v, i) in values" :key="periods[i]"><th scope="row">{{ periods[i] }}{{ i === periods.length - 1 ? ' (current)' : '' }}</th><td>{{ v === null ? '—' : `$${v.toLocaleString('en-US')}` }}</td></tr>
  </tbody></table>
</div>
</template>

<style>
.st{background:var(--cg-panel);border:1px solid var(--cg-line);border-radius:18px;padding:18px;color:var(--cg-text);font-size:13px;max-width:620px}
.st-bar{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
.st-btn{border:1px solid var(--cg-line);background:transparent;color:var(--cg-text);border-radius:999px;padding:4px 12px;font:inherit;font-size:12px;cursor:pointer;transition:background .2s,color .2s,border-color .2s}
.st-btn:hover{border-color:var(--cg-accent)}
.st-btn[aria-pressed="true"]{background:var(--cg-accent);border-color:var(--cg-accent);color:var(--cg-ink)}
.st-btn:focus-visible{outline:2px solid var(--cg-accent);outline-offset:2px}
.st-plot{width:100%;height:auto;display:block}
.st-grid{stroke:var(--cg-line);stroke-dasharray:3 3}
.st-tick{fill:var(--cg-muted);font-size:10px;font-variant-numeric:tabular-nums}
.st-val{fill:var(--cg-text);font-size:10px;font-weight:600;font-variant-numeric:tabular-nums;animation:cg-reveal .35s both}
.st-bar-rect{fill:var(--cg-accent);transform-box:fill-box;transform-origin:bottom;animation:st-grow .5s cubic-bezier(.2,.8,.2,1) both}
.st-bar-rect.is-current{opacity:.45}
.st-trend{fill:none;stroke:var(--cg-text);stroke-width:2;stroke-linecap:round;stroke-dasharray:3000;animation:st-draw .7s ease-out .45s both}
.st-note{margin:8px 0 10px;color:var(--cg-muted);font-size:12px}
.st .st-list{display:table;width:100%;margin:12px 0 0;border-collapse:collapse;font-variant-numeric:tabular-nums;background:transparent}
.st .st-list tr,.st .st-list tbody{background:transparent!important}
.st .st-list th,.st .st-list td{padding:4px 0;border:0;border-top:1px solid var(--cg-line);text-align:left;font-weight:400;font-size:13px;background:transparent!important;color:var(--cg-text)}
.st .st-list td{text-align:right}
@keyframes st-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes st-draw{from{stroke-dashoffset:3000}to{stroke-dashoffset:0}}
@media(prefers-reduced-motion:reduce){.st-bar-rect,.st-val,.st-trend{animation:none!important}.st-btn{transition:none}}
</style>
