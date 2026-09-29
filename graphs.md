<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
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
</script>

# Graphs

Flow and dependency graphs for Lustro. The animated scene below is **sample data**, not a live build. Lines represent dependencies, not arbitrary decoration. [Motion patterns](/motion) explain when movement helps.

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
