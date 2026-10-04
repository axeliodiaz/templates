<script setup>
import { ref, computed } from 'vue'
const rows = [
  { id: 1, name: 'Buttons', status: 'Ready', owner: 'Design', amount: 1240, delta: 4.2, date: '2026-09-02' },
  { id: 2, name: 'Notifications', status: 'Review', owner: 'Product', amount: 860, delta: -1.8, date: '2026-09-05' },
  { id: 3, name: 'Graphs', status: 'Example', owner: 'Motion', amount: 2310, delta: 12.5, date: '2026-09-11' },
  { id: 4, name: 'Toasts', status: 'Ready', owner: 'Design', amount: 430, delta: 0.6, date: '2026-09-14' },
  { id: 5, name: 'Calendar', status: 'Review', owner: 'Product', amount: 1980, delta: -6.4, date: '2026-09-18' },
  { id: 6, name: 'Messaging', status: 'Ready', owner: 'Platform', amount: 3150, delta: 8.9, date: '2026-09-21' },
  { id: 7, name: 'Pricing', status: 'Example', owner: 'Growth', amount: 720, delta: -2.3, date: '2026-09-25' },
  { id: 8, name: 'Dependency graph', status: 'Review', owner: 'Motion', amount: 1560, delta: 3.1, date: '2026-09-28' },
  { id: 9, name: 'Shipping label', status: 'Ready', owner: 'Platform', amount: 940, delta: 1.4, date: '2026-10-01' },
  { id: 10, name: 'Node flow', status: 'Example', owner: 'Motion', amount: 2740, delta: -0.9, date: '2026-10-03' }
]
const cls = s => s === 'Ready' ? 'l-badge-success' : s === 'Review' ? 'l-badge-warn' : ''
const money = n => '$' + n.toLocaleString('en-US')
const pct = n => (n > 0 ? '+' : '') + n.toFixed(1) + '%'
const dcls = n => n > 0 ? 'tg-pos' : n < 0 ? 'tg-neg' : ''
const basic = rows.slice(0, 4)
// sortable
const sortKey = ref('name'), sortDir = ref(1)
const sorted = computed(() => [...rows].sort((a, b) => (a[sortKey.value] > b[sortKey.value] ? 1 : -1) * sortDir.value).slice(0, 6))
function sortBy(k) { if (sortKey.value === k) sortDir.value *= -1; else { sortKey.value = k; sortDir.value = 1 } }
const arrow = k => sortKey.value === k ? (sortDir.value > 0 ? ' ▲' : ' ▼') : ''
const ariaSort = k => sortKey.value === k ? (sortDir.value > 0 ? 'ascending' : 'descending') : 'none'
// filters
const q = ref(''), fStatus = ref(''), fOwner = ref('')
const filtered = computed(() => rows.filter(r => (!q.value || r.name.toLowerCase().includes(q.value.toLowerCase())) && (!fStatus.value || r.status === fStatus.value) && (!fOwner.value || r.owner === fOwner.value)))
function clearFilters() { q.value = ''; fStatus.value = ''; fOwner.value = '' }
// pagination
const page = ref(1), size = 4
const pages = Math.ceil(rows.length / size)
const paged = computed(() => rows.slice((page.value - 1) * size, page.value * size))
// selection
const sel = ref([])
const allSel = computed(() => sel.value.length === rows.length)
function toggleAll(e) { sel.value = e.target.checked ? rows.map(r => r.id) : [] }
// actions
const list = ref(rows.slice(0, 4)), msg = ref('')
function act(a, r) { if (a === 'Delete') list.value = list.value.filter(x => x.id !== r.id); msg.value = `${a}: ${r.name}` }
// expandable
const open = ref(null)
// loading
const loading = ref(true)
// empty
const emptyQ = ref('zzz')
const total = rows.reduce((s, r) => s + r.amount, 0)
const avg = rows.reduce((s, r) => s + r.delta, 0) / rows.length
</script>

<template>
<div class="tg">
<h2 id="basic">Basic</h2>
<p>Plain semantic table with status badges. Wrap every table in a scroll frame.</p>
<div class="l-demo"><div class="l-table-scroll"><table class="l-table"><thead><tr><th scope="col">Component</th><th scope="col">Status</th><th scope="col">Owner</th></tr></thead><tbody><tr v-for="r in basic" :key="r.id"><td>{{ r.name }}</td><td><span class="l-badge" :class="cls(r.status)">{{ r.status }}</span></td><td>{{ r.owner }}</td></tr></tbody></table></div></div>

<h2 id="striped">Striped</h2>
<div class="l-demo"><div class="l-table-scroll"><table class="l-table tg-striped"><thead><tr><th scope="col">Component</th><th scope="col">Status</th><th scope="col">Owner</th></tr></thead><tbody><tr v-for="r in rows.slice(0, 6)" :key="r.id"><td>{{ r.name }}</td><td><span class="l-badge" :class="cls(r.status)">{{ r.status }}</span></td><td>{{ r.owner }}</td></tr></tbody></table></div></div>

<h2 id="hover">Hover rows</h2>
<div class="l-demo"><div class="l-table-scroll"><table class="l-table tg-hover"><thead><tr><th scope="col">Component</th><th scope="col">Status</th><th scope="col">Owner</th></tr></thead><tbody><tr v-for="r in basic" :key="r.id"><td>{{ r.name }}</td><td><span class="l-badge" :class="cls(r.status)">{{ r.status }}</span></td><td>{{ r.owner }}</td></tr></tbody></table></div></div>

<h2 id="compact">Compact</h2>
<p>Tighter padding for dense data.</p>
<div class="l-demo"><div class="l-table-scroll"><table class="l-table tg-compact"><thead><tr><th scope="col">Component</th><th scope="col">Owner</th><th scope="col" class="tg-num">Amount</th></tr></thead><tbody><tr v-for="r in rows.slice(0, 7)" :key="r.id"><td>{{ r.name }}</td><td>{{ r.owner }}</td><td class="tg-num">{{ money(r.amount) }}</td></tr></tbody></table></div></div>

<h2 id="bordered">Bordered</h2>
<div class="l-demo"><div class="l-table-scroll"><table class="l-table tg-bordered"><thead><tr><th scope="col">Component</th><th scope="col">Status</th><th scope="col">Owner</th></tr></thead><tbody><tr v-for="r in basic" :key="r.id"><td>{{ r.name }}</td><td><span class="l-badge" :class="cls(r.status)">{{ r.status }}</span></td><td>{{ r.owner }}</td></tr></tbody></table></div></div>

<h2 id="sticky-header">Sticky header</h2>
<p>The header stays visible while the body scrolls inside a fixed height.</p>
<div class="l-demo"><div class="l-table-scroll tg-sticky"><table class="l-table"><thead><tr><th scope="col">Component</th><th scope="col">Owner</th><th scope="col">Date</th><th scope="col" class="tg-num">Amount</th></tr></thead><tbody><tr v-for="r in rows" :key="r.id"><td>{{ r.name }}</td><td>{{ r.owner }}</td><td>{{ r.date }}</td><td class="tg-num">{{ money(r.amount) }}</td></tr></tbody></table></div></div>

<h2 id="sortable">Sortable</h2>
<p>Click a header to sort; click again to reverse.</p>
<div class="l-demo"><div class="l-table-scroll"><table class="l-table"><thead><tr>
<th scope="col" :aria-sort="ariaSort('name')"><button class="tg-sort" @click="sortBy('name')">Component{{ arrow('name') }}</button></th>
<th scope="col" :aria-sort="ariaSort('owner')"><button class="tg-sort" @click="sortBy('owner')">Owner{{ arrow('owner') }}</button></th>
<th scope="col" class="tg-num" :aria-sort="ariaSort('amount')"><button class="tg-sort" @click="sortBy('amount')">Amount{{ arrow('amount') }}</button></th></tr></thead>
<tbody><tr v-for="r in sorted" :key="r.id"><td>{{ r.name }}</td><td>{{ r.owner }}</td><td class="tg-num">{{ money(r.amount) }}</td></tr></tbody></table></div></div>

<h2 id="filterable">Search and column filters</h2>
<div class="l-demo l-form"><div class="tg-bar">
<input type="search" v-model="q" placeholder="Search component" aria-label="Search component">
<select v-model="fStatus" aria-label="Filter by status"><option value="">All statuses</option><option>Ready</option><option>Review</option><option>Example</option></select>
<select v-model="fOwner" aria-label="Filter by owner"><option value="">All owners</option><option>Design</option><option>Product</option><option>Motion</option><option>Platform</option><option>Growth</option></select>
<button class="l-btn l-secondary" @click="clearFilters">Clear filters</button></div>
<p>{{ filtered.length }} of {{ rows.length }} rows</p>
<div class="l-table-scroll"><table class="l-table"><thead><tr><th scope="col">Component</th><th scope="col">Status</th><th scope="col">Owner</th></tr></thead><tbody><tr v-for="r in filtered" :key="r.id"><td>{{ r.name }}</td><td><span class="l-badge" :class="cls(r.status)">{{ r.status }}</span></td><td>{{ r.owner }}</td></tr></tbody></table></div>
<div v-if="!filtered.length" class="l-empty"><strong>No results</strong><p>Try a different search or clear your filters.</p><button class="l-btn l-secondary" @click="clearFilters">Clear filters</button></div></div>

<h2 id="pagination">Pagination</h2>
<div class="l-demo"><div class="l-table-scroll"><table class="l-table"><thead><tr><th scope="col">Component</th><th scope="col">Owner</th><th scope="col" class="tg-num">Amount</th></tr></thead><tbody><tr v-for="r in paged" :key="r.id"><td>{{ r.name }}</td><td>{{ r.owner }}</td><td class="tg-num">{{ money(r.amount) }}</td></tr></tbody></table></div>
<div class="tg-pager"><span>Page {{ page }} of {{ pages }}</span><span><button class="l-btn l-secondary" :disabled="page === 1" @click="page--">Previous</button> <button class="l-btn l-secondary" :disabled="page === pages" @click="page++">Next</button></span></div></div>

<h2 id="selectable">Selectable rows</h2>
<div class="l-demo"><p>{{ sel.length ? sel.length + ' selected' : 'No rows selected' }}</p><div class="l-table-scroll"><table class="l-table tg-hover"><thead><tr><th scope="col" class="tg-chk"><input type="checkbox" :checked="allSel" :indeterminate.prop="sel.length > 0 && !allSel" @change="toggleAll" aria-label="Select all rows"></th><th scope="col">Component</th><th scope="col">Owner</th></tr></thead><tbody><tr v-for="r in rows.slice(0, 6)" :key="r.id" :class="{ 'tg-selected': sel.includes(r.id) }"><td class="tg-chk"><input type="checkbox" :value="r.id" v-model="sel" :aria-label="'Select ' + r.name"></td><td>{{ r.name }}</td><td>{{ r.owner }}</td></tr></tbody></table></div></div>

<h2 id="row-actions">Row actions</h2>
<div class="l-demo"><div class="l-table-scroll"><table class="l-table"><thead><tr><th scope="col">Component</th><th scope="col">Owner</th><th scope="col" class="tg-num">Actions</th></tr></thead><tbody><tr v-for="r in list" :key="r.id"><td>{{ r.name }}</td><td>{{ r.owner }}</td><td class="tg-num"><button class="l-btn l-secondary tg-sm" @click="act('View', r)">View</button> <button class="l-btn l-secondary tg-sm" @click="act('Edit', r)">Edit</button> <button class="l-btn l-secondary tg-sm" @click="act('Delete', r)">Delete</button></td></tr></tbody></table></div><p aria-live="polite">{{ msg || 'Actions are local and fictitious.' }}</p></div>

<h2 id="expandable">Expandable rows</h2>
<div class="l-demo"><div class="l-table-scroll"><table class="l-table"><thead><tr><th scope="col" class="tg-chk"><span class="tg-vh">Expand</span></th><th scope="col">Component</th><th scope="col">Status</th></tr></thead><tbody><template v-for="r in rows.slice(0, 4)" :key="r.id"><tr><td class="tg-chk"><button class="tg-sort" :aria-expanded="open === r.id" :aria-label="'Toggle details for ' + r.name" @click="open = open === r.id ? null : r.id">{{ open === r.id ? '▾' : '▸' }}</button></td><td>{{ r.name }}</td><td><span class="l-badge" :class="cls(r.status)">{{ r.status }}</span></td></tr><tr v-if="open === r.id" class="tg-detail"><td></td><td colspan="2">Owner {{ r.owner }} · updated {{ r.date }} · {{ money(r.amount) }} ({{ pct(r.delta) }})</td></tr></template></tbody></table></div></div>

<h2 id="deltas">Numeric columns with deltas</h2>
<p>Right-align numbers, use tabular figures, and pair color with a sign so it does not rely on color alone.</p>
<div class="l-demo"><div class="l-table-scroll"><table class="l-table"><thead><tr><th scope="col">Component</th><th scope="col" class="tg-num">Amount</th><th scope="col" class="tg-num">Change</th></tr></thead><tbody><tr v-for="r in rows.slice(0, 6)" :key="r.id"><td>{{ r.name }}</td><td class="tg-num">{{ money(r.amount) }}</td><td class="tg-num" :class="dcls(r.delta)">{{ r.delta > 0 ? '▲' : '▼' }} {{ pct(r.delta) }}</td></tr></tbody></table></div></div>

<h2 id="footer-totals">Footer totals</h2>
<div class="l-demo"><div class="l-table-scroll"><table class="l-table"><thead><tr><th scope="col">Component</th><th scope="col" class="tg-num">Amount</th><th scope="col" class="tg-num">Change</th></tr></thead><tbody><tr v-for="r in rows" :key="r.id"><td>{{ r.name }}</td><td class="tg-num">{{ money(r.amount) }}</td><td class="tg-num" :class="dcls(r.delta)">{{ pct(r.delta) }}</td></tr></tbody><tfoot><tr><th scope="row">Total / average</th><td class="tg-num">{{ money(total) }}</td><td class="tg-num" :class="dcls(avg)">{{ pct(avg) }}</td></tr></tfoot></table></div></div>

<h2 id="empty">Empty state</h2>
<div class="l-demo"><div class="l-empty"><strong>No results</strong><p>No components match “{{ emptyQ }}”. Try a different search or clear your filters.</p><button class="l-btn l-secondary" @click="emptyQ = ''">Clear filters</button></div></div>

<h2 id="loading">Loading skeleton</h2>
<div class="l-demo"><button class="l-btn l-secondary" @click="loading = !loading">{{ loading ? 'Show data' : 'Show loading' }}</button><div class="l-table-scroll"><table class="l-table" :aria-busy="loading"><thead><tr><th scope="col">Component</th><th scope="col">Status</th><th scope="col">Owner</th></tr></thead><tbody><template v-if="loading"><tr v-for="n in 4" :key="n"><td><span class="tg-skel" style="width:70%"></span></td><td><span class="tg-skel" style="width:50px"></span></td><td><span class="tg-skel" style="width:55%"></span></td></tr></template><template v-else><tr v-for="r in basic" :key="r.id"><td>{{ r.name }}</td><td><span class="l-badge" :class="cls(r.status)">{{ r.status }}</span></td><td>{{ r.owner }}</td></tr></template></tbody></table></div></div>

<h2 id="responsive">Responsive card layout</h2>
<p>Under 640 px each row becomes a labeled card. Resize the window to see it.</p>
<div class="l-demo"><table class="l-table tg-stack"><thead><tr><th scope="col">Component</th><th scope="col">Status</th><th scope="col">Owner</th><th scope="col" class="tg-num">Amount</th></tr></thead><tbody><tr v-for="r in rows.slice(0, 4)" :key="r.id"><td data-label="Component">{{ r.name }}</td><td data-label="Status"><span class="l-badge" :class="cls(r.status)">{{ r.status }}</span></td><td data-label="Owner">{{ r.owner }}</td><td data-label="Amount" class="tg-num">{{ money(r.amount) }}</td></tr></tbody></table></div>

<h2 id="production">Production checklist</h2>
<p>Use real <code>th scope</code>, a caption or heading for every table, <code>aria-sort</code> on sortable headers, and visible focus. Never rely on color alone for deltas. Data above is fictitious and local.</p>
</div>
</template>

<style>
.tg h2{margin-top:34px}
.tg .l-table{margin:0}
.tg .l-table th,.tg .l-table td{background:transparent}
.tg .l-table tr{background:transparent!important}
.tg-striped tbody tr:nth-child(even){background:#23233d!important}
.tg-hover tbody tr:hover{background:#2c2e50!important}
.tg-compact th,.tg-compact td{padding:5px 10px!important;font-size:13px}
.tg-bordered,.tg-bordered th,.tg-bordered td{border:1px solid #464867!important}
.tg-sticky{max-height:230px;overflow:auto}
.tg-sticky thead th{position:sticky;top:0;background:#26274a!important;z-index:1}
.tg-num{text-align:right!important;font-variant-numeric:tabular-nums}
.tg-pos{color:#77e2bc}.tg-neg{color:#ff9bad}
.tg-sort{background:none;border:0;color:inherit;font:inherit;font-weight:600;cursor:pointer;padding:4px}
.tg-sort:hover{color:#fff}
.tg-bar{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:8px}
.tg-bar input,.tg-bar select{min-height:42px;padding:0 12px;border-radius:10px;border:1px solid #565875;background:#12122a;color:#f4f2fc;font:14px 'DM Sans',sans-serif}
.tg-bar .l-btn{margin:0}
.tg-pager{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:12px}
.tg-pager .l-btn,.tg-sm{margin:0}
.tg-sm{min-height:32px!important;padding:4px 10px!important;font-size:12px!important}
.tg-chk{width:42px}
.tg-selected{background:#2c2e50!important}
.tg-detail td{color:#c9c7dc;font-size:13px}
.tg-vh{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.tg-skel{display:inline-block;height:14px;border-radius:7px;background:linear-gradient(90deg,#2c2e50,#44476f,#2c2e50);background-size:200% 100%;animation:tgs 1.4s linear infinite}
@keyframes tgs{to{background-position:-200% 0}}
.tg tfoot th,.tg tfoot td{border-top:2px solid #666889;border-bottom:0;font-weight:700;color:#fff}
.tg tfoot th{text-align:left}
@media(max-width:640px){
.tg-stack thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.tg-stack,.tg-stack tbody,.tg-stack tr,.tg-stack td{display:block;width:100%;min-width:0}
.tg-stack tr{border:1px solid #464867;border-radius:12px;margin-bottom:12px;padding:6px 0;background:#202039!important}
.tg-stack td{display:flex;justify-content:space-between;gap:12px;border:0!important;padding:8px 14px!important;text-align:right!important}
.tg-stack td:before{content:attr(data-label);color:#babbdd;font-weight:600;text-align:left}
}
@media(prefers-reduced-motion:reduce){.tg-skel{animation:none}}
</style>
