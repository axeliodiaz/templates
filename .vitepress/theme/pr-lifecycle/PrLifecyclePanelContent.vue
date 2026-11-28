<script setup>
import { CHECKS, PR_META, THREADS } from './lifecycle-data.mjs'

const props = defineProps({
  phaseId: { type: String, required: true },
  phaseLabel: { type: String, required: true },
  m: { type: Object, required: true },
  phaseState: { type: Function, required: true },
  deepLink: { type: Boolean, default: false },
  copyDone: { type: Boolean, default: false },
})

const emit = defineEmits(['copy-link'])
</script>

<template>
  <div class="mg-prl__panel-body">
    <div class="mg-prl__panel-head">
      <h4>{{ phaseLabel }}</h4>
      <button
        v-if="deepLink"
        type="button"
        class="mg-prl__copylink"
        @click.stop="emit('copy-link')"
      >
        {{ copyDone ? 'Copied' : 'Copy link' }}
      </button>
    </div>

    <div
      v-if="phaseId === 'approvals' && phaseState('approvals') === 'blocked'"
      class="mg-prl__callout mg-prl__callout--blocked"
    >
      Needs 1 more approval from a code owner: @ana
    </div>
    <div
      v-if="phaseId === 'checks' && phaseState('checks') === 'failed'"
      class="mg-prl__callout mg-prl__callout--failed"
    >
      E2E tests failed. Fix and push to re-run all checks.
    </div>
    <div
      v-if="phaseId === 'review' && phaseState('review') === 'blocked'"
      class="mg-prl__callout mg-prl__callout--blocked"
    >
      @sam requested changes · 3 open threads
    </div>

    <p v-if="phaseId === 'checks'" class="mg-prl__stat">{{ m.checksPassed }} of 6 passed</p>
    <p v-if="phaseId === 'resolve'" class="mg-prl__stat">
      {{
        phaseState('resolve') === 'skipped'
          ? 'No comments to resolve'
          : `${m.openThreads} open · ${3 - m.openThreads} resolved`
      }}
    </p>

    <ul class="mg-prl__rows" :class="{ 'mg-prl__rows-scroll': phaseId === 'checks' }">
      <template v-if="phaseId === 'draft'">
        <li>Author <b>@luis</b></li>
        <li>4 commits · +186 −42 · 6 files</li>
        <li>
          {{
            phaseState('draft') === 'done'
              ? 'Marked ready for review'
              : 'Mark as ready for review to start checks'
          }}
        </li>
      </template>
      <template v-else-if="phaseId === 'checks'">
        <li v-for="(c, k) in CHECKS" :key="c.name">
          {{ c.name }} ·
          {{
            k < m.checksPassed
              ? c.duration
              : phaseState('checks') === 'failed' && k === m.failIdx
                ? `${c.duration} · failed`
                : '—'
          }}
        </li>
      </template>
      <template v-else-if="phaseId === 'review'">
        <li>@ana · code owner · Requested</li>
        <li>@sam · {{ phaseState('review') === 'blocked' ? 'Changes requested' : 'Requested' }}</li>
      </template>
      <template
        v-else-if="
          phaseId === 'resolve' &&
          phaseState('resolve') !== 'pending' &&
          phaseState('resolve') !== 'skipped'
        "
      >
        <li v-for="(t, k) in THREADS" :key="t.loc">
          <b>{{ t.loc }}</b> — {{ t.preview }} · {{ k >= m.openThreads ? 'Resolved' : 'Open' }}
        </li>
      </template>
      <template v-else-if="phaseId === 'approvals'">
        <li>@sam · {{ m.approvalsHave > 0 ? 'Approved' : 'Waiting' }}</li>
        <li>@ana · code owner · {{ m.approvalsHave > 1 ? 'Approved' : 'Waiting' }}</li>
      </template>
      <template v-else-if="phaseId === 'ready'">
        <li>Required checks · 6 of 6</li>
        <li>Approvals · 2 of 2</li>
        <li>No conflicts with main</li>
        <li>Merge method · Squash and merge</li>
      </template>
      <template v-else-if="phaseId === 'merged'">
        <li>{{ phaseState('merged') === 'done' ? 'Merged into main' : 'Not merged yet' }}</li>
        <li>Commit · {{ PR_META.mergeCommit }}</li>
        <li>
          Branch {{ PR_META.head }} · {{ phaseState('merged') === 'done' ? 'Deleted' : '—' }}
        </li>
      </template>
    </ul>
  </div>
</template>