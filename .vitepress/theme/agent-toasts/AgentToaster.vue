<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId } from 'vue'
import AgentToast from './AgentToast.vue'
import { COLLAPSE_GRACE, GAP, PEEK, PEEK_SCALE } from './toast.motion'
import type { DismissReason, StackItem } from './toast.model'

const props = withDefaults(
  defineProps<{
    items: StackItem[]
    queued: number
    max?: number
    placement?: 'bottom-right' | 'bottom-center'
    expanded?: boolean
    reduced?: boolean
    spotlightId?: string | null
  }>(),
  { max: 6, placement: 'bottom-right', expanded: false, reduced: false, spotlightId: null },
)

const emit = defineEmits<{
  'update:expanded': [boolean]
  dismiss: [id: string, reason: DismissReason]
  action: [id: string, actionId: string]
  pause: []
  resume: []
  spot: [string | null]
}>()

const uid = useId()
const regionRef = ref<HTMLElement | null>(null)
const hover = ref(false)
const focusIn = ref(false)
const politeText = ref('')
const assertiveText = ref('')
let politeTimer: ReturnType<typeof setTimeout> | undefined
let assertiveTimer: ReturnType<typeof setTimeout> | undefined
let collapseTimer: ReturnType<typeof setTimeout> | undefined

const expandedNow = computed(() => props.expanded || hover.value || focusIn.value)

function announce(text: string, politeness: 'polite' | 'assertive') {
  const clearPolite = () => {
    politeText.value = ''
    politeTimer = undefined
  }
  const clearAssertive = () => {
    assertiveText.value = ''
    assertiveTimer = undefined
  }
  if (politeness === 'assertive') {
    assertiveText.value = ''
    clearTimeout(assertiveTimer)
    assertiveTimer = setTimeout(() => {
      assertiveText.value = text
      setTimeout(clearAssertive, 120)
    }, 60)
  } else {
    politeText.value = ''
    clearTimeout(politeTimer)
    politeTimer = setTimeout(() => {
      politeText.value = text
      setTimeout(clearPolite, 120)
    }, 60)
  }
}

defineExpose({ announce })

function depth(index: number) {
  return props.items.length - 1 - index
}

function itemTransform(index: number) {
  const d = depth(index)
  if (expandedNow.value) {
    let offset = 0
    for (let i = index + 1; i < props.items.length; i++) offset += 64 + GAP
    return `translateY(-${offset}px)`
  }
  if (d === 0) return 'translateY(0) scale(1)'
  if (d === 1) return `translateY(-${PEEK}px) scale(${1 - PEEK_SCALE})`
  if (d === 2) return `translateY(-${PEEK * 2}px) scale(${1 - PEEK_SCALE * 2})`
  return `translateY(-${PEEK * 2}px) scale(.85)`
}

function onEnter() {
  hover.value = true
  clearTimeout(collapseTimer)
  emit('pause')
}

function onLeave() {
  hover.value = false
  collapseTimer = setTimeout(() => {
    if (!focusIn.value) emit('update:expanded', false)
    if (!focusIn.value && !hover.value) emit('resume')
  }, COLLAPSE_GRACE)
}

function onFocusIn() {
  focusIn.value = true
  emit('update:expanded', true)
  emit('pause')
}

function onFocusOut(e: FocusEvent) {
  if (!regionRef.value?.contains(e.relatedTarget as Node)) {
    focusIn.value = false
    emit('resume')
  }
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('update:expanded', false)
}

function resolveId(item: StackItem) {
  return item.data.id ?? item.key
}

onBeforeUnmount(() => {
  clearTimeout(collapseTimer)
  clearTimeout(politeTimer)
  clearTimeout(assertiveTimer)
})
</script>

<template>
  <section
    ref="regionRef"
    class="atoast__region"
    :class="[`atoast__region--${placement}`, { 'atoast__region--expanded': expandedNow }]"
    role="region"
    aria-label="Agent notifications"
    @pointerenter="onEnter"
    @pointerleave="onLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @keydown="onKey"
  >
    <p v-if="queued > 0" class="atoast__queue" aria-hidden="true">+{{ Math.min(queued, 99) }} more</p>
    <div class="atoast__live" aria-live="polite" aria-atomic="true">{{ politeText }}</div>
    <div class="atoast__live" aria-live="assertive" aria-atomic="true">{{ assertiveText }}</div>
    <ol class="atoast__list">
      <li
        v-for="(item, index) in items"
        :key="item.key"
        class="atoast__item"
        :class="{ 'atoast__item--spot': spotlightId && spotlightId !== item.key }"
        :style="{ transform: itemTransform(index), zIndex: 100 + index }"
        :aria-busy="item.data.busy ? 'true' : undefined"
      >
        <AgentToast
          :item="item"
          :depth="depth(index)"
          :expanded="expandedNow"
          :reduced="reduced"
          :compact="placement === 'bottom-center'"
          :title-id="`${uid}-t-${index}`"
          @dismiss="r => emit('dismiss', resolveId(item), r)"
          @action="a => emit('action', resolveId(item), a)"
          @spot="on => emit('spot', on ? item.key : null)"
        />
      </li>
    </ol>
  </section>
</template>