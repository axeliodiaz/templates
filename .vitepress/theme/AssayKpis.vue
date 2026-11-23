<script setup lang="ts">
import type { AssayKpi } from "./assay.types";
defineProps<{ kpis: AssayKpi[] }>();
function spark(points: number[]) {
  const min = Math.min(...points),
    range = Math.max(...points) - min || 1;
  return points
    .map(
      (n, i) =>
        `${(i / (points.length - 1 || 1)) * 220},${38 - ((n - min) / range) * 30}`,
    )
    .join(" ");
}
</script>
<template>
  <div class="as-kpis">
    <section
      v-for="k in kpis"
      :key="k.id"
      class="as-card as-kpi"
      :aria-label="k.label"
    >
      <h2>{{ k.label }}</h2>
      <strong class="as-value">{{ k.value }}</strong
      ><svg viewBox="0 0 220 42" aria-hidden="true" :class="['as-spark', k.id]">
        <polyline class="as-draw" :points="spark(k.sparkline)" />
      </svg>
      <p :class="['as-delta', k.id === 'regressions' ? 'as-bad' : 'as-good']">
        <span aria-hidden="true">{{
          k.delta.direction === "up"
            ? "↑"
            : k.delta.direction === "down"
              ? "↓"
              : "→"
        }}</span>
        {{ k.delta.label }}
      </p>
    </section>
  </div>
</template>
