<script setup>
import { inject, ref } from 'vue'
import SqCopyBlock from './SqCopyBlock.vue'
import SqBranchHeader from './components/SqBranchHeader.vue'
import SqBranchRailDemo from './components/SqBranchRailDemo.vue'
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
    <section class="mg-squash-modules__section" id="sq-branch-header">
      <h3>Branch header</h3>
      <div class="mg-sq-module" :class="{ 'lab-dark': dark }">
        <SqBranchHeader branch="feat/session-refresh" right-label="10 commits" />
      </div>
      <div class="mg-sq-module mg-squash-modules__stack" :class="{ 'lab-dark': dark }">
        <SqBranchHeader
          variant="pr"
          pr-title="Refresh sessions near expiry"
          checks-state="passed"
        />
      </div>
      <SqCopyBlock
        label="SqBranchHeader"
        code="<SqBranchHeader branch=&quot;feat/session-refresh&quot; right-label=&quot;10 commits&quot; />
<SqBranchHeader variant=&quot;pr&quot; :pr-number=&quot;491&quot; checks-state=&quot;passed&quot; />"
      />
    </section>

    <section class="mg-squash-modules__section" id="sq-commit-row">
      <h3>Commit row</h3>
      <ul class="mg-sq-module mg-sq-list" :class="{ 'lab-dark': dark }" role="list">
        <SqCommitRow kind="commit" message="Add session refresh tests" hash="d29f50a" time="3m" :extra="1" />
        <SqCommitRow kind="fixup" message="fix typo" hash="b38f7c4" time="16m" />
        <SqCommitRow kind="wip" message="wip" hash="0b47d2f" time="36m" />
        <SqCommitRow kind="base" message="Bump next to 16.3" hash="9c2d4a1" time="3h" branch-pill="main" />
      </ul>
      <SqCopyBlock
        label="SqCommitRow"
        code="<SqCommitRow kind=&quot;commit&quot; message=&quot;…&quot; hash=&quot;d29f50a&quot; :extra=&quot;1&quot; />
<SqCommitRow kind=&quot;fixup&quot; message=&quot;fix typo&quot; hash=&quot;b38f7c4&quot; />"
      />
    </section>

    <section class="mg-squash-modules__section" id="sq-branch-rail">
      <h3>Branch rail</h3>
      <div class="mg-sq-module" :class="{ 'lab-dark': dark }">
        <SqBranchRailDemo />
      </div>
      <div class="mg-sq-module mg-squash-modules__stack" :class="{ 'lab-dark': dark }">
        <SqBranchRailDemo pushed />
      </div>
      <SqCopyBlock
        label="SqBranchRail"
        code="<SqBranchRail branch=&quot;feat/session-refresh&quot; :pushed=&quot;false&quot; />"
      />
    </section>

    <section class="mg-squash-modules__section" id="sq-footer-status">
      <h3>Run footer status</h3>
      <div class="mg-sq-module mg-sq-module--pad" :class="{ 'lab-dark': dark }">
        <SqRunFooterStatus mode="hint" />
        <SqRunFooterStatus mode="rebasing" class="mg-squash-modules__gap" />
        <SqRunFooterStatus mode="warn" class="mg-squash-modules__gap" />
        <SqRunFooterStatus mode="pushed" class="mg-squash-modules__gap" />
      </div>
      <SqCopyBlock label="SqRunFooterStatus" code='<SqRunFooterStatus mode="warn" />' />
    </section>

    <section class="mg-squash-modules__section" id="sq-squash-btn">
      <h3>Squash button</h3>
      <div class="mg-sq-module mg-sq-module--pad mg-sq-module--squash-demo" :class="{ 'lab-dark': dark }">
        <SqSquashButton @squash="() => {}" />
      </div>
      <SqCopyBlock label="SqSquashButton" code='<SqSquashButton @squash="onSquash" />' />
    </section>

    <section class="mg-squash-modules__section" id="sq-hold-btn">
      <h3>Hold to confirm</h3>
      <div class="mg-sq-module mg-sq-module--pad mg-sq-module--squash-demo" :class="{ 'lab-dark': dark }">
        <SqHoldPushButton
          :active="holdActive"
          :pushing="holdActive"
          :progress="holdProgress"
          @start="demoHoldStart"
          @cancel="demoHoldEnd"
        />
      </div>
      <SqCopyBlock
        label="SqHoldPushButton"
        code='<SqHoldPushButton :progress="fill" :pushing="holding" @start="hold" @cancel="cancel" />'
      />
    </section>

    <section class="mg-squash-modules__section" id="sq-pr-actions">
      <h3>PR footer actions</h3>
      <div class="mg-sq-module mg-sq-module--pad" :class="{ 'lab-dark': dark }">
        <SqPrFooterActions>
          <template #status>
            <SqRunFooterStatus mode="pushed" />
          </template>
        </SqPrFooterActions>
      </div>
      <SqCopyBlock label="SqPrFooterActions" code='<SqPrFooterActions @github="openPr" />' />
    </section>
  </div>
</template>