<script setup>
import SqCopyBlock from './SqCopyBlock.vue'
</script>

<template>
  <section class="mg-squash-modules__section" data-tpl="margin">
    <h3 id="checks-expandable">Expandable CI checks</h3>
    <p>
      PR header status is a keyboard-accessible button (<code>aria-expanded</code>,
      <code>aria-controls</code>). The list lives in <code>SqChecksPanel</code> under the header;
      card height animates via <code>.mg-squash--checks-open</code> and panel
      <code>max-height</code> (disabled when <code>--mg-squash-motion: 0</code>).
    </p>
    <SqCopyBlock
      label="checks-data.mjs"
      code="import { checksForPhase, CI_CHECKS } from './checks-data.mjs'

// running: first 3 passed, rest spinner + '…' duration
checksForPhase('running')
checksForPhase('passed')"
    />
    <SqCopyBlock
      label="SqChecksTrigger.vue (header)"
      code="<SqChecksTrigger
  checks-state=&quot;running&quot;
  :expanded=&quot;checksOpen&quot;
  :panel-id=&quot;checksPanelId&quot;
  @toggle=&quot;checksOpen = !checksOpen&quot;
/>"
    />
    <SqCopyBlock
      label="SqChecksPanel.vue (under header)"
      code="<SqChecksPanel
  v-if=&quot;checksState !== 'idle'&quot;
  :checks-state=&quot;checksState&quot;
  :open=&quot;checksOpen&quot;
  :panel-id=&quot;checksPanelId&quot;
/>"
    />
    <SqCopyBlock
      label="Composed card"
      code="<MarginSquashForcePush :motion=&quot;true&quot; :autoplay=&quot;true&quot; />
<!-- Click “Checks running” / “6 checks passed” in the PR phase -->"
    />
    <SqCopyBlock
      label="Static open frame"
      code="<MarginSquashForcePush
  state=&quot;pr-passed-checks-open&quot;
  :checks-expanded=&quot;true&quot;
  :motion=&quot;false&quot;
  :autoplay=&quot;false&quot;
/>"
    />
  </section>
</template>