<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
const props = defineProps({
  theme: { type: String, default: 'lumen' },
  align: { type: String, default: 'left' },
  modelValue: { type: String, default: 'es' },
  languages: { type: Array, default: () => [{ code: 'ES', name: 'Español' }, { code: 'EN', name: 'English' }, { code: 'PT', name: 'Português' }, { code: 'FR', name: 'Français' }, { code: 'DE', name: 'Deutsch' }] }
})
const emit = defineEmits(['update:modelValue'])
const cur = ref(props.languages.find(l => l.code.toLowerCase() === props.modelValue.toLowerCase()) || props.languages[0])
const open = ref(false)
const act = ref(0)
const root = ref(null), menu = ref(null), btn = ref(null)
const uid = 'ls-' + Math.random().toString(36).slice(2, 8)
const activeId = computed(() => uid + '-' + act.value)
function show() { open.value = true; act.value = Math.max(0, props.languages.findIndex(l => l.code === cur.value.code)); nextTick(() => menu.value && menu.value.focus()) }
function hide(refocus) { open.value = false; if (refocus && btn.value) btn.value.focus() }
function pick(l) { cur.value = l; emit('update:modelValue', l.code.toLowerCase()); hide(true) }
function onKey(e) {
  const n = props.languages.length
  if (e.key === 'ArrowDown') { e.preventDefault(); act.value = (act.value + 1) % n }
  else if (e.key === 'ArrowUp') { e.preventDefault(); act.value = (act.value + n - 1) % n }
  else if (e.key === 'Home') { e.preventDefault(); act.value = 0 }
  else if (e.key === 'End') { e.preventDefault(); act.value = n - 1 }
  else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(props.languages[act.value]) }
  else if (e.key === 'Escape') { e.preventDefault(); hide(true) }
  else if (e.key === 'Tab') hide(false)
}
function onDoc(e) { if (open.value && root.value && !root.value.contains(e.target)) hide(false) }
onMounted(() => document.addEventListener('pointerdown', onDoc))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDoc))
</script>

<template>
  <div class="ls" :data-t="theme" ref="root">
    <button ref="btn" type="button" class="ls-btn" aria-haspopup="listbox" :aria-expanded="open" :aria-label="'Language: ' + cur.name" @click="open ? hide(false) : show()" @keydown.down.prevent="!open && show()">
      <svg class="ls-globe" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>
      <span class="ls-code">{{ cur.code }}</span>
      <svg class="ls-chev" :class="{ up: open }" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <ul v-if="open" ref="menu" class="ls-menu" :class="{ r: align === 'right' }" role="listbox" tabindex="-1" aria-label="Language" :aria-activedescendant="activeId" @keydown="onKey">
      <li v-for="(l, i) in languages" :id="uid + '-' + i" :key="l.code" role="option" :aria-selected="cur.code === l.code" :class="{ on: cur.code === l.code, act: act === i }" @click="pick(l)" @mousemove="act = i">
        <span class="ls-oc">{{ l.code }}</span><span class="ls-on">{{ l.name }}</span>
        <svg v-if="cur.code === l.code" class="ls-ck" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>
      </li>
    </ul>
  </div>
</template>

<style>
.ls{position:relative;display:inline-block;--ls-surf:#fff;--ls-ink:#17171a;--ls-mut:#74767d;--ls-bd:#e7e7e9;--ls-pri:#7c6cf0;--ls-hov:#ece9fd;--ls-r:12px;--ls-font:'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif;font:500 13px/1 var(--ls-font);color:var(--ls-ink);text-align:left}
.ls[data-t=lustro]{--ls-surf:#1b1b32;--ls-ink:#f4f2fc;--ls-mut:#bbb9d4;--ls-bd:#4b4d70;--ls-pri:#818cf8;--ls-hov:#2c2e50;--ls-r:10px;--ls-font:'DM Sans',ui-sans-serif,system-ui,sans-serif}
html.lu-light .ls[data-t=lustro]{--ls-surf:#fff;--ls-ink:#17172b;--ls-mut:#6b6b8a;--ls-bd:#c9c9e2;--ls-pri:#4f46e5;--ls-hov:#ebebf7}
.ls[data-t=felix]{--ls-surf:#fff;--ls-ink:#082422;--ls-mut:#636158;--ls-bd:#cfcabf;--ls-pri:#065958;--ls-hov:#e3efee;--ls-r:10px;--ls-font:'Saans',ui-sans-serif,system-ui,sans-serif}
html.felix-dark .ls[data-t=felix]{--ls-surf:#0f2a28;--ls-ink:#efebe7;--ls-mut:#a8a89c;--ls-bd:#35605f;--ls-pri:#2bf2f1;--ls-hov:#14403e}
.ls[data-t=pulsefit]{--ls-surf:#fff;--ls-ink:#212121;--ls-mut:#5f666d;--ls-bd:#e0e0e0;--ls-pri:#c9a66b;--ls-hov:#f5e6d3;--ls-r:8px;--ls-font:'Rubik',ui-sans-serif,system-ui,sans-serif}
html.pf-dark .ls[data-t=pulsefit]{--ls-surf:#222427;--ls-ink:#ececee;--ls-mut:#a3a7ad;--ls-bd:#383b40;--ls-hov:#3a3123}
.ls[data-t=scopecraft]{--ls-surf:#fff;--ls-ink:#111113;--ls-mut:#6b6f76;--ls-bd:#e6e6e8;--ls-pri:#2f6fdc;--ls-hov:#e8f0fd;--ls-r:9px;--ls-font:'Inter',ui-sans-serif,system-ui,sans-serif}
html.sc-dark .ls[data-t=scopecraft]{--ls-surf:#1f2024;--ls-ink:#f4f4f5;--ls-mut:#9a9ca4;--ls-bd:#2e3036;--ls-pri:#6ea0f5;--ls-hov:#6ea0f533}
html.lmn-dark .ls[data-t=lumen]{--ls-surf:#1f2024;--ls-ink:#f4f4f5;--ls-mut:#9a9ca4;--ls-bd:#2e3036;--ls-pri:#8f80f3;--ls-hov:#8f80f333}
.ls *{box-sizing:border-box}
.ls-btn{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 10px;border:1px solid var(--ls-bd);border-radius:var(--ls-r);background:var(--ls-surf);color:var(--ls-ink);font:inherit;font-weight:600;letter-spacing:.02em;cursor:pointer}
.ls-btn:hover{border-color:var(--ls-pri)}
.ls-btn:focus-visible{outline:2px solid var(--ls-pri);outline-offset:2px}
.ls-btn[aria-expanded=true]{border-color:var(--ls-pri)}
.ls-globe{color:var(--ls-mut)}.ls-chev{color:var(--ls-mut);transition:transform .15s ease}.ls-chev.up{transform:rotate(180deg)}
.ls .ls-menu{position:absolute;top:calc(100% + 6px);left:0;z-index:30;min-width:176px;margin:0;padding:4px;list-style:none;background:var(--ls-surf);color:var(--ls-ink);border:1px solid var(--ls-bd);border-radius:var(--ls-r);box-shadow:0 12px 30px rgba(20,20,40,.18);outline:0;animation:ls-in .14s ease-out}
.ls .ls-menu.r{left:auto;right:0}
.ls .ls-menu li{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:calc(var(--ls-r) - 4px);cursor:pointer;margin:0}
.ls .ls-menu li.act{background:var(--ls-hov)}
.ls .ls-menu li.on{font-weight:700}
.ls-oc{width:22px;font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--ls-mut)}
.ls-on{flex:1}.ls-ck{color:var(--ls-pri)}
@keyframes ls-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.ls .ls-menu{animation:none}.ls-chev{transition:none}}
</style>
