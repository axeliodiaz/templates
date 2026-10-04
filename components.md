<script setup>
import { ref } from 'vue'
const toasts = ref([])
let nextToastId = 0
const toastTimers = new Map()
const alertOpen = ref(true)
const modalOpen = ref(false)
const tab = ref('Overview')
const search = ref('')
const choice = ref('Design')
const accordion = ref('Tokens')
const page = ref(1)
const slide = ref(0)
const drawerOpen = ref(false)
const navOpen = ref(false)
const menuSection = ref('Inicio')
function dismissToast(id) {
  toasts.value = toasts.value.filter(item => item.id !== id)
  clearTimeout(toastTimers.get(id))
  toastTimers.delete(id)
}
function showToast(message, type = 'info') {
  const id = ++nextToastId
  toasts.value.push({ id, message, type })
  toastTimers.set(id, setTimeout(() => dismissToast(id), 6000))
}
</script>

# Components

A usable Lustro component catalog. These are interactive examples, not a dependency on Bootstrap. Each family has a role, a state, and a keyboard path. The dark surfaces and accent tokens come from the [Lustro foundation](/lustro).

::: tip Production use
Examples show the visual contract. When you wire them to real data, keep validation, loading, disabled states, focus and announcements. Don't copy demo labels as product content.
:::

## Actions

### Buttons {#buttons}

Primary is for one leading action per surface. Secondary is for peer actions. Destructive uses semantic red, never the brand gradient.

<div class="l-demo l-actions"><button class="l-btn l-primary" @click="showToast('Primary action selected')">Primary action</button><button class="l-btn l-secondary" @click="showToast('Secondary action selected')">Secondary</button><button class="l-btn l-quiet" @click="showToast('Quiet action selected')">Quiet</button><button class="l-btn l-danger" @click="modalOpen=true">Delete...</button><button class="l-btn l-secondary" disabled>Disabled</button></div>

<span id="button-group-and-dropdown"></span>

### Button group {#button-group}

Button group chooses one mode; the adjacent dropdown holds secondary actions.

<div class="l-demo l-actions"><div class="l-segment" aria-label="Display mode"><button v-for="item in ['Design','Code','Preview']" :key="item" :aria-pressed="choice===item" :class="{'is-active':choice===item}" @click="choice=item">{{ item }}</button></div></div>

### Dropdowns {#dropdowns}

<div class="l-demo l-actions"><details class="l-dropdown"><summary>More actions</summary><div class="l-menu"><button @click="showToast('Copied link')">Copy link</button><button @click="showToast('Saved for later')">Save for later</button></div></details></div>





<span id="links-and-pagination"></span>

### Pagination {#pagination}

<div class="l-demo l-actions"><a href="/lustro">Lustro foundation ↗</a><nav class="l-pages" aria-label="Example pages"><button @click="page=Math.max(1,page-1)" :disabled="page===1">Previous</button><span>Page {{page}} / 3</span><button @click="page=Math.min(3,page+1)" :disabled="page===3">Next</button></nav></div>

## Feedback

<span id="alerts-and-notifications"></span>

### Alerts {#alerts}

Alerts occupy the page and stay until dismissed. Notifications need a clear source, severity and next action. Do not use color alone to explain the state.

<div class="l-demo"><div v-if="alertOpen" class="l-alert l-alert-warn" role="alert"><div><strong>Needs attention</strong><p>Two checks are waiting for a review.</p></div><button class="l-icon-btn" aria-label="Dismiss notification" @click="alertOpen=false">×</button></div><button v-else class="l-btn l-secondary" @click="alertOpen=true">Show notification again</button><div class="l-alert l-alert-success"><div><strong>Saved</strong><p>Your changes are up to date.</p></div></div></div>

### Toasts {#toasts}

A toast confirms a short-lived result; it must never be the only place for an error that needs fixing. Trigger several in quick succession: each one stays visible independently until dismissed or its six-second timer ends. Color, a label and a message communicate the variant together.

<div class="l-demo l-actions"><button class="l-btn l-primary" @click="showToast('Changes saved', 'success')">Show toast</button><button class="l-btn l-secondary" @click="showToast('Secondary action queued', 'info')">Show secondary toast</button><button class="l-btn l-secondary" @click="showToast('Review before continuing', 'warn')">Show warning</button><button class="l-btn l-secondary" @click="showToast('Could not save changes', 'error')">Show error</button></div>
<div class="l-toast-stack" aria-label="Toast notifications"><div v-for="item in toasts" :key="item.id" class="l-toast" :class="'l-toast-' + item.type" :role="item.type === 'error' ? 'alert' : 'status'"><span class="l-dot" :class="'l-dot-' + item.type" aria-hidden="true"></span><span class="l-toast-copy"><strong>{{ { success: 'Success', info: 'Info', warn: 'Warning', error: 'Error' }[item.type] }}</strong><span>{{ item.message }}</span></span><button class="l-icon-btn" :aria-label="'Dismiss ' + item.type + ' toast: ' + item.message" @click="dismissToast(item.id)">×</button></div></div>

For production, keep independent IDs and timers so a new arrival never overwrites an earlier one. Render the stack in a portal above app content, cap its height and let it scroll on small screens. Keep errors that need user action inline too; the toast is only a short announcement. Respect reduced-motion when animating entry and exit.

<span id="badges-progress-spinners-and-skeletons"></span>

### Badge {#badge}

<div class="l-demo l-actions"><span class="l-badge">Draft</span><span class="l-badge l-badge-success">Ready</span><span class="l-badge l-badge-warn">Running</span><span class="l-badge l-badge-error">Blocked</span></div>

Use a short label with text, not a color alone. The grouped demo below includes four states.

### Progress {#progress}

<div class="l-demo"><label class="l-field-label" for="sample-progress">Upload progress · 68%</label><progress id="sample-progress" max="100" value="68">68%</progress></div>

Progress has a value and a max; use an indeterminate loader only when no useful estimate exists.

### Spinners/Loaders {#spinners-loaders}

<div class="l-demo"><span class="l-spinner" role="status" aria-label="Loading"></span></div>

Name the loading region for assistive technology.

### Placeholders {#placeholders}

<div class="l-demo"><div class="l-skeleton" aria-hidden="true"></div><p>Loading summary...</p></div>

Skeletons reserve space while content loads; do not leave them in a permanent empty state.




## Content

<span id="cards"></span>

### Card {#card}

Use a compact summary with a clear title, metadata and the next action; keep card links and nested buttons separate.

<div class="l-demo l-grid"><article class="l-card"><span class="l-eyebrow">PROJECT · REPO A</span><h3>Review changes</h3><p>The latest request is waiting for your review.</p><div class="l-card-foot"><span class="l-badge l-badge-warn">Needs review</span><button class="l-btn l-secondary" @click="showToast('Card action selected')">Open</button></div></article><article class="l-card"><span class="l-eyebrow">TASK · 024</span><h3>Ready to ship</h3><p>Checks completed. The next step is a merge.</p><div class="l-card-foot"><span class="l-badge l-badge-success">Ready</span><button class="l-btn l-secondary" @click="showToast('Card action selected')">Details</button></div></article></div>

### Accordion {#accordion}

<div class="l-demo"><div v-for="item in ['Tokens','Behavior','Accessibility']" :key="item" class="l-accordion"><button :aria-expanded="accordion===item" @click="accordion=accordion===item?'':item">{{item}} <span>{{accordion===item?'−':'+'}}</span></button><p v-if="accordion===item">{{item==='Tokens'?'Use the shared color, type and spacing tokens.':item==='Behavior'?'Keep transitions short and tied to a state change.':'Use labels, visible focus and reduced-motion fallbacks.'}}</p></div></div>

<span id="tabs-breadcrumbs-and-list-group"></span>

### Breadcrumb {#breadcrumb}

<div class="l-demo"><nav aria-label="Breadcrumb" class="l-breadcrumb"><a href="/">Templates</a><span>/</span><a href="/lustro">Lustro</a><span>/</span><strong>Components</strong></nav></div>

### Navs & tabs {#navs-tabs}

<div class="l-demo"><div class="l-tabs" role="tablist" aria-label="Example tabs"><button v-for="item in ['Overview','Activity','Settings']" :key="item" role="tab" :aria-selected="tab===item" @click="tab=item">{{item}}</button></div><div class="l-tabpanel" role="tabpanel">{{tab}}: sample content for the selected tab.</div></div>

### List group {#list-group}

<div class="l-demo"><ul class="l-list"><li><span>01 · Surface tokens</span><span class="l-badge">Docs</span></li><li><span>02 · Component states</span><span class="l-badge l-badge-success">Ready</span></li></ul></div>





<span id="table-and-empty-state"></span>

### Tables {#tables}

See the full set at [Tables](/tables).

<div class="l-demo"><div class="l-table-scroll"><table class="l-table"><thead><tr><th scope="col">Component</th><th scope="col">Status</th><th scope="col">Owner</th></tr></thead><tbody><tr><td>Buttons</td><td><span class="l-badge l-badge-success">Ready</span></td><td>Design</td></tr><tr><td>Notifications</td><td><span class="l-badge l-badge-warn">Review</span></td><td>Product</td></tr><tr><td>Graphs</td><td><span class="l-badge">Example</span></td><td>Motion</td></tr></tbody></table></div><div class="l-empty"><strong>No results</strong><p>Try a different search or clear your filters.</p><button class="l-btn l-secondary" @click="search=''">Clear filters</button></div></div>

## Form controls

<span id="inputs-select-checkbox-radio-and-switch"></span>

### Forms {#forms}

<div class="l-demo l-form"><label class="l-field-label" for="sample-search">Search components</label><input id="sample-search" type="search" v-model="search" placeholder="Search by name"><small>{{search?`Searching for “${search}”`:'Use descriptive labels, not only placeholders.'}}</small><label class="l-field-label" for="sample-select">Category</label><select id="sample-select"><option>All components</option><option>Actions</option><option>Feedback</option><option>Content</option></select><label class="l-field-label" for="sample-notes">Notes</label><textarea id="sample-notes" rows="2" placeholder="Optional notes"></textarea><label class="l-check"><input type="checkbox" checked> Send updates</label><fieldset><legend>Density</legend><label class="l-check"><input type="radio" name="density" checked> Comfortable</label><label class="l-check"><input type="radio" name="density"> Compact</label></fieldset><label class="l-switch"><input type="checkbox" checked><span aria-hidden="true"></span> Enable notifications</label></div>

## Overlays

<span id="modal-dialog"></span>

### Modal {#modal}

Use a modal for a decision that cannot be made inline. In a production app, use the native modal API for Escape, focus trapping, and focus return. This guide shows the visual treatment only; close with its button or backdrop.

<div class="l-demo"><button class="l-btn l-secondary" @click="modalOpen=true">Open dialog</button><dialog :open="modalOpen" class="l-dialog" aria-labelledby="dialog-heading" @cancel.prevent="modalOpen=false"><h3 id="dialog-heading">Confirm action</h3><p>This is a visual example. No data is deleted.</p><div class="l-actions"><button class="l-btn l-secondary" @click="modalOpen=false">Cancel</button><button class="l-btn l-danger" @click="modalOpen=false;showToast('Demo only: nothing deleted')">Confirm</button></div></dialog><div v-if="modalOpen" class="l-backdrop" @click="modalOpen=false"></div></div>

<span id="tooltip-and-popover"></span>

### Tooltips {#tooltips}

Tooltips add brief context, never required instructions.

<div class="l-demo l-actions"><button class="l-btn l-secondary" title="Contexto de esta acción">Pasa el cursor para ver ayuda</button></div>

### Popovers {#popovers}

The adjacent disclosure stays open for longer text.

<div class="l-demo l-actions"><details class="l-dropdown"><summary>Más información</summary><div class="l-menu l-popover">Este texto permanece visible hasta cerrar el panel.</div></details></div>





## Layout primitives

Use responsive grid, stack and divider patterns before adding bespoke spacing. On mobile, cards become one column and tables scroll within their own frame. See [Graphs](/graphs) and [Motion](/motion) for richer patterns.

<div class="l-demo"><div class="l-grid"><div class="l-card">Main content surface</div><div class="l-card">Supporting content surface</div></div><hr><div class="l-actions"><span class="l-avatar" aria-label="Example avatar">AD</span><span>Avatar + identity</span><span class="l-badge">Metadata</span></div></div>


## More components

These patterns extend the existing Lustro catalog. The [Felix atoms](/felix/components/atoms) and [molecules](/felix/components/molecules) show related interaction choices, adapted here to Lustro rather than copied in Felix colors.

### Carousel {#carousel}

A short series of related previews; arrows and dots remain keyboard-operable.

<div class="l-demo l-carousel"><button class="l-btn l-secondary" aria-label="Previous slide" @click="slide=(slide+2)%3">‹</button><article class="l-card" aria-live="polite"><span class="l-eyebrow">{{slide+1}} / 3</span><h3>{{['Overview','Details','Next steps'][slide]}}</h3><p>{{['Start with the foundation.','Try one interaction.','Check the result in context.'][slide]}}</p></article><button class="l-btn l-secondary" aria-label="Next slide" @click="slide=(slide+1)%3">›</button><div class="l-carousel-dots"><button v-for="n in 3" :key="n" :aria-label="`Go to slide ${n}`" :aria-current="slide===n?'true':undefined" @click="slide=n-1">{{n}}</button></div></div>

### Close button {#close-button}

Use an accessible name and a hit area large enough to tap. The toast is an illustration, not a destructive action.

<div class="l-demo l-actions"><button class="l-close" aria-label="Close sample panel" @click="showToast('Sample panel closed')">×</button><span>Close a dismissible panel</span></div>

### Collapse {#collapse}

For one block of secondary detail, prefer native disclosure. Accordion above coordinates several blocks.

<div class="l-demo"><details class="l-collapse"><summary>Mostrar detalles de entrega</summary><p>Este contenido se puede abrir con Enter o Espacio y cerrar sin perder contexto.</p></details></div>

### Navbar and footer {#navbar-and-footer}

A small responsive navigation preview. The menu button expands the links on narrow screens.

<div class="l-demo"><nav class="l-site-nav" aria-label="Example navigation"><strong>LUSTRO</strong><button class="l-btn l-secondary" :aria-expanded="navOpen" aria-controls="sample-nav-links" @click="navOpen=!navOpen">Menú</button><div id="sample-nav-links" :class="{'is-open':navOpen}"><a href="/introduccion">Inicio</a><a href="/components">Componentes</a><a href="/graphs">Charts</a></div></nav><footer class="l-site-footer"><span>© Demo Lustro</span><a href="/lustro">Guía de diseño</a></footer></div>

### Offcanvas {#offcanvas}

A side panel keeps the main context visible. This demo closes from its button or backdrop. A production drawer must also trap focus, close on Escape and return focus to its opener.

<div class="l-demo"><button class="l-btn l-secondary" @click="drawerOpen=true">Abrir panel lateral</button><div v-if="drawerOpen" class="l-drawer-backdrop" @click="drawerOpen=false"></div><aside v-if="drawerOpen" class="l-drawer" aria-label="Panel lateral de ejemplo" @keydown.esc="drawerOpen=false"><button class="l-close" aria-label="Cerrar panel" @click="drawerOpen=false">×</button><h3>Detalles</h3><p>Un panel para información secundaria sin salir de la página.</p><button class="l-btn l-primary" @click="drawerOpen=false">Listo</button></aside></div>

### Scrollspy {#scrollspy}

Select a section to bring it into view; the active state is also exposed as text.

<div class="l-demo"><nav class="l-spy-nav" aria-label="Example sections"><button v-for="item in ['Inicio','Detalles','Resumen']" :key="item" :aria-current="menuSection===item?'location':undefined" @click="menuSection=item">{{item}}</button></nav><div class="l-card" aria-live="polite"><strong>{{menuSection}}</strong><p>Sección {{menuSection.toLowerCase()}} seleccionada.</p></div></div>
