<script setup>
import SqChecksTrigger from './SqChecksTrigger.vue'

defineProps({
  variant: { type: String, default: 'branch' }, // branch | pr
  branch: { type: String, default: 'feat/session-refresh' },
  target: { type: String, default: 'main' },
  prNumber: { type: [Number, String], default: 491 },
  prTitle: { type: String, default: 'Refresh sessions near expiry' },
  rightLabel: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  checksState: { type: String, default: 'idle' }, // idle | running | passed
  checksExpanded: { type: Boolean, default: false },
  checksPanelId: { type: String, default: 'mg-sq-checks-panel' },
})
const emit = defineEmits(['toggle-checks'])
</script>
<template>
  <header class="mg-sq-header">
    <div class="mg-sq-header__left">
      <template v-if="variant === 'pr'">
        <span class="mg-sq-header__pr">#{{ prNumber }}</span>
        <span class="mg-sq-header__pr-title">{{ prTitle }}</span>
      </template>
      <template v-else>
        <span class="mg-sq-header__branch">{{ branch }}</span>
        <span class="mg-sq-header__arrow" aria-hidden="true">→</span>
        <span class="mg-sq-header__target">{{ target }}</span>
      </template>
    </div>
    <div class="mg-sq-header__right">
      <span v-if="loading" class="mg-sq-header__status" role="status">
        <span class="mg-sq-spin" aria-hidden="true" />
        Reading 10 commits
      </span>
      <SqChecksTrigger
        v-else-if="variant === 'pr' && checksState !== 'idle'"
        :checks-state="checksState"
        :expanded="checksExpanded"
        :panel-id="checksPanelId"
        @toggle="emit('toggle-checks')"
      />
      <span v-else-if="rightLabel" class="mg-sq-header__meta">{{ rightLabel }}</span>
    </div>
  </header>
</template>