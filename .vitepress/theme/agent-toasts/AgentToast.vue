<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import ToastVisual from './ToastVisual.vue'
import { altText, plainDetail, type StackItem } from './toast.model'
import { ARM_GUARD } from './toast.motion'

const props = defineProps<{
  item: StackItem
  depth: number
  expanded: boolean
  reduced: boolean
  compact: boolean
  titleId: string
  layoutTick?: string
}>()

const emit = defineEmits<{
  dismiss: [reason: 'close' | 'swipe']
  action: [actionId: string]
  spot: [boolean]
  layout: []
}>()

const cardRef = ref<HTMLElement | null>(null)
const dragX = ref(0)
const armedAt = ref(0)
const entering = ref(true)
let startX = 0
let startT = 0
let trackingPointer = false
let narrow = false
let enterTimer: ReturnType<typeof setTimeout> | undefined

const toast = computed(() => props.item.data)
const alt = computed(() => toast.value.alt ?? altText(toast.value.visual))
const dismissLabel = computed(() => `Dismiss notification: ${toast.value.title}`)
const inertPeek = computed(() => !props.expanded && props.depth >= 1)
const showAction = computed(() => !!toast.value.action && !toast.value.busy)
const canDismiss = computed(() => toast.value.dismissible !== false)

function armGuard() {
  armedAt.value = performance.now()
}

onMounted(() => {
  armGuard()
  if (typeof matchMedia !== 'undefined') narrow = matchMedia('(max-width: 480px)').matches
  enterTimer = setTimeout(() => {
    entering.value = false
    emit('layout')
  }, 360)
})

onBeforeUnmount(() => clearTimeout(enterTimer))

watch(
  () => props.layoutTick,
  () => {
    armGuard()
    emit('layout')
  },
)

function onActionClick(e: MouseEvent) {
  if (e.detail > 0 && armedAt.value > 0 && performance.now() - armedAt.value < ARM_GUARD) {
    e.preventDefault()
    return
  }
  if (toast.value.action && !toast.value.busy) emit('action', toast.value.action.id)
}

function pointerDown(e: PointerEvent) {
  if (!canDismiss.value || (e.target as HTMLElement).closest('button')) return
  startX = e.clientX
  startT = performance.now()
  trackingPointer = true
  if (e.isTrusted) (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
}

function pointerMove(e: PointerEvent) {
  if (!trackingPointer) return
  narrow = matchMedia('(max-width: 480px)').matches
  const raw = e.clientX - startX
  if (!narrow && raw < 0) {
    dragX.value = Math.max(raw, -24)
    return
  }
  dragX.value = Math.min(Math.max(raw, narrow ? -120 : -24), 120)
}

function pointerUp(e: PointerEvent) {
  if (!trackingPointer) return
  trackingPointer = false
  const dx = e.clientX - startX
  const dt = performance.now() - startT
  const v = Math.abs(dx) / Math.max(dt, 1)
  if (!narrow && dx < 0) {
    dragX.value = 0
    return
  }
  if ((narrow ? Math.abs(dx) : dx) >= 64 || v >= 0.45) {
    if (narrow || dx > 0) {
      emit('dismiss', 'swipe')
      return
    }
  }
  dragX.value = 0
}

function pointerCancel() {
  trackingPointer = false
  dragX.value = 0
}

function onClose() {
  emit('dismiss', 'close')
}
</script>

<template>
  <article
    ref="cardRef"
    class="atoast__card"
    :class="{
      'atoast__card--busy': toast.busy,
      'atoast__card--peek': inertPeek,
      'atoast__card--enter': entering && !reduced,
    }"
    :aria-labelledby="titleId"
    :inert="inertPeek || undefined"
    :style="dragX ? { transform: `translateX(${dragX}px)` } : undefined"
    @pointerdown="pointerDown"
    @pointermove="pointerMove"
    @pointerup="pointerUp"
    @pointercancel="pointerCancel"
  >
    <ToastVisual :visual="toast.visual" :size="compact ? 'sm' : 'md'" />
    <div class="atoast__text">
      <h4 :id="titleId" class="atoast__title" :title="toast.title">{{ toast.title }}</h4>
      <p v-if="toast.detail" class="atoast__detail" :title="plainDetail(toast.detail)">
        <template v-if="typeof toast.detail === 'string'">{{ toast.detail }}</template>
        <template v-else>
          <span
            v-for="(part, i) in toast.detail"
            :key="i"
            :class="{
              'atoast__mono': part.kind === 'mono',
              'atoast__plus': part.kind === 'plus',
              'atoast__minus': part.kind === 'minus',
            }"
          >{{ part.text }}</span>
        </template>
      </p>
      <span class="atoast__vh">{{ alt }}</span>
    </div>
    <button
      v-if="showAction"
      type="button"
      class="atoast__act"
      @click.stop="onActionClick"
      @pointerenter="emit('spot', true)"
      @pointerleave="emit('spot', false)"
      @focusin="emit('spot', true)"
      @focusout="emit('spot', false)"
    >
      {{ toast.action!.label }}
    </button>
    <button v-if="canDismiss" type="button" class="atoast__close" :aria-label="dismissLabel" @click.stop="onClose">
      <span aria-hidden="true">×</span>
    </button>
  </article>
</template>