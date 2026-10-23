<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import RelayIcon from './RelayIcon.vue'
import RelayRail from './RelayRail.vue'

type Tone = 'violet' | 'teal'
interface FeedItem { id: string; agent: string; tone: Tone; call: string; time: string; dur: string }
interface Approval { id: string; agent: string; text: string; ago: string; icon: string }

const agents = [
  { id: 'research', name: 'Research Agent', status: 'Online', ago: 'Last active 1m ago', icon: 'research' },
  { id: 'code', name: 'Code Agent', status: 'Online', ago: 'Last active 30s ago', icon: 'code' },
  { id: 'ops', name: 'Ops Agent', status: 'Online', ago: 'Last active 2m ago', icon: 'ops' },
]
const servers = ref([
  { id: 'supabase', name: 'Supabase', latency: '124ms', paused: false, icon: 'supabase' },
  { id: 'github', name: 'GitHub', latency: '98ms', paused: false, icon: 'github' },
  { id: 'vercel', name: 'Vercel', latency: '110ms', paused: false, icon: 'vercel' },
  { id: 'gmail', name: 'Gmail', latency: '86ms', paused: false, icon: 'gmail' },
])
const tools = [
  { name: 'query_table', server: 'Supabase', agent: 'Research Agent' },
  { name: 'apply_migration', server: 'Supabase', agent: 'Code Agent' },
  { name: 'create_issue', server: 'GitHub', agent: 'Code Agent' },
  { name: 'list_pulls', server: 'GitHub', agent: 'Ops Agent' },
  { name: 'deploy', server: 'Vercel', agent: 'Ops Agent' },
  { name: 'list_threads', server: 'Gmail', agent: 'Research Agent' },
]
const asks = [
  'Summarize the sample schema',
  'Draft a migration plan',
  'What changed in the last sample deploy?',
]
const rooms = ['Control Room', 'Research desk', 'Ops floor']
const notes = [
  { title: 'Code Agent is waiting', body: 'Sample migration approval. Nothing is queued on a real database.' },
  { title: 'Ops Agent checked Vercel', body: 'Sample latency 110ms. No deployment was started.' },
]
const feedPool: { agent: string; tone: Tone; call: string; dur: string }[] = [
  { agent: 'Research Agent', tone: 'teal', call: 'Gmail > search_threads', dur: '164ms' },
  { agent: 'Code Agent', tone: 'violet', call: 'Supabase > list_tables', dur: '203ms' },
  { agent: 'Ops Agent', tone: 'teal', call: 'Vercel > list_deployments', dur: '318ms' },
  { agent: 'Research Agent', tone: 'violet', call: 'GitHub > list_issues', dur: '241ms' },
]
const bars = [
  { name: 'Research', value: 46 },
  { name: 'Code', value: 34 },
  { name: 'Ops', value: 20 },
]

const section = ref('agents')
const approvals = ref<Approval[]>([
  { id: 'mig', agent: 'Code Agent', text: 'Wants to run a database migration', ago: '2m ago', icon: 'code' },
  { id: 'dep', agent: 'Ops Agent', text: 'Wants to deploy to production', ago: '5m ago', icon: 'ops' },
])
const feed = ref<FeedItem[]>([
  { id: 'a1', agent: 'Research Agent', tone: 'violet', call: 'Supabase > query_table', time: '12:42:18', dur: '286ms' },
  { id: 'a2', agent: 'Code Agent', tone: 'violet', call: 'GitHub > create_issue', time: '12:42:11', dur: '512ms' },
  { id: 'a3', agent: 'Ops Agent', tone: 'teal', call: 'Vercel > deploy', time: '12:42:05', dur: '1.23s' },
])
const calls = ref(1284)
const shownCalls = ref(1284)
const latency = ref(412)
const success = ref(98.6)
const callSeries = ref([42, 55, 48, 70, 66, 90, 84, 110, 102, 128, 121, 148])
const latencySeries = ref([68, 60, 64, 52, 58, 46, 50, 42, 48, 40, 44, 41])
const successSeries = ref([96.2, 96.8, 97.1, 97.4, 97.6, 97.9, 98.1, 98.2, 98.3, 98.4, 98.5, 98.6])
const sparkKey = ref(0)
const query = ref('')
const toolQuery = ref('')
const askOpen = ref(false)
const bellOpen = ref(false)
const roomOpen = ref(false)
const room = ref('Control Room')
const focusId = ref('')
const latest = ref('')
const wires = ref<{ id: string; tone: Tone; d: string }[]>([])
const stageBox = ref({ w: 800, h: 480 })
const stage = ref<HTMLElement | null>(null)
const drawer = ref<HTMLDialogElement | null>(null)
const helpDlg = ref<HTMLDialogElement | null>(null)
const profileDlg = ref<HTMLDialogElement | null>(null)
const askInput = ref<HTMLInputElement | null>(null)
const reduced = ref(false)
const navOpen = ref(false)
const helpOpen = ref(false)
const profileOpen = ref(false)

let clock = 12 * 3600 + 42 * 60 + 18
let seq = 4
let pool = 0
let feedTimer = 0
let approveTimer = 0
let blurTimer = 0
let raf = 0
let ro: ResizeObserver | undefined
let reduceQuery: MediaQueryList | undefined

const pausedCount = computed(() => servers.value.filter(s => s.paused).length)
const statusText = computed(() => pausedCount.value ? `${pausedCount.value} sample server paused` : 'All systems operational')
const matches = computed(() => {
  const q = query.value.trim().toLowerCase()
  return asks.filter(a => a.toLowerCase().includes(q))
})
const filteredTools = computed(() => {
  const q = toolQuery.value.trim().toLowerCase()
  return tools.filter(t => `${t.name} ${t.server} ${t.agent}`.toLowerCase().includes(q))
})

function fmt(total: number) {
  const h = Math.floor(total / 3600) % 24
  const m = Math.floor(total / 60) % 60
  const s = total % 60
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':')
}
function spark(values: number[]) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const w = 160
  const h = 42
  return values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - 4 - ((v - min) / span) * (h - 8)
    return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')
}
function pushFeed(item: { agent: string; tone: Tone; call: string; dur: string }) {
  clock += 5
  feed.value = [{ ...item, id: 'f' + seq++, time: fmt(clock) }, ...feed.value].slice(0, 6)
  calls.value += 1
  const last = callSeries.value[callSeries.value.length - 1]
  callSeries.value = [...callSeries.value.slice(1), last + 6]
  const lastL = latencySeries.value[latencySeries.value.length - 1]
  latencySeries.value = [...latencySeries.value.slice(1), Math.max(36, lastL + ((pool % 2) ? -4 : 3))]
  sparkKey.value++
  latest.value = `${item.agent} ${item.call}. Sample only.`
}
function tweenCalls(to: number) {
  cancelAnimationFrame(raf)
  if (reduced.value) {
    shownCalls.value = to
    return
  }
  const from = shownCalls.value
  const start = performance.now()
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / 700)
    shownCalls.value = Math.round(from + (to - from) * (1 - Math.pow(1 - t, 3)))
    if (t < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}
watch(calls, n => tweenCalls(n))

function go(id: string) {
  section.value = id
  drawer.value?.close()
  bellOpen.value = false
  roomOpen.value = false
}
async function openDialog(dialog: HTMLDialogElement | null, flag: { value: boolean }) {
  if (!dialog || dialog.open) return
  flag.value = true
  await nextTick()
  dialog.showModal()
}
function openNav() {
  return openDialog(drawer.value, navOpen)
}
function openHelp() {
  return openDialog(helpDlg.value, helpOpen)
}
function openProfile() {
  drawer.value?.close()
  return openDialog(profileDlg.value, profileOpen)
}
function onDrawerToggle() {
  navOpen.value = !!drawer.value?.open
}
function selectNode(id: string) {
  focusId.value = focusId.value === id ? '' : id
}
function fit() {
  focusId.value = ''
  latest.value = 'Fit view restored. Sample graph only.'
  nextTick(measure)
}
function toggleServer(id: string) {
  const server = servers.value.find(item => item.id === id)
  if (!server) return
  server.paused = !server.paused
  latest.value = server.paused
    ? `${server.name} paused in this sample. No server was contacted.`
    : `${server.name} marked connected again. Sample only.`
}
function settle(item: Approval, kind: 'approved' | 'denied') {
  window.clearTimeout(approveTimer)
  const wait = reduced.value ? 0 : 280
  approveTimer = window.setTimeout(() => {
    approvals.value = approvals.value.filter(entry => entry.id !== item.id)
    pushFeed({
      agent: 'You',
      tone: 'teal',
      call: `${kind} ${item.agent}: ${item.text}`,
      dur: 'local',
    })
    latest.value = `Sample ${kind === 'approved' ? 'approval' : 'denial'} recorded for ${item.agent}. Nothing was sent.`
  }, wait)
}
function askSubmit() {
  const text = query.value.trim() || matches.value[0]
  if (!text) return
  pushFeed({ agent: 'You', tone: 'violet', call: `asked: ${text}`, dur: 'sample' })
  latest.value = `Sample question recorded: ${text}. No agent was contacted.`
  query.value = ''
  askOpen.value = false
}
function pickAsk(text: string) {
  query.value = text
  askSubmit()
}
function tickFeed() {
  const item = feedPool[pool % feedPool.length]
  pool += 1
  latency.value = 380 + (pool * 17) % 90
  pushFeed(item)
}
function measure() {
  const root = stage.value
  if (!root || section.value !== 'agents') return
  const box = root.getBoundingClientRect()
  if (box.width < 40) return
  stageBox.value = { w: Math.round(box.width), h: Math.round(box.height) }
  const cards = [...root.querySelectorAll<HTMLElement>('[data-link]')]
  const human = root.querySelector<HTMLElement>('[data-node="human"]')
  if (!human || cards.length < 2) {
    wires.value = []
    return
  }
  const first = cards[0].getBoundingClientRect()
  const second = cards[1].getBoundingClientRect()
  if (Math.abs(first.top - second.top) > 12) {
    wires.value = []
    return
  }
  const hb = human.getBoundingClientRect()
  const hx = hb.left + hb.width / 2 - box.left
  wires.value = cards.map(el => {
    const rect = el.getBoundingClientRect()
    const fromAgent = el.dataset.link === 'agent'
    const x = rect.left + rect.width / 2 - box.left
    const y = fromAgent ? rect.bottom - box.top - 2 : rect.top - box.top + 2
    const y2 = fromAgent ? hb.top - box.top + 8 : hb.bottom - box.top - 8
    const c1x = x + (hx - x) * 0.18
    const c1y = y + (y2 - y) * 0.58
    const c2x = hx - (hx - x) * 0.06
    const c2y = y2 - (y2 - y) * 0.1
    return {
      id: el.dataset.node || '',
      tone: (fromAgent ? 'violet' : 'teal') as Tone,
      d: `M ${x.toFixed(1)} ${y.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${hx.toFixed(1)} ${y2.toFixed(1)}`,
    }
  })
}
function dimmed(id: string) {
  if (room.value === 'Research desk') return id !== 'research' && id !== 'human'
  if (room.value === 'Ops floor') return id !== 'ops' && id !== 'human'
  return !!focusId.value && focusId.value !== id && id !== 'human' && focusId.value !== 'human'
}
function onReduce() {
  reduced.value = !!reduceQuery?.matches
  if (reduced.value) shownCalls.value = calls.value
}
function onKey(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    askInput.value?.focus()
    askOpen.value = true
  } else if (event.key === 'Escape') {
    askOpen.value = false
    bellOpen.value = false
    roomOpen.value = false
  }
}
function onResize() {
  if (window.innerWidth >= 1024) drawer.value?.close()
  measure()
}
function blurAsk() {
  window.clearTimeout(blurTimer)
  blurTimer = window.setTimeout(() => { askOpen.value = false }, 160)
}
function chooseRoom(name: string) {
  room.value = name
  roomOpen.value = false
  focusId.value = ''
  latest.value = `${name} is a sample view. No agent was contacted.`
  nextTick(measure)
}

onMounted(() => {
  reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced.value = reduceQuery.matches
  reduceQuery.addEventListener('change', onReduce)
  window.addEventListener('keydown', onKey)
  window.addEventListener('resize', onResize)
  ro = new ResizeObserver(() => measure())
  if (stage.value) ro.observe(stage.value)
  nextTick(measure)
  if (!reduced.value) {
    shownCalls.value = 1100
    tweenCalls(calls.value)
  }
  feedTimer = window.setInterval(tickFeed, 5000)
})
onBeforeUnmount(() => {
  window.clearInterval(feedTimer)
  window.clearTimeout(approveTimer)
  window.clearTimeout(blurTimer)
  cancelAnimationFrame(raf)
  ro?.disconnect()
  reduceQuery?.removeEventListener('change', onReduce)
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', onResize)
})
watch(section, async value => {
  if (value === 'agents') {
    await nextTick()
    if (stage.value) ro?.observe(stage.value)
    measure()
  }
})
</script>

<template>
  <div class="relay-frame">
    <div class="relay relay-bs6" data-bs-theme="dark">
      <div class="rl-canvas">
      <p class="visually-hidden" aria-live="polite">{{ latest }}</p>
      <header class="rl-top">
        <div class="rl-brand">
          <span class="rl-mark" aria-hidden="true"><RelayIcon name="agents" /></span>
          <span>Relay</span>
          <button type="button" class="btn-outline btn-icon theme-primary rl-menu lg:d-none" aria-controls="relay-nav-drawer" :aria-expanded="navOpen" aria-label="Open navigation" @click="openNav">
            <span class="rl-burger" aria-hidden="true"></span>
          </button>
        </div>
        <form class="rl-ask" role="search" @submit.prevent="askSubmit">
          <label class="visually-hidden" for="relay-ask">Ask your agents</label>
          <input id="relay-ask" ref="askInput" v-model="query" class="form-control" type="search" placeholder="Ask your agents…" autocomplete="off" @focus="askOpen = true" @blur="blurAsk" />
          <kbd aria-hidden="true">⌘K</kbd>
          <ul v-if="askOpen && matches.length" class="rl-suggest card" role="listbox" aria-label="Sample questions">
            <li v-for="item in matches" :key="item">
              <button type="button" role="option" class="btn-text theme-primary" @mousedown.prevent @click="pickAsk(item)">{{ item }}</button>
            </li>
          </ul>
        </form>
        <div class="rl-tools">
          <div class="rl-pop">
            <button type="button" class="btn-outline btn-icon theme-primary" :aria-expanded="bellOpen" aria-label="Sample notifications" @click="bellOpen = !bellOpen; roomOpen = false">
              <RelayIcon name="bell" />
            </button>
            <div v-if="bellOpen" class="rl-panel card">
              <p class="rl-panel-title">Sample notifications</p>
              <p v-for="note in notes" :key="note.title"><strong>{{ note.title }}</strong><small>{{ note.body }}</small></p>
            </div>
          </div>
          <button type="button" class="btn-outline btn-icon theme-primary" aria-label="About this sample" @click="openHelp">
            <RelayIcon name="help" />
          </button>
          <div class="rl-pop">
            <button type="button" class="btn-outline theme-primary rl-room" :aria-expanded="roomOpen" aria-haspopup="listbox" @click="roomOpen = !roomOpen; bellOpen = false">
              <i class="rl-dot" aria-hidden="true"></i>{{ room }}
            </button>
            <div v-if="roomOpen" class="rl-panel card" role="listbox" aria-label="Sample rooms">
              <button v-for="name in rooms" :key="name" type="button" class="btn-text theme-primary" role="option" :aria-selected="room === name" @click="chooseRoom(name)">{{ name }}</button>
            </div>
          </div>
        </div>
      </header>

      <div class="rl-body">
        <aside class="rl-side d-none lg:d-flex">
          <RelayRail :section="section" :count="approvals.length" :status="statusText" :ok="!pausedCount" @select="go" @profile="openProfile" />
        </aside>
        <div class="rl-main" :class="{ 'is-page': section !== 'agents' }">
          <template v-if="section === 'agents'">
            <section class="card rl-stage-card rl-rise" aria-labelledby="relay-room-title">
              <div class="rl-stage-head">
                <div>
                  <h2 id="relay-room-title">Agent Control Room</h2>
                  <p>Visualize and manage your AI agents and MCP servers. <span class="badge theme-primary">Sample data</span></p>
                </div>
                <button type="button" class="btn-outline theme-primary rl-fit" :aria-pressed="!focusId" @click="fit">
                  <RelayIcon name="fit" /> Fit view
                </button>
              </div>
              <div ref="stage" class="rl-stage">
                <svg class="rl-wires" :viewBox="`0 0 ${stageBox.w} ${stageBox.h}`" aria-hidden="true">
                  <path v-for="wire in wires" :key="wire.id + '-glow'" :d="wire.d" class="rl-edge-glow" :class="wire.tone" />
                  <path v-for="wire in wires" :key="wire.id" :d="wire.d" class="rl-edge" :class="wire.tone" />
                </svg>
                <div class="rl-agents">
                  <button v-for="(agent, index) in agents" :key="agent.id" type="button" class="card rl-node rl-violet" :class="{ 'is-dim': dimmed(agent.id) }" :data-node="agent.id" data-link="agent" :aria-pressed="focusId === agent.id" :style="{ animationDelay: `${index * 70}ms` }" @click="selectNode(agent.id)">
                    <span class="rl-node-ic"><RelayIcon :name="agent.icon" /></span>
                    <span><strong>{{ agent.name }}</strong><small><i class="rl-dot" aria-hidden="true"></i>{{ agent.status }}</small><small>{{ agent.ago }}</small></span>
                  </button>
                </div>
                <div class="rl-human-wrap">
                  <button type="button" class="rl-human" data-node="human" :aria-pressed="focusId === 'human'" @click="selectNode('human')">
                    <RelayIcon name="user" />
                  </button>
                  <p><strong>You</strong><small>Human</small></p>
                </div>
                <div class="rl-servers">
                  <button v-for="server in servers" :key="server.id" type="button" class="card rl-node rl-teal" :class="{ 'is-dim': dimmed(server.id), paused: server.paused }" :data-node="server.id" data-link="server" :aria-pressed="focusId === server.id" @click="selectNode(server.id)">
                    <span class="rl-node-ic"><RelayIcon :name="server.icon" /></span>
                    <span><strong>{{ server.name }}</strong><small><i class="rl-dot" :class="{ warn: server.paused }" aria-hidden="true"></i>{{ server.paused ? 'Paused' : 'Connected' }}</small><small>{{ server.paused ? 'Sample hold' : `Connected · ${server.latency}` }}</small></span>
                  </button>
                </div>
              </div>
              <p v-if="!wires.length" class="rl-links">Sample links: Research, Code, and Ops connect to you. You connect to Supabase, GitHub, Vercel, and Gmail.</p>
              <ul class="visually-hidden">
                <li v-for="agent in agents" :key="agent.id">{{ agent.name }} is {{ agent.status }} and links to you.</li>
                <li v-for="server in servers" :key="server.id">You link to {{ server.name }}, {{ server.paused ? 'paused' : 'connected' }}, {{ server.latency }}.</li>
              </ul>
            </section>
            <aside class="card rl-approvals rl-rise" aria-labelledby="relay-approvals-title">
              <header class="rl-card-head">
                <h3 id="relay-approvals-title">Pending approvals</h3>
                <span class="badge rounded-pill theme-primary">{{ approvals.length }}</span>
              </header>
              <TransitionGroup name="rl-approval" tag="ul" class="list-group list-group-flush">
                <li v-for="item in approvals" :key="item.id" class="list-group-item">
                  <span class="rl-node-ic"><RelayIcon :name="item.icon" /></span>
                  <span class="rl-approval-copy"><strong>{{ item.agent }}</strong><small>{{ item.text }}</small><small>{{ item.ago }}</small></span>
                  <button type="button" class="btn-solid theme-primary rl-approve" @click="settle(item, 'approved')">Approve <span aria-hidden="true">→</span><span class="visually-hidden">{{ item.agent }}: {{ item.text }}</span></button>
                </li>
              </TransitionGroup>
              <p v-if="!approvals.length" class="rl-empty">No pending sample approvals.</p>
              <button type="button" class="btn-text theme-primary rl-more" @click="go('approvals')">View all approvals →</button>
            </aside>
            <div class="rl-metrics">
              <article class="card rl-metric-card rl-rise">
                <header><h3>Tool calls today</h3><span class="rl-delta">+18%</span></header>
                <p class="rl-metric">{{ shownCalls.toLocaleString('en-US') }}</p>
                <svg class="rl-spark" viewBox="0 0 160 42" role="img" aria-label="Sample tool calls rising through the day">
                  <path :key="'c-area-' + sparkKey" class="rl-spark-area violet" :d="spark(callSeries) + ' L160 42 L0 42 Z'" />
                  <path :key="'c-line-' + sparkKey" class="rl-spark-line violet" :d="spark(callSeries)" />
                </svg>
              </article>
              <article class="card rl-metric-card rl-rise">
                <header><h3>Avg latency</h3></header>
                <p class="rl-metric">{{ latency }} <small>ms</small></p>
                <svg class="rl-spark" viewBox="0 0 160 42" role="img" aria-label="Sample latency trend">
                  <path :key="'l-area-' + sparkKey" class="rl-spark-area teal" :d="spark(latencySeries) + ' L160 42 L0 42 Z'" />
                  <path :key="'l-line-' + sparkKey" class="rl-spark-line teal" :d="spark(latencySeries)" />
                </svg>
              </article>
              <article class="card rl-metric-card rl-rise">
                <header><h3>Success rate</h3></header>
                <p class="rl-metric">{{ success.toFixed(1) }}<small>%</small></p>
                <svg class="rl-spark" viewBox="0 0 160 42" role="img" aria-label="Sample success rate">
                  <path :key="'s-area-' + sparkKey" class="rl-spark-area teal" :d="spark(successSeries) + ' L160 42 L0 42 Z'" />
                  <path :key="'s-line-' + sparkKey" class="rl-spark-line teal" :d="spark(successSeries)" />
                </svg>
              </article>
            </div>
            <section class="card rl-activity rl-rise" aria-labelledby="relay-activity-title">
              <header class="rl-card-head">
                <h3 id="relay-activity-title">Live activity</h3>
                <span class="rl-live"><i class="rl-dot" aria-hidden="true"></i>Live</span>
              </header>
              <TransitionGroup name="rl-feed" tag="ol" class="rl-feed list-group list-group-flush">
                <li v-for="item in feed" :key="item.id" class="list-group-item rl-feed-row">
                  <i class="rl-feed-dot" :class="item.tone" aria-hidden="true"></i>
                  <span><strong>{{ item.agent }}</strong> {{ item.agent === 'You' ? item.call : 'called ' + item.call }}</span>
                  <time :datetime="'2026-10-23T' + item.time">{{ item.time }}</time>
                  <b>{{ item.dur }}</b>
                </li>
              </TransitionGroup>
              <button type="button" class="btn-text theme-primary rl-more" @click="go('runs')">View all runs →</button>
            </section>
          </template>

          <section v-else-if="section === 'servers'" class="card rl-page rl-rise" aria-labelledby="relay-servers-title">
            <h2 id="relay-servers-title">MCP servers</h2>
            <p class="rl-lead">Four sample connections. Pausing one only changes this page.</p>
            <div class="row g-3">
              <div v-for="server in servers" :key="server.id" class="col-12 sm:col-6 xl:col-3">
                <article class="card rl-teal h-100">
                  <div class="card-body">
                    <span class="rl-node-ic"><RelayIcon :name="server.icon" /></span>
                    <h3>{{ server.name }}</h3>
                    <p><i class="rl-dot" :class="{ warn: server.paused }" aria-hidden="true"></i>{{ server.paused ? 'Paused' : 'Connected' }} · {{ server.latency }}</p>
                    <button type="button" class="btn-outline theme-primary" @click="toggleServer(server.id)">{{ server.paused ? 'Resume sample' : 'Pause sample' }}</button>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section v-else-if="section === 'tools'" class="card rl-page rl-rise" aria-labelledby="relay-tools-title">
            <h2 id="relay-tools-title">Tools</h2>
            <p class="rl-lead">Sample tool catalog. Search stays in the browser.</p>
            <label class="visually-hidden" for="relay-tool-search">Search sample tools</label>
            <input id="relay-tool-search" v-model="toolQuery" class="form-control rl-tool-search" type="search" placeholder="Search sample tools…" />
            <div class="table-responsive">
              <table class="table align-middle">
                <thead><tr><th>Tool</th><th>Server</th><th>Agent</th></tr></thead>
                <tbody>
                  <tr v-for="tool in filteredTools" :key="tool.name"><td><code>{{ tool.name }}</code></td><td>{{ tool.server }}</td><td>{{ tool.agent }}</td></tr>
                  <tr v-if="!filteredTools.length"><td colspan="3">No sample tools match. <button type="button" class="btn-text theme-primary" @click="toolQuery = ''">Clear search</button></td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section v-else-if="section === 'runs'" class="card rl-page rl-rise" aria-labelledby="relay-runs-title">
            <h2 id="relay-runs-title">Runs</h2>
            <p class="rl-lead">Sample share of tool calls. The bars are illustrative.</p>
            <div class="rl-bars" role="img" aria-label="Sample calls: Research 46 percent, Code 34 percent, Ops 20 percent">
              <div v-for="(bar, index) in bars" :key="bar.name" class="rl-bar-col">
                <span>{{ bar.value }}%</span>
                <i class="rl-bar" :class="index === 1 ? 'violet' : 'teal'" :style="{ height: bar.value + '%', animationDelay: `${index * 80}ms` }"></i>
                <b>{{ bar.name }}</b>
              </div>
            </div>
            <ol class="rl-feed list-group list-group-flush">
              <li v-for="item in feed" :key="item.id" class="list-group-item rl-feed-row">
                <i class="rl-feed-dot" :class="item.tone" aria-hidden="true"></i>
                <span><strong>{{ item.agent }}</strong> {{ item.agent === 'You' ? item.call : 'called ' + item.call }}</span>
                <time>{{ item.time }}</time>
                <b>{{ item.dur }}</b>
              </li>
            </ol>
          </section>

          <section v-else class="card rl-page rl-rise" aria-labelledby="relay-all-approvals">
            <h2 id="relay-all-approvals">Approvals</h2>
            <p class="rl-lead">Approve or deny locally. No migration or deploy is sent.</p>
            <ul class="list-group">
              <li v-for="item in approvals" :key="item.id" class="list-group-item rl-approval-line">
                <span><strong>{{ item.agent }}</strong><small>{{ item.text }}</small><small>{{ item.ago }}</small></span>
                <span class="rl-approval-actions">
                  <button type="button" class="btn-outline theme-primary" @click="settle(item, 'denied')">Deny {{ item.agent }}</button>
                  <button type="button" class="btn-solid theme-primary" @click="settle(item, 'approved')">Approve {{ item.agent }}</button>
                </span>
              </li>
            </ul>
            <p v-if="!approvals.length" class="rl-empty">No pending sample approvals.</p>
          </section>
        </div>
      </div>
      </div>

      <dialog id="relay-nav-drawer" ref="drawer" class="drawer drawer-start" :inert="!navOpen" aria-labelledby="relay-drawer-title" @toggle="onDrawerToggle">
        <div class="drawer-header">
          <h2 id="relay-drawer-title" class="drawer-title">Relay</h2>
          <button type="button" class="btn-outline theme-primary" @click="drawer?.close()">Close</button>
        </div>
        <div class="drawer-body">
          <RelayRail :section="section" :count="approvals.length" :status="statusText" :ok="!pausedCount" @select="go" @profile="openProfile" />
        </div>
      </dialog>

      <dialog ref="helpDlg" class="dialog" :inert="!helpOpen" aria-labelledby="relay-help-title" @toggle="helpOpen = !!helpDlg?.open">
        <div class="dialog-header">
          <h2 id="relay-help-title" class="dialog-title">Sample control room</h2>
          <button type="button" class="btn-outline theme-primary" @click="helpDlg?.close()">Close</button>
        </div>
        <div class="dialog-body">
          <p>Relay shows example agents, MCP servers, tool calls, and approvals. Nothing is sent to Supabase, GitHub, Vercel, Gmail, or a model.</p>
          <p>Alex Morgan is a placeholder profile. On narrower screens the sidebar opens as a Bootstrap 6 drawer.</p>
        </div>
      </dialog>

      <dialog ref="profileDlg" class="dialog" :inert="!profileOpen" aria-labelledby="relay-profile-title" @toggle="profileOpen = !!profileDlg?.open">
        <div class="dialog-header">
          <h2 id="relay-profile-title" class="dialog-title">Alex Morgan</h2>
          <button type="button" class="btn-outline theme-primary" @click="profileDlg?.close()">Close</button>
        </div>
        <div class="dialog-body">
          <p>alex@morgan.dev is a sample address. No account is connected and no profile is saved.</p>
        </div>
      </dialog>
    </div>
  </div>
</template>
