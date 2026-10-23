<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { mountChartMotion } from './chart-motion'

const props = defineProps({
  counts: { type: Object, default: () => ({ blocked: 6, ready: 1, progress: 1, review: 1, done: 0 }) }
})

const stages = [
  { key: 'blocked', label: 'Blocked', weight: 0, meaning: 'Waiting on a dependency or an open PR. Adds nothing to progress.' },
  { key: 'ready', label: 'Ready to start', weight: 0, meaning: 'Prerequisites are met and nobody has started. Adds nothing to progress.' },
  { key: 'progress', label: 'In progress', weight: 0.25, meaning: 'Work has started. Counts as 25% of a card.' },
  { key: 'review', label: 'In review', weight: 0.75, meaning: 'Work is done and under review. Counts as 75% of a card.' },
  { key: 'done', label: 'Completed', weight: 1, meaning: 'Finished and merged. Counts as 100% of a card.' }
]
const GAP = 1.2
const ARC = 'M 24 112 A 86 86 0 0 1 196 112'

const total = computed(() => stages.reduce((s, st) => s + (props.counts[st.key] || 0), 0))
const rows = computed(() => stages.map(st => {
  const count = props.counts[st.key] || 0
  return { ...st, count, percent: total.value ? Math.round((count / total.value) * 100) : 0 }
}))
const progress = computed(() => rows.value.reduce((s, r) => s + r.count * r.weight, 0))
const percent = computed(() => (total.value ? Math.round((progress.value / total.value) * 100) : 0))

// Slices sit at their exact position on the 0-100 dial. The visible gap is carved out of
// the slice itself, so the filled arc always ends at the progress value.
const segments = computed(() => {
  const active = rows.value
    .filter(r => r.count * r.weight > 0)
    .map(r => ({ ...r, share: (r.count * r.weight / (total.value || 1)) * 100 }))
    .reverse()
  let cursor = 0
  return active.map((r, i) => {
    const seg = { ...r, offset: cursor, length: Math.max(r.share - (i < active.length - 1 ? GAP : 0), 0.5), round: active.length === 1 }
    cursor += r.share
    return seg
  })
})

const wrap = ref(null)
const tip = ref(null)
let motion
onMounted(() => { if (wrap.value) motion = mountChartMotion(wrap.value, '.sc-card') })
onBeforeUnmount(() => { motion?.destroy() })
function show(e, html) {
  const box = wrap.value.getBoundingClientRect()
  tip.value = { html, x: clampX(e.clientX - box.left, box.width), y: e.clientY - box.top }
}
function showFocus(e, html) {
  const box = wrap.value.getBoundingClientRect(), r = e.currentTarget.getBoundingClientRect()
  tip.value = { html, x: clampX(r.left - box.left + r.width / 2, box.width), y: r.top - box.top }
}
const clampX = (x, w) => Math.min(Math.max(x, 135), Math.max(w - 135, 135))
const hide = () => { tip.value = null }
const gaugeTip = s => ({ title: s.label, body: `${s.count} of ${total.value} cards, counted at ${Math.round(s.weight * 100)}%. Adds ${(s.count * s.weight / total.value * 100).toFixed(1)} points to the ${percent.value}% total.` })
const barTip = r => ({ title: r.label, body: `${r.count} of ${total.value} cards (${r.percent}%). ${r.meaning}` })
</script>

<template>
<div class="sc" ref="wrap" @mouseleave="hide">
<div class="sc-toolbar"><button type="button" class="sc-replay" @click="motion?.replay()">Replay motion</button></div>
<div class="sc-grid">
<section class="sc-card">
<p class="sc-k">Gauge</p><h3 class="sc-t">Progress</h3>
<p class="sc-l">Weighted by status: completed 100%, in review 75%, in progress 25%, ready and blocked 0%. Hover a color to see what it is.</p>
<div class="sc-gauge" role="img" :aria-label="`${percent}% weighted progress, ${progress} of ${total} cards`">
<svg viewBox="0 0 220 128" aria-hidden="true">
<path class="sc-track" :d="ARC" pathLength="100" data-cm="draw" />
<path v-for="s in segments" :key="s.key" class="sc-seg" :class="['t-' + s.key, { round: s.round }]" :d="ARC" pathLength="100" data-cm="seg" :stroke-dasharray="`${s.length.toFixed(2)} 100`" :stroke-dashoffset="(-s.offset).toFixed(2)" tabindex="0" :aria-label="`${gaugeTip(s).title}: ${gaugeTip(s).body}`" @mousemove="show($event, gaugeTip(s))" @focus="showFocus($event, gaugeTip(s))" @blur="hide" @mouseleave="hide" />
</svg>
<p class="sc-read"><strong>{{ percent }}%</strong><span>{{ progress }} of {{ total }} cards</span></p>
</div>
</section>
<section class="sc-card">
<p class="sc-k">Funnel</p><h3 class="sc-t">By status</h3>
<p class="sc-l">Each bar width is the share of cards in that status. Hover a bar to see what it means.</p>
<ol class="sc-funnel">
<li v-for="r in rows" :key="r.key"><span class="sc-bar" data-cm="barX" :class="['t-' + r.key, { empty: !r.count }]" :style="{ width: `calc(36% + ${r.percent * 0.64}%)` }" tabindex="0" :aria-label="`${barTip(r).title}: ${barTip(r).body}`" @mousemove="show($event, barTip(r))" @focus="showFocus($event, barTip(r))" @blur="hide" @mouseleave="hide"><span>{{ r.label }}</span><strong>{{ r.count }} · {{ r.percent }}%</strong></span></li>
</ol>
</section>
</div>
<div v-if="tip" class="sc-tip" role="tooltip" :style="{ left: tip.x + 'px', top: tip.y + 'px' }"><strong>{{ tip.html.title }}</strong><span>{{ tip.html.body }}</span></div>
</div>
</template>

<style>
.sc{position:relative;margin:24px 0}
.sc-toolbar{display:flex;justify-content:flex-end;margin-bottom:10px}
.sc-replay{padding:4px 12px;border:1px solid var(--vp-c-divider);border-radius:99px;background:transparent;color:inherit;font:inherit;font-size:12px;cursor:pointer}
.sc-replay:hover{border-color:var(--vp-c-brand-1)}
.sc-replay:focus-visible{outline:2px solid var(--vp-c-brand-1);outline-offset:2px}
.cm-playing *{transition:none!important}
.sc-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.sc-card{background:var(--vp-c-bg);border:1px solid var(--vp-c-divider);border-radius:14px;padding:18px}
.sc p{margin:0}
.sc-k{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--vp-c-brand-1)}
.sc .sc-t{margin:4px 0 6px;border:0;padding:0;font-size:20px;letter-spacing:-.02em}
.sc-l{font-size:13px;color:var(--vp-c-text-2)}
.sc-gauge{position:relative;width:min(100%,280px);margin:8px auto 0}
.sc-gauge svg{display:block;width:100%;height:auto}
.sc-track,.sc-seg{fill:none;stroke-width:18}
.sc-track{stroke:var(--vp-c-default-soft);stroke-linecap:round}
.sc-seg{stroke-linecap:butt;pointer-events:stroke;cursor:help;outline:none;transition:opacity .15s}
.sc-seg.round{stroke-linecap:round}
.sc-seg:hover,.sc-seg:focus-visible{opacity:.8;filter:drop-shadow(0 0 2px rgba(0,0,0,.35))}
.sc-read{position:absolute;left:0;right:0;bottom:0;text-align:center;pointer-events:none}
.sc-read strong{display:block;font-size:34px;font-weight:800;letter-spacing:-.045em;line-height:1}
.sc-read span{color:var(--vp-c-text-2);font-size:13px;font-weight:650}
.sc-funnel{display:grid;gap:8px;margin:16px 0 0;padding:0;list-style:none}
.sc-funnel li{display:flex;justify-content:center;margin:0}
.sc-bar{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;column-gap:8px;min-height:36px;padding:7px 12px;border-radius:10px;font-size:13px;font-weight:750;line-height:1.2;cursor:help;outline:none;box-sizing:border-box}
.sc-bar strong{font-size:12px;font-weight:800;white-space:nowrap}
.sc-bar:hover,.sc-bar:focus-visible{filter:brightness(.93);box-shadow:0 0 0 2px var(--vp-c-bg),0 0 0 4px currentColor}
.t-blocked{background:#c45c4a;color:#fff;stroke:#c45c4a}
.t-ready{background:#2a8f5a;color:#fff;stroke:#2a8f5a}
.t-progress{background:#e2b100;color:#3a2e00;stroke:#e2b100}
.t-review{background:#4f74b0;color:#fff;stroke:#4f74b0}
.t-done{background:#0b8a7f;color:#fff;stroke:#0b8a7f}
.sc-seg.t-blocked,.sc-seg.t-ready,.sc-seg.t-progress,.sc-seg.t-review,.sc-seg.t-done{background:none}
.sc-bar.empty{background:transparent;border:1px dashed var(--vp-c-divider);color:var(--vp-c-text-2)}
.sc-tip{position:absolute;z-index:20;transform:translate(-50%,calc(-100% - 12px));max-width:260px;padding:8px 10px;border-radius:8px;background:#0f1f1e;color:#fff;font-size:12px;line-height:1.35;pointer-events:none;box-shadow:0 6px 18px rgba(0,0,0,.25);display:grid;gap:2px}
.sc-tip strong{font-size:12px}
.sc-tip span{color:#d6e4e2}
@media(max-width:720px){.sc-grid{grid-template-columns:1fr}}
</style>
