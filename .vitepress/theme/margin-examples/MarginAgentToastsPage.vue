<script setup>
import MarginExampleTabs from '../MarginExampleTabs.vue'
import AgentToasts from '../agent-toasts/AgentToasts.vue'
import toastDef from '../agent-toasts/agent-toasts.json'
import { TOAST_SCHEMA } from '../margin-example-schemas.mjs'
</script>
<template>
  <MarginExampleTabs
    :definition="toastDef"
    json-path=".vitepress/theme/agent-toasts/agent-toasts.json"
    :schema-fields="TOAST_SCHEMA"
    code-snippet='<AgentToasts theme="margin" />'
    tabs-aria-label="Agent toasts"
  >
    <AgentToasts theme="margin" />
  </MarginExampleTabs>
</template>