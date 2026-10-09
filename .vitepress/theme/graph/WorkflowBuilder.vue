<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, toRaw } from 'vue'
import GraphCanvas, {type GraphNode,type GraphEdge} from './GraphCanvas.vue'
export type Workflow = { nodes:GraphNode[]; edges:GraphEdge[] }
const props=withDefaults(defineProps<{modelValue:Workflow;dark?:boolean;readonly?:boolean}>(),{dark:false,readonly:false})
const emit=defineEmits<{ 'update:modelValue':[value:Workflow]; change:[value:Workflow]; select:[node:GraphNode|null]; run:[value:Workflow]; configure:[node:GraphNode] }>()
const selected=ref<string|null>(null),connectFrom=ref(''),connectTo=ref(''),kind=ref('action'),label=ref(''),status=ref('Ready. Local simulation only.'),running=ref(false),active=ref<string|null>(null),completed=ref<string[]>([])
const past=ref<Workflow[]>([]),future=ref<Workflow[]>([]),node=computed(()=>props.modelValue.nodes.find(n=>n.id===selected.value)||null)
const clone=(value:Workflow):Workflow=>({nodes:value.nodes.map(n=>({...n})),edges:value.edges.map(e=>({...e}))})
let token=0,timer:ReturnType<typeof setTimeout>|undefined,resolveWait:(()=>void)|undefined,lastEmitted:Workflow|undefined
function stop(){token++;clearTimeout(timer);resolveWait?.();resolveWait=undefined;running.value=false;active.value=null}
function select(id:string){selected.value=id;label.value=node.value?.label||'';emit('select',node.value)}
function apply(value:Workflow){lastEmitted=toRaw(value);emit('update:modelValue',value);emit('change',clone(value))}
function commit(value:Workflow){if(props.readonly)return;stop();past.value.push(clone(props.modelValue));if(past.value.length>50)past.value.shift();future.value=[];apply(value);status.value='Draft changed. Not connected to an execution engine.'}
function add(){if(props.readonly)return;const value=clone(props.modelValue);const id='node-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6);value.nodes.push({id,label:kind.value==='trigger'?'New trigger':kind.value==='agent'?'New agent':'New action',kind:kind.value,x:40+(value.nodes.length%3)*230,y:40+Math.floor(value.nodes.length/3)*120});commit(value);selected.value=id;label.value=value.nodes.at(-1)!.label}
function remove(id:string){commit({nodes:props.modelValue.nodes.filter(n=>n.id!==id).map(n=>({...n})),edges:props.modelValue.edges.filter(e=>e.source!==id&&e.target!==id).map(e=>({...e}))});if(selected.value===id)selected.value=null}
function move(id:string,point:{x:number;y:number}){const v=clone(props.modelValue);const n=v.nodes.find(n=>n.id===id);if(n){Object.assign(n,point);commit(v)}}
function connect(){if(!connectFrom.value||!connectTo.value||connectFrom.value===connectTo.value)return;const v=clone(props.modelValue);if(v.edges.some(e=>e.source===connectFrom.value&&e.target===connectTo.value))return;v.edges.push({id:'edge-'+Date.now(),source:connectFrom.value,target:connectTo.value});commit(v)}
function rename(){if(!node.value||!label.value.trim())return;const v=clone(props.modelValue);v.nodes.find(n=>n.id===selected.value)!.label=label.value.trim();commit(v)}
function undo(){const previous=past.value.pop();if(previous){stop();future.value.push(clone(props.modelValue));apply(previous)}}
function redo(){const next=future.value.pop();if(next){stop();past.value.push(clone(props.modelValue));apply(next)}}
async function run(){
 stop();const mine=token, value=clone(props.modelValue);emit('run',value);completed.value=[];running.value=true
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,seen=new Set<string>()
 let id=value.nodes.find(n=>n.kind==='trigger')?.id||value.nodes[0]?.id
 while(id&&mine===token){
  if(seen.has(id)){status.value='Simulation paused: cycle detected.';break}
  const n=value.nodes.find(n=>n.id===id);if(!n)break;seen.add(id);active.value=id;status.value='Simulating '+n.label
  if(!reduced)await new Promise<void>(resolve=>{resolveWait=resolve;timer=setTimeout(()=>{resolveWait=undefined;resolve()},450)})
  if(mine!==token)return;completed.value.push(id)
  const options=value.edges.filter(e=>e.source===id)
  if(options.length>1){status.value='Simulation paused: choose a branch in your execution engine.';break}
  id=options[0]?.target
 }
 if(mine!==token)return;running.value=false;active.value=null;if(!status.value.includes('paused:'))status.value=`Simulation complete: ${completed.value.length} nodes. No external actions.`
}
watch(()=>props.modelValue,value=>{if(toRaw(value)!==lastEmitted){stop();past.value=[];future.value=[]}if(selected.value&&!value.nodes.some(n=>n.id===selected.value))selected.value=null},{deep:false})
onBeforeUnmount(stop)
</script>
<template>
 <div class="workflow-component" :class="{dark}">
  <div class="workflow-toolbar"><label>Node type<select v-model="kind"><option>trigger</option><option>agent</option><option>action</option><option>transform</option></select></label><button type="button" :disabled="readonly||running" @click="add">Add node</button><button type="button" :disabled="readonly||!past.length||running" @click="undo">Undo</button><button type="button" :disabled="readonly||!future.length||running" @click="redo">Redo</button><button type="button" :disabled="!modelValue.nodes.length||running" @click="run">Simulate path</button><button v-if="running" type="button" @click="stop();status='Simulation stopped.'">Stop simulation</button><slot name="toolbar"/></div>
  <GraphCanvas :nodes="modelValue.nodes" :edges="modelValue.edges" :selected="selected" :editable="!readonly" :busy="running" :active="active" :dark="dark" label="Workflow builder" @select="select" @move="move" @remove="remove"/>
  <p role="status">{{status}}</p>
  <div class="workflow-panels"><form class="workflow-panel" @submit.prevent="connect"><h3>Connect nodes</h3><label>From<select v-model="connectFrom"><option value="">Select source</option><option v-for="n in modelValue.nodes" :key="n.id" :value="n.id">{{n.label}}</option></select></label><label>To<select v-model="connectTo"><option value="">Select target</option><option v-for="n in modelValue.nodes" :key="n.id" :value="n.id">{{n.label}}</option></select></label><button :disabled="readonly||running||!connectFrom||!connectTo||connectFrom===connectTo">Connect</button><ul><li v-for="e in modelValue.edges" :key="e.id">{{modelValue.nodes.find(n=>n.id===e.source)?.label}} → {{modelValue.nodes.find(n=>n.id===e.target)?.label}} <button type="button" :disabled="readonly||running" :aria-label="'Remove connection '+e.id" @click="commit({nodes:modelValue.nodes.map(n=>({...n})),edges:modelValue.edges.filter(x=>x.id!==e.id).map(x=>({...x}))})">Remove</button></li></ul></form>
  <section class="workflow-panel"><h3>Node configuration</h3><template v-if="node"><form @submit.prevent="rename"><label>Node label<input v-model="label" maxlength="80"/></label><button :disabled="readonly||running||!label.trim()">Rename node</button><button type="button" :disabled="readonly||running" @click="remove(node.id)">Delete node</button></form><slot name="configuration" :node="node" :readonly="readonly"><p>{{node.kind}} · {{node.id}}</p><button type="button" @click="emit('configure',node)">Request configuration</button></slot></template><p v-else>Select a node.</p></section></div>
 </div>
</template>
<style scoped>
.workflow-component{font:13px/1.5 system-ui;color:var(--graph-ink,#202735)}.workflow-component.dark{color:var(--graph-ink,#f0f3f9)}.workflow-component> .workflow-toolbar :is(button,input,select),.workflow-panel :is(button,input,select){font:inherit;border:1px solid var(--graph-line,#d6dce5);border-radius:7px;padding:7px 10px;background:var(--graph-surface,#fff);color:inherit}.dark>.workflow-toolbar :is(button,input,select),.dark .workflow-panel :is(button,input,select){background:var(--graph-surface,#242932);border-color:var(--graph-line,#414958)}.workflow-component button{cursor:pointer}.workflow-component button:disabled{opacity:.45;cursor:default}.workflow-component> .workflow-toolbar :is(button,input,select),.workflow-panel :is(button,input,select):focus-visible{outline:3px solid var(--graph-accent,#708fe9);outline-offset:2px}.workflow-toolbar{display:flex;gap:8px;align-items:end;flex-wrap:wrap;margin:14px 0}.workflow-component label{display:grid;gap:5px;margin-bottom:8px}.workflow-panels{display:grid;grid-template-columns:1fr 1fr;gap:14px}.workflow-panel{padding:18px;border:1px solid var(--graph-line,#d6dce5);border-radius:12px;background:var(--graph-surface,#fff)}.dark .workflow-panel{background:var(--graph-surface,#242932);border-color:var(--graph-line,#414958)}.workflow-panel h3{margin:0 0 12px;border:0;font-size:16px}.workflow-panel form{display:grid;gap:8px}.workflow-panel ul{font-size:11px;padding-left:18px}.workflow-panel li{margin:8px 0}.workflow-panel input,.workflow-panel select{min-width:0;width:100%}@media(max-width:700px){.workflow-panels{grid-template-columns:1fr}}
</style>
