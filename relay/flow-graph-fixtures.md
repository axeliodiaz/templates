---
head:
  - - meta
    - name: robots
      content: noindex
---
<script setup>
import { ref, onMounted } from 'vue'
import FlowGraph from '../.vitepress/theme/flow-graph/FlowGraph.vue'
import { sample } from '../.vitepress/theme/flow-graph/flow-graph.sample'
const make = (id) => {
  const group = structuredClone(sample.groups.find(g => g.id === 'coder'))
  group.id = id
  if (id === 'empty') group.nodes = group.nodes.filter(n => n.kind === 'agent')
  if (id === 'denied') group.nodes.forEach(n => { if(n.kind !== 'agent') {n.status='no-access';n.calls=0} })
  if (id === 'many') group.nodes = [group.nodes.find(n => n.kind === 'agent'), ...Array.from({length:9},(_,i)=>({id:'tool-'+i,kind:'source',label:i===0?'L'.repeat(80):'Tool '+i,icon:'missing-icon',status:'idle',order:i}))]
  return {groups:[group],defaultGroupId:id,legend:true}
}
const cases = ['empty','denied','many','rejected'].map(id => ({id, config:make(id)}))
const rejectReplay = async () => { throw new Error('Synthetic fixture rejection') }
</script>

# Flow graph test fixtures

Synthetic cases for automated checks. No real agent runs or service calls occur.

<div v-for="item in cases" :key="item.id" :data-fixture="item.id" class="relay-frame"><div class="relay relay-bs6" data-bs-theme="dark"><div class="rl-canvas" style="padding:16px"><FlowGraph :config="item.config" :on-replay="item.id === 'rejected' ? rejectReplay : undefined" /></div></div></div>
