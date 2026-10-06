<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { animate } from 'motion'
const props = defineProps({
  value: { type: Number, default: 50 }, min: { type: Number, default: 0 }, max: { type: Number, default: 100 },
  start: { type: Number, default: -135 }, end: { type: Number, default: 135 },
  mode: { type: String, default: 'arc' }, ticks: { type: Number, default: 0 }, labels: { type: Array, default: () => [] },
  zones: { type: Array, default: () => [] }, unit: { type: String, default: '' }, label: { type: String, default: '' },
  width: { type: Number, default: 12 }, cap: { type: String, default: 'round' }, size: { type: Number, default: 180 }, decimals: { type: Number, default: 0 }
})
const shown = ref(props.value)
let anim
function go(to) {
  if (anim) anim.stop()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { shown.value = to; return }
  anim = animate(shown.value, to, { type: 'spring', stiffness: 90, damping: 14, onUpdate: v => { shown.value = v } })
}
onMounted(() => { shown.value = props.min; go(props.value) })
watch(() => props.value, go)
const R = 80, C = 100
const clamp = v => Math.max(props.min, Math.min(props.max, v))
const ang = v => props.start + ((clamp(v) - props.min) / (props.max - props.min || 1)) * (props.end - props.start)
const pt = (a, r) => { const t = (a - 90) * Math.PI / 180; return [C + r * Math.cos(t), C + r * Math.sin(t)] }
const arc = (a0, a1, r = R) => { const [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r); const large = Math.abs(a1 - a0) > 180 ? 1 : 0; return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${large} ${a1 > a0 ? 1 : 0} ${x1.toFixed(2)} ${y1.toFixed(2)}` }
const track = computed(() => arc(props.start, props.end))
const fill = computed(() => arc(props.start, Math.max(props.start + 0.01, ang(shown.value))))
const tickList = computed(() => Array.from({ length: props.ticks ? props.ticks + 1 : 0 }, (_, i) => { const a = props.start + (i / props.ticks) * (props.end - props.start); const [x0, y0] = pt(a, R + 8), [x1, y1] = pt(a, R - (i % 2 ? 4 : 8)); return { x0, y0, x1, y1 } }))
const labelList = computed(() => props.labels.map((l, i) => { const a = props.start + (i / Math.max(1, props.labels.length - 1)) * (props.end - props.start); const [x, y] = pt(a, R - 22); return { t: l, x, y } }))
const zoneList = computed(() => props.zones.map(z => ({ d: arc(ang(z.from), ang(z.to), R + 14), c: z.color })))
const needle = computed(() => { const a = ang(shown.value); const [x, y] = pt(a, R - 12); return { x, y } })
const zoneColor = computed(() => { const z = props.zones.find(z => shown.value >= z.from && shown.value <= z.to); return z ? z.color : 'var(--g-pri)' })
const off = computed(() => (props.mode === 'both' ? 36 : 0))
const text = computed(() => shown.value.toFixed(props.decimals))
</script>

<template>
  <figure class="gg" role="img" :aria-label="`${label || 'Gauge'}: ${text} ${unit}, range ${min} to ${max}`" :style="{ width: size + 'px' }">
    <svg viewBox="0 0 200 200" :width="size" :height="size">
      <path :d="track" fill="none" stroke="var(--g-track)" :stroke-width="width" :stroke-linecap="cap" />
      <path v-for="z in zoneList" :key="z.d" :d="z.d" fill="none" :stroke="z.c" stroke-width="4" />
      <path v-if="mode !== 'needle'" :d="fill" fill="none" :stroke="zoneColor" :stroke-width="width" :stroke-linecap="cap" />
      <line v-for="(t, i) in tickList" :key="i" :x1="t.x0" :y1="t.y0" :x2="t.x1" :y2="t.y1" stroke="var(--g-mut)" stroke-width="1.5" />
      <text v-for="l in labelList" :key="l.t" :x="l.x" :y="l.y" text-anchor="middle" dominant-baseline="middle" class="gg-l">{{ l.t }}</text>
      <g v-if="mode !== 'arc'"><line :x1="C" :y1="C" :x2="needle.x" :y2="needle.y" stroke="var(--g-ink)" stroke-width="3.5" stroke-linecap="round" /><circle :cx="C" :cy="C" r="7" fill="var(--g-ink)" /></g>
      <text v-if="mode !== 'needle'" :x="C" :y="C + 6 + off" text-anchor="middle" class="gg-v">{{ text }}</text>
      <text v-if="mode !== 'needle' && unit" :x="C" :y="C + 26 + off" text-anchor="middle" class="gg-u">{{ unit }}</text>
      <text v-if="mode === 'needle'" :x="C" :y="C + 46" text-anchor="middle" class="gg-v2">{{ text }}<tspan class="gg-u" dx="3">{{ unit }}</tspan></text>
    </svg>
    <figcaption v-if="label">{{ label }}</figcaption>
  </figure>
</template>

<style>
.gg{margin:0;text-align:center;font-family:var(--g-font);color:var(--g-ink)}
.gg svg{display:block;margin:0 auto}.gg figcaption{font-size:12px;color:var(--g-mut);margin-top:-6px}
.gg-v{font:700 34px var(--g-font);fill:var(--g-ink);font-variant-numeric:tabular-nums}.gg-v2{font:700 20px var(--g-font);fill:var(--g-ink)}.gg-u{font:500 12px var(--g-font);fill:var(--g-mut)}.gg-l{font:600 10px var(--g-font);fill:var(--g-mut)}
</style>
