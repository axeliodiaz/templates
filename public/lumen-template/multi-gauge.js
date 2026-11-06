// Multiple independent measurements share one dial, never an aggregate value.
const NS='http://www.w3.org/2000/svg';let motion;
const palette=['#3b82f6','#22a06b','#d97706','#9b6be8','#dc4a62'];
function normalize(input){
 const p={size:240,label:'Usage limits',series:[],...input};
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
 let p=normalize(input),disposed=false,epoch=0,animations=[],settle,shown=new Map();const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const figure=document.createElement('figure');figure.className='lumen-gauge lumen-multi-gauge';figure.setAttribute('role','group');host.append(figure);
 const svg=(tag,attrs)=>{const n=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,String(v));return n;};
 const ratio=s=>s.value===null?0:Math.max(0,Math.min(1,(s.value-s.min)/(s.max-s.min)));
 function render(){
  figure.style.width=p.size+'px';figure.setAttribute('aria-label',p.label);const dial=svg('svg',{viewBox:'0 0 200 200',width:p.size,height:p.size,'aria-hidden':'true'});
  p.series.forEach((s,i)=>{const r=84-i*16,y=100+r/Math.sqrt(2),x=100-r/Math.sqrt(2),xx=100+r/Math.sqrt(2),d=`M${x} ${y} A${r} ${r} 0 1 1 ${xx} ${y}`;
   const common={d,fill:'none','stroke-width':11,'stroke-linecap':'round',pathLength:100};dial.append(svg('path',{...common,stroke:'var(--lg-track)'}));
   if(s.value!==null&&shown.get(s.id)>0)dial.append(svg('path',{...common,stroke:s.color,'stroke-dasharray':`${shown.get(s.id)*100} 100`,'data-series-id':s.id}));
  });
  const caption=document.createElement('figcaption');caption.textContent=p.label;const list=document.createElement('ul');list.className='lg-series';
  for(const s of p.series){const row=document.createElement('li'),dot=document.createElement('span'),text=document.createElement('span'),value=document.createElement('strong');dot.className='lg-series-dot';dot.style.background=s.color;dot.setAttribute('aria-hidden','true');text.textContent=s.label;value.textContent=s.value===null?'Unavailable':`${s.value} ${s.unit}${s.value>s.max?' (above range)':s.value<s.min?' (below range)':''}`;row.append(dot,text,value);const range=document.createElement('small');range.textContent=`Range ${s.min}-${s.max} ${s.unit}${s.detail?' · '+s.detail:''}`;row.append(range);list.append(row);}
  figure.replaceChildren(dial,caption,list);
 }
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
