<script setup lang="ts">
import type { AssayRun, AssayLabels } from "./assay.types";
defineProps<{ run: AssayRun; labels: AssayLabels }>();
defineEmits<{ "select-case": [id: string]; "view-all-failing": [] }>();
</script>
<template>
  <section class="as-card as-failing">
    <header>
      <h2>{{ labels.failingCases }}</h2>
      <span class="as-badge">{{ labels.casesBadge(run.failingTotal) }}</span>
    </header>
    <table class="as-case-table">
      <thead>
        <tr>
          <th>{{ labels.colCaseId }}</th>
          <th>{{ labels.colExpected }}</th>
          <th>{{ labels.colGot }}</th>
          <th>{{ labels.colToolChain }}</th>
          <th>{{ labels.colStatus }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in run.failing" :key="c.id">
          <td>
            <button
              class="as-case-link as-mono"
              @click="$emit('select-case', c.id)"
            >
              {{ c.id }}
            </button>
          </td>
          <td>{{ c.expected }}</td>
          <td>{{ c.got }}</td>
          <td>
            <span
              v-for="tool in c.toolChain"
              :key="tool"
              class="as-chip as-mono"
              >{{ tool }}</span
            >
          </td>
          <td class="as-bad">{{ c.status.toUpperCase() }}</td>
        </tr>
      </tbody>
    </table>
    <div class="as-case-cards">
      <article v-for="c in run.failing" :key="c.id">
        <header>
          <button
            class="as-case-link as-mono"
            @click="$emit('select-case', c.id)"
          >
            {{ c.id }}</button
          ><strong class="as-bad">{{ c.status.toUpperCase() }}</strong>
        </header>
        <dl>
          <dt>{{ labels.colExpected }}</dt>
          <dd>{{ c.expected }}</dd>
          <dt>{{ labels.colGot }}</dt>
          <dd>{{ c.got }}</dd>
        </dl>
        <div>
          <span
            v-for="tool in c.toolChain"
            :key="tool"
            class="as-chip as-mono"
            >{{ tool }}</span
          >
        </div>
      </article>
    </div>
    <p v-if="!run.failing.length">No failing cases in this run.</p>
    <button class="as-view-all" @click="$emit('view-all-failing')">
      {{ labels.viewAllFailing }}
    </button>
  </section>
</template>
