<script setup lang="ts">
import { computed } from 'vue'
import MarginExampleTabs from './MarginExampleTabs.vue'
import MarginGuidePreview from './MarginGuidePreview.vue'
import MarginArcMeterDemo from './MarginArcMeterDemo.vue'
import MarginGraphMotionProse from './MarginGraphMotionProse.vue'
import { marginChartDefinition, CHART_SCHEMA_FIELDS } from './margin-chart-definition.mjs'

const definition = computed(() => marginChartDefinition('arc'))
</script>
<template>
  <div class="margin-graph-doc">
    <p>
      Multi-series arc meter modeled on
      <a href="/felix/gauges">Felix Gauges · Independent usage limits</a>: concentric arcs with value labels at
      each endpoint and a legend row per series (dot, name, value, secondary note). One row still renders a single
      ring (<strong>backwards compatible</strong>).
    </p>
    <MarginExampleTabs
      :definition="definition"
      json-path="felix-chart-examples.json (arc)"
      :schema-fields="CHART_SCHEMA_FIELDS"
      code-snippet='<MarginArcMeterDemo />'
      tabs-aria-label="Arc meter chart"
    >
      <MarginGuidePreview label="Arc meter">
        <MarginArcMeterDemo />
      </MarginGuidePreview>
    </MarginExampleTabs>
    <h2>Data contract</h2>
    <p>
      Pass a <code>series</code> array in <code>options.series</code> <em>or</em> a tabular source with one row per
      ring. Each series entry / row supports label, value, max, color, note, and status fields (see Structure tab).
    </p>
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