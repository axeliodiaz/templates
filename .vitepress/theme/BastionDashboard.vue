<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { reducedMotion, watchReduced, worldDots } from './bastion-motion'

const dots = worldDots()
const cities = [
  { id: 'iad', name: 'Ashburn', x: 208, y: 118, lx: 216, ly: 108 },
  { id: 'ord', name: 'Chicago', x: 172, y: 108, lx: 118, ly: 96 },
  { id: 'ams', name: 'Amsterdam', x: 322, y: 72, lx: 330, ly: 62 },
  { id: 'fra', name: 'Frankfurt', x: 346, y: 78, lx: 354, ly: 92 },
  { id: 'sao', name: 'São Paulo', x: 214, y: 230, lx: 222, ly: 222 },
  { id: 'sin', name: 'Singapore', x: 488, y: 158, lx: 430, ly: 174 },
  { id: 'hkg', name: 'Hong Kong', x: 522, y: 124, lx: 530, ly: 114 },
  { id: 'syd', name: 'Sydney', x: 558, y: 202, lx: 566, ly: 192 },
]
const regions = {
  'us-east-1': { uptime: '99.982', spark: '0,18 12,16 24,17 36,13 48,12 60,9 72,7 84,4', ms: { iad: 12, ord: 18, sao: 45, ams: 15, fra: 15, sin: 67, hkg: 71, syd: 78 } },
  'us-west-2': { uptime: '99.971', spark: '0,16 12,15 24,14 36,16 48,12 60,11 72,8 84,7', ms: { iad: 48, ord: 31, sao: 72, ams: 96, fra: 101, sin: 118, hkg: 109, syd: 142 } },
  'eu-central-1': { uptime: '99.964', spark: '0,14 12,15 24,11 36,12 48,8 60,9 72,6 84,5', ms: { iad: 78, ord: 84, sao: 126, ams: 8, fra: 6, sin: 98, hkg: 104, syd: 168 } },
  'ap-southeast-1': { uptime: '99.901', spark: '0,10 12,12 24,9 36,14 48,11 60,8 72,10 84,6', ms: { iad: 186, ord: 174, sao: 210, ams: 162, fra: 158, sin: 9, hkg: 28, syd: 86 } },
}
const deploys = [
  { hash: 'a7f3c2d', time: '12:42', version: 'v2.17.4', warn: false },
  { hash: 'b81d9e4', time: '11:03', version: 'v2.17.3', warn: false },
  { hash: 'c9b2a1f', time: '09:31', version: 'v2.17.2', warn: false },
  { hash: 'd2e4f6a', time: '08:05', version: 'v2.17.1', warn: true },
]
const seedLogs = [
  ['09:52:11', 'INFO', 'Ops agent health check passed'],
  ['09:52:12', 'INFO', 'All regions nominal'],
  ['09:52:14', 'INFO', 'Worker queue depth: 128'],
  ['09:52:16', 'WARN', 'High CPU on worker (62%)'],
  ['09:52:17', 'INFO', 'Scaling recommendation generated'],
  ['09:52:18', 'INFO', 'Suggested action: scale worker to 4 replicas'],
  ['09:52:19', 'INFO', 'Awaiting operator confirmation…'],
]
const extra = [
  ['INFO', 'Edge probe complete'],
  ['INFO', 'Cache hit ratio 0.91 (sample)'],
  ['INFO', 'db connections 42/200'],
  ['WARN', 'worker queue still above 100'],
  ['INFO', 'Packet loss on ap-southeast-1 within baseline'],
]

const region = ref('us-east-1')
const services = ref([
  { name: 'api', status: 'RUNNING', cpu: 18, mem: 41, ready: 3, total: 3, warn: false },
  { name: 'worker', status: 'RUNNING', cpu: 62, mem: 67, ready: 2, total: 3, warn: true },
  { name: 'db', status: 'RUNNING', cpu: 24, mem: 58, ready: 2, total: 2, warn: false },
  { name: 'cache', status: 'RUNNING', cpu: 11, mem: 32, ready: 2, total: 2, warn: false },
])
let logSeq = 0
const logs = ref(seedLogs.map((row) => ({ id: ++logSeq, t: row[0], lvl: row[1], msg: row[2], fresh: false })))
const paused = ref(false)
const countdown = ref(15)
const spinning = ref(false)
const ready = ref(false)
const agent = ref('pending')
const notice = ref('')
const root = ref(null)
const logEl = ref(null)
const incidentDlg = ref(null)
const deployDlg = ref(null)
const reduced = ref(false)
let timers = []
let clock = 19
let extraIdx = 0
let stopWatch = () => {}

const profile = computed(() => regions[region.value])
const workerWarn = computed(() => services.value.some((s) => s.warn))
const mapDesc = computed(() => cities.map((c) => `${c.name} ${profile.value.ms[c.id]} milliseconds`).join(', '))

function tone(ms) { return ms < 20 ? 'ok' : ms <= 50 ? 'mid' : 'hot' }
function stamp() {
  clock += 1
  const s = clock % 60
  const m = 52 + Math.floor(clock / 60)
  return `09:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
function pushLog(lvl, msg) {
  logs.value.push({ id: ++logSeq, t: stamp(), lvl, msg, fresh: !reduced.value })
  if (logs.value.length > 40) logs.value.shift()
  nextTick(() => { if (logEl.value) logEl.value.scrollTop = logEl.value.scrollHeight })
}
function refresh() {
  spinning.value = true
  const worker = services.value.find((s) => s.name === 'worker')
  services.value = services.value.map((s) => {
    if (s.name === 'worker' && worker?.warn) return { ...s, cpu: Math.min(84, s.cpu + 1) }
    if (s.name === 'worker') return { ...s, cpu: 40 + (s.cpu % 5), mem: 46 }
    return { ...s, cpu: Math.max(8, Math.min(70, s.cpu + ((s.cpu % 3) - 1))) }
  })
  countdown.value = 15
  pushLog('INFO', 'Metrics refresh (sample)')
  window.setTimeout(() => { spinning.value = false }, reduced.value ? 0 : 800)
}
function approve() {
  if (agent.value !== 'pending') return
  const apply = () => {
    services.value = services.value.map((s) => s.name === 'worker' ? { ...s, status: 'RUNNING', cpu: 41, mem: 48, ready: 4, total: 4, warn: false } : s)
    agent.value = 'approved'
    notice.value = 'Scale applied locally. Worker is 4/4. Nothing was sent to a cluster.'
    pushLog('INFO', 'Operator approved scale worker to 4 replicas')
  }
  if (reduced.value) apply()
  else {
    services.value = services.value.map((s) => s.name === 'worker' ? { ...s, status: 'SCALING' } : s)
    pushLog('INFO', 'Operator approved scale worker to 4 replicas')
    timers.push(window.setTimeout(apply, 700))
  }
}
function dismiss() {
  if (agent.value !== 'pending') return
  agent.value = 'dismissed'
  notice.value = 'Suggestion dismissed locally. The sample worker stays at 2/3.'
  pushLog('INFO', 'Operator dismissed scale recommendation')
}
function restore() {
  agent.value = 'pending'
  notice.value = ''
  services.value = services.value.map((s) => s.name === 'worker' ? { ...s, status: 'RUNNING', cpu: 62, mem: 67, ready: 2, total: 3, warn: true } : s)
  pushLog('INFO', 'Sample suggestion restored')
}
function open(dlg) { dlg?.showModal() }

onMounted(() => {
  reduced.value = reducedMotion()
  ready.value = true
  stopWatch = watchReduced((value) => { reduced.value = value })
  timers.push(window.setInterval(() => {
    if (paused.value || reduced.value) return
    const line = extra[extraIdx % extra.length]
    extraIdx += 1
    pushLog(line[0], line[1])
  }, 2800))
  timers.push(window.setInterval(() => {
    if (paused.value) return
    countdown.value -= 1
    if (countdown.value <= 0) refresh()
  }, 1000))
})
onUnmounted(() => { timers.forEach((id) => window.clearInterval(id)); stopWatch() })
</script>

<template>
  <div ref="root" class="bst-root" data-bs-theme="dark">
    <div class="bst" :class="{ 'is-ready': ready }">
      <p class="bst-sample"><strong>SAMPLE</strong><span>Fictitious telemetry. Approve, dismiss, refresh and region changes stay on this page.</span></p>
      <header class="bst-top">
        <div class="bst-brand">BASTION <span class="bst-caret" aria-hidden="true">&gt;_</span></div>
        <p class="bst-nominal"><span class="bst-led" aria-hidden="true"></span>ALL SYSTEMS NOMINAL</p>
        <div class="bst-top-tools">
          <div class="bst-box">
            <div class="bst-region">
              <span id="bst-region-label">REGION</span>
              <select class="form-control" aria-labelledby="bst-region-label" v-model="region">
                <option v-for="name in Object.keys(regions)" :key="name">{{ name }}</option>
              </select>
            </div>
          </div>
          <div class="bst-box" :aria-label="`Uptime ${profile.uptime} percent, sample`">
            <span>UPTIME</span>
            <strong>{{ profile.uptime }}%</strong>
            <svg class="bst-spark" viewBox="0 0 84 24" aria-hidden="true">
              <polyline :points="profile.spark" />
            </svg>
          </div>
        </div>
      </header>

      <div class="row g-2 bst-grid">
        <div class="col-12 lg:col-7">
          <section class="bst-panel" aria-labelledby="bst-map-title">
            <header class="bst-ph" id="bst-map-title"><span>Edge regions</span><span aria-hidden="true">·</span><span>Latency map</span><span class="bst-rule" aria-hidden="true"></span></header>
            <div class="bst-body">
              <svg class="bst-map" viewBox="0 0 640 300" role="img" aria-labelledby="bst-map-title bst-map-desc">
                <title>Sample edge latency</title>
                <desc id="bst-map-desc">{{ mapDesc }}</desc>
                <circle v-for="(d, i) in dots" :key="i" class="dot" :cx="d[0]" :cy="d[1]" r="1.35" />
                <g v-for="c in cities" :key="c.id">
                  <circle class="ping" :class="'stroke-' + tone(profile.ms[c.id])" :cx="c.x" :cy="c.y" r="6" :style="{ animationDelay: (c.x % 7) * 0.15 + 's' }" />
                  <circle class="city" :class="'fill-' + tone(profile.ms[c.id])" :cx="c.x" :cy="c.y" r="3.2" />
                  <text :class="'fill-' + tone(profile.ms[c.id])" :x="c.lx" :y="c.ly">{{ c.id }}</text>
                  <text :class="'fill-' + tone(profile.ms[c.id])" :x="c.lx" :y="c.ly + 12">{{ profile.ms[c.id] }}ms</text>
                </g>
              </svg>
            </div>
            <div class="bst-legend">
              <span><i class="ok" aria-hidden="true"></i>&lt; 20ms</span>
              <span><i class="mid" aria-hidden="true"></i>20–50ms</span>
              <span><i class="hot" aria-hidden="true"></i>&gt; 50ms</span>
            </div>
          </section>
        </div>
        <div class="col-12 lg:col-5">
          <section class="bst-panel" aria-labelledby="bst-svc-title">
            <header class="bst-ph" id="bst-svc-title"><span>Services</span><span aria-hidden="true">·</span><span>Overview</span><span class="bst-rule" aria-hidden="true"></span></header>
            <div class="bst-body">
              <div class="table-responsive">
                <table class="table bst-table">
                  <caption class="bst-sr">Sample service status, CPU, memory and replicas</caption>
                  <thead>
                    <tr>
                      <th scope="col">Service</th>
                      <th scope="col">Status</th>
                      <th scope="col">CPU</th>
                      <th scope="col">Memory</th>
                      <th scope="col">Replicas</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="s in services" :key="s.name">
                      <th scope="row" class="bst-svc">{{ s.name }}</th>
                      <td>
                        <span class="bst-status" :class="{ 'is-warn': s.warn || s.status === 'SCALING' }">
                          <span class="bst-led" :class="{ 'is-amber': s.warn || s.status === 'SCALING' }" aria-hidden="true"></span>
                          {{ s.status }}<span v-if="s.warn"> *</span>
                        </span>
                      </td>
                      <td>
                        <div class="bst-meter-wrap">
                          <div class="progress bst-meter" role="progressbar" :aria-valuenow="s.cpu" aria-valuemin="0" aria-valuemax="100" :aria-label="`${s.name} CPU ${s.cpu} percent`">
                            <div class="progress-bar" :class="s.cpu >= 60 ? 'theme-warning' : 'theme-success'" :style="{ '--w': s.cpu + '%' }"></div>
                          </div>
                          <span class="bst-pct" :class="{ 'is-warn': s.cpu >= 60 }">{{ s.cpu }}%</span>
                        </div>
                      </td>
                      <td>
                        <div class="bst-meter-wrap">
                          <div class="progress bst-meter" role="progressbar" :aria-valuenow="s.mem" aria-valuemin="0" aria-valuemax="100" :aria-label="`${s.name} memory ${s.mem} percent`">
                            <div class="progress-bar theme-success" :style="{ '--w': s.mem + '%' }"></div>
                          </div>
                          <span class="bst-pct">{{ s.mem }}%</span>
                        </div>
                      </td>
                      <td :class="{ 'is-warn': s.ready < s.total }">{{ s.ready }}/{{ s.total }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <footer class="bst-foot">
              <span :class="{ 'is-warn': workerWarn }">{{ workerWarn ? '* High CPU utilization detected' : 'All services inside target' }}</span>
              <button type="button" class="btn-outline theme-success btn-sm" @click="refresh"><span :class="{ 'bst-refresh is-spin': spinning }" aria-hidden="true">↻</span> Refresh {{ countdown }}s</button>
            </footer>
          </section>
        </div>

        <div class="col-12 lg:col-7">
          <section class="bst-panel" aria-labelledby="bst-dep-title">
            <header class="bst-ph" id="bst-dep-title"><span>Deploys</span><span aria-hidden="true">·</span><span>Timeline</span><span class="bst-rule" aria-hidden="true"></span></header>
            <div class="bst-body">
              <div class="bst-time">
                <button v-for="d in deploys" :key="d.hash" type="button" class="bst-node" :class="{ 'is-warn': d.warn }" :aria-label="`${d.hash} deployed ${d.version} at ${d.time}${d.warn ? ', flagged for review' : ''}`" @click="open(deployDlg)">
                  <i aria-hidden="true"></i>
                  <b>{{ d.hash }}</b>
                  <small>{{ d.time }}</small>
                  <small>Deployed {{ d.version }}</small>
                  <small v-if="d.warn">Review</small>
                </button>
              </div>
            </div>
            <footer class="bst-foot">
              <span>Newest on the left. Amber means review, not only color.</span>
              <button type="button" class="bst-linkish" @click="open(deployDlg)">VIEW ALL DEPLOYS →</button>
            </footer>
          </section>
        </div>
        <div class="col-12 lg:col-5">
          <section class="bst-panel bst-inc" aria-labelledby="bst-inc-title">
            <header class="bst-ph" id="bst-inc-title"><span>Incidents</span><span aria-hidden="true">·</span><span>Recent</span><span class="bst-rule" aria-hidden="true"></span></header>
            <div class="bst-body">
              <p><span class="bst-led is-amber" aria-hidden="true"></span> <span class="bst-id">INC-2025-0417-03</span> <span class="bst-badge">RESOLVED</span></p>
              <h3>High latency on ap-southeast-1</h3>
              <p>Root cause: Elevated packet loss on upstream provider.</p>
              <p>Resolved by rerouting traffic via alternate peering.</p>
              <p class="bst-note">Detected Apr 17 09:12 · Resolved Apr 17 09:47</p>
            </div>
            <footer class="bst-foot">
              <span>Sample incident. No paging.</span>
              <button type="button" class="bst-linkish" @click="open(incidentDlg)">VIEW INCIDENT →</button>
            </footer>
          </section>
        </div>

        <div class="col-12 lg:col-7">
          <section class="bst-panel" aria-labelledby="bst-log-title">
            <header class="bst-ph" id="bst-log-title">
              <span>Logs</span><span aria-hidden="true">·</span><span>Tail</span>
              <span class="bst-rule" aria-hidden="true"></span>
              <span class="bst-kicker">(bastion-ops-agent)</span>
            </header>
            <div class="bst-body">
              <ol ref="logEl" class="bst-log" aria-label="Sample log tail. New lines are not announced.">
                <li v-for="line in logs" :key="line.id" :class="{ 'is-new': line.fresh }">
                  <time :datetime="'T' + line.t">{{ line.t }}</time>
                  <span :class="'lvl-' + line.lvl">[{{ line.lvl }}]</span>
                  <span class="msg">{{ line.msg }}</span>
                </li>
              </ol>
            </div>
            <footer class="bst-foot">
              <span>{{ paused ? 'Tail paused' : (reduced ? 'Tail held still (reduced motion)' : 'Tail streaming sample lines') }}</span>
              <button type="button" class="btn-outline theme-success btn-sm" :aria-pressed="paused" @click="paused = !paused">{{ paused ? 'Resume tail' : 'Pause tail' }}</button>
            </footer>
          </section>
        </div>
        <div class="col-12 lg:col-5">
          <section class="bst-panel" aria-labelledby="bst-agent-title">
            <header class="bst-ph" id="bst-agent-title"><span aria-hidden="true">▣</span><span>Bastion ops agent</span><span class="bst-rule" aria-hidden="true"></span></header>
            <div class="bst-body bst-agent-body" v-if="agent === 'pending'" lang="es">
              <div>
                <h3>Ops Agent sugiere escalar worker a 4 réplicas</h3>
                <p>Razones:</p>
                <ul>
                  <li>CPU utilization sostenido &gt; 60% en los últimos 10m</li>
                  <li>Cola de trabajo creciendo (depth: 128)</li>
                </ul>
              </div>
              <div class="bst-actions">
                <button type="button" class="btn-outline theme-success" @click="approve">✓ APPROVE</button>
                <button type="button" class="btn-outline theme-warning" @click="dismiss">✕ DISMISS</button>
              </div>
            </div>
            <div class="bst-body" v-else>
              <p class="bst-result" role="status">{{ notice }}</p>
              <button type="button" class="btn-outline theme-success btn-sm" @click="restore">Restore sample suggestion</button>
            </div>
            <p class="bst-conf" v-if="agent === 'pending'" lang="es">Confianza del agente: 82%</p>
          </section>
        </div>
      </div>

      <dialog ref="incidentDlg" class="dialog bst-dialog" aria-labelledby="bst-inc-dlg">
        <header><h3 id="bst-inc-dlg">INC-2025-0417-03</h3><button type="button" class="btn-outline theme-success btn-sm" @click="incidentDlg?.close()">Close</button></header>
        <div class="bst-dialog-body">
          <p class="bst-badge">RESOLVED</p>
          <p>High latency on ap-southeast-1.</p>
          <p>Root cause: elevated packet loss on the upstream provider. Resolved by rerouting via alternate peering.</p>
          <p class="bst-note">Detected Apr 17 09:12 · Resolved Apr 17 09:47. Sample record only.</p>
        </div>
      </dialog>
      <dialog ref="deployDlg" class="dialog bst-dialog" aria-labelledby="bst-dep-dlg">
        <header><h3 id="bst-dep-dlg">Sample deploys</h3><button type="button" class="btn-outline theme-success btn-sm" @click="deployDlg?.close()">Close</button></header>
        <div class="bst-dialog-body">
          <ul>
            <li v-for="d in deploys" :key="d.hash">{{ d.time }} · {{ d.hash }} · {{ d.version }}<span v-if="d.warn"> · review</span></li>
          </ul>
          <p class="bst-note">Local list. No release was shipped.</p>
        </div>
      </dialog>
    </div>
  </div>
</template>
