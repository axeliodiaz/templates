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
const v = computed(() => { const t = T[props.theme] || T.pulsefit; const k = ['bg', 'surf', 'ink', 'mut', 'bd', 'pri', 'prit', 'ok', 'bad', 'soft', 'font', 'r', 'c1', 'c2', 'c3', 'c4', 'c5']; return Object.fromEntries(k.map((n, i) => ['--b-' + n, t[i]])) })
const shade = i => `color-mix(in srgb, var(--b-ink) ${[100, 78, 58, 40, 22][i] || 20}%, var(--b-surf))`
// 1 weekly active members
const wm = ref('OS')
const wmData = { OS: [['macOS', 4126, 34.4], ['Windows', 3284, 27.4], ['iOS', 2517, 21.0], ['Android', 1463, 12.2], ['Linux', 608, 5.1]], Browser: [['Chrome', 5210, 43.5], ['Safari', 3302, 27.6], ['Edge', 1590, 13.3], ['Firefox', 1210, 10.1], ['Other', 686, 5.5]] }
const wmRows = computed(() => wmData[wm.value]); const wmHover = ref(-1)
// 2 sales by channel
const sp = ref('Month')
const chData = { Month: [['Online store', 54000, 45, '+6.1%'], ['Marketplaces', 38400, 32, '+3.4%'], ['Retail stores', 16800, 14, '-1.2%'], ['Wholesale', 10800, 9, '+0.8%']], Quarter: [['Online store', 158000, 43, '+8.4%'], ['Marketplaces', 121000, 33, '+5.0%'], ['Retail stores', 52000, 14, '-0.4%'], ['Wholesale', 36000, 10, '+2.2%']] }
const ch = computed(() => chData[sp.value]); const chTot = computed(() => ch.value.reduce((a, c) => a + c[1], 0)); const chH = ref(-1)
const money = n => '$' + n.toLocaleString('en-US')
// 3 transfers
const tf = ref('All')
const tfAll = [['From', 'Priya Raman', 'Today, 09:12 - Instant', 84.5], ['To', 'Northwind Rentals', 'Today, 11:40 - SEPA', -420], ['From', 'Lucas Moreau', 'Today, 13:05 - Instant', 156.2], ['To', 'Harbor Utilities', 'Today, 15:27 - Direct debit', -61.4], ['From', 'Sofia Lindqvist', 'Today, 17:58 - Wire', 490]]
const tfRows = computed(() => tf.value === 'All' ? tfAll : tfAll.filter(r => (tf.value === 'Received') === (r[3] > 0)))
const tfNet = computed(() => tfRows.value.reduce((a, r) => a + r[3], 0))
// 4 funnel
const fm = ref('Total')
const fn = [['Signed up', 1280], ['Verified email', 1046], ['Created workspace', 812], ['Invited a teammate', 534], ['Upgraded to paid', 296]]
const fh = ref(4)
const fpts = computed(() => fn.map((f, i) => { const w = x => 12 + 176 * x / 1280; return [w(f[1]), i < 4 ? w(fn[i + 1][1]) : w(f[1]) * .74] }))
// 5 MRR
const mm = ref('Revenue')
const mr = { Revenue: [['Enterprise', '53.1%', '$31,240', 53.1], ['Team', '32.2%', '$18,960', 32.2], ['Solo', '10.9%', '$6,420', 10.9], ['Past due', '3.7%', '$2,180', 3.7]], Accounts: [['Enterprise', '12.0%', '18', 12], ['Team', '38.0%', '57', 38], ['Solo', '44.7%', '67', 44.7], ['Past due', '5.3%', '8', 5.3]] }
const ren = [['Northwind Labs', 'Enterprise - renews Oct 6', '$4,800'], ['Brightline Studio', 'Team - renews Oct 8', '$1,260'], ['Kestrel Health', 'Enterprise - renews Oct 10', '$3,900']]
// 6 energy
const en = [60, 62, 61, 64, 63, 66, 65, 70, 68, 72, 71, 74, 70, 76, 78, 75, 80, 82]
const enP = en.map((y, i) => (i ? 'L' : 'M') + (i * 17.6).toFixed(1) + ' ' + (70 - (y - 55) * 2.2).toFixed(1)).join(' ')
const root = ref(null)
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.value) return
  animate(root.value.querySelectorAll('.sb-c'), { opacity: [0, 1], y: [10, 0] }, { delay: stagger(0.08), duration: 0.45 })
  animate(root.value.querySelectorAll('.sb-seg i,.sb-row i.bar'), { scaleX: [0, 1] }, { delay: stagger(0.04, { startDelay: 0.3 }), duration: 0.6 })
  animate(root.value.querySelectorAll('.sb-fn path'), { opacity: [0, 1] }, { delay: stagger(0.08, { startDelay: 0.3 }), duration: 0.4 })
  animate(root.value.querySelectorAll('.sb-ln'), { opacity: [0, 1] }, { delay: 0.4, duration: 0.6 })
})
</script>

<template>
  <div class="sb" :style="v" ref="root">
    <section class="sb-c"><div class="sb-h"><div><small>Weekly active members</small><div class="sb-big">11,998</div><b class="ok">&#8599; +700 (6.2%)</b> <small>vs. previous week</small></div><span class="sb-tg"><button v-for="m in ['OS', 'Browser']" :key="m" type="button" :class="{ on: wm === m }" @click="wm = m">{{ m }}</button></span></div>
      <div class="sb-seg"><i v-for="(r, i) in wmRows" :key="r[0]" :style="{ width: r[2] + '%', background: shade(i) }"></i></div><small>Share of members by {{ wm === 'OS' ? 'operating system' : 'browser' }}</small>
      <div class="sb-row hd"><small>{{ wm === 'OS' ? 'Operating system' : 'Browser' }}</small><small>Members</small></div>
      <div v-for="(r, i) in wmRows" :key="r[0]" class="sb-row" tabindex="0" @mouseenter="wmHover = i" @mouseleave="wmHover = -1" @focus="wmHover = i" @blur="wmHover = -1"><i class="bar" :style="{ width: r[2] / wmRows[0][2] * 78 + '%' }"></i><span class="nm"><u :style="{ background: shade(i) }"></u>{{ r[0] }}</span><span class="vl"><b>{{ r[1].toLocaleString('en-US') }}</b><small>{{ wmHover === i ? (i % 2 ? '-' : '+') + (1.1 + i * .7).toFixed(1) + '% wk' : r[2].toFixed(1) + '%' }}</small></span></div>
      <small class="sb-note">Members active at least once between Sep 28 and Oct 4, 2026. Hover a row for weekly change.</small></section>
    <section class="sb-c"><div class="sb-h"><div><b>Sales by channel</b><br><small><span class="ink">{{ money(chTot) }}</span> gross sales this {{ sp.toLowerCase() }}</small></div><span class="sb-tg"><button v-for="m in ['Month', 'Quarter']" :key="m" type="button" :class="{ on: sp === m }" @click="sp = m">{{ m }}</button></span></div>
      <div class="sb-ch"><div v-for="(c, i) in ch" :key="c[0]" :style="{ flex: c[2] }" tabindex="0" @mouseenter="chH = i" @mouseleave="chH = -1" @focus="chH = i" @blur="chH = -1"><small>{{ c[0] }}</small><b>{{ money(c[1]) }}</b><i :style="{ background: i === 3 ? 'repeating-linear-gradient(135deg,var(--b-bd) 0 3px,transparent 3px 6px)' : shade(i) }"></i><span>{{ chH === i ? c[3] : c[2] + '%' }}</span></div></div>
      <small class="sb-note">Hover a channel to see its change vs. last {{ sp.toLowerCase() }}.</small></section>
    <section class="sb-c"><b>Today's Transfers</b><br><small>Net flow <b :class="tfNet >= 0 ? 'ok' : 'bad'">{{ tfNet >= 0 ? '+' : '-' }}${{ Math.abs(tfNet).toFixed(2) }}</b> across {{ tfRows.length }} transfers</small>
      <span class="sb-tg wide"><button v-for="m in ['All', 'Received', 'Sent']" :key="m" type="button" :class="{ on: tf === m }" @click="tf = m">{{ m }}</button></span>
      <div v-for="r in tfRows" :key="r[1]" class="sb-tr" :class="r[3] > 0 ? 'in' : 'out'"><span><small>{{ r[0] }}</small> <b>{{ r[1] }}</b><br><small>{{ r[2] }}</small></span><b :class="r[3] > 0 ? 'ok' : 'bad'">{{ r[3] > 0 ? '+' : '-' }}${{ Math.abs(r[3]).toFixed(2) }}</b></div></section>
    <section class="sb-c"><div class="sb-h"><div><small>Activation funnel</small><div class="sb-big">1,280</div><small>New accounts that started onboarding in September</small></div><span class="sb-tg"><button v-for="m in ['Total', 'Step']" :key="m" type="button" :class="{ on: fm === m }" @click="fm = m">{{ m }}</button></span></div>
      <div class="sb-fw"><svg class="sb-fn" viewBox="0 0 200 150" role="img" aria-label="Funnel from 1,280 signups down to 296 paid"><path v-for="(f, i) in fpts" :key="i" :d="`M${100 - f[0] / 2} ${i * 30 + 1} L${100 + f[0] / 2} ${i * 30 + 1} L${100 + f[1] / 2} ${i * 30 + 29} L${100 - f[1] / 2} ${i * 30 + 29} Z`" :fill="shade(4 - i)" :opacity="fh === i ? 1 : .8" @mouseenter="fh = i" /></svg>
        <div><button v-for="(f, i) in fn" :key="f[0]" type="button" class="sb-fl" :class="{ on: fh === i }" @mouseenter="fh = i" @focus="fh = i"><b>{{ f[0] }}</b><small>{{ f[1].toLocaleString('en-US') }} - {{ fm === 'Total' ? (f[1] / 12.8).toFixed(1) : (i ? (f[1] / fn[i - 1][1] * 100).toFixed(1) : '100.0') }}%</small></button></div></div>
      <div class="sb-in"><small>{{ fn[fh][0] }}</small><div><span><small>Converted</small><b>{{ fn[fh][1] }}</b></span><span><small>Overall rate</small><b class="ok">{{ (fn[fh][1] / 12.8).toFixed(1) }}%</b></span><span><small>Lost</small><b class="bad">-{{ 1280 - fn[fh][1] }}</b></span></div></div>
      <small class="sb-note"><b class="bad">&#8600;</b> Biggest leak: <b>Upgraded to paid</b> keeps only 55.4% of the previous step.</small></section>
    <section class="sb-c"><div class="sb-h"><div><small>Monthly recurring revenue</small><div class="sb-big">$58,800</div><b class="ok">&#8599; +6.8%</b> <small>vs. September</small></div><span class="sb-tg"><button v-for="m in ['Revenue', 'Accounts']" :key="m" type="button" :class="{ on: mm === m }" @click="mm = m">{{ m }}</button></span></div>
      <div class="sb-seg"><i v-for="(r, i) in mr[mm]" :key="r[0]" :style="{ width: r[3] + '%', background: shade(i) }"></i></div>
      <div class="sb-4"><div v-for="(r, i) in mr[mm]" :key="r[0]"><small><u :style="{ background: shade(i) }"></u>{{ r[0] }}</small><b>{{ r[1] }}</b><small>{{ r[2] }}</small></div></div>
      <div class="sb-rh"><b>9 renewals in the next 7 days</b><small>$9,960 in top 3</small></div>
      <div class="sb-rn"><div v-for="r in ren" :key="r[0]"><span><b>{{ r[0] }}</b><br><small>{{ r[1] }}</small></span><b>{{ r[2] }}</b></div></div>
      <div class="sb-al"><span><b class="bad">&#9432;</b> <b>2 invoices are past due.</b> <small>Follow up before Oct 9 to avoid suspension.</small></span><span class="sb-btn">Open billing &#8599;</span></div></section>
    <section class="sb-c"><small>ENERGY GENERATED</small><div class="sb-big">2,185 <small>MWh</small> <b class="ok">&#8599;</b></div>
      <svg viewBox="0 0 300 80" role="img" aria-label="Energy generation rising over 18 days"><defs><linearGradient id="sbg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--b-pri)" stop-opacity=".25" /><stop offset="1" stop-color="var(--b-pri)" stop-opacity="0" /></linearGradient></defs><path :d="enP + ' L299 80 L0 80 Z'" fill="url(#sbg)" /><path class="sb-ln" :d="enP" fill="none" stroke="var(--b-ink)" stroke-width="1.6" /></svg>
      <div class="sb-rh"><small>Daily average</small></div><b>72.8 MWh</b></section>
  </div>
</template>

<style>
.sb{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:12px 0;font:13px/1.4 var(--b-font);color:var(--b-ink);text-align:left}
.sb *{box-sizing:border-box}.sb small{font-size:11.5px;color:var(--b-mut)}.sb b{font-weight:600}.sb .ok{color:var(--b-ok)}.sb .bad{color:var(--b-bad)}.sb .ink{color:var(--b-ink)}
.sb-c{background:var(--b-surf);border:1px solid var(--b-bd);border-radius:calc(var(--b-r) + 4px);padding:16px;display:flex;flex-direction:column;gap:8px;min-width:0}
.sb-h{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}.sb-big{font:600 30px/1.2 var(--b-font)}.sb-big small{font-size:13px}
.sb-tg{display:inline-flex;background:var(--b-soft);border-radius:999px;padding:2px;flex:none;height:fit-content}.sb-tg.wide{align-self:stretch}.sb-tg.wide button{flex:1}.sb-tg button{border:0;background:transparent;color:var(--b-mut);padding:4px 12px;border-radius:999px;font:600 12px var(--b-font);cursor:pointer}.sb-tg button.on{background:var(--b-surf);color:var(--b-ink)}
.sb button:focus-visible,.sb [tabindex]:focus-visible{outline:2px solid var(--b-pri);outline-offset:2px}
.sb-seg{display:flex;gap:2px;height:8px;margin:6px 0}.sb-seg i{display:block;border-radius:99px;transform-origin:left;transition:width .3s}
.sb-row{position:relative;display:flex;justify-content:space-between;align-items:center;padding:6px 10px;min-height:38px}.sb-row.hd{min-height:0;padding:6px 0 0}.sb-row i.bar{position:absolute;left:0;top:2px;bottom:2px;background:var(--b-soft);border-radius:8px;transform-origin:left;transition:width .3s}
.sb-row .nm,.sb-row .vl{position:relative;display:flex}.sb-row .nm{gap:8px;align-items:center}.sb-row u,.sb-4 u{display:inline-block;width:8px;height:8px;border-radius:50%;text-decoration:none;margin-right:6px}.sb-row .nm u{margin:0}.sb-row .vl{flex-direction:column;align-items:flex-end;line-height:1.2}
.sb-note{border-top:1px solid var(--b-bd);padding-top:8px;margin-top:4px}
.sb-ch{display:flex;gap:8px}.sb-ch>div{display:flex;flex-direction:column;gap:4px;min-width:0;cursor:default}.sb-ch i{display:block;height:48px;border-radius:12px;margin:8px 0 2px}
.sb-tr{display:flex;justify-content:space-between;align-items:center;border-left:3px solid;padding:4px 10px;background:var(--b-bg);border-radius:4px}.sb-tr.in{border-color:var(--b-ok)}.sb-tr.out{border-color:var(--b-bad)}
.sb-fw{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:12px;align-items:center}.sb-fn{width:100%;height:auto}.sb-fl{display:flex;flex-direction:column;border:0;border-left:3px solid var(--b-bd);background:transparent;color:var(--b-ink);text-align:left;padding:3px 8px;margin:2px 0;font:13px var(--b-font);cursor:pointer;width:100%}.sb-fl.on{border-color:var(--b-ink)}
.sb-in{background:var(--b-bg);border:1px solid var(--b-bd);border-radius:var(--b-r);padding:10px 12px}.sb-in>div{display:flex;justify-content:space-between;margin-top:4px}.sb-in span{display:flex;flex-direction:column}.sb-in b{font-size:18px}
.sb-4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.sb-4>div{border:1px solid var(--b-bd);border-radius:var(--b-r);padding:8px;display:flex;flex-direction:column}.sb-4 b{font-size:17px}
.sb-rh{display:flex;justify-content:space-between;margin-top:4px}.sb-rn{border:1px solid var(--b-bd);border-radius:var(--b-r);overflow:hidden}.sb-rn>div{display:flex;justify-content:space-between;align-items:center;padding:8px 10px}.sb-rn>div+div{border-top:1px solid var(--b-bd)}
.sb-al{display:flex;justify-content:space-between;align-items:center;gap:8px;background:var(--b-bg);border:1px solid var(--b-bd);border-radius:var(--b-r);padding:8px 10px;flex-wrap:wrap}.sb-btn{border:1px solid var(--b-bd);background:var(--b-surf);border-radius:999px;padding:4px 12px;font-weight:600}
.sb svg{display:block;width:100%;height:auto}
@media(max-width:900px){.sb{grid-template-columns:1fr}.sb-fw{grid-template-columns:1fr}.sb-4{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style>
