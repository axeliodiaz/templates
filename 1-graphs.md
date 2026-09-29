<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
const canvas = ref(null)
const playing = ref(true)
let raf, observer, media, reduced = false, started = 0, last = 0
const nodes = [{id:'A',label:'Plan',x:.5,y:.10},{id:'B',label:'API',x:.25,y:.38},{id:'C',label:'UI',x:.75,y:.38},{id:'D',label:'Tests',x:.5,y:.68},{id:'E',label:'Release',x:.5,y:.90}]
const edges = [[0,1],[0,2],[1,3],[2,3],[3,4]]
function point(a,b,t,w,h) {const x=a.x*w,y=a.y*h,X=b.x*w,Y=b.y*h,cx=(x+X)/2+18,cy=(y+Y)/2;return {x:(1-t)**2*x+2*(1-t)*t*cx+t*t*X,y:(1-t)**2*y+2*(1-t)*t*cy+t*t*Y,cx,cy}}
function draw(time=0){const c=canvas.value;if(!c)return; const box=c.getBoundingClientRect(),w=box.width,h=box.height,dpr=Math.min(devicePixelRatio||1,2),ctx=c.getContext('2d');if(!ctx)return;if(c.width!==Math.round(w*dpr)||c.height!==Math.round(h*dpr)){c.width=Math.round(w*dpr);c.height=Math.round(h*dpr)}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);const animate=playing.value&&!reduced;const t=animate?time-started:last;edges.forEach(([i,j],k)=>{const a=nodes[i],b=nodes[j],p=point(a,b,.5,w,h);ctx.beginPath();ctx.moveTo(a.x*w,a.y*h);ctx.quadraticCurveTo(p.cx,p.cy,b.x*w,b.y*h);ctx.strokeStyle=k===4?'#5f6686':'#6773bc';ctx.lineWidth=2;ctx.stroke();if(animate){const p2=point(a,b,((t/1150+k*.23)%1),w,h);ctx.beginPath();ctx.arc(p2.x,p2.y,3,0,Math.PI*2);ctx.fillStyle=k%2?'#f472b6':'#a5b4fc';ctx.fill()}});nodes.forEach((n,i)=>{let x=n.x*w,y=n.y*h;ctx.fillStyle='#171b35';ctx.strokeStyle=i===3?'#fbbf24':i<3?'#34d399':'#818cf8';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,Math.min(w<460?19:25,w*.055),0,Math.PI*2);ctx.fill();ctx.stroke();if(i===3&&animate){ctx.beginPath();ctx.arc(x,y,29+4*Math.sin(t/380),0,Math.PI*2);ctx.strokeStyle='rgba(251,191,36,.45)';ctx.stroke()}ctx.fillStyle='#f6f4ff';ctx.font=`${w<460?11:13}px DM Sans`;ctx.textAlign='center';ctx.fillText(n.label,x,y+4)});if(animate)raf=requestAnimationFrame(draw)}
function toggle(){playing.value=!playing.value;if(playing.value){started=performance.now()-last;raf=requestAnimationFrame(draw)}else{last=performance.now()-started;cancelAnimationFrame(raf);draw(last)}}
onMounted(()=>{media=matchMedia('(prefers-reduced-motion: reduce)');reduced=media.matches;const changed=()=>{reduced=media.matches;cancelAnimationFrame(raf);if(!reduced&&playing.value){started=performance.now()-last;raf=requestAnimationFrame(draw)}else draw(last)};media.addEventListener('change',changed);media._cleanup=()=>media.removeEventListener('change',changed);observer=new ResizeObserver(()=>{cancelAnimationFrame(raf);draw(performance.now())});observer.observe(canvas.value);started=performance.now();draw(started)})
onUnmounted(()=>{cancelAnimationFrame(raf);observer?.disconnect();media?._cleanup?.()})

// Every chart uses one small, synthetic dataset. Selecting a series updates each sample.
const series = ref('north')
const focus = ref(-1)
const chartSets = {
  north: { name: 'North', values: [35, 48, 41, 61, 56, 74, 68], second: [20, 24, 29, 28, 37, 34, 42] },
  south: { name: 'South', values: [52, 40, 57, 46, 72, 65, 82], second: [26, 31, 25, 39, 33, 41, 44] },
  west: { name: 'West', values: [24, 32, 43, 38, 51, 59, 64], second: [14, 18, 22, 29, 26, 31, 38] }
}
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
const values = computed(() => chartSets[series.value].values)
const secondary = computed(() => chartSets[series.value].second)
const colors = ['#a5b4fc','#f9a8d4','#67e8f9','#6ee7b7','#fcd34d','#c4b5fd','#fda4af']
const px = i => 28 + i * 47
const py = v => 160 - v * 1.4
const path = a => a.map((v,i) => `${i ? 'L' : 'M'}${px(i)},${py(v)}`).join(' ')
const area = a => `${path(a)} L${px(a.length-1)},160 L28,160 Z`
const slices = computed(() => values.value.map((v,i) => {
  const sum = values.value.reduce((a,b) => a+b,0)
  const before = values.value.slice(0,i).reduce((a,b) => a+b,0) / sum
  const after = before + v / sum
  const polar = t => [180 + 118*Math.sin(2*Math.PI*t), 93 - 72*Math.cos(2*Math.PI*t)]
  const a = polar(before), b = polar(after)
  return `M180,93 L${a.join(',')} A118,72 0 ${v/sum > .5 ? 1 : 0} 1 ${b.join(',')} Z`
}))
const donutBackground = computed(() => values.value.map((v,i) => {
  const sum=values.value.reduce((a,b)=>a+b,0)
  return { start: values.value.slice(0,i).reduce((a,b)=>a+b,0)/sum*100, size:v/sum*100 }
}))
const radar = computed(() => values.value.slice(0,6).map((v,i) => {
  const angle=i*Math.PI/3-Math.PI/2, r=v*.85
  return `${180+Math.cos(angle)*r},${94+Math.sin(angle)*r}`
}).join(' '))
const histogram = computed(() => [0, 20, 40, 60, 80].map((min,i) => ({label:`${min}-${min+19}`,count:values.value.concat(secondary.value).filter(v=>v>=min&&v<min+20).length})))
const scatter = computed(() => values.value.map((v,i)=>({x:32+secondary.value[i]*3.1,y:py(v),r:4+i*.65})))
const progress = computed(() => Math.round(values.value.reduce((a,b)=>a+b,0)/values.value.length))
</script>

# Graphs

Data visualization examples and a dependency graph for Lustro. All numbers below are **synthetic samples**, not live metrics. Switch between the sample series to see how the charts respond. [Motion patterns](/motion) explain when movement helps.

## Data charts

<div class="chart-intro"><div><span class="l-eyebrow">LUSTRO / CHART LIBRARY</span><p>One dataset, many ways to read it. Labels and the data table remain available without color or animation.</p></div><div class="chart-chooser" role="group" aria-label="Sample data series"><button v-for="(item,key) in chartSets" :key="key" type="button" :aria-pressed="series===key" @click="series=key;focus=-1">{{item.name}}</button></div></div>

<div class="chart-gallery">
  <section class="chart-card"><div class="chart-top"><span>01 / TREND</span><h3>Line</h3><p>Track change over an ordered interval.</p></div><svg viewBox="0 0 360 190" role="img" :aria-label="`Line chart for ${chartSets[series].name}; values ${values.join(', ')}`"><path class="chart-grid" d="M28 48H332 M28 104H332 M28 160H332"/><path :d="path(values)" fill="none" stroke="#a5b4fc" stroke-width="3"/><circle v-for="(v,i) in values" :key="i" :cx="px(i)" :cy="py(v)" r="4" fill="#a5b4fc"/><text v-for="(m,i) in months" :key="m" :x="px(i)" y="181" text-anchor="middle">{{m}}</text></svg><small>Use a shared scale when comparing series; avoid smoothing that implies unsampled data.</small></section>
  <section class="chart-card"><div class="chart-top"><span>02 / VOLUME</span><h3>Area</h3><p>Emphasize magnitude across time.</p></div><svg viewBox="0 0 360 190" role="img" :aria-label="`Area chart for ${chartSets[series].name}`"><defs><linearGradient id="areaFill" x2="0" y2="1"><stop stop-color="#818cf8" stop-opacity=".63"/><stop offset="1" stop-color="#818cf8" stop-opacity=".03"/></linearGradient></defs><path class="chart-grid" d="M28 48H332 M28 104H332 M28 160H332"/><path :d="area(values)" fill="url(#areaFill)"/><path :d="path(values)" fill="none" stroke="#a5b4fc" stroke-width="3"/><text v-for="(m,i) in months" :key="m" :x="px(i)" y="181" text-anchor="middle">{{m}}</text></svg><small>Start at zero; translucent fills keep overlapping series legible.</small></section>
  <section class="chart-card"><div class="chart-top"><span>03 / COMPARISON</span><h3>Column bar</h3><p>Compare discrete periods.</p></div><svg viewBox="0 0 360 190" role="img" :aria-label="`Column bar chart for ${chartSets[series].name}`"><path class="chart-grid" d="M28 48H332 M28 104H332 M28 160H332"/><rect v-for="(v,i) in values" :key="i" :x="px(i)-13" :y="py(v)" width="26" :height="160-py(v)" rx="5" :fill="colors[i]"/><text v-for="(m,i) in months" :key="m" :x="px(i)" y="181" text-anchor="middle">{{m}}</text></svg><small>Equal widths, zero baseline and a consistent gap make comparisons honest.</small></section>
  <section class="chart-card"><div class="chart-top"><span>04 / RANKING</span><h3>Horizontal bar</h3><p>Fit longer category names.</p></div><svg viewBox="0 0 360 190" role="img" :aria-label="`Horizontal bar chart for ${chartSets[series].name}`"><g v-for="(v,i) in values.slice(0,5)" :key="i"><text x="6" :y="28+i*33">{{months[i]}}</text><rect x="52" :y="13+i*33" width="278" height="16" rx="6" fill="#292d49"/><rect x="52" :y="13+i*33" :width="v*2.78" height="16" rx="6" :fill="colors[i]"/><text :x="Math.min(60+v*2.78,337)" :y="26+i*33" class="chart-value">{{v}}</text></g></svg><small>Sort when rank matters; reserve the left margin for real labels.</small></section>
  <section class="chart-card"><div class="chart-top"><span>05 / COMPOSITION</span><h3>Stacked bar</h3><p>Show total and contributing series.</p></div><svg viewBox="0 0 360 190" role="img" :aria-label="`Stacked bar chart for ${chartSets[series].name}; indigo primary, pink secondary`"><g v-for="(v,i) in values" :key="i"><rect :x="px(i)-13" :y="160-(v+secondary[i])*1.1" width="26" :height="secondary[i]*1.1" rx="3" fill="#f9a8d4"/><rect :x="px(i)-13" :y="160-v*1.1" width="26" :height="v*1.1" rx="3" fill="#a5b4fc"/><text :x="px(i)" y="181" text-anchor="middle">{{months[i]}}</text></g></svg><div class="chart-legend"><i></i>Primary <i class="pink"></i>Secondary</div><small>Compare totals first; use grouped bars for precise segment comparisons.</small></section>
  <section class="chart-card"><div class="chart-top"><span>06 / PART-TO-WHOLE</span><h3>Pie</h3><p>A few shares of one whole.</p></div><svg viewBox="0 0 360 190" role="img" :aria-label="`Pie chart showing the seven periods for ${chartSets[series].name}`"><path v-for="(d,i) in slices" :key="i" :d="d" :fill="colors[i]" stroke="#171b30" stroke-width="2"/></svg><div class="chart-legend"><span v-for="(m,i) in months" :key="m"><i :style="{background:colors[i]}"></i>{{m}}</span></div><small>Shares must sum to a whole. Prefer bars for exact comparisons.</small></section>
  <section class="chart-card"><div class="chart-top"><span>07 / PART-TO-WHOLE</span><h3>Donut</h3><p>Show proportions with a total in the center.</p></div><div class="chart-donut" role="img" :aria-label="`Donut chart total ${values.reduce((a,b)=>a+b,0)} for ${chartSets[series].name}`" :style="{background:`conic-gradient(${donutBackground.map((s,i)=>`${colors[i]} ${s.start}% ${s.start+s.size}%`).join(',')})`}"><div><strong>{{values.reduce((a,b)=>a+b,0)}}</strong><span>TOTAL</span></div></div><div class="chart-legend"><span v-for="(m,i) in months" :key="m"><i :style="{background:colors[i]}"></i>{{m}}</span></div><small>Keep the center number separate from the share labels.</small></section>
  <section class="chart-card"><div class="chart-top"><span>08 / RELATIONSHIP</span><h3>Scatter</h3><p>Check the relationship between two values.</p></div><svg viewBox="0 0 360 190" role="img" :aria-label="`Scatter chart with ${values.length} points; secondary on x, primary on y`"><path class="chart-grid" d="M30 20V160H330 M30 90H330"/><circle v-for="(p,i) in scatter" :key="i" :cx="p.x" :cy="p.y" :r="p.r" :fill="colors[i]" fill-opacity=".85"/><text x="225" y="181">SECONDARY →</text></svg><small>Map two numeric dimensions to axes; don't imply causation.</small></section>
  <section class="chart-card"><div class="chart-top"><span>09 / MICRO TREND</span><h3>Sparkline</h3><p>Fit a trend into a compact metric.</p></div><div class="chart-metric"><strong>{{values[6]}}</strong><span>Latest sample · {{months[6]}}</span></div><svg viewBox="0 0 360 190" role="img" :aria-label="`Sparkline ${values.join(', ')}`"><path :d="area(values)" fill="#818cf82a"/><path :d="path(values)" fill="none" stroke="#67e8f9" stroke-width="4" stroke-linecap="round"/><circle :cx="px(6)" :cy="py(values[6])" r="6" fill="#67e8f9"/></svg><small>Pair a compact line with the latest value, unit and time range.</small></section>
  <section class="chart-card"><div class="chart-top"><span>10 / PROFILE</span><h3>Radar</h3><p>Compare a small set of normalized traits.</p></div><svg viewBox="0 0 360 190" role="img" :aria-label="`Radar chart for the first six periods of ${chartSets[series].name}`"><polygon points="180,20 244,57 244,131 180,168 116,131 116,57" fill="none" stroke="#535b79"/><polygon points="180,57 212,75 212,113 180,131 148,113 148,75" fill="none" stroke="#535b79"/><polygon :points="radar" fill="#818cf855" stroke="#a5b4fc" stroke-width="3"/><text x="174" y="16">Jan</text><text x="255" y="56">Feb</text><text x="255" y="137">Mar</text><text x="174" y="184">Apr</text><text x="82" y="137">May</text><text x="82" y="56">Jun</text></svg><small>Normalize axes and keep categories ordered; don't use it for many series.</small></section>
  <section class="chart-card"><div class="chart-top"><span>11 / DENSITY</span><h3>Heatmap</h3><p>Scan variation across periods and categories.</p></div><div class="chart-heat" role="img" :aria-label="`Heatmap of primary and secondary values for ${chartSets[series].name}`"><div class="chart-heat-label"></div><span v-for="m in months" :key="m">{{m}}</span><template v-for="(row,r) in [values,secondary]" :key="r"><span class="chart-heat-label">{{r?'B':'A'}}</span><span v-for="(v,i) in row" :key="i" class="chart-heat-cell" :style="{background:`rgba(${r?'236,72,153':'99,102,241'},${.2+v/110})`}" :title="`${r?'Secondary':'Primary'} ${months[i]}: ${v}`">{{v}}</span></template></div><small>Use a labeled sequential scale and keep values inspectable.</small></section>
  <section class="chart-card"><div class="chart-top"><span>12 / TARGET</span><h3>Gauge ring</h3><p>Show progress toward a defined target.</p></div><div class="chart-gauge" role="img" :aria-label="`Average ${progress} out of target 100`" :style="{'--progress':progress+'%'}"><div><strong>{{progress}}%</strong><span>OF TARGET</span></div></div><small>A target is required; never treat the ring as an arbitrary KPI.</small></section>
  <section class="chart-card"><div class="chart-top"><span>13 / DISTRIBUTION</span><h3>Histogram</h3><p>Count numeric samples in equal-width bins.</p></div><svg viewBox="0 0 360 190" role="img" :aria-label="`Histogram of both series with five equal-width bins`"><g v-for="(bin,i) in histogram" :key="i"><rect :x="30+i*62" :y="160-bin.count*19" width="58" :height="bin.count*19" rx="3" fill="#818cf8"/><text :x="59+i*62" y="181" text-anchor="middle">{{bin.label}}</text><text :x="59+i*62" :y="153-bin.count*19" text-anchor="middle">{{bin.count}}</text></g></svg><small>Bins are 20 units wide; compare frequency, not raw magnitude.</small></section>
  <section class="chart-card"><div class="chart-top"><span>14 / THIRD DIMENSION</span><h3>Bubble</h3><p>Size adds a third numeric variable.</p></div><svg viewBox="0 0 360 190" role="img" :aria-label="`Bubble chart of seven samples for ${chartSets[series].name}`"><path class="chart-grid" d="M30 20V160H330"/><circle v-for="(p,i) in scatter" :key="i" :cx="p.x" :cy="p.y" :r="6+secondary[i]*.25" :fill="colors[i]" fill-opacity=".52" :stroke="colors[i]"/><text x="225" y="181">SECONDARY →</text></svg><small>Scale bubble area, not radius, for a quantitative size mapping in production.</small></section>
</div>

### Accessible data behind the examples

All fourteen examples above respond to the same North/South/West controls. Numbers are made up for this guide; they have no unit or business meaning. The table supplies exact values for readers who cannot or do not want to use the visual encoding.

<div class="chart-table-wrap"><table class="chart-data"><caption>{{chartSets[series].name}} sample values</caption><thead><tr><th scope="col">Period</th><th scope="col">Primary</th><th scope="col">Secondary</th></tr></thead><tbody><tr v-for="(m,i) in months" :key="m"><th scope="row">{{m}}</th><td>{{values[i]}}</td><td>{{secondary[i]}}</td></tr></tbody></table></div>

### Implementation notes

- Use SVG for small charts, where labels, focus targets and crisp resizing matter; use Canvas for thousands of marks and keep an HTML data alternative. The examples use SVG and CSS only, with no charting dependency.
- On real data, use a shared domain, meaningful units, empty/loading/error states, and provenance. A pie or donut needs one whole; a gauge needs a real target. For long time series, add zoom or aggregation rather than squeezing points.
- In production, give each mark a keyboard-accessible tooltip or synchronized data table. Do not rely on hue alone. Use a muted transition on series change, no perpetual chart animation, and turn transitions off under `prefers-reduced-motion`.

## Dependency graph

<div class="l-demo"><div class="l-graph-head"><div><span class="l-eyebrow">DEMO · DEPENDENCY DAG</span><h3>Plan → parallel work → tests → release</h3></div><button class="l-btn l-secondary" :aria-pressed="!playing" @click="toggle">{{playing?'Pause':'Play'}}</button></div><canvas ref="canvas" class="l-graph" role="img" aria-label="Plan splits into API and UI, both feed Tests, then Release. Tests is in progress."></canvas><div class="l-actions"><span class="l-badge l-badge-success">Completed</span><span class="l-badge l-badge-warn">Running</span><span class="l-badge">Pending</span></div></div>

## Layout patterns

| Shape | Algorithm | Use it for |
|---|---|---|
| Chain | Ordered vertical or horizontal sequence | A linear pipeline |
| Fan-out / fan-in | Tidy tree for the split; join at the shared successor | Parallel steps that converge |
| Layered DAG | Longest-path layers, barycenter ordering within each layer | Multiple dependencies and joins |

The demo above uses fixed normalized coordinates for five sample nodes, not an automatic layout engine. For arbitrary real graphs, topologically sort nodes, assign layers from dependencies, and apply crossing reduction. Keep cards and labels in HTML for focus, search, and screen readers when building a full dashboard.

## Edge and particle recipe

Use a quadratic Bézier curve with a perpendicular offset near the midpoint, then evaluate the same curve at progress `t ∈ [0,1]` for each particle. A simple arc uses `Q cx cy x2 y2`; the animation uses about **700 ms per particle** and **240 ms between events** in the source prototype. Cap active particles (prototype cap: 220). Never spawn a particle for an unobserved event.

```js
const x = (1-t)**2*x1 + 2*(1-t)*t*cx + t*t*x2
const y = (1-t)**2*y1 + 2*(1-t)*t*cy + t*t*y2
```

## State language

- **Pending**: quiet indigo/gray; no pulse.
- **Running**: amber pulse/breathing glow only while there is actual work.
- **Succeeded**: green; one transition ring, then settle.
- **Failed**: red, persistent label and repair action; never an endless urgent pulse.
- **Blocked**: muted edge or dashed line plus explicit reason.

Use one canvas animation loop, scale by `devicePixelRatio`, resize with `ResizeObserver`, and pause when offscreen in a production app. With `prefers-reduced-motion`, draw a static final frame, retaining labels and status. The illustration in this guide pauses the particles and pulse under that setting.

::: info Source and scope
Adapted from two private motion prototypes created on September 29, 2026. This catalog intentionally uses generic sample labels; it does not connect to agents-ai or reveal task details. The prototype includes tidy-tree and layered-DAG implementations; this page documents their contract without claiming this five-node drawing is an automatic layout.
:::

<style>
.chart-intro{display:flex;align-items:end;justify-content:space-between;gap:18px;flex-wrap:wrap;margin:22px 0;padding:18px 20px;border:1px solid #4e4e72;border-radius:16px;background:linear-gradient(120deg,#2b264a,#181a31 70%);box-shadow:0 14px 35px #0004}.chart-intro p{margin:6px 0 0;color:#d3d1e5}.chart-chooser{display:flex;gap:5px;padding:4px;border:1px solid #606187;border-radius:10px;background:#151627}.chart-chooser button{min-height:38px;padding:6px 13px;border:0;border-radius:7px;background:transparent;color:#cfcde4;font:600 13px 'DM Sans',sans-serif;cursor:pointer}.chart-chooser button[aria-pressed=true]{background:linear-gradient(120deg,#595bc5,#9b4e9b);color:white}.chart-chooser button:focus-visible{outline:2px solid #67e8f9;outline-offset:2px}.chart-gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px;margin:20px 0}.chart-card{min-width:0;display:flex;flex-direction:column;padding:18px;border:1px solid #414361;border-radius:16px;background:linear-gradient(145deg,#23223b,#17182a);box-shadow:0 10px 30px #0003}.chart-card .chart-top{min-height:106px}.chart-top span{font:600 10px 'JetBrains Mono',monospace;color:#b8adff;letter-spacing:.1em}.chart-top h3{margin:5px 0!important;font-size:20px!important;color:#fff}.chart-top p{margin:0;color:#cac8dc;font-size:13px}.chart-card svg{display:block;width:100%;height:190px;overflow:visible}.chart-card svg text{fill:#bfc0d8;font:10px 'DM Sans',sans-serif}.chart-card svg .chart-value{fill:#fafaff;font-weight:700}.chart-grid{fill:none;stroke:#777b9a;stroke-opacity:.4;stroke-width:1}.chart-card small{display:block;margin-top:auto;padding-top:13px;color:#c6c3da;line-height:1.45}.chart-legend{display:flex;align-items:center;flex-wrap:wrap;gap:8px;font-size:11px;color:#d7d4e8;min-height:22px}.chart-legend span{display:inline-flex;align-items:center;gap:4px}.chart-legend i{display:inline-block;width:9px;height:9px;margin-right:2px;border-radius:2px;background:#a5b4fc}.chart-legend i.pink{background:#f9a8d4}.chart-donut,.chart-gauge{width:174px;height:174px;display:grid;place-items:center;border-radius:50%;margin:8px auto 15px}.chart-donut>div,.chart-gauge>div{display:flex;flex-direction:column;align-items:center;justify-content:center;width:110px;height:110px;border-radius:50%;background:#1b1c33;color:#fff}.chart-donut strong,.chart-gauge strong,.chart-metric strong{font:700 29px 'Space Grotesk',sans-serif}.chart-donut span,.chart-gauge span{font:600 10px 'JetBrains Mono',monospace;letter-spacing:.1em;color:#c3c1dc}.chart-gauge{background:conic-gradient(#818cf8 var(--progress),#363850 0)}.chart-metric{display:flex;align-items:baseline;gap:10px;color:white}.chart-metric span{color:#c7c4da;font-size:12px}.chart-heat{display:grid;grid-template-columns:27px repeat(7,minmax(0,1fr));gap:4px;align-items:center;margin:20px 0 42px}.chart-heat>span{text-align:center;font-size:10px;color:#d9d6e8;min-width:0}.chart-heat .chart-heat-cell{display:grid;place-items:center;height:48px;border:1px solid #ffffff24;border-radius:6px;font-weight:700;color:#fff}.chart-table-wrap{overflow-x:auto}.chart-data{width:100%;min-width:300px;border-collapse:collapse}.chart-data caption{text-align:left;color:#d6d3e9;margin-bottom:8px}.chart-data th,.chart-data td{padding:8px 12px;border-bottom:1px solid #484a67;text-align:left}.chart-data th{color:#e3dfff}@media(max-width:720px){.chart-gallery{grid-template-columns:1fr}.chart-card{padding:15px}.chart-intro{align-items:start}.chart-chooser{width:100%;justify-content:space-around}.chart-chooser button{flex:1}}@media(prefers-reduced-motion:reduce){.chart-gallery *, .chart-intro *{transition:none!important;animation:none!important}}
</style>
