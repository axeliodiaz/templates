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
const v = computed(() => { const t = T[props.theme] || T.pulsefit; const k = ['bg', 'surf', 'ink', 'mut', 'bd', 'pri', 'prit', 'ok', 'bad', 'soft', 'font', 'r', 'c1', 'c2', 'c3', 'c4', 'c5']; return Object.fromEntries(k.map((n, i) => ['--n-' + n, t[i]])) })
const rng = ref('Last 7 days')
const spark = (seed, n = 14) => Array.from({ length: n }, (_, i) => 10 + i * .5 + Math.sin(i * .9 + seed) * 3 + ((i * seed) % 3))
const sp = (a, w = 120, h = 30) => { const mn = Math.min(...a), mx = Math.max(...a); return a.map((y, i) => (i ? 'L' : 'M') + (i / (a.length - 1) * w).toFixed(1) + ' ' + (h - (y - mn) / (mx - mn || 1) * (h - 4) - 2).toFixed(1)).join(' ') }
const kpi = [['Total Customers', '2,845', '+12.5%', 'c1', 1], ['Total Orders', '1,320', '+8.3%', 'c2', 2], ['Total Revenue', '$48,230', '+15.7%', 'c3', 3], ['Conversion Rate', '3.24%', '+6.2%', 'c4', 4]]
const days = ['Apr 21', 'Apr 22', 'Apr 23', 'Apr 24', 'Apr 25', 'Apr 26', 'Apr 27']
const rev = [7200, 13000, 15800, 12000, 20400, 26000, 38000], ord = [2200, 5000, 8100, 5600, 10200, 12200, 19400]
const X = i => 40 + i * 60, Y = y => 150 - y / 40000 * 130
const line = a => a.map((y, i) => (i ? 'L' : 'M') + X(i) + ' ' + Y(y).toFixed(1)).join(' ')
const hi = ref(4)
const stat = [['Completed', 76.8, 'c1'], ['In Progress', 18.4, 'c2'], ['Pending', 4.8, 'c4']]
const R = 46, C = 2 * Math.PI * R
const arcs = (() => { let o = 0; return stat.map(s => { const l = s[1] / 100 * C; const a = { n: s[0], p: s[1], k: s[2], l, o: -o }; o += l; return a }) })()
const act = [['New order placed', 'Order #58432 from John Doe', '2m ago', 'Completed'], ['Invoice paid', '$1,240.00 from Acme Corp', '12m ago', 'Paid'], ['New customer registered', 'Sophia Wilson joined', '45m ago', 'New'], ['Support ticket updated', '#TK-4482 closed', '1h ago', 'Resolved']]
const prod = [['Wireless Headphones', '$12,430', '+18%', 5], ['Smart Watch', '$8,920', '+12%', 6], ['Laptop Stand', '$6,750', '+9%', 7], ['Bluetooth Speaker', '$4,320', '+6%', 8]]
const quick = [['Active Projects', '24', '+12%', 1], ['Support Tickets', '156', '-8%', 0], ['Pending Invoices', '32', '+5%', 1], ['Total Downloads', '12.4K', '+21%', 1]]
const root = ref(null)
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.value) return
  animate(root.value.querySelectorAll('.nv-c'), { opacity: [0, 1], y: [10, 0] }, { delay: stagger(0.06), duration: 0.45 })
  animate(root.value.querySelectorAll('.nv-sp,.nv-ar'), { opacity: [0, 1] }, { delay: stagger(0.04, { startDelay: 0.3 }), duration: 0.6 })
})
</script>

<template>
  <div class="nv" :style="v" ref="root">
    <div class="nv-top"><div class="nv-logo"><i></i><b>NovaMetrics</b></div><div class="nv-search">Search anything... <kbd>&#8984;K</kbd></div><div class="nv-user"><i class="av"></i><span><b>Sophia Martinez</b><small>Admin</small></span></div></div>
    <div class="nv-hd"><div><small class="g">Dashboard</small><h4>Good morning, Sophia!</h4><small>Here's what's happening with your business today.</small></div><div class="nv-act"><span class="nv-btn">Apr 21, 2025 - Apr 27, 2025</span><span class="nv-sel"><button v-for="r in ['Last 7 days', 'Last 30 days']" :key="r" type="button" :class="{ on: rng === r }" @click="rng = r">{{ r }}</button></span><span class="nv-btn pri">+ Add Widget</span></div></div>
    <div class="nv-k4"><div v-for="k in kpi" :key="k[0]" class="nv-c"><div class="nv-kh"><i :style="{ background: `color-mix(in srgb,var(--n-${k[3]}) 16%,var(--n-surf))`, color: `var(--n-${k[3]})` }">&#9679;</i><div><small>{{ k[0] }}</small><div class="nv-kv">{{ k[1] }} <b class="ok">&#8593; {{ k[2] }}</b></div></div></div><svg class="nv-sp" viewBox="0 0 120 30" preserveAspectRatio="none"><path :d="sp(spark(k[4]))" fill="none" :stroke="`var(--n-${k[3]})`" stroke-width="1.6" /></svg></div></div>
    <div class="nv-g2"><div class="nv-c"><div class="nv-ch"><div><b>Sales Overview</b><br><small>Revenue and orders over the {{ rng.toLowerCase() }}.</small></div><small class="lg"><i style="background:var(--n-c1)"></i>Revenue <i style="background:var(--n-c2)"></i>Orders</small></div>
        <svg viewBox="0 0 440 180" role="img" aria-label="Revenue and orders from Apr 21 to Apr 27 rising to about $38,000" @mousemove="e => { const r = e.currentTarget.getBoundingClientRect(); hi = Math.max(0, Math.min(6, Math.round(((e.clientX - r.left) / r.width * 440 - 40) / 60))) }">
          <line v-for="t in [0, 10000, 20000, 30000, 40000]" :key="t" x1="40" x2="400" :y1="Y(t)" :y2="Y(t)" class="gl" /><text v-for="t in [0, 10000, 20000, 30000, 40000]" :key="'t' + t" x="4" :y="Y(t) + 3">{{ t / 1000 }}K</text>
          <path class="nv-ar" :d="line(rev) + ` L${X(6)} ${Y(0)} L${X(0)} ${Y(0)} Z`" fill="var(--n-c1)" opacity=".14" /><path class="nv-ar" :d="line(ord) + ` L${X(6)} ${Y(0)} L${X(0)} ${Y(0)} Z`" fill="var(--n-c2)" opacity=".12" />
          <path class="nv-ar" :d="line(rev)" fill="none" stroke="var(--n-c1)" stroke-width="2" /><path class="nv-ar" :d="line(ord)" fill="none" stroke="var(--n-c2)" stroke-width="2" />
          <circle :cx="X(hi)" :cy="Y(rev[hi])" r="4" fill="var(--n-surf)" stroke="var(--n-c1)" stroke-width="2" /><circle :cx="X(hi)" :cy="Y(ord[hi])" r="4" fill="var(--n-surf)" stroke="var(--n-c2)" stroke-width="2" />
          <text v-for="(d, i) in days" :key="d" :x="X(i)" y="172" text-anchor="middle">{{ d }}</text></svg>
        <div class="nv-tip"><b>{{ days[hi] }}, 2025</b><span><i style="background:var(--n-c1)"></i>Revenue ${{ rev[hi].toLocaleString('en-US') }}</span><span><i style="background:var(--n-c2)"></i>Orders {{ ord[hi].toLocaleString('en-US') }}</span></div></div>
      <div class="nv-c"><div class="nv-ch"><b>Performance Overview</b></div><svg viewBox="0 0 120 120" role="img" aria-label="76.8 percent of the goal achieved"><circle cx="60" cy="60" :r="R" fill="none" stroke="var(--n-soft)" stroke-width="12" /><circle v-for="a in arcs" :key="a.n" cx="60" cy="60" :r="R" fill="none" :stroke="`var(--n-${a.k})`" stroke-width="12" :stroke-dasharray="`${a.l - 2} ${C}`" :stroke-dashoffset="a.o" transform="rotate(-90 60 60)" /><text x="60" y="58" text-anchor="middle" class="big">76.8%</text><text x="60" y="72" text-anchor="middle">Goal Achieved</text></svg>
        <div class="nv-lg"><span v-for="a in arcs" :key="a.n"><i :style="{ background: `var(--n-${a.k})` }"></i>{{ a.n }}<b>{{ a.p }}%</b></span></div></div></div>
    <div class="nv-g3"><div class="nv-c"><div class="nv-ch"><b>Recent Activity</b><small class="g">View all &#8594;</small></div><div v-for="a in act" :key="a[0]" class="nv-li"><i class="ic"></i><span><b>{{ a[0] }}</b><small>{{ a[1] }}</small></span><span class="r"><small>{{ a[2] }}</small><em>{{ a[3] }}</em></span></div></div>
      <div class="nv-c"><div class="nv-ch"><b>Top Products</b><small class="g">View all &#8594;</small></div><div v-for="(p, i) in prod" :key="p[0]" class="nv-li"><small>{{ i + 1 }}</small><i class="ic sq"></i><span><b>{{ p[0] }}</b><small>{{ p[1] }} <b class="ok">&#8593; {{ p[2] }}</b></small></span><svg class="nv-sp" viewBox="0 0 120 30" preserveAspectRatio="none"><path :d="sp(spark(p[3]))" fill="none" :stroke="`var(--n-c${i + 1})`" stroke-width="1.6" /></svg></div></div>
      <div class="nv-c"><div class="nv-ch"><b>Quick Stats</b><small class="g">View all &#8594;</small></div><div v-for="q in quick" :key="q[0]" class="nv-li q"><i class="ic sq"></i><span>{{ q[0] }}</span><b>{{ q[1] }}</b><b :class="q[3] ? 'ok' : 'bad'">{{ q[3] ? '&#8593;' : '&#8595;' }} {{ q[2].replace(/[+-]/, '') }}</b></div></div></div>
  </div>
</template>

<style>
.nv{background:var(--n-bg);border:1px solid var(--n-bd);border-radius:calc(var(--n-r) + 6px);padding:14px;margin:12px 0;font:13px/1.4 var(--n-font);color:var(--n-ink);text-align:left;display:flex;flex-direction:column;gap:12px}
.nv *{box-sizing:border-box}.nv h4{margin:2px 0!important;font:600 24px var(--n-font);padding:0;border:0}.nv small{font-size:11.5px;color:var(--n-mut)}.nv b{font-weight:600}.nv .ok{color:var(--n-ok)}.nv .bad{color:var(--n-bad)}.nv .g{color:var(--n-ok)}
.nv-top,.nv-hd,.nv-ch{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}.nv-logo{display:flex;gap:8px;align-items:center;font-size:15px}.nv-logo i{width:18px;height:18px;border-radius:5px;background:var(--n-pri)}
.nv-search{flex:1;max-width:360px;border:1px solid var(--n-bd);background:var(--n-surf);border-radius:var(--n-r);padding:7px 12px;color:var(--n-mut)}.nv-search kbd{float:right;font:11px var(--n-font)}
.nv-user{display:flex;gap:8px;align-items:center}.nv-user span{display:flex;flex-direction:column}.nv .av{width:30px;height:30px;border-radius:50%;background:var(--n-soft)}
.nv-act{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.nv-btn{border:1px solid var(--n-bd);background:var(--n-surf);border-radius:var(--n-r);padding:7px 12px;font-weight:500;font-size:12px}.nv-btn.pri{background:var(--n-pri);color:var(--n-prit);border-color:var(--n-pri);font-weight:600}
.nv-sel{display:inline-flex;border:1px solid var(--n-bd);background:var(--n-surf);border-radius:var(--n-r);padding:2px}.nv-sel button{border:0;background:transparent;color:var(--n-mut);padding:5px 10px;border-radius:calc(var(--n-r) - 3px);font:500 12px var(--n-font);cursor:pointer}.nv-sel button.on{background:var(--n-soft);color:var(--n-ink)}
.nv button:focus-visible{outline:2px solid var(--n-pri);outline-offset:2px}
.nv-c{background:var(--n-surf);border:1px solid var(--n-bd);border-radius:calc(var(--n-r) + 2px);padding:14px;min-width:0}
.nv-k4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.nv-kh{display:flex;gap:10px;align-items:center}.nv-kh i{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-style:normal;flex:none}.nv-kv{font:600 22px var(--n-font)}.nv-kv b{font-size:11px}
.nv-sp{display:block;width:100%;height:30px;margin-top:8px}
.nv-g2{display:grid;grid-template-columns:minmax(0,1.9fr) minmax(0,1fr);gap:10px}.nv-g3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.nv svg{display:block}.nv-c>svg:not(.nv-sp){width:100%;height:auto}.nv svg text{fill:var(--n-mut);font:9.5px var(--n-font)}.nv svg .big{fill:var(--n-ink);font:600 17px var(--n-font)}.nv svg .gl{stroke:var(--n-bd);stroke-dasharray:3 3}
.nv .lg i,.nv-tip i,.nv-lg i{display:inline-block;width:8px;height:8px;border-radius:50%;margin:0 4px 0 8px}.nv-tip{display:flex;gap:12px;flex-wrap:wrap;font-size:12px;margin-top:4px}.nv-tip i{margin-left:0}
.nv-lg{display:flex;flex-direction:column;gap:4px;margin-top:6px}.nv-lg span{display:flex;align-items:center}.nv-lg i{margin-left:0}.nv-lg b{margin-left:auto}
.nv-li{display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid var(--n-bd)}.nv-li>span{display:flex;flex-direction:column;min-width:0;flex:1}.nv-li .r{align-items:flex-end;flex:none;gap:2px}.nv-li em{font-style:normal;font-size:11px;padding:1px 8px;border-radius:99px;background:var(--n-soft);color:var(--n-ink)}
.nv-li .ic{width:32px;height:32px;border-radius:50%;background:var(--n-soft);flex:none}.nv-li .ic.sq{border-radius:8px;width:28px;height:28px}.nv-li .nv-sp{width:70px;margin:0;flex:none}.nv-li.q>span{flex-direction:row}.nv-li.q b:last-child{min-width:48px;text-align:right;font-size:12px}
@media(max-width:900px){.nv-k4,.nv-g3,.nv-g2{grid-template-columns:1fr}}
</style>
