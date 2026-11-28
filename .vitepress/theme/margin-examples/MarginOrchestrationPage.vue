<script setup>
import MarginExampleTabs from '../MarginExampleTabs.vue'
import AgentOrchestration from '../agent-orchestration/AgentOrchestration.vue'
import orchestrationDef from '../agent-orchestration/orchestration.json'
import { ORCHESTRATION_SCHEMA } from '../margin-example-schemas.mjs'
</script>
<template>
  <MarginExampleTabs
    :definition="orchestrationDef"
    json-path=".vitepress/theme/agent-orchestration/orchestration.json"
    :schema-fields="ORCHESTRATION_SCHEMA"
    code-snippet='<AgentOrchestration theme="margin" />'
    tabs-aria-label="Agent orchestration"
  >
    <AgentOrchestration theme="margin" />
  </MarginExampleTabs>
</template>