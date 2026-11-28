<script setup>
import { ref, computed } from 'vue'
import PrlCopyBlock from './pr-lifecycle/PrlCopyBlock.vue'

const props = defineProps({
  definition: { type: Object, required: true },
  jsonPath: { type: String, required: true },
  schemaFields: { type: Array, default: () => [] },
  codeSnippet: { type: String, default: '' },
  structureId: { type: String, default: 'mg-example-structure' },
  tabsAriaLabel: { type: String, default: 'Example documentation' },
  defaultTab: { type: String, default: 'Preview' },
  showCodeTab: { type: Boolean, default: true },
})

const tab = ref(props.defaultTab)
const tabs = computed(() => {
  const list = ['Preview', 'Structure']
  if (props.showCodeTab && props.codeSnippet) list.splice(1, 0, 'Code')
  return list
})
const jsonText = computed(() => JSON.stringify(props.definition, null, 2))
const jsonCopied = ref(false)

async function copyJson() {
  try {
    await navigator.clipboard.writeText(jsonText.value)
    jsonCopied.value = true
    setTimeout(() => {
      jsonCopied.value = false
    }, 1600)
  } catch {
    /* noop */
  }
}
</script>

<template>
  <div class="mg-example-tabs">
    <div class="l-tabs" role="tablist" :aria-label="tabsAriaLabel">
      <button
        v-for="name in tabs"
        :key="name"
        type="button"
        role="tab"
        :aria-selected="tab === name"
        :aria-pressed="tab === name"
        :class="{ 'is-active': tab === name }"
        @click="tab = name"
      >
        {{ name }}
      </button>
    </div>

    <div v-show="tab === 'Preview'" class="l-tabpanel" role="tabpanel">
      <slot />
    </div>

    <div v-show="tab === 'Code'" class="l-tabpanel" role="tabpanel">
      <PrlCopyBlock v-if="codeSnippet" label="Usage" :code="codeSnippet" />
      <slot name="code-extra" />
    </div>

    <div
      v-show="tab === 'Structure'"
      class="l-tabpanel mg-example-structure-panel"
      role="tabpanel"
      :id="structureId"
    >
      <slot name="structure-intro">
        <p>
          Single source of truth: <code>{{ jsonPath }}</code> (top-level <code>type</code>:
          <code>{{ definition.type }}</code>).
        </p>
      </slot>
      <table v-if="schemaFields.length" class="mg-prl-schema-table">
        <thead>
          <tr><th>Field</th><th>Role</th></tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in schemaFields" :key="i">
            <td><code>{{ row.field }}</code></td>
            <td>{{ row.role }}</td>
          </tr>
        </tbody>
      </table>
      <slot name="structure-extra" />
      <div class="mg-prl-structure-copy vp-doc">
        <div class="mg-prl-copy__head">
          <span>{{ jsonPath.split('/').pop() }}</span>
          <button type="button" class="mg-prl-copy__btn" @click="copyJson">
            {{ jsonCopied ? 'Copied' : 'Copy JSON' }}
          </button>
        </div>
        <pre class="mg-prl-copy__pre mg-prl-structure-pre"><code class="language-json">{{ jsonText }}</code></pre>
      </div>
    </div>
  </div>
</template>