<script setup>
import { computed, ref, useId } from 'vue'
const props = defineProps({ language: { type: String, default: 'lustro' } })
const sort = ref('Jobs')
const point = ref(5)
const chartId = useId()
const kpis = [
  { label: 'Avg first response', value: '42', unit: 'min', delta: '31% faster', good: true, note: 'target 60 min' },
  { label: 'Avg time to close', value: '1.8', unit: 'days', delta: '0.4 faster', good: true, note: 'target 2 days' },
  { label: 'First-time fix', value: '94%', unit: '', delta: '2 pts up', good: true, note: '412 jobs' },
  { label: 'Total spend', value: '$184,240', unit: '', delta: '6.2% up', good: false, note: '1,284 jobs closed' }
]
const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
const response = [80, 70, 55, 47, 40, 34]
const close = [64, 57, 50, 44, 40, 36]
const categories = [
  { name: 'Plumbing', n: 539, pct: 42 }, { name: 'Heating', n: 359, pct: 28 }, { name: 'Electrical', n: 205, pct: 16 },
  { name: 'Appliance', n: 116, pct: 9 }, { name: 'Other', n: 65, pct: 5 }
]
const team = [
  { name: 'Mike\u2019s Plumbing', jobs: 148, resp: 18, done: 96, ontime: 92, cost: 286, rating: 4.9 },
  { name: 'Halden Mechanical', jobs: 121, resp: 26, done: 95, ontime: 90, cost: 412, rating: 4.8 },
  { name: 'Ardent Electric', jobs: 96, resp: 31, done: 97, ontime: 94, cost: 318, rating: 4.8 },
  { name: 'Northline Heating', jobs: 88, resp: 24, done: 93, ontime: 86, cost: 364, rating: 4.7 },
  { name: 'Rivet Plumbing', jobs: 61, resp: 41, done: 89, ontime: 81, cost: 240, rating: 4.5 }
]
const rows = computed(() => [...team].sort((a, b) => sort.value === 'Rating' ? b.rating - a.rating : sort.value === 'Response' ? a.resp - b.resp : b.jobs - a.jobs))
const x = i => 48 + i * 88
const y = v => 190 - (v - 30) / 60 * 160
const pts = arr => arr.map((v, i) => `${x(i)},${y(v)}`).join(' ')
const smooth = arr => arr.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
</script>

<template>
<div class="rp" :class="`rp-${props.language}`">
  <header class="rp-head"><div><h3>Reports</h3><p>1 July to 18 September 2026 · all properties</p></div><span class="rp-chip">Fictitious data</span></header>
  <div class="rp-kpis">
    <section v-for="k in kpis" :key="k.label"><span class="rp-label">{{ k.label }}</span><strong>{{ k.value }}<small v-if="k.unit"> {{ k.unit }}</small></strong><div><span class="rp-badge" :class="k.good ? 'good' : 'bad'">{{ k.delta }}</span><small>{{ k.note }}</small></div></section>
  </div>
  <div class="rp-grid">
    <section class="rp-panel"><h4>Response and close time · last 6 months</h4>
      <div class="rp-readout" aria-live="polite"><strong>{{ months[point] }}</strong><span>First response {{ response[point] }} min · Time to close {{ close[point] }} h</span></div>
      <svg viewBox="0 0 560 230" role="img" aria-label="Line chart: first response in minutes and time to close in hours, April to September, both falling. Focus a month to read its values.">
        <g v-for="v in [30, 50, 70, 90]" :key="v"><line x1="40" x2="540" :y1="y(v)" :y2="y(v)" class="rp-grid-line"/><text x="6" :y="y(v) + 4">{{ v }}</text></g>
        <path :d="smooth(response)" fill="none" stroke="var(--rp-a)" stroke-width="2.5"/>
        <path :d="smooth(close)" fill="none" stroke="var(--rp-b)" stroke-width="2.5" stroke-dasharray="6 4"/>
        <g v-for="(m, i) in months" :key="m"><text :x="x(i)" y="218" text-anchor="middle">{{ m }}</text><circle :cx="x(i)" :cy="y(response[i])" r="12" class="rp-hit" tabindex="0" :aria-label="`${m}: first response ${response[i]} minutes, time to close ${close[i]} hours`" @mouseenter="point = i" @focus="point = i"/><circle :cx="x(i)" :cy="y(response[i])" :r="point === i ? 5 : 3" fill="var(--rp-a)" pointer-events="none"/><circle :cx="x(i)" :cy="y(close[i])" :r="point === i ? 5 : 3" fill="var(--rp-b)" pointer-events="none"/></g>
      </svg>
      <div class="rp-legend"><span><i></i>First response (min)</span><span><i class="b"></i>Time to close (hours, dashed)</span></div>
    </section>
    <section class="rp-panel"><h4>Requests by category</h4>
      <div v-for="(c, i) in categories" :key="c.name" class="rp-cat"><div><span>{{ c.name }}</span><b>{{ c.n }} <small>{{ c.pct }}%</small></b></div><progress :value="c.pct" max="50" :aria-label="`${c.name}: ${c.n} requests, ${c.pct} percent`"></progress></div>
      <p class="rp-note">1,284 requests in total. Bars are scaled to the largest share.</p>
    </section>
  </div>
  <section class="rp-panel"><div class="rp-panel-head"><h4>Contractor performance · last quarter</h4><label><span class="rp-sr">Sort by</span><select v-model="sort"><option>Jobs</option><option>Response</option><option>Rating</option></select></label></div>
    <p class="rp-table-hint">On narrow screens, scroll the table horizontally to see every column.</p>
    <div class="rp-scroll" tabindex="0" role="region" aria-label="Contractor performance, horizontally scrollable"><table><thead><tr><th>Contractor</th><th>Jobs</th><th aria-label="Average response">Response</th><th aria-label="Completion rate">Done %</th><th>On time</th><th aria-label="Average cost">Cost</th><th aria-label="Tenant rating">Rating</th></tr></thead><tbody>
      <tr v-for="r in rows" :key="r.name"><td>{{ r.name }}</td><td>{{ r.jobs }}</td><td>{{ r.resp }} min</td><td>{{ r.done }}%</td><td>{{ r.ontime }}%</td><td>${{ r.cost }}</td><td>★ {{ r.rating }}</td></tr>
    </tbody></table></div>
  </section>
  <footer class="rp-foot">Local demonstration only. Sample property-maintenance data, no real accounts or exports.</footer>
</div>
</template>

<style>
.rp{--rp-bg:#111120;--rp-panel:#1a192c;--rp-line:#353149;--rp-text:#f5f3ff;--rp-muted:#b4afcb;--rp-a:#a6a7ff;--rp-b:#f2bb8f;--rp-good:#78ddbe;--rp-bad:#ff9d9d;--rp-soft:#292743;margin:26px 0 38px;padding:22px;border:1px solid var(--rp-line);border-radius:20px;color:var(--rp-text);background:var(--rp-bg);font:12px/1.5 'DM Sans',sans-serif;text-align:left;font-variant-numeric:tabular-nums}
.rp-felix{--rp-bg:#f5f1eb;--rp-panel:#fffefa;--rp-line:#ded9d1;--rp-text:#172d2c;--rp-muted:#586966;--rp-a:#087b76;--rp-b:#a66a38;--rp-good:#147c56;--rp-bad:#a8352f;--rp-soft:#dcefeb;border-radius:24px}
html.felix-dark .rp-felix{--rp-bg:#082422;--rp-panel:#152f2e;--rp-line:#35605f;--rp-text:#fefcf9;--rp-muted:#c3e2e1;--rp-a:#69d7d2;--rp-b:#e8b886;--rp-good:#91dfb2;--rp-bad:#ffb4ad;--rp-soft:#1a4b47}
.rp-pulsefit{--rp-bg:#f5f5f5;--rp-panel:#fff;--rp-line:#dedede;--rp-text:#212121;--rp-muted:#5f666d;--rp-a:#7a5a1f;--rp-b:#5f666d;--rp-good:#11643b;--rp-bad:#a8201a;--rp-soft:#f5e6d3;font-family:'Rubik',sans-serif;border-radius:16px}
.rp *{box-sizing:border-box}.rp h3,.rp h4,.rp p{margin:0!important;border:0!important}.rp h3{font:600 24px/1.3 'Space Grotesk',sans-serif}.rp-pulsefit h3{font:400 30px/1.2 'Bebas Neue',sans-serif;letter-spacing:.04em}.rp h4{font-size:11px!important;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:var(--rp-muted)}.rp p,.rp small{color:var(--rp-muted);font-size:11px!important}
.rp-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:16px}.rp-chip{padding:3px 9px;border-radius:99px;background:var(--rp-soft);color:var(--rp-a);font-size:10px}
.rp-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:12px}.rp-kpis section,.rp-panel{border:1px solid var(--rp-line);border-radius:16px;background:var(--rp-panel);padding:14px}.rp-label{font-size:10px;letter-spacing:.8px;text-transform:uppercase;color:var(--rp-muted)}.rp-kpis strong{display:block;white-space:nowrap;font:600 22px/1.2 'Space Grotesk',sans-serif;margin:8px 0}.rp-pulsefit .rp-kpis strong{font-family:'Montserrat',sans-serif}.rp-kpis strong small{font-size:12px;font-weight:400}.rp-kpis section>div{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.rp-badge{padding:2px 8px;border-radius:6px;font-size:10px;font-weight:600;background:var(--rp-soft)}.rp-badge.good{color:var(--rp-good)}.rp-badge.bad{color:var(--rp-bad)}
.rp-grid{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,1fr);gap:12px;margin-bottom:12px}.rp-readout{display:flex;gap:10px;align-items:baseline;margin:10px 0 2px;flex-wrap:wrap}.rp-readout strong{font-size:16px}.rp-readout span{color:var(--rp-muted)}
.rp svg{width:100%;height:auto}.rp svg text{fill:var(--rp-muted);font-size:11px}.rp-grid-line{stroke:var(--rp-line);stroke-dasharray:3 4}.rp-hit{fill:transparent;cursor:pointer;outline:none}.rp-hit:focus-visible{stroke:var(--rp-a);stroke-width:2}
.rp-legend{display:flex;gap:16px;flex-wrap:wrap;color:var(--rp-muted)}.rp-legend i{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--rp-a);margin-right:6px}.rp-legend i.b{background:var(--rp-b)}
.rp-cat{margin-top:14px}.rp-cat>div{display:flex;justify-content:space-between}.rp-cat b small{font-weight:400}.rp progress{width:100%;height:8px;appearance:none;border:0;border-radius:99px;overflow:hidden;background:var(--rp-soft);margin-top:5px}.rp progress::-webkit-progress-bar{background:var(--rp-soft)}.rp progress::-webkit-progress-value{background:var(--rp-a);border-radius:99px}.rp progress::-moz-progress-bar{background:var(--rp-a)}.rp-note{margin-top:14px!important}
.rp-panel-head{display:flex;justify-content:space-between;align-items:center;gap:10px}.rp select{background:var(--rp-panel);color:var(--rp-text);border:1px solid var(--rp-line);border-radius:8px;padding:5px 8px;font:inherit}.rp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.rp-scroll{overflow-x:auto;margin-top:8px}.rp table{table-layout:fixed;width:100%;min-width:620px;border-collapse:collapse;display:table;margin:0}.rp th{font-size:10px;letter-spacing:.6px;text-transform:uppercase;color:var(--rp-muted);text-align:left;font-weight:500;background:transparent!important;border:0!important;border-bottom:1px solid var(--rp-line)!important;padding:8px}.rp td{padding:11px 8px;border:0!important;border-bottom:1px solid var(--rp-line)!important;background:transparent!important;color:var(--rp-text)}.rp tr{background:transparent!important}.rp-foot{margin-top:12px;color:var(--rp-muted);font-size:10px}
@media(min-width:960px){.VPDoc:has(.rp) .content-container{max-width:1100px!important}.VPDoc:has(.rp) .content{max-width:1200px!important}.VPDoc:has(.rp) .aside{display:none}}
@media(max-width:900px){.rp-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.rp-grid{grid-template-columns:1fr}}
@media(max-width:700px){.rp{padding:14px}.rp-kpis strong{font-size:20px}.rp-chip{display:none}}
</style>

<style>
.rp th,.rp td{white-space:normal!important;overflow-wrap:anywhere;font-size:10px;line-height:1.5}.rp th:first-child{width:23%}.rp-table-hint{display:none}.rp-scroll:focus-visible{outline:2px solid var(--rp-a);outline-offset:3px}@media(max-width:1100px){.rp-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:760px){.rp-table-hint{display:block;margin-top:8px!important}}
</style>
<style>
@media(min-width:960px){.VPDoc:has(.rp) .container{max-width:1200px!important}.VPDoc:has(.rp) .content{width:100%!important;max-width:none!important}.VPDoc:has(.rp) .content-container{max-width:none!important}}
.rp table{min-width:520px}.rp th,.rp td{overflow-wrap:normal;word-break:normal}.rp th{letter-spacing:0;font-size:9px}
</style>
<style>
.vp-doc .rp table{display:table!important;width:100%!important;table-layout:fixed!important}.vp-doc .rp th,.vp-doc .rp td{padding:8px 4px!important;white-space:normal!important}.vp-doc .rp th:first-child{width:23%}.vp-doc .rp th:not(:first-child){width:12.833%}.vp-doc .rp tr{border-top:0!important}
</style>
