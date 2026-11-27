<script setup lang="ts">
import MarginGuidePreview from './MarginGuidePreview.vue'
import MarginSquashForcePushDemo from './squash-force-push/MarginSquashForcePushDemo.vue'
</script>

<template>
  <div class="margin-squash-doc">
    <p>
      Interactive git workflow card for agent runs: read branch history, squash fixups into real commits,
      then hold-to force-push when origin is stale. Reference motion:
      <a href="https://x.com/pitus_/status/2126383874775118012" rel="noopener noreferrer">@pitus_ demo</a>.
    </p>
    <MarginGuidePreview label="Squash → force push">
      <MarginSquashForcePushDemo />
    </MarginGuidePreview>

    <h2>Visual system</h2>
    <ul>
      <li>White card (18px radius, soft shadow) on <code>#eef0f4</code> lab background.</li>
      <li>Sans for UI copy; monospace 12px for hashes; 14px commit messages; 12px meta.</li>
      <li>
        Accents: blue (primary commits / squash), red (fixups / destructive push), purple (pushed / PR),
        green (checks), yellow dot (stale origin warning).
      </li>
    </ul>

    <h2>Flow</h2>
    <ol>
      <li><strong>Loading</strong> — branch pill <code>feat/session-refresh</code> → <code>main</code>; spinner “Reading 10 commits”; card expands with spring ease.</li>
      <li><strong>Expanded</strong> — rail + <code>origin/…</code> pill; 10 commit rows with node types (blue dot, red ×, hollow wip/base).</li>
      <li><strong>Squash</strong> — footer spinner “Rebasing onto main”; fixup/wip rows collapse into the blue commit below; header shows “3 commits”.</li>
      <li><strong>Force push</strong> — yellow warning + hold button; 2s fill sweep; early release cancels.</li>
      <li><strong>Done</strong> — purple rail/PR <code>#491</code>; checks run ~3s then “6 checks passed”; Pushed / Delete / View on GitHub.</li>
    </ol>

    <h2>Integration</h2>
    <pre><code class="language-vue">&lt;script setup&gt;
import MarginSquashForcePush from '@margin/squash-force-push/MarginSquashForcePush.vue'
const ref = useTemplateRef('squash')
&lt;/script&gt;

&lt;template&gt;
  &lt;MarginSquashForcePush ref="squash" :motion="true" /&gt;
  &lt;button type="button" @click="squash?.replay()"&gt;Replay&lt;/button&gt;
&lt;/template&gt;</code></pre>
    <p>
      Host on <code>data-tpl="margin"</code> and import
      <code>margin-squash-force-push.css</code>. Demo controls call <code>replay()</code> on the exposed ref.
    </p>

    <h2>Motion</h2>
    <p>
      Token <code>--mg-squash-motion</code> scales enter, squash collapse, and push fill (1 = on, 0 = off).
      Set <code>:motion="false"</code> on the component or add class <code>mg-squash--motion-off</code> for static QA.
      <code>prefers-reduced-motion</code> forces instant transitions in CSS.
    </p>
    <table>
      <thead>
        <tr>
          <th>Token</th>
          <th>Default</th>
          <th>Use</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>--mg-squash-enter</code></td>
          <td>0.55s</td>
          <td>Card expand after “Reading commits”</td>
        </tr>
        <tr>
          <td><code>--mg-squash-spring</code></td>
          <td>cubic-bezier(0.34, 1.25, 0.64, 1)</td>
          <td>Height / expand easing</td>
        </tr>
        <tr>
          <td><code>--mg-squash-motion</code></td>
          <td>1</td>
          <td>Multiply durations; 0 disables</td>
        </tr>
      </tbody>
    </table>

    <h2>Accessibility</h2>
    <ul>
      <li>Hold button: pointer + keyboard (Space/Enter hold); releasing early cancels push.</li>
      <li>Status regions for loading, rebase, checks, and push progress.</li>
      <li>Commit list uses <code>role="list"</code>; decorative nodes are <code>aria-hidden</code>.</li>
    </ul>
  </div>
</template>