<script setup>
import { inject, ref } from 'vue'
import SqBranchHeader from './components/SqBranchHeader.vue'
import SqBranchRail from './components/SqBranchRail.vue'
import SqCommitRow from './components/SqCommitRow.vue'
import SqHoldPushButton from './components/SqHoldPushButton.vue'
import SqPrFooterActions from './components/SqPrFooterActions.vue'
import SqRunFooterStatus from './components/SqRunFooterStatus.vue'
import SqSquashButton from './components/SqSquashButton.vue'

const dark = inject('marginGuidePreviewDark', ref(false))
const holdProgress = ref(0)
const holdActive = ref(false)
let holdTimer

function demoHoldStart() {
  holdActive.value = true
  holdProgress.value = 0
  const start = performance.now()
  const tick = (now) => {
    holdProgress.value = Math.min(1, (now - start) / 2000)
    if (holdProgress.value < 1) holdTimer = requestAnimationFrame(tick)
  }
  holdTimer = requestAnimationFrame(tick)
}
function demoHoldEnd() {
  if (holdTimer) cancelAnimationFrame(holdTimer)
  if (holdProgress.value < 1) holdProgress.value = 0
  holdActive.value = false
}
</script>

<template>
  <div class="mg-squash-modules" data-tpl="margin">
    <section id="sq-branch-header">
      <h3>Branch header</h3>
      <div class="mg-sq-module" :class="{ 'lab-dark': dark }">
        <SqBranchHeader branch="feat/session-refresh" right-label="10 commits" />
      </div>
      <div class="mg-sq-module" :class="{ 'lab-dark': dark }" style="margin-top: 12px">
        <SqBranchHeader
          variant="pr"
          pr-title="Refresh sessions near expiry"
          checks-state="passed"
        />
      </div>
      <pre><code class="language-vue">&lt;SqBranchHeader branch="feat/session-refresh" right-label="10 commits" /&gt;
&lt;SqBranchHeader variant="pr" :pr-number="491" checks-state="passed" /&gt;</code></pre>
    </section>

    <section id="sq-commit-row">
      <h3>Commit row</h3>
      <ul class="mg-sq-module mg-sq-list" :class="{ 'lab-dark': dark }" role="list">
        <SqCommitRow kind="commit" message="Add session refresh tests" hash="d29f50a" time="3m" :extra="1" />
        <SqCommitRow kind="fixup" message="fix typo" hash="b38f7c4" time="16m" />
        <SqCommitRow kind="wip" message="wip" hash="0b47d2f" time="36m" />
        <SqCommitRow kind="base" message="Bump next to 16.3" hash="9c2d4a1" time="3h" branch-pill="main" />
      </ul>
      <pre><code class="language-vue">&lt;SqCommitRow kind="commit" message="…" hash="d29f50a" :extra="1" /&gt;
&lt;SqCommitRow kind="fixup" message="fix typo" hash="b38f7c4" /&gt;</code></pre>
    </section>

    <section id="sq-branch-rail">
      <h3>Branch rail</h3>
      <div class="mg-sq-module mg-sq-module--chromeless" :class="{ 'lab-dark': dark }" style="position: relative; min-height: 88px; padding: 36px 12px 12px">
        <SqBranchRail branch="feat/session-refresh" />
      </div>
      <div
        class="mg-sq-module mg-sq-module--chromeless"
        :class="{ 'lab-dark': dark }"
        style="position: relative; min-height: 88px; padding: 36px 12px 12px; margin-top: 12px"
      >
        <SqBranchRail branch="feat/session-refresh" pushed />
      </div>
      <pre><code class="language-vue">&lt;SqBranchRail branch="feat/session-refresh" :pushed="false" /&gt;</code></pre>
    </section>

    <section id="sq-footer-status">
      <h3>Run footer status</h3>
      <div class="mg-sq-module" :class="{ 'lab-dark': dark }" style="padding: 14px 16px">
        <SqRunFooterStatus mode="hint" />
        <SqRunFooterStatus mode="rebasing" style="margin-top: 10px" />
        <SqRunFooterStatus mode="warn" style="margin-top: 10px" />
        <SqRunFooterStatus mode="pushed" style="margin-top: 10px" />
      </div>
    </section>

    <section id="sq-squash-btn">
      <h3>Squash button</h3>
      <div class="mg-sq-module" :class="{ 'lab-dark': dark }" style="padding: 14px 16px; display: flex; justify-content: flex-end">
        <SqSquashButton @squash="() => {}" />
      </div>
    </section>

    <section id="sq-hold-btn">
      <h3>Hold to confirm</h3>
      <div class="mg-sq-module" :class="{ 'lab-dark': dark }" style="padding: 14px 16px; display: flex; justify-content: flex-end">
        <SqHoldPushButton
          :active="holdActive"
          :pushing="holdActive"
          :progress="holdProgress"
          @start="demoHoldStart"
          @cancel="demoHoldEnd"
        />
      </div>
    </section>

    <section id="sq-pr-actions">
      <h3>PR footer actions</h3>
      <div class="mg-sq-module" :class="{ 'lab-dark': dark }" style="padding: 14px 16px">
        <SqPrFooterActions>
          <template #status>
            <SqRunFooterStatus mode="pushed" />
          </template>
        </SqPrFooterActions>
      </div>
    </section>
  </div>
</template>