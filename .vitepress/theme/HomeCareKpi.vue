<script setup lang="ts">
import { computed } from 'vue'
const props=defineProps<{label:string;value:number;detail:string;tone?:string;trend?:number[]}>()
const heights=computed(()=>{const a=props.trend||[3,5,4,7,6,8];const max=Math.max(1,...a);return a.map(v=>Math.max(0,v)/max*26)})
</script>
<template><article class="hc-kpi hc-enter"><small>{{ label }}</small><div><strong>{{ value }}</strong><svg viewBox="0 0 60 30" aria-hidden="true"><line v-for="(h,i) in heights" :key="i" :x1="4+i*9" :x2="4+i*9" :y1="28-h" y2="28"/></svg></div><p><i :class="tone||'neutral'" aria-hidden="true"></i>{{ detail }}</p></article></template>
