<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AgentToast from './AgentToast.vue'
import type { ToastStore } from './toast.store'
import { enterToast, profileForTheme, reducedNow, shiftStack, stopAll, type Controls } from './toast.motion'

const props = withDefaults(
  defineProps<{
    store: ToastStore
    theme?: string
    expanded?: boolean
    placement?: 'bottom-right' | 'center'
    reduced?: boolean
  }>(),
  { expanded: false, placement: 'bottom-right' },
)

const emit = defineEmits<{ spotlight: [id: string]; action: [id: string, actionId: string] }>()

const regionRef = ref<HTMLElement | null>(null)
const politeText = ref('')
const assertiveText = ref('')
const motionSet = new Set<Controls>()
const isClient = typeof window !== 'undefined'
const profile = computed(() => profileForTheme(props.theme))
const items = computed(() => props.store.visible())
const queueCount = computed(() => props.store.queueCount())
const reduced = computed(() => props.reduced ?? (isClient && reducedNow()))

let visibilityHandler: (() => void) | undefined

function onAnnounce(text: string, politeness: 'polite' | 'assertive') {
  if (politeness === 'assertive') assertiveText.value = text
  else politeText.value = text
}

function onRegionEnter() {
  props.store.pause()
}

function onRegionLeave() {
  props.store.resume()
}

function onVisibility() {
  if (!isClient) return
  if (document.visibilityState === 'hidden') props.store.pause()
  else props.store.resume()
}

watch(
  () => props.store.visible().map(i => i.key).join(','),
  async () => {
    if (!isClient || reduced.value) return
    await nextTick()
    const list = regionRef.value?.querySelectorAll<HTMLElement>('.atoast-card')
    if (!list?.length) return
    const last = list[list.length - 1]
    if (last) enterToast(last, motionSet, profile.value)
    shiftStack([...list], motionSet)
  },
)

onMounted(() => {
  props.store.setAnnounce(onAnnounce)
  if (!isClient) return
  visibilityHandler = onVisibility
  document.addEventListener('visibilitychange', visibilityHandler)
  const list = regionRef.value?.querySelectorAll<HTMLElement>('.atoast-card')
  list?.forEach(el => enterToast(el, motionSet, profile.value))
})

onBeforeUnmount(() => {
  stopAll(motionSet)
  props.store.setAnnounce(undefined)
  if (visibilityHandler) document.removeEventListener('visibilitychange', visibilityHandler)
})

function onDismiss(id: string, reason: 'close' | 'swipe') {
  props.store.dismiss(id, reason)
}

function onAction(id: string, actionId: string) {
  emit('action', id, actionId)
}

function onSpotlight(id: string) {
  emit('spotlight', id)
}
</script>

<template>
  <div
    ref="regionRef"
    class="atoast-region"
    :class="[
      `atoast-region--${placement}`,
      { 'atoast-region--expanded': expanded, 'is-reduced': reduced },
    ]"
    role="region"
    aria-label="Agent notifications"
    @mouseenter="onRegionEnter"
    @mouseleave="onRegionLeave"
    @focusin="onRegionEnter"
    @focusout="onRegionLeave"
  >
    <p
      class="atoast-live atoast-live--polite"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ politeText }}
    </p>
    <p
      class="atoast-live atoast-live--assertive"
      aria-live="assertive"
      aria-atomic="true"
    >
      {{ assertiveText }}
    </p>
    <p v-if="queueCount" class="atoast-queue" role="status">
      +{{ queueCount }} queued
    </p>
    <ol class="atoast-list" :class="{ 'atoast-list--deck': !expanded }">
      <AgentToast
        v-for="(item, index) in items"
        :key="item.key"
        :toast-key="item.key"
        :data="item.data"
        :depth="expanded ? 0 : items.length - 1 - index"
        :collapsed="!expanded"
        :reduced="reduced"
        @dismiss="onDismiss"
        @action="onAction"
        @spotlight="onSpotlight"
        @pause="id => store.pause(id)"
        @resume="id => store.resume(id)"
      />
    </ol>
  </div>
</template>