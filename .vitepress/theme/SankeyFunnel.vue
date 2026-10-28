<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { animate, stagger } from 'motion'
// Original code and fictitious data. Pattern credit: live Sankey conversion journey posted by @shuxer. No code, brand or assets copied.
const props=defineProps({title:{type:String,default:'Trial journey'},subtitle:{type:String,default:'Where new trials convert or drop off. Sample data, local interactions only.'}})
const root=ref(null), svg=ref(null), range=ref('30D'), playing=ref(true), picked=ref('Signed up'), reducedMotion=ref(false)
const ranges={
  '7D':{scale:.24,src:[39,31,17,13],on:.68,inv:.55,up:.38},
  '30D':{scale:1,src:[41,29,19,11],on:.65,inv:.59,up:.375},
  '90D':{scale:3.1,src:[38,30,20,12],on:.62,inv:.62,up:.4}
}
const names=['Docs','Referrals','Newsletter','Marketplace']
const W=900,H=420,top=44,bottom=30,gap=14,nodeW=10
const cols=[
  {title:'Channels',ids:['Docs','Referrals','Newsletter','Marketplace']},
  {title:'Signed up',ids:['Signed up']},
  {title:'Activated',ids:['Activated','Skipped setup']},
  {title:'Team invited',ids:['Invited','Went solo']},
  {title:'Converted',ids:['Upgraded','Stayed on free']}
]
const kind=id=>['Skipped setup','Went solo','Stayed on free'].includes(id)?'drop':id==='Upgraded'?'win':'flow'
const model=computed(()=>{
  const r=ranges[range.value],total=Math.round(20400*r.scale)
  const src=r.src.map(p=>Math.round(total*p/100)),signed=src.reduce((a,b)=>a+b,0)
  const act=Math.round(signed*r.on),inv=Math.round(act*r.inv),up=Math.round(inv*r.up)
  const val={Docs:src[0],Referrals:src[1],Newsletter:src[2],Marketplace:src[3],'Signed up':signed,Activated:act,'Skipped setup':signed-act,Invited:inv,'Went solo':act-inv,Upgraded:up,'Stayed on free':inv-up}
  const links=[...names.map(n=>[n,'Signed up']),['Signed up','Activated'],['Signed up','Skipped setup'],['Activated','Invited'],['Activated','Went solo'],['Invited','Upgraded'],['Invited','Stayed on free']].map(([s,t])=>({s,t,v:names.includes(s)?val[s]:val[t]}))
  const unit=(H-top-bottom-gap*3)/signed
  const nodes={}
  cols.forEach((c,ci)=>{
    const x=24+ci*((W-48-nodeW)/(cols.length-1))
    const sum=c.ids.reduce((a,id)=>a+val[id],0),space=H-top-bottom
    let y=top+(space-(sum*unit+gap*(c.ids.length-1)))/2
    c.ids.forEach(id=>{const h=Math.max(val[id]*unit,5);nodes[id]={id,x,y,h,v:val[id],kind:kind(id),out:0,inn:0};y+=h+gap})
  })
  const paths=links.map(l=>{
    const a=nodes[l.s],b=nodes[l.t],h=Math.max(l.v*unit,3)
    const y0=a.y+a.out+h/2,y1=b.y+b.inn+h/2
    a.out+=h;b.inn+=h
    const x0=a.x+nodeW,x1=b.x,m=(x0+x1)/2
    return {...l,h,d:`M${x0},${y0}C${m},${y0} ${m},${y1} ${x1},${y1}`,kind:kind(l.t),pct:l.v/signed*100}
  })
  return {val,nodes,paths,signed,rate:up/signed*100}
})
const fmt=n=>n.toLocaleString('en-US')
const detail=computed(()=>{const n=model.value.nodes[picked.value]||model.value.nodes['Signed up'];const m=model.value;return {name:n.id,v:n.v,pct:n.v/m.signed*100,kind:n.kind}})
const cards=computed(()=>[
  ['Signed up',fmt(model.value.signed),'100%'],
  ['Activated',fmt(model.value.val.Activated),(model.value.val.Activated/model.value.signed*100).toFixed(1)+'%'],
  ['Team invited',fmt(model.value.val.Invited),(model.value.val.Invited/model.value.signed*100).toFixed(1)+'%'],
  ['Converted',model.value.rate.toFixed(1)+'%',fmt(model.value.val.Upgraded)+' upgraded']
])
let tm=0,raf=0,media,last=0,phase=0,anim=[],disposed=false,gen=0,mediaHandler
const parts=[]
function buildParticles(){
  cancelAnimationFrame(raf);parts.length=0
  const group=svg.value?.querySelector('.tj-particles');if(!group)return
  group.innerHTML=''
  svg.value.querySelectorAll('.tj-link').forEach((p,i)=>{
    const len=p.getTotalLength(),count=Math.max(1,Math.round(model.value.paths[i].h/6))
    for(let k=0;k<count;k++){
      const c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('r','1.6')
      c.setAttribute('class','tj-dot '+model.value.paths[i].kind);group.appendChild(c)
      parts.push({p,len,c,o:(k/count+i*.17)%1,off:(k%3-1)*Math.min(model.value.paths[i].h/3,6)})
    }
  })
  place(0)
}
function place(t){parts.forEach(q=>{const at=((q.o+t)%1)*q.len,pt=q.p.getPointAtLength(at);q.c.setAttribute('cx',pt.x);q.c.setAttribute('cy',pt.y+q.off);q.c.style.opacity=reducedMotion.value?0:1})}
function tick(now){if(!playing.value||reducedMotion.value||disposed)return;phase+=((now-last)||16)/9000;last=now;place(phase);raf=requestAnimationFrame(tick)}
function run(){cancelAnimationFrame(raf);if(playing.value&&!reducedMotion.value){last=performance.now();raf=requestAnimationFrame(tick)}else place(phase)}
function settle(){clearTimeout(tm);anim.forEach(a=>a.stop());anim=[];root.value?.querySelectorAll('.tj-link,.tj-node,.tj-kpi').forEach(e=>{e.style.opacity='';e.style.transform=''})}
async function enter(){
  const token=++gen;settle();await nextTick()
  if(disposed||token!==gen||!root.value)return
  buildParticles();run()
  if(reducedMotion.value)return
  const done=()=>{if(token===gen)root.value?.querySelectorAll('.tj-link,.tj-kpi').forEach(e=>{e.style.opacity='';e.style.transform=''})}
  const links=animate(root.value.querySelectorAll('.tj-link'),{opacity:[0,.6]},{duration:.45,delay:stagger(.03)})
  const kpis=animate(root.value.querySelectorAll('.tj-kpi'),{opacity:[0,1],y:[6,0]},{duration:.3,delay:stagger(.04)})
  anim.push(links,kpis)
  clearTimeout(tm);tm=setTimeout(done,1100)
}
function replay(){phase=0;picked.value='Signed up';enter()}
function toggle(){playing.value=!playing.value;run()}
watch(range,enter)
watch(playing,run)
onMounted(()=>{
  media=matchMedia('(prefers-reduced-motion: reduce)');reducedMotion.value=media.matches
  mediaHandler=()=>{reducedMotion.value=media.matches;enter()};media.addEventListener('change',mediaHandler)
  enter()
})
onUnmounted(()=>{disposed=true;cancelAnimationFrame(raf);settle();media?.removeEventListener('change',mediaHandler)})
</script>

<template>
<div class="tj" ref="root">
<header class="tj-head">
<div><h3 class="tj-title">{{props.title}} <span class="tj-pill">{{fmt(model.signed)}} trials</span></h3><p>{{props.subtitle}}</p></div>
<div class="tj-tools">
<div role="group" aria-label="Date range"><button v-for="r in Object.keys(ranges)" :key="r" :class="{on:range===r}" :aria-pressed="range===r" @click="range=r">{{r}}</button></div>
<button @click="replay" aria-label="Replay flow">Replay</button>
<button @click="toggle" :aria-pressed="!playing" :disabled="reducedMotion">{{playing&&!reducedMotion?'Pause':'Play'}}</button>
</div>
</header>
<div class="tj-kpis"><div v-for="c in cards" :key="c[0]" class="tj-kpi"><small>{{c[0]}}</small><strong>{{c[1]}}</strong><span>{{c[2]}}</span></div></div>
<div class="tj-scroll">
<svg ref="svg" :viewBox="`0 0 ${W} ${H}`" role="group" aria-label="Sankey chart of the trial journey from channels to conversion">
<g v-for="(c,i) in cols" :key="c.title"><text class="tj-col" :x="model.nodes[c.ids[0]].x+(i===cols.length-1?nodeW:0)" y="22" :text-anchor="i===cols.length-1?'end':'start'">{{c.title}}</text></g>
<g class="tj-links">
<path v-for="p in model.paths" :key="p.s+p.t" class="tj-link" :class="[p.kind,{dim:picked!==p.s&&picked!==p.t}]" :d="p.d" :stroke-width="p.h" fill="none" />
</g>
<g class="tj-nodes">
<g v-for="n in model.nodes" :key="n.id" class="tj-node" :class="[n.kind,{on:picked===n.id}]" tabindex="0" role="button" :aria-label="`${n.id}: ${fmt(n.v)}`" @mouseenter="picked=n.id" @focus="picked=n.id" @click="picked=n.id" @keydown.enter.prevent="picked=n.id">
<rect :x="n.x" :y="n.y" :width="nodeW" :height="n.h" rx="2"/>
<text :x="n.x<W/2?n.x+nodeW+6:n.x-6" :y="n.y+Math.min(n.h/2,14)" :text-anchor="n.x<W/2?'start':'end'">{{n.id}}<tspan :x="n.x<W/2?n.x+nodeW+6:n.x-6" dy="12">{{fmt(n.v)}}</tspan></text>
</g>
</g>
<g class="tj-particles" aria-hidden="true"></g>
</svg>
</div>
<div class="tj-detail" role="status"><strong>{{detail.name}}</strong><span>{{fmt(detail.v)}} trials · {{detail.pct.toFixed(1)}}% of sign-ups</span><em v-if="detail.kind==='drop'">Drop-off</em><em v-else-if="detail.kind==='win'" class="win">Converted</em></div>
<p class="tj-foot"><span><i class="win"></i>Upgraded</span><span><i class="drop"></i>Dropped off</span><span>Particle density follows trial volume. Fictitious data, no analytics service connected.</span></p>
</div>
</template>

<style>
.tj{--bg:var(--vp-c-bg);--card:var(--vp-c-bg-soft);--line:var(--vp-c-divider);--ink:var(--vp-c-text-1);--mute:var(--vp-c-text-2);--up:#2fbf8a;--down:#e5566a;max-width:1000px;margin:24px 0;padding:18px;background:var(--bg);color:var(--ink);border:1px solid var(--line);border-radius:14px;overflow:hidden}
.tj *{box-sizing:border-box}
.tj-head{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:flex-start}
.tj-head>div{min-width:0}
.tj .tj-title{margin:0;border:0;padding:0;font-size:17px;letter-spacing:0;color:var(--ink)}
.tj p{margin:4px 0 0;color:var(--mute);font-size:12px}
.tj-pill{font-size:10px;font-weight:500;padding:2px 7px;border-radius:99px;background:var(--vp-c-default-soft);color:var(--mute);vertical-align:middle}
.tj-tools{display:flex;gap:8px;flex-wrap:wrap}
.tj-tools [role=group]{display:flex;border:1px solid var(--line);border-radius:8px;overflow:hidden}
.tj button{font:inherit;font-size:11px;color:var(--mute);background:transparent;border:1px solid var(--line);border-radius:8px;padding:5px 10px;cursor:pointer}
.tj-tools [role=group] button{border:0;border-radius:0}
.tj button.on{background:var(--vp-c-default-soft);color:var(--ink)}
.tj button:disabled{opacity:.45;cursor:default}
.tj button:focus-visible,.tj-node:focus-visible{outline:2px solid var(--vp-c-brand-1);outline-offset:2px}
.tj-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:16px 0}
.tj-kpi{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 12px;display:grid;gap:2px;min-width:0}
.tj-kpi small{color:var(--mute);font-size:10px}
.tj-kpi strong{font-size:18px}
.tj-kpi span{font-size:11px;color:var(--mute)}
.tj-scroll{overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:10px;min-width:0}
.tj svg{display:block;width:100%;min-width:640px;height:auto}
.tj-col{fill:var(--mute);font-size:10px}
.tj-link{pointer-events:none;stroke:var(--vp-c-text-3);opacity:.35;transition:opacity .2s}
.tj-link.drop{stroke:var(--down)}
.tj-link.win{stroke:var(--up)}
.tj-link:not(.dim){opacity:.6}
.tj-node rect{fill:var(--vp-c-text-2)}
.tj-node.drop rect{fill:var(--down)}
.tj-node.win rect{fill:var(--up)}
.tj-node{cursor:pointer;outline:none}
.tj-node text{fill:var(--ink);font-size:10px;paint-order:stroke;stroke:var(--vp-c-bg-soft);stroke-width:3px;stroke-linejoin:round}
.tj-node tspan{fill:var(--mute)}
.tj-node.on text{font-weight:700}
.tj-dot{fill:var(--vp-c-text-1);pointer-events:none}
.tj-dot.drop{fill:var(--down)}
.tj-detail{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:12px;font-size:12px}
.tj-detail span{color:var(--mute)}
.tj-detail em{font-style:normal;font-size:10px;padding:2px 7px;border-radius:99px;background:color-mix(in srgb,var(--down) 22%,transparent);color:var(--ink)}
.tj-detail em.win{background:color-mix(in srgb,var(--up) 22%,transparent);color:var(--ink)}
.tj-foot{display:flex;gap:14px;flex-wrap:wrap;margin-top:10px!important;font-size:10px!important}
.tj-foot i{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:5px;background:var(--up)}
.tj-foot i.drop{background:var(--down)}
@media(max-width:600px){.tj{padding:12px;margin:12px 0}.tj-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(prefers-reduced-motion:reduce){.tj *{transition:none!important;animation:none!important}}
</style>
