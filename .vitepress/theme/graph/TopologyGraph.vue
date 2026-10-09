<script setup lang="ts">
import { computed } from 'vue'
import GraphCanvas, { type GraphNode, type GraphEdge } from './GraphCanvas.vue'
const props = withDefaults(defineProps<{nodes:GraphNode[];edges:GraphEdge[];modelValue?:string|null;dark?:boolean;loading?:boolean}>(),{modelValue:null,dark:false,loading:false})
const emit=defineEmits<{ 'update:modelValue':[id:string]; select:[node:GraphNode] }>()
const current=computed(()=>props.nodes.find(n=>n.id===props.modelValue))
function select(id:string){const n=props.nodes.find(n=>n.id===id);if(n){emit('update:modelValue',id);emit('select',n)}}
</script>
<template>
 <div class="topology-component" :class="{dark}">
  <div v-if="loading" role="status" class="topology-panel">Loading topology…</div>
  <GraphCanvas v-else :nodes="nodes" :edges="edges" :selected="modelValue" :dark="dark" label="Service topology" @select="select"><template #node="p"><slot name="node" v-bind="p"><small>{{p.node.status||'healthy'}}</small><strong>{{p.node.label}}</strong><span v-if="p.node.latency!=null">Latency {{p.node.latency}} ms</span></slot></template></GraphCanvas>
  <aside class="topology-panel" aria-live="polite"><slot name="details" :node="current"><template v-if="current"><h3>{{current.label}} · {{current.status||'healthy'}}</h3><dl><dt>Latency</dt><dd>{{current.latency!=null?current.latency+' ms':'Not provided'}}</dd></dl><p>{{current.subtitle}}</p></template><p v-else>Select a service for details.</p></slot></aside>
 </div>
</template>
<style scoped>
.topology-component{color:var(--graph-ink,#202735);font:13px/1.5 system-ui}.topology-component.dark{color:var(--graph-ink,#f0f3f9)}.topology-panel{padding:18px;border:1px solid var(--graph-line,#d6dce5);border-radius:12px;margin-top:12px;background:var(--graph-surface,#fff)!important;color:var(--graph-ink,#202735)!important}.dark .topology-panel{background:var(--graph-surface,#242932)!important;color:var(--graph-ink,#f0f3f9)!important;border-color:var(--graph-line,#414958)}.topology-panel :is(h3,p,dt,dd){color:inherit}.topology-panel h3{margin:0 0 10px;font-size:16px;border:0}.topology-panel dl{display:flex;gap:12px}.topology-panel dd{margin:0;font-weight:600}
</style>
