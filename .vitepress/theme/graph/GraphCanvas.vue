<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { animate } from 'motion'
export type GraphNode = { id: string; label: string; x: number; y: number; kind?: string; status?: string; subtitle?: string; latency?: number; [key: string]: unknown }
export type GraphEdge = { id: string; source: string; target: string; label?: string }
const props = withDefaults(defineProps<{ nodes: GraphNode[]; edges: GraphEdge[]; selected?: string | null; editable?: boolean; dark?: boolean; busy?: boolean; label?: string; active?: string | null }>(), { selected: null, editable: false, dark: false, busy: false, label: 'Node graph', active: null })
const emit = defineEmits<{ select: [id: string]; move: [id: string, point: {x:number;y:number}]; remove: [id:string] }>()
const root = ref<HTMLElement>(), viewport = ref<HTMLElement>(), zoom = ref(1)
const byId = computed(() => new Map(props.nodes.map(n => [n.id,n])))
const width = computed(() => Math.max(800,...props.nodes.map(n => n.x + 210)))
const height = computed(() => Math.max(390,...props.nodes.map(n => n.y + 120)))

const preview = ref<{id:string;x:number;y:number}|null>(null)
const links = computed(() => props.edges.flatMap(e => {
 const rawA=byId.value.get(e.source), rawB=byId.value.get(e.target)
 const a=rawA&&preview.value?.id===rawA.id?{...rawA,...preview.value}:rawA, b=rawB&&preview.value?.id===rawB.id?{...rawB,...preview.value}:rawB
 if(!a||!b) return []
 const sx=a.x+170, sy=a.y+35, tx=b.x, ty=b.y+35, d=Math.max(50,Math.abs(tx-sx)*.45)
 return [{...e,path:`M${sx} ${sy} C${sx+d} ${sy} ${tx-d} ${ty} ${tx} ${ty}`,x:(sx+tx)/2,y:(sy+ty)/2,selected:props.selected===e.source||props.selected===e.target}]
}))
let drag: {id:string;pointer:number;startX:number;startY:number;x:number;y:number;dx:number;dy:number;target:HTMLElement}|null=null
function clamp(x:number,y:number){return {x:Math.max(0,Math.min(2000,Math.round(x/10)*10)),y:Math.max(0,Math.min(1200,Math.round(y/10)*10))}}
function down(event:PointerEvent,n:GraphNode){
 emit('select',n.id)
 if(!props.editable||props.busy||event.button!==0)return
 const target=event.currentTarget as HTMLElement
 target.setPointerCapture(event.pointerId)
 drag={id:n.id,pointer:event.pointerId,startX:event.clientX,startY:event.clientY,x:n.x,y:n.y,dx:0,dy:0,target}
}
function move(event:PointerEvent){
 if(!drag||event.pointerId!==drag.pointer)return
 drag.dx=(event.clientX-drag.startX)/zoom.value;drag.dy=(event.clientY-drag.startY)/zoom.value
 preview.value={id:drag.id,...clamp(drag.x+drag.dx,drag.y+drag.dy)}
}
function finish(commit:boolean){
 if(!drag)return
 if(commit&&preview.value&&(Math.abs(drag.dx)+Math.abs(drag.dy)>3))emit('move',drag.id,{x:preview.value.x,y:preview.value.y})
 if(drag.target.hasPointerCapture(drag.pointer))drag.target.releasePointerCapture(drag.pointer)
 drag=null;preview.value=null
}
function key(event:KeyboardEvent,n:GraphNode){
 if(event.key==='Enter'||event.key===' '){event.preventDefault();emit('select',n.id);return}
 if(!props.editable||props.busy)return
 const delta:Record<string,[number,number]>={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]}
 if(delta[event.key]){event.preventDefault();const [x,y]=delta[event.key];emit('move',n.id,clamp(n.x+x,n.y+y))}
 if(event.key==='Delete'){event.preventDefault();emit('remove',n.id)}
}
function position(n:GraphNode){const p=preview.value?.id===n.id?preview.value:n;return {left:p.x+'px',top:p.y+'px'}}
function fit(){if(viewport.value)zoom.value=Math.max(.35,Math.min(1,(viewport.value.clientWidth-24)/width.value))}
let media:MediaQueryList, animation:ReturnType<typeof animate>|undefined, disposed=false, generation=0
function stop(){animation?.stop();animation=undefined;root.value?.querySelectorAll<HTMLElement>('.graph-node').forEach(n=>{n.style.opacity='1';n.style.transform='none'})}
async function entrance(){const token=++generation;stop();await nextTick();if(disposed||token!==generation||media?.matches||!root.value)return;animation=animate(root.value.querySelectorAll('.graph-node'),{opacity:[0,1],y:[6,0]},{duration:.22})}
watch(()=>props.nodes.map(n=>n.id).join('|'),entrance)
watch(()=>props.busy,b=>{if(b)finish(false)})
onMounted(()=>{media=matchMedia('(prefers-reduced-motion: reduce)');media.addEventListener('change',stop);entrance()})
onBeforeUnmount(()=>{disposed=true;generation++;finish(false);stop();media?.removeEventListener('change',stop)})
</script>
<template>
 <section ref="root" class="graph" :class="{ 'graph-dark':dark }" :aria-label="label">
  <div class="graph-tools"><span>{{nodes.length}} nodes · {{links.length}} connections</span><button type="button" @click="zoom=Math.max(.35,zoom-.1)" aria-label="Zoom out">−</button><output aria-label="Zoom level">{{Math.round(zoom*100)}}%</output><button type="button" @click="zoom=Math.min(1.5,zoom+.1)" aria-label="Zoom in">+</button><button type="button" @click="fit">Fit graph</button></div>
  <div ref="viewport" class="graph-scroll" tabindex="0" :aria-label="`${label} canvas. Scroll to explore.`">
   <div :style="{width:width*zoom+'px',height:height*zoom+'px'}"><div class="graph-plane" :style="{width:width+'px',height:height+'px',transform:`scale(${zoom})`}">
    <svg class="graph-links" :viewBox="`0 0 ${width} ${height}`" :width="width" :height="height" aria-hidden="true"><g v-for="e in links" :key="e.id"><path :d="e.path" :class="{selected:e.selected}"/><text v-if="e.label" :x="e.x" :y="e.y-9" text-anchor="middle">{{e.label}}</text></g></svg>
    <button v-for="n in nodes" :key="n.id" type="button" class="graph-node" :class="{chosen:selected===n.id,running:active===n.id}" :style="position(n)" :aria-pressed="selected===n.id" :aria-label="`${n.label}, ${n.status||n.kind||'node'}${n.latency!=null?', latency '+n.latency+' milliseconds':''}`" @click="emit('select',n.id)" @pointerdown="down($event,n)" @pointermove="move" @pointerup="finish(true)" @pointercancel="finish(false)" @keydown="key($event,n)">
     <slot name="node" :node="n"><small><i :class="n.status"/>{{n.kind||n.status||'SERVICE'}}</small><strong>{{n.label}}</strong><span>{{n.subtitle|| (n.latency!=null?'Latency '+n.latency+' ms':'Select for details')}}</span></slot>
    </button>
    <p v-if="!nodes.length" class="graph-empty"><slot name="empty">No nodes. Add a node to start.</slot></p>
   </div></div>
  </div>
  <p class="graph-help">{{editable?'Drag nodes or use arrow keys to move. Delete removes the selected node.':'Select a node with Enter or Space.'}} Connections are listed below for screen readers.</p>
  <details class="graph-access"><summary>Connection list</summary><ul><li v-for="e in links" :key="e.id">{{byId.get(e.source)?.label}} → {{byId.get(e.target)?.label}} {{e.label}}</li><li v-if="!links.length">No connections</li></ul></details>
 </section>
</template>
<style scoped>
.graph{--g-bg:var(--graph-bg,#f5f7fa);--g-surface:var(--graph-surface,#fff);--g-ink:var(--graph-ink,#202735);--g-muted:var(--graph-muted,#606b7b);--g-line:var(--graph-line,#d6dce5);--g-accent:var(--graph-accent,#476edd);color:var(--g-ink);background:var(--g-bg);border:1px solid var(--g-line);border-radius:14px;font:13px/1.4 system-ui,sans-serif;overflow:hidden}
.graph-dark{--g-bg:var(--graph-bg,#15181e);--g-surface:var(--graph-surface,#242932);--g-ink:var(--graph-ink,#f0f3f9);--g-muted:var(--graph-muted,#abb5c4);--g-line:var(--graph-line,#414958);--g-accent:var(--graph-accent,#92acff)}
.graph-tools{display:flex;align-items:center;flex-wrap:wrap;gap:8px;padding:12px;border-bottom:1px solid var(--g-line)}.graph-tools>span{margin-right:auto;color:var(--g-muted)}.graph-tools button{border:1px solid var(--g-line);border-radius:7px;padding:5px 10px;background:var(--g-surface);color:var(--g-ink);cursor:pointer}.graph-scroll{overflow:auto;padding:12px;max-height:560px;background-image:radial-gradient(var(--g-line) 1px,transparent 1px);background-size:16px 16px}.graph-plane{position:relative;transform-origin:top left}.graph-links{position:absolute;inset:0;pointer-events:none}.graph-links path{fill:none;stroke:var(--g-line);stroke-width:2}.graph-links path.selected{stroke:var(--g-accent);stroke-width:3}.graph-links text{fill:var(--g-muted);font:11px system-ui}.graph-node{position:absolute;display:flex;flex-direction:column;gap:3px;text-align:left;width:170px;min-height:70px;padding:10px 12px;border:1px solid var(--g-line);background:var(--g-surface);border-radius:10px;color:var(--g-ink);font:13px/1.4 system-ui;cursor:pointer;touch-action:none;user-select:none}.graph-node small,.graph-node span{font-size:10px;color:var(--g-muted)}.graph-node strong{font-size:12px}.graph-node i{display:inline-block;width:6px;height:6px;background:#22986b;border-radius:50%;margin-right:5px}.graph-node i.degraded,.graph-node i.delayed{background:#d98926}.graph-node i.failed{background:#d75265}.graph-node.chosen{border:2px solid var(--g-accent);padding:9px 11px}.graph-node.running{box-shadow:0 0 0 4px color-mix(in srgb,var(--g-accent) 28%,transparent)}.graph :is(button,summary,div):focus-visible{outline:3px solid var(--g-accent);outline-offset:3px}.graph-help{color:var(--g-muted);font-size:11px;margin:12px}.graph-access{margin:12px;font-size:12px}.graph-empty{padding:50px;color:var(--g-muted)}
</style>
