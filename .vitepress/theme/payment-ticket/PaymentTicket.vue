<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch } from 'vue'
import { autoExploreScript, samplePaid } from './ticket.sample'
import {
  countUpAmount,
  playEntrance,
  reducedNow,
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

const errors = computed(() => validate(ticket.value))
const status = computed(() => ticket.value?.status ?? 'paid')
const showEmpty = computed(() => ticket.value === null)
const showDemoBar = computed(() => status.value === 'paid' && !showEmpty.value && errors.value.length === 0)
const reduced = ref(false)
let disposed = false
let generation = 0
let scanTimer: ReturnType<typeof setTimeout> | undefined
let scanFinishTimer: ReturnType<typeof setTimeout> | undefined
let retryTimer: ReturnType<typeof setTimeout> | undefined
let reducedHandler: (() => void) | undefined
const scanning = ref(false)
const scanned = ref(false)

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
    const revision = generation
    try {
      const result = await props.act(action, ticket.value)
      if (!disposed && revision === generation) emit('action', action, result)
      return result
    } catch (e) {
      const result = { state: 'error' as const, message: String(e) }
      if (!disposed && revision === generation) emit('action', action, result)
      return result
    }
  }
  const ack = { state: 'ack' as const, message: 'Demo ack' }
  emit('action', action, ack)
  return ack
}

function replayEntrance(reset = true) {
  stopAll(motionSet)
  for (const timer of [scanTimer, scanFinishTimer]) clearTimeout(timer)
  scanned.value = scanning.value = false
  cardPinned.value = false
  cardHover.value = false
  if (reset) { tornLocal.value = false; emit('update:torn', false) }
  nextTick(() => {
    if (disposed || !paperRef.value || !ticket.value || reduced.value || status.value !== 'paid') return
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

function copyFailure() {
  copyChip.value = 'failed'
  announce('Copy unavailable. The number is selected; press Control or Command plus C')
  const number = paperRef.value?.querySelector('.ticket__ref-text')
  if (number) {
    const range = document.createRange()
    range.selectNodeContents(number)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
  }
  emit('action', 'copy', { state: 'error', message: 'Copy unavailable' })
}
async function copyRef(userGesture: boolean) {
  if (!ticket.value || status.value !== 'paid') return
  if (userGesture) stopExplore()
  const revision = generation
  if (userGesture) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Copy unavailable')
      await navigator.clipboard.writeText(ticket.value.reference)
      if (disposed || revision !== generation) return
      copyChip.value = 'copied'
      announce('Ticket number copied')
      void invoke('copy')
    } catch {
      if (disposed || revision !== generation) return
      copyFailure()
    }
  } else {
    copyChip.value = 'copied'
    announce('Ticket number copied')
  }
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => { copyChip.value = null; copyTimer = undefined }, copyChip.value === 'failed' ? 3200 : 1600)
}

function onCardEnter() {
  if (finePointer.value) cardHover.value = true
}
function onCardLeave() {
  if (!cardPinned.value) cardHover.value = false
}
function onCardClick() {
  stopExplore()
  cardPinned.value = !cardPinned.value
  cardHover.value = cardPinned.value
  announce(cardPinned.value ? 'Card details pinned' : 'Hide card details')
  void invoke('reveal')
}

function scanBarcode(scripted = false) {
  if (!barcodeRef.value || status.value !== 'paid') return
  if (!scripted) stopExplore()
  if (scanTimer) clearTimeout(scanTimer)
  if (scanFinishTimer) clearTimeout(scanFinishTimer)
  scanning.value = !reduced.value
  scanned.value = reduced.value
  const finish = () => {
    scanning.value = false
    scanned.value = true
    announce('Demo scan complete. Barcode is decorative')
    if (!scripted) void invoke('scan')
    scanFinishTimer = setTimeout(() => { scanned.value = false; scanFinishTimer = undefined }, 1200)
  }
  if (reduced.value) finish()
  else scanTimer = setTimeout(() => { scanTimer = undefined; finish() }, 1100)
}
function toggleTear(scripted = false) {
  if (!stubRef.value || status.value !== 'paid') return
  if (!scripted) stopExplore()
  tornLocal.value = !tornLocal.value
  emit('update:torn', tornLocal.value)
  announce(tornLocal.value ? 'Stub torn off' : 'Stub reattached')
  if (!scripted) void invoke(tornLocal.value ? 'tear' : 'attach')
}
async function retryPayment() {
  if (!ticket.value) return
  stopExplore()
  const previous = ticket.value
  const revision = generation
  ticket.value = { ...previous, status: 'pending' }
  if (props.act) {
    const result = await invoke('retry')
    if (disposed || revision !== generation) return
    // The consumer supplies the next ticket through data. Never invent paid.
    if (result.state === 'error') {
      ticket.value = previous
      announce(result.message)
    }
    return
  }
  retryTimer = setTimeout(() => {
    retryTimer = undefined
    if (disposed || revision !== generation) return
    ticket.value = { ...previous, status: 'paid' }
    replayEntrance()
  }, 1400)
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
      else if (step.action === 'scan') scanBarcode(true)
      else if (step.action === 'tear') toggleTear(true)
      else if (step.action === 'attach') toggleTear(true)
      else if (step.action === 'collapse') { cardPinned.value = false; cardHover.value = false }
      else if (step.action === 'end') { clearTour(); announce('Auto-explore finished') }
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
  if (d?.id !== prevId) resetWork()
  ticket.value = d === undefined ? samplePaid() : d
  if (d && d.id !== prevId) replayEntrance(false)
}, { deep: true })

watch(() => props.torn, v => { tornLocal.value = v })

watch(status, (s, prev) => { if (s === 'paid' && prev === 'pending') announce('Payment confirmed') })

watch(() => props.demoState, (s) => {
  resetWork()
  if (s === 'pending') ticket.value = { ...samplePaid(), status: 'pending' }
  else if (s === 'failed') ticket.value = { ...samplePaid(), status: 'failed' }
  else if (s === 'empty') ticket.value = null
  else if (s === 'invalid') ticket.value = { ...samplePaid(), reference: '' }
  else if (s === 'paid') ticket.value = samplePaid()
})

function resetWork() {
  generation++
  stopAll(motionSet)
  clearTour()
  for (const timer of [copyTimer, liveTimer, scanTimer, scanFinishTimer, retryTimer]) clearTimeout(timer)
  copyTimer = liveTimer = scanTimer = scanFinishTimer = retryTimer = undefined
  copyChip.value = null
  scanned.value = scanning.value = false
  cardPinned.value = cardHover.value = false
  liveBuffer = []
  tilt.value = { x: 0, y: 0 }
}
onMounted(() => {
  finePointer.value = matchMedia('(pointer: fine)').matches
  reducedMedia = matchMedia('(prefers-reduced-motion: reduce)')
  reduced.value = reducedMedia.matches
  reducedHandler = () => {
    reduced.value = reducedMedia!.matches
    if (reduced.value) {
      resetWork()
      if (paperRef.value) {
        paperRef.value.getAnimations({ subtree: true }).forEach(a => { a.finish(); a.cancel() })
        const amount = paperRef.value.querySelector('[data-ticket-amount]')
        if (amount) amount.textContent = amountDisplay.value
      }
    }
  }
  reducedMedia.addEventListener('change', reducedHandler)
  visibilityHandler = () => { if (document.hidden) stopExplore() }
  document.addEventListener('visibilitychange', visibilityHandler)
  replayEntrance(false)
})
onBeforeUnmount(() => {
  disposed = true
  resetWork()
  if (reducedHandler) reducedMedia?.removeEventListener('change', reducedHandler)
  if (visibilityHandler) document.removeEventListener('visibilitychange', visibilityHandler)
})

const sectionLabel = computed(() => props.title ?? 'Payment ticket demo')
const paperStyle = computed(() => finePointer.value && !reduced.value && props.theme !== 'bastion'
  ? { transform: `perspective(900px) rotateX(${tilt.value.y}deg) rotateY(${tilt.value.x}deg)` }
  : undefined)
const largeAmount = computed(() => (ticket.value?.amount.minor ?? 0) >= 100000000 || amountDisplay.value.length > 14)
const amountDisplay = computed(() => {
  if (!ticket.value) return 'n/a'
  return formatMoney(ticket.value.amount.minor, ticket.value.amount.currency)
})
const dateLabel = computed(() => status.value === 'failed' ? 'Attempted on' : 'Paid on')
const amountLabel = computed(() => status.value === 'failed' ? 'Not charged' : status.value === 'paid' ? 'Paid' : 'Amount')
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

            <dl class="ticket__facts" :class="{ 'is-large': largeAmount }">
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
                    <span class="ticket__ref-text">{{ ticket.reference }}</span>
                    <svg class="ticket__copy-ico" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="4" y="4" width="8" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M3 10V3h7" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
                  </button>
                  <span v-if="copyChip === 'copied'" class="ticket__chip ticket__chip--ok" role="status">Copied ✓</span>
                  <span v-if="copyChip === 'failed'" class="ticket__chip ticket__chip--fail" role="status">Copy failed</span>
                </dd>
                <dt>{{ amountLabel }}</dt>
                <dd class="ticket__amt-col" :data-large="amountDisplay.length > 14 || undefined" data-ticket-amount :data-target="ticket.amount.minor ?? 0">{{ amountDisplay }}</dd>
                <dt>{{ dateLabel }}</dt>
                <dd>{{ formatPaidAt(ticket.paidAt, ticket.timeZone) }}</dd>
              </template>
            </dl>

            <button
              v-if="ticket.method && status !== 'pending'"
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


          </div>

          <div
            v-if="status !== 'failed'"
            ref="stubRef"
            class="ticket__stub"
            :class="{ 'is-off': tornLocal, 'is-reduced': reduced }"
          >
            <div class="ticket__perf ticket__perf--stub" aria-hidden="true" />
            <div v-if="status === 'paid'" class="ticket__barcode-wrap">
              <div ref="barcodeRef" class="ticket__barcode" :class="{ 'is-scanned': scanned, 'is-scanning': scanning }" role="img" :aria-label="`Decorative demo barcode for ticket ${ticket.reference}. Not scannable.`">
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
            <span v-if="status === 'pending'" class="ticket__skel ticket__skel--stub" />
          </div>
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