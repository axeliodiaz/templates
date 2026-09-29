<script setup>
import { ref } from 'vue'
const toast = ref('')
const alertOpen = ref(true)
const modalOpen = ref(false)
const tab = ref('Overview')
const search = ref('')
const choice = ref('Design')
const accordion = ref('Tokens')
const page = ref(1)
let toastTimer
function showToast(message) { toast.value = message; clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.value = '', 3800) }
</script>

# Components

A usable Lustro component catalog. These are interactive examples, not a dependency on Bootstrap. Each family has a role, a state, and a keyboard path. The dark surfaces and accent tokens come from the [Lustro foundation](/lustro).

::: tip Production use
Examples show the visual contract. When you wire them to real data, keep validation, loading, disabled states, focus and announcements. Don't copy demo labels as product content.
:::

## Actions

### Buttons

Primary is for one leading action per surface. Secondary is for peer actions. Destructive uses semantic red, never the brand gradient.

<div class="l-demo l-actions"><button class="l-btn l-primary" @click="showToast('Primary action selected')">Primary action</button><button class="l-btn l-secondary" @click="showToast('Secondary action selected')">Secondary</button><button class="l-btn l-quiet" @click="showToast('Quiet action selected')">Quiet</button><button class="l-btn l-danger" @click="modalOpen=true">Delete...</button><button class="l-btn l-secondary" disabled>Disabled</button></div>

### Button group and dropdown

<div class="l-demo l-actions"><div class="l-segment" aria-label="Display mode"><button v-for="item in ['Design','Code','Preview']" :key="item" :aria-pressed="choice===item" :class="{'is-active':choice===item}" @click="choice=item">{{ item }}</button></div><details class="l-dropdown"><summary>More actions</summary><div class="l-menu"><button @click="showToast('Copied link')">Copy link</button><button @click="showToast('Saved for later')">Save for later</button></div></details></div>

### Links and pagination

<div class="l-demo l-actions"><a href="/lustro">Lustro foundation ↗</a><nav class="l-pages" aria-label="Example pages"><button @click="page=Math.max(1,page-1)" :disabled="page===1">Previous</button><span>Page {{page}} / 3</span><button @click="page=Math.min(3,page+1)" :disabled="page===3">Next</button></nav></div>

## Feedback

### Alerts and notifications

Alerts occupy the page and stay until dismissed. Notifications need a clear source, severity and next action. Do not use color alone to explain the state.

<div class="l-demo"><div v-if="alertOpen" class="l-alert l-alert-warn" role="alert"><div><strong>Needs attention</strong><p>Two checks are waiting for a review.</p></div><button class="l-icon-btn" aria-label="Dismiss notification" @click="alertOpen=false">×</button></div><button v-else class="l-btn l-secondary" @click="alertOpen=true">Show notification again</button><div class="l-alert l-alert-success"><div><strong>Saved</strong><p>Your changes are up to date.</p></div></div></div>

### Toasts

A toast confirms a short-lived result; it must never be the only place for an error that needs fixing. Try the button below.

<div class="l-demo"><button class="l-btn l-primary" @click="showToast('Changes saved')">Show toast</button></div>
<div v-if="toast" class="l-toast" role="status" aria-live="polite"><span class="l-dot l-dot-success"></span>{{toast}}<button class="l-icon-btn" aria-label="Dismiss toast" @click="toast=''">×</button></div>

### Badges, progress, spinners and skeletons

<div class="l-demo"><div class="l-actions"><span class="l-badge">Draft</span><span class="l-badge l-badge-success">Ready</span><span class="l-badge l-badge-warn">Running</span><span class="l-badge l-badge-error">Blocked</span><span class="l-spinner" role="status" aria-label="Loading"></span></div><label class="l-field-label" for="sample-progress">Upload progress · 68%</label><progress id="sample-progress" max="100" value="68">68%</progress><div class="l-skeleton" aria-hidden="true"></div></div>

## Content

### Cards

Use a compact summary with a clear title, metadata and the next action; keep card links and nested buttons separate.

<div class="l-demo l-grid"><article class="l-card"><span class="l-eyebrow">PROJECT · REPO A</span><h3>Review changes</h3><p>The latest request is waiting for your review.</p><div class="l-card-foot"><span class="l-badge l-badge-warn">Needs review</span><button class="l-btn l-secondary" @click="showToast('Card action selected')">Open</button></div></article><article class="l-card"><span class="l-eyebrow">TASK · 024</span><h3>Ready to ship</h3><p>Checks completed. The next step is a merge.</p><div class="l-card-foot"><span class="l-badge l-badge-success">Ready</span><button class="l-btn l-secondary" @click="showToast('Card action selected')">Details</button></div></article></div>

### Accordion

<div class="l-demo"><div v-for="item in ['Tokens','Behavior','Accessibility']" :key="item" class="l-accordion"><button :aria-expanded="accordion===item" @click="accordion=accordion===item?'':item">{{item}} <span>{{accordion===item?'−':'+'}}</span></button><p v-if="accordion===item">{{item==='Tokens'?'Use the shared color, type and spacing tokens.':item==='Behavior'?'Keep transitions short and tied to a state change.':'Use labels, visible focus and reduced-motion fallbacks.'}}</p></div></div>

### Tabs, breadcrumbs and list group

<div class="l-demo"><nav aria-label="Breadcrumb" class="l-breadcrumb"><a href="/">Templates</a><span>/</span><a href="/lustro">Lustro</a><span>/</span><strong>Components</strong></nav><div class="l-tabs" role="tablist" aria-label="Example tabs"><button v-for="item in ['Overview','Activity','Settings']" :key="item" role="tab" :aria-selected="tab===item" @click="tab=item">{{item}}</button></div><div class="l-tabpanel" role="tabpanel">{{tab}}: sample content for the selected tab.</div><ul class="l-list"><li><span>01 · Surface tokens</span><span class="l-badge">Docs</span></li><li><span>02 · Component states</span><span class="l-badge l-badge-success">Ready</span></li></ul></div>

### Table and empty state

<div class="l-demo"><div class="l-table-scroll"><table class="l-table"><thead><tr><th scope="col">Component</th><th scope="col">Status</th><th scope="col">Owner</th></tr></thead><tbody><tr><td>Buttons</td><td><span class="l-badge l-badge-success">Ready</span></td><td>Design</td></tr><tr><td>Notifications</td><td><span class="l-badge l-badge-warn">Review</span></td><td>Product</td></tr><tr><td>Graphs</td><td><span class="l-badge">Example</span></td><td>Motion</td></tr></tbody></table></div><div class="l-empty"><strong>No results</strong><p>Try a different search or clear your filters.</p><button class="l-btn l-secondary" @click="search=''">Clear filters</button></div></div>

## Forms

### Inputs, select, checkbox, radio and switch

<div class="l-demo l-form"><label class="l-field-label" for="sample-search">Search components</label><input id="sample-search" type="search" v-model="search" placeholder="Search by name"><small>{{search?`Searching for “${search}”`:'Use descriptive labels, not only placeholders.'}}</small><label class="l-field-label" for="sample-select">Category</label><select id="sample-select"><option>All components</option><option>Actions</option><option>Feedback</option><option>Content</option></select><label class="l-field-label" for="sample-notes">Notes</label><textarea id="sample-notes" rows="2" placeholder="Optional notes"></textarea><label class="l-check"><input type="checkbox" checked> Send updates</label><fieldset><legend>Density</legend><label class="l-check"><input type="radio" name="density" checked> Comfortable</label><label class="l-check"><input type="radio" name="density"> Compact</label></fieldset><label class="l-switch"><input type="checkbox" checked><span aria-hidden="true"></span> Enable notifications</label></div>

## Overlays

### Modal dialog

Use a modal for a decision that cannot be made inline. In a production app, use the native modal API for Escape, focus trapping, and focus return. This guide shows the visual treatment and a backdrop click.

<div class="l-demo"><button class="l-btn l-secondary" @click="modalOpen=true">Open dialog</button><dialog :open="modalOpen" class="l-dialog" aria-labelledby="dialog-heading" @cancel.prevent="modalOpen=false"><h3 id="dialog-heading">Confirm action</h3><p>This is a visual example. No data is deleted.</p><div class="l-actions"><button class="l-btn l-secondary" @click="modalOpen=false">Cancel</button><button class="l-btn l-danger" @click="modalOpen=false;showToast('Demo only: nothing deleted')">Confirm</button></div></dialog><div v-if="modalOpen" class="l-backdrop" @click="modalOpen=false"></div></div>

### Tooltip and popover

<div class="l-demo l-actions"><button class="l-btn l-secondary" title="Helpful context for this action">Hover for hint</button><details class="l-dropdown"><summary>Read more</summary><div class="l-menu l-popover">A popover holds extra context and remains open until dismissed.</div></details></div>

## Layout primitives

Use responsive grid, stack and divider patterns before adding bespoke spacing. On mobile, cards become one column and tables scroll within their own frame. See [Graphs](/graphs) and [Motion](/motion) for richer patterns.

<div class="l-demo"><div class="l-grid"><div class="l-card">Main content surface</div><div class="l-card">Supporting content surface</div></div><hr><div class="l-actions"><span class="l-avatar" aria-label="Example avatar">AD</span><span>Avatar + identity</span><span class="l-badge">Metadata</span></div></div>
