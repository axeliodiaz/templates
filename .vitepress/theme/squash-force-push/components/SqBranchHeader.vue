<script setup>
defineProps({
  variant: { type: String, default: 'branch' }, // branch | pr
  branch: { type: String, default: 'feat/session-refresh' },
  target: { type: String, default: 'main' },
  prNumber: { type: [Number, String], default: 491 },
  prTitle: { type: String, default: 'Refresh sessions near expiry' },
  rightLabel: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  checksState: { type: String, default: 'idle' }, // idle | running | passed
})
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
      <span
        v-else-if="variant === 'pr' && checksState !== 'idle'"
        class="mg-sq-header__checks"
        :class="{ 'is-passed': checksState === 'passed' }"
        role="status"
      >
        <span v-if="checksState === 'running'" class="mg-sq-spin" aria-hidden="true" />
        <span v-else class="mg-sq-header__ok" aria-hidden="true">✓</span>
        {{ checksState === 'running' ? 'Checks running' : '6 checks passed' }}
      </span>
      <span v-else-if="rightLabel" class="mg-sq-header__meta">{{ rightLabel }}</span>
    </div>
  </header>
</template>