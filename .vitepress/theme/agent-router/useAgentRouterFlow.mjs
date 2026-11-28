import { computed, ref } from 'vue'
import { QUEUES, SCENARIOS, SEED_QUEUE_ITEMS } from './router-data.mjs'

/**
 * @param {{ motion: import('vue').Ref<boolean>, autoplay: import('vue').Ref<boolean>, reducedMotion?: import('vue').Ref<boolean> }} opts
 */
export function useAgentRouterFlow(opts) {
  const phase = ref('idle')
  const scenarioIdx = ref(0)
  const intake = ref(null)
  const target = ref(null)
  const confidence = ref(0)
  const classification = ref('')
  const routedCount = ref(11)
  const beamActive = ref(false)
  const pulseTarget = ref(null)
  const queues = ref(structuredClone(SEED_QUEUE_ITEMS))
  const loads = ref({ billing: 0.42, tech: 0.38, sales: 0.25 })
  let timers = []
  let autoplayGen = 0

  const motionOn = computed(() => opts.motion.value && !opts.reducedMotion?.value)

  function clearTimers() {
    timers.forEach(clearTimeout)
    timers = []
  }
  function later(fn, ms) {
    const id = setTimeout(fn, ms)
    timers.push(id)
  }
  function dur(ms) {
    return motionOn.value ? ms : 60
  }

  function applyScenario(s) {
    intake.value = {
      subject: s.subject,
      source: s.source,
      status: 'new',
    }
    classification.value = s.classification
    confidence.value = 0
    target.value = s.target
  }

  function runScenario(gen) {
    const s = SCENARIOS[scenarioIdx.value % SCENARIOS.length]
    applyScenario(s)
    phase.value = 'intake'
    intake.value.status = 'new'

    later(() => {
      if (gen !== autoplayGen) return
      phase.value = 'routing'
      intake.value = { ...intake.value, status: 'routing' }
      beamActive.value = true
      const goal = s.confidence
      const steps = motionOn.value ? 12 : 1
      let step = 0
      const tick = () => {
        step++
        confidence.value = Math.min(goal, (step / steps) * goal)
        if (step < steps) {
          later(tick, dur(80))
        } else {
          finishRoute(gen, s)
        }
      }
      later(tick, dur(400))
    }, dur(900))
  }

  function finishRoute(gen, s) {
    if (gen !== autoplayGen) return
    phase.value = s.escalate ? 'escalated' : 'routed'
    intake.value = {
      ...intake.value,
      status: s.escalate ? 'escalated' : 'routed',
    }
    confidence.value = s.confidence
    pulseTarget.value = s.target
    routedCount.value += 1
    const item = { id: `${s.id}-q`, title: s.subject, fresh: true }
    if (s.target === 'human') {
      queues.value.human = [item, ...queues.value.human].slice(0, 4)
    } else {
      queues.value[s.target] = [item, ...queues.value[s.target]].slice(0, 4)
      loads.value[s.target] = Math.min(0.92, loads.value[s.target] + 0.12)
    }
    later(() => {
      pulseTarget.value = null
    }, dur(1200))

    later(() => {
      if (gen !== autoplayGen) return
      beamActive.value = false
      scenarioIdx.value += 1
      if (opts.autoplay.value) runScenario(gen)
      else phase.value = 'idle'
    }, dur(2200))
  }

  function start() {
    clearTimers()
    autoplayGen++
    const gen = autoplayGen
    queues.value = structuredClone(SEED_QUEUE_ITEMS)
    loads.value = { billing: 0.42, tech: 0.38, sales: 0.25 }
    routedCount.value = 11
    scenarioIdx.value = 0
    if (opts.autoplay.value) runScenario(gen)
    else {
      phase.value = 'idle'
      intake.value = null
    }
  }

  function replay() {
    start()
  }

  function stop() {
    clearTimers()
    autoplayGen++
  }

  return {
    QUEUES,
    phase,
    intake,
    target,
    confidence,
    classification,
    routedCount,
    beamActive,
    pulseTarget,
    queues,
    loads,
    start,
    replay,
    stop,
  }
}