<script setup lang="ts">
import {ref,computed} from 'vue'
const icons:Record<string,string>={
bike:'<circle cx="5.5" cy="17" r="3.5"/><circle cx="18.5" cy="17" r="3.5"/><path d="M5.5 17 9 8h6l3.5 9M9 8 12 17M14 5h3"/>',
calendar:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
user:'<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20c.8-3.8 3.7-5.8 7.5-5.8s6.7 2 7.5 5.8"/>',
users:'<circle cx="9" cy="8.5" r="3.3"/><path d="M2.8 19.5c.6-3.3 3-5 6.2-5s5.6 1.7 6.2 5M16 5.5a3.3 3.3 0 0 1 0 6M18.5 14.6c1.5.7 2.4 2.1 2.7 4.4"/>',
card:'<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h4"/>',
bell:'<path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15zM10 21h4"/>',
check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
close:'<path d="m6 6 12 12M18 6 6 18"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
search:'<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
settings:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
chart:'<path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-7"/>',
pulse:'<path d="M3 12h4l2.5-6 4 12 2.5-6H21"/>',
flame:'<path d="M12 3c.5 3.5 4.5 5 4.5 10a4.5 4.5 0 0 1-9 0c0-2 1-3 2-4 .3 1.5 1 2 1.8 2C11 8.5 11 6 12 3z"/>',
mail:'<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 8 8 6 8-6"/>',
pin:'<path d="M12 21s6.5-5.5 6.5-11a6.5 6.5 0 0 0-13 0C5.5 15.5 12 21 12 21z"/><circle cx="12" cy="10" r="2.3"/>',
ticket:'<path d="M4 8.5A1.5 1.5 0 0 0 4 9v2a2 2 0 0 1 0 4v2a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 17v-2a2 2 0 0 1 0-4V9a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 4 8.5z"/><path d="M14 7.5v9" stroke-dasharray="2 2"/>',
lock:'<rect x="5" y="10.5" width="14" height="9.5" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/>',
moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
home:'<path d="M4 11 12 4l8 7v8.5a.5.5 0 0 1-.5.5H15v-5.5H9V20H4.5a.5.5 0 0 1-.5-.5z"/>',
heart:'<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>'}
const names=Object.keys(icons)
const q=ref(''),picked=ref('bike'),size=ref(24)
const shown=computed(()=>names.filter(n=>n.includes(q.value.trim().toLowerCase())))
const snippet=computed(()=>`<svg viewBox="0 0 24 24" width="${size.value}" height="${size.value}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[picked.value]}</svg>`)
</script>
<template><div class="studio-kit b2-bs6 b2-pacekit studio-pace pace-icons">
<div class="studio-row"><label>Search icons<input class="form-control" v-model="q" placeholder="bike, clock…"/></label><label>Size {{size}}px<input type="range" min="16" max="40" step="4" v-model.number="size"/></label></div>
<div class="pace-icon-grid" role="listbox" aria-label="Pace icons">
<button v-for="n in shown" :key="n" class="btn btn-outline theme-primary" role="option" :aria-selected="picked===n" :class="{active:picked===n}" @click="picked=n"><svg viewBox="0 0 24 24" :width="size" :height="size" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="icons[n]"></svg><small>{{n}}</small></button>
<p v-if="!shown.length">No icon matches "{{q}}".</p></div>
<p><b>{{picked}}</b>: 24px grid, 1.75px round stroke, <code>currentColor</code>. Icons are decorative next to a label, or need <code>aria-label</code> when alone.</p>
<pre class="pace-code"><code>{{snippet}}</code></pre></div></template>
