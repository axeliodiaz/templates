<script setup>
import { computed, onMounted, onUnmounted, ref, toRef, useId, watch } from 'vue'
import {
  FOCUS_ORDER,
  LOOPS,
  LIFECYCLE_DEF,
  PHASES,
  PR_META,
  SPINE,
  gridColumnFor,
  loopById,
  notchFor,
} from './lifecycle-data.mjs'
import { ariaLabelFor, headlineFor, phaseSub } from './lifecycle-headlines.mjs'
import { lifecycleStatePreset } from './lifecycle-state-presets.mjs'
import { usePrLifecycleFlow } from './usePrLifecycleFlow.mjs'
import PrLifecycleMarker from './PrLifecycleMarker.vue'
import PrLifecyclePanelContent from './PrLifecyclePanelContent.vue'

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
const errorDismissed = ref(false)
const cardRef = ref(null)
const wrapRef = ref(null)
const layoutStacked = ref(false)
const hasEntered = ref(false)
const showEnter = ref(false)
let io = null
let retryTimer = null
let retryCount = 0
let mm = null
let ro = null
let announceTimer = null
let pendingAnnounce = ''

const preset = computed(() =>
  isStatic.value ? lifecycleStatePreset(props.state, { open: props.open }) : null,
)

const flow = usePrLifecycleFlow({
  motion: motionRef,
  autoplay: autoplayRef,
  reducedMotion,
  onLive: (m) => {
    if (props.autoplay && !userTouched.value) queueAnnounce(m)
  },
  onPhaseAnnounce: (m) => {
    if (!flow.playing.value || userTouched.value) return
    queueAnnounce(m)
  },
})

function queueAnnounce(m) {
  pendingAnnounce = m
  clearTimeout(announceTimer)
  announceTimer = setTimeout(() => {
    liveRegion.value = pendingAnnounce
    pendingAnnounce = ''
  }, 1000)
}

const staticModel = ref(null)
watch(
  preset,
  (p) => {
    if (p) staticModel.value = structuredClone(p.model)
  },
  { immediate: true },
)

const M = computed(() => {
  if (isStatic.value) {
    return staticModel.value ?? preset.value?.model ?? flow.model.value
  }
  return flow.model.value
})

const view = computed(() => (errorDismissed.value ? 'ready' : M.value.view || 'ready'))
const isEmpty = computed(() => view.value === 'empty')
const isLoading = computed(() => view.value === 'loading')
const isError = computed(() => view.value === 'error' && !errorDismissed.value)
const isLive = computed(() => !isStatic.value)
const motionEffective = computed(() => props.motion && !reducedMotion.value)
const showDemoBar = computed(() => isLive.value && props.autoplay)
const head = computed(() => headlineFor(M.value))

const focusId = computed(() => {
  const spine = FOCUS_ORDER
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

const NODE_ORDER = FOCUS_ORDER
const loopFix = computed(() => loopById('fix-push'))
const loopChg = computed(() => loopById('review-resolve'))

const openPhase = computed(() => PHASES.find((p) => p.id === openId.value))

watch(focusId, (id) => {
  if (isLive.value && flow.playing.value && !userTouched.value) {
    openId.value = id
  }
})

function phaseState(id) {
  if (M.value.closed && ['pending', 'active'].includes(M.value.phases[id])) return 'stopped'
  return M.value.phases[id]
}

function connFill(id) {
  if (M.value.downstreamDrain) return 0
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
  scrollPanelIfNeeded()
}

function scrollPanelIfNeeded() {
  if (!layoutStacked.value || typeof document === 'undefined') return
  setTimeout(() => {
    const el = document.getElementById(
      layoutStacked.value ? `mg-prl-panel-m-${openId.value}` : 'mg-prl-panel-shared',
    )
    el?.scrollIntoView({ block: 'nearest', behavior: motionEffective.value ? 'smooth' : 'auto' })
  }, 320)
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

function onCardInteract() {
  userTouched.value = true
  if (isLive.value) flow.pause()
}

function onPausePlay() {
  if (flow.playing.value) flow.pause()
  else flow.play()
}

defineExpose({ replay: () => flow.replay(), step: () => flow.step(), pause: () => flow.pause() })

function resolveSpineOpen(stacked) {
  if (props.open) return props.open
  if (isStatic.value && preset.value?.open) return preset.value.open
  if (stacked) return null
  if (view.value !== 'empty' && view.value !== 'loading') return focusId.value
  return null
}

function phaseCol(id) {
  return gridColumnFor(id)
}

function markerStep(phase) {
  return phase.step ?? '↺'
}

function isFlash(phaseId, kind) {
  return M.value.flashId === phaseId && M.value.flashKind === kind
}

function onTrackKeydown(e) {
  const order = NODE_ORDER.map((id) => document.getElementById(`mg-prl-node-${id}`)).filter(Boolean)
  const i = order.indexOf(document.activeElement)
  if (e.key === 'Escape' && openId.value) {
    const f = document.getElementById(`mg-prl-node-${openId.value}`)
    const prev = openId.value
    openId.value = null
    if (props.deepLink && typeof history !== 'undefined') {
      history.replaceState(null, '', `${location.pathname}${location.search}`)
    }
    f?.focus({ preventScroll: true })
    e.preventDefault()
    return
  }
  if (i < 0) return
  let j = null
  if (e.key === 'Home') j = 0
  else if (e.key === 'End') j = order.length - 1
  else if (layoutStacked.value) {
    if (e.key === 'ArrowDown') j = i + 1
    if (e.key === 'ArrowUp') j = i - 1
  } else {
    if (e.key === 'ArrowRight') j = i + 1
    if (e.key === 'ArrowLeft') j = i - 1
    if (e.key === 'ArrowDown' && order[i]?.id === 'mg-prl-node-review') j = 3
    if (e.key === 'ArrowUp' && order[i]?.id === 'mg-prl-node-resolve') j = 2
  }
  if ((e.key === 'Enter' || e.key === ' ') && i >= 0) {
    const id = NODE_ORDER[i]
    if (id) {
      toggleOpen(id)
      e.preventDefault()
    }
    return
  }
  if (j !== null && order[j]) {
    e.preventDefault()
    order[j].focus()
  }
}

function scheduleRetry() {
  clearTimeout(retryTimer)
  retrySec.value = 12
  const tick = () => {
    retrySec.value -= 1
    if (retrySec.value <= 0) {
      retryCount += 1
      if (retryCount < 3) {
        errorDismissed.value = true
        if (!isStatic.value) flow.model.value.view = 'ready'
        retryCount = 0
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
  errorDismissed.value = true
  if (!isStatic.value) flow.model.value.view = 'ready'
  retryCount = 0
  clearTimeout(retryTimer)
}

function onRmChange(e) {
  reducedMotion.value = e.matches
  if (e.matches && flow.playing.value) flow.pause()
}

onMounted(() => {
  if (typeof window === 'undefined') return
  mm = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = mm.matches
  mm.addEventListener('change', onRmChange)

  if (wrapRef.value && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(([entry]) => {
      layoutStacked.value = entry.contentRect.width < 560
    })
    ro.observe(wrapRef.value)
    layoutStacked.value = wrapRef.value.getBoundingClientRect().width < 560
  }

  const initialOpen = resolveSpineOpen(layoutStacked.value)
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
          if (!hasEntered.value) {
            showEnter.value = true
            hasEntered.value = true
            setTimeout(() => {
              showEnter.value = false
            }, 900)
          }
          setTimeout(() => flow.play(), 1400)
        }
      },
      { threshold: 0.4 },
    )
    io.observe(cardRef.value)
  } else if (!isLoading.value && !isEmpty.value) {
    showEnter.value = true
    hasEntered.value = true
    setTimeout(() => {
      showEnter.value = false
    }, 900)
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

onUnmounted(() => {
  flow.clearTimers()
  io?.disconnect()
  ro?.disconnect()
  clearTimeout(retryTimer)
  clearTimeout(announceTimer)
  mm?.removeEventListener('change', onRmChange)
  window.removeEventListener('hashchange', onHash)
  document.removeEventListener('visibilitychange', onVis)
})
</script>

<template>
  <div ref="wrapRef" class="mg-prl-wrap">
    <section
      ref="cardRef"
      class="mg-prl"
      :class="{
        'mg-prl--motion-off': !motionEffective,
        'mg-prl--error': isError,
        'mg-prl--enter': showEnter,
      }"
      :aria-labelledby="titleId"
      :aria-busy="isLoading ? 'true' : undefined"
      data-tpl="margin"
      @click="onCardInteract"
      @keydown="onCardInteract"
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
        <span v-if="!isEmpty && !isLoading" class="mg-prl__chip" :data-tone="head.tone">
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
        <button type="button" class="mg-prl__copylink" @click.stop="retryNow">Retry now</button>
      </div>

      <div v-if="isEmpty" class="mg-prl__empty">
        <h4>No pull request yet</h4>
        <p>Open a draft pull request to start tracking its lifecycle.</p>
      </div>

      <div v-if="isLoading" class="mg-prl__sk" aria-hidden="true">
        <div class="mg-prl__shimmer" style="height: 20px; width: 60%; margin: 14px 0 8px" />
        <div style="display: flex; gap: 12px; justify-content: space-between; margin-top: 24px">
          <div
            v-for="n in 6"
            :key="n"
            class="mg-prl__shimmer"
            style="height: 32px; width: 32px; border-radius: 50%"
          />
        </div>
        <span class="sr">Loading pull request status…</span>
      </div>

      <ol
        v-if="!isEmpty && !isLoading"
        class="mg-prl__track"
        role="list"
        :aria-label="LIFECYCLE_DEF.ui.trackAriaLabel"
        @keydown="onTrackKeydown"
      >
        <div
          class="mg-prl__loop mg-prl__loop--top"
          :class="{
            'is-fly': M.loopFixFly,
            'is-hist': M.loopFixHist,
            'has-n': M.fixCount > 0,
          }"
          :style="{ '--mg-prl-arc-a': M.loopFixFly || M.loopFixHist ? 1 : 0 }"
          aria-hidden="true"
        >
          <s /><u /><em />
          <span
            v-if="M.fixCount"
            class="mg-prl__pill"
            :data-hot="M.fixCount >= 3 ? 1 : 0"
            :title="`Sent back ${M.fixCount} time${M.fixCount > 1 ? 's' : ''}`"
          >
            <span class="lbl">{{ loopFix?.label }}</span>
            <span aria-hidden="true">{{ pillN(M.fixCount) }}</span>
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
            :data-state="phaseState(phase.id)"
            :class="{ 'is-changed': M.changedId === phase.id }"
            :id="`mg-prl-node-${phase.id}`"
            :aria-expanded="openId === phase.id ? 'true' : 'false'"
            :aria-controls="
              layoutStacked ? `mg-prl-panel-m-${phase.id}` : 'mg-prl-panel-shared'
            "
            :aria-current="
              phase.id === focusId && M.phases.merged !== 'done' && !M.closed ? 'step' : undefined
            "
            @click.stop="!isEmpty && toggleOpen(phase.id)"
          >
            <PrLifecycleMarker
              :step="markerStep(phase)"
              :state="phaseState(phase.id)"
              :running="Boolean(phase.markerRunningWhen && phaseState(phase.id) === phase.markerRunningWhen.state)"
              :pop="isFlash(phase.id, 'pop')"
              :shake="isFlash(phase.id, 'shake')"
            />
            <span class="mg-prl__node-label">{{ phase.label }}</span>
            <span class="mg-prl__node-metric" :title="phaseSub(phase.id, M)">
              {{ phaseSub(phase.id, M) }}
            </span>
            <span class="sr">{{ ariaLabelFor(phase, M) }}</span>
            <span
              v-if="phase.connector !== false"
              class="mg-prl__conn"
              aria-hidden="true"
              :data-wall="connWall(phase.id)"
            >
              <i
                :style="{
                  '--mg-prl-conn':
                    M.drainDraftConn && phase.id === 'draft' ? 0 : connFill(phase.id),
                }"
              />
              <b />
            </span>
          </component>

          <span
            v-if="loopFix?.stackChip?.phaseId === phase.id && M.fixCount"
            class="mg-prl__stackchip"
            aria-hidden="true"
          >{{ loopFix.stackChip.text.replace('{pill}', pillN(M.fixCount)) }}</span>
          <span
            v-if="loopChg?.stackChip?.phaseId === phase.id && M.changesCount"
            class="mg-prl__stackchip"
            aria-hidden="true"
          >{{ loopChg.stackChip.text.replace('{pill}', pillN(M.changesCount)) }}</span>

          <div
            v-if="layoutStacked && !isEmpty"
            :id="`mg-prl-panel-m-${phase.id}`"
            class="mg-prl__panel"
            :class="{ 'is-open': openId === phase.id }"
            role="region"
            :aria-labelledby="`mg-prl-node-${phase.id}`"
          >
            <div class="mg-prl__panel-in">
              <div class="mg-prl__panel-card">
                <div v-if="openId === phase.id" class="mg-prl__panel-wrap">
                  <PrLifecyclePanelContent
                    :phase-id="phase.id"
                    :phase-label="phase.label"
                    :m="M"
                    :phase-state="phaseState"
                    :deep-link="deepLink"
                    :copy-done="copyDone"
                    @copy-link="copyPhaseLink"
                  />
                </div>
              </div>
            </div>
          </div>
        </li>

        <div
          class="mg-prl__loop mg-prl__loop--mid"
          :class="{
            'is-down': M.loopChgDown,
            'is-up': M.loopChgUp,
            'is-hist': M.loopChgHist,
            'has-n': M.changesCount > 0,
          }"
          aria-hidden="true"
        >
          <s /><u />
          <span
            v-if="M.changesCount"
            class="mg-prl__pill"
            :data-hot="M.changesCount >= 3 ? 1 : 0"
          >{{ pillN(M.changesCount) }}</span>
        </div>

        <div class="mg-prl__legend" aria-hidden="true">
          <span v-for="key in LIFECYCLE_DEF.legend" :key="key">
            <i :class="'l-' + key" /> {{ LIFECYCLE_DEF.ui.legendLabels[key] }}
          </span>
        </div>

        <div
          v-if="!layoutStacked"
          id="mg-prl-panel-shared"
          class="mg-prl__panel mg-prl__panel--shared"
          :class="{ 'is-open': Boolean(openId) }"
          role="region"
          :aria-labelledby="openId ? `mg-prl-node-${openId}` : undefined"
        >
          <div class="mg-prl__panel-in">
            <div class="mg-prl__panel-card">
              <span
                v-if="openId"
                class="mg-prl__notch"
                :style="{ '--mg-prl-notch': openId ? notchFor(openId) : '50%' }"
                aria-hidden="true"
              />
              <div v-if="openId && openPhase" class="mg-prl__panel-wrap">
                <PrLifecyclePanelContent
                  :phase-id="openPhase.id"
                  :phase-label="openPhase.label"
                  :m="M"
                  :phase-state="phaseState"
                  :deep-link="deepLink"
                  :copy-done="copyDone"
                  @copy-link="copyPhaseLink"
                />
              </div>
            </div>
          </div>
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