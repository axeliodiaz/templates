import { computed, ref } from 'vue'
import { freshModel, AUTOPLAY_STEPS } from './lifecycle-data.mjs'

const SCRIPT = AUTOPLAY_STEPS

/**
 * @param {{ motion: import('vue').Ref<boolean>, autoplay: import('vue').Ref<boolean>, reducedMotion?: import('vue').Ref<boolean>, onLive?: (m: string) => void, onPhaseAnnounce?: (m: string) => void }} opts
 */
export function usePrLifecycleFlow(opts) {
  const model = ref(freshModel())
  const stepIdx = ref(0)
  const playing = ref(false)
  const userPaused = ref(false)
  const pendingQueue = []
  let timers = []
  let gen = 0
  let busy = false
  let currentActionKey = null

  const motionOn = computed(() => opts.motion.value && !opts.reducedMotion?.value)

  function clearTimers() {
    timers.forEach(clearTimeout)
    timers = []
    gen++
    busy = false
    pendingQueue.length = 0
  }

  function dur(ms) {
    return motionOn.value ? ms : 60
  }

  function later(fn, ms) {
    const g = gen
    const t = setTimeout(() => {
      if (g === gen) fn()
    }, dur(ms))
    timers.push(t)
  }

  function cueChange(id) {
    model.value.changedId = id
    later(() => {
      if (model.value.changedId === id) model.value.changedId = null
    }, motionOn.value ? 1500 : 1500)
  }

  function flash(id, kind) {
    model.value.flashId = id
    model.value.flashKind = kind
    cueChange(id)
    later(() => {
      if (model.value.flashId === id) {
        model.value.flashId = null
        model.value.flashKind = null
      }
    }, dur(400))
  }

  function endBusy() {
    busy = false
    if (pendingQueue.length) {
      const next = pendingQueue.shift()
      runSeq(next.key, next.run)
    }
  }

  function queueOrRun(key, run) {
    if (busy) {
      if (pendingQueue.length >= 2) {
        flushFast(run)
        return
      }
      pendingQueue.push({ key, run })
      return
    }
    runSeq(key, run)
  }

  function flushFast(latestRun) {
    gen++
    timers.forEach(clearTimeout)
    timers = []
    busy = false
    pendingQueue.length = 0
    if (currentActionKey && actions[currentActionKey]?.finalize) {
      actions[currentActionKey].finalize()
    }
    later(() => {
      latestRun()
      endBusy()
    }, 60)
  }

  function runSeq(key, run) {
    busy = true
    currentActionKey = key
    run()
    later(endBusy, 650)
  }

  function advance(a, b, bState = 'active') {
    model.value.phases[a] = 'done'
    flash(a, 'pop')
    opts.onPhaseAnnounce?.(`${PHASE_LABEL[a]} done.`)
    later(() => {
      model.value.phases[b] = bState
      flash(b, 'pop')
      if (b === 'checks' && bState === 'active') opts.onPhaseAnnounce?.('Running checks.')
    }, 120)
  }

  const PHASE_LABEL = {
    draft: 'Draft',
    checks: 'Checks',
    review: 'Review',
    resolve: 'Resolve comments',
    approvals: 'Approvals',
    ready: 'Ready to merge',
    merged: 'Merged',
  }

  function backFix() {
    model.value.phases.checks = 'failed'
    model.value.failIdx = 4
    flash('checks', 'shake')
    opts.onPhaseAnnounce?.('Checks failed. Sent back to Draft, 1 time.')
    later(() => {
      model.value.loopFixFly = true
      model.value.drainDraftConn = true
    }, 300)
    later(() => {
      model.value.fixCount += 1
    }, 560)
    later(() => {
      model.value.phases.draft = 'active'
      model.value.checksPassed = 0
      model.value.failIdx = -1
      model.value.phases.checks = 'pending'
      model.value.drainDraftConn = false
      flash('draft', 'pop')
    }, 820)
    later(() => {
      model.value.loopFixHist = true
      model.value.loopFixFly = false
    }, 1300)
  }
  backFix.finalize = () => {
    model.value.phases.checks = 'failed'
    model.value.failIdx = 4
    model.value.fixCount = Math.max(1, model.value.fixCount)
    model.value.loopFixHist = true
    model.value.loopFixFly = false
    model.value.phases.draft = 'active'
    model.value.checksPassed = 0
    model.value.phases.checks = 'pending'
  }

  function changesLoop() {
    model.value.phases.review = 'blocked'
    model.value.openThreads = 3
    model.value.loopChgFly = true
    later(() => {
      model.value.loopChgDown = true
      model.value.changesCount += 1
    }, 300)
    later(() => {
      model.value.phases.resolve = 'active'
      flash('resolve', 'pop')
    }, 780)
    later(() => {
      model.value.openThreads = 2
    }, 1500)
    later(() => {
      model.value.openThreads = 1
    }, 1850)
    later(() => {
      model.value.openThreads = 0
      model.value.phases.resolve = 'done'
      flash('resolve', 'pop')
    }, 2200)
    later(() => {
      model.value.loopChgUp = true
    }, 2500)
    later(() => {
      model.value.phases.review = 'active'
      flash('review', 'pop')
      opts.onPhaseAnnounce?.('Resolve comments done. Review requested again.')
    }, 2980)
    later(() => {
      model.value.loopChgHist = true
      model.value.loopChgDown = false
      model.value.loopChgUp = false
      model.value.loopChgFly = false
    }, 3300)
  }
  changesLoop.finalize = () => {
    model.value.phases.review = 'active'
    model.value.phases.resolve = 'done'
    model.value.openThreads = 0
    model.value.changesCount = Math.max(1, model.value.changesCount)
    model.value.loopChgHist = true
    model.value.loopChgDown = false
    model.value.loopChgUp = false
  }

  function downstreamReset() {
    const order = ['merged', 'ready', 'approvals', 'review', 'checks']
    model.value.downstreamDrain = true
    order.forEach((id, i) => {
      later(() => {
        if (['done', 'active', 'blocked'].includes(model.value.phases[id])) {
          model.value.phases[id] = 'pending'
        }
      }, i * 40)
    })
    later(() => {
      model.value.downstreamDrain = false
      model.value.approvalsHave = 0
      model.value.checksPassed = 0
      model.value.phases.draft = 'active'
      model.value.phases.resolve = 'pending'
      model.value.fixCount += 1
      model.value.loopFixFly = true
      flash('draft', 'pop')
    }, order.length * 40 + 200)
    later(() => {
      model.value.loopFixHist = true
      model.value.loopFixFly = false
    }, 1700)
  }
  downstreamReset.finalize = () => {
    ;['merged', 'ready', 'approvals', 'review', 'checks', 'resolve'].forEach((id) => {
      model.value.phases[id] = 'pending'
    })
    model.value.phases.draft = 'active'
    model.value.approvalsHave = 0
    model.value.checksPassed = 0
    model.value.fixCount += 1
    model.value.loopFixHist = true
    model.value.loopFixFly = false
  }

  const actions = {
    liveStart: {
      run: () => opts.onLive?.('Demo started. Use Pause or Step to control it.'),
    },
    advanceDraftChecks: { run: () => advance('draft', 'checks', 'active') },
    checks2: { run: () => { model.value.checksPassed = 2 } },
    checks4: { run: () => { model.value.checksPassed = 4 } },
    backFix: { run: backFix, finalize: backFix.finalize },
    checks6: {
      run: () => {
        model.value.checksPassed = 6
        model.value.phases.checks = 'done'
        flash('checks', 'pop')
      },
    },
    advanceChecksReview: {
      run: () => {
        model.value.phases.checks = 'done'
        advance('checks', 'review', 'active')
      },
    },
    changesLoop: { run: changesLoop, finalize: changesLoop.finalize },
    advanceReviewApprovals: {
      run: () => {
        model.value.phases.review = 'done'
        model.value.phases.resolve = 'skipped'
        advance('review', 'approvals', 'active')
      },
    },
    approvals1: { run: () => { model.value.approvalsHave = 1 } },
    approvalsBlock: {
      run: () => {
        model.value.phases.approvals = 'blocked'
        flash('approvals', 'pop')
        opts.onPhaseAnnounce?.('Approvals blocked. Needs 1 more approval from @ana.')
      },
    },
    approvals2: {
      run: () => {
        model.value.approvalsHave = 2
        model.value.phases.approvals = 'active'
      },
    },
    advanceApprovalsReady: {
      run: () => {
        model.value.phases.approvals = 'done'
        advance('approvals', 'ready', 'active')
        opts.onPhaseAnnounce?.('Ready to merge.')
      },
    },
    advanceReadyMerged: {
      run: () => {
        model.value.phases.ready = 'done'
        advance('ready', 'merged', 'done')
      },
    },
    finish: {
      run: () => {
        model.value.phases.merged = 'done'
        playing.value = false
        opts.onLive?.('Merged into main.')
      },
    },
  }

  function runStep(i) {
    const row = SCRIPT[i]
    if (!row) return
    const [, key] = row
    const act = actions[key]
    if (act) queueOrRun(key, act.run)
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
    clearTimers,
    downstreamReset,
    demoLabel,
    scriptLength: SCRIPT.length,
    motionOn,
  }
}