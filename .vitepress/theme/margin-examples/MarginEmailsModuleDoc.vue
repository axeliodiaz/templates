<script setup>
import MarginExampleTabs from '../MarginExampleTabs.vue'
import emailDef from '../margin-emails.json'
import { EMAIL_SCHEMA } from '../margin-example-schemas.mjs'
</script>
<template>
  <div class="margin-emails-module-doc">
    <p>
      Transactional previews at <a href="/margin/correos">/margin/correos</a> with inline lab colors. Fictitious sample
      data only.
    </p>
    <MarginExampleTabs
      :definition="emailDef"
      json-path=".vitepress/theme/margin-emails.json"
      :schema-fields="EMAIL_SCHEMA"
      code-snippet='import emailDef from "./margin-emails.json"'
      tabs-aria-label="Transactional emails module"
      :show-code-tab="true"
    >
      <p class="mg-note">
        Live interactive preview:
        <a href="/margin/correos">Open /margin/correos</a> (Preview tab shows the full mail shell).
      </p>
    </MarginExampleTabs>
  </div>
</template>