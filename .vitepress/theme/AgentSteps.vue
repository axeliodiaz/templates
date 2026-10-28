<script setup lang="ts">
// Agent steps: vertical step list with a progressively drawn connector, a pulsing
// active marker, a shimmering working label and pending/completed/approval states.
// Local simulation only; fictitious data. Reinterpreted from a public reference
// video (see the demo pages for the link); no code or assets copied.
import { computed, onBeforeUnmount, ref } from 'vue'

const props = defineProps<{ theme?: string }>()

type Tokens = { bg: string; surf: string; ink: string; mut: string; line: string; acc: string; onAcc: string; warn: string; font: string; r: string }
const T: Record<string, Tokens> = {
  lustro:     { bg: '#131322', surf: '#202039', ink: '#f4f2ff', mut: '#b8b5cd', line: '#44445e', acc: '#a799ff', onAcc: '#171332', warn: '#fbbf24', font: "'DM Sans',sans-serif", r: '14px' },
  felix:      { bg: '#f7f5ed', surf: '#fff',    ink: '#193e35', mut: '#536f64', line: '#c5d4ce', acc: '#087b68', onAcc: '#fff',    warn: '#c9772b', font: "'Inter',sans-serif", r: '16px' },
  lumen:      { bg: '#f8f8f5', surf: '#fff',    ink: '#252b38', mut: '#606675', line: '#d9dbe3', acc: '#6653c4', onAcc: '#fff',    warn: '#e08a1e', font: "'Inter',sans-serif", r: '9px' },
  scopecraft: { bg: '#fafafa', surf: '#fff',    ink: '#202020', mut: '#626262', line: '#dddddd', acc: '#252525', onAcc: '#fff',    warn: '#9a6a00', font: "ui-sans-serif,system-ui,sans-serif", r: '8px' },
  pulsefit:   { bg: '#faf8f1', surf: '#fff',    ink: '#272721', mut: '#68665b', line: '#d9d4c3', acc: '#aa7300', onAcc: '#fff',    warn: '#8a5a00', font: "'Rubik',sans-serif", r: '12px' },
  pawprint:   { bg: '#fbf6ee', surf: '#fff',    ink: '#2a2a35', mut: '#7a7264', line: '#e7dcc8', acc: '#2f6db5', onAcc: '#fff',    warn: '#c98a1f', font: "'Nunito',sans-serif", r: '16px' },
  relay:      { bg: '#070910', surf: '#141624', ink: '#f4f6fb', mut: '#b7c0d6', line: '#3a3458', acc: '#6d4dff', onAcc: '#fff',    warn: '#f0c36d', font: "'DM Sans',sans-serif", r: '16px' },
  folio:      { bg: '#232423', surf: '#2a2c2a', ink: '#edf0eb', mut: '#b5bdb5', line: '#414641', acc: '#a7d9c5', onAcc: '#163f35', warn: '#edc17a', font: "'DM Sans',sans-serif", r: '10px' },
  pace:       { bg: '#f5f8f4', surf: '#fff',    ink: '#173528', mut: '#52665a', line: '#cfdcd3', acc: '#23724e', onAcc: '#fff',    warn: '#8a5a00', font: "'DM Sans',sans-serif", r: '12px' },
  spark:      { bg: '#252525', surf: '#2c2c2c', ink: '#f0efeb', mut: '#b8b9b4', line: '#444444', acc: '#ff953f', onAcc: '#2b1506', warn: '#edcc7b', font: "'DM Sans',sans-serif", r: '8px' },
  bastion:    { bg: '#061108', surf: '#0a1c0f', ink: '#c8f7c2', mut: '#8fbf8a', line: '#1c5a32', acc: '#62f56a', onAcc: '#061108', warn: '#ffb000', font: "'JetBrains Mono',ui-monospace,monospace", r: '0' },
}
const v = computed(() => T[props.theme || 'lustro'] || T.lustro)
const cssVars = computed(() => ({
  '--as-bg': v.value.bg, '--as-surf': v.value.surf, '--as-ink': v.value.ink, '--as-mut': v.value.mut,
  '--as-line': v.value.line, '--as-acc': v.value.acc, '--as-on': v.value.onAcc, '--as-warn': v.value.warn,
  '--as-font': v.value.font, '--as-r': v.value.r,
}))

type Sub = { t: string; ms: number }
type Step = { t: string; ms: number; subs?: Sub[]; approval?: boolean; dur?: string }
const STEPS: Step[] = [
  { t: 'Collect fee data', ms: 1400, dur: '12s' },
  { t: 'Compare validators', ms: 1600, dur: '18s' },
  { t: 'Draft the report', ms: 0, dur: '41s', subs: [
    { t: 'Pulled 24 sources', ms: 700 },
    { t: 'Wrote fee overview', ms: 900 },
    { t: 'Writing validator section', ms: 1500 },
  ] },
  { t: 'Check every number', ms: 1300, dur: '9s' },
  { t: 'Send to team', ms: 0, approval: true },
]

const running = ref(false), awaiting = ref(false), done = ref(false)
const current = ref(-1)           // index of the active step
const currentSub = ref(-1)        // index of the active sub-step inside the active step
const completed = ref<number[]>([])
const completedSubs = ref<string[]>([])   // "stepIdx-subIdx"
const fillMs = ref<Record<number, number>>({})  // connector i draws over N ms
const status = ref('Ready. Local simulation only - nothing runs or sends.')
let token = 0, timer: ReturnType<typeof setTimeout> | undefined

const stepState = (i: number) =>
  completed.value.includes(i) ? 'done' : i === current.value ? (STEPS[i].approval ? 'approval' : 'active') : 'pending'
const subState = (si: number, i: number) =>
  completedSubs.value.includes(`${si}-${i}`) ? 'done' : si === current.value && i === currentSub.value ? 'active' : 'pending'
// Connector leaving step i draws while step i is active, stays full once it is done.
const fillOn = (i: number) => completed.value.includes(i) || i === current.value

function later(fn: () => void, ms: number, mine: number) {
  timer = setTimeout(() => { if (mine === token) fn() }, ms)
}
function stop(msg = 'Simulation stopped.') {
  token++; if (timer) clearTimeout(timer); timer = undefined
  running.value = false; awaiting.value = false
  status.value = msg
}
function reset() {
  stop('Ready. Local simulation only - nothing runs or sends.')
  current.value = -1; currentSub.value = -1; completed.value = []; completedSubs.value = []; fillMs.value = {}; done.value = false
}
function run() {
  if (running.value) { stop(); return }
  reset(); running.value = true
  const mine = token
  advance(0, mine)
}
function advance(i: number, mine: number) {
  if (mine !== token) return
  if (i >= STEPS.length) {
    running.value = false; done.value = true
    status.value = 'Simulation complete: 5 steps finished. Nothing was sent.'
    return
  }
  current.value = i; currentSub.value = -1
  const s = STEPS[i]
  if (s.approval) {
    awaiting.value = true
    status.value = `"${s.t}" asks before acting. Approve to finish the demo.`
    return
  }
  status.value = `Working: ${s.t}`
  if (s.subs) {
    fillMs.value = { ...fillMs.value, [i]: s.subs.reduce((a, b) => a + b.ms, 0) }
    advanceSub(i, 0, mine)
    return
  }
  fillMs.value = { ...fillMs.value, [i]: s.ms }
  later(() => completeStep(i, mine), s.ms, mine)
}
function advanceSub(si: number, i: number, mine: number) {
  if (mine !== token) return
  const subs = STEPS[si].subs!
  if (i >= subs.length) { completeStep(si, mine); return }
  currentSub.value = i
  status.value = `Working: ${STEPS[si].t} - ${subs[i].t}`
  later(() => {
    completedSubs.value = [...completedSubs.value, `${si}-${i}`]
    advanceSub(si, i + 1, mine)
  }, subs[i].ms, mine)
}
function completeStep(i: number, mine: number) {
  if (mine !== token) return
  completed.value = [...completed.value, i]
  current.value = -1; currentSub.value = -1
  advance(i + 1, mine)
}
function approve() {
  if (!awaiting.value) return
  const mine = token
  awaiting.value = false
  completed.value = [...completed.value, current.value]
  current.value = -1
  advance(STEPS.length, mine)
}
onBeforeUnmount(() => { token++; if (timer) clearTimeout(timer) })
</script>

<template>
  <section class="as" :style="cssVars" aria-label="Agent run example">
    <header class="as-top">
      <div><span class="as-eyebrow">AGENT RUN</span><b>Fee review report</b><span class="as-chip">{{ done ? 'Complete' : running ? 'Running' : 'Draft' }}</span></div>
      <div class="as-actions">
        <button type="button" class="as-btn" @click="run">{{ running ? 'Stop simulation' : 'Run simulation' }}</button>
        <button type="button" class="as-btn as-ghost" :disabled="!running && current === -1 && !completed.length && !done" @click="reset">Reset</button>
      </div>
    </header>

    <ol class="as-list">
      <li v-for="(s, i) in STEPS" :key="s.t" class="as-step" :class="stepState(i)" :aria-current="i === current ? 'step' : undefined">
        <span class="as-rail" aria-hidden="true">
          <span class="as-node">
            <svg v-if="stepState(i) === 'done'" viewBox="0 0 12 12"><path d="M2.2 6.4 4.8 9 9.8 3.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else-if="s.approval" viewBox="0 0 12 12"><rect x="2.5" y="5.2" width="7" height="5" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M4 5.2V3.8a2 2 0 0 1 4 0v1.4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>
            <i v-else></i>
          </span>
          <span v-if="i < STEPS.length - 1" class="as-track">
            <span class="as-fill" :class="{ on: fillOn(i) }" :style="{ transitionDuration: (fillMs[i] || 700) + 'ms' }"></span>
          </span>
        </span>
        <div class="as-body">
          <div class="as-row">
            <b>{{ s.t }}</b>
            <span v-if="stepState(i) === 'done' && s.dur" class="as-dur">{{ s.dur }}</span>
            <span v-else-if="i === current && !s.approval" class="as-status"><span class="as-shimmer">{{ s.subs ? (currentSub >= 0 && s.subs[currentSub] ? (currentSub >= s.subs.length - 1 ? 'Writing' : 'Working') : 'Working') : 'Working' }}</span></span>
            <span v-else-if="s.approval" class="as-ask">{{ stepState(i) === 'done' ? 'Approved (simulated)' : 'Asks first' }}</span>
          </div>
          <ol v-if="s.subs" class="as-subs" aria-label="Sub-steps of Draft the report">
            <li v-for="(sub, j) in s.subs" :key="sub.t" class="as-sub" :class="subState(i, j)">
              <span class="as-dot" aria-hidden="true"></span>
              <span :class="{ 'as-shimmer': subState(i, j) === 'active' && j === s.subs.length - 1 }">{{ sub.t }}</span>
            </li>
          </ol>
        </div>
      </li>
    </ol>

    <footer class="as-foot">
      <p class="as-note" role="status" aria-live="polite">{{ status }}</p>
      <button v-if="awaiting" type="button" class="as-btn" @click="approve">Approve (simulated)</button>
      <p class="as-fine">Demo only. The run is a local animation; no agent executes and nothing leaves this page.</p>
    </footer>
  </section>
</template>
