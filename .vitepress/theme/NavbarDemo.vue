<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { animate, stagger } from 'motion'
const props = defineProps({ theme: { type: String, default: 'pulsefit' } })
const T = {
  lustro: ['#0b0b18', 'rgba(148,140,255,.08)', '#fff', '#a5b4fc', 'rgba(148,140,255,.22)', '#6366f1', '#fff', '#34d399', '#f472b6', 'rgba(99,102,241,.2)', "'DM Sans',sans-serif", '14px', '#6366f1', '#fbbf24', '#22d3ee', '#f472b6', '#64648c'],
  felix: ['#fefcf9', '#fff', '#082422', '#636158', '#e3ded3', '#065958', '#fff', '#1b8a4b', '#c0392b', '#e3efee', "'Saans',sans-serif", '10px', '#065958', '#c9772b', '#7fb7b5', '#e0b778', '#a8a89c'],
  pulsefit: ['#f5f5f5', '#fff', '#212121', '#5f666d', '#e0e0e0', '#C9A66B', '#212121', '#198754', '#dc3545', '#f5e6d3', "'Rubik',sans-serif", '14px', '#7a5a1f', '#C9A66B', '#b8c4cc', '#e6d2b0', '#b0b0b0'],
  scopecraft: ['#f4f4f5', '#fff', '#111113', '#6b6f76', '#e6e6e8', '#111113', '#fff', '#17803d', '#c62828', '#ececee', 'ui-sans-serif,system-ui,sans-serif', '8px', '#111113', '#2f6fdc', '#9aa0aa', '#c4c7ce', '#d9dadd'],
  lumen: ['#fbfbfa', '#fff', '#17171a', '#74767d', '#e7e7e9', '#7c6cf0', '#fff', '#1b9a4b', '#d23b3b', '#ece9fd', "'Plus Jakarta Sans',sans-serif", '12px', '#7c6cf0', '#f5b800', '#0fb0ea', '#e08a1e', '#b5b7bd']
}
const v = computed(() => { const t = T[props.theme] || T.pulsefit; const k = ['bg', 'surf', 'ink', 'mut', 'bd', 'pri', 'prit', 'ok', 'bad', 'soft', 'font', 'r', 'c1', 'c2', 'c3', 'c4', 'c5']; return Object.fromEntries(k.map((n, i) => ['--nb-' + n, t[i]])) })
const links = ['Overview', 'Projects', 'Reports', 'Team']
const active = ref('Projects')
const open = ref(false)
const dd = ref(false)
const q = ref('')
const dark = ref(false)
const panel = ref(null), menu = ref(null), root = ref(null)
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
watch(open, async o => { if (!o) return; await nextTick(); if (!reduce() && panel.value) animate(panel.value, { opacity: [0, 1], y: [-8, 0] }, { duration: 0.25 }) })
watch(dd, async o => { if (!o) return; await nextTick(); if (!reduce() && menu.value) animate(menu.value, { opacity: [0, 1], y: [-6, 0] }, { duration: 0.2 }) })
const pick = l => { active.value = l; open.value = false }
onMounted(() => { if (reduce() || !root.value) return; animate(root.value.querySelectorAll('.nb-bar'), { opacity: [0, 1], y: [-6, 0] }, { delay: stagger(0.1), duration: 0.4 }) })
</script>

<template>
  <div class="nb" :style="v" ref="root" @keydown.esc="open = false; dd = false">
    <nav class="nb-bar" aria-label="Primary"><a class="nb-brand"><i></i>Brand</a>
      <button type="button" class="nb-burger" :aria-expanded="open" aria-controls="nb-p1" aria-label="Toggle navigation" @click="open = !open"><span></span><span></span><span></span></button>
      <div class="nb-links" :class="{ show: open }" id="nb-p1" ref="panel"><a v-for="l in links" :key="l" href="#" :class="{ on: active === l }" :aria-current="active === l ? 'page' : null" @click.prevent="pick(l)">{{ l }}</a>
        <div class="nb-dd"><button type="button" :aria-expanded="dd" aria-haspopup="menu" @click="dd = !dd">More &#9662;</button><div v-if="dd" ref="menu" class="nb-menu" role="menu"><a role="menuitem" href="#" @click.prevent="dd = false">Billing</a><a role="menuitem" href="#" @click.prevent="dd = false">Integrations</a><hr><a role="menuitem" href="#" @click.prevent="dd = false">Help center</a></div></div>
        <span class="nb-search"><input v-model="q" type="search" placeholder="Search" aria-label="Search" /></span></div></nav>
    <p class="nb-note">Responsive collapse: narrow the window under 700 px and use the menu button. Current: <b>{{ active }}</b>{{ q ? ', searching "' + q + '"' : '' }}.</p>
    <nav class="nb-bar sec" aria-label="Secondary"><a class="nb-brand"><i></i>Brand</a><div class="nb-links show"><a v-for="l in links" :key="l" href="#" :class="{ on: active === l }" @click.prevent="active = l">{{ l }}</a></div><button type="button" class="nb-tg" :aria-pressed="dark" @click="dark = !dark">{{ dark ? 'Dark' : 'Light' }}</button></nav>
    <nav class="nb-bar dk" aria-label="Inverted"><a class="nb-brand"><i></i>Brand</a><div class="nb-links show"><a v-for="l in links" :key="l" href="#" :class="{ on: active === l }" @click.prevent="active = l">{{ l }}</a></div><span class="nb-pill">3</span></nav>
  </div>
</template>

<style>
.nb{margin:12px 0;font:14px/1.4 var(--nb-font);color:var(--nb-ink);display:flex;flex-direction:column;gap:12px;text-align:left}
.nb *{box-sizing:border-box}.nb-note{margin:0!important;font-size:12.5px;color:var(--nb-mut)}
.nb-bar{display:flex;align-items:center;gap:14px;flex-wrap:wrap;background:var(--nb-surf);border:1px solid var(--nb-bd);border-radius:var(--nb-r);padding:8px 14px;position:relative}
.nb-brand{display:flex;align-items:center;gap:8px;font-weight:700;color:var(--nb-ink)!important;text-decoration:none!important}.nb-brand i{width:20px;height:20px;border-radius:6px;background:var(--nb-pri)}
.nb-links{display:flex;align-items:center;gap:4px;flex:1;flex-wrap:wrap}.nb-links a,.nb-dd>button{color:var(--nb-mut)!important;text-decoration:none!important;padding:6px 12px;border-radius:calc(var(--nb-r) - 3px);font:500 13.5px var(--nb-font);border:0;background:transparent;cursor:pointer}.nb-links a:hover,.nb-dd>button:hover{background:var(--nb-soft);color:var(--nb-ink)!important}.nb-links a.on{background:var(--nb-soft);color:var(--nb-ink)!important;font-weight:600}
.nb-dd{position:relative}.nb-menu{position:absolute;left:0;top:36px;z-index:5;min-width:170px;background:var(--nb-surf);border:1px solid var(--nb-bd);border-radius:var(--nb-r);box-shadow:0 10px 28px rgba(0,0,0,.14);padding:6px}.nb-menu a{display:block}.nb-menu hr{border:0;border-top:1px solid var(--nb-bd);margin:4px 0}
.nb-search{margin-left:auto}.nb-search input{border:1px solid var(--nb-bd);background:var(--nb-bg);color:var(--nb-ink);border-radius:999px;padding:6px 14px;font:13px var(--nb-font);width:170px}
.nb-burger{display:none;margin-left:auto;border:1px solid var(--nb-bd);background:transparent;border-radius:calc(var(--nb-r) - 3px);padding:8px;cursor:pointer;flex-direction:column;gap:3px}.nb-burger span{display:block;width:18px;height:2px;background:var(--nb-ink);border-radius:1px}
.nb button:focus-visible,.nb a:focus-visible,.nb input:focus-visible{outline:2px solid var(--nb-pri);outline-offset:2px}
.nb-bar.sec{background:var(--nb-soft)}.nb-tg{margin-left:auto;border:1px solid var(--nb-bd);background:var(--nb-surf);color:var(--nb-ink);border-radius:999px;padding:5px 14px;font:600 12px var(--nb-font);cursor:pointer}
.nb-bar.dk{background:var(--nb-ink);border-color:var(--nb-ink);color:var(--nb-bg)}.nb-bar.dk .nb-brand{color:var(--nb-bg)!important}.nb-bar.dk .nb-links a{color:color-mix(in srgb,var(--nb-bg) 70%,transparent)!important}.nb-bar.dk .nb-links a.on,.nb-bar.dk .nb-links a:hover{background:color-mix(in srgb,var(--nb-bg) 16%,transparent);color:var(--nb-bg)!important}.nb-pill{margin-left:auto;background:var(--nb-pri);color:var(--nb-prit);border-radius:99px;padding:1px 9px;font-weight:700;font-size:12px}
@media(max-width:700px){.nb-burger{display:flex}.nb-links:not(.show){display:none}.nb-links{width:100%;flex-direction:column;align-items:stretch;flex:none}.nb-search{margin:4px 0 0}.nb-search input{width:100%}.nb-menu{position:static;box-shadow:none;margin-top:4px}}
</style>
