<script setup lang="ts">
import { computed, ref } from 'vue'

type Page = 'Overview'|'Jobs'|'Leakage'|'Forecast'|'JobDetail'|'Customers'|'JobTypes'|'Technicians'|'Branches'|'Trends'|'Notifications'|'Settings'|'Help'
const page = ref<Page>('Overview')
const branch = ref('All branches')
const period = ref('Sep 21 to 27')
const notice = ref('')
const query = ref('')
const jobPage = ref(1)
const selectedDot = ref<number|null>(null)
const bridgeMode = ref('Planned vs actual')
const patternIx = ref(0)
const target = ref(38)
const weekStart = ref('Monday')
const dialog = ref<HTMLDialogElement|null>(null)
const dialogJob = ref<Job|null>(null)

function say(msg: string) { notice.value = msg }
function go(p: Page, msg = '') { page.value = p; jobPage.value = 1; selectedDot.value = null; if (msg) say(msg) }

interface Job { id: string; customer: string; type: string; city: string; done: string; revenue: number; profit: number; margin: number; issue: string; status: 'Critical'|'At risk'|'Below target'|'On target' }
const firstJobs: Job[] = [
  { id: '#5812', customer: 'Brookside Apartments', type: 'Compressor replacement', city: 'Dallas', done: 'Sep 22', revenue: 2940, profit: 180, margin: 6.1, issue: 'Labor $610 over', status: 'Critical' },
  { id: '#5807', customer: 'Cedar Park Lofts', type: 'Emergency repair', city: 'Austin', done: 'Sep 21', revenue: 1240, profit: 96, margin: 7.7, issue: 'Parts not billed', status: 'Critical' },
  { id: '#5822', customer: 'Lakeview Dental', type: 'Refrigerant leak repair', city: 'Dallas', done: 'Sep 26', revenue: 980, profit: 86, margin: 8.8, issue: 'Callback visit', status: 'Critical' },
  { id: '#5819', customer: 'ABC Property Group', type: 'AC replacement', city: 'Dallas', done: 'Sep 24', revenue: 3240, profit: 400, margin: 12.3, issue: 'Labor $420 over', status: 'At risk' },
  { id: '#5816', customer: 'ABC Property Group', type: 'Emergency repair', city: 'Dallas', done: 'Sep 23', revenue: 1460, profit: 240, margin: 16.4, issue: 'After-hours not billed', status: 'At risk' },
  { id: '#5815', customer: 'Lakeview Dental', type: 'Emergency repair', city: 'Dallas', done: 'Sep 23', revenue: 860, profit: 170, margin: 19.8, issue: 'Labor $210 over', status: 'At risk' },
  { id: '#5813', customer: 'Garza residence', type: 'Furnace repair', city: 'Houston', done: 'Sep 22', revenue: 1120, profit: 246, margin: 22.0, issue: 'Discount $120', status: 'At risk' }
]
const extraTypes = ['AC replacement','Emergency repair','Compressor replacement','Refrigerant leak repair','Furnace repair','Duct sealing','Thermostat install']
const extraCustomers = ['ABC Property Group','Brookside Apartments','Lakeview Dental','Cedar Park Lofts','Garza residence','Molina Bakery','Sunset Retail','Harbor Offices']
const extraCities = ['Dallas','Austin','Houston']
const extraIssues = ['Labor $180 over','Materials $90 over','Discount $75','Callback visit','On plan','On plan','After-hours not billed']
function makeJob(i: number): Job {
  // Distribution mirrors the source design: 3 critical, 12 at risk, 42 below target, 94 on target (plus the 7 named rows)
  let margin: number
  if (i < 3) margin = Math.round((7.2 + i * 0.9) * 10) / 10
  else if (i < 15) margin = Math.round((10.5 + (i - 3)) * 10) / 10
  else if (i < 57) margin = (23 + (i - 15) % 11)
  else margin = (34 + (i - 57) % 22)
  const revenue = 700 + (i * 431 % 2600)
  const status: Job['status'] = margin < 10 ? 'Critical' : margin < 22 ? 'At risk' : margin < 34 ? 'Below target' : 'On target'
  return { id: '#' + (5811 - i), customer: extraCustomers[i % 8], type: extraTypes[i % 7], city: extraCities[i % 3], done: 'Sep ' + (21 + (i % 7)), revenue, profit: Math.round(revenue * margin / 100), margin, issue: extraIssues[i % 7], status }
}
const jobs = ref<Job[]>([...firstJobs, ...Array.from({ length: 151 }, (_, i) => makeJob(i))])

const filteredJobs = computed(() => jobs.value
  .filter(j => branch.value === 'All branches' || j.city === branch.value)
  .filter(j => !query.value || (j.id + ' ' + j.customer + ' ' + j.type).toLowerCase().includes(query.value.toLowerCase()))
  .slice().sort((a, b) => a.margin - b.margin))
const pagedJobs = computed(() => filteredJobs.value.slice((jobPage.value - 1) * 7, jobPage.value * 7))
const jobPages = computed(() => Math.max(1, Math.ceil(filteredJobs.value.length / 7)))

// Beeswarm dots: one dot per job, x = margin, stacked per rounded bucket
const dots = computed(() => {
  const stacks: Record<number, number> = {}
  return jobs.value.map(j => {
    const bx = Math.min(58, Math.max(1, Math.round(j.margin)))
    stacks[bx] = (stacks[bx] || 0) + 1
    return { job: j, x: bx, y: stacks[bx] }
  })
})
const dotColor = (s: Job['status']) => s === 'Critical' ? '#e5488c' : s === 'At risk' ? '#f79009' : s === 'Below target' ? '#4f7cff' : '#3aa981'

// Gross margin waterfall (Overview) - reacts to the Settings target
const leakCauses = [
  { label: 'Labor overruns', pts: 1.6, money: 7.7 },
  { label: 'Material variance', pts: 1.1, money: 5.3 },
  { label: 'Callbacks', pts: 0.7, money: 3.4 },
  { label: 'Discounting', pts: 0.4, money: 1.9 },
  { label: 'Other', pts: 0.2, money: 1.0 }
]
const actualMargin = 34.0
const gapPts = computed(() => Math.max(0, Math.round((target.value - actualMargin) * 10) / 10))
const gapMoney = computed(() => Math.round(gapPts.value * 4.83 * 10) / 10)

// Pattern insight carousel (1 of 3)
const patterns = [
  { chip: 'Pattern found', big: '8.2 pts', aside: 'under estimate over 60 days', title: 'Compressor replacements are losing margin', body: 'Labor runs 34% over the quote on 29 jobs, most of them Dallas installs.', cta: 'Review 29 jobs', dest: 'Jobs' as Page },
  { chip: 'Pattern found', big: '6.4%', aside: 'of jobs need a return visit', title: 'Callbacks on refrigerant repairs', body: '71% of return visits happen within 7 days of the first visit. 17 jobs affected.', cta: 'Review 17 jobs', dest: 'Leakage' as Page },
  { chip: 'Pattern found', big: '$3.6K', aside: 'billed at the wrong rate', title: 'After-hours work not billed', body: '23 emergency jobs finished after 6 pm were billed at the day rate.', cta: 'Fix billing rule', dest: 'Leakage' as Page }
]
function nextPattern(d: number) { patternIx.value = (patternIx.value + d + patterns.length) % patterns.length }

// Last 12 weeks
const weeks = [36.1, 35.4, 35.8, 34.9, 34.3, 33.7, 34.4, 33.9, 33.4, 33.8, 34.3, 34.0]
const weekLabels = ['Jul 6','Jul 13','Jul 20','Jul 27','Aug 3','Aug 10','Aug 17','Aug 24','Aug 31','Sep 7','Sep 14','Sep 21']

// Needs you
const needs = [
  { icon: '!', tone: 'pink', title: '6 jobs under 10% margin', sub: '#5812 Brookside is lowest at 6.1%', dest: 'Jobs' as Page },
  { icon: '$', tone: 'amber', title: '2 discount requests', sub: 'Waiting for your OK, up to 10%', dest: 'Notifications' as Page },
  { icon: '◎', tone: 'blue', title: 'Dallas is 6.9 pts under target', sub: '31.1% on $196K revenue', dest: 'Branches' as Page },
  { icon: '↺', tone: 'slate', title: 'Callbacks rose to 6.4% of jobs', sub: 'Up 1.1 pts since August', dest: 'Leakage' as Page }
]

// Leakage heatmap
const heatCols = [
  { name: 'Labor', total: 31.2 }, { name: 'Materials', total: 18.7 }, { name: 'Callbacks', total: 14.4 }, { name: 'Discounts', total: 9.8 }, { name: 'Unbilled', total: 8.3 }
]
const heatRows = [
  { name: 'Dallas', cells: [14.8, 7.9, 6.8, 3.1, 3.6], total: 36.2 },
  { name: 'Austin', cells: [9.2, 5.1, 3.9, 4.2, 1.9], total: 24.3 },
  { name: 'Houston', cells: [7.2, 5.7, 3.7, 2.5, 2.8], total: 21.9 }
]
const heatClass = (v: number) => v >= 13 ? 'h4' : v >= 7 ? 'h3' : v >= 4 ? 'h2' : 'h1'
const visibleHeatRows = computed(() => branch.value === 'All branches' ? heatRows : heatRows.filter(r => r.name === branch.value))

const actions = [
  { rank: 1, icon: '!', title: 'Labor overruns on Dallas installs', stake: 8.2, delta: 2.1, jobs: 29, note: 'Installs take 8.2 h against 6.1 h estimated.', cta: 'Trace it', dest: 'Jobs' as Page, dark: true },
  { rank: 2, icon: '↺', title: 'Callbacks on refrigerant repairs', stake: 4.1, delta: 0.9, jobs: 17, note: '71% of return visits happen within 7 days of the first visit.', cta: 'Review 17 jobs', dest: 'Jobs' as Page, dark: false },
  { rank: 3, icon: '▤', title: 'After-hours work not billed', stake: 3.6, delta: 1.2, jobs: 23, note: '23 emergency jobs finished after 6 pm were billed at the day rate.', cta: 'Fix billing rule', dest: 'Settings' as Page, dark: false }
]

// Forecast scenarios
const scenLabor = ref(true), scenMaterials = ref(false), scenCallbacks = ref(false), scenDiscounts = ref(false)
const scenarios = computed(() => [
  { on: scenLabor.value, pts: 1.5, money: 27.6, title: 'Keep labor on estimate', desc: 'Price installs at 7.8 h and hold emergency jobs to the quote.', toggle: scenLabor },
  { on: scenMaterials.value, pts: 0.7, money: 12.9, title: 'Hold material prices', desc: 'Pass the March price rise into the price book.', toggle: scenMaterials },
  { on: scenCallbacks.value, pts: 0.4, money: 7.0, title: 'Bring callbacks to 4%', desc: 'Add the drain line check to every handover.', toggle: scenCallbacks },
  { on: scenDiscounts.value, pts: 0.2, money: 3.7, title: 'Cap discounts at 5%', desc: 'Requests above 5% go to the owner for approval.', toggle: scenDiscounts }
])
const gainedPts = computed(() => Math.round(scenarios.value.reduce((a, s) => a + (s.on ? s.pts : 0), 0) * 10) / 10)
const gainedMoney = computed(() => Math.round(scenarios.value.reduce((a, s) => a + (s.on ? s.money : 0), 0) * 10) / 10)
const withChanges = computed(() => (35.2 + gainedPts.value).toFixed(1))
const gapAfter = computed(() => Math.max(0, 51 - gainedMoney.value).toFixed(1))

const months = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const actualSeries = [32.8, 34.2, 34.9, 34.3, 33.9, 33.6]
const currentPath = [34.8, 35.4, 36.0]
const chartX = (i: number) => 46 + i * 52
const chartY = (v: number) => 170 - (v - 29) * 14
const actualPath = computed(() => actualSeries.map((v, i) => (i ? 'L' : 'M') + chartX(i) + ' ' + chartY(v)).join(' '))
const currentPathD = computed(() => currentPath.map((v, i) => (i ? 'L' : 'M') + chartX(i + 5) + ' ' + chartY(v)).join(' '))
const changesPath = computed(() => {
  const vals = [35.2 + gainedPts.value, 35.4 + gainedPts.value * 1.1, 36.0 + gainedPts.value * 1.2]
  return vals.map((v, i) => (i ? 'L' : 'M') + chartX(i + 5) + ' ' + chartY(v)).join(' ')
})
const changesPts = computed(() => [35.2 + gainedPts.value, 35.4 + gainedPts.value * 1.1, 36.0 + gainedPts.value * 1.2])

// Profit bridge
const bridge = [
  { label: 'Planned profit', value: 1260, delta: 0, note: '' },
  { label: 'After discount', value: 1000, delta: 260, note: '-$260 discount' },
  { label: 'After labor', value: 740, delta: 260, note: '-$260 labor overrun' },
  { label: 'After callback', value: 500, delta: 240, note: '-$240 callback' },
  { label: 'Actual profit', value: 400, delta: 100, note: '-$100 materials' }
]
const costStack = [
  { label: 'Labor', value: 1480 }, { label: 'Materials', value: 860 }, { label: 'Callback cost', value: 240 }, { label: 'Other costs', value: 260 }, { label: 'Profit kept', value: 400 }
]
const bridgeCauses = [
  { icon: '▤', money: '-$260', title: 'Discount', desc: '7.4% off the quote, approved by Dana Whitfield. Contract work allows 5%.', cta: 'Review discount rules' },
  { icon: '◔', money: '-$260', title: 'Labor overrun', desc: 'The install took 10.6 h against 7.5 h planned. Older building, extra duct work.', cta: 'See install estimates' },
  { icon: '↺', money: '-$240', title: 'Callback', desc: 'Return visit on Sep 26. The drain line was not cleared at handover.', cta: 'Add to handover checklist' },
  { icon: '▦', money: '-$100', title: 'Materials', desc: 'Longer line set and extra refrigerant. Parts cost rose 8% in March.', cta: 'Update price book' }
]

// Analyze pages data
const customers = computed(() => {
  const map: Record<string, { name: string; jobs: number; revenue: number; profit: number }> = {}
  jobs.value.forEach(j => { const c = map[j.customer] = map[j.customer] || { name: j.customer, jobs: 0, revenue: 0, profit: 0 }; c.jobs++; c.revenue += j.revenue; c.profit += j.profit })
  return Object.values(map).sort((a, b) => b.revenue - a.revenue).map(c => ({ ...c, margin: Math.round(c.profit / c.revenue * 1000) / 10 }))
})
const jobTypes = computed(() => {
  const map: Record<string, { name: string; jobs: number; revenue: number; profit: number }> = {}
  jobs.value.forEach(j => { const t = map[j.type] = map[j.type] || { name: j.type, jobs: 0, revenue: 0, profit: 0 }; t.jobs++; t.revenue += j.revenue; t.profit += j.profit })
  return Object.values(map).sort((a, b) => a.profit / a.revenue - b.profit / b.revenue).map(t => ({ ...t, margin: Math.round(t.profit / t.revenue * 1000) / 10 }))
})
const technicians = [
  { name: 'Marcus Webb', role: 'Install lead', jobs: 34, variance: '+18%', callbacks: 2, margin: 31.2 },
  { name: 'Priya Nair', role: 'Senior tech', jobs: 29, variance: '+4%', callbacks: 1, margin: 37.8 },
  { name: 'Dana Whitfield', role: 'Tech + approvals', jobs: 26, variance: '+9%', callbacks: 3, margin: 33.5 },
  { name: 'Luis Herrera', role: 'Apprentice', jobs: 21, variance: '+26%', callbacks: 4, margin: 27.4 },
  { name: 'Sam Okafor', role: 'Senior tech', jobs: 19, variance: '-2%', callbacks: 0, margin: 39.6 }
]
const branchesData = [
  { name: 'Dallas', margin: 31.1, revenue: 196, leakage: 36.2, delta: -6.9, jobs: 64 },
  { name: 'Austin', margin: 36.8, revenue: 152, leakage: 24.3, delta: -1.2, jobs: 51 },
  { name: 'Houston', margin: 37.9, revenue: 134, leakage: 21.9, delta: -0.1, jobs: 43 }
]

const notifications = [
  ...needs.map(n => ({ title: n.title, sub: n.sub, time: 'This week', dest: n.dest })),
  { title: 'Export ready: September leakage report', sub: 'Generated locally at 9:12', time: 'Today', dest: 'Leakage' as Page },
  { title: 'Price book review due', sub: 'Materials rose 8% since March', time: 'Yesterday', dest: 'Settings' as Page }
]

function openJob(j: Job) { dialogJob.value = j; dialog.value?.showModal() }
function reviewJob(j: Job) { dialog.value?.close(); page.value = 'JobDetail' }
function exportCsv() {
  const rows = [['Job','Customer','Type','Branch','Completed','Revenue','Profit','Margin %','Main issue','Status'], ...filteredJobs.value.map(j => [j.id, j.customer, j.type, j.city, j.done, j.revenue, j.profit, j.margin, j.issue, j.status])]
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = 'margin-jobs-demo.csv'; a.click(); URL.revokeObjectURL(a.href)
  say('Demo CSV exported locally. No data leaves this page.')
}
function onSearch() { if (query.value) { go('Jobs'); say(`Filtering jobs by “${query.value}”.`) } }
const pageTitle: Record<Page, string> = { Overview: 'Overview', Jobs: 'Jobs', Leakage: 'Leakage', Forecast: 'Forecast', JobDetail: 'Job detail', Customers: 'Customers', JobTypes: 'Job types', Technicians: 'Technicians', Branches: 'Branches', Trends: 'Trends', Notifications: 'Notifications', Settings: 'Settings', Help: 'Help' }
</script>
<template>
<section class="reference-dashboard margin" aria-label="Margin profitability analytics demo">
  <aside class="mg-sidebar">
    <div class="mg-brand"><span class="mg-logo" aria-hidden="true">◺</span> margin <span class="mg-collapse" aria-hidden="true">⇤</span></div>
    <div class="mg-search">
      <input class="form-control" v-model="query" type="search" aria-label="Search jobs or customers" placeholder="Search" @keydown.enter="onSearch">
      <kbd>⌘K</kbd>
    </div>
    <nav aria-label="Margin sections">
      <button v-for="item in (['Overview','Jobs','Leakage','Forecast'] as Page[])" :key="item" class="mg-nav" :class="{active:page===item||(item==='Jobs'&&page==='JobDetail')}" :aria-current="page===item?'page':undefined" @click="go(item)">
        <span class="mg-ic" aria-hidden="true">{{ {Overview:'▦',Jobs:'▤',Leakage:'◨',Forecast:'◔'}[item] }}</span>{{ item }}
      </button>
      <small class="mg-group">Analyze</small>
      <button v-for="item in (['Customers','JobTypes','Technicians','Branches','Trends'] as Page[])" :key="item" class="mg-nav" :class="{active:page===item}" :aria-current="page===item?'page':undefined" @click="go(item)">
        <span class="mg-ic" aria-hidden="true">{{ {Customers:'♦',JobTypes:'▥',Technicians:'⚒',Branches:'◎',Trends:'↗'}[item] }}</span>{{ pageTitle[item] }}
      </button>
      <button class="mg-nav mg-low" :class="{active:page==='Notifications'}" @click="go('Notifications')"><span class="mg-ic" aria-hidden="true">◌</span>Notifications <span class="mg-badge">3</span></button>
      <button class="mg-nav mg-low" :class="{active:page==='Settings'}" @click="go('Settings')"><span class="mg-ic" aria-hidden="true">⚙</span>Settings</button>
      <button class="mg-nav mg-low" :class="{active:page==='Help'}" @click="go('Help')"><span class="mg-ic" aria-hidden="true">?</span>Help</button>
    </nav>
    <div class="mg-profile"><span class="ref-avatar">NZ</span><div><strong>Nizam</strong><small>Owner · Brazos Air (demo)</small></div><button class="mg-ghost" aria-label="Account options" @click="say('Demo account menu. No real account connected.')">…</button></div>
  </aside>

  <main class="mg-main">
    <header class="mg-topbar">
      <h2>{{ page === 'JobDetail' ? 'Where the profit went' : pageTitle[page] }}</h2>
      <div class="mg-top-actions">
        <template v-if="page==='Forecast'">
          <button class="mg-chip active" @click="say('October scenario shown. Demo only.')">October</button>
          <button class="mg-chip" @click="say('Q4 view is illustrative in this demo.')">Q4</button>
          <button class="mg-chip" @click="say('Share link would copy in the real product. Demo only.')">⤴ Share</button>
          <button class="mg-primary" @click="say(`Scenario saved locally: +${gainedPts} pts, gap down to $${gapAfter}K. Demo only.`)">Save scenario</button>
        </template>
        <template v-else-if="page==='JobDetail'">
          <button class="mg-chip" :class="{active:bridgeMode==='Planned vs actual'}" @click="bridgeMode='Planned vs actual'">Planned vs actual</button>
          <button class="mg-chip" :class="{active:bridgeMode==='Full cost stack'}" @click="bridgeMode='Full cost stack'">Full cost stack</button>
          <button class="mg-chip" @click="say('Share link would copy in the real product. Demo only.')">⤴ Share</button>
        </template>
        <template v-else>
          <select class="mg-chip mg-select" v-model="period" aria-label="Reporting period">
            <option>Sep 21 to 27</option><option>Sep 14 to 20</option><option>Sep 1 to 27</option>
          </select>
          <span class="mg-vs">vs {{ period === 'Sep 21 to 27' ? 'Sep 14 to 20' : period === 'Sep 14 to 20' ? 'Sep 7 to 13' : 'Aug 1 to 27' }}</span>
          <select class="mg-chip mg-select" v-model="branch" aria-label="Branch filter">
            <option>All branches</option><option>Dallas</option><option>Austin</option><option>Houston</option>
          </select>
          <button class="mg-chip" @click="exportCsv">⤓ Export</button>
        </template>
      </div>
    </header>

    <div class="mg-mobile-nav"><label>Section <select class="form-control" :value="page" aria-label="Section" @change="go(($event.target as HTMLSelectElement).value as Page)"><option v-for="(t,k) in pageTitle" :key="k" :value="k">{{ t }}</option></select></label></div>

    <!-- ================= OVERVIEW ================= -->
    <template v-if="page==='Overview'">
      <div class="mg-grid-overview">
        <article class="mg-card mg-kpi">
          <div class="mg-card-head"><div><h3>Gross margin</h3><small>Week of Sep 21 to 27</small></div><button class="mg-ghost" aria-label="Gross margin options" @click="say('Card options are decorative in this demo.')">…</button></div>
          <p class="mg-big">34.0%</p>
          <p class="mg-delta down">▼ 1.2 pts <span>vs last week</span></p>
          <p class="mg-note">{{ gapPts }} pts under the {{ target.toFixed(1) }}% target. ${{ gapMoney }}K of profit lost against target this week.</p>
          <div class="mg-progress" role="img" :aria-label="`Margin at 34%, ${gapPts} points under the ${target}% target`"><i :style="{width:(actualMargin/target*100)+'%'}"></i></div>
          <small class="mg-progress-label">{{ Math.round(actualMargin/target*100) }}% of target</small>
          <dl class="mg-rows">
            <div><dt>Revenue</dt><dd>$482K <b class="up">▲ 6.2%</b></dd></div>
            <div><dt>Gross profit</dt><dd>$164K <b class="up">▲ 2.5%</b></dd></div>
            <div><dt>Jobs completed</dt><dd>158</dd></div>
          </dl>
        </article>

        <article class="mg-card mg-waterfall">
          <div class="mg-card-head"><div><h3>Why it is under target</h3><small>{{ gapPts }} points lost against the {{ target }}% target</small></div><button class="mg-link" @click="go('Leakage')">Leakage →</button></div>
          <div class="mg-wf" role="img" :aria-label="`Waterfall from ${target}% target down to 34% actual, driven by labor overruns and material variance`">
            <div class="mg-wf-row"><span class="mg-wf-label">Target</span><div class="mg-wf-track"><i class="mg-wf-bar hatch" :style="{width:(target/40*100)+'%'}"></i></div><span class="mg-wf-val">{{ target.toFixed(1) }}%</span></div>
            <div class="mg-wf-row" v-for="c in leakCauses" :key="c.label"><span class="mg-wf-label">{{ c.label }}</span><div class="mg-wf-track"><i class="mg-wf-bar leak" :style="{width:(c.pts/40*100)+'%',marginLeft:((target-c.pts)/40*100)+'%'}"></i></div><span class="mg-wf-val pink">-{{ c.pts }} pts · -${{ c.money }}K</span></div>
            <div class="mg-wf-row"><span class="mg-wf-label">Actual</span><div class="mg-wf-track"><i class="mg-wf-bar solid" :style="{width:(actualMargin/40*100)+'%'}"></i></div><span class="mg-wf-val">{{ actualMargin.toFixed(1) }}%</span></div>
          </div>
          <p class="mg-callout">Labor and materials explain two thirds of the gap. Both trace back to installs in Dallas.</p>
        </article>

        <article class="mg-card mg-pattern">
          <div class="mg-card-head"><span class="mg-chip-dark">✦ {{ patterns[patternIx].chip }}</span><span class="mg-count">{{ patternIx+1 }} of {{ patterns.length }}</span></div>
          <p class="mg-pattern-big">{{ patterns[patternIx].big }} <small>{{ patterns[patternIx].aside }}</small></p>
          <h3>{{ patterns[patternIx].title }}</h3>
          <p>{{ patterns[patternIx].body }}</p>
          <div class="mg-pattern-actions">
            <button class="mg-light" @click="go(patterns[patternIx].dest)">{{ patterns[patternIx].cta }} →</button>
            <span class="mg-pager"><button aria-label="Previous pattern" @click="nextPattern(-1)">‹</button><button aria-label="Next pattern" @click="nextPattern(1)">›</button></span>
          </div>
        </article>

        <article class="mg-card mg-weeks">
          <div class="mg-card-head"><h3>Last 12 weeks</h3><small>Margin by week</small></div>
          <div class="mg-bars" role="img" aria-label="Weekly margin from 36.1% down to 34.0% over 12 weeks, target 34%">
            <div class="mg-target-line"><span>Target 34%</span></div>
            <button v-for="(w,i) in weeks" :key="i" class="mg-bar" :class="{last:i===weeks.length-1}" :style="{height:(w/40*100)+'%'}" :aria-label="`Week of ${weekLabels[i]}: ${w}%`" @click="say(`Week of ${weekLabels[i]} closed at ${w}%. Demo data.`)"><b v-if="i===weeks.length-1">34.0</b></button>
          </div>
          <div class="mg-bar-labels"><span>{{ weekLabels[0] }}</span><span>{{ weekLabels[11] }}</span></div>
        </article>

        <article class="mg-card mg-needs">
          <div class="mg-card-head"><div><h3>Needs you</h3><small>4 things this week</small></div><button class="mg-ghost" aria-label="Needs you options" @click="say('Card options are decorative in this demo.')">…</button></div>
          <button v-for="n in needs" :key="n.title" class="mg-need" @click="go(n.dest)">
            <span class="mg-need-ic" :class="n.tone" aria-hidden="true">{{ n.icon }}</span>
            <span class="mg-need-tx"><strong>{{ n.title }}</strong><small>{{ n.sub }}</small></span>
            <span class="mg-chev" aria-hidden="true">›</span>
          </button>
        </article>
      </div>
    </template>
    <!-- ================= JOBS ================= -->
    <template v-else-if="page==='Jobs'">
      <article class="mg-card mg-swarm-card">
        <div class="mg-card-head"><div><h3>{{ filteredJobs.length }} jobs by margin</h3><small>One dot per job completed this week</small></div>
          <div class="mg-legend"><span><i class="dot" style="background:#e5488c"></i>Critical {{ jobs.filter(j=>j.status==='Critical').length }}</span><span><i class="dot" style="background:#f79009"></i>At risk {{ jobs.filter(j=>j.status==='At risk').length }}</span><span><i class="dot" style="background:#4f7cff"></i>Below target {{ jobs.filter(j=>j.status==='Below target').length }}</span><span><i class="dot" style="background:#3aa981"></i>On target {{ jobs.filter(j=>j.status==='On target').length }}</span></div>
        </div>
        <div class="mg-swarm" role="img" :aria-label="`Dot plot of ${filteredJobs.length} jobs by margin, most between 30 and 45 percent`">
          <button v-for="(d,i) in dots" :key="d.job.id" class="mg-dot" :class="{sel:selectedDot===i}" :style="{left:'calc('+(d.x/60*100)+'% - 4px)',bottom:'calc('+(d.y*9)+'px)'}" :title="d.job.id+' '+d.job.margin+'%'" :aria-label="`Job ${d.job.id}, margin ${d.job.margin} percent, ${d.job.customer}`" :tabindex="d.job.margin<23?0:-1" @click="selectedDot=i" @keydown.enter="selectedDot=i" :data-c="dotColor(d.job.status)"></button>
          <div v-if="selectedDot!==null" class="mg-swarm-tip" :style="{left:'min(70%, calc('+(dots[selectedDot].x/60*100)+'% - 30px))'}">
            <strong>{{ dots[selectedDot].job.id }} · {{ dots[selectedDot].job.margin }}%</strong>
            <span>{{ dots[selectedDot].job.customer }}</span>
            <button class="mg-link" @click="reviewJob(dots[selectedDot].job)">Open profit bridge →</button>
          </div>
        </div>
        <div class="mg-axis"><span v-for="v in [0,10,20,30,40,50,60]" :key="v">{{ v }}%</span></div>
      </article>

      <article class="mg-card mg-table-card">
        <div class="mg-card-head"><h3>Lowest margin first</h3>
          <div class="mg-tools">
            <input class="form-control" type="search" v-model="query" aria-label="Search jobs or customers" placeholder="Search jobs or customers">
            <button class="mg-chip" @click="say('Demo filters: the table is already sorted lowest margin first; use the branch filter above.')">⤡ Filters</button>
          </div>
        </div>
        <div class="ref-table-scroll"><table>
          <thead><tr><th>Job</th><th>Customer</th><th>Completed</th><th class="number">Revenue</th><th class="number">Profit</th><th>Margin</th><th>Main issue</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="j in pagedJobs" :key="j.id" :class="{hl:j.id==='#5819'}">
              <td><button class="mg-link strong" @click="openJob(j)">{{ j.id }}</button><small class="mg-sub">{{ j.type }}</small></td>
              <td>{{ j.customer }}<small class="mg-sub">{{ j.city }}</small></td>
              <td>{{ j.done }}</td>
              <td class="number">${{ j.revenue.toLocaleString('en-US') }}</td>
              <td class="number">${{ j.profit.toLocaleString('en-US') }}</td>
              <td><span class="mg-marginbar"><i :style="{width:Math.min(100,j.margin/40*100)+'%'}"></i></span>{{ j.margin.toFixed(1) }}%</td>
              <td>{{ j.issue }}</td>
              <td><span class="mg-status" :class="j.status.replace(' ','-').toLowerCase()">● {{ j.status }}</span></td>
            </tr>
          </tbody>
        </table></div>
        <p v-if="!pagedJobs.length" class="mg-empty">No jobs match this filter.</p>
        <div class="mg-pagination">
          <span>Showing {{ pagedJobs.length }} of {{ filteredJobs.length }} jobs</span>
          <nav aria-label="Jobs pages">
            <button :disabled="jobPage<=1" aria-label="Previous page" @click="jobPage--">‹</button>
            <button v-for="p in Math.min(jobPages,3)" :key="p" :class="{active:jobPage===p}" :aria-current="jobPage===p?'page':undefined" @click="jobPage=p">{{ p }}</button>
            <span v-if="jobPages>3">…</span>
            <button v-if="jobPages>3" :class="{active:jobPage===jobPages}" @click="jobPage=jobPages">{{ jobPages }}</button>
            <button :disabled="jobPage>=jobPages" aria-label="Next page" @click="jobPage++">›</button>
          </nav>
        </div>
      </article>
    </template>

    <!-- ================= LEAKAGE ================= -->
    <template v-else-if="page==='Leakage'">
      <div class="mg-grid-leak">
        <article class="mg-card">
          <div class="mg-card-head"><div><h3>Profit leaked</h3><small>4.4 pts of margin on $1.86M revenue</small></div><button class="mg-ghost" aria-label="Profit leaked options" @click="say('Card options are decorative in this demo.')">…</button></div>
          <p class="mg-big">$82.4K</p>
          <p class="mg-delta up-bad">▲ $8.3K <span>vs the same days in August</span></p>
          <div class="mg-days" role="img" aria-label="Daily leakage dots, peaking at $23.4K on September 7">
            <i v-for="d in 62" :key="d" :class="{sep:d>31,peak:d===38}" :style="{opacity:.35+((d*13)%10)/14}"></i>
            <span class="mg-days-tip">Peak <b>Sep 7</b> · $23.4K</span>
          </div>
          <div class="mg-bar-labels"><span>August</span><span>September</span></div>
        </article>

        <article class="mg-card mg-heat-card">
          <div class="mg-card-head"><div><h3>Where it leaks</h3><small>By branch and cause, September to date</small></div>
            <div class="mg-legend"><span><i class="dot h1"></i>Under $4K</span><span><i class="dot h2"></i>$4K to 7K</span><span><i class="dot h3"></i>$7K to 13K</span><span><i class="dot h4"></i>$13K and up</span></div>
          </div>
          <div class="ref-table-scroll"><table class="mg-heat">
            <thead><tr><th></th><th v-for="c in heatCols" :key="c.name">{{ c.name }}<small>${{ c.total }}K</small></th><th>Total</th></tr></thead>
            <tbody>
              <tr v-for="r in visibleHeatRows" :key="r.name">
                <th>{{ r.name }}</th>
                <td v-for="(v,i) in r.cells" :key="i"><span class="mg-cell" :class="heatClass(v)">${{ v }}K</span></td>
                <td class="number"><strong>${{ r.total }}K</strong></td>
              </tr>
            </tbody>
          </table></div>
          <p class="mg-callout">Dallas carries 44% of September leakage on 41% of revenue. Labor in Dallas alone is $14.8K.</p>
        </article>
      </div>

      <article class="mg-card">
        <div class="mg-card-head"><div><h3>Where to act first</h3><small>The three patterns with the most profit at stake</small></div><button class="mg-ghost" aria-label="Actions options" @click="say('Card options are decorative in this demo.')">…</button></div>
        <div class="mg-actions">
          <div v-for="a in actions" :key="a.rank" class="mg-action">
            <div class="mg-action-head"><span class="mg-need-ic pink" aria-hidden="true">{{ a.icon }}</span><span class="mg-rank">{{ a.rank }}</span></div>
            <h4>{{ a.title }}</h4>
            <p class="mg-stake">${{ a.stake }}K <small>at stake this month</small></p>
            <p class="mg-delta up-bad">▲ ${{ a.delta }}K <span>more than in August</span></p>
            <div class="mg-minidots" role="img" :aria-label="a.jobs+' jobs affected'"><i v-for="d in a.jobs" :key="d"></i><b>{{ a.jobs }} jobs</b></div>
            <p class="mg-note">{{ a.note }}</p>
            <button :class="a.dark?'mg-primary':'mg-chip'" @click="go(a.dest)">{{ a.cta }} →</button>
          </div>
        </div>
      </article>
    </template>
    <!-- ================= FORECAST ================= -->
    <template v-else-if="page==='Forecast'">
      <div class="mg-fc-kpis">
        <article class="mg-card mg-fc-kpi"><small>Projected margin</small><strong>35.2%</strong><p>Likely 34.1 to 36.3%</p></article>
        <article class="mg-card mg-fc-kpi"><small>Projected revenue</small><strong>$1.84M</strong><p>$612K already booked</p></article>
        <article class="mg-card mg-fc-kpi"><small>Gap to target</small><strong class="pink">$51K</strong><p>{{ (38-35.2).toFixed(1) }} pts under the 38% target</p></article>
        <article class="mg-card mg-fc-kpi"><small>With your changes</small><strong class="green">{{ withChanges }}%</strong><p>▲ {{ gainedPts }} pts · Gap down to ${{ gapAfter }}K</p></article>
      </div>
      <article class="mg-card">
        <div class="mg-card-head"><div><h3>Margin outlook</h3><small>Actual through September, forecast to December</small></div>
          <div class="mg-legend"><span><i class="ln solid-b"></i>Actual</span><span><i class="ln dash-b"></i>Current path</span><span><i class="ln solid-g"></i>With your changes</span><span><i class="ln band"></i>Likely range</span></div>
        </div>
        <svg class="mg-fc-chart" viewBox="0 0 520 200" role="img" :aria-label="`Margin actual through September at 33.6%, current path to 36% in December, with your changes to ${changesPts[2].toFixed(1)}%`">
          <g class="grid"><path d="M40 30 H505 M40 72 H505 M40 114 H505 M40 156 H505"/></g>
          <g class="ylabels"><text x="8" y="34">40%</text><text x="8" y="76">38%</text><text x="8" y="118">34%</text><text x="8" y="160">30%</text></g>
          <path class="range" d="M306 60 L358 52 L410 46 L410 100 L358 108 L306 116 Z"/>
          <path class="line-b" :d="actualPath"/>
          <path class="line-b dash" :d="currentPathD"/>
          <path class="line-g" :d="changesPath"/>
          <g class="pts-b"><circle v-for="(v,i) in actualSeries" :key="'a'+i" :cx="chartX(i)" :cy="chartY(v)" r="3.5"/></g>
          <g class="pts-open"><circle v-for="(v,i) in currentPath" :key="'c'+i" :cx="chartX(i+5)" :cy="chartY(v)" r="3.5"/></g>
          <g class="pts-g"><circle v-for="(v,i) in changesPts" :key="'g'+i" :cx="chartX(i+5)" :cy="chartY(v)" r="3.5"/></g>
          <g class="xlabels"><text v-for="(m,i) in months" :key="m" :x="chartX(i)" y="190">{{ m }}</text></g>
          <g class="mg-fc-tip"><rect x="270" y="26" width="180" height="30" rx="6"/><text x="282" y="45">October <tspan class="tb">35.2%</tspan> on the current path · <tspan class="tg">{{ withChanges }}%</tspan> with changes</text></g>
        </svg>
      </article>
      <div class="mg-scenarios">
        <article v-for="(s,i) in scenarios" :key="s.title" class="mg-card mg-scenario" :class="{on:s.on}">
          <div class="mg-scen-head">
            <span class="mg-need-ic" :class="s.on?'green':'slate'" aria-hidden="true">{{ ['✓','▤','↺','$'][i] }}</span>
            <label class="mg-switch"><input type="checkbox" v-model="s.toggle.value" :aria-label="'Toggle scenario: '+s.title"><span></span></label>
          </div>
          <h4>{{ s.title }}</h4>
          <p class="mg-scen-pts">+{{ s.pts }} pts <small>${{ s.money }}K a month</small></p>
          <div class="mg-progress mini" role="img" :aria-label="s.pts+' points of 2.8 recoverable'"><i :style="{width:(s.pts/2.8*100)+'%'}"></i></div>
          <p class="mg-note">{{ s.desc }}</p>
        </article>
      </div>
    </template>

    <!-- ================= JOB DETAIL / PROFIT BRIDGE ================= -->
    <template v-else-if="page==='JobDetail'">
      <p class="mg-crumbs"><button class="mg-link" @click="go('Jobs')">Jobs</button> › <button class="mg-link" @click="say('Job #5819 detail tabs are illustrative.')">#5819</button> › Profit bridge</p>
      <p class="mg-subtitle">Job #5819 · AC replacement · ABC Property Group</p>
      <article class="mg-card">
        <div class="mg-card-head"><div><h3>Planned $1,260, kept $400</h3><small>$860 of planned profit leaked in four places</small></div>
          <div class="mg-legend"><span><i class="dot hatch-b"></i>Profit left</span><span><i class="dot hatch-p"></i>Leaked</span><span><i class="dot solid-bb"></i>Kept</span></div>
        </div>
        <div v-if="bridgeMode==='Planned vs actual'" class="mg-bridge" role="img" aria-label="Waterfall: planned profit $1,260, minus discount $260, labor overrun $260, callback $240, materials $100, actual profit kept $400">
          <div v-for="(b,i) in bridge" :key="b.label" class="mg-bridge-col">
            <p class="mg-bridge-val">${{ b.value.toLocaleString('en-US') }}<small v-if="b.note" class="pink">{{ b.note }}</small></p>
            <div class="mg-bridge-bar" :style="{height:(b.value/1260*180)+'px'}">
              <i v-if="b.delta" class="leak" :style="{height:(b.delta/b.value*100)+'%'}"></i>
              <i class="keep" :class="{solid:i===bridge.length-1}" :style="{height:((b.value-b.delta)/b.value*100)+'%'}"></i>
            </div>
            <p class="mg-bridge-label">{{ b.label }}</p>
          </div>
          <div class="mg-bridge-tip"><b>$400</b> kept · <b>12.3%</b> margin · <b>32%</b> of plan</div>
        </div>
        <div v-else class="mg-stack-wrap" role="img" aria-label="Full cost stack for job 5819: revenue $3,240 split into labor $1,480, materials $860, callback cost $240, other costs $260 and profit kept $400">
          <div class="mg-stack">
            <div v-for="c in costStack" :key="c.label" class="mg-stack-row">
              <span class="mg-stack-label">{{ c.label }}</span>
              <div class="mg-stack-track"><i :class="{profit:c.label==='Profit kept'}" :style="{width:(c.value/3240*100)+'%'}"></i></div>
              <span class="mg-stack-val">${{ c.value.toLocaleString('en-US') }}</span>
            </div>
            <div class="mg-stack-row total"><span class="mg-stack-label">Revenue</span><div class="mg-stack-track"><i class="rev" style="width:100%"></i></div><span class="mg-stack-val">$3,240</span></div>
          </div>
        </div>
      </article>
      <div class="mg-causes">
        <article v-for="c in bridgeCauses" :key="c.title" class="mg-card mg-cause">
          <span class="mg-need-ic pink" aria-hidden="true">{{ c.icon }}</span>
          <p class="mg-cause-money">{{ c.money }}</p>
          <h4>{{ c.title }}</h4>
          <p class="mg-note">{{ c.desc }}</p>
          <button class="mg-link strong" @click="say(`“${c.cta}” would open a playbook in the real product. Demo only.`)">{{ c.cta }} ›</button>
        </article>
      </div>
      <button class="mg-chip" @click="go('Jobs')">← Back to jobs</button>
    </template>
    <!-- ================= ANALYZE PAGES ================= -->
    <template v-else-if="page==='Customers'">
      <article class="mg-card"><div class="mg-card-head"><div><h3>Customers by revenue</h3><small>Margin per customer, this period</small></div></div>
        <div class="ref-table-scroll"><table><thead><tr><th>Customer</th><th class="number">Jobs</th><th class="number">Revenue</th><th class="number">Profit</th><th>Margin</th></tr></thead>
        <tbody><tr v-for="c in customers" :key="c.name"><td>{{ c.name }}</td><td class="number">{{ c.jobs }}</td><td class="number">${{ c.revenue.toLocaleString('en-US') }}</td><td class="number">${{ c.profit.toLocaleString('en-US') }}</td><td><span class="mg-marginbar"><i :style="{width:Math.min(100,c.margin/40*100)+'%'}"></i></span>{{ c.margin }}%</td></tr></tbody></table></div>
        <p class="mg-callout">ABC Property Group brings the most revenue and two of the six critical jobs. Demo data.</p>
      </article>
    </template>
    <template v-else-if="page==='JobTypes'">
      <article class="mg-card"><div class="mg-card-head"><div><h3>Job types by margin</h3><small>Lowest margin first, this period</small></div></div>
        <div class="ref-table-scroll"><table><thead><tr><th>Job type</th><th class="number">Jobs</th><th class="number">Revenue</th><th class="number">Profit</th><th>Margin</th></tr></thead>
        <tbody><tr v-for="t in jobTypes" :key="t.name"><td>{{ t.name }}</td><td class="number">{{ t.jobs }}</td><td class="number">${{ t.revenue.toLocaleString('en-US') }}</td><td class="number">${{ t.profit.toLocaleString('en-US') }}</td><td><span class="mg-marginbar"><i :style="{width:Math.min(100,t.margin/40*100)+'%'}"></i></span>{{ t.margin }}%</td></tr></tbody></table></div>
        <p class="mg-callout">Compressor replacements run 34% over the quoted labor hours. Demo data.</p>
      </article>
    </template>
    <template v-else-if="page==='Technicians'">
      <article class="mg-card"><div class="mg-card-head"><div><h3>Technicians</h3><small>Hours variance, callbacks and margin</small></div></div>
        <div class="ref-table-scroll"><table><thead><tr><th>Technician</th><th>Role</th><th class="number">Jobs</th><th class="number">Hours vs estimate</th><th class="number">Callbacks</th><th>Margin</th></tr></thead>
        <tbody><tr v-for="t in technicians" :key="t.name"><td><span class="ref-avatar small">{{ t.name.split(' ').map(w=>w[0]).join('') }}</span> {{ t.name }}</td><td>{{ t.role }}</td><td class="number">{{ t.jobs }}</td><td class="number" :class="{'pink':t.variance.startsWith('+')}">{{ t.variance }}</td><td class="number">{{ t.callbacks }}</td><td><span class="mg-marginbar"><i :style="{width:Math.min(100,t.margin/40*100)+'%'}"></i></span>{{ t.margin }}%</td></tr></tbody></table></div>
        <p class="mg-callout">Sam Okafor holds estimate best. Luis is an apprentice; pair him on compressor installs. Demo data.</p>
      </article>
    </template>
    <template v-else-if="page==='Branches'">
      <div class="mg-branches">
        <article v-for="b in branchesData" :key="b.name" class="mg-card mg-branch" :class="{warn:b.delta<-3}">
          <div class="mg-card-head"><h3>{{ b.name }}</h3><span class="mg-status" :class="b.delta<-3?'critical':'on-target'">● {{ b.delta<-3?'Under target':'On target' }}</span></div>
          <p class="mg-big mid">{{ b.margin }}%</p>
          <p class="mg-delta" :class="b.delta<-3?'down':''">{{ b.delta }} pts vs target</p>
          <dl class="mg-rows">
            <div><dt>Revenue</dt><dd>${{ b.revenue }}K</dd></div>
            <div><dt>Leakage</dt><dd>${{ b.leakage }}K</dd></div>
            <div><dt>Jobs</dt><dd>{{ b.jobs }}</dd></div>
          </dl>
          <button class="mg-chip" @click="branch=b.name;go('Jobs')">View {{ b.name }} jobs →</button>
        </article>
      </div>
    </template>
    <template v-else-if="page==='Trends'">
      <article class="mg-card"><div class="mg-card-head"><div><h3>Margin trend</h3><small>Weekly margin against the {{ target }}% target</small></div></div>
        <svg class="mg-fc-chart" viewBox="0 0 520 200" role="img" aria-label="Margin drifts from 36.1% down to 34.0% over 12 weeks">
          <g class="grid"><path d="M40 30 H505 M40 72 H505 M40 114 H505 M40 156 H505"/></g>
          <path class="line-b" :d="weeks.map((v,i)=>(i?'L':'M')+chartX(i)+' '+chartY(v)).join(' ')"/>
          <g class="pts-b"><circle v-for="(v,i) in weeks" :key="i" :cx="chartX(i)" :cy="chartY(v)" r="3.5"/></g>
          <path class="line-t" :d="'M40 '+chartY(target)+' H505'"/>
          <g class="xlabels"><text :x="chartX(0)" y="190">{{ weekLabels[0] }}</text><text :x="chartX(5)" y="190">{{ weekLabels[5] }}</text><text :x="chartX(11)" y="190">{{ weekLabels[11] }}</text></g>
        </svg>
        <p class="mg-callout">Margin slipped 2.1 pts since early July; callbacks and labor overruns drive the slide. Demo data.</p>
      </article>
    </template>

    <!-- ================= NOTIFICATIONS / SETTINGS / HELP ================= -->
    <template v-else-if="page==='Notifications'">
      <article class="mg-card"><div class="mg-card-head"><div><h3>Notifications</h3><small>3 unread · demo inbox</small></div></div>
        <button v-for="n in notifications" :key="n.title" class="mg-need" @click="go(n.dest)">
          <span class="mg-need-ic slate" aria-hidden="true">◌</span>
          <span class="mg-need-tx"><strong>{{ n.title }}</strong><small>{{ n.sub }}</small></span>
          <span class="mg-time">{{ n.time }}</span>
        </button>
      </article>
    </template>
    <template v-else-if="page==='Settings'">
      <div class="mg-grid-leak">
        <article class="mg-card"><div class="mg-card-head"><div><h3>Targets</h3><small>These update the Overview math live</small></div></div>
          <label class="mg-field">Margin target (%)<input class="form-control" type="number" v-model.number="target" min="30" max="45" step="0.5"></label>
          <label class="mg-field">Week starts on<select class="form-control" v-model="weekStart"><option>Monday</option><option>Sunday</option></select></label>
          <p class="mg-note">Weeks now start on {{ weekStart }} in this demo. No setting leaves this page.</p>
        </article>
        <article class="mg-card"><div class="mg-card-head"><div><h3>Billing rules</h3><small>Where “Fix billing rule” lands</small></div></div>
          <label class="mg-field"><input type="checkbox" checked> Bill emergency rate after 6 pm</label>
          <label class="mg-field"><input type="checkbox" checked> Flag discounts above 5% for approval</label>
          <label class="mg-field"><input type="checkbox"> Auto-add drain line check to handover</label>
          <button class="mg-primary" @click="say('Billing rules saved locally. Demo only.')">Save rules</button>
        </article>
      </div>
    </template>
    <template v-else-if="page==='Help'">
      <article class="mg-card"><div class="mg-card-head"><div><h3>Help</h3><small>About this demo</small></div></div>
        <details class="mg-faq"><summary>Where does the data come from?</summary><p>Every number is fictitious and generated locally in your browser. Nothing is sent anywhere.</p></details>
        <details class="mg-faq"><summary>What do the hatched bars mean?</summary><p>Hatched segments are planned or leaked profit. Solid blue is profit kept. Pink is leakage above plan.</p></details>
        <details class="mg-faq"><summary>How do scenarios work?</summary><p>On the Forecast page, each switch adds its points to the October projection and lowers the gap to target. The chart and KPIs recompute live.</p></details>
        <details class="mg-faq"><summary>Keyboard access</summary><p>All navigation, dots under 23% margin, table job links, scenario switches and dialogs work from the keyboard. Dialogs close with Escape.</p></details>
      </article>
    </template>

    <p v-if="notice" class="ref-notice" role="status">{{ notice }}</p>
    <p class="mg-legal">Fictitious data · Local interaction only · Source-inspired recreation, not the original product.</p>
  </main>

  <dialog ref="dialog" class="ref-dialog mg-dialog">
    <template v-if="dialogJob">
      <h3>{{ dialogJob.id }} · {{ dialogJob.customer }}</h3>
      <p class="mg-note">{{ dialogJob.type }} · {{ dialogJob.city }} · completed {{ dialogJob.done }}</p>
      <dl class="mg-rows">
        <div><dt>Revenue</dt><dd>${{ dialogJob.revenue.toLocaleString('en-US') }}</dd></div>
        <div><dt>Profit</dt><dd>${{ dialogJob.profit.toLocaleString('en-US') }}</dd></div>
        <div><dt>Margin</dt><dd>{{ dialogJob.margin.toFixed(1) }}%</dd></div>
        <div><dt>Main issue</dt><dd>{{ dialogJob.issue }}</dd></div>
      </dl>
      <div class="ref-tools">
        <button class="mg-chip" @click="dialog?.close()">Close</button>
        <button class="mg-primary" @click="reviewJob(dialogJob)">Open profit bridge →</button>
      </div>
    </template>
  </dialog>
</section>
</template>
