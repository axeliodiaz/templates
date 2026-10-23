<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type Kpi = { value: string; label: string }
type PageState = {
  pill: string
  pillGhost: boolean
  updated: string
  kpis: (Kpi & { was?: string })[]
  bars: number[]
  filled: number
  highlight: number
  caption?: string
}
type ListRow = { title: string; note: string; tag: string }
type PageDef = {
  n: string
  name: string
  schedule: string
  replaces: string
  title: string
  sources: string[]
  chartLabel?: string
  barLabels?: string[]
  list?: ListRow[]
  listLabel?: string
  asked: string
  states: PageState[]
  illustrative: boolean
}

const pages: PageDef[] = [
  {
    n: '01',
    name: 'revenue last week',
    schedule: 'every mon 08:00',
    replaces: 'replaces the Monday deck',
    title: 'Revenue last week',
    sources: ['stripe', 'hubspot'],
    chartLabel: 'BOOKED PER WEEK, $M',
    barLabels: ['w34', 'w35', 'w36', 'w37', 'w38', 'w39', 'w40', 'w41', 'w42', 'w43'],
    asked: '"Every Monday at 8:00, booked vs plan and what slipped"',
    illustrative: false,
    states: [
      {
        pill: 'REFRESHED MON OCT 19, 08:00',
        pillGhost: false,
        updated: 'updated 4 days ago',
        kpis: [
          { value: '$2.69M', label: 'BOOKED' },
          { value: '+9%', label: 'VS PLAN' },
          { value: '46', label: 'NEW DEALS' },
          { value: '$204K', label: 'SMB SLIPPED' },
        ],
        bars: [52, 62, 55, 68, 60, 72, 58, 75, 82, 96],
        filled: 10,
        highlight: 9,
      },
      {
        pill: 'REFRESHED MON OCT 26, 08:00',
        pillGhost: false,
        updated: 'updated just now',
        kpis: [
          { value: '$2.71M', label: 'BOOKED', was: '$2.60M' },
          { value: '+9%', label: 'VS PLAN', was: '+6%' },
          { value: '47', label: 'NEW DEALS', was: '41' },
          { value: '$190K', label: 'SMB SLIPPED', was: '$710K' },
        ],
        bars: [52, 62, 55, 68, 60, 72, 58, 75, 82, 96],
        filled: 10,
        highlight: 9,
        caption: 'Best week of the quarter, SMB got $120K back after the pricing fix',
      },
    ],
  },
  {
    n: '02',
    name: 'Q4 pipeline',
    schedule: 'live, all day',
    replaces: 'replaces the Excel model',
    title: 'Q4 Forecast & Pipeline',
    sources: ['salesforce'],
    chartLabel: 'COMMIT BY WEEK, $M',
    barLabels: ['oct 1', 'oct 8', 'oct 15', 'oct 22', 'oct 29', 'nov 5', 'nov 12', 'nov 19', 'nov 26', 'dec 3'],
    asked: '"Live Q4 forecast, flag every deal stuck for 14 days"',
    illustrative: false,
    states: [
      {
        pill: 'LIVE: WATCHING 64 DEALS',
        pillGhost: true,
        updated: 'updated 5 min ago',
        kpis: [
          { value: '$10.0M', label: 'Q4 TARGET' },
          { value: '$8.4M', label: 'COMMIT' },
          { value: '$11.9M', label: 'OPEN PIPELINE' },
          { value: '3', label: 'STUCK 14+ DAYS' },
        ],
        bars: [55, 62, 70, 76, 84, 58, 0, 0, 0, 0],
        filled: 6,
        highlight: 5,
        caption: '84% of target committed, 3 deals have not moved in 14 days',
      },
      {
        pill: 'UPDATED LIVE, 2:14 PM',
        pillGhost: false,
        updated: 'updated just now',
        kpis: [
          { value: '$10.0M', label: 'Q4 TARGET' },
          { value: '$8.9M', label: 'COMMIT', was: '$8.4M' },
          { value: '$12.6M', label: 'OPEN PIPELINE', was: '$12.0M' },
          { value: '2', label: 'STUCK 14+ DAYS', was: '3' },
        ],
        bars: [55, 62, 70, 76, 84, 62, 96, 0, 0, 0],
        filled: 7,
        highlight: 6,
        caption: '89% committed, Northwind moved to contract, 2 deals still stuck',
      },
    ],
  },
  {
    n: '03',
    name: 'morning brief',
    schedule: 'daily 07:00',
    replaces: "replaces your EA's email",
    title: 'Morning brief',
    sources: ['gmail', 'calendar', 'slack'],
    chartLabel: 'MEETINGS PER DAY',
    barLabels: ['mon', 'tue', 'wed', 'thu', 'fri', 'mon', 'tue', 'wed', 'thu', 'fri'],
    asked: '"My day by 7:00 and the one thing most likely to slip"',
    illustrative: false,
    states: [
      {
        pill: 'NEXT REFRESH: DAILY 07:00',
        pillGhost: true,
        updated: 'updated 06:58',
        kpis: [
          { value: '6', label: 'MEETINGS' },
          { value: '3', label: 'NEED PREP' },
          { value: '14', label: 'EMAILS THAT MATTER' },
          { value: '1.5h', label: 'FREE HOURS' },
        ],
        bars: [62, 55, 78, 45, 35, 68, 0, 0, 0, 0],
        filled: 6,
        highlight: 5,
      },
      {
        pill: 'REFRESHED TUE OCT 27, 07:00',
        pillGhost: false,
        updated: 'updated just now',
        kpis: [
          { value: '5', label: 'MEETINGS', was: '6' },
          { value: '2', label: 'NEED PREP', was: '3' },
          { value: '9', label: 'EMAILS THAT MATTER', was: '11' },
          { value: '2.5h', label: 'FREE HOURS', was: '1.5h' },
        ],
        bars: [62, 55, 78, 45, 35, 68, 52, 0, 0, 0],
        filled: 7,
        highlight: 6,
        caption: 'Board prep moved to Thursday, the venue contract still needs you by noon',
      },
    ],
  },
  {
    n: '04',
    name: 'board memo',
    schedule: '1st of the month',
    replaces: 'replaces 2 days of drafts',
    title: 'Board memo',
    sources: ['stripe', 'hubspot', 'gmail'],
    listLabel: 'MEMO SECTIONS',
    list: [
      { title: 'Highlights', note: 'drafted from the October numbers', tag: 'drafted' },
      { title: 'Metrics', note: '12 figures pulled, sources attached', tag: 'drafted' },
      { title: 'Risks', note: '2 flagged for review', tag: 'flagged' },
      { title: 'The ask', note: 'parked until you approve it', tag: 'parked' },
    ],
    asked: '"Draft the monthly update from these numbers, never send it"',
    illustrative: true,
    states: [
      {
        pill: 'DRAFT PARKED - NOT SENT',
        pillGhost: false,
        updated: 'updated nov 1, 08:00',
        kpis: [
          { value: '4', label: 'SECTIONS DRAFTED' },
          { value: '12', label: 'NUMBERS PULLED' },
          { value: '2', label: 'RISKS FLAGGED' },
          { value: '0', label: 'EMAILS SENT' },
        ],
        bars: [0],
        filled: 0,
        highlight: -1,
        caption: 'Draft ready for review, parked - the memo never sends itself',
      },
    ],
  },
  {
    n: '05',
    name: 'policy page',
    schedule: 'when the rule changes',
    replaces: 'replaces the stale wiki',
    title: 'Policy page',
    sources: ['slack'],
    listLabel: 'LATEST REWRITES',
    list: [
      { title: 'PTO accrual', note: 'rewritten 06:12 after the #hr-rules change', tag: 'v15' },
      { title: 'Travel policy', note: 'updated last week', tag: 'v15' },
      { title: 'Expenses', note: 'no rule change detected', tag: 'v14' },
    ],
    asked: '"Rewrite this page every time the rule changes in Slack"',
    illustrative: true,
    states: [
      {
        pill: 'REWROTE 2 SECTIONS, 06:12',
        pillGhost: false,
        updated: 'updated just now',
        kpis: [
          { value: '14', label: 'SECTIONS' },
          { value: '2', label: 'REWRITTEN TODAY' },
          { value: 'v15', label: 'CURRENT VERSION' },
          { value: '0', label: 'STALE PARAGRAPHS' },
        ],
        bars: [0],
        filled: 0,
        highlight: -1,
        caption: 'Rewrote 2 sections after the rule changed in #hr-rules',
      },
    ],
  },
  {
    n: '06',
    name: 'competitor watch',
    schedule: 'daily 06:00',
    replaces: 'replaces a $499/mo tool',
    title: 'Competitor watch',
    sources: ['5 companies'],
    listLabel: 'TODAY, PER COMPANY',
    list: [
      { title: 'Acme Corp', note: 'price cut 12% on the Teams plan', tag: 'price' },
      { title: 'Northbeam', note: 'launched AI reports', tag: 'launch' },
      { title: 'Globex', note: 'no change', tag: '-' },
      { title: 'Initech', note: 'no change', tag: '-' },
      { title: 'Hooli', note: 'price up $5 per user', tag: 'price' },
    ],
    asked: '"Every price change and launch from these 5 companies, daily"',
    illustrative: true,
    states: [
      {
        pill: 'SCANNED DAILY, 06:00',
        pillGhost: false,
        updated: 'updated just now',
        kpis: [
          { value: '5', label: 'COMPANIES' },
          { value: '2', label: 'PRICE CHANGES' },
          { value: '1', label: 'LAUNCH' },
          { value: '53', label: 'CHECKS SO FAR' },
        ],
        bars: [0],
        filled: 0,
        highlight: -1,
        caption: 'Acme cut Teams pricing 12% overnight, Northbeam shipped AI reports',
      },
    ],
  },
]

const cmd = 'evertrue page new "Revenue last week" --keep-up-to-date "mon 08:00"'
const typed = ref('')
const selected = ref(-1)
const updates = ref(357)
const pagesLive = ref(0)
const stateIdx = ref<number[]>(pages.map(() => 0))
const keep = ref<boolean[]>(pages.map(() => true))
const cardCounts = ref([32, 212, 44, 6, 11, 52])
const flipping = ref(-1)
const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const current = computed(() => (selected.value >= 0 ? pages[selected.value] : null))
const curState = computed(() => {
  if (selected.value < 0) return null
  const p = pages[selected.value]
  return p.states[stateIdx.value[selected.value] % p.states.length]
})

let timers: number[] = []

function select(i: number) {
  selected.value = selected.value === i ? -1 : i
}

function toggleKeep(i: number) {
  keep.value[i] = !keep.value[i]
}

onMounted(() => {
  if (reduced) {
    typed.value = cmd
    pagesLive.value = pages.length
    stateIdx.value = pages.map((p) => p.states.length - 1)
    return
  }
  let i = 0
  const typer = window.setInterval(() => {
    i += 1
    typed.value = cmd.slice(0, i)
    if (i >= cmd.length) window.clearInterval(typer)
  }, 28)
  timers.push(typer)
  let shown = 0
  const intro = window.setInterval(() => {
    shown += 1
    pagesLive.value = Math.min(shown, pages.length)
    if (shown >= pages.length) window.clearInterval(intro)
  }, 420)
  timers.push(intro)
  let tick = 0
  const sim = window.setInterval(() => {
    tick += 1
    updates.value += 1
    const c = tick % cardCounts.value.length
    cardCounts.value[c] += 1
    if (selected.value >= 0 && tick % 3 === 0 && keep.value[selected.value]) {
      const p = pages[selected.value]
      if (p.states.length > 1) {
        flipping.value = selected.value
        window.setTimeout(() => (flipping.value = -1), 650)
        stateIdx.value[selected.value] = (stateIdx.value[selected.value] + 1) % p.states.length
      }
    }
  }, 3000)
  timers.push(sim)
})

onBeforeUnmount(() => {
  timers.forEach((t) => window.clearInterval(t))
  timers = []
})
</script>

<template>
  <div class="evertrue">
    <div class="et-window">
      <header class="et-chrome">
        <span class="et-dots" aria-hidden="true"><i /><i /><i /></span>
        <span class="et-brand"><b class="et-mark">E</b> Evertrue <em>/ pages</em></span>
        <span class="et-demo-pill">demo</span>
      </header>

      <div class="et-cmdline">
        <p class="et-cmd">
          <span class="et-dollar">$</span> {{ typed }}<span class="et-cursor" aria-hidden="true" />
        </p>
        <p class="et-cmd-note">fictitious data · simulated updates</p>
      </div>

      <section class="et-counters" aria-label="Headline counters">
        <div class="et-counter">
          <strong>{{ pagesLive }}</strong>
          <span>PAGES<br />LIVE</span>
        </div>
        <div class="et-counter">
          <strong>{{ updates }}</strong>
          <span>UPDATES<br />WITHOUT YOU</span>
        </div>
        <div class="et-counter">
          <strong>0</strong>
          <span>DASHBOARDS<br />YOU MAINTAIN</span>
        </div>
        <div class="et-halftone" aria-hidden="true" />
      </section>

      <section class="et-cards" aria-label="Pages it keeps true">
        <p class="et-label">6 PAGES IT KEEPS TRUE</p>
        <div class="et-card-grid">
          <button
            v-for="(p, i) in pages"
            :key="p.n"
            type="button"
            class="et-card"
            :class="{ 'et-card-active': selected === i }"
            :aria-pressed="selected === i"
            @click="select(i)"
          >
            <span class="et-card-name"><b class="et-chip">{{ p.n }}</b> {{ p.name }}</span>
            <span class="et-card-sub">{{ p.schedule }} · {{ p.replaces }}</span>
            <span class="et-card-count">{{ cardCounts[i] }}</span>
          </button>
        </div>
      </section>

      <section class="et-stage">
        <p class="et-label et-stage-label">
          <span>{{ current ? 'PAGE' : 'OVERVIEW' }}</span>
          <span v-if="current" class="et-kept" :class="{ 'et-kept-off': !keep[selected] }">
            {{ keep[selected] ? '● KEPT UP TO DATE' : '○ PAUSED' }}
          </span>
        </p>

        <Transition name="et-panel" mode="out-in">
          <div v-if="!current" key="overview" class="et-panel et-overview">
            <span class="et-pill et-pill-ghost">the idea</span>
            <h2>Ask once, <em>it stays true</em></h2>
            <p class="et-overview-sub">Evertrue builds Pages now</p>
            <div class="et-mini-grid">
              <button
                v-for="(p, i) in pages"
                :key="p.n"
                type="button"
                class="et-mini"
                @click="select(i)"
              >
                <b class="et-chip">{{ p.n }}</b> {{ p.name }}
                <small>{{ p.schedule }}</small>
              </button>
            </div>
            <p class="et-overview-foot">6 pages, 0 dashboards to babysit</p>
          </div>

          <div v-else :key="current.n" class="et-panel et-page" :class="{ 'et-flip': flipping === selected }">
            <div class="et-page-head">
              <span class="et-chip et-page-chip">PAGE / {{ current.n }}</span>
              <Transition name="et-swap" mode="out-in">
                <span
                  :key="curState?.pill + keep[selected]"
                  class="et-pill"
                  :class="{ 'et-pill-ghost': curState?.pillGhost, 'et-pill-off': !keep[selected] }"
                >{{ keep[selected] ? curState?.pill : 'PAUSED - KEEP UP TO DATE IS OFF' }}</span>
              </Transition>
            </div>

            <h2 class="et-title">{{ current.title }}</h2>
            <p class="et-meta">
              {{ current.sources.length }} source{{ current.sources.length > 1 ? 's' : '' }}
              <b v-for="s in current.sources" :key="s" class="et-source">{{ s }}</b>
              <Transition name="et-swap" mode="out-in">
                <em :key="curState?.updated">{{ curState?.updated }}</em>
              </Transition>
              <i v-if="current.illustrative" class="et-illus">illustrative - not shown in the source video</i>
            </p>

            <div class="et-kpis">
              <div v-for="k in curState?.kpis" :key="k.label" class="et-kpi">
                <Transition name="et-val" mode="out-in">
                  <strong :key="k.value">{{ k.value }}</strong>
                </Transition>
                <span>{{ k.label }}</span>
                <s v-if="k.was">was {{ k.was }}</s>
              </div>
            </div>

            <div v-if="current.barLabels" class="et-chart">
              <p class="et-chart-label">{{ current.chartLabel }}</p>
              <div class="et-bars" role="img" :aria-label="current.chartLabel">
                <span
                  v-for="(bl, bi) in current.barLabels"
                  :key="bi"
                  class="et-bar"
                  :class="{
                    'et-bar-hl': bi === curState?.highlight,
                    'et-bar-empty': bi >= (curState?.filled ?? 0),
                  }"
                  :style="{ height: (curState?.bars[bi] ?? 0) + '%' }"
                />
              </div>
              <div class="et-bar-labels">
                <span
                  v-for="(bl, bi) in current.barLabels"
                  :key="bi"
                  :class="{ 'et-bar-empty': bi >= (curState?.filled ?? 0) }"
                >{{ bl }}</span>
              </div>
            </div>

            <div v-else class="et-list">
              <p class="et-chart-label">{{ current.listLabel }}</p>
              <div v-for="r in current.list" :key="r.title" class="et-list-row">
                <span class="et-list-title">{{ r.title }}</span>
                <span class="et-list-note">{{ r.note }}</span>
                <span class="et-list-tag">{{ r.tag }}</span>
              </div>
            </div>

            <Transition name="et-swap" mode="out-in">
              <p v-if="curState?.caption" :key="curState.caption" class="et-caption">
                <b>{{ curState.caption.split(',')[0] }},</b>{{ curState.caption.slice(curState.caption.indexOf(',') + 1) }}
              </p>
            </Transition>

            <div class="et-page-foot">
              <p class="et-asked">asked once: <i>{{ current.asked }}</i></p>
              <button
                type="button"
                class="et-toggle"
                :class="{ 'et-toggle-off': !keep[selected] }"
                :aria-pressed="keep[selected]"
                @click="toggleKeep(selected)"
              >
                KEEP UP TO DATE
                <span class="et-switch" aria-hidden="true"><i /></span>
              </button>
            </div>
          </div>
        </Transition>
      </section>
    </div>
  </div>
</template>
