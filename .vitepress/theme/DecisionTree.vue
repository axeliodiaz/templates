<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import './decision-tree.css'
import {
  initDecisionTree,
  type Decision,
  type DecisionAdvanceDetail,
  type DecisionStepDetail,
  type DecisionTreeHandle,
} from './decision-tree'

const props = withDefaults(defineProps<{
  decisions: Decision[]
  phase?: 'queue' | 'approved' | 'empty'
  initialPath?: string[]
  lockPreview?: string
  autoAdvance?: boolean
  showLog?: boolean
}>(), {
  phase: 'queue',
  autoAdvance: true,
  showLog: false,
})

const host = ref<HTMLElement | null>(null)
const log = ref('No choice yet.')
let handle: DecisionTreeHandle | null = null

function stepText(step: DecisionStepDetail) {
  const trail = step.path.map(item => item.title).join(' → ')
  const extra = step.text ? `: ${step.text}` : ''
  return step.leaf ? `Committed “${trail}”${extra}` : `Chose “${step.title}”`
}

onMounted(() => {
  if (!host.value) return
  handle = initDecisionTree(host.value, {
    decisions: props.decisions,
    phase: props.phase,
    initialPath: props.initialPath,
    lockPreview: props.lockPreview,
    autoAdvance: props.autoAdvance,
    onStep: (step) => { log.value = stepText(step) },
    onCommit: (step) => { log.value = stepText(step) },
    onAdvance: (event: DecisionAdvanceDetail) => {
      log.value = event.decision ? `Next: ${event.decision.agent.name}` : 'Queue finished'
    },
    onComplete: () => { log.value = 'All decided' },
    onBack: () => { log.value = 'Went back one step' },
  })
})

onBeforeUnmount(() => handle?.destroy())
</script>

<template>
  <div class="dt-mount">
    <div ref="host"></div>
    <p v-if="showLog" class="dt-log" data-dt-log><span>Last event</span>{{ log }}</p>
  </div>
</template>
