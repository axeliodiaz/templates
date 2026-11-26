<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ToastVisual from './ToastVisual.vue'
import { altText, type AgentToastData, type DetailPart } from './toast.model'
import { ARM_GUARD_MS, exitToast, reducedNow, type Controls } from './toast.motion'

const props = withDefaults(
  defineProps<{
    data: AgentToastData
    toastKey: string
    depth?: number
    collapsed?: boolean
    size?: 'md' | 'sm'
    reduced?: boolean
  }>(),
  { depth: 0, collapsed: false, size: 'md', reduced: false },
)

const emit = defineEmits<{
  dismiss: [id: string, reason: 'close' | 'swipe']
  action: [id: string, actionId: string]
  spotlight: [id: string]
  pause: [id: string]
  resume: [id: string]
}>()

const cardRef = ref<HTMLElement | null>(null)
const armed = ref(false)
const dragging = ref(false)
const dragX = ref(0)
let armTimer: ReturnType<typeof setTimeout> | undefined
let startX = 0
let pointerId: number | null = null
const motionSet = new Set<Controls>()
const isClient = typeof window !== 'undefined'

const titleId = computed(() => `atoast-title-${props.toastKey}`)
const detailId = computed(() => `atoast-detail-${props.toastKey}`)
const toneClass = computed(() => `atoast-card--${props.data.tone}`)
const graphicLabel = computed(() => props.data.alt ?? altText(props.data.visual))
const detailParts = computed((): DetailPart[] | null => {
  if (!props.data.detail) return null
  if (typeof props.data.detail === 'string') return [{ text: props.data.detail }]
  return props.data.detail
})
const showDismiss = computed(() => props.data.dismissible !== false && !props.data.busy)
const inertBelow = computed(() => props.collapsed && props.depth >= 1)

const fixTypo = computed(() => props.data.id ?? props.toastKey)

onMounted(() => {
  if (!isClient) {
    armed.value = true
    return
  }
  armTimer = setTimeout(() => {
    armed.value = true
  }, ARM_GUARD_MS)
})

onBeforeUnmount(() => {
  if (armTimer) clearTimeout(armTimer)
})

function handleDismiss(reason: 'close' | 'swipe') {
  if (!armed.value && reason === 'swipe') return
  const el = cardRef.value
  const done = () => emit('dismiss', fixTypo.value, reason)
  if (el && reason === 'swipe' && !reducedNow() && !props.reduced) {
    exitToast(el, motionSet, done)
  } else done()
}

function onAction() {
  if (!props.data.action || props.data.busy) return
  emit('action', fixTypo.value, props.data.action.id)
}

function onPointerDown(e: PointerEvent) {
  if (!isClient || !showDismiss.value || inertBelow.value) return
  if ((e.target as HTMLElement).closest('button')) return
  pointerId = e.pointerId
  startX = e.clientX
  dragging.value = true
  cardRef.value?.setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value || e.pointerId !== pointerId) return
  dragX.value = Math.max(0, e.clientX - startX)
  if (cardRef.value) cardRef.value.style.transform = `translateX(${dragX.value}px)`
}

function onPointerUp(e: PointerEvent) {
  if (!dragging.value || e.pointerId !== pointerId) return
  dragging.value = false
  pointerId = null
  const threshold = 72
  if (dragX.value > threshold) handleDismiss('swipe')
  else if (cardRef.value) cardRef.value.style.transform = ''
  dragX.value = 0
}

function onFocusIn() {
  emit('spotlight', fixTypo.value)
  emit('pause', fixTypo.value)
}

function onFocusOut() {
  emit('resume', fixTypo.value)
}

function onEnter() {
  emit('spotlight', fixTypo.value)
  emit('pause', fixTypo.value)
}

function onLeave() {
  emit('resume', fixTypo.value)
}
</script>

<template>
  <li
    ref="cardRef"
    class="atoast-card"
    :class="[toneClass, { 'atoast-card--busy': data.busy, 'atoast-card--stacked': depth > 0, 'atoast-card--inert': inertBelow }]"
    :style="depth ? { '--atoast-depth': depth } : undefined"
    role="listitem"
    :aria-labelledby="titleId"
    :aria-describedby="detailParts ? detailId : undefined"
    :inert="inertBelow || undefined"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <div class="atoast-card__graphic" role="img" :aria-label="graphicLabel">
      <ToastVisual :visual="data.visual" :size="size" />
    </div>
    <div class="atoast-card__body">
      <h3 :id="titleId" class="atoast-card__title" :class="{ 'atoast-card__title--busy': data.busy }">
        {{ data.title }}
      </h3>
      <p v-if="detailParts" :id="detailId" class="atoast-card__detail">
        <template v-for="(part, i) in detailParts" :key="i">
          <span v-if="part.kind === 'plus'" class="atoast-detail--plus">{{ part.text }}</span>
          <span v-else-if="part.kind === 'minus'" class="atoast-detail--minus">{{ part.text }}</span>
          <span v-else-if="part.kind === 'mono'" class="atoast-detail--mono">{{ part.text }}</span>
          <span v-else>{{ part.text }}</span>
        </template>
      </p>
    </div>
    <div class="atoast-card__actions">
      <button
        v-if="data.action && !data.busy"
        type="button"
        class="atoast-card__action"
        @click="onAction"
      >
        {{ data.action.label }}
      </button>
      <button
        v-if="showDismiss"
        type="button"
        class="atoast-card__dismiss"
        :aria-label="`Dismiss ${data.title}`"
        @click="handleDismiss('close')"
      >
        ×
      </button>
    </div>
  </li>
</template>