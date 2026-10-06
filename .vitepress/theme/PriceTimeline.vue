<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ theme: { type: String, default: 'pulsefit' }, asset: { type: String, default: 'ETH (SOL)' }, position: { type: Boolean, default: true } })
const T = {
  lustro: ['#0b0b18', 'rgba(148,140,255,.08)', '#fff', '#a5b4fc', 'rgba(148,140,255,.22)', '#6366f1', '#fff', '#34d399', '#f472b6', "'DM Sans',sans-serif", '16px'],
  felix: ['#fefcf9', '#fff', '#082422', '#636158', '#cfcabf', '#065958', '#fff', '#1b8a4b', '#c0392b', "'Saans',sans-serif", '12px'],
  pulsefit: ['#f5f5f5', '#fff', '#212121', '#5f666d', '#e0e0e0', '#C9A66B', '#212121', '#198754', '#dc3545', "'Rubik',sans-serif", '16px'],
  scopecraft: ['#f4f4f5', '#fff', '#111113', '#6b6f76', '#e6e6e8', '#111113', '#fff', '#17803d', '#c62828', 'ui-sans-serif,system-ui,sans-serif', '8px'],
  lumen: ['#fbfbfa', '#fff', '#17171a', '#74767d', '#e7e7e9', '#7c6cf0', '#fff', '#1b9a4b', '#d23b3b', 'ui-sans-serif,system-ui,sans-serif', '14px']
}
const v = computed(() => { const t = T[props.theme] || T.pulsefit; return { '--p-bg': t[0], '--p-surf': t[1], '--p-ink': t[2], '--p-mut': t[3], '--p-bd': t[4], '--p-pri': t[5], '--p-prit': t[6], '--p-up': t[7], '--p-dn': t[8], '--p-font': t[9], '--p-r': t[10] } })
const ranges = { '1D': 48, '1W': 56, '1M': 60, '1Y': 72, YTD: 64, All: 80 }
const range = ref('1D')
const N = computed(() => ranges[range.value])
const seed = computed(() => Object.keys(ranges).indexOf(range.value) + 3)
const series = computed(() => {
  const out = []; let p = 1800 + seed.value * 12
  for (let i = 0; i < N.value; i++) { p += Math.sin(i * 0.7 * seed.value) * 18 + Math.cos(i * 0.23 + seed.value) * 14 + (i / N.value) * 6; out.push(Math.round(p * 100) / 100) }
  return out
})
const W = 280, H = 110
const split = computed(() => Math.floor(N.value * 0.7))
const lo = computed(() => Math.min(...series.value)), hi = computed(() => Math.max(...series.value))
const X = i => (i / (N.value - 1)) * W
const Y = val => H - 8 - ((val - lo.value) / (hi.value - lo.value || 1)) * (H - 16)
const path = (a, b) => series.value.slice(a, b).map((val, k) => (k ? 'L' : 'M') + X(a + k).toFixed(1) + ' ' + Y(val).toFixed(1)).join(' ')
const past = computed(() => path(0, split.value + 1))
const future = computed(() => path(split.value, N.value))
const hover = ref(null)
const idx = computed(() => hover.value ?? split.value)
const price = computed(() => series.value[idx.value])
const base = computed(() => series.value[0])
const pct = computed(() => ((price.value - base.value) / base.value) * 100)
const money = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
function move(e) { const r = e.currentTarget.getBoundingClientRect(); hover.value = Math.max(0, Math.min(N.value - 1, Math.round(((e.clientX - r.left) / r.width) * (N.value - 1)))) }
const open = ref(false), dir = ref('over'), stake = ref(120), placed = ref(false)
</script>

<template>
  <div class="ptl" :style="v">
    <div class="ptl-card">
      <div class="ptl-asset"><span>{{ asset }}</span><i class="ptl-logo" aria-hidden="true"></i></div>
      <div class="ptl-chart" @mousemove="move" @mouseleave="hover = null">
        <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="`Price chart for ${asset}, range ${range}. Solid line is history, grey line is the projected range.`">
          <path :d="past" fill="none" stroke="var(--p-up)" stroke-width="1.6" stroke-linejoin="round" />
          <path :d="future" fill="none" stroke="var(--p-bd)" stroke-width="1.6" stroke-linejoin="round" />
          <g v-if="hover !== null"><line :x1="X(hover)" :x2="X(hover)" y1="0" :y2="H" stroke="var(--p-mut)" stroke-dasharray="2 3" stroke-width=".8" /><circle :cx="X(hover)" :cy="Y(series[hover])" r="3" fill="var(--p-surf)" stroke="var(--p-ink)" stroke-width="1.2" /></g>
        </svg>
        <div v-if="hover !== null" class="ptl-tip" :style="{ left: Math.min(78, Math.max(0, (hover / (N - 1)) * 100 - 10)) + '%' }">{{ money(price) }}<small :class="pct >= 0 ? 'up' : 'dn'">{{ pct >= 0 ? '+' : '' }}{{ pct.toFixed(2) }}%</small></div>
      </div>
      <input class="ptl-sr" type="range" min="0" :max="N - 1" :value="idx" :aria-label="`Move through ${range} prices`" @input="hover = +$event.target.value" @blur="hover = null" />
      <div class="ptl-price" aria-live="polite">{{ money(price) }}</div>
      <div class="ptl-delta" :class="pct >= 0 ? 'up' : 'dn'">{{ pct >= 0 ? '+' : '' }}{{ pct.toFixed(2) }}%</div>
      <div class="ptl-tabs" role="group" aria-label="Range"><button v-for="(n, r) in ranges" :key="r" type="button" :aria-pressed="range === r" @click="range = r; hover = null">{{ r }}</button></div>
      <button v-if="position" type="button" class="ptl-open" @click="open = true; placed = false">Open position</button>
      <div v-if="open" class="ptl-modal" role="dialog" aria-label="Open new position">
        <template v-if="!placed">
          <label>Bet type<select><option>Over/under</option><option>Range</option></select></label>
          <label>Direction<select v-model="dir"><option value="over">Goes Over</option><option value="under">Goes Under</option></select></label>
          <label>Stake amount<input v-model="stake" type="number" min="1" /></label>
          <button type="button" class="ptl-go" @click="placed = true">Open New Position</button>
          <button type="button" class="ptl-x" @click="open = false">Cancel</button>
        </template>
        <template v-else><p>Position opened: {{ dir === 'over' ? 'Goes Over' : 'Goes Under' }} {{ money(price) }} · stake ${{ stake }}</p><small>Demo only, nothing is sent.</small><button type="button" class="ptl-x" @click="open = false">Close</button></template>
      </div>
    </div>
  </div>
</template>

<style>
.ptl{font-family:var(--p-font);background:var(--p-bg);border:1px solid var(--p-bd);border-radius:calc(var(--p-r) + 4px);padding:22px;margin:12px 0;display:flex;justify-content:center;color:var(--p-ink)}
.ptl-card{position:relative;width:300px;background:var(--p-surf);border:1px solid var(--p-bd);border-radius:var(--p-r);padding:18px;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.08)}
.ptl-asset{font-size:11px;color:var(--p-mut);display:flex;flex-direction:column;align-items:center;gap:8px;letter-spacing:.04em}
.ptl-logo{width:34px;height:34px;border-radius:50%;background:var(--p-pri);display:block;box-shadow:inset 0 0 0 8px var(--p-pri),inset 0 0 0 14px var(--p-surf)}
.ptl-chart{position:relative;margin:14px 0 6px;cursor:crosshair}.ptl-chart svg{display:block;width:100%;height:auto}
.ptl-tip{position:absolute;top:-6px;background:var(--p-surf);color:var(--p-ink);border:1px solid var(--p-bd);border-radius:8px;padding:3px 8px;font-size:11px;font-weight:600;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.12);white-space:nowrap}
.ptl-tip small,.ptl-delta{font-size:11px;margin-left:5px}.ptl .up{color:var(--p-up)}.ptl .dn{color:var(--p-dn)}.ptl-delta{margin:0;font-weight:600}
.ptl-price{font-size:26px;font-weight:700;margin-top:6px;font-variant-numeric:tabular-nums}
.ptl-tabs{display:flex;justify-content:center;gap:4px;margin-top:14px}
.ptl-tabs button{border:0;background:transparent;color:var(--p-mut);font:600 11px var(--p-font);padding:4px 8px;border-radius:6px;cursor:pointer}
.ptl-tabs button[aria-pressed=true]{background:var(--p-bd);color:var(--p-ink)}
.ptl button:focus-visible,.ptl select:focus-visible,.ptl input:focus-visible{outline:2px solid var(--p-pri);outline-offset:2px}
.ptl-sr{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}.ptl-sr:focus-visible{opacity:1;position:static;width:100%;pointer-events:auto}
.ptl-open,.ptl-go{margin-top:14px;width:100%;border:0;border-radius:calc(var(--p-r) - 4px);background:var(--p-pri);color:var(--p-prit);font:600 13px var(--p-font);padding:9px;cursor:pointer}
.ptl-modal{position:absolute;inset:auto 8px 8px 8px;background:var(--p-surf);border:1px solid var(--p-bd);border-radius:var(--p-r);padding:12px;display:flex;flex-direction:column;gap:8px;text-align:left;box-shadow:0 12px 32px rgba(0,0,0,.2);font-size:12px}
.ptl-modal label{display:flex;justify-content:space-between;align-items:center;gap:8px;font-weight:600}
.ptl-modal select,.ptl-modal input{font:12px var(--p-font);background:var(--p-bg);color:var(--p-ink);border:1px solid var(--p-bd);border-radius:6px;padding:4px 8px;width:120px}
.ptl-modal .ptl-go{margin-top:2px}.ptl-x{border:0;background:transparent;color:var(--p-mut);font:12px var(--p-font);cursor:pointer}.ptl-modal p{margin:0}
@media (prefers-reduced-motion:no-preference){.ptl-chart path{transition:d .3s}}
</style>
