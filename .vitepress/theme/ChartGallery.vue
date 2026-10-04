<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ language: { type: String, default: 'lustro' } })
const sample = ref('A')
const focus = ref({})
const mode = ref({})
const cards = [
 ['heat-green','Activity heatmap · Emerald','heat'],['heat-blue','Activity heatmap · Sky','heat'],['heat-purple','Activity heatmap · Violet','heat'],
 ['line','Spline line · single / dual','line'],['bars','Pill bars · column / row','bars'],['area','Gradient spline area','area'],['donut','Rounded donut','donut'],['hybrid','Pill bars + spline','hybrid'],['scatter','Scatter matrix','scatter'],['candle','Financial candlesticks','candle'],['kpi','KPI with sparkline','kpi'],['pyramid','Tier pyramid','pyramid'],['radial','Grouped radial arcs','radial'],['speed','Speedometer','speed'],['bullet','Bullet targets','bullet'],['sankey','Sankey flow','sankey'],['step','Step progression','step'],['stacked','Stacked tones','stacked'],['radar','Radar web','radar'],['rings','Concentric progress rings','rings'],['funnel','Stage funnel','funnel'],['matrix','Dot-matrix heatmap','matrix'],['telemetry','Telemetry sparklines','telemetry'],['bubble','Bubble clusters','bubble'],['treemap','Tile treemap','treemap'],['stream','Stream wave','stream'],['arc','Arc meter','arc'],['waterfall','Waterfall steps','waterfall'],['polar','Polar radial pillars','polar'],['range','Min/max range band','range']
].map(([id,title,type])=>({id,title,type}))
const values = computed(()=>sample.value==='A'?[35,48,41,61,56,74]:[42,36,55,48,72,64])
const second = computed(()=>sample.value==='A'?[20,28,25,39,33,46]:[26,19,35,28,43,36])
const labels=['Jan','Feb','Mar','Apr','May','Jun']
const X=i=>34+i*48, Y=v=>166-v*1.5
function spline(arr){return arr.reduce((p,v,i)=>i?p+` C${X(i-1)+24},${Y(arr[i-1])} ${X(i)-24},${Y(v)} ${X(i)},${Y(v)}`:`M${X(0)},${Y(v)}`,'')}
const line=computed(()=>spline(values.value)), line2=computed(()=>spline(second.value))
const area=computed(()=>line.value+' L274,166 L34,166 Z')
const rangeUpper=computed(()=>values.value.map(v=>Math.min(v+15,96))), rangeLower=computed(()=>values.value.map(v=>Math.max(v-15,0)))
const reverseSpline=arr=>arr.slice().reverse().map((v,j)=>j?` C${X(6-j)-24},${Y(arr[6-j])} ${X(5-j)+24},${Y(v)} ${X(5-j)},${Y(v)}`:` L${X(5)},${Y(v)}`).join('')
const band=computed(()=>spline(rangeUpper.value)+reverseSpline(rangeLower.value)+' Z')
const step=computed(()=>values.value.map((v,i)=>i?` H${X(i)} V${Y(v)}`:`M${X(i)},${Y(v)}`).join(''))
const sum=computed(()=>values.value.reduce((a,b)=>a+b,0))
const radar=computed(()=>values.value.map((v,i)=>{const a=i*Math.PI/3-Math.PI/2;return `${160+Math.cos(a)*v*.85},${100+Math.sin(a)*v*.85}`}).join(' '))
const shares=[40,30,20,10]
const ringLengths=shares.map(v=>v/100*2*Math.PI*58)
const options=c=>{let n=6;if(c.type==='radial')n=4;else if(['rings','polar','bullet','telemetry'].includes(c.type))n=3;else if(['donut','sankey','waterfall','pyramid','funnel','treemap'].includes(c.type))n=4;else if(['speed','arc'].includes(c.type))n=1;return Array.from({length:n},(_,i)=>({i,label:['line','area','bars','hybrid','scatter','candle','kpi','step','stacked','radar','bubble','stream','range'].includes(c.type)?labels[i]:'Item '+(i+1)}))}
const heat=(i,variant)=>((i*13+(variant.length*7)+(sample.value==='B'?19:0))%6)
const current=(id)=>focus.value[id]??0
function pick(id,i){focus.value={...focus.value,[id]:i}}
function toggle(id){mode.value={...mode.value,[id]:!mode.value[id]}}
function readout(c){const i=current(c.id), j=i%6;const names=['Core','UI','Assets','Other'];switch(c.type){
case 'heat':case 'matrix':return `Cell ${i+1}: ${heat(i,c.id)*3} events`;
case 'donut':return `${names[i%4]}: ${shares[i%4]}%`;
case 'sankey':return ['Source A: 60 units','Source B: 40 units','Destination X: 50 units','Destination Y: 50 units'][i%4];
case 'waterfall':return ['Opening 60','Inflow +30','Outflow -20','Closing 70'][i%4];
case 'candle':{let v=values.value[j];return `${labels[j]}: open ${v+100}, high ${v+115}, low ${v+94}, close ${v+(j%2?-9:9)}`}
case 'stream':return `${labels[j]}: lower ${Math.round(second.value[j]*.25+18)}, middle ${Math.round(second.value[j]*.65+28)}, upper ${Math.round(values.value[j]*.8+20)}`;
case 'range':return `${labels[j]}: min ${rangeLower.value[j]}, max ${rangeUpper.value[j]}`;
case 'pyramid':return `Tier ${4-i%4}: ${[24,50,75,100][i%4]} units`;
case 'funnel':return `Stage ${i%4+1}: ${[100,75,50,24][i%4]}%`;
case 'bullet':return `${['Throughput','Latency','Uptime'][i%3]}: ${[82,65,95][i%3]}%, target ${[75,80,90][i%3]}%`;
case 'telemetry':return `${['CPU Temp: 42°C','GPU Temp: 58°C','Fan Speed: 1.2k RPM'][i%3]}`;
case 'treemap':return `${['Storage: 45%','Compute: 30%','Network: 15%','Cache: 10%'][i%4]}`;
case 'speed':case 'arc':return '84% of a 100% scale';
case 'radial':return `Ring ${i%4+1}: ${values.value[i%4]}%`;
case 'rings':case 'polar':return `Ring ${i%3+1}: ${values.value[i%3]}%`;
case 'scatter':case 'bubble':return `Node ${j+1}: x ${second.value[j]}, y ${values.value[j]}${c.type==='bubble'?', size '+(10+j*3):''}`;
case 'stacked':return `${labels[j]}: base ${second.value[j]}, top ${values.value[j]-second.value[j]}, total ${values.value[j]}`;
default:return `${labels[j]}: ${values.value[j]} units · secondary ${second.value[j]}`}}

const ticks=[0,25,50,75,100]
</script>
<template>
<div class="cg" :class="`cg-${props.language}`">
 <div class="cg-toolbar"><p>30 live chart patterns · synthetic data</p><label>Dataset <select v-model="sample"><option>A</option><option>B</option></select></label></div>
 <p class="cg-note">Hover or focus a mark to read its value. Use the readout buttons for a keyboard and touch readout. Motion follows your reduced-motion setting. These are Vue/SVG demos, not the reference's React package.</p>
 <div class="cg-grid">
  <section v-for="c in cards" :key="c.id" class="cg-card" :id="`mono-${c.id}`">
   <header><h3>{{ c.title }}</h3><button v-if="['line','bars'].includes(c.type)" @click="toggle(c.id)" :aria-pressed="!!mode[c.id]">{{ c.type==='line'?(mode[c.id]?'Single':'Dual'):(mode[c.id]?'Column':'Row') }}</button></header>
   <div v-if="c.type==='heat'||c.type==='matrix'" class="cg-matrix" :class="c.type==='heat'?'weeks':'dots'" :style="{'--heat':c.id==='heat-green'?'#21875d':c.id==='heat-blue'?'#1678b5':c.id==='heat-purple'?'#8052c7':'var(--cg-accent)'}" role="group" :aria-label="c.title">
    <button v-for="i in c.type==='heat'?140:35" :key="i" :style="{background:'var(--heat)',opacity:.15+heat(i-1,c.id)*.17}" :aria-label="`Cell ${i}: ${heat(i-1,c.id)*3} events`" @mouseenter="pick(c.id,i-1)" @focus="pick(c.id,i-1)"></button>
   </div>
   <div v-else-if="c.type==='kpi'" class="cg-kpi"><strong>${{ (48920+(sample==='B'?7400:0)).toLocaleString('en-US') }}</strong><span>+14.2% · monthly revenue</span><svg viewBox="0 0 320 190" role="img" aria-label="Revenue sparkline"><path :d="line" class="cg-stroke"/><circle v-for="(v,i) in values" :key="i" :cx="X(i)" :cy="Y(v)" r="5" class="cg-dot" tabindex="0" :aria-label="`${labels[i]} revenue index ${v}`" @mouseenter="pick(c.id,i)" @focus="pick(c.id,i)"/></svg></div>
   <svg v-else viewBox="0 0 320 200" role="group" :aria-label="c.title+', sample dataset '+sample">
    <defs><linearGradient :id="`grad-${props.language}-${c.id}`" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--cg-accent)" stop-opacity=".5"/><stop offset="1" stop-color="var(--cg-accent)" stop-opacity=".04"/></linearGradient></defs>
    <template v-if="['line','area','hybrid','bars','step','stacked','candle','range','stream'].includes(c.type)&&!(c.type==='bars'&&mode[c.id])">
     <g v-for="v in ticks" :key="v"><line x1="30" x2="294" :y1="Y(v)" :y2="Y(v)" class="cg-gridline"/><text x="6" :y="Y(v)+4">{{ v }}</text></g>
     <text v-for="(m,i) in labels" :key="m" :x="X(i)" y="191" text-anchor="middle">{{ m }}</text>
    </template>
    <template v-if="c.type==='line'||c.type==='area'||c.type==='hybrid'">
     <path v-if="c.type==='area'" :d="area" :fill="`url(#grad-${props.language}-${c.id})`"/>
     <rect v-if="c.type==='hybrid'" v-for="(v,i) in values" :key="i" :x="X(i)-10" :y="Y(v)" width="20" :height="166-Y(v)" rx="10" class="cg-fill cg-faint"/>
     <path :d="line" class="cg-stroke"/>
     <path v-if="c.type==='line'&&!mode[c.id]" :d="line2" class="cg-stroke cg-secondary"/>
     <circle v-for="(v,i) in values" :key="i" :cx="X(i)" :cy="Y(v)" r="5" class="cg-dot" tabindex="0" :aria-label="`${labels[i]} ${v} units`" @mouseenter="pick(c.id,i)" @focus="pick(c.id,i)"/>
    </template>
    <template v-else-if="c.type==='bars'">
     <g v-for="(v,i) in values" :key="i" tabindex="0" :aria-label="`${labels[i]} ${v} units`" @mouseenter="pick(c.id,i)" @focus="pick(c.id,i)"><rect v-if="!mode[c.id]" :x="X(i)-12" :y="Y(v)" width="24" :height="166-Y(v)" rx="12" class="cg-fill"/><text v-if="mode[c.id]" x="8" :y="29+i*25">{{ labels[i] }}</text><rect v-else-if="false"/><rect v-if="mode[c.id]" x="45" :y="17+i*25" :width="v*2.4" height="16" rx="8" class="cg-fill"/></g><text v-if="mode[c.id]" x="45" y="190">0</text><text v-if="mode[c.id]" x="165" y="190">50</text><text v-if="mode[c.id]" x="285" y="190">100</text>
    </template>
    <template v-else-if="c.type==='donut'">
     <circle cx="160" cy="98" r="58" class="cg-ring-bg" stroke-width="21"/>
     <circle v-for="(v,i) in shares" :key="i" cx="160" cy="98" r="58" fill="none" stroke="var(--cg-accent)" stroke-width="21" stroke-linecap="round" :stroke-dasharray="`${ringLengths[i]-25} ${365-ringLengths[i]+25}`" :stroke-dashoffset="-shares.slice(0,i).reduce((a,b)=>a+b,0)/100*365" transform="rotate(-90 160 98)" :opacity="1-i*.2" tabindex="0" :aria-label="`${['Core','UI','Assets','Other'][i]} ${v}%`" @mouseenter="pick(c.id,i)" @focus="pick(c.id,i)"/>
     <text x="160" y="100" text-anchor="middle" class="cg-metric">100%</text><text x="160" y="119" text-anchor="middle">allocation</text>
    </template>
    <template v-else-if="c.type==='scatter'||c.type==='bubble'">
     <line x1="28" y1="170" x2="296" y2="170" class="cg-gridline"/><line x1="28" y1="20" x2="28" y2="170" class="cg-gridline"/>
     <circle v-for="(v,i) in values" :key="i" :cx="40+second[i]*4.8" :cy="Y(v)" :r="c.type==='bubble'?10+i*3:5" class="cg-dot" :opacity=".4+i*.1" tabindex="0" :aria-label="`Node ${i+1}: x ${second[i]}, y ${v}${c.type==='bubble'?', size '+(10+i*3):''}`" @mouseenter="pick(c.id,i)" @focus="pick(c.id,i)"/>
     <text x="160" y="191" text-anchor="middle">secondary units (x) · primary units (y)</text>
    </template>
    <template v-else-if="c.type==='candle'">
     <g v-for="(v,i) in values" :key="i" tabindex="0" :aria-label="`${labels[i]} open ${v+100}, high ${v+115}, low ${v+94}, close ${v+(j%2?-9:9)}`" @mouseenter="pick(c.id,i)" @focus="pick(c.id,i)"><line :x1="X(i)" :x2="X(i)" :y1="Y(v+15)" :y2="Y(v-6)" class="cg-stroke"/><rect :x="X(i)-9" :y="Y(v+(i%2?0:9))" width="18" height="13.5" rx="3" :fill="i%2?'var(--cg-panel)':'var(--cg-accent)'" stroke="var(--cg-accent)" stroke-width="2"/></g><text x="298" y="17" text-anchor="end">price offset +100</text>
    </template>
    <template v-else-if="c.type==='pyramid'||c.type==='funnel'">
     <g v-for="(v,i) in c.type==='pyramid'?[24,50,75,100]:[100,75,50,24]" :key="i" tabindex="0" :aria-label="`Stage ${i+1}: ${v} percent`" @mouseenter="pick(c.id,i)" @focus="pick(c.id,i)"><rect :x="c.type==='pyramid'?160-(24+i*25):35" :y="18+i*40" :width="c.type==='pyramid'?48+i*50:v*2.5" height="28" rx="10" class="cg-fill" :opacity="1-i*.18"/><text :x="c.type==='pyramid'?160:45" :y="37+i*40" :text-anchor="c.type==='pyramid'?'middle':'start'" class="cg-inverse">{{ c.type==='pyramid'?`Tier ${4-i}`:`${v}%` }}</text></g>
    </template>
    <template v-else-if="['radial','rings','polar'].includes(c.type)">
     <g v-for="(v,i) in values.slice(0,c.type==='radial'?4:3)" :key="i" tabindex="0" :aria-label="`Ring ${i+1}: ${v}%`" @mouseenter="pick(c.id,i)" @focus="pick(c.id,i)"><circle cx="160" :cy="c.type==='radial'?154:100" :r="76-i*17" fill="none" stroke="var(--cg-line)" stroke-width="10" :stroke-dasharray="c.type==='radial'?`${Math.PI*(76-i*17)} ${Math.PI*(76-i*17)}`:undefined" :transform="c.type==='radial'?'rotate(-180 160 154)':undefined"/><circle cx="160" :cy="c.type==='radial'?154:100" :r="76-i*17" fill="none" stroke="var(--cg-accent)" stroke-width="10" stroke-linecap="round" :stroke-dasharray="`${(c.type==='radial'?Math.PI:2*Math.PI)*(76-i*17)*v/100} ${2*Math.PI*(76-i*17)}`" :transform="c.type==='radial'?'rotate(-180 160 154)':'rotate(-90 160 100)'" :opacity="1-i*.2"/></g>
    </template>
    <template v-else-if="c.type==='speed'||c.type==='arc'">
     <path d="M65 140 A95 95 0 0 1 255 140" class="cg-ring-bg" stroke-width="22" stroke-linecap="round"/>
     <path d="M65 140 A95 95 0 0 1 255 140" fill="none" stroke="var(--cg-accent)" stroke-width="22" stroke-linecap="round" pathLength="100" stroke-dasharray="84 100" tabindex="0" aria-label="84 percent performance" @mouseenter="pick(c.id,4)" @focus="pick(c.id,4)"/>
     <line v-if="c.type==='speed'" x1="160" y1="135" x2="232" y2="95" class="cg-stroke"/><text x="160" y="160" text-anchor="middle" class="cg-metric">84%</text><text x="160" y="185" text-anchor="middle">{{ c.type==='speed'?'performance index':'load index' }}</text>
    </template>
    <template v-else-if="c.type==='bullet'">
     <g v-for="(v,i) in [82,65,95]" :key="i" tabindex="0" :aria-label="`${['Throughput','Latency','Uptime'][i]}: ${v}%, target ${[75,80,90][i]}%`" @mouseenter="pick(c.id,i)" @focus="pick(c.id,i)"><text x="25" :y="25+i*55">{{ ['Throughput','Latency','Uptime'][i] }} · {{ v }} / {{ [75,80,90][i] }}%</text><rect x="25" :y="34+i*55" width="270" height="15" rx="7" fill="var(--cg-line)"/><rect x="25" :y="34+i*55" :width="v*2.7" height="15" rx="7" class="cg-fill"/><line :x1="25+[75,80,90][i]*2.7" :x2="25+[75,80,90][i]*2.7" :y1="29+i*55" :y2="54+i*55" stroke="var(--cg-text)" stroke-width="2"/></g>
    </template>
    <template v-else-if="c.type==='sankey'">
     <path d="M55 48 C145 48 175 58 265 58" fill="none" stroke="var(--cg-accent)" stroke-width="36" opacity=".6"/>
     <path d="M55 84 C145 84 175 148 265 148" fill="none" stroke="var(--cg-accent)" stroke-width="36" opacity=".3"/>
     <path d="M55 142 C145 142 175 88 265 88" fill="none" stroke="var(--cg-accent)" stroke-width="24" opacity=".5"/>
     <path d="M55 166 C145 166 175 178 265 178" fill="none" stroke="var(--cg-accent)" stroke-width="24" opacity=".4"/>
     <g v-for="(n,i) in [{x:25,y:30,h:72,t:'A · 60'},{x:25,y:130,h:48,t:'B · 40'},{x:265,y:40,h:60,t:'X · 50'},{x:265,y:130,h:60,t:'Y · 50'}]" :key="i" tabindex="0" :aria-label="n.t+' units'" @mouseenter="pick(c.id,i)" @focus="pick(c.id,i)"><rect :x="n.x" :y="n.y" width="30" :height="n.h" rx="5" class="cg-fill"/><text :x="n.x+15" :y="n.y-8" text-anchor="middle">{{ n.t }}</text></g>
    </template>
    <template v-else-if="c.type==='step'"><path :d="step" class="cg-stroke"/><circle v-for="(v,i) in values" :key="i" :cx="X(i)" :cy="Y(v)" r="5" class="cg-dot" tabindex="0" :aria-label="`Step ${i+1}: ${v}`" @mouseenter="pick(c.id,i)" @focus="pick(c.id,i)"/></template>
    <template v-else-if="c.type==='stacked'">
     <g v-for="(v,i) in values" :key="i" tabindex="0" :aria-label="`${labels[i]}: base ${second[i]}, top ${v-second[i]}, total ${v}`" @mouseenter="pick(c.id,i)" @focus="pick(c.id,i)"><rect :x="X(i)-12" :y="Y(v)" width="24" :height="(v-second[i])*1.5" rx="5" class="cg-fill" opacity=".45"/><rect :x="X(i)-12" :y="Y(second[i])" width="24" :height="second[i]*1.5" rx="5" class="cg-fill"/></g>
    </template>
    <template v-else-if="c.type==='radar'">
     <polygon points="160,20 229,60 229,140 160,180 91,140 91,60" fill="none" stroke="var(--cg-line)"/><polygon points="160,60 194,80 194,120 160,140 126,120 126,80" fill="none" stroke="var(--cg-line)"/><polygon :points="radar" fill="var(--cg-accent)" fill-opacity=".2" stroke="var(--cg-accent)" stroke-width="2"/>
     <g v-for="(v,i) in values" :key="i"><text :x="160+Math.cos(i*Math.PI/3-Math.PI/2)*94" :y="103+Math.sin(i*Math.PI/3-Math.PI/2)*94" text-anchor="middle">{{ labels[i] }}</text><circle :cx="160+Math.cos(i*Math.PI/3-Math.PI/2)*v*.85" :cy="100+Math.sin(i*Math.PI/3-Math.PI/2)*v*.85" r="5" class="cg-dot" tabindex="0" :aria-label="`${labels[i]} ${v}`" @mouseenter="pick(c.id,i)" @focus="pick(c.id,i)"/></g>
    </template>
    <template v-else-if="c.type==='telemetry'">
     <g v-for="(name,i) in ['CPU Temp','GPU Temp','Fan Speed']" :key="name" tabindex="0" :aria-label="name+': '+[42,58,1200][i]+(['°C','°C',' RPM'][i])" @mouseenter="pick(c.id,i)" @focus="pick(c.id,i)"><text x="14" :y="35+i*57">{{ name }} · {{ [42,58,1200][i] }}{{ ['°C','°C',' RPM'][i] }}</text><path :d="line" :transform="`translate(102 ${i*57-1}) scale(.65 .25)`" class="cg-stroke"/></g>
    </template>
    <template v-else-if="c.type==='treemap'">
     <g v-for="(r,i) in [{x:20,y:20,w:124.2,h:160,t:'Storage',pct:45},{x:144.2,y:20,w:151.8,h:87.27,t:'Compute',pct:30},{x:144.2,y:107.27,w:91.08,h:72.73,t:'Network',pct:15},{x:235.28,y:107.27,w:60.72,h:72.73,t:'Cache',pct:10}]" :key="i" tabindex="0" :aria-label="r.t+' '+r.pct+'%'" @mouseenter="pick(c.id,i)" @focus="pick(c.id,i)"><rect :x="r.x" :y="r.y" :width="r.w" :height="r.h" rx="8" class="cg-fill" stroke="var(--cg-panel)" stroke-width="4" :opacity="1-i*.2"/><text :x="r.x+6" :y="r.y+20" class="cg-inverse">{{ r.t }}</text><text :x="r.x+6" :y="r.y+r.h-10" class="cg-inverse">{{ r.pct }}%</text></g>
    </template>
    <template v-else-if="c.type==='stream'">
     <path :d="spline(values.map(v=>v*.8+20))+reverseSpline(second.map(v=>v*.25+18))+' Z'" fill="var(--cg-accent)" opacity=".25"/><path :d="spline(second.map(v=>v*.65+28))+reverseSpline(second.map(v=>v*.25+18))+' Z'" fill="var(--cg-accent)" opacity=".35"/><path :d="spline(values.map(v=>v*.8+20))" class="cg-stroke"/><path :d="spline(second.map(v=>v*.65+28))" class="cg-stroke cg-secondary"/>
    </template>
    <template v-else-if="c.type==='waterfall'">
     <g v-for="(r,i) in [{v:60,b:0,t:'Start'},{v:30,b:60,t:'Inflow'},{v:20,b:70,t:'Outflow'},{v:70,b:0,t:'Net'}]" :key="i" tabindex="0" :aria-label="`${r.t}: ${i===2?'-':i===1?'+':''}${r.v}`" @mouseenter="pick(c.id,i)" @focus="pick(c.id,i)"><rect :x="30+i*73" :y="Y(r.b+r.v)" width="45" :height="r.v*1.5" rx="7" class="cg-fill" :opacity="i===2?.4:1"/><text :x="52+i*73" y="190" text-anchor="middle">{{ r.t }}</text></g><path d="M75 76 H103 M148 31 H176 M221 61 H249" class="cg-gridline"/>
    </template>
    <template v-else-if="c.type==='range'"><path :d="band" :fill="`url(#grad-${props.language}-${c.id})`"/><path :d="spline(rangeUpper)" class="cg-stroke"/><path :d="spline(rangeLower)" class="cg-stroke cg-secondary"/></template>
    <g v-if="c.type==='stream'||c.type==='range'"><circle v-for="(v,i) in values" :key="i" :cx="X(i)" :cy="Y(c.type==='range'?rangeUpper[i]:v*.8+20)" r="6" class="cg-dot" tabindex="0" :aria-label="`${labels[i]}: ${c.type==='range'?'min '+rangeLower[i]+', max '+rangeUpper[i]:values[i]+' primary, '+second[i]+' secondary'}`" @mouseenter="pick(c.id,i)" @focus="pick(c.id,i)"/></g>
   </svg>
   <div class="cg-readout" aria-live="polite">{{ readout(c) }}</div>
   <div class="cg-values" role="group" :aria-label="c.title+' data readout'"><button v-for="o in options(c)" :key="o.i" :aria-pressed="current(c.id)===o.i" @click="pick(c.id,o.i)" @focus="pick(c.id,o.i)">{{ o.label }}</button></div>
  </section>
 </div>
</div>
</template>
<style>
.cg{--cg-bg:#111120;--cg-panel:#1b192f;--cg-line:#3a3454;--cg-text:#f5f3ff;--cg-muted:#c3bed7;--cg-accent:#aba6ff;--cg-ink:#111120;color:var(--cg-text);font:13px/1.5 'DM Sans',sans-serif;container-type:inline-size}
.cg-felix{--cg-bg:#f5f1eb;--cg-panel:#fffefa;--cg-line:#ded9d1;--cg-text:#172d2c;--cg-muted:#526460;--cg-accent:#087b76;--cg-ink:#fffefa}html.felix-dark .cg-felix{--cg-bg:#082422;--cg-panel:#152f2e;--cg-line:#35605f;--cg-text:#fefcf9;--cg-muted:#c3e2e1;--cg-accent:#69d7d2;--cg-ink:#082422}
.cg-pulsefit{--cg-bg:#f5f5f5;--cg-panel:#fff;--cg-line:#dedede;--cg-text:#212121;--cg-muted:#5f666d;--cg-accent:#7a5a1f;--cg-ink:#fff;font-family:'Rubik',sans-serif}
.cg *{box-sizing:border-box}.cg-toolbar{display:flex;gap:16px;justify-content:space-between;align-items:center;flex-wrap:wrap;padding:16px;background:var(--cg-bg);border:1px solid var(--cg-line);border-radius:14px}.cg-toolbar p{margin:0!important}.cg select,.cg button{font:inherit;color:var(--cg-text);background:var(--cg-panel);border:1px solid var(--cg-line);border-radius:8px;padding:5px 9px}.cg button{cursor:pointer}.cg button:focus-visible,.cg [tabindex]:focus-visible{outline:2px solid var(--cg-accent);outline-offset:3px}.cg button[aria-pressed=true]{background:var(--cg-accent);color:var(--cg-ink)}.cg-note{color:var(--cg-muted);font-size:12px}.cg-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.cg-card{min-width:0;background:var(--cg-panel);border:1px solid var(--cg-line);padding:18px;border-radius:18px;scroll-margin-top:80px;transition:transform .25s,border-color .25s}.cg-card:hover{transform:translateY(-2px);border-color:var(--cg-accent)}.cg-card header{display:flex;justify-content:space-between;gap:10px;align-items:center;min-height:44px}.cg-card h3{margin:0!important;font-size:14px!important;line-height:1.4;letter-spacing:0;border:0!important;color:var(--cg-text)!important}.cg-card svg{width:100%;height:auto;display:block;min-height:150px;margin:12px 0}.cg-card svg text{fill:var(--cg-muted);font-size:10px;font-family:inherit}.cg-card svg .cg-metric{font-size:23px;fill:var(--cg-text);font-weight:700}.cg-card svg .cg-inverse{fill:var(--cg-ink);font-size:10px}.cg-gridline{stroke:var(--cg-line);stroke-width:1;stroke-dasharray:3 4;fill:none}.cg-stroke{stroke:var(--cg-accent);stroke-width:3;fill:none;stroke-linecap:round;stroke-linejoin:round;transition:d .4s}.cg-secondary{stroke-dasharray:5 5;opacity:.6}.cg-fill,.cg-dot{fill:var(--cg-accent)}.cg-dot{stroke:var(--cg-panel);stroke-width:1}.cg-faint{opacity:.25}.cg-ring-bg{stroke:var(--cg-line);fill:none}.cg-readout{color:var(--cg-muted);min-height:36px;font-size:11px}.cg-values{display:flex;gap:4px;flex-wrap:wrap;margin-top:8px}.cg-values button{font-size:10px;padding:4px 6px}.cg-matrix{display:grid;gap:3px;margin:24px 0;min-height:160px}.cg-matrix.weeks{grid-template-rows:repeat(7,1fr);grid-template-columns:repeat(20,1fr);grid-auto-flow:column}.cg-matrix.dots{grid-template-columns:repeat(7,1fr)}.cg-matrix button{border:0;padding:0;border-radius:3px;min-width:0;transition:opacity .2s}.cg-kpi strong{display:block;font-size:28px;margin-top:16px}.cg-kpi span{font-size:11px;color:var(--cg-muted)}.cg-kpi svg{min-height:120px}
@container(max-width:580px){.cg-grid{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.cg *{transition:none!important;animation:none!important}.cg-card:hover{transform:none}} 
</style>

<style>
.cg-note{color:var(--vp-c-text-2)}.cg-card svg{animation:cg-reveal .65s ease-out both}.cg-card .cg-stroke:not(.cg-secondary){animation:cg-line-in .8s ease-out}.cg-card:nth-child(2n) svg{animation-delay:.08s}@keyframes cg-reveal{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}@keyframes cg-line-in{from{stroke-dasharray:400;stroke-dashoffset:400}to{stroke-dashoffset:0}}@media(prefers-reduced-motion:reduce){.cg-card svg,.cg-card .cg-stroke{animation:none!important}}
</style>
