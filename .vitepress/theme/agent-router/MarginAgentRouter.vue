<script setup>
import { computed, onMounted, onUnmounted, ref, toRef, watch } from 'vue'
import {
  HUMAN_AGENT,
  QUEUES,
  ROUTER_MODEL,
} from './router-data.mjs'
import { routerStatePreset } from './router-state-presets.mjs'
import { useAgentRouterFlow } from './useAgentRouterFlow.mjs'

const props = defineProps({
  motion: { type: Boolean, default: true },
  autoplay: { type: Boolean, default: true },
  state: { type: String, default: '' },
  target: { type: String, default: 'billing' },
})

const isStatic = computed(() => Boolean(props.state))
const reducedMotion = ref(false)
const motion = toRef(props, 'motion')
const autoplay = toRef(props, 'autoplay')
const replayKey = ref(0)

const flow = useAgentRouterFlow({ motion, autoplay, reducedMotion })

const preset = computed(() =>
  isStatic.value ? routerStatePreset(props.state, { target: props.target }) : null,
)

const view = computed(() => {
  if (preset.value) {
    const p = preset.value
    return {
      mode: p.mode,
      intake: p.intake,
      phase: p.phase,
      target: p.target,
      classification: p.classification ?? '',
      confidence: p.confidence ?? 0,
      routedCount: p.routedCount,
      queues: p.queues ?? { billing: [], tech: [], sales: [], human: [] },
      loads: p.loads ?? { billing: 0, tech: 0, sales: 0 },
      error: p.error,
      beam: p.phase === 'routing',
      pulse: p.phase === 'routed' || p.phase === 'escalated' ? p.target : null,
    }
  }
  return {
    mode: 'live',
    intake: flow.intake.value,
    phase: flow.phase.value,
    target: flow.target.value,
    classification: flow.classification.value,
    confidence: flow.confidence.value,
    routedCount: flow.routedCount.value,
    queues: flow.queues.value,
    loads: flow.loads.value,
    error: null,
    beam: flow.beamActive.value,
    pulse: flow.pulseTarget.value,
  }
})

const intakeStatus = computed(() => view.value.intake?.status ?? 'idle')
const showLive = computed(() => !['empty', 'loading', 'error'].includes(view.value.mode))

function fmtLoad(v) {
  return `${Math.round((v ?? 0) * 100)}%`
}

function replay() {
  if (isStatic.value) return
  replayKey.value++
  flow.replay()
}

watch(autoplay, (on) => {
  if (isStatic.value) return
  if (on) flow.replay()
  else flow.stop()
})

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!isStatic.value) {
    flow.start()
  }
})
onUnmounted(() => {
  if (!isStatic.value) flow.stop()
})

defineExpose({ replay })
</script>

<template>
  <article
    :key="isStatic ? state : replayKey"
    class="mg-ar"
    :class="{
      'mg-ar--static': isStatic,
      'mg-ar--motion-off': isStatic || !motion || reducedMotion,
      'mg-ar--empty': view.mode === 'empty',
      'mg-ar--loading': view.mode === 'loading',
      'mg-ar--error': view.mode === 'error',
      [`mg-ar--phase-${view.phase}`]: true,
    }"
    data-tpl="margin"
    aria-label="Agent router"
  >
    <header class="mg-ar__top">
      <div>
        <p class="mg-ar__eyebrow">Support inbox</p>
        <h3 class="mg-ar__title">Agent router</h3>
      </div>
      <div class="mg-ar__routed" aria-live="polite">
        <span class="mg-ar__routed-num">{{ view.routedCount }}</span>
        <span class="mg-ar__routed-label">routed</span>
      </div>
    </header>

    <p v-if="view.mode === 'error'" class="mg-ar__error" role="alert">
      {{ view.error }}
      <button type="button" class="mg-ar__retry">Retry</button>
    </p>

    <div v-if="view.mode === 'empty'" class="mg-ar__empty">
      <p>No requests in the queue.</p>
      <small>New messages from email, chat, and tickets land here first.</small>
    </div>

    <div v-else-if="view.mode === 'loading'" class="mg-ar__loading" aria-busy="true">
      <div class="mg-ar__sk mg-ar__sk--wide" />
      <div class="mg-ar__sk mg-ar__sk--mid" />
      <div class="mg-ar__sk-grid">
        <div v-for="n in 3" :key="n" class="mg-ar__sk mg-ar__sk--lane" />
      </div>
    </div>

    <template v-else-if="showLive">
      <section v-if="view.intake" class="mg-ar__intake" :class="`mg-ar__intake--${intakeStatus}`">
        <h4 class="mg-ar__intake-subject">{{ view.intake.subject }}</h4>
        <p class="mg-ar__intake-meta">
          <span>{{ view.intake.source }}</span>
          <span class="mg-ar__pill">{{ intakeStatus }}</span>
        </p>
      </section>

      <div class="mg-ar__spine" aria-hidden="true">
        <span class="mg-ar__beam" :class="{ 'is-on': view.beam }" />
      </div>

      <section class="mg-ar__router" :class="{ 'is-routing': view.phase === 'routing' }">
        <div class="mg-ar__router-head">
          <span class="mg-ar__dot mg-ar__dot--router" />
          <div>
            <strong>Router</strong>
            <small>{{ ROUTER_MODEL }}</small>
          </div>
          <span v-if="view.classification" class="mg-ar__class">{{ view.classification }}</span>
        </div>
        <label class="mg-ar__conf-label">
          Confidence
          <span>{{ Math.round(view.confidence * 100) }}%</span>
        </label>
        <div class="mg-ar__conf-track" role="progressbar" :aria-valuenow="Math.round(view.confidence * 100)" aria-valuemin="0" aria-valuemax="100">
          <span class="mg-ar__conf-fill" :style="{ '--ar-conf': view.confidence }" />
        </div>
      </section>

      <section class="mg-ar__fork">
        <button type="button" class="mg-ar__escalate" :class="{ 'is-hot': view.phase === 'escalated' }">
          Escalate to human
        </button>
        <div class="mg-ar__human-rail" aria-hidden="true">
          <span class="mg-ar__human-line" :class="{ 'is-on': view.target === 'human' }" />
        </div>
        <article
          class="mg-ar__human"
          :class="{ 'is-lit': view.pulse === 'human' || view.phase === 'escalated' }"
        >
          <span class="mg-ar__dot mg-ar__dot--human" />
          <div>
            <strong>{{ HUMAN_AGENT.name }}</strong>
            <small>{{ HUMAN_AGENT.model }}</small>
          </div>
          <ul v-if="view.queues.human?.length" class="mg-ar__q-list">
            <li v-for="(item, i) in view.queues.human" :key="i" :class="{ fresh: item.fresh }">
              {{ item.title }}
            </li>
          </ul>
        </article>
      </section>

      <div class="mg-ar__lanes">
        <article
          v-for="q in QUEUES"
          :key="q.id"
          class="mg-ar__lane"
          :class="{
            'is-lit': view.pulse === q.id || (view.phase === 'routed' && view.target === q.id),
          }"
          :style="{ '--lane-color': q.color, '--lane-soft': q.soft }"
        >
          <header class="mg-ar__lane-head">
            <span class="mg-ar__dot" :style="{ background: q.color }" />
            <div>
              <strong>{{ q.name }}</strong>
              <small>{{ q.model }}</small>
            </div>
            <span class="mg-ar__load">{{ fmtLoad(view.loads?.[q.id]) }} load</span>
          </header>
          <label class="mg-ar__occ">
            Occupancy
            <span class="mg-ar__occ-track"><span :style="{ width: fmtLoad(view.loads?.[q.id]) }" /></span>
          </label>
          <ul class="mg-ar__q-list" :aria-label="`${q.name} queue`">
            <li
              v-for="(item, i) in view.queues[q.id] ?? []"
              :key="item.id ?? i"
              :class="{ fresh: item.fresh }"
            >
              {{ item.title }}
            </li>
            <li v-if="!(view.queues[q.id] ?? []).length" class="mg-ar__q-empty">No items</li>
          </ul>
        </article>
      </div>
    </template>
  </article>
</template>