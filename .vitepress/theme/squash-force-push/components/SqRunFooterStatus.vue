<script setup>
defineProps({
  mode: { type: String, default: 'hint' }, // hint | rebasing | warn | pushed
  fixupCount: { type: Number, default: 7 },
  total: { type: Number, default: 10 },
  target: { type: String, default: 'main' },
  warnText: { type: String, default: 'origin still has the old history' },
})
</script>
<template>
  <p v-if="mode === 'hint'" class="mg-sq-foot-note">
    {{ fixupCount }} of {{ total }} commits are fixups or debug logs
  </p>
  <p v-else-if="mode === 'rebasing'" class="mg-sq-foot-note" role="status">
    <span class="mg-sq-spin" aria-hidden="true" />
    Rebasing onto {{ target }}
  </p>
  <p v-else-if="mode === 'warn'" class="mg-sq-foot-warn">
    <span class="mg-sq-foot-warn__dot" aria-hidden="true" />
    {{ warnText }}
  </p>
  <p v-else-if="mode === 'pushed'" class="mg-sq-foot-pushed">
    <span class="mg-sq-foot-pushed__icon" aria-hidden="true">✓</span>
    Pushed
  </p>
</template>