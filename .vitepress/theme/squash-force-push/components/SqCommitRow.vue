<script setup>
import SqCommitNode from './SqCommitNode.vue'

defineProps({
  kind: { type: String, default: 'commit' },
  message: { type: String, required: true },
  hash: { type: String, default: '' },
  time: { type: String, default: '' },
  extra: { type: Number, default: 0 },
  branchPill: { type: String, default: '' },
  collapsing: { type: Boolean, default: false },
  purple: { type: Boolean, default: false },
})
</script>
<template>
  <li
    class="mg-sq-row"
    :class="[`mg-sq-row--${kind}`, { 'is-collapsing': collapsing }]"
    role="listitem"
  >
    <SqCommitNode :kind="kind" :purple="purple" />
    <span class="mg-sq-row__msg">
      {{ message }}
      <span v-if="extra" class="mg-sq-row__extra">+{{ extra }}</span>
      <span v-if="branchPill" class="mg-sq-row__base-pill">{{ branchPill }}</span>
    </span>
    <span class="mg-sq-row__hash">{{ hash }}</span>
    <span class="mg-sq-row__time">{{ time }}</span>
  </li>
</template>