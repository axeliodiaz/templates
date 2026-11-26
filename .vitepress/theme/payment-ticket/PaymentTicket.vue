<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch } from 'vue'
import { autoExploreScript, samplePaid } from './ticket.sample'
import {
  countUpAmount,
  keep,
  playEntrance,
  reducedNow,
  runScan,
  runTear,
  stopAll,
  type Controls,
  type MotionProfile,
} from './ticket.motion'
import {
  barcodeBars,
  barcodeDigits,
  formatMoney,
  formatPaidAt,
  fundingLabel,
  validate,
  type Ack,
  type PaymentTicketData,
  type TicketAction,
} from './ticket.model'
import './ticket.css'

const props = withDefaults(defineProps<{
  theme?: string
  title?: string
  data?: PaymentTicketData | null
  torn?: boolean
  act?: (action: TicketAction, data: PaymentTicketData) => Promise<Ack>
  demoState?: 'paid' | 'pending' | 'failed' | 'empty' | 'invalid'
}>(), { torn: false })

const emit = defineEmits<{
  'update:torn': [boolean]
  action: [action: TicketAction, result: Ack]
}>()

const motionSet = new Set<Controls>()
const isClient = typeof window !== 'undefined'
const uid = useId()
const titleId = `ticket-title-${uid}`
const liveId = `ticket-live-${uid}`

const localDark = ref(false)
const localDarkThemes = new Set(['meadow', 'sentinel', 'brief'])
const ticket = shallowRef<PaymentTicketData | null>(props.data === undefined ? samplePaid() : props.data)
const tornLocal = ref(props.torn)
const cardPinned = ref(false)
const cardHover = ref(false)
const cardExpanded = computed(() => cardPinned.value || cardHover.value)
const copyChip = ref<'copied' | 'failed' | null>(null)
const autoExplore = ref(false)
const liveText = ref('')
const paperRef = ref<HTMLElement | null>(null)
const stubRef = ref<HTMLElement | null>(null)
const scanLineRef = ref<HTMLElement | null>(null)
const barcodeRef = ref<HTMLElement | null>(null)
const amountRef = ref<HTMLElement | null>(null)
const lastFocusAct = ref<string | null>(null)
const finePointer = ref(false)
const tilt = ref({ x: 0, y: 0 })

let copyTimer: ReturnType<typeof setTimeout> | undefined
let liveTimer: ReturnType<typeof setTimeout> | undefined
let liveBuffer: string[] = []
let tourTimers: ReturnType<typeof setTimeout>[] = []
let reducedMedia: MediaQueryList | undefined
let visibilityHandler: (() => void) | undefined

const motionProfile = computed((): MotionProfile => {
  const t = props.theme ?? 'lustro'
  if (t === 'evertrue') return 'calm'
  if (t === 'bastion') return 'terminal'
  if (t === 'pawprint') return 'playful'
  if (t === 'lustro') return 'glass'
  return 'default'
})

const errors = computed(() => {
  if (props.demoState === 'invalid') return ['missing reference']
  return validate(ticket.value)
})
const status = computed(() => ticket.value?.status ?? 'paid')
const showEmpty = computed(() => props.demoState === 'empty' || ticket.value === null)
const showDemoBar = computed(() => status.value === 'paid' && !showEmpty.value && errors.value.length === 0)
const reduced = computed(() => (isClient ? reducedNow() : false))

const barcode = computed(() => ticket.value ? barcodeBars(ticket.value.reference) : { bars: [] as [number, number][], width: 0 })
const digitGroups = computed(() => ticket.value ? barcodeDigits(ticket.value.reference) : ['0', '', ''] as [string, string, string])

const copyStrings = {
  paid: { title: 'Payment confirmed', message: 'Your payment went through and your ticket is ready.' },
  pending: { title: 'Confirming payment', message: 'This usually takes a few seconds. Keep this page open.' },
  failed: { title: 'Payment didn’t go through', message: 'Your card wasn’t charged. Try again or use another method.' },
}

function announce(message: string) {
  if (!isClient) return
  liveBuffer.push(message)
  if (!liveTimer) {
    liveTimer = setTimeout(() => {
      liveText.value = liveBuffer.join(' · ')
      liveBuffer = []
      liveTimer = undefined
    }, 250)
  }
}

function clearTour() {
  tourTimers.forEach(t => clearTimeout(t))
  tourTimers = []
  autoExplore.value = false
}

function stopExplore() {
  clearTour()
}

async function invoke(action: TicketAction): Promise<Ack> {
  if (!ticket.value) return { state: 'error', message: 'No ticket' }
  if (props.act) {
    try {
      const result = await props.act(action, ticket.value)
      emit('action', action, result)
      return result
    } catch (e) {
      const result = { state: 'error' as const, message: String(e) }
      emit('action', action, result)
      return result
    }
  }
  const ack = { state: 'ack' as const, message: 'Demo ack' }
  emit('action', action, ack)
  return ack
}

function replayEntrance() {
  stopAll(motionSet)
  cardPinned.value = false
  cardHover.value = false
  tornLocal.value = false
  emit('update:torn', false)
  nextTick(() => {
    if (!paperRef.value || !ticket.value) return
    const minor = ticket.value.amount.minor
    playEntrance(paperRef.value, motionSet, motionProfile.value, (el, from, to) => {
      if (minor === null) el.textContent = 'n/a'
      else countUpAmount(el, from, to, n => formatMoney(n, ticket.value!.amount.currency), motionSet)
    })
  })
}

function loadSample() {
  ticket.value = samplePaid()
  replayEntrance()
}

async function copyRef(userGesture: boolean) {
  if (!ticket.value || status.value !== 'paid') return
  stopExplore()
  if (userGesture && isClient && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(ticket.value.reference)
      copyChip.value = 'copied'
      announce('Ticket number copied')
      await invoke('copy')
    } catch {
      copyChip.value = 'failed'
      announce('Copy unavailable. The number is selected; press Control or Command plus C')
      const btn = paperRef.value?.querySelector<HTMLButtonElement>('.ticket__ref')
      btn?.focus()
      if (btn && typeof document !== 'undefined') {
        const range = document.createRange()
        range.selectNodeContents(btn)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
    }
  } else if (!userGesture) {
    copyChip.value = 'copied'
    announce('Ticket number copied')
  }
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => { copyChip.value = null }, copyChip.value === 'failed' ? 3200 : 1600)
}

function onCardEnter() {
  if (finePointer.value) cardHover.value = true
}
function onCardLeave() {
  if (!cardPinned.value) cardHover.value = false
}
function onCardClick() {
  cardPinned.value = !cardPinned.value
  cardHover.value = cardPinned.value
  announce(cardPinned.value ? 'Card details pinned' : 'Hide card details')
  void invoke('reveal')
}

async function scanBarcode() {
  if (!scanLineRef.value || !barcodeRef.value) return
  stopExplore()
  await runScan(scanLineRef.value, barcodeRef.value, motionSet)
  announce('Demo scan complete. Barcode is decorative')
  await invoke('scan')
}

async function toggleTear() {
  if (!stubRef.value) return
  stopExplore()
  tornLocal.value = !tornLocal.value
  emit('update:torn', tornLocal.value)
  await runTear(stubRef.value, motionSet, tornLocal.value)
  announce(tornLocal.value ? 'Stub torn off' : 'Stub reattached')
  await invoke(tornLocal.value ? 'tear' : 'attach')
}

async function retryPayment() {
  if (!ticket.value) return
  ticket.value = { ...ticket.value, status: 'pending' }
  await new Promise(r => { tourTimers.push(setTimeout(r, 1400)) })
  if (ticket.value) {
    ticket.value = { ...ticket.value, status: 'paid' }
    replayEntrance()
    announce('Payment confirmed')
  }
  await invoke('retry')
}

function startAutoExplore() {
  if (reduced.value) return
  clearTour()
  autoExplore.value = true
  announce('Auto-explore started')
  for (const step of autoExploreScript) {
    tourTimers.push(setTimeout(() => {
      if (!autoExplore.value) return
      if (step.action === 'replay') replayEntrance()
      else if (step.action === 'copy') void copyRef(false)
      else if (step.action === 'reveal') { cardPinned.value = true; cardHover.value = true }
      else if (step.action === 'scan') void scanBarcode()
      else if (step.action === 'tear') void toggleTear()
      else if (step.action === 'attach') void toggleTear()
      else if (step.action === 'collapse') { cardPinned.value = false; cardHover.value = false }
      else if (step.action === 'end') { autoExplore.value = false; announce('Auto-explore finished') }
    }, step.at))
  }
}

function onToolbarClick(e: Event, run: () => void) {
  stopExplore()
  run()
}

function onPaperMove(e: MouseEvent) {
  if (!finePointer.value || reduced.value || props.theme === 'bastion') return
  const el = paperRef.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  tilt.value = { x: Math.max(-0.5, Math.min(0.5, x)) * 6, y: Math.max(-0.5, Math.min(0.5, -y)) * 6 }
}
function onPaperLeave() {
  tilt.value = { x: 0, y: 0 }
}

watch(() => props.data, (d) => {
  const prevId = ticket.value?.id
  ticket.value = d === undefined ? samplePaid() : d
  if (d && d.id !== prevId) replayEntrance()
}, { deep: true })

watch(() => props.torn, v => { tornLocal.value = v })

watch(() => props.demoState, (s) => {
  if (s === 'pending') ticket.value = { ...samplePaid(), status: 'pending' }
  else if (s === 'failed') ticket.value = { ...samplePaid(), status: 'failed' }
  else if (s === 'empty') ticket.value = null
  else if (s === 'invalid') ticket.value = { ...samplePaid(), reference: '' }
  else if (s === 'paid') ticket.value = samplePaid()
})

onMounted(() => {
  if (!isClient) return
  finePointer.value = matchMedia('(pointer: fine)').matches
  reducedMedia = matchMedia('(prefers-reduced-motion: reduce)')
  reducedMedia.addEventListener('change', () => { if (reducedNow()) stopExplore() })
  visibilityHandler = () => { if (document.hidden) stopExplore() }
  document.addEventListener('visibilitychange', visibilityHandler)
  replayEntrance()
})

onBeforeUnmount(() => {
  stopAll(motionSet)
  clearTour()
  if (copyTimer) clearTimeout(copyTimer)
  if (liveTimer) clearTimeout(liveTimer)
  reducedMedia?.removeEventListener('change', () => {})
  if (visibilityHandler) document.removeEventListener('visibilitychange', visibilityHandler)
})

const sectionLabel = computed(() => props.title ?? 'Payment ticket demo')
const paperStyle = computed(() => finePointer.value && !reduced.value && props.theme !== 'bastion'
  ? { transform: `perspective(900px) rotateX(${tilt.value.y}deg) rotateY(${tilt.value.x}deg)` }
  : undefined)
const amountDisplay = computed(() => {
  if (!ticket.value) return 'n/a'
  return formatMoney(ticket.value.amount.minor, ticket.value.amount.currency)
})
const dateLabel = computed(() => status.value === 'failed' ? 'Attempted on' : 'Paid on')
const amountLabel = computed(() => status.value === 'failed' ? 'Not charged' : 'Amount')
</script>

<template>
  <section
    class="ticket"
    :class="[`ticket-${theme ?? 'lustro'}`, { 'ticket-local-dark': localDark && localDarkThemes.has(theme ?? '') }]"
    :aria-label="sectionLabel"
  >
    <button
      v-if="localDarkThemes.has(theme ?? '')"
      type="button"
      class="ticket__theme"
      @click="localDark = !localDark"
    >
      {{ localDark ? 'Light mode' : 'Dark mode' }}
    </button>

    <div v-if="showEmpty" class="ticket__empty">
      <h3>No ticket yet</h3>
      <p>Complete a payment to see its ticket here.</p>
      <button type="button" @click="loadSample">Load sample ticket</button>
    </div>

    <p v-else-if="errors.length" class="ticket__invalid" role="alert">
      Invalid ticket data: {{ errors[0] }}
    </p>

    <template v-else-if="ticket">
      <div class="ticket__scene" :class="{ 'is-torn-gap': tornLocal }">
        <article
          ref="paperRef"
          class="ticket__paper"
          :aria-labelledby="titleId"
          :aria-busy="status === 'pending' ? 'true' : undefined"
          :style="paperStyle"
          @mousemove="onPaperMove"
          @mouseleave="onPaperLeave"
        >
          <div class="ticket__top">
            <header class="ticket__head">
              <div v-if="status === 'pending'" class="ticket__spinner" role="presentation" />
              <div v-else-if="status === 'failed'" class="ticket__badge ticket__badge--fail" aria-hidden="true">×</div>
              <div v-else class="ticket__badge-wrap">
                <span class="ticket__badge" aria-hidden="true">✓</span>
                <span v-for="i in 6" :key="i" class="ticket__spark" aria-hidden="true" />
              </div>
              <h3 :id="titleId" :class="{ 'is-fail': status === 'failed' }">{{ copyStrings[status].title }}</h3>
              <p class="ticket__msg">{{ copyStrings[status].message }}</p>
            </header>

            <div class="ticket__perf" aria-hidden="true" />

            <dl class="ticket__facts">
              <template v-if="status === 'pending'">
                <dt>Ticket no.</dt>
                <dd><span class="ticket__skel" /></dd>
                <dt>Amount</dt>
                <dd class="ticket__amt-col"><span class="ticket__skel ticket__skel--wide" /></dd>
                <dt>Paid on</dt>
                <dd><span class="ticket__skel ticket__skel--wide" /></dd>
              </template>
              <template v-else-if="status === 'failed'">
                <dt>Ticket no.</dt>
                <dd>n/a</dd>
                <dt>{{ amountLabel }}</dt>
                <dd class="ticket__amt-col">{{ amountDisplay }}</dd>
                <dt>{{ dateLabel }}</dt>
                <dd>{{ formatPaidAt(ticket.paidAt, ticket.timeZone) }}</dd>
              </template>
              <template v-else>
                <dt>Ticket no.</dt>
                <dd class="ticket__ref-wrap">
                  <button
                    type="button"
                    class="ticket__ref"
                    data-act="copy"
                    :title="ticket.reference"
                    @click="copyRef(true)"
                  >
                    {{ ticket.reference }}
                    <svg class="ticket__copy-ico" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="4" y="4" width="8" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M3 10V3h7" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
                  </button>
                  <span v-if="copyChip === 'copied'" class="ticket__chip ticket__chip--ok" role="status">Copied ✓</span>
                  <span v-if="copyChip === 'failed'" class="ticket__chip ticket__chip--fail" role="status">Copy failed</span>
                </dd>
                <dt>{{ amountLabel }}</dt>
                <dd class="ticket__amt-col" data-ticket-amount :data-target="ticket.amount.minor ?? 0">{{ amountDisplay }}</dd>
                <dt>{{ dateLabel }}</dt>
                <dd>{{ formatPaidAt(ticket.paidAt, ticket.timeZone) }}</dd>
              </template>
            </dl>

            <button
              v-if="ticket.method && status === 'paid'"
              type="button"
              class="ticket__method ticket__row"
              :aria-expanded="cardExpanded ? 'true' : 'false'"
              :aria-controls="`card-${uid}`"
              @mouseenter="onCardEnter"
              @mouseleave="onCardLeave"
              @click="onCardClick"
            >
              <span class="ticket__glyph" aria-hidden="true" />
              <span class="ticket__method-main">
                <b>{{ ticket.method.holder ?? 'n/a' }}</b>
                <span class="ticket__pan">•••• {{ ticket.method.last4 ?? 'n/a' }}</span>
              </span>
              <span class="ticket__caret" :class="{ open: cardExpanded }" aria-hidden="true" />
              <span class="ticket__method-detail" :id="`card-${uid}`">
                <span class="ticket__masked">•••• •••• •••• {{ ticket.method.last4 ?? 'n/a' }}</span>
                <span> · {{ fundingLabel(ticket.method.funding) }}</span>
              </span>
              <span class="sr-only">{{ cardExpanded ? 'Hide card details' : 'Show card details' }}</span>
            </button>

            <div v-if="status === 'paid'" class="ticket__barcode-wrap">
              <div ref="barcodeRef" class="ticket__barcode" role="img" :aria-label="`Decorative demo barcode for ticket ${ticket.reference}. Not scannable.`">
                <div class="ticket__scanline" ref="scanLineRef" aria-hidden="true" />
                <svg :viewBox="`0 0 ${barcode.width} 58`" preserveAspectRatio="none">
                  <rect v-for="([x, w], i) in barcode.bars" :key="i" class="ticket__barline" :x="x" :y="0" :width="w" height="58" />
                </svg>
              </div>
              <p class="ticket__digits" aria-hidden="true">
                <template v-for="(g, i) in digitGroups" :key="i">
                  <span v-if="g">{{ g }}</span><span v-if="g && i < 2"> · </span>
                </template>
              </p>
            </div>
          </div>

          <div
            v-if="status !== 'failed'"
            ref="stubRef"
            class="ticket__stub"
            :class="{ 'is-off': tornLocal }"
          />
          <button v-else type="button" class="ticket__retry" @click="retryPayment">Try again</button>
        </article>
      </div>

      <div v-if="showDemoBar" class="ticket__bar" role="toolbar" aria-label="Demo controls">
        <button
          type="button"
          data-act="tour"
          :disabled="reduced"
          :title="reduced ? 'Auto-explore is off while reduced motion is on' : undefined"
          :aria-pressed="autoExplore"
          @click="onToolbarClick($event, startAutoExplore)"
        >
          <span class="ticket__dot" aria-hidden="true" /> Auto-explore
        </button>
        <button type="button" data-act="replay" @click="onToolbarClick($event, () => { announce('Replaying ticket'); void invoke('replay'); replayEntrance() })">Replay</button>
        <button type="button" data-act="scan" :disabled="status !== 'paid'" @click="onToolbarClick($event, () => void scanBarcode())">Scan</button>
        <button
          type="button"
          data-act="tear"
          :aria-pressed="tornLocal"
          :disabled="status !== 'paid'"
          @click="onToolbarClick($event, () => void toggleTear())"
        >
          {{ tornLocal ? 'Reattach stub' : 'Tear stub' }}
        </button>
      </div>

      <p class="ticket__notice">Synthetic demo. No payment provider, card or network is connected. The barcode is decorative.</p>
    </template>

    <div :id="liveId" class="ticket__live" aria-live="polite">{{ liveText }}</div>
  </section>
</template>