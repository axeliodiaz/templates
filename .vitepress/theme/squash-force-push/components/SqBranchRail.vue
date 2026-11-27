<script setup>
defineProps({
  branch: { type: String, default: 'feat/session-refresh' },
  pushed: { type: Boolean, default: false },
})
</script>
<template>
  <div class="mg-sq-rail" :class="{ 'is-purple': pushed }" aria-hidden="true">
    <span class="mg-sq-rail__origin">origin/{{ branch }}</span>
  </div>
</template>