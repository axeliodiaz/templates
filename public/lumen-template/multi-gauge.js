// Multiple independent measurements share one dial, never an aggregate value.
const NS='http://www.w3.org/2000/svg';let motion;
const palette=['#3b82f6','#22a06b','#d97706','#9b6be8','#dc4a62'];
function normalize(input){
 const p={size:240,label:'Usage limits',showLegend:true,series:[],...input};
 p.messages={unavailable:'Unavailable',range:'Range',above:'above range',below:'below range',...p.messages};
 if(typeof p.label!=='string'||Object.values(p.messages).some(v=>typeof v!=='string'))throw new TypeError('label and messages must be strings');
 if(!Number.isFinite(p.size)||p.size<120||p.size>800)throw new RangeError('size must be120-800');
 if(!Array.isArray(p.series)||p.series.length<1||p.series.length>5)throw new RangeError('one to five series required');
 const ids=new Set();p.series=p.series.map((s,i)=>{
  if(!s||typeof s.id!=='string'||!s.id||ids.has(s.id)||typeof s.label!=='string'||!s.label)throw new TypeError('unique id and label required');ids.add(s.id);
  const r={min:0,max:100,unit:'%',color:palette[i],...s};
  if(!Number.isFinite(r.min)||!Number.isFinite(r.max)||r.max<=r.min||!(r.value===null||Number.isFinite(r.value)))throw new RangeError('finite ordered range and finite or null value required');
  if(typeof r.unit!=='string'||typeof r.color!=='string'||(r.detail!==undefined&&typeof r.detail!=='string'))throw new TypeError('unit, color and detail must be strings');
  return r;
 });return p;
}
export function createMultiGauge(host,input){
 if(!(host instanceof Element))throw new TypeError('host must be an Element');
 let p=normalize(input),disposed=false,epoch=0,animations=[],settle,active=null,shown=new Map();const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const figure=document.createElement('figure');figure.className='lumen-gauge lumen-multi-gauge';figure.setAttribute('role','group');host.append(figure);
 const svg=(tag,attrs)=>{const n=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,String(v));return n;};
 const ratio=s=>s.value===null?0:Math.max(0,Math.min(1,(s.value-s.min)/(s.max-s.min)));
 const valueText=s=>s.value===null?p.messages.unavailable:`${s.value} ${s.unit}${s.value>s.max?` (${p.messages.above})`:s.value<s.min?` (${p.messages.below})`:''}`;
 function activate(id){
  active=id;
  for(const ring of figure.querySelectorAll('[data-ring-id]')){
   ring.classList.toggle('lg-ring-active',ring.dataset.ringId===id);
   ring.classList.toggle('lg-ring-muted',id!==null&&ring.dataset.ringId!==id);
   ring.setAttribute('aria-pressed',String(ring.dataset.ringId===id));
  }
  for(const label of figure.querySelectorAll('[data-value-ring-id]'))label.classList.toggle('lg-value-active',label.dataset.valueRingId===id);
  const tip=figure.querySelector('.lg-ring-tooltip'),s=p.series.find(s=>s.id===id);
  if(tip){tip.textContent=s?`${s.label}: ${valueText(s)}`:'';tip.hidden=!s;}
 }
 function render(){
  const focused=figure.contains(document.activeElement)?document.activeElement?.dataset?.ringId:null;
  figure.style.width=p.size+'px';figure.setAttribute('aria-label',p.label);const dial=svg('svg',{viewBox:'0 0 200 200',width:p.size,height:p.size,role:'group','aria-label':p.label});
  const placed=[],annotations=[];
  p.series.forEach((s,i)=>{const r=84-i*16,y=100+r/Math.sqrt(2),x=100-r/Math.sqrt(2),xx=100+r/Math.sqrt(2),d=`M${x} ${y} A${r} ${r} 0 1 1 ${xx} ${y}`;
   const ring=svg('g',{'data-ring-id':s.id,tabindex:0,role:'button','aria-label':`${s.label}: ${valueText(s)}`,'aria-pressed':'false',class:'lg-ring'});
   const common={d,fill:'none','stroke-width':11,'stroke-linecap':'round',pathLength:100};ring.append(svg('path',{...common,stroke:'var(--lg-track)'}));
   if(s.value!==null&&shown.get(s.id)>0)ring.append(svg('path',{...common,stroke:s.color,'stroke-dasharray':`${shown.get(s.id)*100} 100`,'data-series-id':s.id}));
   const hit=svg('path',{...common,stroke:'transparent','stroke-width':16,class:'lg-ring-hit'});ring.append(hit);
   // Keep each value beside its own endpoint, not in an unrelated top stack.
   // Collision checks include a small halo so equal/tiny values remain distinct.
   const text=s.value===null?'--':`${s.value}${s.unit==='%'?'':' '}${s.unit}`;
   const angle=(135+270*ratio(s))*Math.PI/180,ex=100+r*Math.cos(angle),ey=100+r*Math.sin(angle);
   const width=Math.min(100,Math.max(12,text.length*6)),left=ex<100;
   const lx=left?Math.min(190-width,ex+10):Math.max(width+10,ex-10);
   const box={left:left?lx:lx-width,right:left?lx+width:lx,y:Math.max(12,Math.min(190,ey+3))};
   const collides=y=>placed.some(b=>Math.abs(b.y-y)<14&&box.left<b.right+4&&box.right>b.left-4);
   const initial=box.y;
   for(let step=1;collides(box.y)&&step<=24;step++){
    const candidate=initial+(step%2?-1:1)*Math.ceil(step/2)*14;
    if(candidate>=12&&candidate<=190)box.y=candidate;
   }
   placed.push(box);
   const annotation=svg('g',{'data-value-ring-id':s.id,'aria-hidden':'true','pointer-events':'none'});
   annotation.append(svg('path',{d:`M${ex} ${ey} L${left?lx-3:lx+3} ${box.y-3}`,fill:'none',stroke:s.color,'stroke-width':1.3,'pointer-events':'none',class:'lg-value-connector'}));
   const label=svg('text',{x:lx,y:box.y,'text-anchor':left?'start':'end',class:'lg-ring-value','aria-hidden':'true'});label.textContent=text;annotation.append(label);annotations.push(annotation);dial.append(ring);
  });
  dial.append(...annotations);
  const caption=document.createElement('figcaption');caption.textContent=p.label;
  const tip=document.createElement('div');tip.className='lg-ring-tooltip';tip.setAttribute('role','status');tip.hidden=true;
  const list=document.createElement('ul');list.className='lg-series';list.hidden=!p.showLegend;
  for(const s of p.series){const row=document.createElement('li'),dot=document.createElement('span'),text=document.createElement('span'),value=document.createElement('strong');dot.className='lg-series-dot';dot.style.background=s.color;dot.setAttribute('aria-hidden','true');text.textContent=s.label;value.textContent=valueText(s);row.append(dot,text,value);if(s.detail){const detail=document.createElement('small');detail.textContent=s.detail;row.append(detail);}list.append(row);}
  figure.replaceChildren(dial,caption,tip,list);activate(p.series.some(s=>s.id===active)?active:null);
  if(focused)Array.from(dial.querySelectorAll('[data-ring-id]')).find(n=>n.dataset.ringId===focused)?.focus({preventScroll:true});
 }
 const ringFor=e=>e.target.closest?.('[data-ring-id]');
 figure.addEventListener('pointerover',e=>{const ring=ringFor(e);if(ring)activate(ring.dataset.ringId);});
 figure.addEventListener('pointerleave',()=>{if(!figure.contains(document.activeElement))activate(null);});
 figure.addEventListener('focusin',e=>{const ring=ringFor(e);if(ring)activate(ring.dataset.ringId);});
 figure.addEventListener('focusout',e=>{if(!figure.contains(e.relatedTarget))activate(null);});
 figure.addEventListener('click',e=>{const ring=ringFor(e);if(ring)activate(ring.dataset.ringId);});
 figure.addEventListener('keydown',e=>{const ring=ringFor(e);if(e.key==='Escape'){activate(null);return;}if(ring&&(e.key==='Enter'||e.key===' ')){e.preventDefault();activate(ring.dataset.ringId);}});
 function stop(){animations.forEach(a=>a.stop());animations=[];settle?.();settle=null;}
 async function update(partial={}){
  if(disposed)throw new Error('Gauge is destroyed');const next=normalize({...p,...partial});stop();p=next;const id=++epoch;
  const ids=new Set(p.series.map(s=>s.id));for(const key of shown.keys())if(!ids.has(key))shown.delete(key);for(const s of p.series)if(!shown.has(s.id))shown.set(s.id,0);
  render();const finish=()=>{for(const s of p.series)shown.set(s.id,ratio(s));render();};if(reduced.matches){finish();return;}
  try{motion??=import('https://cdn.jsdelivr.net/npm/motion@14.9.0/+esm');const{animate}=await motion;if(disposed||epoch!==id)return;
   await new Promise(resolve=>{settle=resolve;const waits=p.series.map(s=>{const a=animate(shown.get(s.id),ratio(s),{duration:.45,ease:'easeOut',onUpdate:v=>{if(!disposed&&epoch===id){shown.set(s.id,v);render();}}});animations.push(a);return Promise.resolve(a);});Promise.all(waits).then(resolve,resolve);});
   if(!disposed&&epoch===id)finish();
  }catch{if(!disposed&&epoch===id)finish();}
 }
 const onPreference=()=>{if(reduced.matches){++epoch;stop();for(const s of p.series)shown.set(s.id,ratio(s));render();}};reduced.addEventListener('change',onPreference);const ready=update();
 return{element:figure,ready,update,destroy(){if(disposed)return;disposed=true;++epoch;stop();reduced.removeEventListener('change',onPreference);figure.remove();}};
}
