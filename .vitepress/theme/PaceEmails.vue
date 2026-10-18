<script setup lang="ts">
import {ref,computed} from 'vue'
const mails=[
{id:'confirm',name:'Booking confirmed',subject:'You are booked: Sunrise Ride, Tue 06:30',h:'You are booked',p:'Sunrise Ride with Camila R. Tuesday 06:30, 45 min. Studio Pace Centro, bike 12.',cta:'View booking',note:'Cancel free up to 12 hours before class. 1 credit used.'},
{id:'remind',name:'Class reminder',subject:'Your ride starts in 2 hours',h:'See you at 06:30',p:'Arrive 10 minutes early to set up your bike. Bring water and a towel.',cta:'Get directions',note:'Cannot make it? Cancel in the app to return your credit.'},
{id:'receipt',name:'Payment receipt',subject:'Receipt: 10-class pack',h:'Payment received',p:'10-class pack, $89.00 (sample). Credits are valid for 60 days. Paid with card ending 4242 (fictitious).',cta:'Download receipt',note:'Questions about billing? Reply to this email.'},
{id:'expire',name:'Credits expiring',subject:'3 credits expire on Nov 30',h:'Use your credits',p:'You have 3 credits left. Book a class before they expire, or renew your pack.',cta:'Book a class',note:'Expired credits cannot be restored.'}]
const sel=ref('confirm'),dark=ref(false)
const m=computed(()=>mails.find(x=>x.id===sel.value)!)
const c=computed(()=>dark.value?{bg:'#111a15',card:'#18241d',ink:'#e6f1ea',mut:'#a2b7a9',line:'#2b3d32',btn:'#83d4a1',btnt:'#0b2417'}:{bg:'#f5f8f4',card:'#ffffff',ink:'#173528',mut:'#52665a',line:'#cfdcd3',btn:'#23724e',btnt:'#ffffff'})
</script>
<template><div class="studio-kit b2-bs6 b2-pacekit studio-pace"><div class="pace-emails">
<nav class="pace-mail-list" aria-label="Email templates"><button v-for="x in mails" :key="x.id" class="btn btn-outline theme-primary" :class="{active:sel===x.id}" :aria-pressed="sel===x.id" @click="sel=x.id">{{x.name}}</button>
<button class="btn btn-outline theme-primary" role="switch" :aria-checked="dark" @click="dark=!dark">Dark mail client: {{dark?'on':'off'}}</button></nav>
<div><p><b>Subject:</b> {{m.subject}}</p>
<div class="pace-mail-frame" :style="{background:c.bg}"><table role="presentation" width="100%" style="max-width:520px" cellpadding="0" cellspacing="0"><tbody>
<tr><td :style="{padding:'8px 4px 16px',font:'700 22px Arial,Helvetica,sans-serif',color:c.btn}">pace.</td></tr>
<tr><td :style="{background:c.card,border:'1px solid '+c.line,borderRadius:'12px',padding:'28px'}"><h1 :style="{margin:'0 0 12px',font:'700 24px Arial,Helvetica,sans-serif',color:c.ink}">{{m.h}}</h1><p :style="{margin:'0 0 22px',font:'15px/1.5 Arial,Helvetica,sans-serif',color:c.ink}">{{m.p}}</p><a href="#" :style="{display:'inline-block',background:c.btn,color:c.btnt,font:'700 15px Arial,Helvetica,sans-serif',padding:'12px 22px',borderRadius:'8px',textDecoration:'none'}" @click.prevent>{{m.cta}}</a><p :style="{margin:'22px 0 0',font:'13px/1.5 Arial,Helvetica,sans-serif',color:c.mut}">{{m.note}}</p></td></tr>
<tr><td :style="{padding:'16px 4px',font:'12px/1.5 Arial,Helvetica,sans-serif',color:c.mut}">Pace Studio, sample address. You get this email because you booked a class. Manage notifications in your profile.</td></tr></tbody></table></div>
<small>Table layout, 520px, inline styles, system font stack, no images required. Button contrast: {{dark?'9.3':'5.9'}}:1. Fictitious content, never sent.</small></div></div></div></template>
