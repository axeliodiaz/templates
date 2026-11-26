<script setup lang="ts">
import { ref } from 'vue'
import { revealTheme } from './theme-reveal'
defineProps<{ label?: string }>()
const dark = ref(false)
function toggle(e: Event) {
  revealTheme(e.currentTarget as HTMLElement, () => { dark.value = !dark.value })
}
</script>
<template>
  <div class="mg-guide-preview" :class="{ 'lab-dark': dark }">
    <div class="mg-guide-toolbar" aria-label="Preview appearance">
      <button type="button" class="mg-guide-toggle" @click="toggle">{{ dark ? 'Light' : 'Dark' }} preview</button>
      <span v-if="label" class="mg-guide-label">{{ label }}</span>
    </div>
    <div class="mg-guide-frame">
      <slot />
    </div>
  </div>
</template>
<style scoped>
.mg-guide-preview{--bg:#f5f5f7;--surface:#fff;--ink:#22252b;--muted:#676e7b;--line:#e0e3e9;--soft:#eceef5;border:1px solid var(--line);border-radius:14px;margin:20px 0;overflow:hidden;background:var(--bg);color:var(--ink)}
.mg-guide-preview.lab-dark{--bg:#181b22;--surface:#242833;--ink:#f1f3f8;--muted:#aab3c3;--line:#404757;--soft:#303747}
.mg-guide-toolbar{display:flex;align-items:center;gap:12px;padding:10px 14px;border-bottom:1px solid var(--line);background:var(--surface);flex-wrap:wrap}
.mg-guide-toggle{border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:8px;padding:7px 12px;font:inherit;font-size:12px;cursor:pointer}
.mg-guide-toggle:hover{border-color:#6389ea;background:var(--soft)}
.mg-guide-toggle:focus-visible{outline:2px solid #6389ea;outline-offset:3px}
.mg-guide-label{font-size:12px;color:var(--muted)}
.mg-guide-frame{padding:18px;min-width:0}
.mg-guide-frame :deep(:is(h1,h2,h3,h4,p,li,dt,dd,th,td)){color:var(--ink)}
.mg-guide-frame :deep(:not(.mg-swatch) > strong){color:var(--ink)}
.mg-guide-frame :deep(small:not(.mg-swatch small)){color:var(--muted)}
</style>