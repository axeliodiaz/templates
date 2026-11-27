<script setup lang="ts">
import MarginGuidePreview from './MarginGuidePreview.vue'
import MarginArcMeterDemo from './MarginArcMeterDemo.vue'
import MarginGraphMotionProse from './MarginGraphMotionProse.vue'
</script>
<template>
  <div class="margin-graph-doc">
    <p>
      Multi-series arc meter modeled on
      <a href="/felix/gauges">Felix Gauges · Independent usage limits</a>: concentric arcs with value labels at
      each endpoint and a legend row per series (dot, name, value, secondary note). One row still renders a single
      ring (<strong>backwards compatible</strong>).
    </p>
    <MarginGuidePreview label="Arc meter">
      <MarginArcMeterDemo />
    </MarginGuidePreview>
    <h2>Data contract</h2>
    <p>
      Pass a <code>series</code> array in <code>options.series</code> <em>or</em> a tabular source with one row per
      ring. Each series entry / row supports:
    </p>
    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Required</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>label</code></td>
          <td>yes</td>
          <td>Legend name (encoding <code>category</code> column)</td>
        </tr>
        <tr>
          <td><code>value</code></td>
          <td>yes</td>
          <td>Numeric or <code>null</code> when unavailable</td>
        </tr>
        <tr>
          <td><code>max</code></td>
          <td>no</td>
          <td>Default <code>options.maximum</code> (100)</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td>no</td>
          <td>Stroke color; palette fallback</td>
        </tr>
        <tr>
          <td><code>note</code></td>
          <td>no</td>
          <td>Secondary legend line (e.g. “71% remaining”)</td>
        </tr>
        <tr>
          <td><code>status</code></td>
          <td>no</td>
          <td><code>ready</code> or <code>unavailable</code> (muted track, <code>--</code> label)</td>
        </tr>
      </tbody>
    </table>
    <pre><code class="language-json">{
  "component": "felix-arc",
  "data": { "source": "limits" },
  "encoding": { "category": "label", "value": "value" },
  "options": {
    "maximum": 100,
    "fields": { "max": "max", "color": "color", "note": "note", "status": "status" }
  }
}</code></pre>
    <h2>Motion</h2>
    <p>
      <strong>This chart:</strong> each ring sweeps on enter with
      <code>calc(var(--mg-arc-stagger) * 0.12s)</code> delay; shuffle morphs numeric cells; unavailable rings skip
      sweep fill.
    </p>
    <MarginGraphMotionProse />
    <h2>Accessibility</h2>
    <ul>
      <li>Each arc is focusable; legend summarizes values for screen readers.</li>
      <li><code>prefers-reduced-motion</code> renders arcs instantly.</li>
    </ul>
  </div>
</template>