<script setup lang="ts">
import { computed } from 'vue'
import type { CrewAgent } from './crew.model'
import { contextLevel, formatContext } from './crew.model'
import CrewIcon from './CrewIcon.vue'
import type { IconName } from './icons'

const props = defineProps<{ agent: CrewAgent; level: number; selected?: boolean; dialogOpen?: boolean; now?: number }>()
const emit = defineEmits<{ select: [el?: HTMLElement] }>()

const statusIcon = computed<IconName>(() => ({
  working: 'circle-notch',
  idle: 'circle-duotone',
  paused: 'clock-duotone',
  needs_you: 'clock-duotone',
  done: 'check-circle-duotone',
  failed: 'x-circle-duotone',
}[props.agent.status] ?? 'circle-duotone') as IconName)

const statusLabel = computed(() => ({
  working: 'Working',
  idle: 'Idle',
  paused: 'Paused',
  needs_you: 'Needs you',
  done: 'Done',
  failed: 'Failed',
}[props.agent.status] ?? 'Idle'))

const levelInfo = computed(() => contextLevel(props.agent.context))
const contextText = computed(() => formatContext(props.agent.context))
const visibleTools = computed(() => props.agent.tools.slice(0, 3))
const overflowTools = computed(() => Math.max(0, props.agent.tools.length - 3))
const iconActive = computed(() => !!(props.selected || props.dialogOpen))
</script>
<template>
  <article
    class="crew-card"
    :class="{
      'is-selected': selected,
      'is-dialog': dialogOpen,
    }"
    :data-crew-card="agent.id"
    :data-level="level"
    :style="{ '--crew-hue': `var(--crew-hue-${agent.hue})` }"
    :tabindex="0"
    role="treeitem"
    :aria-selected="selected"
    @click="emit('select', $event.currentTarget as HTMLElement)"
    @keydown.enter.prevent="emit('select', $event.currentTarget as HTMLElement)"
    @keydown.space.prevent="emit('select', $event.currentTarget as HTMLElement)"
  >
    <div class="crew-floor" aria-hidden="true" />
    <div class="crew-card__body">
      <div class="crew-card__row">
        <span class="crew-card__mark">
          <CrewIcon v-if="agent.icon" :name="agent.icon as IconName" :size="18" :active="iconActive" />
        </span>
        <span class="crew-card__who">
          <b>{{ agent.name }}</b>
          <span>{{ agent.model ?? 'n/a' }}</span>
        </span>
        <span class="crew-pill" :class="`crew-pill--${agent.status}`">
          <CrewIcon :name="statusIcon" :size="12" :active="iconActive" :class="{ 'crew-icon--spin': agent.status === 'working' }" />
          {{ statusLabel }}
        </span>
      </div>
      <p
        class="crew-card__activity"
        :class="{ 'is-warn': agent.status === 'needs_you', 'is-bad': agent.status === 'failed' }"
      >
        {{ agent.activity }}
      </p>
      <div
        class="crew-card__metric"
        :class="{ 'is-late': levelInfo.level === 'late', 'is-over': levelInfo.level === 'over' }"
      >
        <span class="crew-bar" :class="{
          'crew-bar--work': levelInfo.level === 'work',
          'crew-bar--late': levelInfo.level === 'late',
          'crew-bar--over': levelInfo.level === 'over',
        }">
          <i :style="levelInfo.ratio !== null ? { width: `${Math.round(levelInfo.ratio * 100)}%` } : undefined" />
        </span>
        <span>{{ contextText }}</span>
      </div>
    </div>
    <div v-if="agent.tools.length || agent.last" class="crew-card__tray">
      <span v-for="tool in visibleTools" :key="tool.id" class="crew-card__tile" :title="tool.name">
        <CrewIcon :name="tool.icon as IconName" :size="12" :active="iconActive" />
      </span>
      <span v-if="overflowTools" class="crew-card__tile" :title="`${overflowTools} more tools`">+{{ overflowTools }}</span>
      <CrewIcon v-if="agent.last" name="arrow-elbow-down-right" :size="12" :active="iconActive" />
      <span v-if="agent.last" class="crew-card__handoff"><b>{{ agent.last.from }}</b> {{ agent.last.text }}</span>
    </div>
  </article>
</template>