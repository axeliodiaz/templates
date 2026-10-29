<script setup lang="ts">
import { computed, ref, watch } from 'vue'
interface Visit{id:string;start:number;end:number;status:string;caregiver:string|null;client:string}
const props=defineProps<{visits:Visit[]}>()
const emit=defineEmits<{open:[id:string]}>()
const picked=ref(6), slots=Array.from({length:23},(_,i)=>7+i*.5)
const times=(n:number)=>`${String(Math.floor(n)).padStart(2,'0')}:${n%1?'30':'00'}`
const columns=computed(()=>slots.map(time=>({time,items:props.visits.filter(v=>v.start<=time&&v.end>time).slice().sort((a,b)=>rank(a.status)-rank(b.status)||a.id.localeCompare(b.id))})))
const max=computed(()=>Math.max(10,...columns.value.map(c=>c.items.length)))
const rank=(s:string)=>s==='completed'?0:s==='needs-cover'?3:s==='late'?2:1
const tone=(s:string)=>s==='completed'?'complete':s==='needs-cover'?'uncovered':s==='late'?'risk':'covered'
const current=computed(()=>columns.value[picked.value])
watch(()=>props.visits,()=>{picked.value=Math.min(picked.value,22)})
</script>
<template><section class="hc-card hc-coverage hc-enter"><header><h3><i class="fa-regular fa-calendar" aria-hidden="true"></i> Coverage by half hour</h3><div class="hc-legend"><span><i class="covered"></i>Covered</span><span><i class="complete"></i>Completed</span><span><i class="uncovered"></i>Needs cover</span><span><i class="risk"></i>At risk</span></div></header><p><strong>{{ visits.filter(v=>v.caregiver).length }}</strong> of {{ visits.length }} visits assigned</p><small>Each square is one active visit in that half-hour. Visits may span multiple columns.</small><div class="hc-coverage-scroll"><div class="hc-slot-grid" :style="{'--hc-rows':max}" role="group" aria-label="Select half-hour coverage"><button v-for="(c,i) in columns" :key="c.time" type="button" :aria-pressed="picked===i" :aria-label="times(c.time)+': '+c.items.length+' active visits'" @focus="picked=i" @click="picked=i"><span class="hc-slot-stack" :style="{gridTemplateRows:'repeat('+max+',var(--hc-cell-height,10px))'}"><i v-for="j in max" :key="j" :class="max-j<c.items.length?tone(c.items[max-j].status):'vacant'"></i></span><small>{{ i%2===0?times(c.time):'·' }}</small></button></div></div><div class="hc-coverage-read" role="status"><strong>{{ times(current.time) }}</strong><span>{{ current.items.length }} active · {{ current.items.filter(v=>v.caregiver).length }} assigned · {{ current.items.filter(v=>!v.caregiver).length }} need cover</span></div><div class="hc-slot-visits"><button v-for="v in current.items" :key="v.id" type="button" @click="emit('open',v.id)"><i :class="tone(v.status)"></i>{{ v.client }}<small>{{ v.caregiver||'Unassigned' }}</small></button><p v-if="!current.items.length">No active visits at this time.</p></div><footer>Fixed sample day: October 5, 2026. <span>Intervals include start and exclude end.</span></footer></section></template>
