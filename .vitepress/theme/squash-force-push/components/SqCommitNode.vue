<script setup>
defineProps({
  kind: { type: String, default: 'commit' }, // commit | fixup | wip | base
  purple: { type: Boolean, default: false },
})
</script>
<template>
  <span class="mg-sq-node" :class="[`mg-sq-node--${kind}`, { 'is-purple': purple }]" aria-hidden="true">
    <span v-if="kind === 'fixup'" class="mg-sq-node__x">×</span>
  </span>
</template>