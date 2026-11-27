<script setup>
import { computed, onMounted, onUnmounted, ref, toRef, watch } from 'vue'
import { BRANCH, prNumber, prTitle } from './commit-data.mjs'
import SqBranchHeader from './components/SqBranchHeader.vue'
import SqBranchRail from './components/SqBranchRail.vue'
import SqCommitRow from './components/SqCommitRow.vue'
import SqHoldPushButton from './components/SqHoldPushButton.vue'
import SqPrFooterActions from './components/SqPrFooterActions.vue'
import SqRunFooterStatus from './components/SqRunFooterStatus.vue'
import SqSquashButton from './components/SqSquashButton.vue'
import { useSquashFlow } from './useSquashFlow.mjs'

const props = defineProps({
  motion: { type: Boolean, default: true },
  autoplay: { type: Boolean, default: true },
})

const reducedMotion = ref(false)
const motion = toRef(props, 'motion')
const autoplay = toRef(props, 'autoplay')
const replayKey = ref(0)

const flow = useSquashFlow({
  motion,
  autoplay,
  reducedMotion,
})

const headerVariant = computed(() => (flow.phase.value === 'done' ? 'pr' : 'branch'))
const headerLoading = computed(() => flow.phase.value === 'loading')
const headerRight = computed(() =>
  flow.phase.value === 'done'
    ? ''
    : flow.showRows.value
      ? `${flow.commitCount.value} commits`
      : '',
)
const headerChecks = computed(() =>
  flow.phase.value === 'done' ? flow.checksState.value : 'idle',
)
const bodyCompact = computed(() =>
  ['squashed', 'pushing', 'done'].includes(flow.phase.value),
)

function onSquash() {
  flow.runSquash(false)
}
function onPushStart() {
  flow.startPush(false)
}
function onPushCancel() {
  flow.cancelPush()
}
function onWindowUp() {
  if (flow.phase.value === 'pushing' && flow.pushProgress.value < 1) flow.cancelPush()
}

function replay() {
  replayKey.value++
  flow.replay()
}

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  flow.startLoading()
  window.addEventListener('pointerup', onWindowUp)
  window.addEventListener('keyup', onWindowUp)
})
onUnmounted(() => {
  flow.teardown()
  window.removeEventListener('pointerup', onWindowUp)
  window.removeEventListener('keyup', onWindowUp)
})

watch(
  () => props.autoplay,
  () => {},
)

defineExpose({ replay })
</script>

<template>
  <div
    :key="replayKey"
    class="mg-squash"
    :class="{
      'mg-squash--loading': flow.phase.value === 'loading',
      'mg-squash--expanded': flow.showRows.value,
      'mg-squash--purple': flow.isPurple.value,
      'mg-squash--motion-off': !motion || reducedMotion,
      'mg-squash--compact': bodyCompact,
    }"
    :style="{ '--mg-sq-rows': flow.visibleRows.value.length }"
    data-tpl="margin"
  >
    <SqBranchHeader
      :variant="headerVariant"
      :branch="BRANCH"
      :loading="headerLoading"
      :right-label="headerRight"
      :pr-number="prNumber"
      :pr-title="prTitle"
      :checks-state="headerChecks"
    />

    <div class="mg-squash__body">
      <SqBranchRail :branch="BRANCH" :pushed="flow.isPurple.value" />
      <ul v-if="flow.showRows.value" class="mg-sq-list" role="list" aria-label="Commit history">
        <SqCommitRow
          v-for="row in flow.visibleRows.value"
          :key="row.id"
          :kind="row.kind"
          :message="row.message"
          :hash="row.hash"
          :time="row.time"
          :extra="row.extra"
          :branch-pill="row.branchPill"
          :collapsing="flow.collapsing.value.has(row.id)"
          :purple="flow.isPurple.value"
        />
      </ul>
    </div>

    <footer class="mg-squash__foot">
      <template v-if="flow.footerMode.value === 'squash'">
        <SqRunFooterStatus mode="hint" :fixup-count="flow.fixupCount" />
        <SqSquashButton :visible="true" @squash="onSquash" />
      </template>
      <SqRunFooterStatus
        v-else-if="flow.footerMode.value === 'rebasing'"
        mode="rebasing"
        :target="flow.TARGET"
      />
      <template v-else-if="flow.footerMode.value === 'push'">
        <SqRunFooterStatus mode="warn" />
        <SqHoldPushButton
          :active="flow.phase.value === 'pushing'"
          :pushing="flow.phase.value === 'pushing'"
          :progress="flow.pushProgress.value"
          @start="onPushStart"
          @cancel="onPushCancel"
        />
      </template>
      <SqPrFooterActions v-else-if="flow.footerMode.value === 'done'">
        <template #status>
          <SqRunFooterStatus mode="pushed" />
        </template>
      </SqPrFooterActions>
    </footer>
  </div>
</template>