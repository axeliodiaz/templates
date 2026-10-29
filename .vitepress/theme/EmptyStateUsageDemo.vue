<script setup lang="ts">
import { ref, computed } from 'vue'
const items=ref<{id:number;name:string}[]>([])
const query=ref('')
const feedback=ref('')
let next=1
const visible=computed(()=>items.value.filter(item=>item.name.toLowerCase().includes(query.value.trim().toLowerCase())))
function add(){items.value.push({id:next++,name:'Example project'});feedback.value='Fictitious project added locally.'}
function reset(){items.value=[];query.value='';feedback.value='Local example reset.'}
</script>
<template>
<section class="empty-demo" aria-label="Local empty state example"><p>Local example only. No project is created on a server.</p><label>Filter example projects <input v-model="query" type="search" @input="feedback=''" /></label><div class="empty-panel" :key="items.length===0?'empty':visible.length===0?'filtered':'list'"><template v-if="!items.length"><h3>No example projects yet</h3><p>Add one fictitious project to see populated content.</p><button type="button" @click="add">Add fictitious project</button></template><template v-else-if="!visible.length"><h3>No matching example projects</h3><p>The filter hides {{ items.length }} local item(s). Clearing it does not delete anything.</p><button type="button" @click="query='';feedback='Filter cleared.'">Clear filter</button></template><template v-else><h3>Local example projects</h3><ul><li v-for="item in visible" :key="item.id">{{ item.name }} · {{ item.id }}</li></ul></template></div><button type="button" @click="reset">Reset example</button><p role="status">{{ feedback || `${visible.length} visible of ${items.length} local example projects.` }}</p></section>
</template>
<style scoped>
.empty-demo{border:1px solid var(--vp-c-divider);border-radius:14px;padding:20px;margin:20px 0}.empty-demo label{display:grid;gap:6px;font-weight:600}.empty-demo input{font:inherit;color:inherit;background:var(--vp-c-bg-soft);border:1px solid var(--vp-c-divider);padding:10px;border-radius:8px;min-width:0;width:100%;box-sizing:border-box}.empty-panel{padding:18px;border:1px dashed var(--vp-c-divider);border-radius:10px;margin:16px 0;background:var(--vp-c-bg-soft);animation:empty-in .18s ease-out;overflow-wrap:anywhere}.empty-demo h3{margin-top:0}.empty-demo button{border:1px solid var(--vp-c-divider);border-radius:8px;padding:8px 12px;background:var(--vp-c-bg)}.empty-demo input:focus-visible,.empty-demo button:focus-visible{outline:2px solid var(--vp-c-brand-1);outline-offset:3px}.empty-demo [role=status]{min-height:1.5em}@keyframes empty-in{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.empty-panel{animation:none}}
</style>
