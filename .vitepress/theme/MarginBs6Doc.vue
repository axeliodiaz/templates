<script setup lang="ts">
import MarginBs6Section from './MarginBs6Section.vue'
import MarginFormsSection from './MarginFormsSection.vue'
import MarginContentSection from './MarginContentSection.vue'
import MarginCustomizeColor from './MarginCustomizeColor.vue'
import MarginBs6Generic from './MarginBs6Generic.vue'
import MarginBs6ProsePreview from './MarginBs6ProsePreview.vue'
import MarginBs6CopyBlock from './MarginBs6CopyBlock.vue'

const PROSE_AREAS = new Set(['getting-started', 'guides', 'customize'])

const props = defineProps<{
  area: string
  slug: string
  label?: string
}>()
</script>
<template>
  <div class="margin-bs6-doc">
  <MarginCustomizeColor v-if="area === 'customize' && slug === 'color'" :label="label" />
  <MarginCustomizeColor v-else-if="area === 'customize' && slug === 'color-modes'" mode-modes :label="label" />
  <MarginBs6Section v-else-if="area === 'components'" :section="slug" :label="label" />
  <MarginFormsSection
    v-else-if="area === 'forms'"
    :section="
      ['checkbox', 'radio'].includes(slug)
        ? 'checks-radios'
        : ['overview', 'form-control', 'field', 'form-adorn', 'select', 'combobox', 'range', 'input-group', 'floating-labels', 'layout', 'validation', 'switch', 'datepicker', 'otp-input', 'password-strength'].includes(slug)
          ? slug === 'combobox'
            ? 'combobox'
            : slug
          : 'form-control'
    "
    :label="label"
  />
  <MarginContentSection v-else-if="area === 'content'" :section="slug === 'tables' ? 'tables-figures' : slug" :label="label" />
  <MarginBs6ProsePreview v-else-if="PROSE_AREAS.has(area)" :area="area" :slug="slug" :label="label" />
  <MarginBs6Generic v-else :area="area" :slug="slug" :label="label" />
  <MarginBs6CopyBlock :area="area" :slug="slug" />
  </div>
</template>