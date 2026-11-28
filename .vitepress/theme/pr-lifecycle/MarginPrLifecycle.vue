<script setup>
import { computed, onMounted, onUnmounted, ref, toRef, useId, watch } from 'vue'
import {
  CHECKS,
  PHASES,
  PR_META,
  SPINE,
  THREADS,
} from './lifecycle-data.mjs'
import {
  ariaLabelFor,
  headlineFor,
  phaseSub,
} from './lifecycle-headlines.mjs'
import { lifecycleStatePreset } from './lifecycle-state-presets.mjs'
import { usePrLifecycleFlow } from './usePrLifecycleFlow.mjs'

const props = defineProps({
  motion: { type: Boolean, default: true },
  autoplay: { type: Boolean, default: true },
  state: { type: String, default: '' },
  open: { type: String, default: '' },
  deepLink: { type: Boolean, default: false },
})

const titleId = useId()
const reducedMotion = ref(false)
const motionRef = toRef(props, 'motion')
const autoplayRef = toRef(props, 'autoplay')
const isStatic = computed(() => Boolean(props.state))
const liveRegion = ref('')
const openId = ref(props.open || null)
const userTouched = ref(false)
const copyDone = ref(false)
const retrySec = ref(12)
const cardRef = ref(null)
let io = null
let retryTimer = null
let retryCount = 0
let mm = null

const preset = computed(() =>
  isStatic.value ? lifecycleStatePreset(props.state, { open: props.open }) : null,
)

const flow = usePrLifecycleFlow({
  motion: motionRef,
  autoplay: autoplayRef,
  reducedMotion,
  onLive: (m) => {
    if (!props.autoplay || userTouched.value) return
    liveRegion.value = m
  },
})

const M = computed(() => (preset.value ? preset.value.model : flow.model.value))

const view = computed(() => M.value.view || 'ready')
const isEmpty = computed(() => view.value === 'empty')
const isLoading = computed(() => view.value === 'loading')
const isError = computed(() => view.value === 'error')
const isLive = computed(() => !isStatic.value)

const head = computed(() => headlineFor(M.value))

const motionEffective = computed(
  () => props.motion && !reducedMotion.value,
)

const showDemoBar = computed(() => isLive.value && props.autoplay)

const focusId = computed(() => {
  const spine = [...SPINE, 'resolve']
  for (const k of ['failed', 'blocked']) {
    for (const id of spine) if (M.value.phases[id] === k) return id
  }
  for (const id of spine) if (M.value.phases[id] === 'active') return id
  for (const id of [...spine].reverse()) if (M.value.phases[id] === 'done') return id
  return 'draft'
})

const demoInfo = computed(() => {
  if (!showDemoBar.value) return ''
  if (reducedMotion.value) return 'Demo · autoplay off (reduced motion) — use Step'
  return flow.demoLabel.value
})

const NOTCH = {
  draft: '8.33%',
  checks: '25%',
  review: '41.67%',
  resolve: '41.67%',
  approvals: '58.33%',
  ready: '75%',
  merged: '91.67%',
}

function phaseState(id) {
  if (M.value.closed && ['pending', 'active'].includes(M.value.phases[id])) return 'stopped'
  return M.value.phases[id]
}

function connFill(id) {
  const i = SPINE.indexOf(id)
  if (i < 0) return 0
  const next = SPINE[i + 1]
  return M.value.phases[id] === 'done' ? 1 : 0
}

function connWall(id) {
  const s = M.value.phases[id]
  if (s === 'blocked' || s === 'failed') return s
  return ''
}

function pillN(n) {
  if (!n) return ''
  return n >= 10 ? '×9+' : `×${n}`
}

function toggleOpen(id) {
  userTouched.value = true
  if (isLive.value) flow.pause()
  openId.value = openId.value === id ? null : id
  if (props.deepLink && typeof history !== 'undefined') {
    const path = `${location.pathname}${location.search}`
    history.replaceState(null, '', openId.value ? `#phase-${openId.value}` : path)
  }
}

async function copyPhaseLink() {
  if (typeof navigator === 'undefined' || !openId.value) return
  try {
    const url = `${location.origin}${location.pathname}#phase-${openId.value}`
    await navigator.clipboard.writeText(url)
    copyDone.value = true
    setTimeout(() => {
      copyDone.value = false
    }, 1600)
  } catch {
    /* noop */
  }
}

function onCardKey() {
  userTouched.value = true
  if (isLive.value) flow.pause()
}

function onPausePlay() {
  if (flow.playing.value) flow.pause()
  else flow.play()
}

defineExpose({
  replay: () => flow.replay(),
  step: () => flow.step(),
  pause: () => flow.pause(),
})

function resolveSpineOpen() {
  if (props.open) return props.open
  if (isStatic.value && preset.value?.open) return preset.value.open
  if (view.value !== 'empty' && view.value !== 'loading') return focusId.value
  return null
}

onMounted(() => {
  if (typeof window === 'undefined') return
  mm = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = mm.matches
  mm.addEventListener('change', onRmChange)

  const initialOpen = resolveSpineOpen()
  if (props.deepLink) {
    const hm = location.hash.match(/^#phase-(\w+)/)
    if (hm && PHASES.some((p) => p.id === hm[1])) openId.value = hm[1]
    else openId.value = initialOpen
    window.addEventListener('hashchange', onHash)
  } else if (initialOpen) {
    openId.value = initialOpen
  }

  if (isError.value) scheduleRetry()

  if (isLive.value && props.autoplay && !reducedMotion.value && cardRef.value) {
    io = new IntersectionObserver(
      (es) => {
        if (es[0]?.isIntersecting && !flow.playing.value && flow.stepIdx.value === 0) {
          io?.disconnect()
          setTimeout(() => flow.play(), 1400)
        }
      },
      { threshold: 0.4 },
    )
    io.observe(cardRef.value)
  }

  document.addEventListener('visibilitychange', onVis)
})

function onHash() {
  const hm = location.hash.match(/^#phase-(\w+)/)
  if (hm && PHASES.some((p) => p.id === hm[1])) openId.value = hm[1]
}

function onVis() {
  if (document.hidden && flow.playing.value) flow.pause()
}

function scheduleRetry() {
  clearTimeout(retryTimer)
  retrySec.value = 12
  const tick = () => {
    retrySec.value -= 1
    if (retrySec.value <= 0) {
      retryCount += 1
      if (retryCount < 3 && isError.value && !isStatic.value) {
        flow.model.value.view = 'ready'
        retryCount = 0
      } else if (retryCount >= 3) {
        return
      }
      scheduleRetry()
    } else {
      retryTimer = setTimeout(tick, 1000)
    }
  }
  retryTimer = setTimeout(tick, 1000)
}

function retryNow() {
  if (!isStatic.value) {
    flow.model.value.view = 'ready'
  }
  retryCount = 0
}

onUnmounted(() => {
  flow.clearTimers()
  io?.disconnect()
  clearTimeout(retryTimer)
  if (mm) mm.removeEventListener('change', onRmChange)
  window.removeEventListener('hashchange', onHash)
  document.removeEventListener('visibilitychange', onVis)
})

function onRmChange(e) {
  reducedMotion.value = e.matches
  if (e.matches && flow.playing.value) flow.pause()
}

const phaseCol = (id) => {
  const map = { draft: 1, checks: 2, review: 3, approvals: 4, ready: 5, merged: 6 }
  return map[id]
}
</script>

<template>
  <div class="mg-prl-wrap">
    <section
      ref="cardRef"
      class="mg-prl"
      :class="{
        'mg-prl--motion-off': !motionEffective,
        'mg-prl--error': isError,
      }"
      :aria-labelledby="titleId"
      :aria-busy="isLoading ? 'true' : undefined"
      data-tpl="margin"
      @click="onCardKey"
      @keydown="onCardKey"
    >
      <header class="mg-prl__top">
        <div class="mg-prl__titlebox">
          <p class="mg-prl__eyebrow">Pull request lifecycle</p>
          <h3
            v-if="!isEmpty"
            :id="titleId"
            class="mg-prl__title"
            :title="`#${PR_META.number} ${PR_META.title}`"
          >
            #{{ PR_META.number }} {{ PR_META.title }}
          </h3>
          <h3 v-else :id="titleId" class="mg-prl__title">No pull request yet</h3>
          <p v-if="!isEmpty" class="mg-prl__branch">
            <span>{{ PR_META.head }}</span>
            <span aria-hidden="true">→</span>
            <span>{{ PR_META.base }}</span>
          </p>
        </div>
        <span
          v-if="!isEmpty && !isLoading"
          class="mg-prl__chip"
          :data-tone="head.tone"
        >
          <i aria-hidden="true" />
          {{ head.chip }}
        </span>
      </header>

      <div v-if="!isEmpty && !isLoading" class="mg-prl__headline">
        <strong class="mg-prl__swap">{{ head.h1 }}</strong>
        <span class="mg-prl__swap">{{ head.h2 }}</span>
      </div>

      <div v-if="isError" class="mg-prl__alert" role="alert">
        <span>
          <strong>Couldn't load pull request status.</strong>
          Retrying in {{ retrySec }}s…
        </span>
        <button type="button" class="mg-prl__copylink" @click.stop="retryNow">
          Retry now
        </button>
      </div>

      <div v-if="isEmpty" class="mg-prl__empty">
        <h4>No pull request yet</h4>
        <p>Open a draft pull request to start tracking its lifecycle.</p>
      </div>

      <div v-if="isLoading" class="mg-prl__sk" aria-hidden="true">
        <div class="mg-prl__shimmer" style="height: 20px; width: 60%; margin: 14px 0 8px" />
        <div
          style="display: flex; gap: 12px; justify-content: space-between; margin-top: 24px"
        >
          <div
            v-for="n in 6"
            :key="n"
            class="mg-prl__shimmer"
            style="height: 32px; width: 32px; border-radius: 50%"
          />
        </div>
        <div class="sr">Loading pull request status…</div>
      </div>

      <ol
        v-if="!isEmpty && !isLoading"
        class="mg-prl__track"
        role="list"
        aria-label="Pull request lifecycle, 6 phases and 1 optional rework step"
      >
        <div
          v-if="M.fixCount >= 0"
          class="mg-prl__loop mg-prl__loop--top"
          :class="{
            'is-on': M.loopFixLit,
            'is-hist': M.loopFixHist,
            'has-n': M.fixCount > 0,
          }"
          aria-hidden="true"
        >
          <span v-if="M.fixCount" class="mg-prl__pill" :data-hot="M.fixCount >= 3 ? 1 : 0">
            <span class="lbl">Fix &amp; push</span>
            {{ pillN(M.fixCount) }}
          </span>
        </div>

        <li
          v-for="phase in PHASES"
          :key="phase.id"
          role="listitem"
          :data-id="phase.id"
          :data-col="phaseCol(phase.id)"
          :data-state="phaseState(phase.id)"
        >
          <component
            :is="isEmpty ? 'span' : 'button'"
            :type="isEmpty ? undefined : 'button'"
            class="mg-prl__node"
            :id="`mg-prl-node-${phase.id}`"
            :aria-expanded="openId === phase.id ? 'true' : 'false'"
            :aria-controls="`mg-prl-panel-${phase.id}`"
            :aria-current="phase.id === focusId && M.phases.merged !== 'done' && !M.closed ? 'step' : undefined"
            @click.stop="!isEmpty && toggleOpen(phase.id)"
          >
            <span class="mg-prl__mk" aria-hidden="true">{{ phase.step ?? '↺' }}</span>
            <span class="mg-prl__node-label">{{ phase.label }}</span>
            <span class="mg-prl__node-metric" :title="phaseSub(phase.id, M)">
              {{ phaseSub(phase.id, M) }}
            </span>
            <span class="sr">{{ ariaLabelFor(phase, M) }}</span>
            <span
              v-if="phase.id !== 'resolve' && phase.id !== 'merged'"
              class="mg-prl__conn"
              aria-hidden="true"
              :data-wall="connWall(phase.id)"
            >
              <i :style="{ '--mg-prl-conn': M.drainDraftConn && phase.id === 'draft' ? 0 : connFill(phase.id) }" />
              <b />
            </span>
          </component>

          <span
            v-if="phase.id === 'checks' && M.fixCount"
            class="mg-prl__stackchip"
          >↩ Sent back to Draft {{ pillN(M.fixCount) }}</span>
          <span
            v-if="phase.id === 'review' && M.changesCount"
            class="mg-prl__stackchip"
          >↩ Changes requested {{ pillN(M.changesCount) }}</span>

          <div
            v-if="!isEmpty"
            :id="`mg-prl-panel-${phase.id}`"
            class="mg-prl__panel"
            :class="{ 'is-open': openId === phase.id }"
            role="region"
            :aria-labelledby="`mg-prl-node-${phase.id}`"
          >
            <div class="mg-prl__panel-in">
              <div class="mg-prl__panel-card">
                <span
                  class="mg-prl__notch"
                  :style="{ '--mg-prl-notch': NOTCH[phase.id] }"
                  aria-hidden="true"
                />
                <div v-if="openId === phase.id" class="mg-prl__panel-body">
                  <div class="mg-prl__panel-head">
                    <h4>{{ phase.label }}</h4>
                    <button
                      v-if="deepLink"
                      type="button"
                      class="mg-prl__copylink"
                      @click.stop="copyPhaseLink"
                    >
                      {{ copyDone ? 'Copied' : 'Copy link' }}
                    </button>
                  </div>

                  <div
                    v-if="phase.id === 'approvals' && phaseState('approvals') === 'blocked'"
                    class="mg-prl__callout mg-prl__callout--blocked"
                  >
                    Needs 1 more approval from a code owner: @ana
                  </div>
                  <div
                    v-if="phase.id === 'checks' && phaseState('checks') === 'failed'"
                    class="mg-prl__callout mg-prl__callout--failed"
                  >
                    E2E tests failed. Fix and push to re-run all checks.
                  </div>
                  <div
                    v-if="phase.id === 'review' && phaseState('review') === 'blocked'"
                    class="mg-prl__callout mg-prl__callout--blocked"
                  >
                    @sam requested changes · 3 open threads
                  </div>

                  <p v-if="phase.id === 'checks'" class="mg-prl__stat">
                    {{ M.checksPassed }} of 6 passed
                  </p>
                  <p v-if="phase.id === 'resolve'" class="mg-prl__stat">
                    {{
                      phaseState('resolve') === 'skipped'
                        ? 'No comments to resolve'
                        : `${M.openThreads} open · ${3 - M.openThreads} resolved`
                    }}
                  </p>

                  <ul
                    class="mg-prl__rows"
                    :class="{ 'mg-prl__rows-scroll': phase.id === 'checks' && CHECKS.length > 8 }"
                  >
                    <template v-if="phase.id === 'draft'">
                      <li>Author <b>@luis</b></li>
                      <li>4 commits · +186 −42 · 6 files</li>
                      <li>
                        {{
                          phaseState('draft') === 'done'
                            ? 'Marked ready for review'
                            : 'Mark as ready for review to start checks'
                        }}
                      </li>
                    </template>
                    <template v-else-if="phase.id === 'checks'">
                      <li v-for="(c, k) in CHECKS" :key="c.name">
                        {{ c.name }} ·
                        {{
                          k < M.checksPassed
                            ? c.duration
                            : phaseState('checks') === 'failed' && k === M.failIdx
                              ? `${c.duration} · failed`
                              : '—'
                        }}
                      </li>
                    </template>
                    <template v-else-if="phase.id === 'review'">
                      <li>@ana · code owner · Requested</li>
                      <li>@sam · {{ phaseState('review') === 'blocked' ? 'Changes requested' : 'Requested' }}</li>
                    </template>
                    <template v-else-if="phase.id === 'resolve' && phaseState('resolve') !== 'pending' && phaseState('resolve') !== 'skipped'">
                      <li v-for="(t, k) in THREADS" :key="t.loc">
                        <b>{{ t.loc }}</b> — {{ t.preview }} ·
                        {{ k >= M.openThreads ? 'Resolved' : 'Open' }}
                      </li>
                    </template>
                    <template v-else-if="phase.id === 'approvals'">
                      <li>@sam · {{ M.approvalsHave > 0 ? 'Approved' : 'Waiting' }}</li>
                      <li>@ana · code owner · {{ M.approvalsHave > 1 ? 'Approved' : 'Waiting' }}</li>
                    </template>
                    <template v-else-if="phase.id === 'ready'">
                      <li>Required checks · 6 of 6</li>
                      <li>Approvals · 2 of 2</li>
                      <li>No conflicts with main</li>
                      <li>Merge method · Squash and merge</li>
                    </template>
                    <template v-else-if="phase.id === 'merged'">
                      <li>
                        {{ phaseState('merged') === 'done' ? 'Merged into main' : 'Not merged yet' }}
                      </li>
                      <li>Commit · {{ PR_META.mergeCommit }}</li>
                      <li>Branch {{ PR_META.head }} · {{ phaseState('merged') === 'done' ? 'Deleted' : '—' }}</li>
                    </template>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </li>

        <div
          v-if="M.changesCount >= 0"
          class="mg-prl__loop mg-prl__loop--mid"
          :class="{
            dn: M.loopChgDown,
            upn: M.loopChgUp,
            'is-hist': M.loopChgHist,
            'has-n': M.changesCount > 0,
          }"
          aria-hidden="true"
        >
          <span v-if="M.changesCount" class="mg-prl__pill" :data-hot="M.changesCount >= 3 ? 1 : 0">
            {{ pillN(M.changesCount) }}
          </span>
        </div>

        <div class="mg-prl__legend" aria-hidden="true">
          <span>Pending</span>
          <span>In progress</span>
          <span>Done</span>
          <span>Blocked</span>
          <span>Failed</span>
        </div>
      </ol>

      <footer v-if="showDemoBar" class="mg-prl__foot">
        <span>{{ demoInfo }}</span>
        <span class="mg-prl__foot-btns">
          <button type="button" @click.stop="onPausePlay">
            {{ flow.playing.value ? 'Pause' : 'Play' }}
          </button>
          <button type="button" @click.stop="flow.step">Step ›</button>
          <button type="button" @click.stop="flow.replay">Replay ↻</button>
        </span>
      </footer>

      <div class="sr" role="status" aria-live="polite">{{ liveRegion }}</div>
    </section>
  </div>
</template>