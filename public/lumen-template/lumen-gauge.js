// Framework-free Lumen Gauge. Motion is loaded only when animation is allowed.
const defaults = { value:50, min:0, max:100, start:-135, end:135, mode:'arc', ticks:0, labels:[], zones:[], unit:'', label:'', width:12, cap:'round', size:180, decimals:0 };
const NS='http://www.w3.org/2000/svg';
let motion;
function svg(tag,attrs={},text){const node=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))node.setAttribute(k,String(v));if(text!==undefined)node.textContent=String(text);return node;}
function options(input){const p={...defaults,...input};for(const key of ['value','min','max','start','end','width','size','decimals','ticks'])if(!Number.isFinite(p[key]))throw new TypeError(`${key} must be finite`);if(p.max<p.min)throw new RangeError('max must be >= min');if(!['arc','needle','both'].includes(p.mode))throw new TypeError('mode must be arc, needle or both');if(!['round','butt','square'].includes(p.cap))throw new TypeError('invalid cap');if(p.size<=0||p.width<=0||p.ticks<0||p.ticks>200||!Number.isInteger(p.ticks)||!Number.isInteger(p.decimals)||p.decimals<0||p.decimals>20)throw new RangeError('invalid size, width, ticks or decimals');if(!Array.isArray(p.labels)||!Array.isArray(p.zones))throw new TypeError('labels and zones must be arrays');for(const z of p.zones)if(!Number.isFinite(z.from)||!Number.isFinite(z.to)||typeof z.color!=='string')throw new TypeError('invalid zone');return p;}
/** Mount in an empty host. update(partialProps) returns a settled animation promise. */
export function createLumenGauge(host,input={}){
 if(!(host instanceof Element))throw new TypeError('host must be an Element');
 let p=options(input),shown=p.min,animation,settle,epoch=0,destroyed=false;
 const figure=document.createElement('figure');figure.className='lumen-gauge';figure.setAttribute('role','img');host.append(figure);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=v=>Math.max(p.min,Math.min(p.max,v));
 function render(){
  const angle=v=>p.start+((clamp(v)-p.min)/(p.max-p.min||1))*(p.end-p.start);
  const point=(a,r)=>{const t=(a-90)*Math.PI/180;return [100+r*Math.cos(t),100+r*Math.sin(t)];};
  const arc=(a,b,r=80)=>{const [x,y]=point(a,r),[xx,yy]=point(b,r);return `M${x.toFixed(2)} ${y.toFixed(2)}A${r} ${r} 0 ${Math.abs(b-a)>180?1:0} ${b>a?1:0} ${xx.toFixed(2)} ${yy.toFixed(2)}`;};
  const text=shown.toFixed(p.decimals),zone=p.zones.find(z=>shown>=z.from&&shown<=z.to);
  figure.style.width=p.size+'px';figure.setAttribute('aria-label',`${p.label||'Gauge'}: ${text} ${p.unit}, range ${p.min} to ${p.max}`);
  const root=svg('svg',{viewBox:'0 0 200 200',width:p.size,height:p.size,'aria-hidden':'true'});
  const path=(d,stroke,width=p.width,cap=p.cap)=>root.append(svg('path',{d,fill:'none',stroke,'stroke-width':width,'stroke-linecap':cap}));
  path(arc(p.start,p.end),'var(--lg-track)');
  for(const z of p.zones)path(arc(angle(z.from),angle(z.to),94),z.color,4,'butt');
  if(p.mode!=='needle')path(arc(p.start,(p.end>=p.start?Math.max(p.start+.01,angle(shown)):Math.min(p.start-.01,angle(shown)))),zone?.color||'var(--lg-pri)');
  for(let i=0;p.ticks&&i<=p.ticks;i++){const a=p.start+i/p.ticks*(p.end-p.start),[x,y]=point(a,88),[xx,yy]=point(a,80-(i%2?4:8));root.append(svg('line',{x1:x,y1:y,x2:xx,y2:yy,stroke:'var(--lg-mut)','stroke-width':1.5}));}
  p.labels.forEach((l,i)=>{const [x,y]=point(p.start+i/Math.max(1,p.labels.length-1)*(p.end-p.start),58);root.append(svg('text',{x,y,'text-anchor':'middle','dominant-baseline':'middle',class:'lg-label'},l));});
  if(p.mode!=='arc'){const [x,y]=point(angle(shown),68);root.append(svg('line',{x1:100,y1:100,x2:x,y2:y,stroke:'var(--lg-ink)','stroke-width':3.5,'stroke-linecap':'round','data-needle':''}),svg('circle',{cx:100,cy:100,r:7,fill:'var(--lg-ink)'}));}
  const label=(y,className,text)=>root.append(svg('text',{x:100,y,'text-anchor':'middle',class:className},text));
  if(p.mode==='needle'){const node=svg('text',{x:100,y:172,'text-anchor':'middle',class:'lg-value-small'},text);node.append(svg('tspan',{class:'lg-unit',dx:3},p.unit));root.append(node);}else{const off=p.mode==='both'?36:0;label(106+off,'lg-value',text);if(p.unit)label(126+off,'lg-unit',p.unit);}
  figure.replaceChildren(root);if(p.label){const caption=document.createElement('figcaption');caption.textContent=p.label;figure.append(caption);}
 }
 async function update(partial={}){
  if(destroyed)throw new Error('Gauge is destroyed');const next=options({...p,...partial});p=next;const id=++epoch;animation?.stop();settle?.();shown=clamp(shown);render();const to=clamp(p.value);
  if(reduced.matches){shown=to;render();return;}
  try{motion??=import('https://cdn.jsdelivr.net/npm/motion@14.9.0/+esm');const {animate}=await motion;if(destroyed||id!==epoch)return;await new Promise(resolve=>{settle=resolve;animation=animate(shown,to,{type:'spring',stiffness:90,damping:14,onUpdate:v=>{if(id===epoch&&!destroyed){shown=clamp(v);render();}},onComplete:resolve});Promise.resolve(animation).then(resolve,resolve);});if(id===epoch&&!destroyed){shown=to;render();}}
  catch{if(id===epoch&&!destroyed){shown=to;render();}}
 }
 function onPreference(){if(reduced.matches){++epoch;animation?.stop();settle?.();shown=clamp(p.value);render();}}
 reduced.addEventListener('change',onPreference);render();const ready=update();
 return {element:figure,ready,update,destroy(){if(destroyed)return;destroyed=true;++epoch;animation?.stop();settle?.();reduced.removeEventListener('change',onPreference);figure.remove();}};
}
