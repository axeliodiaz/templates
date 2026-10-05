<script setup>
import { ref, computed, onMounted } from 'vue'
import { animate, stagger } from 'motion'
const props = defineProps({ theme: { type: String, default: 'pulsefit' } })
// bg, surf, ink, mut, bd, pri, prit, ok, bad, soft, font, radius, c1..c5 (series colors)
const T = {
  lustro: ['#0b0b18', 'rgba(148,140,255,.08)', '#fff', '#a5b4fc', 'rgba(148,140,255,.22)', '#6366f1', '#fff', '#34d399', '#f472b6', 'rgba(99,102,241,.2)', "'DM Sans',sans-serif", '14px', '#6366f1', '#fbbf24', '#22d3ee', '#f472b6', '#64648c'],
  felix: ['#fefcf9', '#fff', '#082422', '#636158', '#e3ded3', '#065958', '#fff', '#1b8a4b', '#c0392b', '#e3efee', "'Saans',sans-serif", '10px', '#065958', '#c9772b', '#7fb7b5', '#e0b778', '#a8a89c'],
  pulsefit: ['#f5f5f5', '#fff', '#212121', '#5f666d', '#e0e0e0', '#C9A66B', '#212121', '#198754', '#dc3545', '#f5e6d3', "'Rubik',sans-serif", '14px', '#7a5a1f', '#C9A66B', '#b8c4cc', '#e6d2b0', '#b0b0b0'],
  scopecraft: ['#f4f4f5', '#fff', '#111113', '#6b6f76', '#e6e6e8', '#111113', '#fff', '#17803d', '#c62828', '#ececee', 'ui-sans-serif,system-ui,sans-serif', '8px', '#111113', '#2f6fdc', '#9aa0aa', '#c4c7ce', '#d9dadd'],
  lumen: ['#fbfbfa', '#fff', '#17171a', '#74767d', '#e7e7e9', '#7c6cf0', '#fff', '#1b9a4b', '#d23b3b', '#ece9fd', "'Plus Jakarta Sans',sans-serif", '12px', '#7c6cf0', '#f5b800', '#0fb0ea', '#e08a1e', '#b5b7bd']
}
const v = computed(() => { const t = T[props.theme] || T.pulsefit; const k = ['bg', 'surf', 'ink', 'mut', 'bd', 'pri', 'prit', 'ok', 'bad', 'soft', 'font', 'r', 'c1', 'c2', 'c3', 'c4', 'c5']; return Object.fromEntries(k.map((n, i) => ['--w-' + n, t[i]])) })
const cats = [['Chicken', 19, 'c1', '23%', '+22%', '$420', true], ['Produce', 14, 'c2', '17%', '-4%', '$310', false], ['Sauces', 11, 'c3', '13%', '+6%', '$240', true], ['Dairy', 10, 'c4', '12%', '-2%', '$225', false], ['4 other sources', 30, 'c5', '35%', '', '$645', null]]
const COLS = 18, ROWS = 13, HR = 12
const cells = computed(() => {
  const all = []
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) all.push({ x: 20 + c * HR * 1.74 + (r % 2 ? HR * .87 : 0), y: 18 + r * HR * 1.5, c, r })
  const cx = 20 + COLS / 2 * HR * 1.74, cy = 18 + ROWS / 2 * HR * 1.5
  all.forEach(a => { a.d = Math.hypot((a.x - cx) / 1.1, a.y - cy); a.ang = Math.atan2(a.y - cy, a.x - cx) })
  const pick = [...all].sort((a, b) => a.d - b.d).slice(0, 84).sort((a, b) => a.ang - b.ang)
  let i = 0; const color = new Map()
  for (const [, n, key] of cats) { for (let k = 0; k < n; k++) color.set(pick[i++], key) }
  return all.map(a => ({ ...a, key: color.get(a) || null }))
})
const hexPts = (x, y) => Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 180 * (60 * i - 30); return `${(x + (HR - 1) * Math.cos(a)).toFixed(1)},${(y + (HR - 1) * Math.sin(a)).toFixed(1)}` }).join(' ')
const sel = ref(null)
const days = [['Mon', 33, 33], ['Tue', 24, 24], ['Wed', 12, 4], ['Thu', 12, 3], ['Fri', 14, 5], ['Sat', 15, 4], ['Sun', 14, 3]]
const root = ref(null)
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.value) return
  animate(root.value.querySelectorAll('.wd-k,.wd-c'), { opacity: [0, 1], y: [8, 0] }, { delay: stagger(0.07), duration: 0.45 })
  animate(root.value.querySelectorAll('.wd-hex'), { opacity: [0, 1], scale: [0.4, 1] }, { delay: stagger(0.008, { startDelay: 0.3 }), duration: 0.35 })
  animate(root.value.querySelectorAll('.wd-dot'), { opacity: [0, 1] }, { delay: stagger(0.003, { startDelay: 0.5 }), duration: 0.25 })
})
</script>

<template>
  <div class="wd" :style="v" ref="root">
    <div class="wd-head"><div><b class="wd-t">Waste</b> <small>Last 7 days</small></div><div class="wd-act"><span class="wd-btn">Export</span><span class="wd-btn dark">+ Log waste</span></div></div>
    <div class="wd-tabs"><span class="wd-btn">Sep 28 to Oct 4</span><span class="wd-seg"><span class="on">Analysis</span><span>Trends</span><span>Log</span></span><small>62 entries logged by 5 cooks</small></div>
    <div class="wd-k3">
      <div class="wd-k"><div class="wd-kh"><i class="o"></i>Waste</div><div class="wd-kv">84 kg</div><div class="wd-kf"><b class="bad">&#9650; +9 kg</b><small>vs the week before</small></div></div>
      <div class="wd-k"><div class="wd-kh"><i></i>Estimated cost</div><div class="wd-kv">$1,840</div><div class="wd-kf"><b class="bad">&#9650; +$210</b><small>vs the week before</small></div></div>
      <div class="wd-k"><div class="wd-kh"><i></i>Waste rate</div><div class="wd-kv">6.2%</div><div class="wd-kf"><b class="bad">&#9650; +0.7 pts</b><small>Target 5.0%</small></div></div>
    </div>
    <div class="wd-g">
      <div class="wd-c"><div class="wd-ch"><b>Waste by source</b><small class="wd-l">View log &rsaquo;</small></div>
        <div class="wd-big">$1,840 <small>across 84 kg. Each cell is 1 kg.</small></div>
        <svg viewBox="0 0 400 240" role="img" aria-label="Honeycomb of 84 kg of waste by source: chicken 19 kg, produce 14, sauces 11, dairy 10, other 30"><polygon v-for="(h, i) in cells" :key="i" class="wd-hex" :points="hexPts(h.x, h.y)" :fill="h.key ? `var(--w-${h.key})` : 'var(--w-soft)'" :opacity="h.key ? (sel && sel !== h.key ? .25 : 1) : .55" style="transform-box:fill-box;transform-origin:center" /></svg>
        <div class="wd-leg"><button v-for="c in cats" :key="c[0]" type="button" :aria-pressed="sel === c[2]" @click="sel = sel === c[2] ? null : c[2]"><i :style="{ background: `var(--w-${c[2]})` }"></i>{{ c[0] }} <small class="wd-tag">{{ c[3] }}</small><b v-if="c[4]" class="wd-d" :class="c[6] ? 'bad' : 'ok'">{{ c[6] ? '&#9650;' : '&#9660;' }} {{ c[4] }}</b><span class="wd-amt">{{ c[5] }}</span></button></div>
      </div>
      <div class="wd-r">
        <div class="wd-c"><div class="wd-ch"><b><i class="wd-ai"></i> What Mise noticed</b><small class="wd-chip">Waste anomaly</small></div><p class="wd-p">Chicken waste increased 22% this week, primarily from over-preparation on low-demand weekdays.</p>
          <div class="wd-k3 sm"><div class="wd-m"><b>19 kg</b><small>Chicken wasted</small></div><div class="wd-m"><b>Mon and Tue</b><small>71% of that waste</small></div><div class="wd-m"><b>$420</b><small>Cost this week</small></div></div>
          <div class="wd-act"><span class="wd-btn">View details</span><span class="wd-btn pri">Apply to Tuesday's plan</span></div></div>
        <div class="wd-c"><div class="wd-ch"><b>Waste by day</b><small><i class="wd-sq" style="background:var(--w-c2)"></i> Each dot is 0.5 kg <i class="wd-sq" style="background:var(--w-c1)"></i> Mostly chicken</small></div>
          <div class="wd-big">12 kg <small>a day on average, 16.5 kg on Monday</small></div>
          <svg viewBox="0 0 350 150" role="img" aria-label="Daily waste in half-kilogram dots, Monday 16.5 kg down to about 6 kg on Wednesday"><g v-for="(d, x) in days" :key="d[0]"><circle v-for="k in 33" :key="k" class="wd-dot" :cx="25 + x * 46" :cy="124 - Math.floor((k - 1) / 3) * 10.5 + 0" :r="3.6" :transform="`translate(${((k - 1) % 3 - 1) * 9} 0)`" :fill="k <= d[2] ? 'var(--w-c1)' : k <= d[1] ? 'var(--w-c2)' : 'var(--w-soft)'" /><text :x="25 + x * 46" y="146" text-anchor="middle">{{ d[0] }}</text></g></svg></div>
      </div>
    </div>
  </div>
</template>

<style>
.wd{background:var(--w-bg);border:1px solid var(--w-bd);border-radius:calc(var(--w-r) + 4px);padding:14px;margin:12px 0;font:13px/1.4 var(--w-font);color:var(--w-ink);text-align:left;display:flex;flex-direction:column;gap:12px}
.wd *{box-sizing:border-box}.wd p{margin:0!important}.wd small{font-size:11px;color:var(--w-mut)}.wd b{font-weight:600}
.wd-head,.wd-tabs{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}.wd-t{font-size:17px}.wd-act{display:flex;gap:8px;flex-wrap:wrap}
.wd-btn{border:1px solid var(--w-bd);background:var(--w-surf);border-radius:calc(var(--w-r) - 4px);padding:6px 12px;font-weight:600;font-size:12px}.wd-btn.dark{background:var(--w-ink);color:var(--w-bg);border-color:var(--w-ink)}.wd-btn.pri{background:var(--w-soft);border-color:var(--w-pri);color:var(--w-ink)}
.wd-seg{display:inline-flex;background:var(--w-soft);border-radius:calc(var(--w-r) - 4px);padding:2px}.wd-seg span{padding:4px 12px;border-radius:calc(var(--w-r) - 6px);font-weight:600;font-size:12px;color:var(--w-mut)}.wd-seg .on{background:var(--w-surf);color:var(--w-ink)}
.wd-k3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.wd-k3.sm{gap:8px;margin:10px 0}
.wd-k{background:var(--w-surf);border:2px solid var(--w-bd);border-radius:var(--w-r);overflow:hidden}.wd-kh{display:flex;gap:8px;align-items:center;padding:10px 12px;background:var(--w-soft);font-weight:600}
.wd-kh i{width:22px;height:22px;border-radius:6px;border:1.5px solid var(--w-mut);flex:none}.wd-kh i.o{background:var(--w-c2);border-color:var(--w-c2)}
.wd-kv{font:500 30px var(--w-font);padding:10px 12px 4px}.wd-kf{display:flex;justify-content:space-between;gap:6px;padding:0 12px 12px;align-items:center}
.wd .bad{color:var(--w-bad)}.wd .ok{color:var(--w-ok)}
.wd-g{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:12px}.wd-r{display:flex;flex-direction:column;gap:12px;min-width:0}
.wd-c{background:var(--w-surf);border:1px solid var(--w-bd);border-radius:var(--w-r);padding:12px;min-width:0}
.wd-ch{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:8px;flex-wrap:wrap}.wd-l{color:var(--w-ink)!important;font-weight:600}
.wd-big{font:500 24px var(--w-font);margin-bottom:6px}.wd-big small{font-size:12px;margin-left:4px}
.wd svg{display:block;width:100%;height:auto}.wd svg text{fill:var(--w-mut);font:10px var(--w-font)}
.wd-hex{transition:opacity .2s}
.wd-leg{display:flex;flex-direction:column;margin-top:8px;border-radius:var(--w-r);background:var(--w-bg);overflow:hidden}
.wd-leg button{display:grid;grid-template-columns:12px auto auto 1fr auto;gap:8px;align-items:center;border:0;border-top:1px solid var(--w-bd);background:transparent;color:var(--w-ink);font:12px var(--w-font);padding:8px 10px;cursor:pointer;text-align:left}.wd-leg button:first-child{border-top:0}
.wd-leg button[aria-pressed=true]{background:var(--w-soft)}.wd-leg i{width:9px;height:9px;border-radius:50%}.wd-tag{border:1px solid var(--w-bd);border-radius:6px;padding:0 6px}.wd-d{justify-self:end;font-size:11px}.wd-amt{font-weight:600;justify-self:end;min-width:44px;text-align:right}
.wd-leg button:focus-visible{outline:2px solid var(--w-pri);outline-offset:-2px}
.wd-ai{display:inline-block;width:18px;height:18px;border-radius:5px;background:var(--w-pri);vertical-align:-3px;margin-right:4px}
.wd-chip{border:1px solid var(--w-pri);border-radius:6px;padding:1px 7px;color:var(--w-ink)}.wd-p{font-size:14px;line-height:1.45}
.wd-m{background:var(--w-bg);border-radius:calc(var(--w-r) - 2px);padding:10px;display:flex;flex-direction:column;gap:2px}.wd-m b{font-size:15px}.wd-sq{display:inline-block;width:8px;height:8px;border-radius:2px;vertical-align:0;margin:0 3px 0 6px}
@media(max-width:900px){.wd-g{grid-template-columns:1fr}.wd-k3{grid-template-columns:1fr}.wd-k3.sm{grid-template-columns:1fr}}
</style>
