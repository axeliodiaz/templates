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
        <li class="mg-prl__row--split">
          <span class="mg-prl__rk">Author</span>
          <span class="mg-prl__rv"><b>@luis</b></span>
        </li>
        <li class="mg-prl__row--full">4 commits · +186 −42 · 6 files</li>
        <li class="mg-prl__row--full">
          {{
            phaseState('draft') === 'done'
              ? 'Marked ready for review'
              : 'Mark as ready for review to start checks'
          }}
        </li>
      </template>
      <template v-else-if="phaseId === 'checks'">
        <li v-for="(c, k) in CHECKS" :key="c.name" class="mg-prl__row--split">
          <span class="mg-prl__rk">{{ c.name }}</span>
          <span class="mg-prl__rv">{{
            k < m.checksPassed
              ? c.duration
              : phaseState('checks') === 'failed' && k === m.failIdx
                ? `${c.duration} · failed`
                : '—'
          }}</span>
        </li>
      </template>
      <template v-else-if="phaseId === 'review'">
        <li class="mg-prl__row--split">
          <span class="mg-prl__rk">@ana</span>
          <span class="mg-prl__rv">code owner · Requested</span>
        </li>
        <li class="mg-prl__row--split">
          <span class="mg-prl__rk">@sam</span>
          <span class="mg-prl__rv">{{ phaseState('review') === 'blocked' ? 'Changes requested' : 'Requested' }}</span>
        </li>
      </template>
      <template
        v-else-if="
          phaseId === 'resolve' &&
          phaseState('resolve') !== 'pending' &&
          phaseState('resolve') !== 'skipped'
        "
      >
        <li v-for="(t, k) in THREADS" :key="t.loc" class="mg-prl__row--full">
          <b>{{ t.loc }}</b> — {{ t.preview }} · {{ k >= m.openThreads ? 'Resolved' : 'Open' }}
        </li>
      </template>
      <template v-else-if="phaseId === 'approvals'">
        <li class="mg-prl__row--split">
          <span class="mg-prl__rk">@sam</span>
          <span class="mg-prl__rv">{{ m.approvalsHave > 0 ? 'Approved' : 'Waiting' }}</span>
        </li>
        <li class="mg-prl__row--split">
          <span class="mg-prl__rk">@ana</span>
          <span class="mg-prl__rv">code owner · {{ m.approvalsHave > 1 ? 'Approved' : 'Waiting' }}</span>
        </li>
      </template>
      <template v-else-if="phaseId === 'ready'">
        <li class="mg-prl__row--split">
          <span class="mg-prl__rk">Required checks</span>
          <span class="mg-prl__rv">6 of 6</span>
        </li>
        <li class="mg-prl__row--split">
          <span class="mg-prl__rk">Approvals</span>
          <span class="mg-prl__rv">2 of 2</span>
        </li>
        <li class="mg-prl__row--full">No conflicts with main</li>
        <li class="mg-prl__row--split">
          <span class="mg-prl__rk">Merge method</span>
          <span class="mg-prl__rv">Squash and merge</span>
        </li>
      </template>
      <template v-else-if="phaseId === 'merged'">
        <li class="mg-prl__row--split">
          <span class="mg-prl__rk">Destination</span>
          <span class="mg-prl__rv">{{
            phaseState('merged') === 'done' ? 'Merged into main' : 'Not merged yet'
          }}</span>
        </li>
        <li class="mg-prl__row--split">
          <span class="mg-prl__rk">Commit</span>
          <span class="mg-prl__rv">{{ PR_META.mergeCommit }}</span>
        </li>
        <li class="mg-prl__row--split">
          <span class="mg-prl__rk">Branch</span>
          <span class="mg-prl__rv"
            >{{ PR_META.head }} · {{ phaseState('merged') === 'done' ? 'Deleted' : '—' }}</span
          >
        </li>
      </template>
    </ul>
  </div>
</template>