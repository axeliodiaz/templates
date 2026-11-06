<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { createMultiGauge } from '../../public/lumen-template/multi-gauge.js'
import '../../public/lumen-template/lumen-gauge.css'
const props=defineProps({series:{type:Array,required:true},label:{type:String,default:'Usage limits'},size:{type:Number,default:240}})
const host=ref(null);let gauge
onMounted(()=>{gauge=createMultiGauge(host.value,{series:props.series,label:props.label,size:props.size})})
watch(()=>[props.series,props.label,props.size],()=>{if(gauge)gauge.update({series:props.series,label:props.label,size:props.size})},{deep:true})
onBeforeUnmount(()=>gauge?.destroy())
</script>
<template><div ref="host" class="multi-gauge-host"></div></template>
