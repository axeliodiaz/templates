<script setup>
import { computed } from 'vue'
import MarginExampleTabs from '../MarginExampleTabs.vue'
import GaugeLab from '../GaugeLab.vue'
import MarginDemoShell from '../margin-demos/MarginDemoShell.vue'
import { marginChartDefinition, CHART_SCHEMA_FIELDS } from '../margin-chart-definition.mjs'

const definition = computed(() => marginChartDefinition('status-gauge'))
const usage = '<GaugeLab theme="margin" />'
</script>
<template>
  <MarginExampleTabs
    :definition="definition"
    json-path="felix-chart-examples.json (status-gauge)"
    :schema-fields="CHART_SCHEMA_FIELDS"
    :code-snippet="usage"
    tabs-aria-label="Gauges demo"
  >
    <MarginDemoShell :copy="usage">
      <GaugeLab theme="margin" />
    </MarginDemoShell>
  </MarginExampleTabs>
</template>