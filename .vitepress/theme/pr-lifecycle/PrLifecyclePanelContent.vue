<script setup>
import { computed } from 'vue'
import { resolvePanel } from './lifecycle-eval.mjs'

const props = defineProps({
  phaseId: { type: String, required: true },
  phaseLabel: { type: String, required: true },
  m: { type: Object, required: true },
  phaseState: { type: Function, required: true },
  deepLink: { type: Boolean, default: false },
  copyDone: { type: Boolean, default: false },
})

const emit = defineEmits(['copy-link'])

const panel = computed(() => resolvePanel(props.phaseId, props.m, props.phaseState))
</script>

<template>
  <div class="mg-prl__panel-body">
    <div class="mg-prl__panel-head">
      <h4>{{ phaseLabel }}</h4>
      <button
        v-if="deepLink"
        type="button"
        class="mg-prl__copylink"
        @click.stop="emit('copy-link')"
      >
        {{ copyDone ? 'Copied' : 'Copy link' }}
      </button>
    </div>

    <div
      v-for="(c, i) in panel.callouts"
      :key="'c-' + i"
      class="mg-prl__callout"
      :class="c.kind === 'failed' ? 'mg-prl__callout--failed' : 'mg-prl__callout--blocked'"
      role="alert"
    >
      {{ c.text }}
    </div>

    <p v-if="panel.stat" class="mg-prl__stat">{{ panel.stat }}</p>

    <ul class="mg-prl__rows" :class="{ 'mg-prl__rows-scroll': phaseId === 'checks' }">
      <li
        v-for="(row, i) in panel.rows"
        :key="i"
        :class="row.kind === 'split' ? 'mg-prl__row--split' : 'mg-prl__row--full'"
      >
        <template v-if="row.kind === 'split'">
          <span class="mg-prl__rk">{{ row.label }}</span>
          <span class="mg-prl__rv">{{ row.value }}</span>
        </template>
        <template v-else>{{ row.text }}</template>
      </li>
    </ul>
  </div>
</template>