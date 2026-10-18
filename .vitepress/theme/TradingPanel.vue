<script setup>
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { animate } from 'motion'
// Original code and fictitious data. Pattern credit: perps-bot UI shown in a post by @0xTenzo (big balance, open position with entry/TP line and multiplier, equity curve). No code, brand or assets copied. Paper account, local state only, no market data and no orders.
const props = defineProps({
  title: { type: String, default: 'Paper trading' },
  start: { type: Number, default: 54 }
})
const pairs = {
  SUI: { px: 1.421, vol: 0.0016 },
  BTC: { px: 86250, vol: 0.0006 },
  ETH: { px: 3180, vol: 0.0009 },
  SOL: { px: 148.6, vol: 0.0012 }
}
const symbol = ref('SUI')
const side = ref('short')
const lev = ref(14)
const open = ref(true)
const playing = ref(true)
const range = ref('22H')
const hover = ref(-1)
const seconds = ref(0)
const reduced = ref(false)
const margin = 420
const root = ref(null), curve = ref(null), balEl = ref(null)

function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 } }

// 181 closed trades, 36 red. Wins are scaled so the curve ends near $5,874 from $54.
const trades = (() => {
  const r = rng(54), n = 181
  const raw = Array.from({ length: n }, () => (r() < 0.2 ? -(0.004 + r() * 0.008) : 0.01 + r() * 0.07))
  // force exactly 36 reds
  let reds = raw.filter(v => v < 0).length, i = 0
  while (reds > 36) { if (raw[i] < 0) { raw[i] = 0.02 + r() * 0.03; reds-- } i++ }
  while (reds < 36) { if (raw[i % n] > 0) { raw[i % n] = -(0.004 + r() * 0.008); reds++ } i += 7 }
  const lw = raw.filter(v => v > 0).reduce((a, v) => a + Math.log(1 + v), 0)
  const ll = raw.filter(v => v < 0).reduce((a, v) => a + Math.log(1 + v), 0)
  const k = (Math.log(5874 / 54) - ll) / lw
  return raw.map(v => (v > 0 ? Math.exp(Math.log(1 + v) * k) - 1 : v))
})()
const equity = (() => { let e = props.start; return [e, ...trades.map(t => (e = e * (1 + t)))] })()
const slice = computed(() => {
  const n = { '1H': 12, '6H': 60, '22H': trades.length }[range.value]
  const from = equity.length - 1 - n
  return equity.slice(Math.max(0, from)).map((v, i) => ({ v, t: trades[Math.max(0, from) + i - 1] }))
})
const W = 640, H = 220, pad = { l: 46, r: 14, t: 14, b: 22 }
const scale = computed(() => {
  const vs = slice.value.map(p => p.v), lo = Math.min(...vs), hi = Math.max(...vs)
  const span = hi - lo || 1
  return { lo: Math.max(0, lo - span * 0.05), hi: hi + span * 0.05 }
})
const pts = computed(() => slice.value.map((p, i) => ({
  x: pad.l + (i / (slice.value.length - 1)) * (W - pad.l - pad.r),
  y: pad.t + (1 - (p.v - scale.value.lo) / (scale.value.hi - scale.value.lo)) * (H - pad.t - pad.b),
  v: p.v, t: p.t
})))
const line = computed(() => pts.value.map((p, i) => (i ? 'L' : 'M') + p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' '))
const area = computed(() => line.value + ` L${pts.value.at(-1).x.toFixed(1)},${H - pad.b} L${pad.l},${H - pad.b}Z`)
const grid = computed(() => [0, 1, 2, 3].map(i => {
  const v = scale.value.lo + (scale.value.hi - scale.value.lo) * (i / 3)
  return { y: pad.t + (1 - i / 3) * (H - pad.t - pad.b), label: v >= 1000 ? '$' + (v / 1000).toFixed(1) + 'k' : '$' + Math.round(v) }
}))
const dots = computed(() => slice.value.length > 70 ? [] : pts.value.slice(1))
const stats = computed(() => {
  const w = trades.filter(t => t > 0), l = trades.filter(t => t < 0)
  const avg = a => a.reduce((x, y) => x + y, 0) / a.length * 100
  return { n: trades.length, red: l.length, win: avg(w), loss: avg(l), best: Math.max(...trades) * 100 }
})

// live position
const cfg = computed(() => pairs[symbol.value])
const entry = ref(pairs.SUI.px)
const mark = ref(pairs.SUI.px)
const dir = computed(() => (side.value === 'long' ? 1 : -1))
const tp = computed(() => entry.value * (1 + dir.value * 0.0095))
const liq = computed(() => entry.value * (1 - dir.value * (0.9 / lev.value)))
const pnl = computed(() => dir.value * (mark.value - entry.value) / entry.value * margin * lev.value)
const pnlPct = computed(() => pnl.value / margin * 100)
const balance = computed(() => equity.at(-1) + (open.value ? pnl.value : 0))
const ladder = computed(() => {
  // Fixed anchors keep the labels apart; the mark moves between them by price.
  const a = [liq.value, entry.value, tp.value].sort((x, y) => x - y), at = [14, 50, 86]
  const pos = v => {
    const i = v <= a[1] ? 0 : 1
    const t = (v - a[i]) / (a[i + 1] - a[i] || 1)
    return Math.max(3, Math.min(97, at[i] + t * (at[i + 1] - at[i])))
  }
  return { tp: pos(tp.value), entry: pos(entry.value), liq: pos(liq.value), mark: pos(mark.value) }
})
const money = (n, d = 2) => (n < 0 ? '-' : '') + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
const px = v => v >= 1000 ? v.toLocaleString('en-US', { maximumFractionDigits: 0 }) : v >= 100 ? v.toFixed(2) : v.toFixed(4)
const clock = computed(() => { const s = seconds.value % 60, m = Math.floor(seconds.value / 60) % 60; return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') })
const gain = computed(() => (balance.value / props.start - 1) * 100)
const hoverPoint = computed(() => (hover.value >= 0 ? pts.value[hover.value] : null))

let timer = 0, tick = rng(7), media, mh, shown = props.start, ctl, dispose = false
function setBalance(to, quick) {
  ctl?.stop()
  if (reduced.value || quick || !balEl.value) { shown = to; if (balEl.value) balEl.value.textContent = money(to); return }
  ctl = animate(shown, to, { duration: 0.9, ease: [0.22, 1, 0.36, 1], onUpdate: v => { shown = v; if (balEl.value) balEl.value.textContent = money(v) } })
}
function step() {
  const v = cfg.value.vol
  mark.value = mark.value * (1 + (tick() - 0.5 + (entry.value - mark.value) / entry.value * 8) * v * 2)
  seconds.value += 1
}
function schedule() {
  clearInterval(timer)
  if (playing.value && open.value && !dispose) timer = setInterval(step, 1100)
}
function reset() { entry.value = mark.value = cfg.value.px; seconds.value = 0 }
function drawCurve() {
  if (reduced.value || !curve.value) return
  animate(curve.value, { strokeDashoffset: [1, 0] }, { duration: 1.1, ease: [0.22, 1, 0.36, 1] })
}
function setPair(s) { symbol.value = s; reset(); open.value = true }
function closeTrade() { open.value = false }
function openTrade() { reset(); open.value = true }
function onMove(e) {
  const r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * W
  const i = Math.round((x - pad.l) / (W - pad.l - pad.r) * (pts.value.length - 1))
  hover.value = Math.max(0, Math.min(pts.value.length - 1, i))
}
watch([playing, open], schedule)
watch(side, reset)
watch(balance, v => setBalance(v, false))
watch(range, async () => { hover.value = -1; await nextTick(); drawCurve() })
onMounted(() => {
  media = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced.value = media.matches
  mh = e => { reduced.value = e.matches }
  media.addEventListener('change', mh)
  setBalance(balance.value, false)
  drawCurve()
  schedule()
})
onUnmounted(() => { dispose = true; clearInterval(timer); ctl?.stop(); media?.removeEventListener('change', mh) })
</script>

<template>
  <section ref="root" class="tp b2-bs6 b2-folio" :aria-label="title">
    <header class="tp-head">
      <div class="tp-title"><strong>{{ title }}</strong><span class="tp-live" :class="{ off: !playing || !open }"><i></i>{{ playing && open ? 'LIVE' : 'PAUSED' }} <time>{{ clock }}</time></span></div>
      <div class="tp-pairs" role="group" aria-label="Market">
        <button class="btn btn-outline theme-primary" v-for="(c, s) in pairs" :key="s" type="button" :class="{ on: symbol === s }" :aria-pressed="symbol === s" @click="setPair(s)">{{ s }}</button>
      </div>
    </header>

    <div class="tp-top">
      <div class="tp-balance">
        <small>Balance</small>
        <div class="tp-big" ref="balEl" aria-live="off">{{ money(balance) }}</div>
        <div class="tp-chips">
          <span class="tp-chip">from {{ money(start, 0) }}</span>
          <span class="tp-chip up">+{{ gain.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}%</span>
          <span class="tp-chip">{{ lev }}x</span>
        </div>
      </div>

      <div class="tp-pos" v-if="open">
        <div class="tp-pos-head">
          <b>{{ symbol }}</b>
          <span class="tp-side" :class="side">{{ side.toUpperCase() }} {{ lev }}x</span>
          <span class="tp-pnl" :class="pnl >= 0 ? 'up' : 'down'">{{ pnl >= 0 ? '+' : '' }}{{ money(pnl) }} <small>{{ pnlPct >= 0 ? '+' : '' }}{{ pnlPct.toFixed(1) }}%</small></span>
        </div>
        <div class="tp-ladder" role="img" :aria-label="`Entry ${px(entry)}, take profit ${px(tp)}, liquidation ${px(liq)}, mark ${px(mark)}`">
          <span class="tp-rail"></span>
          <span class="tp-pin pt" :style="{ left: ladder.tp + '%' }"><em>TP {{ px(tp) }}</em></span>
          <span class="tp-pin pe" :style="{ left: ladder.entry + '%' }"><em>Entry {{ px(entry) }}</em></span>
          <span class="tp-pin pl" :style="{ left: ladder.liq + '%' }"><em>Liq {{ px(liq) }}</em></span>
          <span class="tp-mark" :style="{ left: ladder.mark + '%' }"><em>{{ px(mark) }}</em></span>
        </div>
        <div class="tp-controls">
          <div class="tp-seg" role="group" aria-label="Direction">
            <button class="btn btn-outline theme-primary" type="button" :class="{ on: side === 'long' }" :aria-pressed="side === 'long'" @click="side = 'long'">Long</button>
            <button class="btn btn-outline theme-primary" type="button" :class="{ on: side === 'short' }" :aria-pressed="side === 'short'" @click="side = 'short'">Short</button>
          </div>
          <label class="tp-lev">Multiplier <input type="range" min="2" max="20" step="1" v-model.number="lev" aria-label="Leverage multiplier" /> <b>{{ lev }}x</b></label>
          <button type="button" class="tp-btn btn btn-outline theme-primary" @click="playing = !playing">{{ playing ? 'Pause' : 'Resume' }}</button>
          <button type="button" class="tp-btn danger btn btn-outline theme-primary" @click="closeTrade">Close</button>
        </div>
      </div>
      <div class="tp-pos tp-empty" v-else>
        <b>No open position</b>
        <p>Pick a market and open a paper position. Nothing is sent anywhere.</p>
        <button type="button" class="tp-btn primary btn btn-outline theme-primary" @click="openTrade">Open {{ symbol }} {{ side }} {{ lev }}x</button>
      </div>
    </div>

    <div class="tp-chart">
      <div class="tp-chart-head">
        <b>Equity curve</b>
        <div class="tp-seg" role="group" aria-label="Range">
          <button class="btn btn-outline theme-primary" v-for="r in ['1H', '6H', '22H']" :key="r" type="button" :class="{ on: range === r }" :aria-pressed="range === r" @click="range = r">{{ r }}</button>
        </div>
      </div>
      <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="`Equity curve from ${money(slice[0].v, 0)} to ${money(slice.at(-1).v, 0)}`" @mousemove="onMove" @mouseleave="hover = -1" @touchmove.passive="e => onMove({ currentTarget: e.currentTarget, clientX: e.touches[0].clientX })">
        <defs><linearGradient id="tp-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--vp-c-brand-1)" stop-opacity=".28" /><stop offset="1" stop-color="var(--vp-c-brand-1)" stop-opacity="0" /></linearGradient></defs>
        <g v-for="g in grid" :key="g.y"><line :x1="pad.l" :x2="W - pad.r" :y1="g.y" :y2="g.y" class="tp-gl" /><text :x="pad.l - 8" :y="g.y + 4" text-anchor="end">{{ g.label }}</text></g>
        <path :d="area" fill="url(#tp-fill)" />
        <path ref="curve" :d="line" pathLength="1" class="tp-line" />
        <circle v-for="(p, i) in dots" :key="range + i" :cx="p.x" :cy="p.y" r="3" :class="p.t < 0 ? 'tp-r' : 'tp-g'" />
        <g v-if="hoverPoint">
          <line :x1="hoverPoint.x" :x2="hoverPoint.x" :y1="pad.t" :y2="H - pad.b" class="tp-cross" />
          <circle :cx="hoverPoint.x" :cy="hoverPoint.y" r="5" class="tp-hd" />
        </g>
      </svg>
      <div class="tp-tip" v-if="hoverPoint">{{ money(hoverPoint.v) }}<span v-if="hoverPoint.t != null" :class="hoverPoint.t >= 0 ? 'up' : 'down'"> · trade {{ hoverPoint.t >= 0 ? '+' : '' }}{{ (hoverPoint.t * 100).toFixed(1) }}%</span></div>
      <div class="tp-tip dim" v-else>Hover or drag across the curve to inspect a trade.</div>
    </div>

    <dl class="tp-stats">
      <div><dt>Trades</dt><dd>{{ stats.n }}</dd></div>
      <div><dt>Red</dt><dd class="down">{{ stats.red }}</dd></div>
      <div><dt>Avg win</dt><dd class="up">+{{ stats.win.toFixed(1) }}%</dd></div>
      <div><dt>Avg loss</dt><dd class="down">{{ stats.loss.toFixed(1) }}%</dd></div>
    </dl>
    <p class="tp-note">Fictitious paper account. Prices and trades are simulated in your browser. No market data, orders or real funds.</p>
  </section>
</template>

<style scoped>
.tp{--g:var(--vp-c-green-1,#18794e);--r:var(--vp-c-red-1,#cb2431);border:1px solid var(--vp-c-divider);border-radius:14px;background:var(--vp-c-bg-soft);padding:18px;margin:16px 0;color:var(--vp-c-text-1);font-variant-numeric:tabular-nums}
.tp *{box-sizing:border-box}
.tp-head{display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;align-items:center;margin-bottom:14px}
.tp-title{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.tp-live{display:inline-flex;gap:6px;align-items:center;font-size:12px;font-weight:600;letter-spacing:.04em;color:var(--g)}
.tp-live i{width:7px;height:7px;border-radius:50%;background:currentColor;animation:tp-pulse 1.6s ease-in-out infinite}
.tp-live.off{color:var(--vp-c-text-3)}.tp-live.off i{animation:none}
.tp-live time{color:var(--vp-c-text-2);font-weight:500}
@keyframes tp-pulse{50%{opacity:.35;transform:scale(.7)}}
.tp-pairs,.tp-seg{display:inline-flex;gap:2px;padding:2px;border-radius:9px;background:var(--vp-c-bg-alt,var(--vp-c-bg));border:1px solid var(--vp-c-divider)}
.tp-pairs button,.tp-seg button{border:0;background:none;color:var(--vp-c-text-2);font:inherit;font-size:12.5px;font-weight:600;padding:5px 11px;border-radius:7px;cursor:pointer;transition:background .2s,color .2s}
.tp-pairs button.on,.tp-seg button.on{background:var(--vp-c-brand-1);color:var(--vp-c-white,#fff)}
.tp button:focus-visible,.tp input:focus-visible{outline:2px solid var(--vp-c-brand-1);outline-offset:2px}
.tp-top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.5fr);gap:14px}
.tp-balance,.tp-pos,.tp-chart{background:var(--vp-c-bg);border:1px solid var(--vp-c-divider);border-radius:12px;padding:16px}
.tp-balance small,.tp-stats dt{color:var(--vp-c-text-2);font-size:12px;text-transform:uppercase;letter-spacing:.05em}
.tp-big{white-space:nowrap;font-size:clamp(28px,4vw,40px);font-weight:700;line-height:1.1;margin:6px 0 12px;letter-spacing:-.02em;overflow-wrap:anywhere}
.tp-chips{display:flex;gap:6px;flex-wrap:wrap}
.tp-chip{font-size:12px;font-weight:600;padding:3px 9px;border-radius:99px;background:var(--vp-c-default-soft,rgba(128,128,128,.14));color:var(--vp-c-text-2)}
.tp-chip.up,.up{color:var(--g)}.down{color:var(--r)}
.tp-pos-head{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.tp-pos-head b{font-size:18px}
.tp-side{font-size:12px;font-weight:700;padding:3px 9px;border-radius:7px;border:1px solid currentColor}
.tp-side.short{color:var(--r)}.tp-side.long{color:var(--g)}
.tp-pnl{margin-left:auto;font-weight:700;font-size:18px}.tp-pnl small{font-size:12px;font-weight:600;opacity:.85}
.tp-ladder{position:relative;height:74px;margin:14px 34px 6px}
.tp-rail{position:absolute;left:0;right:0;top:34px;height:4px;border-radius:2px;background:linear-gradient(90deg,var(--r),var(--vp-c-divider) 45%,var(--vp-c-divider) 55%,var(--g));opacity:.7}
.tp-ladder .tp-rail{background:var(--vp-c-divider)}
.tp-pin{position:absolute;top:26px;width:2px;height:20px;background:currentColor;transform:translateX(-1px)}
.tp-pin em,.tp-mark em{position:absolute;font-style:normal;font-size:11px;font-weight:600;white-space:nowrap;transform:translateX(-50%)}
.tp-pin.pt{color:var(--g)}.tp-pin.pt em{top:24px}
.tp-pin.pe{color:var(--vp-c-text-2)}.tp-pin.pe em{top:24px}
.tp-pin.pl{color:var(--r)}.tp-pin.pl em{top:24px}
.tp-mark{position:absolute;top:30px;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:var(--vp-c-brand-1);box-shadow:0 0 0 4px color-mix(in srgb,var(--vp-c-brand-1) 25%,transparent);transition:left .5s cubic-bezier(.22,1,.36,1)}
.tp-mark em{top:-30px;left:6px;color:var(--vp-c-brand-1)}
.tp-controls{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:10px}
.tp-lev{display:inline-flex;gap:8px;align-items:center;font-size:12.5px;color:var(--vp-c-text-2)}
.tp-lev input{width:110px;accent-color:var(--vp-c-brand-1)}
.tp-btn{font:inherit;font-size:12.5px;font-weight:600;padding:6px 12px;border-radius:8px;border:1px solid var(--vp-c-divider);background:var(--vp-c-bg-soft);color:var(--vp-c-text-1);cursor:pointer;transition:transform .15s,border-color .2s}
.tp-btn:hover{border-color:var(--vp-c-brand-1)}.tp-btn:active{transform:scale(.97)}
.tp-btn.danger{color:var(--r)}.tp-btn.primary{background:var(--vp-c-brand-1);color:var(--vp-c-white,#fff);border-color:transparent}
.tp-empty{display:flex;flex-direction:column;gap:8px;align-items:flex-start;justify-content:center}.tp-empty p{margin:0;color:var(--vp-c-text-2);font-size:14px}
.tp-chart{margin-top:14px}
.tp-chart-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.tp-chart svg{display:block;width:100%;height:auto;touch-action:pan-y}
.tp-chart text{fill:var(--vp-c-text-3);font-size:11px}
.tp-gl{stroke:var(--vp-c-divider);stroke-width:1}
.tp-line{fill:none;stroke:var(--vp-c-brand-1);stroke-width:2.4;stroke-linejoin:round;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:0}
.tp-g{fill:var(--g)}.tp-r{fill:var(--r)}
.tp-cross{stroke:var(--vp-c-text-3);stroke-dasharray:3 3}.tp-hd{fill:var(--vp-c-bg);stroke:var(--vp-c-brand-1);stroke-width:2.4}
.tp-tip{font-size:13px;font-weight:600;min-height:20px;margin-top:4px}.tp-tip.dim{color:var(--vp-c-text-3);font-weight:400}
.tp-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:14px 0 0}
.tp-stats>div{background:var(--vp-c-bg);border:1px solid var(--vp-c-divider);border-radius:10px;padding:10px 12px}
.tp-stats dd{margin:2px 0 0;font-size:20px;font-weight:700}
.tp-note{margin:12px 0 0;font-size:12px;color:var(--vp-c-text-3)}
@media(max-width:700px){.tp{padding:12px}.tp-top{grid-template-columns:1fr}.tp-stats{grid-template-columns:repeat(2,1fr)}.tp-pnl{margin-left:0}.tp-ladder{margin-inline:36px}}
@media(prefers-reduced-motion:reduce){.tp-live i{animation:none}.tp-mark,.tp-pairs button,.tp-seg button,.tp-btn{transition:none}}
</style>
