<script setup>
import { computed, onMounted, onUnmounted, ref, toRef, watch } from 'vue'
import { BRANCH, prNumber, prTitle } from './commit-data.mjs'
import SqBranchHeader from './components/SqBranchHeader.vue'
import SqChecksPanel from './components/SqChecksPanel.vue'
import SqBranchRail from './components/SqBranchRail.vue'
import SqCommitRow from './components/SqCommitRow.vue'
import SqHoldPushButton from './components/SqHoldPushButton.vue'
import SqPrFooterActions from './components/SqPrFooterActions.vue'
import SqRunFooterStatus from './components/SqRunFooterStatus.vue'
import SqSquashButton from './components/SqSquashButton.vue'
import { squashStatePreset } from './squash-state-presets.mjs'
import { useSquashFlow } from './useSquashFlow.mjs'

const props = defineProps({
  motion: { type: Boolean, default: true },
  autoplay: { type: Boolean, default: true },
  /** Static reference frame from @pitus_ video */
  state: { type: String, default: '' },
  pushProgress: { type: Number, default: 0 },
  /** When set, freezes expanded checks list for static frames */
  checksExpanded: { type: Boolean, default: null },
})

const isStatic = computed(() => Boolean(props.state))

const reducedMotion = ref(false)
const motion = toRef(props, 'motion')
const autoplay = toRef(props, 'autoplay')
const replayKey = ref(0)
const checksOpen = ref(false)
const checksPanelId = `mg-sq-checks-${Math.random().toString(36).slice(2, 9)}`

const flow = useSquashFlow({
  motion,
  autoplay,
  reducedMotion,
})

const preset = computed(() =>
  isStatic.value
    ? squashStatePreset(props.state, { pushProgress: props.pushProgress })
    : null,
)

const view = computed(() => {
  if (preset.value) {
    const p = preset.value
    return {
      headerVariant: p.headerVariant,
      headerLoading: p.headerLoading,
      headerRight: p.headerRight,
      checksState: p.checksState,
      showRows: p.showRows,
      rows: p.rows,
      collapsing: new Set(p.collapsing),
      footer: p.footer,
      purple: p.purple,
      compact: p.compact,
      pushing: p.pushing,
      pushProgress: p.pushProgress,
      fixupCount: p.fixupCount,
      TARGET: p.TARGET,
      loading: props.state === 'loading',
      expanded: p.showRows,
      checks: p.checks ?? null,
      checksOpen: checksOpen.value,
    }
  }
  return {
    headerVariant: flow.phase.value === 'done' ? 'pr' : 'branch',
    headerLoading: flow.phase.value === 'loading',
    headerRight:
      flow.phase.value === 'done'
        ? ''
        : flow.showRows.value
          ? `${flow.commitCount.value} commits`
          : '',
    checksState: flow.phase.value === 'done' ? flow.checksState.value : 'idle',
    showRows: flow.showRows.value,
    rows: flow.visibleRows.value,
    collapsing: flow.collapsing.value,
    footer: flow.footerMode.value,
    purple: flow.isPurple.value,
    compact: ['squashed', 'pushing', 'done'].includes(flow.phase.value),
    pushing: flow.phase.value === 'pushing',
    pushProgress: flow.pushProgress.value,
    fixupCount: flow.fixupCount,
    TARGET: flow.TARGET,
    loading: flow.phase.value === 'loading',
    expanded: flow.showRows.value,
    checks: null,
    checksOpen: checksOpen.value,
  }
})

function toggleChecks() {
  checksOpen.value = !checksOpen.value
}

function onSquash() {
  if (!isStatic.value) flow.runSquash(false)
}
function onPushStart() {
  if (!isStatic.value) flow.startPush(false)
}
function onPushCancel() {
  if (!isStatic.value) flow.cancelPush()
}
function onWindowUp() {
  if (isStatic.value) return
  if (flow.phase.value === 'pushing' && flow.pushProgress.value < 1) flow.cancelPush()
}

function replay() {
  if (isStatic.value) return
  replayKey.value++
  checksOpen.value = false
  flow.replay()
}

watch(
  () => flow.checksState.value,
  (next, prev) => {
    if (!isStatic.value && prev !== 'idle' && next === 'idle') checksOpen.value = false
  },
)

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!isStatic.value) {
    flow.startLoading()
    window.addEventListener('pointerup', onWindowUp)
    window.addEventListener('keyup', onWindowUp)
  }
})
onUnmounted(() => {
  if (!isStatic.value) {
    flow.teardown()
    window.removeEventListener('pointerup', onWindowUp)
    window.removeEventListener('keyup', onWindowUp)
  }
})

watch(
  () => [props.state, props.checksExpanded],
  () => {
    checksOpen.value = props.checksExpanded ?? false
  },
  { immediate: true },
)

defineExpose({ replay })
</script>

<template>
  <div
    :key="isStatic ? state : replayKey"
    class="mg-squash"
    :class="{
      'mg-squash--static': isStatic,
      'mg-squash--loading': view.loading,
      'mg-squash--expanded': view.expanded,
      'mg-squash--purple': view.purple,
      'mg-squash--motion-off': isStatic || !motion || reducedMotion,
      'mg-squash--compact': view.compact,
      'mg-squash--checks-open': view.checksOpen && view.checksState !== 'idle',
    }"
    :style="{ '--mg-sq-rows': view.rows.length }"
    data-tpl="margin"
  >
    <SqBranchHeader
      :variant="view.headerVariant"
      :branch="BRANCH"
      :loading="view.headerLoading"
      :right-label="view.headerRight"
      :pr-number="prNumber"
      :pr-title="prTitle"
      :checks-state="view.checksState"
      :checks-expanded="view.checksOpen"
      :checks-panel-id="checksPanelId"
      @toggle-checks="toggleChecks"
    />

    <SqChecksPanel
      v-if="view.checksState !== 'idle'"
      :checks-state="view.checksState"
      :checks="view.checks"
      :open="view.checksOpen"
      :panel-id="checksPanelId"
    />

    <div class="mg-squash__body">
      <SqBranchRail :branch="BRANCH" :pushed="view.purple" />
      <ul v-if="view.showRows" class="mg-sq-list" role="list" aria-label="Commit history">
        <SqCommitRow
          v-for="row in view.rows"
          :key="row.id"
          :kind="row.kind"
          :message="row.message"
          :hash="row.hash"
          :time="row.time"
          :extra="row.extra"
          :branch-pill="row.branchPill"
          :collapsing="view.collapsing.has(row.id)"
          :purple="view.purple"
        />
      </ul>
    </div>

    <footer class="mg-squash__foot">
      <template v-if="view.footer === 'squash'">
        <SqRunFooterStatus mode="hint" :fixup-count="view.fixupCount" />
        <SqSquashButton :visible="true" @squash="onSquash" />
      </template>
      <SqRunFooterStatus
        v-else-if="view.footer === 'rebasing'"
        mode="rebasing"
        :target="view.TARGET"
      />
      <template v-else-if="view.footer === 'push'">
        <SqRunFooterStatus mode="warn" />
        <SqHoldPushButton
          :active="view.pushing"
          :pushing="view.pushing"
          :progress="view.pushProgress"
          @start="onPushStart"
          @cancel="onPushCancel"
        />
      </template>
      <SqPrFooterActions v-else-if="view.footer === 'done'">
        <template #status>
          <SqRunFooterStatus mode="pushed" />
        </template>
      </SqPrFooterActions>
    </footer>
  </div>
</template>