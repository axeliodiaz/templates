<script setup lang="ts">
import { ref, useId, nextTick } from 'vue'
const id = useId()
const disclosure = ref<HTMLDetailsElement>()
const summary = ref<HTMLElement>()
const overview = ref<HTMLElement>()
const setup = ref<HTMLElement>()
const checks = ref<HTMLElement>()
async function follow(target: 'overview'|'setup'|'checks') { if(disclosure.value) disclosure.value.open = false; await nextTick(); ({overview,setup,checks}[target]).value?.focus() }
function escape(event: KeyboardEvent) { if(event.key==='Escape' && disclosure.value?.open) { disclosure.value.open=false; summary.value?.focus(); event.preventDefault() } }
</script>
<template>
<section class="navigation-demo" aria-label="Navigation disclosure example" @keydown="escape">
<nav aria-label="Example guide navigation"><a :href="`#${id}-overview`" @click="follow('overview')">Overview</a><details ref="disclosure"><summary ref="summary">Guide sections</summary><ul><li><a :href="`#${id}-setup`" @click="follow('setup')">Set up</a></li><li><a :href="`#${id}-checks`" @click="follow('checks')">Checks</a></li></ul></details></nav>
<p>Links navigate to headings in this example. Open the disclosure with Enter or Space. Escape closes it and returns focus to its summary.</p>
<div class="navigation-target"><h3 :id="`${id}-overview`" ref="overview" tabindex="-1">Example overview</h3><p>Use links for destinations and a native disclosure for grouped links.</p><h3 :id="`${id}-setup`" ref="setup" tabindex="-1">Example set up</h3><p>Give each destination a real URL or unique local anchor.</p><h3 :id="`${id}-checks`" ref="checks" tabindex="-1">Example checks</h3><p>Check keyboard access, narrow layouts and focus at the destination.</p></div>
</section>
</template>
<style scoped>
.navigation-demo{border:1px solid var(--vp-c-divider);border-radius:14px;padding:20px;margin:20px 0}.navigation-demo nav{display:flex;flex-wrap:wrap;align-items:flex-start;gap:16px;border-bottom:1px solid var(--vp-c-divider);padding-bottom:16px}.navigation-demo summary{cursor:pointer;padding:5px 10px;border:1px solid var(--vp-c-divider);border-radius:7px;transition:background .15s}.navigation-demo nav>a{padding:5px 0}.navigation-demo details{min-width:140px;max-width:100%}.navigation-demo details[open] summary{background:var(--vp-c-brand-soft)}.navigation-demo ul{padding:10px 10px 10px 28px;margin:8px 0 0;border:1px solid var(--vp-c-divider);border-radius:8px;animation:navigation-open .16s ease-out}.navigation-demo a:focus-visible,.navigation-demo summary:focus-visible,.navigation-demo h3:focus{outline:2px solid var(--vp-c-brand-1);outline-offset:3px}.navigation-target{overflow-wrap:anywhere}.navigation-target h3{scroll-margin-top:120px}@keyframes navigation-open{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.navigation-demo ul{animation:none}.navigation-demo summary{transition:none}}
</style>
