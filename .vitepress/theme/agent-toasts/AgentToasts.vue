<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import AgentToaster from './AgentToaster.vue'
import { createToastStore } from './toast.store'
import { motionProfile } from './toast.motion'
import { runCompactScript, runPlaySequence, runRetryScript, samples } from './toast.sample'
import type { AgentToastData } from './toast.model'
import './toasts.css'

const props = withDefaults(
  defineProps<{
    theme?: string
    demoState?: 'busy' | 'error' | 'queue' | 'empty'
  }>(),
  { theme: 'lustro' },
)

const isClient = typeof window !== 'undefined'
const toasterRef = shallowRef<InstanceType<typeof AgentToaster> | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const expanded = ref(false)
const autoHide = ref(true)
const localDark = ref(false)
const forceReduced = ref(false)
const reduced = ref(false)
const spotlightId = ref<string | null>(null)
const playTimers: (() => void)[] = []
let retryCancel: (() => void) | undefined
let compactCancel: (() => void) | undefined
let reducedMedia: MediaQueryList | undefined
let reducedHandler: (() => void) | undefined
let narrowMedia: MediaQueryList | undefined
let narrowHandler: (() => void) | undefined
let visibilityHandler: (() => void) | undefined

const localDarkThemes = new Set(['meadow', 'sentinel', 'brief'])
const showDark = computed(() => localDarkThemes.has(props.theme))
const profile = computed(() => motionProfile(props.theme ?? 'lustro'))

const store = createToastStore()
onMounted(() => {
  store.setAnnounce((text, politeness) => toasterRef.value?.announce(text, politeness))
})

watch(autoHide, v => {
  if (!v) store.pause('autohide')
  else store.resume('autohide')
})

watch(expanded, v => {
  if (v) store.pause('expanded')
  else store.resume('expanded')
})

const items = computed(() => store.state.items)
const placement = ref<'bottom-right' | 'bottom-center'>('bottom-right')

function clearPlay() {
  playTimers.forEach(c => c())
  playTimers.length = 0
  retryCancel?.()
  compactCancel?.()
  retryCancel = compactCancel = undefined
}

function onClear() {
  clearPlay()
  store.clear()
}

function onPlay() {
  clearPlay()
  const cancel = runPlaySequence(d => store.push(d), (id, d) => store.update(id, d), () => store.clear())
  playTimers.push(cancel)
}

function pushOne(factory: () => AgentToastData) {
  store.push(factory())
}

function onAction(id: string, actionId: string) {
  if (actionId === 'retry' && id === 'deploy') {
    store.update(id, { ...samples.deployBusy(), id })
    retryCancel = runRetryScript((rid, data) => store.update(rid, data))
  }
  if (actionId === 'compact' && id === 'context') {
    store.update(id, { ...samples.contextBusy(0.25), id })
    compactCancel = runCompactScript((rid, data) => store.update(rid, data))
  }
}

function applyDemoState() {
  store.clear()
  if (!props.demoState || props.demoState === 'empty') return
  if (props.demoState === 'busy') store.push({ ...samples.deployBusy(), id: 'deploy' })
  if (props.demoState === 'error') store.push(samples.deployFail())
  if (props.demoState === 'queue') {
    for (let i = 0; i < 7; i++) {
      store.push({ ...samples.context(), id: `q-${i}` })
    }
  }
}

watch(() => props.demoState, applyDemoState)

function onStagePointerDown(e: PointerEvent) {
  const region = stageRef.value?.querySelector('.atoast__region')
  if (!region || region.contains(e.target as Node)) return
  expanded.value = false
  toasterRef.value?.collapseTouch()
}

onMounted(() => {
  if (!isClient) return
  reducedMedia = matchMedia('(prefers-reduced-motion: reduce)')
  reducedHandler = () => {
    reduced.value = forceReduced.value || reducedMedia!.matches
  }
  reducedMedia.addEventListener('change', reducedHandler)
  reducedHandler()
  narrowMedia = matchMedia('(max-width: 480px)')
  narrowHandler = () => {
    placement.value = narrowMedia!.matches ? 'bottom-center' : 'bottom-right'
  }
  narrowMedia.addEventListener('change', narrowHandler)
  narrowHandler()
  visibilityHandler = () => {
    if (document.hidden) store.pause('hidden')
    else store.resume('hidden')
  }
  document.addEventListener('visibilitychange', visibilityHandler)
  applyDemoState()
})

onBeforeUnmount(() => {
  clearPlay()
  store.dispose()
  reducedMedia?.removeEventListener('change', reducedHandler!)
  narrowMedia?.removeEventListener('change', narrowHandler!)
  if (visibilityHandler) document.removeEventListener('visibilitychange', visibilityHandler)
})

const rootClass = computed(() => [
  'atoast',
  `atoast-${props.theme}`,
  `atoast--${profile.value}`,
  localDark.value ? 'atoast-local-dark' : '',
  forceReduced.value || reduced.value ? 'is-reduced' : '',
])
</script>

<template>
  <div :class="rootClass">
    <div class="atoast__bar" role="toolbar" aria-label="Toast demo controls">
      <button type="button" class="atoast__btn" @click="onPlay">Play sequence</button>
      <button type="button" class="atoast__btn" @click="pushOne(samples.session)">Session</button>
      <button type="button" class="atoast__btn" @click="pushOne(samples.testsPassed)">Tests</button>
      <button type="button" class="atoast__btn" @click="pushOne(samples.pr)">PR</button>
      <button type="button" class="atoast__btn" @click="pushOne(samples.deployFail)">Deploy</button>
      <button type="button" class="atoast__btn" @click="pushOne(samples.build)">Build</button>
      <button type="button" class="atoast__btn" @click="pushOne(samples.context)">Context</button>
      <button type="button" class="atoast__btn" @click="onClear">Clear</button>
      <button type="button" class="atoast__btn" :aria-pressed="expanded" @click="expanded = !expanded">Expanded</button>
      <button type="button" class="atoast__btn" :aria-pressed="autoHide" @click="autoHide = !autoHide">Auto-hide</button>
      <button v-if="showDark" type="button" class="atoast__btn" :aria-pressed="localDark" @click="localDark = !localDark">
        Dark mode
      </button>
      <button
        v-if="theme === 'lustro'"
        type="button"
        class="atoast__btn"
        :aria-pressed="forceReduced"
        @click="forceReduced = !forceReduced; reduced = forceReduced || !!reducedMedia?.matches"
      >
        Reduced motion
      </button>
    </div>
    <div ref="stageRef" class="atoast__stage" @pointerdown.capture="onStagePointerDown">
      <p v-if="!items.length" class="atoast__empty">No notifications yet. Use Play sequence or the buttons above.</p>
      <AgentToaster
        ref="toasterRef"
        :items="items"
        :queued="store.queueCount()"
        v-model:expanded="expanded"
        :placement="placement === 'bottom-center' ? 'bottom-center' : 'bottom-right'"
        :reduced="reduced"
        :spotlight-id="spotlightId"
        @pause="r => store.pause(r)"
        @resume="r => store.resume(r)"
        @dismiss="(id, r) => store.dismiss(id, r)"
        @action="onAction"
        @spot="id => (spotlightId = id)"
      />
    </div>
  </div>
</template>