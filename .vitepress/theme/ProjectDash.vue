<script setup>
import { ref, computed, onMounted } from 'vue'
import { animate, stagger } from 'motion'
const props = defineProps({ theme: { type: String, default: 'pulsefit' } })
const T = {
  lustro: ['#0b0b18', 'rgba(148,140,255,.08)', '#fff', '#a5b4fc', 'rgba(148,140,255,.22)', '#6366f1', '#fff', '#34d399', '#f472b6', 'rgba(99,102,241,.2)', "'DM Sans',sans-serif", '14px', '#6366f1', '#fbbf24', '#22d3ee', '#f472b6', '#64648c'],
  felix: ['#fefcf9', '#fff', '#082422', '#636158', '#e3ded3', '#065958', '#fff', '#1b8a4b', '#c0392b', '#e3efee', "'Saans',sans-serif", '10px', '#065958', '#c9772b', '#7fb7b5', '#e0b778', '#a8a89c'],
  pulsefit: ['#f5f5f5', '#fff', '#212121', '#5f666d', '#e0e0e0', '#C9A66B', '#212121', '#198754', '#dc3545', '#f5e6d3', "'Rubik',sans-serif", '14px', '#7a5a1f', '#C9A66B', '#b8c4cc', '#e6d2b0', '#b0b0b0'],
  scopecraft: ['#f4f4f5', '#fff', '#111113', '#6b6f76', '#e6e6e8', '#111113', '#fff', '#17803d', '#c62828', '#ececee', 'ui-sans-serif,system-ui,sans-serif', '8px', '#111113', '#2f6fdc', '#9aa0aa', '#c4c7ce', '#d9dadd'],
  lumen: ['#fbfbfa', '#fff', '#17171a', '#74767d', '#e7e7e9', '#7c6cf0', '#fff', '#1b9a4b', '#d23b3b', '#ece9fd', "'Plus Jakarta Sans',sans-serif", '12px', '#7c6cf0', '#f5b800', '#0fb0ea', '#e08a1e', '#b5b7bd']
}
const v = computed(() => { const t = T[props.theme] || T.pulsefit; const k = ['bg', 'surf', 'ink', 'mut', 'bd', 'pri', 'prit', 'ok', 'bad', 'soft', 'font', 'r', 'c1', 'c2', 'c3', 'c4', 'c5']; return Object.fromEntries(k.map((n, i) => ['--p-' + n, t[i]])) })
const range = ref('This Month')
const tabs = ['Today', 'This Week', 'This Month', 'Reports']
const day = ref('Today')
const tasks = [['BrightBridge - Website Design', 'Design a framer website with modern templates.', 'c2'], ['Github - Upload Dev Files & Images', 'Collaborate with developers to handle the SaaS project.', 'c3'], ['Mapbox - Route Review', 'Check the delivery map layers before release.', 'c4']]
const done = ref([])
const tog = i => { done.value = done.value.includes(i) ? done.value.filter(x => x !== i) : [...done.value, i] }
const status = [['In Progress', 14, 'c2'], ['Completed', 32, 'c3'], ['Not Started', 54, 'c5']]
const R = 62, C = 2 * Math.PI * R
const arcs = computed(() => { let o = 0; const tot = 100; return status.map(s => { const len = s[1] / tot * C; const a = { k: s[2], len, off: -o, n: s[0], v: s[1] }; o += len; return a }) })
const inc = [12, 15, 11, 18, 16, 9, 9, 14, 13, 11, 17, 15, 16, 13, 10, 8, 12, 15, 17, 16]
const exp = [5, 6, 4, 7, 5, 4, 6, 3, 5, 6, 4, 5, 6, 5, 4, 3, 5, 6, 4, 5]
const pts = (a, h) => a.map((y, i) => [(i / (a.length - 1)) * 300, h - y * 4.2])
const path = a => { const p = pts(a, 100); return p.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' ') }
const hov = ref(10)
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const inv = [['Overdue', 5, '183,000', 46, 'c1'], ['Not Paid', 5, '128,500', 38, 'c4'], ['Partially Paid', 3, '64,200', 22, 'c2'], ['Paid', 24, '412,900', 82, 'c3']]
const root = ref(null)
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.value) return
  animate(root.value.querySelectorAll('.pj-c,.pj-task'), { opacity: [0, 1], y: [10, 0] }, { delay: stagger(0.07), duration: 0.45 })
  animate(root.value.querySelectorAll('.pj-bar i'), { scaleX: [0, 1] }, { delay: stagger(0.08, { startDelay: 0.3 }), duration: 0.6 })
  animate(root.value.querySelectorAll('.pj-line'), { opacity: [0, 1] }, { delay: 0.3, duration: 0.6 })
})
</script>

<template>
  <div class="pj" :style="v" ref="root">
    <div class="pj-top"><b class="pj-logo">enaz</b><div class="pj-pills"><button v-for="t in tabs" :key="t" type="button" :class="{ on: range === t }" @click="range = t">{{ t }}</button></div></div>
    <div class="pj-body">
      <div class="pj-rail" aria-hidden="true"><i class="on"></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <div class="pj-main">
        <div class="pj-hd"><div><small>Manage and track your projects</small><h4>Project Dashboard</h4></div><div class="pj-search">Search tasks</div></div>
        <div class="pj-grid">
          <div class="pj-c pj-tasks"><div class="pj-ch"><b>My Tasks</b><span class="pj-ic">+</span></div>
            <div class="pj-pills sm"><button type="button" :class="{ on: day === 'Today' }" @click="day = 'Today'">Today</button><button type="button" :class="{ on: day === 'Tomorrow' }" @click="day = 'Tomorrow'">Tomorrow</button></div>
            <div class="pj-sel"><i>12</i> On Going Tasks <span>&#9662;</span></div>
            <div v-for="(t, i) in tasks" :key="t[0]" class="pj-task" :style="{ '--tc': `var(--p-${t[2]})` }"><div class="pj-th"><i class="pj-logo2"></i><button type="button" class="pj-chk" :aria-pressed="done.includes(i)" :aria-label="'Mark done: ' + t[0]" @click="tog(i)">{{ done.includes(i) ? '&#10003;' : '' }}</button></div><b :class="{ dn: done.includes(i) }">{{ t[0] }}</b><small>{{ t[1] }}</small></div>
          </div>
          <div class="pj-c"><div class="pj-ch"><b>Projects Overview</b><span class="pj-ic">&#8599;</span></div>
            <svg viewBox="0 0 160 160" role="img" aria-label="Projects: 14 in progress, 32 completed, 54 not started"><circle cx="80" cy="80" :r="R" fill="none" stroke="var(--p-soft)" stroke-width="22" /><circle v-for="a in arcs" :key="a.n" cx="80" cy="80" :r="R" fill="none" :stroke="`var(--p-${a.k})`" stroke-width="22" :stroke-dasharray="`${a.len - 2} ${C}`" :stroke-dashoffset="a.off" transform="rotate(-90 80 80)" /><text x="80" y="78" text-anchor="middle" class="pj-big">100</text><text x="80" y="94" text-anchor="middle">projects</text></svg>
            <div class="pj-leg"><span v-for="s in status" :key="s[0]"><i :style="{ background: `var(--p-${s[2]})` }"></i>{{ s[0] }}: {{ s[1] }}</span></div></div>
          <div class="pj-c"><div class="pj-ch"><b>Income VS Expense</b><span class="pj-ic">&#8801;</span></div>
            <svg viewBox="0 0 300 120" role="img" aria-label="Income and expense lines from January to June" @mousemove="e => { const r = e.currentTarget.getBoundingClientRect(); hov = Math.max(0, Math.min(19, Math.round((e.clientX - r.left) / r.width * 19))) }">
              <path class="pj-line" :d="path(inc)" fill="none" stroke="var(--p-c3)" stroke-width="1.6" /><path class="pj-line" :d="path(exp)" fill="none" stroke="var(--p-c2)" stroke-width="1.6" />
              <line :x1="pts(inc, 100)[hov][0]" y1="6" :x2="pts(inc, 100)[hov][0]" y2="100" stroke="var(--p-mut)" stroke-dasharray="3 3" /><circle :cx="pts(inc, 100)[hov][0]" :cy="pts(inc, 100)[hov][1]" r="3.5" fill="var(--p-surf)" stroke="var(--p-c3)" stroke-width="1.6" /><circle :cx="pts(exp, 100)[hov][0]" :cy="pts(exp, 100)[hov][1]" r="3.5" fill="var(--p-surf)" stroke="var(--p-c2)" stroke-width="1.6" />
              <text v-for="(m, i) in months" :key="m" :x="i * 56" y="116">{{ m }}</text></svg>
            <div class="pj-tip"><span><i style="background:var(--p-c3)"></i>Income: {{ (inc[hov] * 1.4).toFixed(1) }}k$</span><span><i style="background:var(--p-c2)"></i>Expense: {{ (exp[hov] * 2.2).toFixed(1) }}k$</span></div></div>
          <div class="pj-c pj-inv"><div class="pj-ch"><b>Invoice Overview</b><span class="pj-ic">&#8599;</span></div>
            <div v-for="r in inv" :key="r[0]" class="pj-ir"><div class="pj-il"><span>{{ r[0] }}</span><span>{{ r[1] }} | USD {{ r[2] }}</span></div><div class="pj-bar"><i :style="{ width: r[3] + '%', background: `var(--p-${r[4]})` }"></i></div></div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.pj{background:var(--p-bg);border:1px solid var(--p-bd);border-radius:calc(var(--p-r) + 8px);padding:16px;margin:12px 0;font:13px/1.4 var(--p-font);color:var(--p-ink);text-align:left}
.pj *{box-sizing:border-box}.pj h4{margin:0!important;font:500 26px var(--p-font);padding:0;border:0}.pj small{font-size:11px;color:var(--p-mut)}
.pj-top{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px}.pj-logo{font:600 24px var(--p-font);letter-spacing:-.5px}
.pj-pills{display:flex;gap:6px;flex-wrap:wrap}.pj-pills button{border:1px solid var(--p-bd);background:transparent;color:var(--p-ink);border-radius:999px;padding:6px 14px;font:500 12px var(--p-font);cursor:pointer}.pj-pills button.on{background:var(--p-ink);color:var(--p-bg);border-color:var(--p-ink)}.pj-pills.sm{margin:8px 0}
.pj button:focus-visible{outline:2px solid var(--p-pri);outline-offset:2px}
.pj-body{display:flex;gap:12px}.pj-rail{display:flex;flex-direction:column;gap:8px;flex:none}.pj-rail i{width:30px;height:30px;border-radius:50%;background:var(--p-surf);border:1px solid var(--p-bd)}.pj-rail i.on{background:var(--p-ink)}
.pj-main{flex:1;min-width:0}.pj-hd{display:flex;justify-content:space-between;align-items:flex-end;gap:10px;margin-bottom:12px;flex-wrap:wrap}.pj-search{border:1px solid var(--p-bd);border-radius:999px;padding:8px 18px;color:var(--p-mut);background:var(--p-surf)}
.pj-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr) minmax(0,1.4fr);gap:10px}
.pj-c{background:var(--p-surf);border:1px solid var(--p-bd);border-radius:calc(var(--p-r) + 6px);padding:14px;min-width:0}
.pj-tasks{grid-row:span 2}.pj-inv{grid-column:2 / span 2}
.pj-ch{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.pj-ch b{font:500 15px var(--p-font)}
.pj-ic{width:28px;height:28px;border-radius:50%;border:1px solid var(--p-bd);display:inline-flex;align-items:center;justify-content:center}
.pj-sel{border:1px solid var(--p-bd);border-radius:999px;padding:6px 12px;display:flex;gap:8px;align-items:center;margin-bottom:8px}.pj-sel i{background:var(--p-ink);color:var(--p-bg);border-radius:50%;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-style:normal}.pj-sel span{margin-left:auto}
.pj-task{background:color-mix(in srgb,var(--tc) 14%,var(--p-surf));border-radius:var(--p-r);padding:10px;margin-top:8px;display:flex;flex-direction:column;gap:3px}
.pj-th{display:flex;justify-content:space-between}.pj-logo2{width:18px;height:18px;border-radius:5px;background:var(--tc)}
.pj-chk{width:22px;height:22px;border-radius:50%;border:1px solid var(--p-mut);background:transparent;color:var(--p-ink);font-size:11px;cursor:pointer;padding:0}.pj-chk[aria-pressed=true]{background:var(--p-ink);color:var(--p-bg)}.pj-task b.dn{text-decoration:line-through;opacity:.6}
.pj svg{display:block;width:100%;height:auto}.pj svg text{fill:var(--p-mut);font:9px var(--p-font)}.pj svg .pj-big{fill:var(--p-ink);font:600 22px var(--p-font)}
.pj-leg,.pj-tip{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px;font-size:12px}.pj-leg i,.pj-tip i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:5px}
.pj-ir{margin-top:10px}.pj-il{display:flex;justify-content:space-between;margin-bottom:4px}.pj-bar{height:12px;border-radius:99px;background:var(--p-soft);overflow:hidden}.pj-bar i{display:block;height:100%;border-radius:99px;transform-origin:left}
@media(max-width:900px){.pj-grid{grid-template-columns:1fr}.pj-tasks{grid-row:auto}.pj-inv{grid-column:auto}.pj-rail{display:none}}
</style>
