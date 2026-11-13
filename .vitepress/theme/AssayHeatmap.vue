<script setup lang="ts">
import type { AssayRun, AssayLabels } from "./assay.types";
const p = defineProps<{ run: AssayRun; labels: AssayLabels }>();
function value(tool: string, suite: string) {
  return p.run.heatmap.find((c) => c.tool === tool && c.suite === suite)
    ?.passPct;
}
function fill(n: number | undefined) {
  const a = Math.max(0, Math.min(1, ((n ?? 0) - 60) / 40));
  return `rgb(${Math.round(248 + 7 * a)} ${Math.round(211 - 123 * a)} ${Math.round(184 - 175 * a)})`;
}
</script>
<template>
  <section class="as-card as-heatmap">
    <h2>
      {{ labels.mcpToolAccuracy }}
      <span :title="labels.heatmapHint" aria-label="Accuracy information"
        >ⓘ</span
      >
    </h2>
    <div class="as-scale">{{ labels.low }}<span />{{ labels.high }}</div>
    <div
      class="as-table-scroll"
      tabindex="0"
      aria-label="MCP tool accuracy table, scroll horizontally if needed"
    >
      <table>
        <thead>
          <tr>
            <th scope="col"><span class="as-sr">Tool</span></th>
            <th v-for="s in run.suites" :key="s" scope="col">{{ s }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tool in run.tools" :key="tool">
            <th scope="row" class="as-mono">{{ tool }}</th>
            <td
              v-for="s in run.suites"
              :key="s"
              :style="{ background: fill(value(tool, s)) }"
              :aria-label="`${tool}, ${s}: ${value(tool, s) ?? 'No data'} percent pass`"
            >
              {{ value(tool, s) ?? "—"
              }}<span v-if="value(tool, s) !== undefined">%</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="as-hint">{{ labels.heatmapHint }}</p>
  </section>
</template>
