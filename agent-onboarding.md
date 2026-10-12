---
aside: false
---
<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { animate, stagger } from 'motion'
// Original code; source posts credit visual patterns only. No code or assets copied.
const el=ref(null), tab=ref('Agent onboarding'), dark=ref(false), state=ref('Ready'), note=ref(''),unit=ref('Cost'),flag=ref(false),query=ref(''),step=ref(0),wizard=ref(false),replayed=ref(false),name=ref('Tax preparation'),brief=ref('Draft returns. Ask before filing or moving money.'),cap=ref(500),reviewed=ref(false),selected=ref('Gateway'),incident=ref(false)
const rows=ref([{name:'Labor',plan:700,actual:1020,h:8,a:12},{name:'Materials',plan:800,actual:980,h:0,a:0},{name:'Specialist',plan:350,actual:350,h:3,a:3},{name:'Permits',plan:190,actual:190,h:1,a:1},{name:'Reserve',plan:160,actual:160,h:0,a:0},{name:'Transport',plan:100,actual:100,h:2,a:2}])
const total=computed(()=>rows.value.reduce((s,r)=>s+r.actual,0)),planned=computed(()=>rows.value.reduce((s,r)=>s+r.plan,0))
const agents=ref([{name:'Invoice helper',scope:'Mail · Read',status:'Active',ttl:24},{name:'Release helper',scope:'Repository · Deploy',status:'Review',ttl:12},{name:'Data sync',scope:'Warehouse · Write',status:'Review',ttl:10},{name:'Research helper',scope:'Drive · Read',status:'Revoked',ttl:40}])
const filtered=computed(()=>agents.value.filter(a=>a.name.toLowerCase().includes(query.value.toLowerCase())))
const nodes=[{name:'Gateway',x:350,y:50,latency:18},{name:'Auth',x:200,y:160,latency:24},{name:'API',x:500,y:160,latency:42},{name:'Database',x:130,y:280,latency:8},{name:'Cache',x:350,y:280,latency:2},{name:'Workers',x:570,y:280,latency:120}]
const edges=[[0,1],[0,2],[1,3],[2,4],[2,5]],current=computed(()=>nodes.find(n=>n.name===selected.value))
function path(e){let a=nodes[e[0]],b=nodes[e[1]];return `M${a.x} ${a.y+25}V${(a.y+b.y)/2}H${b.x}V${b.y-25}`}
let media,animations=[],disposed=false,generation=0
function stop(){animations.forEach(a=>a.stop());animations=[];el.value?.querySelectorAll('.lab-card').forEach(e=>{e.style.opacity=1;e.style.transform='none'})}
async function enter(){const token=++generation;stop();await nextTick();if(!disposed&&token===generation&&el.value&&!media?.matches)animations.push(animate(el.value.querySelectorAll('.lab-card'),{opacity:[0,1],y:[5,0]},{duration:.25,delay:stagger(.035)}))}
watch([tab,state,wizard,step],enter)
onMounted(()=>{media=matchMedia('(prefers-reduced-motion: reduce)');media.addEventListener('change',stop);enter()})
onUnmounted(()=>{disposed=true;generation++;stop();media?.removeEventListener('change',stop)})
</script>

# Brief

A standalone original agent onboarding template. Responsive, local interactive states and Motion. Fictitious data; no external accounts connected.

<div ref="el" :class="['lab',{'lab-dark':dark}]">
<header><div><strong class="lab-brand">brief.</strong><small>AGENT ONBOARDING</small></div><button @click="dark=!dark">{{dark?'Light':'Dark'}} mode</button><label>State<select v-model="state"><option>Ready</option><option>Loading</option><option>Empty</option></select></label></header>
<div v-if="state!=='Ready'" class="lab-placeholder" role="status"><h2>{{state==='Loading'?'Loading sample data':'No records'}}</h2><button @click="state='Ready'">Restore sample</button></div>
<main v-else><section ><div class="lab-title"><div><small>WORKSPACE / AGENTS</small><h2>Brief it like a new hire</h2><p>Brief. Reviewed rules. Limits. Proof before launch.</p></div><button @click="wizard=true;step=0;replayed=false;reviewed=false">+ New demo agent</button></div><div class="lab-kpis"><article class="lab-card" v-for="a in ['Payables','Receivables','Expense review']" :key="a"><small>LOCAL DEMO</small><h3>{{a}}</h3><p>Draft and ask before any consequential action.</p><button @click="note=a+': sample policy opened.'">Review policy</button></article></div><article v-if="wizard" class="lab-card lab-wizard"><header><h3>New agent · {{name}}</h3><button aria-label="Close setup" @click="wizard=false">×</button></header><ol class="lab-steps"><li v-for="(s,i) in ['Brief','Rules','Limits','Proof']" :key="s" :aria-current="step===i?'step':undefined">{{i<step?'✓':i+1}} {{s}}</li></ol><div v-if="step===0"><label>Name<input v-model="name" maxlength="80"/></label><label>What should it do?<textarea v-model="brief" rows="4" maxlength="1000"></textarea></label></div><div v-if="step===1"><h3>Review proposed rules</h3><ul><li>Draft returns; do not file without approval.</li><li>Ask before every payment or transfer.</li><li>Pause when source data conflicts.</li></ul><label class="lab-check"><input v-model="reviewed" type="checkbox"/>I reviewed these sample rules</label></div><div v-if="step===2"><label>Illustrative daily cap (USD)<input v-model.number="cap" type="number" min="0" max="5000"/></label><aside>A cap is not payment permission. This demo moves no money.</aside></div><div v-if="step===3"><h3>Prove it on last month</h3><button @click="replayed=true;note='Replay complete. No return filed and no payment made.'">Run sample replay</button><dl v-if="replayed"><div><dt>Draft returns prepared</dt><dd>3</dd></div><div><dt>Sample total reconciled</dt><dd>$38,600</dd></div><div><dt>Payment needs approval</dt><dd>$620 (cap ${{cap}})</dd></div></dl></div><footer><button :disabled="step===0" @click="step--">Back</button><button v-if="step<3" :disabled="step===0&&(!name.trim()||!brief.trim())||step===1&&!reviewed||step===2&&(!Number.isFinite(cap)||cap<0||cap>5000)" @click="step++">Next →</button><button v-else :disabled="!replayed" @click="wizard=false;note='Draft kept in this demo session. No account or authority granted.'">Save local draft</button></footer></article></section></main><div v-if="note" role="status" class="lab-note"><span>{{note}}</span><button aria-label="Dismiss feedback" @click="note=''">×</button></div></div>

## Template guide

- Use the standalone page as a Vue3 layout or adapt its scoped `.lab` tokens to your app. Existing `motion` handles entrance states and reduced-motion cleanup.
- Light/dark, narrow layouts and Loading/Empty/Ready can be tested from the header.
- Actions update this example session only. Add your own persistence, source validation and authorization before production use. No API, secret handling, telemetry or financial execution is bundled.
- Original code and fictitious data. Pattern credit: [Ilias](https://x.com/iliasconfidency/status/2108422208955519306). No source images, brands or code copied.

<style scoped>
.lab{--bg:#f5f5f7;--surface:#fff;--ink:#22252b;--muted:#676e7b;--line:#e0e3e9;--soft:#eceef5;background:var(--bg);color:var(--ink);border:1px solid var(--line);border-radius:16px;overflow:hidden;font:13px/1.5 system-ui,sans-serif;margin:25px 0}
.lab-dark{--bg:#181b22;--surface:#242833;--ink:#f1f3f8;--muted:#aab3c3;--line:#404757;--soft:#303747}
.lab *{box-sizing:border-box}
.lab :is(h2,h3,p){color:inherit;border:0;padding:0;margin:0 0 12px}
.lab h2{font-size:25px;letter-spacing:-.5px;line-height:1.3}
.lab h3{font-size:15px}
.lab small{display:block;font-size:10px;color:var(--muted)}
.lab button,.lab input,.lab select,.lab textarea{background:var(--surface);color:var(--ink);border:1px solid var(--line);border-radius:7px;padding:8px 10px;font:inherit}
.lab button{cursor:pointer;transition:background .16s,border-color .16s}
.lab button:hover:not(:disabled),.lab button.active{border-color:#6389ea;background:var(--soft)}
.lab button:disabled{opacity:.4;cursor:default}
.lab :is(button,input,select,textarea):focus-visible{outline:2px solid #6389ea;outline-offset:3px}
.lab>header,.lab nav{display:flex;flex-wrap:wrap;align-items:center;gap:10px;padding:16px 20px;border-bottom:1px solid var(--line)}
.lab>header>strong{margin-right:auto}
.lab header{display:flex;align-items:center;justify-content:space-between;gap:12px}
.lab nav{overflow:auto;flex-wrap:nowrap}
.lab nav button{white-space:nowrap}
.lab main{padding:22px 20px}
.lab-title{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:22px}
.lab-title p{color:var(--muted)}
.lab-grid{display:grid;grid-template-columns:minmax(0,1.8fr) minmax(240px,1fr);gap:18px;align-items:start}
.lab-card{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:20px;margin-bottom:16px;min-width:0}
.lab-card footer{display:flex;justify-content:space-between;gap:15px;border-top:1px solid var(--line);margin-top:20px;padding-top:15px;font-size:11px}
.lab-legend{font-size:10px;color:var(--muted);margin:15px 0!important}
.lab-legend span{color:#367cde;margin-left:10px}
.lab-legend b{color:#c44186;margin-left:10px}
.lab-cost{display:grid;grid-template-columns:1fr 1.1fr;gap:8px 12px;padding:14px 0;border-bottom:1px solid var(--line);align-items:center}
.lab-cost>small{grid-column:2}
.lab-bars{height:25px;position:relative}
.lab-bars i{position:absolute;height:7px;border-radius:3px;transition:width .25s}
.lab-bars .estimate{top:1px;background:repeating-linear-gradient(130deg,#b6cced 0 2px,#e1ecfb 2px 4px)}
.lab-bars .actual{top:13px;background:#2674e1}
.lab-bars .over{top:13px;background:repeating-linear-gradient(130deg,#d94491 0 2px,#ffd7ec 2px 4px)}
.lab-big{display:block;font-size:38px;line-height:1.2;letter-spacing:-1px;font-weight:500;margin:20px 0}
.lab dl{margin:20px 0}
.lab dl>div{display:flex;justify-content:space-between;gap:15px;border-bottom:1px solid var(--line);padding:12px 0}
.lab dd{font-weight:600;margin:0}
.lab-loss{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:11px;margin:15px 0}
.lab-loss i{height:7px;border-radius:4px;max-width:30%;background:repeating-linear-gradient(130deg,#d94491 0 2px,#ffd7ec 2px 4px)}
.lab-loss b{color:#c44186}
.lab aside{background:var(--soft);padding:15px;border-radius:9px;margin:20px 0}
.lab aside p{font-size:12px;margin:8px 0 15px}
.lab-timeline{list-style:none;display:grid;grid-template-columns:repeat(5,1fr);gap:12px;padding:0!important;margin-top:20px}
.lab-timeline li{border-top:2px solid #6389ea;padding:10px 0 0!important;font-size:10px;min-width:0}
.lab-timeline li strong{display:block;margin:5px 0}
.lab-kpis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.lab progress{display:block;width:100%;height:12px;accent-color:#6389ea;margin:15px 0}
.lab-ticks{display:flex;gap:3px;height:15px;margin:15px 0}
.lab-ticks i{width:4px;border-radius:2px;background:#6389ea}
.lab-ticks .faint{opacity:.2}
.lab-chart{display:flex;gap:10px;align-items:end;height:230px}
.lab-chart>div{flex:1;display:flex;flex-direction:column;gap:3px;text-align:center}
.lab-chart b{font-size:10px}
.lab-chart i{display:block;border-radius:5px;min-height:4px}
.lab-chart .allowed{background:linear-gradient(#9acbff,#277ee7)}
.lab-chart .blocked{background:linear-gradient(#ffa6a6,#e74d5e)}
.lab-table{overflow:auto}
.lab table{width:100%;display:table;border-collapse:collapse;font-size:11px;white-space:nowrap}
.lab :is(tr,th,td),.lab tr:nth-child(2n){background:transparent;color:inherit;border:0;border-bottom:1px solid var(--line);padding:12px 8px;text-align:left}
.lab th{color:var(--muted)}
.lab-wizard{max-width:660px;margin:20px auto;box-shadow:0 15px 40px #0001}
.lab label{display:grid;gap:8px;margin:12px 0}
.lab input:not([type=checkbox]),.lab textarea{width:100%;min-width:0}
.lab-steps{display:flex;list-style:none;gap:15px;padding:0!important;border-bottom:1px solid var(--line);padding-bottom:15px!important}
.lab-steps li{font-size:11px;flex:1}
.lab-steps [aria-current=step]{color:#6389ea;font-weight:700}
.lab .lab-check{display:flex;align-items:center;gap:10px}
.lab-topology{overflow:auto}
.lab-topology svg{width:100%;min-width:500px;height:350px}
.lab-topology g{cursor:pointer}
.lab-topology rect{fill:var(--surface);stroke:var(--line);stroke-width:1.5}
.lab-topology g.chosen rect,.lab-topology g:focus-visible rect{stroke:#6389ea;stroke-width:3}
.lab-topology g:focus{outline:none}
.lab-topology text{fill:var(--ink);font:600 12px system-ui,sans-serif}
.lab-topology .node-small{font-size:10px;font-weight:400;fill:var(--muted)}
.lab-note{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:15px 20px;margin:0 20px 20px;border:1px solid #6389ea;border-radius:9px;background:var(--surface)}
.lab-placeholder{text-align:center;padding:50px 25px}
@media(max-width:900px){.lab-grid{grid-template-columns:1fr}
.lab-kpis{grid-template-columns:1fr}
.lab-timeline{grid-template-columns:1fr}
.lab-title{align-items:start}
.lab-kpis .lab-card{margin-bottom:0}
.lab-kpis{margin-bottom:16px}
}
@media(max-width:500px){.lab main{padding:18px 12px}
.lab-card{padding:15px}
.lab-title{flex-direction:column}
.lab-cost{grid-template-columns:1fr}
.lab-cost>small{grid-column:1}
.lab-steps{flex-wrap:wrap}
.lab-steps li{flex-basis:40%}
}
@media(prefers-reduced-motion:reduce){.lab *{transition:none!important;animation:none!important}
}


.lab :is(h1,h2,h3,h4,p,label,dt,dd,li,th,td){color:inherit!important}
.lab>header{position:relative}.lab button:focus-visible{outline:3px solid #6389ea}
.lab>header>div{margin-right:auto}.lab-brand{font-size:22px;letter-spacing:-1px}.lab main{padding:28px}
.lab-dark{--surface:#212731;--bg:#161c24;--soft:#2b3443}
@media(max-width:600px){.lab main{padding:16px}.lab-brand{font-size:20px}}
</style>
