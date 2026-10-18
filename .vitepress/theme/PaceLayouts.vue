<script setup lang="ts">
import {ref,computed,onMounted,onBeforeUnmount} from 'vue'
import {animate,stagger} from 'motion'
const props=defineProps<{view:'admin'|'member'}>()
const root=ref<HTMLElement|null>(null)
const controls:{stop:()=>void}[]=[]
const reduce=()=>typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches
// admin state
const nav=ref('Schedule'),filter=ref('All'),notice=ref('')
const kpis=[{k:'Bookings today',v:128,s:'+12 vs last week'},{k:'Bike occupancy',v:86,s:'% of 150 seats',pct:true},{k:'Active members',v:742,s:'18 new this week'},{k:'Credits used',v:311,s:'across 9 classes'}]
const shownKpi=ref(kpis.map(()=>0))
const classes=[{t:'06:30',n:'Sunrise Ride',c:'Camila R.',b:18,m:20,st:'Open'},{t:'08:00',n:'Power Climb',c:'Mateo S.',b:20,m:20,st:'Full'},{t:'12:15',n:'Express 30',c:'Sofia V.',b:9,m:20,st:'Open'},{t:'18:30',n:'Rhythm Ride',c:'Diego L.',b:20,m:20,st:'Waitlist'},{t:'20:00',n:'Recovery Spin',c:'Camila R.',b:4,m:20,st:'Low'}]
const rows=computed(()=>classes.filter(c=>filter.value==='All'||c.st===filter.value))
const tone=(s:string)=>s==='Open'?'success':s==='Full'?'info':s==='Waitlist'?'warning':'danger'
const week=[62,74,81,69,92,58,40]
// member state
const day=ref('Tue'),booked=ref<string[]>([]),tabM=ref('Home'),credits=ref(7)
const dayList=['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const mClasses=[{id:'a',t:'07:00',n:'Sunrise Ride',c:'Camila',min:45,left:3},{id:'b',t:'12:15',n:'Express 30',c:'Sofia',min:30,left:11},{id:'c',t:'19:00',n:'Rhythm Ride',c:'Diego',min:45,left:0}]
function book(c:{id:string;left:number}){
  if(booked.value.includes(c.id)){booked.value=booked.value.filter(i=>i!==c.id);credits.value++;notice.value='Booking canceled locally. Credit returned.';return}
  if(credits.value<1){notice.value='No credits left. Buy a pack to book.';return}
  booked.value=[...booked.value,c.id];credits.value--;notice.value=c.left===0?'Joined the waitlist (local demo).':'Booked locally. A confirmation email would be sent here.'
}
let t:ReturnType<typeof setTimeout>|undefined
function say(){clearTimeout(t);t=setTimeout(()=>{notice.value=''},3200)}
onMounted(()=>{
  const el=root.value;if(!el)return
  if(reduce()){shownKpi.value=kpis.map(k=>k.v);return}
  controls.push(animate(el.querySelectorAll('[data-in]'),{opacity:[0,1],y:[10,0]},{delay:stagger(0.05),duration:.4}))
  kpis.forEach((k,i)=>controls.push(animate(0,k.v,{duration:.9,onUpdate:v=>{shownKpi.value[i]=Math.round(v)}})))
})
onBeforeUnmount(()=>{controls.forEach(c=>c.stop());clearTimeout(t)})
</script>
<template><div ref="root" class="studio-kit b2-bs6 b2-pacekit studio-pace pace-lay">
<template v-if="view==='admin'"><div class="pace-admin">
<nav class="pace-side" aria-label="Admin navigation"><b class="pace-brand">pace.</b><button v-for="n in ['Schedule','Members','Credits','Reports','Settings']" :key="n" class="btn btn-outline theme-primary" :aria-current="nav===n?'page':undefined" :class="{active:nav===n}" @click="nav=n">{{n}}</button></nav>
<main><header class="pace-top"><label class="pace-search">Search<input class="form-control" type="search" placeholder="Member or class"/></label><span class="sk-avatar" aria-label="Signed in as Morgan">MO</span></header>
<h3 data-in>{{nav}}</h3>
<div class="pace-kpis"><article data-in class="sk-card" v-for="(k,i) in kpis" :key="k.k"><small>{{k.k}}</small><b class="pace-num">{{shownKpi[i]}}{{k.pct?'%':''}}</b><small>{{k.s}}</small></article></div>
<div class="pace-two"><article data-in class="sk-card"><div class="studio-row"><strong>Today's classes</strong><label>Status<select class="form-control" v-model="filter"><option>All</option><option>Open</option><option>Full</option><option>Waitlist</option><option>Low</option></select></label></div>
<div class="sk-table-wrap"><table class="table"><thead><tr><th>Time</th><th>Class</th><th>Coach</th><th>Seats</th><th>Status</th></tr></thead><tbody><tr v-for="c in rows" :key="c.t"><td>{{c.t}}</td><td>{{c.n}}</td><td>{{c.c}}</td><td>{{c.b}}/{{c.m}}</td><td><span :class="['sk-badge',tone(c.st)]">{{c.st}}</span></td></tr><tr v-if="!rows.length"><td colspan="5">No classes with this status.</td></tr></tbody></table></div></article>
<article data-in class="sk-card"><strong>Bookings this week</strong><svg class="sk-chart" viewBox="0 0 280 130" role="img" aria-label="Bookings by day, Friday highest at 92"><g v-for="(v,i) in week" :key="i"><rect :x="12+i*38" :y="110-v" width="24" :height="v" rx="4" fill="var(--sk-accent)" :opacity="i===4?1:.55"/><text :x="24+i*38" y="125" text-anchor="middle" style="font-size:10px" fill="var(--sk-muted)">{{dayList[i].slice(0,2)}}</text></g></svg><small>Friday peaks at 92 bookings. Sample data.</small></article></div>
<div class="sk-alert warning" role="status">Power Climb 08:00 is full with 4 people on the waitlist. <button class="btn btn-outline theme-primary" @click="notice='Waitlist notice sent locally.';say()">Notify waitlist</button></div>
</main></div></template>
<template v-else><div class="pace-phone-wrap"><div class="pace-phone" role="group" aria-label="Member app preview">
<header data-in><small>Good morning</small><h3>Hello, Morgan</h3></header>
<article data-in class="sk-card pace-credit"><div><small>Credits</small><b class="pace-num">{{credits}}</b><small>Pack expires Nov 30</small></div><svg viewBox="0 0 44 44" width="56" height="56" role="img" :aria-label="`${credits} of 10 credits left`"><circle cx="22" cy="22" r="18" fill="none" stroke="var(--sk-border)" stroke-width="5"/><circle cx="22" cy="22" r="18" fill="none" stroke="var(--sk-accent)" stroke-width="5" stroke-linecap="round" :stroke-dasharray="`${credits*11.3} 113`" transform="rotate(-90 22 22)"/></svg></article>
<div data-in class="pace-days" role="tablist" aria-label="Day"><button v-for="d in dayList" :key="d" role="tab" :aria-selected="day===d" class="btn btn-outline theme-primary" :class="{active:day===d}" @click="day=d">{{d}}</button></div>
<div data-in v-for="c in mClasses" :key="c.id" class="sk-card pace-class"><div><b>{{c.t}} · {{c.n}}</b><small>{{c.c}} · {{c.min}} min · {{c.left?c.left+' bikes left':'Full'}}</small></div>
<button class="btn theme-primary" :class="booked.includes(c.id)?'btn-outline':'btn-solid'" :aria-pressed="booked.includes(c.id)" @click="book(c);say()">{{booked.includes(c.id)?'Cancel':c.left?'Book':'Waitlist'}}</button></div>
<nav class="pace-tabbar" aria-label="Member navigation"><button v-for="n in ['Home','Classes','Credits','Profile']" :key="n" class="btn btn-outline theme-primary" :aria-current="tabM===n?'page':undefined" :class="{active:tabM===n}" @click="tabM=n">{{n}}</button></nav></div></div></template>
<Transition name="tpl-feedback"><div v-if="notice" class="sk-toast" role="status">{{notice}}<button class="btn btn-outline theme-primary" aria-label="Dismiss" @click="notice=''">×</button></div></Transition>
<small class="pace-note">Fictitious data. Every action is local; no booking, payment or message leaves this page.</small></div></template>
