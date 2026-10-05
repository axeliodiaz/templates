<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { animate, stagger } from 'motion'
const props = defineProps({ theme: { type: String, default: 'pulsefit' } })
const T = {
  lustro: ['#0b0b18', 'rgba(148,140,255,.08)', '#fff', '#a5b4fc', 'rgba(148,140,255,.22)', '#6366f1', '#fff', '#34d399', '#f472b6', 'rgba(99,102,241,.2)', "'DM Sans',sans-serif", '14px', '#6366f1', '#fbbf24', '#22d3ee', '#f472b6', '#64648c'],
  felix: ['#fefcf9', '#fff', '#082422', '#636158', '#e3ded3', '#065958', '#fff', '#1b8a4b', '#c0392b', '#e3efee', "'Saans',sans-serif", '10px', '#065958', '#c9772b', '#7fb7b5', '#e0b778', '#a8a89c'],
  pulsefit: ['#f5f5f5', '#fff', '#212121', '#5f666d', '#e0e0e0', '#C9A66B', '#212121', '#198754', '#dc3545', '#f5e6d3', "'Rubik',sans-serif", '14px', '#7a5a1f', '#C9A66B', '#b8c4cc', '#e6d2b0', '#b0b0b0'],
  scopecraft: ['#f4f4f5', '#fff', '#111113', '#6b6f76', '#e6e6e8', '#111113', '#fff', '#17803d', '#c62828', '#ececee', 'ui-sans-serif,system-ui,sans-serif', '8px', '#111113', '#2f6fdc', '#9aa0aa', '#c4c7ce', '#d9dadd'],
  lumen: ['#fbfbfa', '#fff', '#17171a', '#74767d', '#e7e7e9', '#7c6cf0', '#fff', '#1b9a4b', '#d23b3b', '#ece9fd', "'Plus Jakarta Sans',sans-serif", '12px', '#7c6cf0', '#f5b800', '#0fb0ea', '#e08a1e', '#b5b7bd']
}
const v = computed(() => { const t = T[props.theme] || T.pulsefit; const k = ['bg', 'surf', 'ink', 'mut', 'bd', 'pri', 'prit', 'ok', 'bad', 'soft', 'font', 'r', 'c1', 'c2', 'c3', 'c4', 'c5']; return Object.fromEntries(k.map((n, i) => ['--o-' + n, t[i]])) })
const mode = ref('Weekday')
const side = [['Sales over time', 0], ['Orders over time', 0], ['Average order', 1], ['What moved', 0], ['Sales by product', 0]]
const wd = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const avg = [105.76, 108.7, 108.2, 115.4, 121.2, 130.5, 127.6]
const days = [5, 5, 4, 4, 4, 4, 4]
const orders = [239, 247, 198, 201, 220, 238, 274]
// per-day values for each weekday (dots), deterministic
const dots = wd.map((w, i) => Array.from({ length: days[i] }, (_, k) => ({ y: avg[i] + (k - days[i] / 2 + .5) * 2.4 + (i < 3 && k === 0 ? -9 : 0), disc: i < 3 && k === 0 })))
const open = ref(0)
const toggle = i => { open.value = open.value === i ? -1 : i }
const dayRows = computed(() => Array.from({ length: 5 }, (_, k) => ({ d: 'Aug ' + (10 + k * 7), orders: 23 + k * 24, rev: (2468 + k * 2600).toLocaleString('en-US'), avg: (avg[open.value < 0 ? 0 : open.value] + (k - 2) * 1.3).toFixed(2), disc: k === 2 && open.value < 3 })).slice(0, 4)
)
const bars = computed(() => (open.value < 0 ? 0 : open.value) + 1 && [0, 1, 2, 3, 4].map(k => ({ h: 22 + ((k * 7 + open.value * 3) % 9) * 3, disc: k === 2 && open.value < 3 })))
const X = i => 60 + i * 76, Y = y => 160 - (y - 90) * 2.8
const root = ref(null), detail = ref(null)
const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
onMounted(() => {
  if (reduce() || !root.value) return
  animate(root.value.querySelectorAll('.od-k,.od-row'), { opacity: [0, 1], y: [8, 0] }, { delay: stagger(0.05), duration: 0.4 })
  animate(root.value.querySelectorAll('.od-dot'), { opacity: [0, 1], scale: [0.3, 1] }, { delay: stagger(0.02, { startDelay: 0.25 }), duration: 0.3 })
})
watch(open, async () => { await nextTick(); if (reduce() || !detail.value) return; animate(detail.value, { opacity: [0, 1], y: [-6, 0] }, { duration: 0.3 }) })
watch(mode, async () => { await nextTick(); if (reduce() || !root.value) return; animate(root.value.querySelectorAll('.od-dot'), { opacity: [0, 1] }, { duration: 0.35 }) })
</script>

<template>
  <div class="oc" :style="v" ref="root">
    <div class="oc-side"><small>Last 30 days</small><b class="oc-sh">Sales</b><span v-for="s in side" :key="s[0]" :class="{ on: s[1] }">{{ s[0] }}</span><b class="oc-sh">Fulfilment</b><span>Parcels late</span></div>
    <div class="oc-main">
      <div class="oc-head"><b>Average order</b><span class="oc-act"><span class="oc-btn">Export</span><span class="oc-btn pri">Schedule</span></span></div>
      <small>What an order was worth. A group's line is its revenue over its orders, never an average of averages.</small>
      <div class="oc-top"><div class="oc-big">$116.28 <b class="oc-pill">+3.2%</b> <small>against $112.63 the 30 days before</small></div><span class="oc-seg"><button v-for="m in ['Day', 'Week', 'Weekday']" :key="m" type="button" :class="{ on: mode === m }" @click="mode = m">{{ m }}</button></span></div>
      <div class="oc-k3"><div class="od-k"><small>Highest day</small><b>$132.50</b><small>Sat Sep 5 - 37 orders</small></div><div class="od-k"><small>Discount days</small><b>$99.55</b><small>vs $116.28 - Aug 24 to 26</small></div><div class="od-k"><small>Best weekday</small><b>Saturdays</b><small>$130.54 an order - 4 days</small></div></div>
      <div class="oc-leg"><span><i class="b"></i>Discount days</span><span><i></i>Other days</span><span><u></u>Its orders' average</span></div>
      <svg viewBox="0 0 580 200" role="img" aria-label="Average order value per day, grouped by weekday, rising from about $106 on Monday to $130 on Saturday"><g v-for="t in [90, 100, 110, 120, 130, 140]" :key="t"><text x="4" :y="Y(t) + 3">${{ t }}</text></g>
        <g v-for="(w, i) in wd" :key="w"><line :x1="X(i) - 26" :x2="X(i) + 26" :y1="Y(avg[i])" :y2="Y(avg[i])" class="oc-avg" /><circle v-for="(d, k) in dots[i]" :key="k" :cx="X(i) - 18 + k * 12" :cy="Y(d.y)" r="4" :class="['od-dot', d.disc ? 'b' : '']" /><text :x="X(i)" y="184" text-anchor="middle">{{ w }}</text><text :x="X(i)" y="196" text-anchor="middle">{{ days[i] }} days</text></g></svg>
      <div class="oc-th"><small>7 weekdays</small><small>Columns</small></div>
      <div class="oc-t"><div class="oc-r h"><span>Weekday</span><span>Discount days</span><span>Orders</span><span>Revenue</span><span>Average order</span></div>
        <template v-for="(w, i) in wd" :key="w">
          <button type="button" class="oc-r od-row" :aria-expanded="open === i" @click="toggle(i)"><span><b>{{ w }}</b> <small>{{ days[i] }} days</small></span><span>{{ i < 3 ? 1 : '' }}</span><span>{{ orders[i] }}</span><span>${{ (orders[i] * avg[i]).toLocaleString('en-US', { maximumFractionDigits: 0 }) }}</span><span><b>${{ avg[i].toFixed(2) }}</b></span></button>
          <div v-if="open === i" ref="detail" class="oc-detail">
            <div class="oc-dd" v-for="d in dayRows" :key="d.d"><span>{{ d.d }} <small>{{ w }}</small> <a v-if="d.disc">discount</a></span><span>{{ d.orders }}</span><span>${{ d.rev }}</span><b>${{ d.avg }}</b></div>
            <div class="oc-cards"><div class="oc-card"><small>{{ w }}s in the range</small><svg viewBox="0 0 120 50"><rect v-for="(b, k) in bars" :key="k" :x="8 + k * 22" :y="46 - b.h * .8" width="16" :height="b.h * .8" rx="2" :fill="b.disc ? 'var(--o-pri)' : 'var(--o-bd)'" /></svg></div><div class="oc-card"><small>An average {{ w }}</small><b>${{ avg[i].toFixed(2) }}</b><small>over {{ days[i] }} days</small></div><div class="oc-card"><small>Against the range</small><b :class="avg[i] < 116.28 ? 'bad' : 'ok'">{{ ((avg[i] / 116.28 - 1) * 100).toFixed(1) }}%</b><small>on its $116.28 average</small></div></div>
          </div>
        </template>
      </div>
      <small class="oc-foot">6 reports - Last 30 days: 1,617 orders - $188,029</small>
    </div>
  </div>
</template>

<style>
.oc{display:grid;grid-template-columns:180px minmax(0,1fr);background:var(--o-surf);border:1px solid var(--o-bd);border-radius:var(--o-r);margin:12px 0;font:13px/1.4 var(--o-font);color:var(--o-ink);text-align:left;overflow:hidden}
.oc *{box-sizing:border-box}.oc small{font-size:11px;color:var(--o-mut)}.oc b{font-weight:600}
.oc-side{border-right:1px solid var(--o-bd);padding:12px;display:flex;flex-direction:column;gap:4px}.oc-side>span{padding:6px 8px;border-radius:calc(var(--o-r) - 4px)}.oc-side>span.on{background:var(--o-soft);font-weight:600}.oc-sh{color:var(--o-mut);font-size:11px;margin-top:10px}
.oc-main{padding:12px 14px;display:flex;flex-direction:column;gap:10px;min-width:0}.oc-head,.oc-top,.oc-th{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
.oc-act{display:flex;gap:6px}.oc-btn{border:1px solid var(--o-bd);border-radius:calc(var(--o-r) - 4px);padding:5px 12px;font-weight:600;font-size:12px}.oc-btn.pri{background:var(--o-pri);color:var(--o-prit);border-color:var(--o-pri)}
.oc-big{font:500 28px var(--o-font)}.oc-big small{font-size:12px}.oc-pill{font-size:12px;color:var(--o-ok);background:color-mix(in srgb,var(--o-ok) 14%,transparent);border-radius:6px;padding:2px 8px}
.oc-seg{display:inline-flex;background:var(--o-soft);border-radius:calc(var(--o-r) - 4px);padding:2px}.oc-seg button{border:0;background:transparent;color:var(--o-mut);padding:4px 12px;border-radius:calc(var(--o-r) - 6px);font:600 12px var(--o-font);cursor:pointer}.oc-seg button.on{background:var(--o-surf);color:var(--o-ink)}
.oc button:focus-visible{outline:2px solid var(--o-pri);outline-offset:-2px}
.oc-k3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.od-k{border:1px solid var(--o-bd);border-radius:var(--o-r);padding:10px 12px;display:flex;flex-direction:column;gap:2px}.od-k b{font:500 24px var(--o-font)}
.oc-leg{display:flex;gap:14px;font-size:12px;flex-wrap:wrap}.oc-leg i{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--o-mut);margin-right:5px}.oc-leg i.b{background:var(--o-pri)}.oc-leg u{display:inline-block;width:14px;height:2px;background:var(--o-ink);margin-right:5px;vertical-align:3px}
.oc svg{display:block;width:100%;height:auto}.oc svg text{fill:var(--o-mut);font:10px var(--o-font)}.od-dot{fill:var(--o-mut)}.od-dot.b{fill:var(--o-pri)}.oc-avg{stroke:var(--o-ink);stroke-width:2}
.oc-t{display:flex;flex-direction:column}.oc-r{display:grid;grid-template-columns:1.4fr .8fr .6fr .8fr 1fr;gap:8px;padding:8px 10px;border:0;border-top:1px solid var(--o-bd);background:transparent;color:var(--o-ink);font:13px var(--o-font);text-align:left;width:100%}.oc-r span:nth-child(n+2){text-align:right}
.oc-r.h{color:var(--o-mut);font-size:11px;border-top:0}button.oc-r{cursor:pointer}button.oc-r:hover,button.oc-r[aria-expanded=true]{background:var(--o-soft)}
.oc-detail{background:var(--o-bg);padding:6px 10px 10px}.oc-dd{display:grid;grid-template-columns:1.4fr 1.4fr 1fr 1fr;gap:8px;padding:5px 0;font-size:12px}.oc-dd>:nth-child(n+2){text-align:right}.oc-dd a{color:var(--o-pri);font-weight:600}
.oc-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:6px}.oc-card{background:var(--o-surf);border:1px solid var(--o-bd);border-radius:var(--o-r);padding:10px;display:flex;flex-direction:column;gap:2px}.oc-card b{font:500 22px var(--o-font)}.oc-card svg{width:120px}
.oc .ok{color:var(--o-ok)}.oc .bad{color:var(--o-bad)}.oc-foot{border-top:1px solid var(--o-bd);padding-top:8px}
@media(max-width:900px){.oc{grid-template-columns:1fr}.oc-side{display:none}.oc-k3,.oc-cards{grid-template-columns:1fr}.oc-r{grid-template-columns:1.2fr .6fr .8fr 1fr}.oc-r span:nth-child(2){display:none}}
</style>
