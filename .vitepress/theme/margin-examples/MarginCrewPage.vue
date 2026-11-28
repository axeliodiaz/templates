<script setup>
import MarginExampleTabs from '../MarginExampleTabs.vue'
import AgentCrew from '../agent-crew/AgentCrew.vue'
import crewDef from '../agent-crew/crew.json'
import { CREW_SCHEMA } from '../margin-example-schemas.mjs'
</script>
<template>
  <MarginExampleTabs
    :definition="crewDef"
    json-path=".vitepress/theme/agent-crew/crew.json"
    :schema-fields="CREW_SCHEMA"
    code-snippet='<AgentCrew theme="margin" />'
    tabs-aria-label="Agent crew"
  >
    <AgentCrew theme="margin" />
  </MarginExampleTabs>
</template>