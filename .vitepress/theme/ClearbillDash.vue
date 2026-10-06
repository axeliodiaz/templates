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
const v = computed(() => { const t = T[props.theme] || T.pulsefit; const k = ['bg', 'surf', 'ink', 'mut', 'bd', 'pri', 'prit', 'ok', 'bad', 'soft', 'font', 'r', 'c1', 'c2', 'c3', 'c4', 'c5']; return Object.fromEntries(k.map((n, i) => ['--k-' + n, t[i]])) })
const range = ref('Today')
const N = 120
// accepted 94.1% -> 113 marks ink, 4 fixed (amber), 3 open (red)
const marks = Array.from({ length: N }, (_, i) => i < 113 ? 'a' : i < 117 ? 'f' : 'o')
const items = ref([['7 supplier corrections pending', 'Oldest request sent 6 h ago to Marwah Cold Chain', 'AED 71.2K', 'Send reminders', 'Reminders sent'], ['5 PO mismatches', 'Invoice total differs from the purchase order', 'AED 52.9K', 'Review', 'Opened'], ['3 duplicate risks', 'A similar invoice was already received', 'AED 18.6K', 'Review', 'Opened'], ['9 with missing or wrong data', '6 missing a required field, 3 tax calculation errors', 'AED 41.3K', 'Assign', 'Assigned']])
const done = ref([])
const act = i => { if (!done.value.includes(i)) done.value.push(i) }
const open = computed(() => 24 - done.value.length)
const blocked = Array.from({ length: 60 }, (_, i) => i < 16 ? 'r' : i < 40 ? 'k' : 'l')
const chan = [['Network', '1,012', 51], ['ERP sync', '124', 9], ['Email', '71', 8], ['Supplier portal', '29', 2], ['Upload', '12', 4]]
const root = ref(null)
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.value) return
  animate(root.value.querySelectorAll('.cl-c,.cl-it'), { opacity: [0, 1], y: [8, 0] }, { delay: stagger(0.06), duration: 0.45 })
  animate(root.value.querySelectorAll('.cl-m i'), { opacity: [0, 1], scaleY: [0.3, 1] }, { delay: stagger(0.006, { startDelay: 0.3 }), duration: 0.3 })
})
</script>

<template>
  <div class="cl" :style="v" ref="root">
    <div class="cl-hd"><div><small>Dashboard</small><h4>Today</h4><small>Oct 4 - 1,248 invoices processed. 74 raised an exception, {{ open }} are still open.</small></div><div class="cl-act"><span class="cl-sel"><button v-for="r in ['Today', 'Week']" :key="r" type="button" :class="{ on: range === r }" @click="range = r">{{ r }}</button></span><span class="cl-btn dark">Review {{ open }} exceptions &#8250;</span></div></div>
    <div class="cl-c cl-top"><div class="cl-fp"><small class="up">First-pass acceptance</small><div class="cl-xl">94.1%</div><b class="ok">+1.3 pts</b> <small>vs the last 7 days</small></div>
      <div class="cl-bar"><div class="cl-4"><div><small class="up">Processed</small><span>1,248</span></div><div><small class="up">Accepted first time</small><span>1,174</span></div><div><small class="up">Fixed and accepted</small><span>{{ 50 + done.length }}</span></div><div><small class="up">Still open</small><span class="bad">{{ open }}</span></div></div>
        <div class="cl-m" role="img" aria-label="Every mark is a share of today's invoices: 94.1 percent accepted first time, 4 percent exception fixed, 2 percent exception open"><i v-for="(m, i) in marks" :key="i" :class="m"></i></div>
        <div class="cl-leg"><span><u class="a"></u>Accepted first time</span><span><u class="f"></u>Exception, fixed</span><span><u class="o"></u>Exception, open</span><small>Every mark is a share of today's invoices</small></div></div></div>
    <div class="cl-g"><div class="cl-c"><div class="cl-ch"><b>Needs attention</b><small>{{ open }} open exceptions on 18 invoices - <b class="ink">Exception center &#8250;</b></small></div>
        <div v-for="(it, i) in items" :key="it[0]" class="cl-it"><i class="ic"></i><span><b>{{ it[0] }}</b><small>{{ it[1] }}</small></span><span class="cl-r"><b>{{ it[2] }}</b><small>at stake</small></span><button type="button" :class="{ on: done.includes(i) }" @click="act(i)">{{ done.includes(i) ? it[4] : it[3] }}</button></div>
        <small class="up cl-ft">Invoices by channel today - exceptions raised</small>
        <div class="cl-chn"><div v-for="c in chan" :key="c[0]"><small>{{ c[0] }}</small><span>{{ c[1] }} <small>{{ c[2] }}</small></span></div></div></div>
      <div class="cl-col"><div class="cl-c"><small class="up">Blocked value</small><div class="cl-big">AED 184K <small>in 18 invoices</small></div><div class="cl-m s"><i v-for="(m, i) in blocked" :key="i" :class="m"></i></div>
          <div class="cl-bl"><span><u class="o"></u>Payment due in 2 days</span><b>AED 48.5K</b></div><div class="cl-bl"><span><u class="a"></u>Due this week</span><b>AED 96.3K</b></div><div class="cl-bl"><span><u class="l"></u>Due later</span><b>AED 39.2K</b></div></div>
        <div class="cl-c"><small class="st">START HERE - PICKED BY CLEARBILL AI</small><div class="cl-sup"><i class="av"></i><span><b>Falaj Trading LLC</b><small>INV-2847 - AED 48,500.00</small></span></div><p>VAT number mismatch. Rejected 2 days before the payment deadline, and the third VAT failure from this supplier in 90 days.</p>
          <div class="cl-kv"><span>Owner</span><b>Supplier - Mazen Haddadin</b></div><div class="cl-kv"><span>Next action</span><b>Correct VAT number, resubmit</b></div><div class="cl-kv"><span>Payment due</span><b>Oct 6 - in 2 days</b></div><span class="cl-btn full">Open exception &#8250;</span></div></div></div>
  </div>
</template>

<style>
.cl{background:var(--k-bg);border:1px solid var(--k-bd);border-radius:calc(var(--k-r) + 6px);padding:14px;margin:12px 0;font:13px/1.4 var(--k-font);color:var(--k-ink);text-align:left;display:flex;flex-direction:column;gap:12px}
.cl *{box-sizing:border-box}.cl h4{margin:2px 0!important;font:400 30px var(--k-font);padding:0;border:0}.cl small{font-size:11.5px;color:var(--k-mut)}.cl b{font-weight:600}.cl p{margin:8px 0!important;font-size:12.5px}.cl .up{text-transform:uppercase;letter-spacing:.04em;font-size:10.5px}.cl .ok{color:var(--k-ok)}.cl .bad{color:var(--k-bad)}.cl .ink{color:var(--k-ink)}
.cl-hd,.cl-ch,.cl-top{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}.cl-act{display:flex;gap:8px;align-items:center}
.cl-btn{border:1px solid var(--k-bd);background:var(--k-surf);border-radius:var(--k-r);padding:8px 14px;font-weight:600;font-size:12px}.cl-btn.dark{background:var(--k-ink);color:var(--k-bg);border-color:var(--k-ink)}.cl-btn.full{display:block;text-align:center;background:var(--k-soft);margin-top:8px}
.cl-sel{display:inline-flex;border:1px solid var(--k-bd);background:var(--k-surf);border-radius:var(--k-r);padding:2px}.cl-sel button{border:0;background:transparent;color:var(--k-mut);padding:6px 12px;border-radius:calc(var(--k-r) - 3px);font:600 12px var(--k-font);cursor:pointer}.cl-sel button.on{background:var(--k-soft);color:var(--k-ink)}
.cl button:focus-visible{outline:2px solid var(--k-pri);outline-offset:2px}
.cl-c{background:var(--k-surf);border:1px solid var(--k-bd);border-radius:calc(var(--k-r) + 4px);padding:14px;min-width:0}
.cl-top{align-items:stretch;flex-wrap:nowrap}.cl-fp{padding-right:16px;border-right:1px solid var(--k-bd);flex:none}.cl-xl{font:400 50px/1.1 var(--k-font)}.cl-bar{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px}
.cl-4{display:grid;grid-template-columns:repeat(4,auto);justify-content:space-between;gap:8px}.cl-4 div{display:flex;flex-direction:column}.cl-4 span{font:400 22px var(--k-font)}
.cl-m{display:flex;gap:2px;height:30px}.cl-m i{flex:1;border-radius:1px;background:var(--k-ink)}.cl-m i.f{background:var(--k-c4)}.cl-m i.o,.cl-m i.r{background:var(--k-bad)}.cl-m.s{height:16px;margin:8px 0}.cl-m i.k{background:var(--k-ink)}.cl-m i.l{background:var(--k-bd)}
.cl-leg{display:flex;gap:14px;font-size:11.5px;flex-wrap:wrap;align-items:center}.cl-leg small:last-child{margin-left:auto}.cl u{display:inline-block;width:3px;height:10px;margin-right:6px;vertical-align:-1px}.cl u.a{background:var(--k-ink)}.cl u.f{background:var(--k-c4)}.cl u.o{background:var(--k-bad)}.cl u.l{background:var(--k-bd)}
.cl-g{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,1fr);gap:12px}.cl-col{display:flex;flex-direction:column;gap:12px}
.cl-it{display:grid;grid-template-columns:36px 1fr auto auto;gap:12px;align-items:center;padding:12px 0;border-top:1px dashed var(--k-bd)}.cl-it>span{display:flex;flex-direction:column;min-width:0}.cl-r{align-items:flex-end}
.cl-it .ic{width:34px;height:34px;border-radius:8px;border:1px solid var(--k-bd);background:var(--k-bg)}.cl-it button{border:1px solid var(--k-bd);background:var(--k-surf);color:var(--k-ink);border-radius:var(--k-r);padding:7px 14px;font:600 12px var(--k-font);cursor:pointer;min-width:96px}.cl-it button.on{background:var(--k-soft);color:var(--k-mut)}
.cl-ft{display:block;margin-top:10px}.cl-chn{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;margin-top:6px}.cl-chn div{display:flex;flex-direction:column}.cl-chn span{font:400 20px var(--k-font)}
.cl-big{font:400 32px var(--k-font)}.cl-big small{font-size:12px}.cl-bl{display:flex;justify-content:space-between;padding:6px 0}
.st{color:var(--k-pri)!important;font-size:10.5px;letter-spacing:.04em}.cl-sup{display:flex;gap:10px;align-items:center;margin:8px 0}.cl-sup span{display:flex;flex-direction:column}.cl .av{width:32px;height:32px;border-radius:50%;background:var(--k-soft)}
.cl-kv{display:flex;justify-content:space-between;gap:8px;border-top:1px solid var(--k-bd);padding:7px 0;font-size:12px}.cl-kv span{color:var(--k-mut)}
@media(max-width:900px){.cl-top{flex-direction:column}.cl-fp{border-right:0;padding-right:0}.cl-g{grid-template-columns:1fr}.cl-it{grid-template-columns:36px 1fr auto}.cl-it .cl-r{display:none}.cl-chn{grid-template-columns:repeat(3,minmax(0,1fr))}}
</style>
