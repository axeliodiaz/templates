<script setup>
import SqBranchRail from './SqBranchRail.vue'
import SqCommitRow from './SqCommitRow.vue'

defineProps({
  pushed: { type: Boolean, default: false },
  branch: { type: String, default: 'feat/session-refresh' },
})
</script>
<template>
  <div class="mg-sq-rail-demo" :class="{ 'is-purple': pushed }">
    <SqBranchRail :branch="branch" :pushed="pushed" />
    <ul class="mg-sq-list mg-sq-rail-demo__list" role="list">
      <SqCommitRow
        kind="fixup"
        message="fix typo"
        hash="b38f7c4"
        time="16m"
        :purple="pushed"
      />
      <SqCommitRow
        kind="commit"
        message="Refresh sessions near expiry"
        hash="c70a92b"
        time="25m"
        :extra="3"
        :purple="pushed"
      />
      <SqCommitRow
        kind="base"
        message="Bump next to 16.3"
        hash="9c2d4a1"
        time="3h"
        branch-pill="main"
        :purple="pushed"
      />
    </ul>
  </div>
</template>