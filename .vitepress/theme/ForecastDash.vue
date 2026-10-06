<script setup>
import { ref, computed, onMounted } from 'vue'
import { animate, stagger } from 'motion'
const props = defineProps({ theme: { type: String, default: 'pulsefit' } })
const T = {
  lustro: ['#0b0b18', 'rgba(148,140,255,.08)', '#fff', '#a5b4fc', 'rgba(148,140,255,.22)', '#6366f1', '#fff', '#34d399', '#f472b6', 'rgba(99,102,241,.2)', "'DM Sans',sans-serif", '14px', '#6366f1', '#fbbf24', '#22d3ee', '#f472b6', '#64648c'],
  felix: ['#fefcf9', '#fff', '#082422', '#636158', '#e3ded3', '#065958', '#fff', '#1b8a4b', '#c0392b', '#e3efee', "'Saans',sans-serif", '10px', '#065958', '#c9772b', '#7fb7b5', '#e0b778', '#a8a89c'],
  pulsefit: ['#f5f5f5', '#fff', '#212121', '#5f666d', '#e0e0e0', '#C9A66B', '#212121', '#198754', '#dc3545', '#f5e6d3', "'Rubik',sans-serif", '14px', '#7a5a1f', '#C9A66B', '#b8c4cc', '#e6d2b0', '#b0b0b0'],
  scopecraft: ['#f4f4f5', '#fff', '#111113', '#6b6f76', '#e6e6e8', '#111113', '#fff', '#17803d', '#c62828', '#ececee', 'ui-sans-serif,system-ui,sans-serif', '8px', '#111113', '#2f6fdc', '#9aa0aa', '#c4c7ce', '#d9dadd'],
  lumen: ['#fbfbfa', '#fff', '#17171a', '#74767d', '#e7e7e9', '#7c6cf0', '#fff', '#1b9a4b', '#d23b3b', '#ece9fd', "'Plus Jakarta Sans',sans-serif", '12px', '#7c6cf0', '#f5b800', '#0fb0ea', '#e08a1e', '#b5b7bd']
}
const v = computed(() => { const t = T[props.theme] || T.pulsefit; const k = ['bg', 'surf', 'ink', 'mut', 'bd', 'pri', 'prit', 'ok', 'bad', 'soft', 'font', 'r', 'c1', 'c2', 'c3', 'c4', 'c5']; return Object.fromEntries(k.map((n, i) => ['--f-' + n, t[i]])) })
const mode = ref('Daily')
const modes = ['Daily', 'Weekly', 'Menu demand']
const drivers = [['Reservations', '86 booked, 22 more than usual', 22], ['Weather', '24C and clear, patio open', 14], ['Promotion', 'Two for Tuesday pasta', 9], ['Local event', 'Harbor night market, 6 to 10 PM', 6], ['Menu change', 'Soup is off the specials board', -3]]
const on = ref(drivers.map(() => true))
const base = 264
const total = computed(() => base + drivers.reduce((a, d, i) => a + (on.value[i] ? d[2] : 0), 0))
const delta = computed(() => Math.round((total.value / base - 1) * 100))
// dot matrix: 11 AM..10 PM, 54 columns x 17 rows
const COLS = 54, ROWS = 17
const prof = x => 4 + 8.5 * Math.exp(-((x - 10) ** 2) / 30) + 14 * Math.exp(-((x - 38) ** 2) / 60)
const scale = computed(() => total.value / 312)
const dots = computed(() => { const o = []; for (let c = 0; c < COLS; c++) { const h = Math.max(0, Math.round(prof(c) * scale.value * (c > 24 && c < 28 ? 0.2 : 1) * 0.6)); for (let r = 0; r < ROWS; r++) o.push({ x: 6 + c * 10, y: 6 + (ROWS - 1 - r) * 10, f: r < h && h > 1 }) } return o })
const hours = [['11 AM', 0], ['1 PM', 10], ['3 PM', 20], ['5 PM', 29], ['7 PM', 39], ['9 PM', 49]]
const demand = [['Chicken dishes', '+18%', 'Spike', 'Demand spike: 18% above the normal Tuesday level.', [8, 7, 8, 6, 5, 3], 1], ['Salads', '+11%', '', 'Warm evening and an open patio lift salad orders.', [8, 7, 6, 6, 4, 2], 1], ['Soup', '-24%', '', 'Warm weather and no soup on the specials board.', [2, 3, 3, 5, 6, 8], -1], ['Burrata', 'New', 'Low confidence', 'Not enough history yet: 4 days of sales so far.', [8, 7, 6, 5, 4, 2], 1]]
const sp = a => a.map((y, i) => (i ? 'L' : 'M') + (i * 16) + ' ' + (y * 3 + 4)).join(' ')
const root = ref(null)
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.value) return
  animate(root.value.querySelectorAll('.fc-c,.fc-d,.fc-m'), { opacity: [0, 1], y: [8, 0] }, { delay: stagger(0.05), duration: 0.4 })
  animate(root.value.querySelectorAll('.fc-dot.f'), { opacity: [0, 1], scale: [0.3, 1] }, { delay: stagger(0.002, { startDelay: 0.3 }), duration: 0.3 })
})
</script>

<template>
  <div class="fc" :style="v" ref="root">
    <div class="fc-head"><div><b>Forecast</b> <small>Tuesday, October 6</small></div><div class="fc-act"><span class="fc-btn">Regenerate</span><span class="fc-btn dark">Generate prep plan</span></div></div>
    <div class="fc-bar"><span class="fc-btn">Tue, Oct 6</span><span class="fc-seg"><button v-for="m in modes" :key="m" type="button" :class="{ on: mode === m }" @click="mode = m">{{ m }}</button></span><small>Built from 12 weeks of sales, reservations, weather and events</small></div>
    <div class="fc-g">
      <div class="fc-c"><div class="fc-ch"><b><i class="fc-ai"></i> Tomorrow's forecast</b><small class="fc-chip">Forecast ready 9:12 PM</small></div>
        <div class="fc-top"><div><div class="fc-big">{{ total }} <small>expected covers</small></div><b :class="delta >= 0 ? 'ok' : 'bad'">{{ delta >= 0 ? '&#9650; +' : '&#9660; ' }}{{ delta }}%</b> <small>vs {{ base }} on a typical Tuesday</small></div>
          <div class="fc-conf"><small>Confidence</small><b>87% High</b><small>Likely range {{ Math.round(total * .95) }} to {{ Math.round(total * 1.05) }} covers</small></div></div>
        <div class="fc-k3"><div class="fc-m"><b>104 covers</b><small>Lunch, 11 AM to 3 PM</small></div><div class="fc-m"><b>208 covers</b><small>Dinner, 5 PM to 10 PM</small></div><div class="fc-m"><b>6:40 PM</b><small>Peak, 28 covers in 20 minutes</small></div></div>
        <div class="fc-ch"><b>Covers through the day</b><small>Each dot is one cover</small></div>
        <svg viewBox="0 0 548 190" role="img" aria-label="Dot chart of covers by time, a small lunch hump and a larger dinner peak around 6:40 PM"><circle v-for="(d, i) in dots" :key="i" :cx="d.x" :cy="d.y" r="3.6" :class="['fc-dot', d.f ? 'f' : '']" /><text v-for="h in hours" :key="h[0]" :x="6 + h[1] * 10" y="188">{{ h[0] }}</text></svg>
      </div>
      <div class="fc-c"><div class="fc-ch"><b>What is driving it</b></div>
        <div class="fc-d base"><span>A typical Tuesday</span><b>{{ base }}</b></div>
        <button v-for="(d, i) in drivers" :key="d[0]" type="button" class="fc-d" :aria-pressed="on[i]" @click="on[i] = !on[i]"><i></i><span><b>{{ d[0] }}</b><small>{{ d[1] }}</small></span><b :class="d[2] < 0 ? 'bad' : 'ok'">{{ d[2] > 0 ? '+' : '' }}{{ d[2] }}</b></button>
        <div class="fc-d tot"><span>Forecast for Tue, Oct 6</span><b>{{ total }}</b></div>
        <p class="fc-note"><b>How sure is this?</b> On 7 of the last 8 Tuesdays the forecast landed within 5% of actual covers.</p>
      </div>
    </div>
    <div class="fc-ch"><b class="fc-h">Demand changes</b><small>Compared with a typical Tuesday</small></div>
    <div class="fc-4"><div v-for="d in demand" :key="d[0]" class="fc-m card"><div class="fc-dh"><i></i><b>{{ d[0] }}</b><small v-if="d[2]" class="fc-chip">{{ d[2] }}</small></div><div class="fc-dv"><span>{{ d[1] }}</span><svg viewBox="0 0 80 30"><path :d="sp(d[4])" fill="none" :stroke="d[5] > 0 ? 'var(--f-pri)' : 'var(--f-mut)'" stroke-width="1.8" /></svg></div><small>{{ d[3] }}</small></div></div>
  </div>
</template>

<style>
.fc{background:var(--f-bg);border:1px solid var(--f-bd);border-radius:calc(var(--f-r) + 4px);padding:14px;margin:12px 0;font:13px/1.4 var(--f-font);color:var(--f-ink);text-align:left;display:flex;flex-direction:column;gap:12px}
.fc *{box-sizing:border-box}.fc p{margin:0!important}.fc small{font-size:11px;color:var(--f-mut)}.fc b{font-weight:600}
.fc-head,.fc-bar,.fc-ch{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}.fc-head b{font-size:17px}.fc-act{display:flex;gap:8px;flex-wrap:wrap}
.fc-btn{border:1px solid var(--f-bd);background:var(--f-surf);border-radius:calc(var(--f-r) - 4px);padding:6px 12px;font-weight:600;font-size:12px}.fc-btn.dark{background:var(--f-ink);color:var(--f-bg);border-color:var(--f-ink)}
.fc-seg{display:inline-flex;background:var(--f-soft);border-radius:calc(var(--f-r) - 4px);padding:2px}.fc-seg button{border:0;background:transparent;color:var(--f-mut);padding:4px 12px;border-radius:calc(var(--f-r) - 6px);font:600 12px var(--f-font);cursor:pointer}.fc-seg button.on{background:var(--f-surf);color:var(--f-ink)}
.fc button:focus-visible{outline:2px solid var(--f-pri);outline-offset:2px}
.fc-g{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,1fr);gap:12px}
.fc-c{background:var(--f-surf);border:1px solid var(--f-bd);border-radius:var(--f-r);padding:12px;min-width:0}
.fc-ai{display:inline-block;width:20px;height:20px;border-radius:6px;background:var(--f-pri);vertical-align:-4px;margin-right:6px}.fc-chip{border:1px solid var(--f-pri);border-radius:6px;padding:1px 7px;color:var(--f-ink)}
.fc-top{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:10px 0}.fc-big{font:500 40px/1.1 var(--f-font)}.fc-big small{font-size:14px}
.fc-conf{background:var(--f-bg);border-radius:var(--f-r);padding:10px 12px;display:flex;flex-direction:column;gap:2px}
.fc .ok{color:var(--f-ok)}.fc .bad{color:var(--f-bad)}
.fc-k3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:10px}.fc-m{background:var(--f-bg);border-radius:calc(var(--f-r) - 2px);padding:10px;display:flex;flex-direction:column;gap:2px}.fc-m b{font-size:15px}
.fc svg{display:block;width:100%;height:auto}.fc svg text{fill:var(--f-mut);font:10px var(--f-font)}.fc-dot{fill:var(--f-soft)}.fc-dot.f{fill:var(--f-pri);transition:opacity .2s}
.fc-d{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;width:100%;border:0;background:var(--f-bg);color:var(--f-ink);border-radius:calc(var(--f-r) - 2px);padding:9px 10px;margin-bottom:6px;font:13px var(--f-font);text-align:left}
button.fc-d{grid-template-columns:20px 1fr auto;cursor:pointer}button.fc-d i{width:16px;height:16px;border-radius:50%;border:2px solid var(--f-mut)}button.fc-d[aria-pressed=true] i{background:var(--f-pri);border-color:var(--f-pri)}button.fc-d[aria-pressed=false]{opacity:.5}
.fc-d span{display:flex;flex-direction:column}.fc-d.base{background:transparent;padding-left:0}.fc-d.tot{background:var(--f-soft);font-weight:600}
.fc-note{background:var(--f-bg);border-radius:var(--f-r);padding:10px;margin-top:8px!important;font-size:12px}
.fc-h{font-size:16px}.fc-4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.fc-m.card{background:var(--f-surf);border:1px solid var(--f-bd);gap:6px}
.fc-dh{display:flex;align-items:center;gap:8px}.fc-dh i{width:22px;height:22px;border-radius:6px;background:var(--f-soft)}.fc-dh .fc-chip{margin-left:auto}
.fc-dv{display:flex;justify-content:space-between;align-items:center}.fc-dv span{font:500 26px var(--f-font)}.fc-dv svg{width:80px}
@media(max-width:900px){.fc-g{grid-template-columns:1fr}.fc-4{grid-template-columns:repeat(2,minmax(0,1fr))}.fc-k3{grid-template-columns:1fr}}
</style>
