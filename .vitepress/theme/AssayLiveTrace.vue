<script setup lang="ts">
import type { AssayRun, AssayLabels } from "./assay.types";
defineProps<{ run: AssayRun; labels: AssayLabels }>();
</script>
<template>
  <section class="as-card as-trace" aria-label="Live trace">
    <header>
      <h2>Live trace</h2>
      <span v-if="run.traceLive" class="as-live"
        ><i class="as-dot" />{{ labels.live }}</span
      >
    </header>
    <ol>
      <li
        v-for="(s, i) in run.trace"
        :key="s.id"
        :class="'as-step-' + s.status"
        :aria-current="s.status === 'current' ? 'step' : undefined"
      >
        <span class="as-step-icon" aria-hidden="true">{{
          s.status === "done" ? "✓" : i + 1
        }}</span>
        <div>
          <strong>{{ s.title }}</strong>
          <p :class="{ 'as-mono': s.kind === 'tool_call' }">{{ s.detail }}</p>
        </div>
        <time v-if="s.at">{{ s.at }}</time
        ><span v-if="s.chip" class="as-chip">{{ s.chip }}</span>
      </li>
    </ol>
  </section>
</template>
