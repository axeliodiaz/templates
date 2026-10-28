<script setup lang="ts">
import { ref } from 'vue'
import LangSelect from './LangSelect.vue'
const language=ref('es')
</script>
<template><section class="language-usage l-demo" aria-label="Language select usage demonstration"><p>Sample language choice. This does not translate the page.</p><div class="picker"><LangSelect theme="lustro" v-model="language"/></div><p role="status">Last local choice: {{language}}. No routing or saving.</p></section></template>
<style scoped>
.language-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0; min-height:340px } .picker { min-height:290px } .language-usage :deep(.ls-btn) { min-height:44px } .language-usage :deep(.ls-menu li) { min-height:44px }
</style>
