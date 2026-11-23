<script setup lang="ts">
import type { AssayRun, AssayLabels } from "./assay.types";
defineProps<{ run: AssayRun; labels: AssayLabels }>();
defineEmits<{ "select-commit": [sha: string] }>();
const x = (i: number, n: number) => 50 + (i / (n - 1 || 1)) * 480;
const y = (n: number) => 170 - Math.max(0, Math.min(100, n)) * 1.35;
</script>
<template>
  <section class="as-card as-chart">
    <h2>{{ labels.passRateByCommit }}</h2>
    <ul class="as-legend">
      <li v-for="m in run.models" :key="m.id">
        <i :class="'as-series-' + m.color" />{{ m.label }}
      </li>
    </ul>
    <svg
      viewBox="0 0 620 195"
      role="img"
      :aria-label="
        run.models
          .map((m) => m.label + ': ' + m.points.at(-1) + '% current')
          .join('; ')
      "
    >
      <g v-for="v in [0, 25, 50, 75, 100]" :key="v">
        <line x1="48" x2="535" :y1="y(v)" :y2="y(v)" class="as-gridline" />
        <text x="38" :y="y(v) + 4" text-anchor="end">{{ v }}%</text>
      </g>
      <g v-for="m in run.models" :key="m.id" :class="'as-series-' + m.color">
        <polyline
          class="as-draw"
          :points="
            m.points.map((p, i) => `${x(i, m.points.length)},${y(p)}`).join(' ')
          "
        />
        <circle
          v-for="(p, i) in m.points"
          :key="i"
          :cx="x(i, m.points.length)"
          :cy="y(p)"
          r="3.5"
        />
      </g>
      <text
        x="546"
        :y="y(Number.parseFloat(run.currentPassRate)) + 4"
        class="as-current"
      >
        {{ run.currentPassRate }}
      </text>
      <text
        x="546"
        :y="y(Number.parseFloat(run.currentPassRate)) + 20"
        class="as-current"
      >
        ({{ labels.current }})
      </text>
    </svg>
    <p class="as-current-summary">
      {{ labels.current }}: {{ run.currentPassRate }}
    </p>
    <div class="as-commits">
      <button
        v-for="c in run.commits"
        :key="c.sha"
        :aria-label="`Select commit ${c.sha}${c.current ? ' (current)' : ''}`"
        @click="$emit('select-commit', c.sha)"
      >
        {{ c.sha }}<span v-if="c.current"> ({{ labels.current }})</span>
      </button>
    </div>
  </section>
</template>
