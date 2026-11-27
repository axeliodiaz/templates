<script setup lang="ts">
import MarginGuidePreview from './MarginGuidePreview.vue'
import MarginSquashForcePushDemo from './squash-force-push/MarginSquashForcePushDemo.vue'
import MarginSquashSubmoduleDemos from './squash-force-push/MarginSquashSubmoduleDemos.vue'
</script>

<template>
  <div class="margin-squash-doc">
    <p>
      Pixel-close recreation of
      <a href="https://x.com/pitus_/status/2126383874775118012" rel="noopener noreferrer">@pitus_ squash → force push</a>.
      The composed card <strong>autoplays</strong> the full sequence (2s load/expand → squash collapse → ~2s hold push → checks).
      Click <strong>Squash</strong> or <strong>hold push</strong> anytime to take over; <strong>Replay</strong> restarts autoplay.
    </p>
    <MarginGuidePreview label="Composed card (autoplay)">
      <MarginSquashForcePushDemo />
    </MarginGuidePreview>

    <h2>Compose from sub-modules</h2>
    <p>Each piece is a Vue component under <code>.vitepress/theme/squash-force-push/components/</code>.</p>
    <MarginGuidePreview label="Sub-module gallery">
      <MarginSquashSubmoduleDemos />
    </MarginGuidePreview>

    <h2>Props reference</h2>
    <table>
      <thead>
        <tr>
          <th>Component</th>
          <th>Key props</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>SqBranchHeader</code></td>
          <td><code>variant</code> branch|pr, <code>branch</code>, <code>target</code>, <code>prNumber</code>, <code>prTitle</code>, <code>loading</code>, <code>checksState</code> idle|running|passed, <code>rightLabel</code></td>
        </tr>
        <tr>
          <td><code>SqCommitRow</code></td>
          <td><code>kind</code> commit|fixup|wip|base, <code>message</code>, <code>hash</code>, <code>time</code>, <code>extra</code>, <code>branchPill</code>, <code>collapsing</code>, <code>purple</code></td>
        </tr>
        <tr>
          <td><code>SqBranchRail</code></td>
          <td><code>branch</code>, <code>pushed</code> (purple rail + origin pill)</td>
        </tr>
        <tr>
          <td><code>SqRunFooterStatus</code></td>
          <td><code>mode</code> hint|rebasing|warn|pushed, <code>fixupCount</code>, <code>target</code></td>
        </tr>
        <tr>
          <td><code>SqSquashButton</code></td>
          <td><code>visible</code>, <code>@squash</code></td>
        </tr>
        <tr>
          <td><code>SqHoldPushButton</code></td>
          <td><code>progress</code> 0–1, <code>pushing</code>, <code>@start</code>, <code>@cancel</code> (release early)</td>
        </tr>
        <tr>
          <td><code>SqPrFooterActions</code></td>
          <td>slot <code>status</code>, <code>@delete</code>, <code>@github</code></td>
        </tr>
        <tr>
          <td><code>MarginSquashForcePush</code></td>
          <td><code>motion</code>, <code>autoplay</code>, exposed <code>replay()</code></td>
        </tr>
      </tbody>
    </table>

    <pre><code class="language-vue">&lt;MarginSquashForcePush ref="card" :motion="true" :autoplay="true" /&gt;</code></pre>

    <h2>Motion &amp; timing</h2>
    <ul>
      <li>Load + expand: <strong>2s</strong> spring (<code>--mg-squash-enter</code>).</li>
      <li>Squash: row collapse stagger ~50ms; footer swaps to “Rebasing onto main”.</li>
      <li>Hold push: <strong>2s</strong> fill; release cancels.</li>
      <li>Checks: “Checks running” ~3s → “6 checks passed”.</li>
      <li><code>--mg-squash-motion: 0</code> or <code>:motion="false"</code> for instant QA.</li>
    </ul>
  </div>
</template>