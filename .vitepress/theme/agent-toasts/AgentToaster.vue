<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import AgentToast from './AgentToast.vue'
import { COLLAPSE_GRACE, GAP, PEEK, PEEK_SCALE } from './toast.motion'
import type { PauseReason } from './toast.store'
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
  pause: [reason: PauseReason]
  resume: [reason: PauseReason]
  spot: [string | null]
  focusExit: []
}>()

const uid = useId()
const regionRef = ref<HTMLElement | null>(null)
const hover = ref(false)
const focusIn = ref(false)
const touchDeck = ref(false)
const politeText = ref('')
const assertiveText = ref('')
const itemHeights = ref<number[]>([])
const itemRefs = ref<HTMLElement[]>([])
let politeTimer: ReturnType<typeof setTimeout> | undefined
let assertiveTimer: ReturnType<typeof setTimeout> | undefined
let collapseTimer: ReturnType<typeof setTimeout> | undefined
let focusBefore: HTMLElement | null = null
let ro: ResizeObserver | undefined

const expandedNow = computed(() => props.expanded || hover.value || focusIn.value || touchDeck.value)

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

defineExpose({ announce, collapseTouch: () => { touchDeck.value = false } })

function depth(index: number) {
  return props.items.length - 1 - index
}

function itemTransform(index: number) {
  if (expandedNow.value) return undefined
  const d = depth(index)
  const h0 = itemHeights.value[index] ?? 64
  const h1 = itemHeights.value[index + 1] ?? 64
  const peek1 = Math.min(PEEK, h1 * PEEK_SCALE)
  if (d === 0) return 'translateY(0) scale(1)'
  if (d === 1) return `translateY(-${peek1}px) scale(${1 - PEEK_SCALE})`
  const peek2 = peek1 + Math.min(PEEK, (itemHeights.value[index + 2] ?? 64) * PEEK_SCALE)
  if (d >= 2) return `translateY(-${peek2}px) scale(${1 - PEEK_SCALE * 2})`
  return undefined
}

function itemHidden(index: number) {
  return !expandedNow.value && depth(index) >= 3
}

function measureHeights() {
  itemHeights.value = props.items.map((_, i) => {
    const el = itemRefs.value[i]
    return el ? Math.ceil(el.getBoundingClientRect().height) : 64
  })
}

function setItemRef(el: HTMLElement | null, index: number) {
  if (el) itemRefs.value[index] = el
}

function scheduleCollapse() {
  clearTimeout(collapseTimer)
  collapseTimer = setTimeout(() => {
    if (!focusIn.value && !hover.value && !props.expanded) {
      touchDeck.value = false
      emit('update:expanded', false)
    }
    if (!focusIn.value && !hover.value) emit('resume', 'hover')
  }, COLLAPSE_GRACE)
}

function onEnter() {
  hover.value = true
  clearTimeout(collapseTimer)
  emit('pause', 'hover')
}

function onLeave() {
  hover.value = false
  scheduleCollapse()
}

function onFocusIn(e: FocusEvent) {
  const t = e.target as HTMLElement
  if (t.closest('.atoast__act,.atoast__close')) focusBefore = regionRef.value?.closest('.atoast')?.querySelector<HTMLElement>('.atoast__btn') ?? null
  else focusBefore = (e.relatedTarget as HTMLElement) ?? null
  focusIn.value = true
  emit('pause', 'focus')
}

function onFocusOut(e: FocusEvent) {
  if (!regionRef.value?.contains(e.relatedTarget as Node)) {
    focusIn.value = false
    emit('resume', 'focus')
    scheduleCollapse()
  }
}

function onRegionPointerDown(e: PointerEvent) {
  if (expandedNow.value) return
  if (e.pointerType === 'touch' || e.pointerType === 'pen') {
    touchDeck.value = true
    emit('pause', 'hover')
  }
}

function onKey(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  e.stopPropagation()
  touchDeck.value = false
  focusIn.value = false
  emit('update:expanded', false)
  emit('resume', 'focus')
  emit('resume', 'hover')
  const back = focusBefore
  nextTick(() => {
    back?.focus()
    focusBefore = null
  })
}

function rescueFocus(id: string) {
  nextTick(() => {
    const root = regionRef.value
    if (!root) return
    const buttons = [...root.querySelectorAll<HTMLElement>('.atoast__close,.atoast__act')]
    const stageBtn = root.closest('.atoast')?.querySelector<HTMLElement>('.atoast__btn')
    const target = buttons.find(b => b.offsetParent !== null) ?? stageBtn
    target?.focus()
    if (!target) emit('focusExit')
  })
}

function resolveId(item: StackItem) {
  return item.data.id ?? item.key
}

watch(
  () => props.items.length,
  () => {
    nextTick(measureHeights)
  },
)

function onDocKey(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  if (!focusIn.value && !props.expanded && !hover.value && !touchDeck.value) return
  onKey(e)
}

onMounted(() => {
  ro = new ResizeObserver(() => measureHeights())
  nextTick(() => {
    measureHeights()
    itemRefs.value.forEach(el => el && ro?.observe(el))
  })
  document.addEventListener('keydown', onDocKey)
})

watch(
  () => props.items.map(it => it.key).join(','),
  () => {
    nextTick(() => {
      measureHeights()
      itemRefs.value.forEach(el => el && ro?.observe(el))
    })
  },
)

onBeforeUnmount(() => {
  clearTimeout(collapseTimer)
  clearTimeout(politeTimer)
  clearTimeout(assertiveTimer)
  ro?.disconnect()
  document.removeEventListener('keydown', onDocKey)
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
    @pointerdown="onRegionPointerDown"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @keydown="onKey"
  >
    <p v-if="queued > 0" class="atoast__queue" aria-hidden="true">+{{ Math.min(queued, 99) }} more</p>
    <div class="atoast__live" aria-live="polite" aria-atomic="true">{{ politeText }}</div>
    <div class="atoast__live" aria-live="assertive" aria-atomic="true">{{ assertiveText }}</div>
    <ol class="atoast__list" :class="expandedNow ? 'atoast__list--expanded' : 'atoast__list--deck'">
      <li
        v-for="(item, index) in items"
        :key="item.key"
        :ref="el => setItemRef(el as HTMLElement, index)"
        class="atoast__item"
        :class="{
          'atoast__item--spot': spotlightId && spotlightId !== item.key,
          'atoast__item--buried': itemHidden(index),
        }"
        :style="
          expandedNow
            ? { zIndex: 100 + index }
            : { transform: itemTransform(index), zIndex: 100 + index, opacity: itemHidden(index) ? 0 : undefined }
        "
        :aria-busy="item.data.busy ? 'true' : undefined"
      >
        <AgentToast
          :item="item"
          :depth="depth(index)"
          :expanded="expandedNow"
          :reduced="reduced"
          :compact="placement === 'bottom-center'"
          :title-id="`${uid}-t-${index}`"
          :layout-tick="itemHeights.join(',')"
          @dismiss="r => { emit('dismiss', resolveId(item), r); rescueFocus(resolveId(item)) }"
          @action="a => emit('action', resolveId(item), a)"
          @spot="on => emit('spot', on ? item.key : null)"
          @layout="measureHeights"
        />
      </li>
    </ol>
  </section>
</template>