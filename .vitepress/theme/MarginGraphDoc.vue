<script setup lang="ts">
import { computed } from 'vue'
import MarginGraphSection from './MarginGraphSection.vue'
import MarginGraphMotionProse from './MarginGraphMotionProse.vue'
import { MARGIN_GRAPH_ENTER_NOTES } from './margin-graphs-prose'

const props = defineProps<{
  slug: string
  label: string
  component: string
}>()

const enterNote = computed(
  () => MARGIN_GRAPH_ENTER_NOTES[props.slug] || MARGIN_GRAPH_ENTER_NOTES.default,
)
</script>
<template>
  <div class="margin-graph-doc">
    <p>
      Felix JSON chart <code>{{ component }}</code> with synthetic local data. Use the preview toolbar for
      <strong>Replay</strong>, <strong>Shuffle data</strong>, and loading/empty states. Toggle <strong>Dark
        preview</strong> for contrast checks.
    </p>
    <MarginGraphSection :example-key="slug" :label="label" />
    <h2>Data contract</h2>
    <p>
      Each chart is driven by a JSON spec plus a named source block (headers + rows). See Felix
      <a href="/felix/components/chart-json">chart JSON contract</a> for encoding fields. Production apps should
      validate specs server-side and never trust client-only JSON.
    </p>
    <h2>Motion</h2>
    <p><strong>This chart:</strong> {{ enterNote }}</p>
    <MarginGraphMotionProse />
    <h2>Accessibility</h2>
    <ul>
      <li>Chart SVG uses <code>role="img"</code> with a title; exact values are available via keyboard focus on marks.</li>
      <li>Status readout uses <code>role="status"</code> for selection and hover summaries.</li>
      <li>Respect <code>prefers-reduced-motion</code>: animations are disabled automatically.</li>
      <li>Do not autoplay enter motion before hydration — previews wait for <code>requestAnimationFrame</code>.</li>
    </ul>
  </div>
</template>