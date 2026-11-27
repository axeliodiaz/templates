import { computed, ref } from 'vue'
import {
  TARGET,
  fixupCount,
  initialCommits,
  squashedCommits,
} from './commit-data.mjs'

/** @param {{ motion: import('vue').Ref<boolean>, autoplay: import('vue').Ref<boolean> }} opts */
export function useSquashFlow(opts) {
  const phase = ref('loading')
  const visibleRows = ref(structuredClone(initialCommits))
  const collapsing = ref(new Set())
  const pushProgress = ref(0)
  const checksState = ref('idle')
  const squashBtnVisible = ref(true)
  let timers = []
  let pushRaf = 0
  let pushStart = 0
  let autoplayGen = 0
  let userTookOver = false

  const motionOn = computed(() => opts.motion.value && !opts.reducedMotion?.value)

  function clearTimers() {
    timers.forEach(clearTimeout)
    timers = []
  }
  function later(fn, ms) {
    const id = setTimeout(fn, ms)
    timers.push(id)
    return id
  }
  function dur(ms) {
    return motionOn.value ? ms : Math.min(ms, 80)
  }

  const commitCount = computed(() =>
    visibleRows.value.filter((r) => r.kind !== 'base').length,
  )
  const showRows = computed(() => phase.value !== 'loading')
  const isPurple = computed(() => phase.value === 'done')
  const footerMode = computed(() => {
    if (phase.value === 'expanded' && squashBtnVisible.value && !collapsing.value.size)
      return 'squash'
    if (phase.value === 'squashing') return 'rebasing'
    if (phase.value === 'squashed' || phase.value === 'pushing') return 'push'
    if (phase.value === 'done') return 'done'
    return 'hidden'
  })

  function scheduleAutoplay(gen) {
    if (!opts.autoplay.value) return
    later(() => {
      if (gen !== autoplayGen || userTookOver) return
      if (phase.value === 'expanded') runSquash(true)
    }, dur(1600))
  }

  function startLoading() {
    autoplayGen++
    const gen = autoplayGen
    userTookOver = false
    phase.value = 'loading'
    visibleRows.value = structuredClone(initialCommits)
    collapsing.value = new Set()
    pushProgress.value = 0
    checksState.value = 'idle'
    squashBtnVisible.value = true
    later(() => {
      phase.value = 'expanded'
      scheduleAutoplay(gen)
    }, dur(2000))
  }

  function runSquash(fromAutoplay = false) {
    if (phase.value !== 'expanded') return
    if (!fromAutoplay) userTookOver = true
    squashBtnVisible.value = false
    later(() => {
      phase.value = 'squashing'
    }, dur(fromAutoplay ? 0 : 120))
    const toRemove = initialCommits.filter((r) => r.kind === 'fixup' || r.kind === 'wip')
    const stagger = dur(50)
    toRemove.forEach((row, i) => {
      later(() => {
        collapsing.value = new Set([...collapsing.value, row.id])
        later(() => {
          visibleRows.value = visibleRows.value.filter((r) => r.id !== row.id)
          const next = new Set(collapsing.value)
          next.delete(row.id)
          collapsing.value = next
        }, dur(260))
      }, i * stagger)
    })
    const total = toRemove.length * stagger + dur(520)
    later(() => {
      visibleRows.value = structuredClone(squashedCommits)
      phase.value = 'squashed'
      if (opts.autoplay.value && !userTookOver) {
        later(() => startPush(true), dur(700))
      }
    }, total)
  }

  function cancelPush() {
    if (pushRaf) cancelAnimationFrame(pushRaf)
    pushRaf = 0
    pushProgress.value = 0
    if (phase.value === 'pushing') phase.value = 'squashed'
  }

  function finishPush() {
    pushProgress.value = 1
    phase.value = 'done'
    checksState.value = 'running'
    later(() => {
      checksState.value = 'passed'
    }, dur(3000))
  }

  function animatePush() {
    pushStart = performance.now()
    const duration = dur(2000)
    const tick = (now) => {
      const t = Math.min(1, (now - pushStart) / duration)
      pushProgress.value = t
      if (t < 1) pushRaf = requestAnimationFrame(tick)
      else {
        pushRaf = 0
        finishPush()
      }
    }
    pushRaf = requestAnimationFrame(tick)
  }

  function startPush(fromAutoplay = false) {
    if (phase.value !== 'squashed') return
    if (!fromAutoplay) userTookOver = true
    phase.value = 'pushing'
    pushProgress.value = 0
    animatePush()
  }

  function replay() {
    clearTimers()
    cancelPush()
    startLoading()
  }

  function teardown() {
    clearTimers()
    cancelPush()
  }

  return {
    TARGET,
    fixupCount: fixupCount,
    phase,
    visibleRows,
    collapsing,
    pushProgress,
    checksState,
    commitCount,
    showRows,
    isPurple,
    footerMode,
    runSquash,
    startPush,
    cancelPush,
    startLoading,
    replay,
    teardown,
  }
}