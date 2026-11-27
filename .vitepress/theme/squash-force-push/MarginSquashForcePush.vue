<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  BRANCH,
  TARGET,
  fixupCount,
  initialCommits,
  prNumber,
  prTitle,
  squashedCommits,
} from './commit-data.mjs'

const props = defineProps({
  motion: { type: Boolean, default: true },
})

const phase = ref('loading') // loading | expanded | squashing | squashed | pushing | done
const visibleRows = ref(structuredClone(initialCommits))
const collapsing = ref(new Set())
const pushProgress = ref(0)
const checksState = ref('idle') // idle | running | passed
const replayKey = ref(0)

let timers = []
function clearTimers() {
  timers.forEach(clearTimeout)
  timers = []
}
function later(fn, ms) {
  const id = setTimeout(fn, ms)
  timers.push(id)
  return id
}

const reducedMotion = ref(false)
let pushRaf = 0
let pushStart = 0

const commitCount = computed(() =>
  visibleRows.value.filter((r) => r.kind !== 'base').length,
)
const showRows = computed(() => phase.value !== 'loading')
const headerRight = computed(() => {
  if (phase.value === 'loading') return ''
  if (phase.value === 'done') return checksLabel.value
  return `${commitCount.value} commits`
})
const checksLabel = computed(() => {
  if (checksState.value === 'running') return 'Checks running'
  if (checksState.value === 'passed') return '6 checks passed'
  return ''
})
const isPurple = computed(() => phase.value === 'done')
const footerSquashVisible = computed(
  () => phase.value === 'expanded' && !collapsing.value.size,
)
const footerRebasing = computed(() => phase.value === 'squashing')
const footerPush = computed(() => phase.value === 'squashed')
const footerDone = computed(() => phase.value === 'done')

function startLoading() {
  phase.value = 'loading'
  visibleRows.value = structuredClone(initialCommits)
  collapsing.value = new Set()
  pushProgress.value = 0
  checksState.value = 'idle'
  const expandMs = props.motion && !reducedMotion.value ? 900 : 0
  later(() => {
    phase.value = 'expanded'
  }, expandMs || 400)
}

function runSquash() {
  if (phase.value !== 'expanded') return
  phase.value = 'squashing'
  const toRemove = initialCommits.filter((r) => r.kind === 'fixup' || r.kind === 'wip')
  const stagger = props.motion && !reducedMotion.value ? 55 : 0
  toRemove.forEach((row, i) => {
    later(() => {
      collapsing.value = new Set([...collapsing.value, row.id])
      later(() => {
        visibleRows.value = visibleRows.value.filter((r) => r.id !== row.id)
        const next = new Set(collapsing.value)
        next.delete(row.id)
        collapsing.value = next
      }, stagger ? 280 : 0)
    }, i * (stagger || 1))
  })
  const total = (toRemove.length + 1) * (stagger || 1) + (stagger ? 400 : 100)
  later(() => {
    visibleRows.value = structuredClone(squashedCommits)
    phase.value = 'squashed'
  }, total)
}

function cancelPush() {
  if (pushRaf) cancelAnimationFrame(pushRaf)
  pushRaf = 0
  pushProgress.value = 0
  if (phase.value === 'pushing') phase.value = 'squashed'
}

function finishPush() {
  pushProgress.value = 1
  phase.value = 'done'
  checksState.value = 'running'
  later(
    () => {
      checksState.value = 'passed'
    },
    props.motion && !reducedMotion.value ? 3000 : 0,
  )
}

function animatePush() {
  pushStart = performance.now()
  const duration = props.motion && !reducedMotion.value ? 2000 : 400
  const tick = (now) => {
    const t = Math.min(1, (now - pushStart) / duration)
    pushProgress.value = t
    if (t < 1) {
      pushRaf = requestAnimationFrame(tick)
    } else {
      pushRaf = 0
      finishPush()
    }
  }
  pushRaf = requestAnimationFrame(tick)
}

function startPush() {
  if (phase.value !== 'squashed') return
  phase.value = 'pushing'
  pushProgress.value = 0
  animatePush()
}

function onPointerDown(e) {
  if (phase.value !== 'squashed') return
  e.preventDefault()
  startPush()
}
function onPointerUp() {
  if (phase.value === 'pushing' && pushProgress.value < 1) cancelPush()
}
function onKeyDown(e) {
  if (phase.value !== 'squashed') return
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    startPush()
  }
}
function onKeyUp(e) {
  if (e.key === ' ' || e.key === 'Enter') onPointerUp()
}

function replay() {
  clearTimers()
  cancelPush()
  replayKey.value++
  startLoading()
}

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  startLoading()
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('keyup', onKeyUp)
})
onUnmounted(() => {
  clearTimers()
  cancelPush()
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('keyup', onKeyUp)
})

watch(
  () => props.motion,
  () => {},
)

defineExpose({ replay })
</script>

<template>
  <div
    :key="replayKey"
    class="mg-squash"
    :class="{
      'mg-squash--loading': phase === 'loading',
      'mg-squash--expanded': showRows,
      'mg-squash--purple': isPurple,
      'mg-squash--motion-off': !motion || reducedMotion,
    }"
    data-tpl="margin"
  >
    <header class="mg-squash__head">
      <div class="mg-squash__head-left">
        <template v-if="phase === 'done'">
          <span class="mg-squash__pr">#{{ prNumber }}</span>
          <span class="mg-squash__pr-title">{{ prTitle }}</span>
        </template>
        <template v-else>
          <span class="mg-squash__branch-pill">{{ BRANCH }}</span>
          <span class="mg-squash__arrow" aria-hidden="true">→</span>
          <span class="mg-squash__target">{{ TARGET }}</span>
        </template>
      </div>
      <div class="mg-squash__head-right">
        <span
          v-if="phase === 'loading'"
          class="mg-squash__spinner-label"
          role="status"
        >
          <span class="mg-squash__spinner" aria-hidden="true" />
          Reading 10 commits
        </span>
        <span
          v-else-if="phase === 'done'"
          class="mg-squash__checks"
          :class="{
            'is-running': checksState === 'running',
            'is-passed': checksState === 'passed',
          }"
          role="status"
        >
          <span
            v-if="checksState === 'running'"
            class="mg-squash__spinner"
            aria-hidden="true"
          />
          <span v-else-if="checksState === 'passed'" class="mg-squash__check-icon" aria-hidden="true">✓</span>
          {{ headerRight }}
        </span>
        <span v-else class="mg-squash__meta">{{ headerRight }}</span>
      </div>
    </header>

    <div class="mg-squash__body">
      <div class="mg-squash__rail" :class="{ 'is-purple': isPurple }">
        <span class="mg-squash__origin-pill">origin/{{ BRANCH }}</span>
      </div>
      <ul
        v-if="showRows"
        class="mg-squash__list"
        role="list"
        aria-label="Commit history"
      >
        <li
          v-for="row in visibleRows"
          :key="row.id"
          class="mg-squash__row"
          :class="[
            `mg-squash__row--${row.kind}`,
            { 'is-collapsing': collapsing.has(row.id) },
          ]"
          role="listitem"
        >
          <span class="mg-squash__node" aria-hidden="true">
            <span v-if="row.kind === 'commit'" class="mg-squash__dot mg-squash__dot--blue" />
            <span v-else-if="row.kind === 'fixup'" class="mg-squash__dot mg-squash__dot--fixup">×</span>
            <span v-else class="mg-squash__dot mg-squash__dot--hollow" />
          </span>
          <span class="mg-squash__message">
            {{ row.message }}
            <span v-if="row.extra" class="mg-squash__pill">+{{ row.extra }}</span>
            <span v-if="row.branchPill" class="mg-squash__main-pill">{{ row.branchPill }}</span>
          </span>
          <span class="mg-squash__hash">{{ row.hash }}</span>
          <span class="mg-squash__time">{{ row.time }}</span>
        </li>
      </ul>
    </div>

    <footer class="mg-squash__foot">
      <template v-if="footerSquashVisible">
        <p class="mg-squash__hint">
          {{ fixupCount }} of 10 commits are fixups or debug logs
        </p>
        <button type="button" class="mg-squash__btn mg-squash__btn--squash" @click="runSquash">
          ✨ Squash
        </button>
      </template>
      <p v-else-if="footerRebasing" class="mg-squash__hint" role="status">
        <span class="mg-squash__spinner" aria-hidden="true" />
        Rebasing onto {{ TARGET }}
      </p>
      <template v-else-if="footerPush">
        <p class="mg-squash__warn">
          <span class="mg-squash__warn-dot" aria-hidden="true" />
          origin still has the old history
        </p>
        <button
          type="button"
          class="mg-squash__btn mg-squash__btn--push"
          :class="{ 'is-active': phase === 'pushing' }"
          :style="{ '--mg-push-fill': pushProgress }"
          aria-describedby="mg-squash-push-hint"
          @pointerdown="onPointerDown"
          @keydown="onKeyDown"
        >
          <span class="mg-squash__push-icon" aria-hidden="true">↑</span>
          {{
            phase === 'pushing'
              ? `Pushing ${Math.min(3, Math.ceil(pushProgress * 3))} of 3`
              : 'Hold to force push'
          }}
        </button>
        <span id="mg-squash-push-hint" class="visually-hidden">
          Press and hold for two seconds, or hold Space while focused. Releasing early cancels.
        </span>
      </template>
      <div v-else-if="footerDone" class="mg-squash__done-actions">
        <span class="mg-squash__pushed">
          <span class="mg-squash__check-muted" aria-hidden="true">✓</span>
          Pushed
        </span>
        <button type="button" class="mg-squash__text-btn">Delete branch</button>
        <button type="button" class="mg-squash__github-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.53-.49-.45-.29-.76-.92-.76-1.65 0-.91.41-1.65 1.03-1.65.73 0 1.04.56 1.04 1.13 0 .69-.26 1.38-.4 2.12-.11.48.24.87.71.87.85 0 1.51-.89 1.51-2.19 0-1.14-.82-1.94-1.99-1.94-1.36 0-2.16 1.02-2.16 2.08 0 .41.16.86.36 1.09.04.05.04.1.03.15-.04.17-.11.54-.12.61-.02.1-.08.12-.18.07-.66-.31-1.08-1.29-1.08-2.08 0-1.69.84-3.25 2.42-3.25 1.43 0 2.26 1.12 2.26 2.61 0 1.58-.72 2.9-1.81 2.9-.35 0-.69-.18-.8-.4 0 0-.18.69-.22.86-.08.31-.28.58-.47.71.39.12.81.18 1.24.18 4.42 0 8-3.58 8-8s-3.58-8-8-8z"
            />
          </svg>
          View on GitHub
        </button>
      </div>
    </footer>
  </div>
</template>