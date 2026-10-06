<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { animate, stagger } from 'motion'
const props = defineProps({ theme: { type: String, default: 'pulsefit' } })
const T = {
  lustro: ['#0b0b18', 'rgba(148,140,255,.08)', '#fff', '#a5b4fc', 'rgba(148,140,255,.22)', '#6366f1', '#fff', '#34d399', '#f472b6', 'rgba(99,102,241,.2)', "'DM Sans',sans-serif", '14px', '#6366f1', '#fbbf24', '#22d3ee', '#f472b6', '#64648c'],
  felix: ['#fefcf9', '#fff', '#082422', '#636158', '#e3ded3', '#065958', '#fff', '#1b8a4b', '#c0392b', '#e3efee', "'Saans',sans-serif", '10px', '#065958', '#c9772b', '#7fb7b5', '#e0b778', '#a8a89c'],
  pulsefit: ['#f5f5f5', '#fff', '#212121', '#5f666d', '#e0e0e0', '#C9A66B', '#212121', '#198754', '#dc3545', '#f5e6d3', "'Rubik',sans-serif", '14px', '#7a5a1f', '#C9A66B', '#b8c4cc', '#e6d2b0', '#b0b0b0'],
  scopecraft: ['#f4f4f5', '#fff', '#111113', '#6b6f76', '#e6e6e8', '#111113', '#fff', '#17803d', '#c62828', '#ececee', 'ui-sans-serif,system-ui,sans-serif', '8px', '#111113', '#2f6fdc', '#9aa0aa', '#c4c7ce', '#d9dadd'],
  lumen: ['#fbfbfa', '#fff', '#17171a', '#74767d', '#e7e7e9', '#7c6cf0', '#fff', '#1b9a4b', '#d23b3b', '#ece9fd', "'Plus Jakarta Sans',sans-serif", '12px', '#7c6cf0', '#f5b800', '#0fb0ea', '#e08a1e', '#b5b7bd']
}
const v = computed(() => { const t = T[props.theme] || T.pulsefit; const k = ['bg', 'surf', 'ink', 'mut', 'bd', 'pri', 'prit', 'ok', 'bad', 'soft', 'font', 'r', 'c1', 'c2', 'c3', 'c4', 'c5']; return Object.fromEntries(k.map((n, i) => ['--q-' + n, t[i]])) })
const tabs = ['Water', 'Mood', 'Weight', 'Meal photo']
const tab = ref('Weight')
const unit = ref('Kg')
const kg = ref(61.6)
const shown = computed(() => unit.value === 'Kg' ? kg.value.toFixed(1) : (kg.value * 2.20462).toFixed(1))
const goal = computed(() => unit.value === 'Kg' ? '62.5 kg' : '137.8 lb')
const glasses = ref(2)
const mood = ref(80)
const meal = ref('Breakfast')
const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snack']
const ticks = Array.from({ length: 41 }, (_, i) => 60 + i * .1)
const logs = ref([['Water', '2 glasses (500 ml)', '11:30 AM'], ['Mood', 'Good% 80', '10:40 AM'], ['Weight', '61.6 Kg', '10:30 AM'], ['Meal photo', 'Breakfast logged', '10:20 AM']])
const summary = computed(() => tab.value === 'Water' ? `${glasses.value} glass${glasses.value === 1 ? '' : 'es'} (${glasses.value * 250} ml)` : tab.value === 'Mood' ? `Good% ${mood.value}` : tab.value === 'Weight' ? `${shown.value} ${unit.value === 'Kg' ? 'Kg' : 'lb'}` : `${meal.value} logged`)
const saved = ref(false)
const save = async () => {
  logs.value.unshift([tab.value, summary.value, new Date(2026, 9, 5, 12, 5).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })])
  saved.value = true; setTimeout(() => saved.value = false, 1800)
  await nextTick()
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && root.value) animate(root.value.querySelector('.qn-lg'), { opacity: [0, 1], y: [-8, 0] }, { duration: 0.3 })
}
const del = i => { logs.value.splice(i, 1) }
const root = ref(null)
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.value) return
  animate(root.value.querySelectorAll('.qn-card,.qn-lg'), { opacity: [0, 1], y: [8, 0] }, { delay: stagger(0.05), duration: 0.4 })
})
</script>

<template>
  <div class="qn" :style="v" ref="root">
    <div class="qn-hd"><div><h4>Log an entry</h4><small>Things your devices can't track - logged in two taps.</small></div><span class="qn-btn">Today &#9662;</span></div>
    <div class="qn-tabs" role="tablist"><button v-for="t in tabs" :key="t" type="button" role="tab" :aria-selected="tab === t" :class="{ on: tab === t }" @click="tab = t">{{ t }}</button></div>
    <div class="qn-card"><div class="qn-ch"><div class="qn-t"><i class="ic"></i><span><b>{{ tab }}</b><small>{{ tab === 'Weight' ? 'How are you feeling right now?' : tab === 'Water' ? 'Each glass is 250 ml.' : tab === 'Mood' ? 'Drag to set how you feel.' : 'Pick the meal you are logging.' }}</small></span></div>
        <span v-if="tab === 'Weight'" class="qn-seg"><button v-for="u in ['Kg', 'lb']" :key="u" type="button" :class="{ on: unit === u }" @click="unit = u">{{ u }}</button></span></div>
      <template v-if="tab === 'Weight'"><div class="qn-ruler"><div class="qn-ticks"><i v-for="(t, i) in ticks" :key="i" :class="{ big: i % 10 === 0, mid: i % 5 === 0 && i % 10, on: Math.abs(t - kg) < .06 }"></i></div><div class="qn-nums"><small v-for="n in [60, 61, 62, 63, 64]" :key="n">{{ n }}</small></div><input type="range" min="60" max="64" step="0.1" v-model.number="kg" aria-label="Weight in kilograms" /></div>
        <div class="qn-row"><div class="qn-val">{{ shown }} <small>{{ unit.toLowerCase() }} / Goal: {{ goal }}</small></div><button type="button" class="qn-save" @click="save">{{ saved ? 'Saved' : 'Save' }}</button></div></template>
      <template v-else-if="tab === 'Water'"><div class="qn-gl"><button v-for="n in 8" :key="n" type="button" :class="{ on: n <= glasses }" :aria-label="n + ' glasses'" :aria-pressed="n <= glasses" @click="glasses = n"></button></div><div class="qn-row"><div class="qn-val">{{ glasses * 250 }} <small>ml / Goal: 2,000 ml</small></div><button type="button" class="qn-save" @click="save">{{ saved ? 'Saved' : 'Save' }}</button></div></template>
      <template v-else-if="tab === 'Mood'"><input class="qn-mood" type="range" min="0" max="100" v-model.number="mood" aria-label="Mood score" /><div class="qn-row"><div class="qn-val">{{ mood }} <small>{{ mood > 70 ? 'Good' : mood > 40 ? 'Okay' : 'Low' }}</small></div><button type="button" class="qn-save" @click="save">{{ saved ? 'Saved' : 'Save' }}</button></div></template>
      <template v-else><div class="qn-meals"><button v-for="m in meals" :key="m" type="button" :class="{ on: meal === m }" @click="meal = m">{{ m }}</button></div><div class="qn-row"><div class="qn-val sm">Add a photo of your {{ meal.toLowerCase() }}</div><button type="button" class="qn-save" @click="save">{{ saved ? 'Saved' : 'Save' }}</button></div></template>
    </div>
    <div class="qn-card"><b class="qn-h">Today's logs</b>
      <div v-for="(l, i) in logs" :key="l[0] + l[2] + i" class="qn-lg"><i class="ic"></i><span><b>{{ l[0] }}</b><small>{{ l[1] }}</small></span><small>{{ l[2] }}</small><button type="button" :aria-label="'Delete ' + l[0] + ' log'" @click="del(i)">&#10005;</button></div>
      <small v-if="!logs.length">No logs yet today.</small></div>
  </div>
</template>

<style>
.qn{background:var(--q-bg);border:1px solid var(--q-bd);border-radius:calc(var(--q-r) + 6px);padding:14px;margin:12px 0;font:13px/1.4 var(--q-font);color:var(--q-ink);text-align:left;display:flex;flex-direction:column;gap:12px}
.qn *{box-sizing:border-box}.qn h4{margin:0!important;font:600 22px var(--q-font);padding:0;border:0}.qn small{font-size:11.5px;color:var(--q-mut)}.qn b{font-weight:600}
.qn-hd{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.qn-btn{border:1px solid var(--q-bd);background:var(--q-surf);border-radius:var(--q-r);padding:7px 14px;font-weight:600;font-size:12px}
.qn-tabs{display:inline-flex;background:var(--q-surf);border:1px solid var(--q-bd);border-radius:var(--q-r);padding:3px;align-self:flex-start;flex-wrap:wrap}.qn-tabs button{border:0;background:transparent;color:var(--q-ink);padding:6px 14px;border-radius:calc(var(--q-r) - 3px);font:600 12.5px var(--q-font);cursor:pointer}.qn-tabs button.on{background:var(--q-soft)}
.qn button:focus-visible,.qn input:focus-visible{outline:2px solid var(--q-pri);outline-offset:2px}
.qn-card{background:var(--q-surf);border:1px solid var(--q-bd);border-radius:calc(var(--q-r) + 2px);padding:14px;display:flex;flex-direction:column;gap:10px}
.qn-ch{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}.qn-t{display:flex;gap:10px;align-items:center}.qn-t span{display:flex;flex-direction:column}.qn .ic{width:34px;height:34px;border-radius:8px;background:var(--q-soft);flex:none}
.qn-seg{display:inline-flex;border:1px solid var(--q-bd);border-radius:calc(var(--q-r) - 2px);padding:2px}.qn-seg button{border:0;background:transparent;color:var(--q-mut);padding:4px 10px;border-radius:calc(var(--q-r) - 5px);font:600 12px var(--q-font);cursor:pointer}.qn-seg button.on{background:var(--q-soft);color:var(--q-ink)}
.qn-ruler{position:relative;height:74px;margin:0 auto;width:100%;max-width:560px}.qn-ticks{display:flex;justify-content:space-between;align-items:flex-end;height:44px;padding:0 4px}.qn-ticks i{width:1.5px;height:12px;background:var(--q-bd);border-radius:1px}.qn-ticks i.mid{height:20px;background:var(--q-mut)}.qn-ticks i.big{height:30px;background:var(--q-ink)}.qn-ticks i.on{background:var(--q-pri);height:38px;width:2.5px}
.qn-nums{display:flex;justify-content:space-between;padding:2px 0 0}
.qn-ruler input,.qn-mood{position:absolute;inset:0;width:100%;opacity:0;cursor:ew-resize;margin:0}.qn-mood{position:static;opacity:1;accent-color:var(--q-pri);cursor:pointer}
.qn-row{display:flex;justify-content:space-between;align-items:flex-end;gap:10px}.qn-val{font:600 38px/1 var(--q-font)}.qn-val small{font-size:12px;font-weight:400}.qn-val.sm{font-size:15px;font-weight:500}
.qn-save{border:0;background:var(--q-pri);color:var(--q-prit);border-radius:var(--q-r);padding:9px 20px;font:700 13px var(--q-font);cursor:pointer}
.qn-gl{display:flex;gap:8px;flex-wrap:wrap}.qn-gl button{width:34px;height:44px;border-radius:4px 4px 10px 10px;border:2px solid var(--q-bd);background:var(--q-soft);cursor:pointer;transition:background .2s}.qn-gl button.on{background:var(--q-pri);border-color:var(--q-pri)}
.qn-meals{display:flex;gap:8px;flex-wrap:wrap}.qn-meals button{border:1px solid var(--q-bd);background:var(--q-bg);color:var(--q-ink);border-radius:999px;padding:7px 16px;font:600 12.5px var(--q-font);cursor:pointer}.qn-meals button.on{background:var(--q-ink);color:var(--q-bg);border-color:var(--q-ink)}
.qn-h{font-size:15px}.qn-lg{display:grid;grid-template-columns:36px 1fr auto 28px;gap:12px;align-items:center;border:1px solid var(--q-bd);border-radius:var(--q-r);padding:10px 12px}.qn-lg span{display:flex;flex-direction:column}.qn-lg button{border:0;background:transparent;color:var(--q-mut);cursor:pointer;font-size:13px;border-radius:6px;height:26px}.qn-lg button:hover{color:var(--q-bad)}
@media(max-width:700px){.qn-val{font-size:30px}}
</style>
