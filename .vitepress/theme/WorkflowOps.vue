<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { animate, stagger } from 'motion'
const props = defineProps({ theme: { type: String, default: 'pulsefit' } })
const T = {
  lustro: ['#0b0b18', 'rgba(148,140,255,.08)', '#fff', '#a5b4fc', 'rgba(148,140,255,.22)', '#6366f1', '#fff', '#34d399', '#f472b6', 'rgba(99,102,241,.2)', "'DM Sans',sans-serif", '14px', '#6366f1', '#fbbf24', '#22d3ee', '#f472b6', '#64648c'],
  felix: ['#fefcf9', '#fff', '#082422', '#636158', '#e3ded3', '#065958', '#fff', '#1b8a4b', '#c0392b', '#e3efee', "'Saans',sans-serif", '10px', '#065958', '#c9772b', '#7fb7b5', '#e0b778', '#a8a89c'],
  pulsefit: ['#f5f5f5', '#fff', '#212121', '#5f666d', '#e0e0e0', '#C9A66B', '#212121', '#198754', '#dc3545', '#f5e6d3', "'Rubik',sans-serif", '14px', '#7a5a1f', '#C9A66B', '#b8c4cc', '#e6d2b0', '#b0b0b0'],
  scopecraft: ['#f4f4f5', '#fff', '#111113', '#6b6f76', '#e6e6e8', '#111113', '#fff', '#17803d', '#c62828', '#ececee', 'ui-sans-serif,system-ui,sans-serif', '8px', '#111113', '#2f6fdc', '#9aa0aa', '#c4c7ce', '#d9dadd'],
  lumen: ['#fbfbfa', '#fff', '#17171a', '#74767d', '#e7e7e9', '#7c6cf0', '#fff', '#1b9a4b', '#d23b3b', '#ece9fd', "'Plus Jakarta Sans',sans-serif", '12px', '#7c6cf0', '#f5b800', '#0fb0ea', '#e08a1e', '#b5b7bd']
}
const v = computed(() => { const t = T[props.theme] || T.pulsefit; const k = ['bg', 'surf', 'ink', 'mut', 'bd', 'pri', 'prit', 'ok', 'bad', 'soft', 'font', 'r', 'c1', 'c2', 'c3', 'c4', 'c5']; return Object.fromEntries(k.map((n, i) => ['--w-' + n, t[i]])) })
const menu = ref(false)
const ws = ref(0)
const spaces = [['AF', 'Acme Finance', '18 members - Growth', 'c1'], ['AO', 'Acme Operations', '9 members - Starter', 'c4']]
const kpi = computed(() => ws.value === 0 ? [['Runs today', '1,942', '+4.1%', 62, 'c1'], ['Active workflows', '284', '+8.6%', 48, 'c3'], ['Success rate', '98.2%', '+0.6%', 91, 'c2']] : [['Runs today', '812', '+1.9%', 40, 'c1'], ['Active workflows', '97', '+2.2%', 33, 'c3'], ['Success rate', '96.4%', '-0.3%', 86, 'c2']])
const range = ref('Month')
const rs = { Week: [4, 6, 5, 8, 7, 9, 12], Month: [6, 9, 6, 4, 8, 11, 9, 12, 14, 16, 13, 18], Year: [3, 5, 7, 6, 9, 11, 10, 14, 15, 18, 20, 22] }
const labels = { Week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], Month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], Year: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'] }
const a = computed(() => rs[range.value]), b = computed(() => a.value.map((y, i) => 10 + Math.sin(i * 1.3) * 4 + (i % 3)))
const X = i => 10 + i * (360 / (a.value.length - 1)), Y = y => 130 - y * 5.4
const lp = arr => arr.map((y, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(y).toFixed(1)).join(' ')
const queue = ref([['High', 'Invoice Approvals', 'Policy exception on 4 invoices', '1 hr', 'c1'], ['Medium', 'Customer Refunds', 'Connector expired', '2 hrs', 'c4'], ['Low', 'Lead Qualification', '3 low-confidence leads', '4 hrs', 'c5']])
const sel = ref(-1)
const root = ref(null), pop = ref(null)
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
watch(menu, async m => { if (!m) return; await nextTick(); if (!reduce() && pop.value) animate(pop.value, { opacity: [0, 1], y: [-6, 0] }, { duration: 0.2 }) })
const onKey = e => { if (e.key === 'Escape') menu.value = false }
onMounted(() => {
  if (reduce() || !root.value) return
  animate(root.value.querySelectorAll('.wf-c,.wf-q'), { opacity: [0, 1], y: [8, 0] }, { delay: stagger(0.06), duration: 0.45 })
  animate(root.value.querySelectorAll('.wf-tk i'), { opacity: [0, 1] }, { delay: stagger(0.004, { startDelay: 0.3 }), duration: 0.25 })
})
</script>

<template>
  <div class="wf" :style="v" ref="root" @keydown="onKey">
    <div class="wf-top"><span class="wf-search">Search....</span><span class="wf-help">Help</span>
      <div class="wf-me"><button type="button" class="wf-av" :aria-expanded="menu" aria-haspopup="menu" aria-label="Account menu" @click="menu = !menu">CL</button>
        <div v-if="menu" ref="pop" class="wf-pop" role="menu"><div class="wf-id"><i class="wf-av sm">CL</i><span><b>Chara Lee</b><small>chara@acme.com</small></span><em>Admin</em></div>
          <small class="wf-sh">Workspaces</small><button v-for="(s, i) in spaces" :key="s[0]" type="button" role="menuitemradio" :aria-checked="ws === i" class="wf-ws" :class="{ on: ws === i }" @click="ws = i; menu = false"><i :style="{ color: `var(--w-${s[3]})`, background: `color-mix(in srgb,var(--w-${s[3]}) 14%,var(--w-surf))` }">{{ s[0] }}</i><span><b>{{ s[1] }}</b><small>{{ s[2] }}</small></span><u v-if="ws === i">&#10003;</u></button>
          <button type="button" role="menuitem" class="wf-mi">+ Create workspace</button><hr><button type="button" role="menuitem" class="wf-mi">Profile</button><button type="button" role="menuitem" class="wf-mi">Preferences <small>&#8984;,</small></button><button type="button" role="menuitem" class="wf-mi">Theme <small>&#8250;</small></button><hr><button type="button" role="menuitem" class="wf-mi" @click="menu = false">Log out</button></div></div></div>
    <div class="wf-k3"><div v-for="k in kpi" :key="k[0]" class="wf-c wf-k"><b class="wf-kt" :style="{ borderColor: `var(--w-${k[4]})` }">{{ k[0] }}</b><div class="wf-kv">{{ k[1] }} <b :class="k[2][0] === '+' ? 'ok' : 'bad'">{{ k[2][0] === '+' ? '&#8599;' : '&#8600;' }} {{ k[2] }}</b></div><small>This week</small><div class="wf-tk" role="img" :aria-label="k[3] + ' percent of target'"><i v-for="n in 60" :key="n" :style="n <= k[3] * .6 ? { background: `var(--w-${k[4]})` } : null"></i></div></div></div>
    <div class="wf-g"><div class="wf-c"><div class="wf-ch"><b>Runs and failures</b><span class="wf-seg"><button v-for="r in ['Week', 'Month', 'Year']" :key="r" type="button" :class="{ on: range === r }" @click="range = r">{{ r }}</button></span></div>
        <svg viewBox="0 0 380 160" role="img" aria-label="Runs trending up with failures staying lower"><defs><pattern id="wfh" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="var(--w-c2)" stroke-opacity=".25" stroke-width="2" /></pattern></defs>
          <path :d="lp(a) + ` L${X(a.length - 1)} 132 L10 132 Z`" fill="url(#wfh)" /><path :d="lp(a)" fill="none" stroke="var(--w-c2)" stroke-width="2" stroke-linejoin="round" /><path :d="lp(b)" fill="none" stroke="var(--w-c4)" stroke-width="2" stroke-linejoin="round" />
          <text v-for="(l, i) in labels[range]" :key="l" v-show="a.length < 8 || i % 2 === 0 || i === a.length - 1" :x="X(i)" y="152" text-anchor="middle">{{ l }}</text></svg></div>
      <div class="wf-c"><b>Needs attention</b><br><small>{{ queue.length }} urgent items</small>
        <button v-for="(q, i) in queue" :key="q[1]" type="button" class="wf-q" :class="{ on: sel === i }" :style="{ '--qc': `var(--w-${q[4]})` }" @click="sel = sel === i ? -1 : i"><em>{{ q[0] }}</em><span><b>{{ q[1] }}</b><small>{{ q[2] }}</small></span><u>{{ q[3] }} &#8599;</u></button>
        <div class="wf-ft"><small>Oldest item: <b>2h 14m</b></small><a>Open review queue &#8594;</a></div></div></div>
  </div>
</template>

<style>
.wf{background:var(--w-bg);border:1px solid var(--w-bd);border-radius:calc(var(--w-r) + 6px);padding:14px;margin:12px 0;font:13px/1.4 var(--w-font);color:var(--w-ink);text-align:left;display:flex;flex-direction:column;gap:12px;min-height:480px}
.wf *{box-sizing:border-box}.wf small{font-size:11.5px;color:var(--w-mut)}.wf b{font-weight:600}.wf .ok{color:var(--w-ok)}.wf .bad{color:var(--w-bad)}
.wf-top{display:flex;justify-content:flex-end;align-items:center;gap:8px;position:relative}.wf-search,.wf-help{border:1px solid var(--w-bd);background:var(--w-surf);border-radius:999px;padding:8px 16px;color:var(--w-mut)}.wf-search{flex:0 1 280px}
.wf-me{position:relative}.wf-av{width:36px;height:36px;border-radius:50%;border:1px solid var(--w-bd);background:var(--w-soft);color:var(--w-ink);font:700 12px var(--w-font);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;font-style:normal}.wf-av.sm{cursor:default}
.wf button:focus-visible{outline:2px solid var(--w-pri);outline-offset:2px}
.wf-pop{position:absolute;right:0;top:44px;z-index:5;width:290px;background:var(--w-surf);border:1px solid var(--w-bd);border-radius:calc(var(--w-r) + 2px);box-shadow:0 12px 32px rgba(0,0,0,.14);padding:8px}
.wf-id{display:flex;align-items:center;gap:10px;padding:6px;border-bottom:1px solid var(--w-bd);margin-bottom:6px}.wf-id span{display:flex;flex-direction:column;flex:1}.wf-id em{font-style:normal;font-size:12px;border-radius:99px;padding:2px 10px;background:var(--w-soft);color:var(--w-ink)}
.wf-sh{display:block;padding:4px 8px}.wf-ws,.wf-mi{display:flex;align-items:center;gap:10px;width:100%;border:0;background:transparent;color:var(--w-ink);text-align:left;padding:8px;border-radius:calc(var(--w-r) - 2px);font:13px var(--w-font);cursor:pointer}.wf-ws.on,.wf-ws:hover,.wf-mi:hover{background:var(--w-soft)}.wf-mi small{margin-left:auto}
.wf-ws i{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font:700 11px var(--w-font);font-style:normal}.wf-ws span{display:flex;flex-direction:column;flex:1}.wf-ws u{text-decoration:none;color:var(--w-pri)}.wf-pop hr{border:0;border-top:1px solid var(--w-bd);margin:6px 0}
.wf-c{background:var(--w-surf);border:1px solid var(--w-bd);border-radius:calc(var(--w-r) + 4px);padding:14px;min-width:0}
.wf-k3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.wf-kt{display:block;border-left:2px solid;padding-left:8px;font:500 15px var(--w-font);color:var(--w-mut);margin-bottom:6px}.wf-kv{font:500 22px var(--w-font)}.wf-kv b{font-size:12px;margin-left:6px}
.wf-tk{display:flex;gap:2px;height:20px;margin-top:10px}.wf-tk i{flex:1;background:var(--w-bd);border-radius:1px}
.wf-g{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:10px}.wf-ch{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.wf-seg{display:inline-flex;border:1px solid var(--w-bd);border-radius:999px;padding:2px}.wf-seg button{border:0;background:transparent;color:var(--w-mut);padding:4px 12px;border-radius:999px;font:600 12px var(--w-font);cursor:pointer}.wf-seg button.on{background:var(--w-soft);color:var(--w-ink)}
.wf svg{display:block;width:100%;height:auto}.wf svg text{fill:var(--w-mut);font:10px var(--w-font)}
.wf-q{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;width:100%;border:1px solid transparent;background:color-mix(in srgb,var(--qc) 10%,var(--w-surf));border-radius:var(--w-r);padding:12px;margin-top:8px;text-align:left;color:var(--w-ink);font:13px var(--w-font);cursor:pointer}.wf-q.on{border-color:var(--qc)}
.wf-q em{font-style:normal;font-weight:600;color:#fff;background:var(--qc);border-radius:8px;padding:6px 12px;min-width:70px;text-align:center}.wf-q span{display:flex;flex-direction:column}.wf-q u{text-decoration:none;background:var(--w-surf);border-radius:99px;padding:4px 10px;color:var(--qc);font-weight:600;font-size:12px}
.wf-ft{display:flex;justify-content:space-between;margin-top:10px}.wf-ft a{color:var(--w-pri);font-weight:600}
@media(max-width:900px){.wf-k3,.wf-g{grid-template-columns:1fr}}
</style>
