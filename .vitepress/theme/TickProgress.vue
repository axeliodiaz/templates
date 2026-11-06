<script setup>
import {onMounted,onBeforeUnmount,watch,ref} from 'vue'
import {createTickProgress} from '../../public/lumen-template/tick-progress.js'
import '../../public/lumen-template/tick-progress.css'
const props=defineProps({value:{type:Number,default:null},label:{type:String,required:true},color:String,valueText:String})
const host=ref(null);let controller
onMounted(()=>controller=createTickProgress(host.value,props))
watch(()=>[props.value,props.label,props.color,props.valueText],()=>controller?.update(props))
onBeforeUnmount(()=>controller?.destroy())
</script>
<template><div ref="host"/></template>
