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
      errorTitle: p.errorTitle ?? '',
      errorDetail: p.errorDetail ?? '',
      retrySeconds: p.retrySeconds ?? 12,
      retryProgress: p.retryProgress ?? 0.35,
      paused: p.paused ?? false,
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
    errorTitle: '',
    errorDetail: '',
    retrySeconds: 12,
    retryProgress: 0,
    paused: false,
    beam: flow.beamActive.value,
    pulse: flow.pulseTarget.value,
  }
})

const mode = computed(() => view.value.mode)
const isEmpty = computed(() => mode.value === 'empty')
const isLoading = computed(() => mode.value === 'loading')
const isError = computed(() => mode.value === 'error')
const isLive = computed(() => mode.value === 'live')
const intakeStatus = computed(() => view.value.intake?.status ?? (isEmpty.value ? 'empty' : 'idle'))

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
      'mg-ar--empty': isEmpty,
      'mg-ar--loading': isLoading,
      'mg-ar--error': isError,
      'mg-ar--paused': view.paused,
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

    <!-- Intake -->
    <section
      v-if="isEmpty"
      class="mg-ar__intake mg-ar__intake--empty"
      aria-label="Intake queue"
    >
      <span class="mg-ar__empty-icon" aria-hidden="true">◎</span>
      <h4 class="mg-ar__empty-title">No requests in the queue</h4>
      <p class="mg-ar__empty-copy">New email, chat, and ticket messages land here first.</p>
    </section>

    <section v-else-if="isLoading" class="mg-ar__intake mg-ar__intake--sk" aria-busy="true" aria-label="Loading intake">
      <span class="mg-ar__sk-line mg-ar__sk-line--lg" />
      <span class="mg-ar__sk-line mg-ar__sk-line--sm" />
    </section>

    <section
      v-else-if="view.intake"
      class="mg-ar__intake"
      :class="[`mg-ar__intake--${intakeStatus}`, { 'mg-ar__intake--danger': isError }]"
    >
      <h4 class="mg-ar__intake-subject">{{ view.intake.subject }}</h4>
      <p class="mg-ar__intake-meta">
        <span>{{ view.intake.source }}</span>
        <span class="mg-ar__pill" :class="{ 'mg-ar__pill--danger': isError }">{{ intakeStatus }}</span>
      </p>
    </section>

    <div class="mg-ar__spine" aria-hidden="true">
      <span class="mg-ar__beam" :class="{ 'is-on': view.beam && !view.paused }" />
    </div>

    <!-- Router -->
    <section
      v-if="isLoading"
      class="mg-ar__router mg-ar__router--sk"
      aria-busy="true"
      aria-label="Loading router"
    >
      <span class="mg-ar__sk-line mg-ar__sk-line--md" />
      <span class="mg-ar__sk-track" />
    </section>

    <section
      v-else-if="isEmpty"
      class="mg-ar__router mg-ar__router--idle"
    >
      <div class="mg-ar__router-head">
        <span class="mg-ar__dot mg-ar__dot--router" />
        <div>
          <strong>Router</strong>
          <small>{{ ROUTER_MODEL }}</small>
        </div>
      </div>
      <p class="mg-ar__router-idle">Waiting for the next intake…</p>
    </section>

    <section
      v-else-if="isError"
      class="mg-ar__router mg-ar__router--error"
      role="alert"
    >
      <div class="mg-ar__router-head">
        <span class="mg-ar__dot mg-ar__dot--router" />
        <div>
          <strong>Router</strong>
          <small>{{ ROUTER_MODEL }}</small>
        </div>
        <span class="mg-ar__pill mg-ar__pill--danger">Offline</span>
      </div>
      <div class="mg-ar__alert">
        <span class="mg-ar__alert-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
        </span>
        <div class="mg-ar__alert-body">
          <strong class="mg-ar__alert-title">{{ view.errorTitle }}</strong>
          <p class="mg-ar__alert-detail">
            Retrying in {{ view.retrySeconds }}s…
            <span class="mg-ar__alert-sub">{{ view.errorDetail }}</span>
          </p>
          <div
            class="mg-ar__retry-progress"
            role="progressbar"
            :aria-valuenow="Math.round(view.retryProgress * 100)"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Retry countdown"
          >
            <span :style="{ '--ar-retry': view.retryProgress }" />
          </div>
        </div>
      </div>
    </section>

    <section
      v-else
      class="mg-ar__router"
      :class="{ 'is-routing': view.phase === 'routing' }"
    >
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
      <div
        class="mg-ar__conf-track"
        role="progressbar"
        :aria-valuenow="Math.round(view.confidence * 100)"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <span class="mg-ar__conf-fill" :style="{ '--ar-conf': view.confidence }" />
      </div>
    </section>

    <section v-if="!isLoading" class="mg-ar__fork" :class="{ 'mg-ar__fork--muted': view.paused }">
      <button
        type="button"
        class="mg-ar__escalate"
        :class="{ 'is-hot': view.phase === 'escalated' }"
        :disabled="isError"
      >
        Escalate to human
      </button>
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
        <p v-else-if="isEmpty" class="mg-ar__lane-hint">No escalations yet</p>
      </article>
    </section>

  <div class="mg-ar__lanes-wrap" :class="{ 'is-paused': view.paused }">
      <p v-if="view.paused && !isLoading" class="mg-ar__paused-label">Queues paused</p>
      <div class="mg-ar__lanes" :class="{ 'mg-ar__lanes--sk': isLoading }">
        <article
          v-for="q in QUEUES"
          :key="q.id"
          class="mg-ar__lane"
          :class="{
            'is-lit': !view.paused && (view.pulse === q.id || (view.phase === 'routed' && view.target === q.id)),
            'mg-ar__lane--sk': isLoading,
          }"
          :style="{ '--lane-color': q.color, '--lane-soft': q.soft }"
        >
          <template v-if="isLoading">
            <span class="mg-ar__sk-line mg-ar__sk-line--sm" />
            <span class="mg-ar__sk-track mg-ar__sk-track--short" />
            <span class="mg-ar__sk-line mg-ar__sk-line--block" />
            <span class="mg-ar__sk-line mg-ar__sk-line--block" />
          </template>
          <template v-else>
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
          </template>
        </article>
      </div>
    </div>

    <div v-if="isError" class="mg-ar__actions">
      <button type="button" class="mg-ar__btn mg-ar__btn--primary">Retry now</button>
      <button type="button" class="mg-ar__btn mg-ar__btn--secondary">Escalate to human</button>
    </div>
  </article>
</template>