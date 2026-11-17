<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import AgentCrewCard from './AgentCrewCard.vue'
import AgentCrewDialog from './AgentCrewDialog.vue'
import { applyStep, initialHandoffs, projects as sampleProjects, resetProject, STEP_COUNT } from './crew.sample'
import { childWires, layoutTree, type CrewRect } from './crew.geometry'
import { floorGlow, handoffEdges, playEntrance, pulseHandoff, stopAll, type Controls } from './crew.motion'
import { counts, normalize, validate, type Ack, type CrewAgent, type CrewHandoff, type CrewProject, type SteerAction } from './crew.model'
import './crew.css'

const props = withDefaults(defineProps<{
  projects?: CrewProject[]
  modelValue?: string
  handoffs?: CrewHandoff[]
  steer?: (agent: CrewAgent, action: SteerAction, message?: string) => Promise<Ack>
  theme?: string
  title?: string
}>(), { modelValue: 'onboarding' })

const emit = defineEmits<{
  'update:modelValue': [id: string]
  select: [id: string | null]
  steer: [action: SteerAction, result: Ack]
}>()

const motionSet = new Set<Controls>()
const allProjects = computed(() => props.projects ?? sampleProjects())
const project = computed(() => allProjects.value.find(p => p.id === props.modelValue) ?? allProjects.value[0])
const errors = computed(() => validate(root.value))
const stats = computed(() => counts(root.value))
const ordered = computed(() => (errors.value.length ? [] : normalize(root.value)))
const listMode = computed(() => stageWidth.value < 1000)

const root = shallowRef<CrewAgent>(project.value.root)
const handoffs = ref<CrewHandoff[]>(props.handoffs ?? initialHandoffs())
const selection = ref<string | null>(null)
const dialogOpen = ref(false)
const stepIndex = ref(-1)
const playing = ref(false)
const liveText = ref('')
const now = ref(Date.now())
const stageRef = ref<HTMLElement | null>(null)
const lastFocus = ref<HTMLElement | null>(null)
const seenHandoffs = ref(new Set<string>())
const stageWidth = ref(960)
const localDark = ref(false)
const localDarkThemes = new Set(['meadow', 'sentinel', 'brief'])

let playTimer: ReturnType<typeof setInterval> | undefined
let clockTimer: ReturnType<typeof setInterval> | undefined
let liveTimer: ReturnType<typeof setTimeout> | undefined
let liveBuffer: string[] = []
let stageObserver: ResizeObserver | undefined

onBeforeUnmount(() => {
  stopAll(motionSet)
  if (playTimer) clearInterval(playTimer)
  if (clockTimer) clearInterval(clockTimer)
  if (liveTimer) clearTimeout(liveTimer)
  stageObserver?.disconnect()
})

function announce(message?: string) {
  if (!message) return
  liveBuffer.push(message)
  if (!liveTimer) {
    liveTimer = setTimeout(() => {
      liveText.value = liveBuffer.join(' · ')
      liveBuffer = []
      liveTimer = undefined
    }, 2000)
  }
}

function syncClock() {
  if (ordered.value.some(a => a.status === 'working')) {
    if (!clockTimer) clockTimer = setInterval(() => { now.value = Date.now() }, 1000)
  } else if (clockTimer) {
    clearInterval(clockTimer)
    clockTimer = undefined
  }
}

function applyLayout(): { rects: CrewRect[]; height: number; wires: ReturnType<typeof childWires> } {
  const mode = listMode.value ? 'list' : 'tree'
  const layout = layoutTree(root.value, mode, stageWidth.value)
  return { ...layout, wires: childWires(root.value, layout.rects) }
}

const layout = computed(applyLayout)

const selectedAgent = computed(() => ordered.value.find(a => a.id === selection.value) ?? null)
const selectedRect = computed(() => layout.value.rects.find(r => r.id === selection.value))

function loadProject(id: string, reenter = false) {
  const match = allProjects.value.find(p => p.id === id)
  if (!match) return
  root.value = JSON.parse(JSON.stringify(match.root))
  handoffs.value = props.handoffs ? [...props.handoffs] : []
  stepIndex.value = -1
  selection.value = null
  dialogOpen.value = false
  seenHandoffs.value = new Set(handoffs.value.map(h => h.id))
  if (reenter) nextTick(() => stageRef.value && playEntrance(stageRef.value, motionSet))
  syncClock()
}

watch(() => props.modelValue, (id, prev) => {
  if (!id) return
  if (prev === undefined) {
    loadProject(id, false)
    return
  }
  if (id === prev) return
  stopAll(motionSet)
  loadProject(id, true)
}, { immediate: true })

watch(handoffs, list => {
  for (const h of list) {
    if (seenHandoffs.value.has(h.id)) continue
    seenHandoffs.value.add(h.id)
    nextTick(() => animateHandoff(h))
  }
}, { deep: true })

function animateHandoff(handoff: CrewHandoff) {
  const stage = stageRef.value
  if (!stage) return
  const edgeMap = new Map(layout.value.wires.map(w => [`${w.parent}:${w.child}`, w.d]))
  const keys = handoffEdges(root.value, handoff, edgeMap)
  keys.forEach(key => {
    const [parent, child] = key.split(':')
    const path = stage.querySelector<SVGPathElement>(`[data-wire="${parent}:${child}"]`)
    if (path) pulseHandoff(stage, path, motionSet)
  })
  const target = stage.querySelector<HTMLElement>(`[data-crew-card="${handoff.to}"]`)
  if (target) floorGlow(target, motionSet)
  announce(handoff.label ? `${handoff.from} handed to ${handoff.to}: ${handoff.label}` : `${handoff.from} handed to ${handoff.to}`)
}

function setSelection(id: string | null, el?: HTMLElement) {
  selection.value = id
  emit('select', id)
  if (el) lastFocus.value = el
  if (id) {
    dialogOpen.value = true
    nextTick(() => {
      const card = stageRef.value?.querySelector<HTMLElement>(`[data-crew-card="${id}"]`)
      if (card) floorGlow(card, motionSet)
    })
  } else dialogOpen.value = false
}

function closeDialog() {
  dialogOpen.value = false
  selection.value = null
  emit('select', null)
  nextTick(() => lastFocus.value?.focus())
}

function onKeydown(e: KeyboardEvent) {
  if (!ordered.value.length) return
  const current = selection.value ?? ordered.value[0].id
  const index = ordered.value.findIndex(a => a.id === current)
  let next = index
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); next = (index + 1) % ordered.value.length }
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); next = (index - 1 + ordered.value.length) % ordered.value.length }
  else if (e.key === 'Home') { e.preventDefault(); next = 0 }
  else if (e.key === 'End') { e.preventDefault(); next = ordered.value.length - 1 }
  else if (e.key === 'Enter' && selection.value) { e.preventDefault(); dialogOpen.value = true; return }
  else if (e.key === 'Escape' && dialogOpen.value) { e.preventDefault(); closeDialog(); return }
  else return
  const id = ordered.value[next].id
  const el = stageRef.value?.querySelector<HTMLElement>(`[data-crew-card="${id}"]`)
  setSelection(id)
  el?.focus()
}

function runStep() {
  if (project.value.id !== 'onboarding') return
  stepIndex.value = Math.min(stepIndex.value + 1, STEP_COUNT - 1)
  const next = applyStep(project.value.id, stepIndex.value)
  root.value = next.root
  handoffs.value = next.handoffs
  announce(next.announce)
  syncClock()
}

function togglePlay() {
  if (playing.value) {
    playing.value = false
    if (playTimer) clearInterval(playTimer)
    playTimer = undefined
    announce('Paused demo run')
    return
  }
  playing.value = true
  announce('Play run')
  if (stepIndex.value < 0) runStep()
  playTimer = setInterval(() => {
    if (stepIndex.value >= STEP_COUNT - 1) {
      playing.value = false
      if (playTimer) clearInterval(playTimer)
      playTimer = undefined
      return
    }
    runStep()
  }, 1400)
}

function resetDemo() {
  playing.value = false
  if (playTimer) clearInterval(playTimer)
  playTimer = undefined
  stopAll(motionSet)
  const reset = resetProject(project.value.id)
  root.value = reset.root
  handoffs.value = reset.handoffs
  stepIndex.value = -1
  closeDialog()
  announce(reset.announce)
  nextTick(() => stageRef.value && playEntrance(stageRef.value, motionSet))
  syncClock()
}

function stepOnce() {
  if (stepIndex.value >= STEP_COUNT - 1) return
  runStep()
}

function measureStage() {
  if (!stageRef.value) return
  stageWidth.value = Math.max(320, stageRef.value.clientWidth - 32)
}

onMounted(() => {
  measureStage()
  if (stageRef.value) {
    playEntrance(stageRef.value, motionSet)
    stageObserver = new ResizeObserver(() => measureStage())
    stageObserver.observe(stageRef.value)
  }
  syncClock()
})
</script>

<template>
  <section
    class="crew"
    :class="[`crew-${theme ?? 'inherit'}`, { 'crew-local-dark': localDark && localDarkThemes.has(theme ?? '') }]"
    :aria-label="title ?? 'Agent crew simulation'"
    role="tree"
    @keydown="onKeydown"
  >
    <header class="crew__head">
      <div class="crew__project">
        <span>{{ project.name }}</span>
        <small v-if="title">{{ title }}</small>
      </div>
      <div class="crew__counts" aria-live="polite">
        <span class="is-working">{{ stats.working }} working</span>
        <span>·</span>
        <span class="is-needs">{{ stats.needsYou }} needs you</span>
        <span>·</span>
        <span>{{ stats.agents }} agents</span>
      </div>
    </header>
    <p class="crew__notice">Synthetic demo. No provider, model, billing or network is connected.</p>
    <div class="crew__tools">
      <button type="button" @click="togglePlay">{{ playing ? 'Pause run' : 'Play run' }}</button>
      <button type="button" :disabled="project.id !== 'onboarding' || stepIndex >= STEP_COUNT - 1" @click="stepOnce">Step</button>
      <button type="button" @click="resetDemo">Reset</button>
      <button
        v-if="localDarkThemes.has(theme ?? '')"
        type="button"
        @click="localDark = !localDark"
      >{{ localDark ? 'Light mode' : 'Dark mode' }}</button>
    </div>
    <div v-if="errors.length" class="crew-error" role="status">{{ errors.join('; ') }}</div>
    <div v-else ref="stageRef" class="crew__stage" :style="{ minHeight: `${layout.height}px` }" tabindex="0">
      <svg v-if="!listMode" class="crew__wires" :width="stageWidth" :height="layout.height" aria-hidden="true">
        <path
          v-for="wire in layout.wires"
          :key="`${wire.parent}:${wire.child}`"
          class="crew-wire-line"
          :data-wire="`${wire.parent}:${wire.child}`"
          :d="wire.d"
        />
      </svg>
      <AgentCrewCard
        v-for="rect in layout.rects"
        :key="rect.id"
        :agent="ordered.find(a => a.id === rect.id) ?? root"
        :level="rect.level"
        :selected="selection === rect.id"
        :dialog-open="dialogOpen && selection === rect.id"
        :now="now"
        :style="listMode ? undefined : { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px` }"
        @select="el => setSelection(rect.id, el)"
      />
      <AgentCrewDialog
        v-if="dialogOpen && selectedAgent && selectedRect"
        :agent="selectedAgent"
        :now="now"
        :style="listMode ? undefined : { left: `${selectedRect.left}px`, top: `${selectedRect.top + selectedRect.height + 12}px`, width: '300px' }"
        @close="closeDialog"
      />
    </div>
    <p class="crew-live" aria-live="polite">{{ liveText }}</p>
  </section>
</template>

<style scoped>
@container (max-width: 1000px) {
  :deep(.crew-card) { position: relative !important; inset: auto !important; width: 100% !important; }
}
</style>