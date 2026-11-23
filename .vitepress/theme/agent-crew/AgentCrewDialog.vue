<script setup lang="ts">
import { computed } from 'vue'
import type { CrewAgent } from './crew.model'
import { formatCost, formatDuration, formatTokens } from './crew.model'
import CrewIcon from './CrewIcon.vue'
import type { IconName } from './icons'

const props = defineProps<{ agent: CrewAgent; now: number; style?: Record<string, string> }>()
const emit = defineEmits<{ close: [] }>()

const tokensLine = computed(() => {
  const input = formatTokens(props.agent.tokens?.input ?? null)
  const output = formatTokens(props.agent.tokens?.output ?? null)
  return `${input} / ${output}`
})
</script>
<template>
  <aside class="crew-dialog" :style="style" role="dialog" aria-modal="false" :aria-label="`${agent.name} details`">
    <div class="crew-dialog__top">
      <h3>{{ agent.name }}</h3>
      <button type="button" class="crew-dialog__close" aria-label="Close details" @click="emit('close')">
        <CrewIcon name="x" :size="14" />
      </button>
    </div>
    <p class="crew-dialog__task">{{ agent.task ?? agent.activity }}</p>
    <div class="crew-dialog__chips">
      <span class="crew-chip">
        <CrewIcon name="cpu-duotone" :size="14" active />
        {{ agent.model ?? 'n/a' }}
      </span>
    </div>
    <dl class="crew-dialog__grid">
      <div>
        <dt>Running</dt>
        <dd>{{ formatDuration(agent, now) }}</dd>
      </div>
      <div>
        <dt>Cost</dt>
        <dd>{{ formatCost(agent.cost ?? null) ?? 'n/a' }}</dd>
      </div>
      <div>
        <dt>Tokens</dt>
        <dd>{{ tokensLine }}</dd>
      </div>
    </dl>
    <dl v-if="agent.tools.length" class="crew-dialog__rows">
      <dt>Tools</dt>
      <dd>{{ agent.tools.map(t => t.name).join(', ') }}</dd>
    </dl>
    <dl v-if="agent.last" class="crew-dialog__rows">
      <dt>Last handoff</dt>
      <dd>↳ <b>{{ agent.last.from }}</b> {{ agent.last.text }}</dd>
    </dl>
  </aside>
</template>