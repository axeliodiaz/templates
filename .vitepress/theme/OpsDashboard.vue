<script setup>
import { ref, computed, onMounted } from 'vue'
import { animate, stagger } from 'motion'
const props = defineProps({ theme: { type: String, default: 'pulsefit' }, name: { type: String, default: 'NexaFlow' } })
const T = {
  lustro: ['#0b0b18', 'rgba(148,140,255,.08)', '#fff', '#a5b4fc', 'rgba(148,140,255,.22)', '#6366f1', '#fff', '#34d399', '#f472b6', '#fbbf24', "'DM Sans',sans-serif", '14px', 'rgba(99,102,241,.2)'],
  felix: ['#fefcf9', '#fff', '#082422', '#636158', '#e3ded3', '#065958', '#fff', '#1b8a4b', '#c0392b', '#b77900', "'Saans',sans-serif", '10px', '#e3efee'],
  pulsefit: ['#f5f5f5', '#fff', '#212121', '#5f666d', '#e0e0e0', '#C9A66B', '#212121', '#198754', '#dc3545', '#b77900', "'Rubik',sans-serif", '14px', '#f5e6d3'],
  scopecraft: ['#f4f4f5', '#fff', '#111113', '#6b6f76', '#e6e6e8', '#111113', '#fff', '#17803d', '#c62828', '#a05a00', 'ui-sans-serif,system-ui,sans-serif', '8px', '#ececee'],
  lumen: ['#fbfbfa', '#fff', '#17171a', '#74767d', '#e7e7e9', '#7c6cf0', '#fff', '#1b9a4b', '#d23b3b', '#d9770a', "'Plus Jakarta Sans',sans-serif", '12px', '#ece9fd']
}
const v = computed(() => { const t = T[props.theme] || T.pulsefit; return { '--o-bg': t[0], '--o-surf': t[1], '--o-ink': t[2], '--o-mut': t[3], '--o-bd': t[4], '--o-pri': t[5], '--o-prit': t[6], '--o-ok': t[7], '--o-bad': t[8], '--o-warn': t[9], '--o-font': t[10], '--o-r': t[11], '--o-soft': t[12] } })
const nav = ['Overview', 'Workflows', 'Automation', 'Team', 'Reports', 'Settings']
const spark = a => { const mx = Math.max(...a), mn = Math.min(...a); return a.map((x, i) => `${(i * 70 / (a.length - 1)).toFixed(1)},${(22 - (x - mn) / (mx - mn || 1) * 18).toFixed(1)}`).join(' ') }
const kpis = [['Active workflows', '24', '+12%', 'vs. last 7 days', true, [3, 5, 4, 7, 6, 9, 11]], ['Success rate', '98.5%', '+0.7%', 'vs. last 7 days', true, [5, 6, 6, 7, 8, 8, 9]], ['Tasks today', '142', '+18%', 'vs. yesterday', true, [4, 6, 5, 8, 7, 9, 10]], ['Avg. response time', '3m 24s', '-32%', 'vs. last 7 days', true, [9, 8, 8, 6, 5, 4, 3]]]
const days = ['Apr 21', 'Apr 22', 'Apr 23', 'Apr 24', 'Apr 25', 'Apr 26', 'Apr 27']
const rate = [38, 58, 50, 65, 58, 62, 70, 74, 80, 84, 90, 95]
const runs = [12, 18, 16, 24, 22, 26, 20, 30, 28, 36, 32, 40]
const labels = ['Apr 21', '', 'Apr 22', '', 'Apr 23', '', 'Apr 24', '', 'Apr 25', '', 'Apr 26', 'Apr 27']
const W = 520, H = 190, X = i => 36 + i * (W - 50) / (rate.length - 1), Y = p => H - 24 - p * (H - 40) / 100
const line = rate.map((r, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(r).toFixed(1)}`).join('')
const hov = ref(null)
const act = [['Order Processing completed', 'Workflow #WF-4821', '2m ago', 'ok'], ['New workflow started', 'Customer Onboarding', '7m ago', 'pri'], ['Retry attempt', 'Invoice Generation', '12m ago', 'warn'], ['Team member joined', 'Sophia Martinez', '24m ago', 'pri'], ['Backup completed', 'System Backup', '42m ago', 'ok']]
const wf = [['Customer Onboarding', 'Web App', 'Apr 27, 2026 10:42 AM', 'Success', '4m 12s'], ['Invoice Processing', 'API', 'Apr 27, 2026 10:31 AM', 'Success', '2m 36s'], ['Data Sync', 'Scheduled', 'Apr 27, 2026 09:15 AM', 'Running', '1m 02s'], ['Report Generation', 'Manual', 'Apr 27, 2026 08:53 AM', 'Failed', '3m 48s'], ['User Cleanup', 'Scheduled', 'Apr 27, 2026 08:21 AM', 'Success', '1m 17s']]
const svc = ['API Services', 'Database', 'Worker Queue', 'File Storage', 'Webhooks']
const qa = [['Start new workflow', 'Choose from templates'], ['View logs', 'Inspect system activity'], ['Manage integrations', 'Connect external services']]
const root = ref(null)
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.value) return
  animate(root.value.querySelectorAll('.od-k,.od-c'), { opacity: [0, 1], y: [8, 0] }, { delay: stagger(0.06), duration: 0.45 })
  animate(root.value.querySelectorAll('.od-bar'), { scaleY: [0, 1] }, { delay: stagger(0.04, { startDelay: 0.3 }), duration: 0.4 })
  const ring = root.value.querySelector('.od-ring'); if (ring) animate(ring, { strokeDashoffset: [314, 314 * 0.002] }, { duration: 1.2, ease: 'easeOut' })
})
</script>

<template>
  <div class="od" :style="v" ref="root">
    <aside class="od-side">
      <div class="od-brand"><i></i>{{ name }}</div>
      <div v-for="(n, i) in nav" :key="n" class="od-nav" :class="{ on: i === 0 }"><u></u>{{ n }}</div>
      <div class="od-up"><b>Smarter operations with automation</b><small>Reduce manual work and scale with confidence.</small><span class="od-btn">Explore features</span></div>
    </aside>
    <div class="od-main">
      <div class="od-top"><div class="od-search">Search workflows, tasks, or anything... <kbd>&#8984; K</kbd></div><span class="od-pill">Apr 21, 2026 - Apr 27, 2026</span><div class="od-user"><i></i><div><b>Jordan Ellis</b><small>Operations Lead</small></div></div></div>
      <div class="od-grid">
        <div class="od-left">
          <small class="od-eye">OPERATIONS CENTER</small><h3 class="od-h">Keep your workflows running</h3><p class="od-sub">Monitor performance, track progress, and resolve issues, all in one place.</p>
          <div class="od-k4"><div class="od-k" v-for="k in kpis" :key="k[0]"><div class="od-kl"><i></i>{{ k[0] }}</div><div class="od-kv">{{ k[1] }}</div><div class="od-kf"><b class="up">{{ k[4] ? '&#9650;' : '&#9660;' }} {{ k[2] }}</b><small>{{ k[3] }}</small></div><svg viewBox="0 0 70 26" width="70" height="26" aria-hidden="true"><polyline :points="spark(k[5])" fill="none" stroke="var(--o-pri)" stroke-width="1.6" /></svg></div></div>
          <div class="od-g2">
            <div class="od-c"><div class="od-ct"><b>Workflow Performance</b><small>Success rate and volume, last 7 days</small></div>
              <div class="od-ch" @mouseleave="hov = null"><svg :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Success rate line over total runs bars, April 21 to 27, rising from 38 to 95 percent">
                <g v-for="p in [0, 25, 50, 75, 100]" :key="p"><line :x1="36" :x2="W - 14" :y1="Y(p)" :y2="Y(p)" stroke="var(--o-bd)" stroke-dasharray="3 4" /><text x="30" :y="Y(p) + 3" text-anchor="end">{{ p }}%</text></g>
                <rect v-for="(r, i) in runs" :key="'b' + i" class="od-bar" :x="X(i) - 6" :y="H - 24 - r * 1.3" width="12" :height="r * 1.3" rx="3" fill="var(--o-soft)" style="transform-origin:bottom;transform-box:fill-box" />
                <path :d="line" fill="none" stroke="var(--o-pri)" stroke-width="2" stroke-linejoin="round" />
                <g v-for="(r, i) in rate" :key="'d' + i"><circle :cx="X(i)" :cy="Y(r)" :r="hov === i ? 5 : 3" fill="var(--o-surf)" stroke="var(--o-pri)" stroke-width="2" /><circle :cx="X(i)" :cy="Y(r)" r="12" fill="transparent" tabindex="0" :aria-label="`${labels[i] || days[Math.floor(i / 2)]}: success ${r}%, ${runs[i] * 12} runs`" @mouseenter="hov = i" @focus="hov = i" /></g>
                <text v-for="(l, i) in labels" :key="'l' + i" :x="X(i)" :y="H - 6" text-anchor="middle">{{ l }}</text></svg>
                <div v-if="hov !== null" class="od-tip">{{ labels[hov] || days[Math.floor(hov / 2)] }}<br />Success rate <b>{{ rate[hov] }}%</b><br />Total runs <b>{{ runs[hov] * 12 }}</b></div></div></div>
            <div class="od-c"><div class="od-ct"><b>Recent Activity</b><small class="od-link">View all</small></div><div class="od-row" v-for="a in act" :key="a[0]"><i :class="a[3]"></i><div><b>{{ a[0] }}</b><small>{{ a[1] }}</small></div><small>{{ a[2] }}</small></div></div>
          </div>
          <div class="od-c od-tbl"><div class="od-ct"><b>Recent Workflows</b><small class="od-link">View all</small></div><table><thead><tr><th>Name</th><th>Triggered by</th><th>Last run</th><th>Status</th><th>Duration</th></tr></thead><tbody><tr v-for="w in wf" :key="w[0]"><td><b>{{ w[0] }}</b></td><td>{{ w[1] }}</td><td>{{ w[2] }}</td><td><span class="od-st" :class="w[3]">{{ w[3] }}</span></td><td>{{ w[4] }}</td></tr></tbody></table></div>
        </div>
        <div class="od-right">
          <div class="od-c"><b>System health</b><div class="od-sm"><i></i>All systems operational</div>
            <svg class="od-rg" viewBox="0 0 120 120" width="150" height="150" role="img" aria-label="Uptime 99.8 percent"><circle cx="60" cy="60" r="50" fill="none" stroke="var(--o-bd)" stroke-width="10" /><circle class="od-ring" cx="60" cy="60" r="50" fill="none" stroke="var(--o-ok)" stroke-width="10" stroke-linecap="round" stroke-dasharray="314" stroke-dashoffset="0.6" transform="rotate(-90 60 60)" /><text x="60" y="62" text-anchor="middle" class="od-rv">99.8%</text><text x="60" y="78" text-anchor="middle" class="od-ru">Uptime</text></svg>
            <div class="od-sv" v-for="s in svc" :key="s"><span>{{ s }}</span><span class="od-ok">Healthy</span></div></div>
          <div class="od-c"><b>Quick actions</b><div class="od-qa" v-for="q in qa" :key="q[0]"><div><b>{{ q[0] }}</b><small>{{ q[1] }}</small></div><span>&rsaquo;</span></div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.od{display:grid;grid-template-columns:170px 1fr;background:var(--o-bg);border:1px solid var(--o-bd);border-radius:calc(var(--o-r) + 4px);overflow:hidden;font:13px/1.4 var(--o-font);color:var(--o-ink);margin:12px 0;text-align:left}
.od *{box-sizing:border-box}.od p,.od h3{margin:0!important}.od b{font-weight:600}.od small{font-size:11px;color:var(--o-mut)}
.od-side{padding:14px 10px;background:var(--o-surf);border-right:1px solid var(--o-bd);display:flex;flex-direction:column;gap:2px;min-height:560px}
.od-brand{font-weight:700;font-size:16px;display:flex;gap:8px;align-items:center;padding:2px 6px 14px}.od-brand i{width:20px;height:20px;border-radius:6px;background:var(--o-pri)}
.od-nav{display:flex;gap:8px;align-items:center;padding:8px 10px;border-radius:calc(var(--o-r) - 4px);color:var(--o-mut)}.od-nav u{width:12px;height:12px;border:1.5px solid currentColor;border-radius:3px}.od-nav.on{background:var(--o-soft);color:var(--o-ink);font-weight:600}
.od-up{margin-top:auto;padding:12px;border-radius:var(--o-r);background:var(--o-soft);display:flex;flex-direction:column;gap:6px}
.od-btn{background:var(--o-pri);color:var(--o-prit);border-radius:calc(var(--o-r) - 4px);padding:6px 10px;font-weight:600;font-size:12px;text-align:center}
.od-main{padding:12px;min-width:0}.od-top{display:flex;gap:10px;align-items:center;margin-bottom:12px}
.od-search{flex:1;background:var(--o-surf);border:1px solid var(--o-bd);border-radius:calc(var(--o-r) - 2px);padding:8px 12px;color:var(--o-mut);font-size:12px}.od-search kbd{float:right;font:11px var(--o-font)}
.od-pill{border:1px solid var(--o-bd);background:var(--o-surf);border-radius:calc(var(--o-r) - 2px);padding:7px 10px;font-size:12px;white-space:nowrap}
.od-user{display:flex;gap:8px;align-items:center}.od-user i{width:30px;height:30px;border-radius:50%;background:var(--o-soft);border:2px solid var(--o-pri)}.od-user div{display:flex;flex-direction:column;line-height:1.2}
.od-grid{display:grid;grid-template-columns:minmax(0,1fr) 210px;gap:12px}.od-left,.od-right{display:flex;flex-direction:column;gap:12px;min-width:0}
.od-eye{letter-spacing:.1em;font-size:10px}.od-h{font:700 24px/1.15 var(--o-font);color:var(--o-ink);border:0!important}.od-sub{color:var(--o-mut);font-size:12px}
.od-k4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.od-k{background:var(--o-surf);border:1px solid var(--o-bd);border-radius:var(--o-r);padding:10px;display:flex;flex-direction:column;gap:4px;position:relative}.od-k svg{position:absolute;right:8px;bottom:8px}
.od-kl{display:flex;gap:6px;align-items:center;color:var(--o-mut);font-size:11px}.od-kl i{width:14px;height:14px;border-radius:50%;background:var(--o-soft);border:1.5px solid var(--o-pri);flex:none}
.od-kv{font:700 22px var(--o-font)}.od-kf{display:flex;flex-direction:column}.od .up{color:var(--o-ok);font-size:11px}
.od-g2{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:12px}
.od-c{background:var(--o-surf);border:1px solid var(--o-bd);border-radius:var(--o-r);padding:12px;min-width:0}
.od-ct{display:flex;justify-content:space-between;gap:8px;align-items:baseline;margin-bottom:8px;flex-wrap:wrap}.od-link{color:var(--o-pri)!important;font-weight:600}
.od-ch{position:relative}.od-ch svg{display:block;width:100%;height:auto}.od-ch text{fill:var(--o-mut);font:9px var(--o-font)}
.od-tip{position:absolute;top:4px;right:8px;background:var(--o-surf);border:1px solid var(--o-bd);border-radius:8px;padding:6px 9px;font-size:11px;box-shadow:0 4px 14px rgba(0,0,0,.12);pointer-events:none}
.od-row{display:grid;grid-template-columns:28px 1fr auto;gap:8px;align-items:center;padding:7px 0;border-top:1px solid var(--o-bd)}.od-row:first-of-type{border-top:0}.od-row div{display:flex;flex-direction:column;min-width:0}
.od-row i{width:26px;height:26px;border-radius:50%;background:var(--o-soft);border:2px solid var(--o-pri)}.od-row i.ok{border-color:var(--o-ok)}.od-row i.warn{border-color:var(--o-warn)}
.od-tbl table{width:100%;border-collapse:collapse;display:table;margin:0}.od-tbl th{font-size:10px;color:var(--o-mut);text-align:left;font-weight:600;padding:6px;border:0;background:transparent}.od-tbl td{padding:8px 6px;border:0;border-top:1px solid var(--o-bd);font-size:11px;background:transparent;color:var(--o-ink)}.od-tbl tr{background:transparent!important;border:0}
.od-st{border-radius:99px;padding:2px 9px;font-size:10px;font-weight:600;background:var(--o-soft)}.od-st.Success{background:color-mix(in srgb,var(--o-ok) 16%,transparent);color:var(--o-ok)}.od-st.Failed{background:color-mix(in srgb,var(--o-bad) 16%,transparent);color:var(--o-bad)}.od-st.Running{background:var(--o-soft);color:var(--o-pri)}
.od-sm{display:flex;gap:6px;align-items:center;color:var(--o-mut);font-size:11px;margin:4px 0 6px}.od-sm i{width:7px;height:7px;border-radius:50%;background:var(--o-ok)}
.od-rg{display:block;margin:6px auto 10px}.od-rv{font:700 20px var(--o-font);fill:var(--o-ink)}.od-ru{font:11px var(--o-font);fill:var(--o-mut)}
.od-sv{display:flex;justify-content:space-between;padding:7px 0;border-top:1px solid var(--o-bd);font-size:12px}.od-ok{color:var(--o-ok);font-weight:600;font-size:11px}
.od-qa{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-top:1px solid var(--o-bd)}.od-qa div{display:flex;flex-direction:column}.od-qa>span{color:var(--o-mut);font-size:18px}
@media(max-width:1000px){.od{grid-template-columns:1fr}.od-side{display:none}.od-grid{grid-template-columns:1fr}.od-k4{grid-template-columns:repeat(2,minmax(0,1fr))}.od-g2{grid-template-columns:1fr}}
</style>
