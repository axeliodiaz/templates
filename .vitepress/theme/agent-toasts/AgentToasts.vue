<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AgentToaster from './AgentToaster.vue'
import { createToastStore } from './toast.store'
import {
  demoCompact,
  demoRetry,
  deployDone,
  originalData,
  playSequence,
  queueBurst,
} from './toast.sample'
import { profileForTheme, reducedNow } from './toast.motion'
import './toasts.css'

const props = withDefaults(
  defineProps<{
    theme?: string
    demoState?: 'busy' | 'error' | 'queue' | 'empty' | 'index'
    autoHide?: boolean
  }>(),
  { demoState: 'index', autoHide: true },
)

const emit = defineEmits<{ spotlight: [id: string]; action: [id: string, actionId: string] }>()

const store = createToastStore()
const expanded = ref(false)
const localDark = ref(false)
const reduced = ref(false)
const autoHideDemo = ref(props.autoHide)
const spotlightId = ref<string | null>(null)
const isClient = typeof window !== 'undefined'
const localDarkThemes = new Set(['meadow', 'sentinel', 'brief'])
const motionProfile = computed(() => profileForTheme(props.theme))

let sequenceCancel: (() => void) | undefined
let retryTimer: ReturnType<typeof setTimeout> | undefined
let compactCancel: (() => void) | undefined
let reducedMedia: MediaQueryList | undefined
let reducedHandler: (() => void) | undefined

const themeClass = computed(() => `atoast-${props.theme ?? 'lustro'}`)
const showDarkToggle = computed(() => localDarkThemes.has(props.theme ?? ''))
const darkClass = computed(() => (localDark.value ? 'atoast-local-dark' : ''))
const placement = ref<'bottom-right' | 'center'>('bottom-right')
const stageEmpty = computed(() => props.demoState === 'empty')

function applyDemoState() {
  store.clear()
  if (props.demoState === 'empty') return
  if (props.demoState === 'busy') {
    store.push({ ...originalData[1]!, duration: null })
    store.push({ ...originalData[3]!, duration: null })
    return
  }
  if (props.demoState === 'error') {
    store.push({
      id: 'tests',
      tone: 'danger',
      title: 'Tests failed',
      detail: 'payments.spec.ts · 3 assertions',
      visual: { type: 'tests', total: 248, passed: 245, failed: 3 },
      action: { id: 'retry-tests', label: 'Retry' },
      duration: autoHideDemo.value ? undefined : null,
    })
    return
  }
  if (props.demoState === 'queue') {
    queueBurst(d => store.push({ ...d, duration: autoHideDemo.value ? undefined : null }))
    return
  }
  store.push({ ...originalData[0]!, duration: autoHideDemo.value ? undefined : null })
}

function runSequence() {
  sequenceCancel?.()
  store.clear()
  sequenceCancel = playSequence(d => store.push({ ...d, duration: autoHideDemo.value ? undefined : null }))
}

function pushSession() {
  store.push({ ...originalData[0]!, duration: autoHideDemo.value ? undefined : null })
}

function pushTests() {
  store.push({ ...originalData[1]!, duration: autoHideDemo.value ? undefined : null })
}

function pushPr() {
  store.push({ ...originalData[2]!, duration: autoHideDemo.value ? undefined : null })
}

function pushDeploy() {
  store.push({ ...originalData[3]!, duration: autoHideDemo.value ? undefined : null })
}

function pushBuild() {
  store.push({ ...originalData[4]!, duration: autoHideDemo.value ? undefined : null })
}

function pushContext() {
  store.push({ ...originalData[5]!, duration: autoHideDemo.value ? undefined : null })
}

function onAction(id: string, actionId: string) {
  emit('action', id, actionId)
  if (actionId === 'retry-tests') retryTimer = demoRetry(store) as ReturnType<typeof setTimeout>
  if (actionId === 'compact') compactCancel = demoCompact(store)
  if (actionId === 'open-pr' || actionId === 'open-preview') {
    store.update('deploy', { ...deployDone, duration: autoHideDemo.value ? undefined : null })
  }
}

function onSpotlight(id: string) {
  spotlightId.value = id
  emit('spotlight', id)
}

function syncPlacement() {
  if (!isClient) return
  placement.value = window.matchMedia('(max-width: 640px)').matches ? 'center' : 'bottom-right'
}

watch(
  () => props.demoState,
  () => applyDemoState(),
)

onMounted(() => {
  if (!isClient) {
    applyDemoState()
    return
  }
  syncPlacement()
  window.addEventListener('resize', syncPlacement)
  reducedMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedHandler = () => { reduced.value = reducedNow() }
  reducedHandler()
  reducedMedia.addEventListener('change', reducedHandler)
  applyDemoState()
})

onBeforeUnmount(() => {
  sequenceCancel?.()
  if (retryTimer) clearTimeout(retryTimer)
  compactCancel?.()
  store.dispose()
  if (isClient) {
    window.removeEventListener('resize', syncPlacement)
    reducedMedia?.removeEventListener('change', reducedHandler!)
  }
})
</script>

<template>
  <section
    class="atoast"
    :class="[themeClass, darkClass, `atoast-profile-${motionProfile}`, { 'is-reduced': reduced }]"
    aria-label="Agent toasts module"
  >
    <header class="atoast__head">
      <span class="atoast__eyebrow">AGENT TOASTS / DEMO</span>
      <h2 class="atoast__title">Synthetic run feedback</h2>
      <p class="atoast__lede">Original English copy. No agents, builds, or deploys are connected.</p>
    </header>
    <p v-if="spotlightId" class="atoast__spotlight" aria-live="polite">Spotlight: {{ spotlightId }}</p>
    <div class="atoast__stage" :class="{ 'atoast__stage--empty': stageEmpty }">
      <AgentToaster
        :store="store"
        :theme="theme"
        :expanded="expanded"
        :placement="placement"
        :reduced="reduced"
        @action="onAction"
        @spotlight="onSpotlight"
      />
      <p v-if="stageEmpty" class="atoast__empty" role="status">No toasts. Use the demo bar or Play sequence.</p>
    </div>
    <div class="atoast__bar" role="toolbar" aria-label="Toast demo controls">
      <button type="button" @click="runSequence">Play sequence</button>
      <button type="button" @click="pushSession">Session</button>
      <button type="button" @click="pushTests">Tests</button>
      <button type="button" @click="pushPr">PR</button>
      <button type="button" @click="pushDeploy">Deploy</button>
      <button type="button" @click="pushBuild">Build</button>
      <button type="button" @click="pushContext">Context</button>
      <button type="button" @click="store.clear()">Clear</button>
      <button type="button" :aria-pressed="expanded" @click="expanded = !expanded">
        {{ expanded ? 'Deck' : 'Expanded' }}
      </button>
      <label class="atoast__check">
        <input v-model="autoHideDemo" type="checkbox" />
        Auto-hide
      </label>
      <button v-if="showDarkToggle" type="button" @click="localDark = !localDark">
        {{ localDark ? 'Light' : 'Dark' }} mode
      </button>
      <button
        v-if="demoState === 'index'"
        type="button"
        :aria-pressed="reduced"
        @click="reduced = !reduced"
      >
        {{ reduced ? 'Motion on' : 'Reduced' }}
      </button>
    </div>
    <p class="atoast__notice">
      Max six visible · FIFO queue · dedupe within 4s · danger stays until dismissed · hover or tab hides timers.
    </p>
  </section>
</template>