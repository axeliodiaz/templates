import { computed, ref } from 'vue'
import { freshModel, SPINE } from './lifecycle-data.mjs'

const SCRIPT = [
  [1400, 'liveStart'],
  [900, 'advanceDraftChecks'],
  [700, 'checks2'],
  [700, 'checks4'],
  [1600, 'backFix'],
  [900, 'advanceDraftChecks'],
  [700, 'checks2'],
  [700, 'checks4'],
  [900, 'checks6'],
  [1200, 'advanceChecksReview'],
  [3600, 'changesLoop'],
  [1000, 'advanceReviewApprovals'],
  [2000, 'approvals1'],
  [2200, 'approvalsBlock'],
  [700, 'approvals2'],
  [1300, 'advanceApprovalsReady'],
  [600, 'advanceReadyMerged'],
  [0, 'finish'],
]

/**
 * @param {{ motion: import('vue').Ref<boolean>, autoplay: import('vue').Ref<boolean>, reducedMotion?: import('vue').Ref<boolean>, onLive?: (m: string) => void }} opts
 */
export function usePrLifecycleFlow(opts) {
  const model = ref(freshModel())
  const stepIdx = ref(0)
  const playing = ref(false)
  const userPaused = ref(false)
  const pendingQueue = ref([])
  let timers = []
  let gen = 0
  let busy = false

  const motionOn = computed(() => opts.motion.value && !opts.reducedMotion?.value)

  function clearTimers() {
    timers.forEach(clearTimeout)
    timers = []
    gen++
  }

  function dur(ms) {
    return motionOn.value ? ms : Math.min(ms, 60)
  }

  function later(fn, ms) {
    const g = gen
    const t = setTimeout(() => {
      if (g === gen) fn()
    }, dur(ms))
    timers.push(t)
  }

  function queueOrRun(fn) {
    if (busy) {
      if (pendingQueue.value.length >= 2) {
        flushFast()
      }
      pendingQueue.value.push(fn)
      if (pendingQueue.value.length > 2) pendingQueue.value = pendingQueue.value.slice(-2)
      drainQueue()
      return
    }
    runSeq(fn)
  }

  function drainQueue() {
    if (busy || !pendingQueue.value.length) return
    const fn = pendingQueue.value.shift()
    runSeq(fn)
  }

  function flushFast() {
    pendingQueue.value = []
    gen++
    busy = false
  }

  function runSeq(fn) {
    busy = true
    fn()
    later(() => {
      busy = false
      drainQueue()
    }, dur(650))
  }

  function advance(a, b, bState = 'active') {
    model.value.phases[a] = 'done'
    later(() => {
      model.value.phases[b] = bState
    }, dur(410))
  }

  function backFix() {
    model.value.phases.checks = 'failed'
    model.value.failIdx = 4
    model.value.loopFixLit = true
    later(() => {
      model.value.drainDraftConn = true
    }, dur(300))
    later(() => {
      model.value.fixCount += 1
    }, dur(560))
    later(() => {
      model.value.phases.draft = 'active'
      model.value.checksPassed = 0
      model.value.failIdx = -1
      model.value.phases.checks = 'pending'
      model.value.drainDraftConn = false
    }, dur(820))
    later(() => {
      model.value.loopFixHist = true
      model.value.loopFixLit = false
    }, dur(1300))
  }

  function changesLoop() {
    model.value.phases.review = 'blocked'
    model.value.openThreads = 3
    model.value.loopChgDown = true
    later(() => {
      model.value.changesCount += 1
    }, dur(560))
    later(() => {
      model.value.phases.resolve = 'active'
    }, dur(780))
    later(() => {
      model.value.openThreads = 2
    }, dur(1500))
    later(() => {
      model.value.openThreads = 1
    }, dur(1850))
    later(() => {
      model.value.openThreads = 0
      model.value.phases.resolve = 'done'
    }, dur(2200))
    later(() => {
      model.value.loopChgUp = true
    }, dur(2500))
    later(() => {
      model.value.phases.review = 'active'
    }, dur(2980))
    later(() => {
      model.value.loopChgHist = true
      model.value.loopChgDown = false
      model.value.loopChgUp = false
    }, dur(3300))
  }

  /** Downstream reset when a new push lands (spec §2.8.4) */
  function downstreamReset() {
    const order = ['merged', 'ready', 'approvals', 'resolve', 'review', 'checks']
    order.forEach((id, i) => {
      later(() => {
        if (model.value.phases[id] === 'done' || model.value.phases[id] === 'active') {
          model.value.phases[id] = 'pending'
        }
      }, i * dur(40))
    })
    model.value.approvalsHave = 0
    model.value.checksPassed = 0
    model.value.phases.draft = 'active'
    model.value.fixCount += 1
    model.value.loopFixLit = true
    later(() => {
      model.value.loopFixHist = true
      model.value.loopFixLit = false
    }, dur(1700))
  }

  const actions = {
    liveStart() {
      opts.onLive?.('Demo started. Use Pause or Step to control it.')
    },
    advanceDraftChecks: () => advance('draft', 'checks', 'active'),
    checks2: () => {
      model.value.checksPassed = 2
    },
    checks4: () => {
      model.value.checksPassed = 4
    },
    backFix,
    checks6: () => {
      model.value.checksPassed = 6
      model.value.phases.checks = 'done'
    },
    advanceChecksReview: () => {
      model.value.phases.checks = 'done'
      advance('checks', 'review', 'active')
    },
    changesLoop,
    advanceReviewApprovals: () => {
      model.value.phases.review = 'done'
      model.value.phases.resolve = 'skipped'
      advance('review', 'approvals', 'active')
    },
    approvals1: () => {
      model.value.approvalsHave = 1
    },
    approvalsBlock: () => {
      model.value.phases.approvals = 'blocked'
    },
    approvals2: () => {
      model.value.approvalsHave = 2
      model.value.phases.approvals = 'active'
    },
    advanceApprovalsReady: () => {
      model.value.phases.approvals = 'done'
      advance('approvals', 'ready', 'active')
    },
    advanceReadyMerged: () => {
      model.value.phases.ready = 'done'
      advance('ready', 'merged', 'done')
    },
    finish: () => {
      model.value.phases.merged = 'done'
      playing.value = false
      opts.onLive?.('Merged into main.')
    },
  }

  function runStep(i) {
    const row = SCRIPT[i]
    if (!row) return
    const [, key] = row
    const fn = actions[key]
    if (fn) queueOrRun(fn)
    stepIdx.value = i
  }

  function runFrom(i) {
    if (!playing.value || i >= SCRIPT.length) {
      if (i >= SCRIPT.length) playing.value = false
      return
    }
    runStep(i)
    const [wait] = SCRIPT[i]
    later(() => runFrom(i + 1), wait)
  }

  function play() {
    if (!motionOn.value) return
    playing.value = true
    userPaused.value = false
    runFrom(stepIdx.value)
  }

  function pause() {
    playing.value = false
    userPaused.value = true
    clearTimers()
    busy = false
    pendingQueue.value = []
  }

  function replay() {
    clearTimers()
    model.value = freshModel()
    stepIdx.value = 0
    userPaused.value = false
    playing.value = true
    if (motionOn.value) runFrom(0)
  }

  function step() {
    clearTimers()
    playing.value = false
    if (stepIdx.value >= SCRIPT.length - 1) return
    const next = stepIdx.value + 1
    runStep(next)
    stepIdx.value = next
  }

  function resetLive() {
    clearTimers()
    model.value = freshModel()
    stepIdx.value = 0
    playing.value = false
    pendingQueue.value = []
    busy = false
  }

  const demoLabel = computed(() => {
    if (!motionOn.value) return 'Demo · autoplay off (reduced motion) — use Step'
    if (!playing.value && stepIdx.value >= SCRIPT.length - 1)
      return 'Demo finished · Replay to run again'
    if (userPaused.value) return 'Demo paused'
    if (playing.value) return `Demo · step ${stepIdx.value + 1} of ${SCRIPT.length}`
    return 'Demo · autoplay'
  })

  return {
    model,
    stepIdx,
    playing,
    userPaused,
    play,
    pause,
    replay,
    step,
    resetLive,
    clearTimers,
    downstreamReset,
    demoLabel,
    scriptLength: SCRIPT.length,
    motionOn,
  }
}