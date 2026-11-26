<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
}>()

const emit = defineEmits<{
  dismiss: [reason: 'close' | 'swipe']
  action: [actionId: string]
  spot: [boolean]
}>()

const dragX = ref(0)
const armedAt = ref(0)
let startX = 0
let startT = 0
let trackingPointer = false

const toast = computed(() => props.item.data)
const alt = computed(() => toast.value.alt ?? altText(toast.value.visual))
const dismissLabel = computed(() => `Dismiss notification: ${toast.value.title}`)
const inertPeek = computed(() => !props.expanded && props.depth >= 1)
const showAction = computed(() => !!toast.value.action && !toast.value.busy)
const canDismiss = computed(() => toast.value.dismissible !== false)

onMounted(() => {
  armedAt.value = performance.now()
})

function onActionClick(e: MouseEvent) {
  if (e.detail > 0 && armedAt.value > 0 && performance.now() - armedAt.value < ARM_GUARD) {
    e.preventDefault()
    return
  }
  if (toast.value.action && !toast.value.busy) emit('action', toast.value.action.id)
}

function pointerDown(e: PointerEvent) {
  if ((e.target as HTMLElement).closest('button')) return
  startX = e.clientX
  startT = performance.now()
  trackingPointer = true
}

function pointerMove(e: PointerEvent) {
  if (!trackingPointer) return
  dragX.value = Math.min(Math.max(e.clientX - startX, -24), 120)
}

function pointerUp(e: PointerEvent) {
  if (!trackingPointer) return
  trackingPointer = false
  const dx = e.clientX - startX
  const dt = performance.now() - startT
  const v = Math.abs(dx) / Math.max(dt, 1)
  if (Math.abs(dx) >= 64 || v >= 0.45) {
    emit('dismiss', 'swipe')
    return
  }
  dragX.value = 0
}
</script>

<template>
  <article
    class="atoast__card"
    :class="{ 'atoast__card--busy': toast.busy, 'atoast__card--peek': inertPeek }"
    :aria-labelledby="titleId"
    :inert="inertPeek || undefined"
    :style="dragX ? { transform: `translateX(${dragX}px)` } : undefined"
    @pointerdown="pointerDown"
    @pointermove="pointerMove"
    @pointerup="pointerUp"
    @pointercancel="pointerUp"
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
    <button v-if="canDismiss" type="button" class="atoast__close" :aria-label="dismissLabel" @click="emit('dismiss', 'close')">
      <span aria-hidden="true">×</span>
    </button>
  </article>
</template>