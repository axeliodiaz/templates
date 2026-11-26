#!/usr/bin/env node
/**
 * Post-process MarginBs6Catalog.vue: BS6 demos for pages that shipped with Lustro stubs or missing sections.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, '.vitepress/theme/MarginBs6Catalog.vue')

let s = fs.readFileSync(out, 'utf8')

function replaceSection(id, body) {
  const re = new RegExp(`<section id="${id}"[\\s\\S]*?</section>`)
  if (!re.test(s)) {
    console.warn(`patch-margin-bs6-catalog: section #${id} not found, skip`)
    return
  }
  s = s.replace(re, body)
}

if (!s.includes('const collapseMain = ref')) {
  s = s.replace(
    'const drawerOpen = ref(false)',
    `const drawerOpen = ref(false)
const collapseMain = ref(false)
const collapseHoriz = ref(false)
const collapseMultiA = ref(false)
const collapseMultiB = ref(false)
const chipActive = ref('Design')
const listTab = ref('home')
const navPane = ref('profile')
const mgModal = ref('')`,
  )
}

const note =
  '<p class="kit-note"><strong>Keyboard:</strong> Tab to interactive controls. Enter activates buttons and links; Space toggles native choices. Disabled controls cannot be activated. Use Escape to close modal surfaces.</p>'

replaceSection(
  'close-button',
  `<section id="close-button" class="kit-section" v-show="showSection('close-button') && (!catalogSearch || &quot;close button&quot;.includes(catalogSearch.toLowerCase()))"><h2>Close button</h2><p>Icon dismiss controls with an accessible name. Use <code>btn-close</code> (not bare text) and pair with visible context.</p>
<div class="l-demo l-actions flex-wrap gap-2 align-items-center"><button type="button" class="btn-close" aria-label="Close"></button><button type="button" class="btn-close" disabled aria-label="Close (disabled)"></button></div>
<div class="l-demo"><div class="alert theme-info d-flex align-items-start gap-2" role="alert"><div class="flex-grow-1"><strong>Heads up</strong><p class="mb-0">Dismissible alerts use <code>btn-close</code> on the trailing edge.</p></div><button type="button" class="btn-close" aria-label="Close alert" @click="showToast('Alert dismissed','info')"></button></div></div>
<div class="l-demo mg-demo-surface-dark" style="background:var(--ink,#22252b);border-radius:10px;padding:12px 14px"><div class="d-flex align-items-center justify-content-between gap-2"><span class="text-white">Modal header (demo)</span><button type="button" class="btn-close btn-close-white" aria-label="Close dialog"></button></div></div>
<div class="l-demo l-actions flex-wrap gap-2 align-items-center"><span class="chip theme-secondary">Filters<button type="button" class="chip-dismiss" aria-label="Remove Filters" @click="showToast('Chip removed','info')"></button></span></div>
${note}<details v-show="!embedded" class="kit-code"><summary>Copy implementation markup</summary><pre><code>&lt;button type="button" class="btn-close" aria-label="Close"&gt;&lt;/button&gt;</code></pre></details></section>`,
)

replaceSection(
  'collapse',
  `<section id="collapse" class="kit-section" v-show="showSection('collapse') && (!catalogSearch || &quot;collapse&quot;.includes(catalogSearch.toLowerCase()))"><h2>Collapse</h2><p>Toggle blocks with a button trigger. Below uses Vue state; production can use Bootstrap collapse JS with <code>data-bs-toggle="collapse"</code>.</p>
<div class="l-demo">
  <button type="button" class="btn-solid theme-primary mb-2" :aria-expanded="collapseMain" @click="collapseMain=!collapseMain">{{ collapseMain ? 'Hide' : 'Show' }} delivery details</button>
  <div class="collapse" :class="{ show: collapseMain }"><div class="card card-body">Region, carrier, and tracking tokens attach to this shipment.</div></div>
</div>
<div class="l-demo">
  <a href="#" class="btn-link mb-2" role="button" :aria-expanded="collapseHoriz" @click.prevent="collapseHoriz=!collapseHoriz">Toggle horizontal panel</a>
  <div class="collapse collapse-horizontal" :class="{ show: collapseHoriz }" style="min-height:6rem"><div class="card card-body" style="width:14rem">Horizontal collapse content</div></div>
</div>
<div class="l-demo">
  <button type="button" class="btn-outline theme-secondary me-2" :aria-expanded="collapseMultiA" @click="collapseMultiA=!collapseMultiA">Target A</button>
  <button type="button" class="btn-outline theme-secondary mb-2" :aria-expanded="collapseMultiB" @click="collapseMultiB=!collapseMultiB">Target B</button>
  <div id="mg-col-a" class="collapse" :class="{ show: collapseMultiA }"><div class="card card-body mb-2">Panel A — independent state.</div></div>
  <div id="mg-col-b" class="collapse" :class="{ show: collapseMultiB }"><div class="card card-body">Panel B — independent state.</div></div>
</div>
${note}<details v-show="!embedded" class="kit-code"><summary>Copy implementation markup</summary><pre><code>&lt;button data-bs-toggle="collapse" data-bs-target="#panel"&gt;Toggle&lt;/button&gt;
&lt;div class="collapse" id="panel"&gt;&lt;div class="card card-body"&gt;…&lt;/div&gt;&lt;/div&gt;</code></pre></details></section>`,
)

if (!s.includes('id="chips"')) {
  const insertBefore = '<section id="close-button"'
  const chipsSection = `<section id="chips" class="kit-section" v-show="showSection('chips') && (!catalogSearch || &quot;chips&quot;.includes(catalogSearch.toLowerCase()))"><h2>Chips</h2><p>Compact filters and metadata. Pair text with color; do not rely on hue alone.</p>
<div class="l-demo l-actions flex-wrap gap-2 align-items-center">
  <span class="chip">Default</span>
  <span class="chip theme-primary">Primary</span>
  <span class="chip theme-secondary">Secondary</span>
  <span class="chip theme-success">Success</span>
  <span class="chip theme-warning">Warning</span>
  <span class="chip theme-danger">Danger</span>
  <span class="chip theme-info">Info</span>
</div>
<div class="l-demo l-actions flex-wrap gap-2">
  <button v-for="item in ['Design','Code','Preview']" :key="item" type="button" class="chip" :class="{ active: chipActive===item }" @click="chipActive=item">{{ item }}</button>
</div>
<div class="l-demo l-actions flex-wrap gap-2 align-items-center">
  <span class="chip theme-secondary"><span class="chip-icon" aria-hidden="true">★</span> Starred</span>
  <span class="chip theme-success active">Selected</span>
  <span class="chip">Draft<button type="button" class="chip-dismiss" aria-label="Remove Draft" @click="showToast('Chip removed','info')"></button></span>
</div>
${note}<details v-show="!embedded" class="kit-code"><summary>Copy implementation markup</summary><pre><code>&lt;span class="chip theme-primary"&gt;Primary&lt;/span&gt;</code></pre></details></section>
`
  s = s.replace(insertBefore, chipsSection + insertBefore)
}

if (!s.includes('id="nav-overflow"')) {
  const insertBefore = '<section id="navbar-and-footer"'
  const block = `<section id="nav-overflow" class="kit-section" v-show="showSection('nav-overflow') && (!catalogSearch || &quot;nav overflow&quot;.includes(catalogSearch.toLowerCase()))"><h2>Nav overflow</h2><p>Scroll excess nav links horizontally while keeping focus visible.</p>
<div class="l-demo"><nav class="nav nav-pills flex-nowrap overflow-auto gap-1" aria-label="Overflow nav"><a class="nav-link active" href="#">Overview</a><a class="nav-link" href="#">Revenue</a><a class="nav-link" href="#">Costs</a><a class="nav-link" href="#">Margins</a><a class="nav-link" href="#">Forecasts</a><a class="nav-link" href="#">Regions</a></nav></div>
${note}<details v-show="!embedded" class="kit-code"><summary>Copy implementation markup</summary><pre><code>&lt;nav class="nav nav-pills flex-nowrap overflow-auto"&gt;…&lt;/nav&gt;</code></pre></details></section>
`
  if (s.includes(insertBefore)) s = s.replace(insertBefore, block + insertBefore)
}

if (!s.includes('id="toggler"')) {
  const insertBefore = '<section id="tooltips"'
  const block = `<section id="toggler" class="kit-section" v-show="showSection('toggler') && (!catalogSearch || &quot;toggler&quot;.includes(catalogSearch.toLowerCase()))"><h2>Toggler</h2><p>Navbar togglers expand collapsed navigation on small screens.</p>
<div class="l-demo"><button class="btn btn-outline theme-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#mg-nav-collapse" aria-controls="mg-nav-collapse" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="collapse mt-2" id="mg-nav-collapse"><div class="card card-body py-2">Collapsed nav region</div></div></div>
${note}<details v-show="!embedded" class="kit-code"><summary>Copy implementation markup</summary><pre><code>&lt;button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav"&gt;…&lt;/button&gt;</code></pre></details></section>
`
  if (s.includes(insertBefore)) s = s.replace(insertBefore, block + insertBefore)
}

// Carousel: drop cross-page transition that flashes on client nav in docs shell
s = s.replace(
  /<Transition name="tpl-content" mode="out-in"><article :key="slide" class="card"/g,
  '<article :key="slide" class="card"',
)
s = s.replace(/<\/article><\/Transition><button class="btn-outline theme-secondary" aria-label="Next slide"/g, '</article><button class="btn-outline theme-secondary" aria-label="Next slide"')

replaceSection(
  'modal',
  `<section id="modal" class="kit-section" v-show="showSection('modal') && (!catalogSearch || &quot;modal&quot;.includes(catalogSearch.toLowerCase()))"><h2>Modal</h2><p>Bootstrap modals block the page, trap focus, and dismiss with Escape, backdrop click, or <code>btn-close</code>.</p>
<div class="l-demo l-actions flex-wrap gap-2">
  <button type="button" class="btn-solid theme-primary" @click="mgModal='default'">Default modal</button>
  <button type="button" class="btn-outline theme-secondary" @click="mgModal='centered'">Vertically centered</button>
  <button type="button" class="btn-outline theme-secondary" @click="mgModal='lg'">Large</button>
</div>
<div v-if="mgModal" class="modal-backdrop fade show" aria-hidden="true" @click="mgModal=''"></div>
<div class="modal fade" id="mg-modal-default" tabindex="-1" :class="{ show: mgModal === 'default' }" :style="mgModal === 'default' ? { display: 'block' } : undefined" aria-labelledby="mg-modal-default-title" :aria-hidden="mgModal !== 'default'">
  <div class="modal-dialog"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title" id="mg-modal-default-title">Confirm archive</h5><button type="button" class="btn-close" aria-label="Close" @click="mgModal=''"></button></div>
    <div class="modal-body"><p class="mb-0">This demo does not change production data.</p></div>
    <div class="modal-footer"><button type="button" class="btn-outline theme-secondary" @click="mgModal=''">Cancel</button><button type="button" class="btn-solid theme-danger" @click="mgModal=''">Archive</button></div>
  </div></div>
</div>
<div class="modal fade" id="mg-modal-centered" tabindex="-1" :class="{ show: mgModal === 'centered' }" :style="mgModal === 'centered' ? { display: 'block' } : undefined" :aria-hidden="mgModal !== 'centered'">
  <div class="modal-dialog modal-dialog-centered"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title">Centered dialog</h5><button type="button" class="btn-close" aria-label="Close" @click="mgModal=''"></button></div>
    <div class="modal-body">Vertically centered in the viewport.</div>
  </div></div>
</div>
<div class="modal fade" id="mg-modal-lg" tabindex="-1" :class="{ show: mgModal === 'lg' }" :style="mgModal === 'lg' ? { display: 'block' } : undefined" :aria-hidden="mgModal !== 'lg'">
  <div class="modal-dialog modal-lg modal-dialog-scrollable"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title">Large scrollable</h5><button type="button" class="btn-close" aria-label="Close" @click="mgModal=''"></button></div>
    <div class="modal-body"><p v-for="n in 6" :key="n">Scrollable body copy block {{ n }}.</p></div>
  </div></div>
</div>
${note}<details v-show="!embedded" class="kit-code"><summary>Copy implementation markup</summary><pre><code>&lt;button data-bs-toggle="modal" data-bs-target="#id"&gt;Open&lt;/button&gt;</code></pre></details></section>`,
)

replaceSection(
  'list-group',
  `<section id="list-group" class="kit-section" v-show="showSection('list-group') && (!catalogSearch || &quot;list group&quot;.includes(catalogSearch.toLowerCase()))"><h2>List group</h2><p>Flexible lists of links, buttons, and static rows with contextual variants.</p>
<div class="l-demo vstack gap-3">
<div><p class="small text-body-secondary mb-1">Basic</p><ul class="list-group"><li class="list-group-item">Surface tokens</li><li class="list-group-item active" aria-current="true">Active item</li><li class="list-group-item disabled" aria-disabled="true">Disabled item</li></ul></div>
<div><p class="small text-body-secondary mb-1">Links and buttons</p><div class="list-group"><a href="#" class="list-group-item list-group-item-action" @click.prevent>Show dashboard</a><button type="button" class="list-group-item list-group-item-action">Settings</button><a href="#" class="list-group-item list-group-item-action active" @click.prevent>Active link</a></div></div>
<div><p class="small text-body-secondary mb-1">Flush</p><ul class="list-group list-group-flush"><li class="list-group-item">No outer border</li><li class="list-group-item">Flush second</li></ul></div>
<div><p class="small text-body-secondary mb-1">Numbered</p><ol class="list-group list-group-numbered"><li class="list-group-item">First</li><li class="list-group-item">Second</li><li class="list-group-item">Third</li></ol></div>
<div><p class="small text-body-secondary mb-1">Horizontal (md breakpoint)</p><ul class="list-group md:list-group-horizontal"><li class="list-group-item">One</li><li class="list-group-item">Two</li><li class="list-group-item">Three</li></ul></div>
<div><p class="small text-body-secondary mb-1">Contextual</p><ul class="list-group"><li class="list-group-item theme-primary">Primary</li><li class="list-group-item theme-success">Success</li><li class="list-group-item theme-danger">Danger</li><li class="list-group-item theme-warning">Warning</li></ul></div>
<div><p class="small text-body-secondary mb-1">With badges</p><ul class="list-group"><li class="list-group-item d-flex justify-content-between align-items-center">Inbox <span class="badge text-bg-primary rounded-pill">12</span></li><li class="list-group-item d-flex justify-content-between align-items-center">Review <span class="badge text-bg-warning rounded-pill">3</span></li></ul></div>
<div><p class="small text-body-secondary mb-1">Custom content</p><div class="list-group"><a href="#" class="list-group-item list-group-item-action active" @click.prevent><div class="d-flex w-100 justify-content-between"><h6 class="mb-1">Northstar</h6><small>3 days</small></div><p class="mb-1">Margin forecast refresh</p><small>Ops workspace</small></a></div></div>
<div><p class="small text-body-secondary mb-1">Checkboxes and radios</p><ul class="list-group"><li class="list-group-item"><input class="form-check-input me-2" type="checkbox" checked id="lg-chk1"><label class="form-check-label stretched-link" for="lg-chk1">Include tax</label></li><li class="list-group-item"><input class="form-check-input me-2" type="radio" name="lg-rad" id="lg-r1" checked><label class="form-check-label" for="lg-r1">Comfortable</label></li><li class="list-group-item"><input class="form-check-input me-2" type="radio" name="lg-rad" id="lg-r2"><label class="form-check-label" for="lg-r2">Compact</label></li></ul></div>
<div><p class="small text-body-secondary mb-1">Tab behavior (demo)</p><div class="list-group" role="tablist"><button type="button" class="list-group-item list-group-item-action" :class="{ active: listTab==='home' }" role="tab" :aria-selected="listTab==='home'" @click="listTab='home'">Home</button><button type="button" class="list-group-item list-group-item-action" :class="{ active: listTab==='profile' }" role="tab" :aria-selected="listTab==='profile'" @click="listTab='profile'">Profile</button></div><p class="mt-2 mb-0 small" role="tabpanel">{{ listTab === 'home' ? 'Home panel content' : 'Profile panel content' }}</p></div>
</div>
${note}<details v-show="!embedded" class="kit-code"><summary>Copy implementation markup</summary><pre><code>&lt;ul class="list-group"&gt;&lt;li class="list-group-item"&gt;…&lt;/li&gt;&lt;/ul&gt;</code></pre></details></section>`,
)

replaceSection(
  'navs-tabs',
  `<section id="navs-tabs" class="kit-section" v-show="showSection('navs-tabs') && (!catalogSearch || &quot;navs &amp; tabs&quot;.includes(catalogSearch.toLowerCase()))"><h2>Navs &amp; tabs</h2><p>Bootstrap navs structure lists of links. Pair visual style (<code>nav-tabs</code>, <code>nav-pills</code>, <code>nav-underline</code>) with keyboard focus and current-page state.</p>
<div class="l-demo vstack gap-3">
<div><p class="small text-body-secondary mb-1">Base nav (<code>ul</code>)</p><ul class="nav"><li class="nav-item"><a class="nav-link active" aria-current="page" href="#" @click.prevent>Active</a></li><li class="nav-item"><a class="nav-link" href="#" @click.prevent>Link</a></li><li class="nav-item"><a class="nav-link" href="#" @click.prevent>Link</a></li><li class="nav-item"><span class="nav-link disabled" aria-disabled="true">Disabled</span></li></ul><details v-show="!embedded" class="kit-code mt-2"><summary>Copy base <code>ul</code> nav</summary><pre><code>&lt;ul class="nav"&gt;&lt;li class="nav-item"&gt;&lt;a class="nav-link active" href="#"&gt;Active&lt;/a&gt;&lt;/li&gt;&lt;/ul&gt;</code></pre></details></div>
<div><p class="small text-body-secondary mb-1">Base nav (<code>nav</code> element)</p><nav class="nav" aria-label="Example nav"><a class="nav-link active" href="#" @click.prevent>Active</a><a class="nav-link" href="#" @click.prevent>Link</a><a class="nav-link disabled" aria-disabled="true" tabindex="-1">Disabled</a></nav><details v-show="!embedded" class="kit-code mt-2"><summary>Copy <code>nav</code> element</summary><pre><code>&lt;nav class="nav"&gt;&lt;a class="nav-link active" href="#"&gt;Active&lt;/a&gt;&lt;/nav&gt;</code></pre></details></div>
<div><p class="small text-body-secondary mb-1">Horizontal alignment</p><ul class="nav justify-content-center mb-2"><li class="nav-item"><a class="nav-link active" href="#" @click.prevent>Center</a></li><li class="nav-item"><a class="nav-link" href="#" @click.prevent>Nav</a></li></ul><ul class="nav justify-content-end"><li class="nav-item"><a class="nav-link active" href="#" @click.prevent>End</a></li><li class="nav-item"><a class="nav-link" href="#" @click.prevent>Nav</a></li></ul><details v-show="!embedded" class="kit-code mt-2"><summary>Copy alignment</summary><pre><code>&lt;ul class="nav justify-content-center"&gt;…&lt;/ul&gt;</code></pre></details></div>
<div><p class="small text-body-secondary mb-1">Vertical</p><ul class="nav flex-column"><li class="nav-item"><a class="nav-link active" href="#" @click.prevent>Active</a></li><li class="nav-item"><a class="nav-link" href="#" @click.prevent>Link</a></li><li class="nav-item"><a class="nav-link" href="#" @click.prevent>Link</a></li></ul><details v-show="!embedded" class="kit-code mt-2"><summary>Copy vertical</summary><pre><code>&lt;ul class="nav flex-column"&gt;…&lt;/ul&gt;</code></pre></details></div>
<div><p class="small text-body-secondary mb-1">Tabs</p><ul class="nav nav-tabs" role="tablist"><li class="nav-item" role="presentation"><button type="button" class="nav-link" :class="{ active: navPane==='home' }" role="tab" :aria-selected="navPane==='home'" @click="navPane='home'">Home</button></li><li class="nav-item" role="presentation"><button type="button" class="nav-link" :class="{ active: navPane==='profile' }" role="tab" :aria-selected="navPane==='profile'" @click="navPane='profile'">Profile</button></li><li class="nav-item" role="presentation"><button type="button" class="nav-link disabled" disabled tabindex="-1">Disabled</button></li></ul><details v-show="!embedded" class="kit-code mt-2"><summary>Copy tabs</summary><pre><code>&lt;ul class="nav nav-tabs" role="tablist"&gt;…&lt;/ul&gt;</code></pre></details></div>
<div><p class="small text-body-secondary mb-1">Pills</p><ul class="nav nav-pills gap-1"><li class="nav-item"><a class="nav-link active" href="#" @click.prevent>Active</a></li><li class="nav-item"><a class="nav-link" href="#" @click.prevent>Link</a></li><li class="nav-item"><a class="nav-link" href="#" @click.prevent>Link</a></li></ul><details v-show="!embedded" class="kit-code mt-2"><summary>Copy pills</summary><pre><code>&lt;ul class="nav nav-pills"&gt;…&lt;/ul&gt;</code></pre></details></div>
<div><p class="small text-body-secondary mb-1">Underline</p><ul class="nav nav-underline"><li class="nav-item"><a class="nav-link active" href="#" @click.prevent>Active</a></li><li class="nav-item"><a class="nav-link" href="#" @click.prevent>Link</a></li><li class="nav-item"><a class="nav-link" href="#" @click.prevent>Link</a></li></ul><details v-show="!embedded" class="kit-code mt-2"><summary>Copy underline</summary><pre><code>&lt;ul class="nav nav-underline"&gt;…&lt;/ul&gt;</code></pre></details></div>
<div><p class="small text-body-secondary mb-1">Fill and justify</p><ul class="nav nav-pills nav-fill mb-2"><li class="nav-item"><a class="nav-link active" href="#" @click.prevent>Fill active</a></li><li class="nav-item"><a class="nav-link" href="#" @click.prevent>Longer nav link</a></li><li class="nav-item"><a class="nav-link" href="#" @click.prevent>Link</a></li></ul><ul class="nav nav-tabs nav-justified"><li class="nav-item"><a class="nav-link active" href="#" @click.prevent>Justified</a></li><li class="nav-item"><a class="nav-link" href="#" @click.prevent>Wider item</a></li><li class="nav-item"><a class="nav-link" href="#" @click.prevent>Link</a></li></ul><details v-show="!embedded" class="kit-code mt-2"><summary>Copy fill / justify</summary><pre><code>&lt;ul class="nav nav-pills nav-fill"&gt;…&lt;/ul&gt;</code></pre></details></div>
<div><p class="small text-body-secondary mb-1">Responsive flex</p><ul class="nav nav-pills flex-column flex-sm-row gap-sm-2"><li class="nav-item"><a class="nav-link active" href="#" @click.prevent>Stacked on xs</a></li><li class="nav-item"><a class="nav-link" href="#" @click.prevent>Row on sm+</a></li><li class="nav-item"><a class="nav-link" href="#" @click.prevent>Link</a></li></ul><details v-show="!embedded" class="kit-code mt-2"><summary>Copy responsive flex</summary><pre><code>&lt;ul class="nav flex-column flex-sm-row"&gt;…&lt;/ul&gt;</code></pre></details></div>
<div><p class="small text-body-secondary mb-1">Tabs with dropdown</p><ul class="nav nav-tabs"><li class="nav-item"><a class="nav-link active" href="#" @click.prevent>Active</a></li><li class="nav-item dropdown"><a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</a><ul class="dropdown-menu"><li><a class="dropdown-item" href="#" @click.prevent>Action</a></li><li><a class="dropdown-item" href="#" @click.prevent>Another</a></li></ul></li><li class="nav-item"><a class="nav-link" href="#" @click.prevent>Link</a></li></ul><details v-show="!embedded" class="kit-code mt-2"><summary>Copy tabs + dropdown</summary><pre><code>&lt;li class="nav-item dropdown"&gt;&lt;a class="nav-link dropdown-toggle" data-bs-toggle="dropdown"&gt;…&lt;/a&gt;&lt;/li&gt;</code></pre></details></div>
<div><p class="small text-body-secondary mb-1">Pills with dropdown</p><ul class="nav nav-pills"><li class="nav-item"><a class="nav-link" href="#" @click.prevent>Link</a></li><li class="nav-item dropdown"><a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Menu</a><ul class="dropdown-menu"><li><a class="dropdown-item" href="#" @click.prevent>Item</a></li></ul></li><li class="nav-item"><a class="nav-link active" href="#" @click.prevent>Active</a></li></ul></div>
<div><p class="small text-body-secondary mb-1">Tab panes (demo)</p><ul class="nav nav-tabs mb-2" role="tablist"><li class="nav-item"><button type="button" class="nav-link" :class="{ active: navPane==='home' }" @click="navPane='home'">Home</button></li><li class="nav-item"><button type="button" class="nav-link" :class="{ active: navPane==='profile' }" @click="navPane='profile'">Profile</button></li><li class="nav-item"><button type="button" class="nav-link" :class="{ active: navPane==='contact' }" @click="navPane='contact'">Contact</button></li></ul><div class="tab-content border rounded p-3 mg-nav-tabpanel"><div class="tab-pane fade" :class="{ show: navPane==='home', active: navPane==='home' }" role="tabpanel">Home pane — workspace overview.</div><div class="tab-pane fade" :class="{ show: navPane==='profile', active: navPane==='profile' }" role="tabpanel">Profile pane — account settings.</div><div class="tab-pane fade" :class="{ show: navPane==='contact', active: navPane==='contact' }" role="tabpanel">Contact pane — support channels.</div></div><details v-show="!embedded" class="kit-code mt-2"><summary>Copy tab panes</summary><pre><code>&lt;div class="tab-content"&gt;&lt;div class="tab-pane fade show active"&gt;…&lt;/div&gt;&lt;/div&gt;</code></pre></details></div>
</div>
${note}</section>`,
)

replaceSection(
  'placeholders',
  `<section id="placeholders" class="kit-section" v-show="showSection('placeholders') && (!catalogSearch || &quot;placeholders&quot;.includes(catalogSearch.toLowerCase()))"><h2>Placeholders</h2><p>Skeleton blocks while content loads. Use <code>aria-hidden=&quot;true&quot;</code> on decorative loading shells and keep real text for screen readers elsewhere.</p>
<div class="l-demo vstack gap-3 mg-placeholder-demo">
<div><p class="small text-body-secondary mb-1">Card vs placeholder card</p><div class="row g-3 align-items-stretch"><div class="col-md-6"><article class="card h-100"><div class="card-img-top bg-secondary-subtle d-flex align-items-center justify-content-center text-body-secondary" style="min-height:9rem">Image</div><div class="card-body"><h3 class="h6 card-title mb-1">Northstar report</h3><p class="card-text small mb-2">Loaded content with title, copy, and action.</p><button type="button" class="btn-solid theme-primary btn-sm">Open</button></div></article></div><div class="col-md-6"><article class="card h-100" aria-hidden="true"><div class="card-img-top placeholder rounded-0 col-12" style="min-height:9rem"></div><div class="card-body placeholder-glow"><span class="placeholder col-7 mb-2 d-block"></span><span class="placeholder col-4 mb-3 d-block"></span><span class="placeholder col-12 mb-2 d-block"></span><span class="placeholder col-8 d-block"></span><span class="placeholder btn btn-primary col-4 mt-2 disabled"></span></div></article></div></div><details v-show="!embedded" class="kit-code mt-2"><summary>Copy placeholder card</summary><pre><code>&lt;div class="card" aria-hidden="true"&gt;&lt;div class="card-img-top placeholder col-12"&gt;&lt;/div&gt;…&lt;/div&gt;</code></pre></details></div>
<div><p class="small text-body-secondary mb-1">Width utilities</p><div class="vstack gap-2"><span class="placeholder col-12"></span><span class="placeholder col-9"></span><span class="placeholder col-6"></span><span class="placeholder col-4"></span></div><details v-show="!embedded" class="kit-code mt-2"><summary>Copy widths</summary><pre><code>&lt;span class="placeholder col-7"&gt;&lt;/span&gt;</code></pre></details></div>
<div><p class="small text-body-secondary mb-1">Colors</p><div class="vstack gap-2"><span class="placeholder col-10 bg-primary"></span><span class="placeholder col-10 bg-secondary"></span><span class="placeholder col-10 bg-success"></span><span class="placeholder col-10 bg-danger"></span><span class="placeholder col-10 bg-warning"></span><span class="placeholder col-10 bg-info"></span></div><details v-show="!embedded" class="kit-code mt-2"><summary>Copy colors</summary><pre><code>&lt;span class="placeholder col-12 bg-primary"&gt;&lt;/span&gt;</code></pre></details></div>
<div><p class="small text-body-secondary mb-1">Sizes</p><div class="vstack gap-2"><span class="placeholder placeholder-xs col-10">xs</span><span class="placeholder placeholder-sm col-10">sm</span><span class="placeholder col-10">default</span><span class="placeholder placeholder-lg col-10">lg</span></div><details v-show="!embedded" class="kit-code mt-2"><summary>Copy sizes</summary><pre><code>&lt;span class="placeholder placeholder-lg col-8"&gt;&lt;/span&gt;</code></pre></details></div>
<div><p class="small text-body-secondary mb-1">Glow animation</p><p class="placeholder-glow mb-0"><span class="placeholder col-12 mb-2"></span><span class="placeholder col-10 mb-2"></span><span class="placeholder col-8"></span></p><details v-show="!embedded" class="kit-code mt-2"><summary>Copy glow</summary><pre><code>&lt;p class="placeholder-glow"&gt;&lt;span class="placeholder col-12"&gt;&lt;/span&gt;&lt;/p&gt;</code></pre></details></div>
<div><p class="small text-body-secondary mb-1">Pulse animation</p><div class="placeholder-pulse"><span class="placeholder col-12 mb-2 d-block"></span><span class="placeholder col-7 d-block"></span></div></div>
<div><p class="small text-body-secondary mb-1">Wave animation</p><span class="placeholder col-12 placeholder-wave d-block mb-2"></span><span class="placeholder col-8 placeholder-wave d-block"></span><details v-show="!embedded" class="kit-code mt-2"><summary>Copy wave</summary><pre><code>&lt;span class="placeholder col-12 placeholder-wave"&gt;&lt;/span&gt;</code></pre></details></div>
<div class="mg-demo-surface-dark rounded p-3"><p class="small text-white-50 mb-1">Dark surface</p><p class="placeholder-glow mb-0"><span class="placeholder col-11 mb-2"></span><span class="placeholder col-8"></span></p></div>
</div>
${note}</section>`,
)

replaceSection(
  'badge',
  `<section id="badge" class="kit-section" v-show="showSection('badge') && (!catalogSearch || &quot;badge&quot;.includes(catalogSearch.toLowerCase()))"><h2>Badge</h2><p>Short labels — always pair with text; never rely on color alone.</p>
<div class="l-demo vstack gap-3 mg-badge-demo">
<div><p class="small text-body-secondary mb-2">Colors</p><div class="d-flex flex-wrap gap-2 align-items-center"><span class="badge text-bg-primary">Primary</span><span class="badge text-bg-secondary">Secondary</span><span class="badge text-bg-success">Success</span><span class="badge text-bg-danger">Danger</span><span class="badge text-bg-warning">Warning</span><span class="badge text-bg-info">Info</span><span class="badge text-bg-light">Light</span><span class="badge text-bg-dark">Dark</span></div></div>
<div><p class="small text-body-secondary mb-2">Pill</p><div class="d-flex flex-wrap gap-2"><span class="badge rounded-pill text-bg-primary">12</span><span class="badge rounded-pill text-bg-success">Ready</span></div></div>
<div><p class="small text-body-secondary mb-2">Headings</p><h2>Example <span class="badge text-bg-secondary">New</span></h2><h4>Section <span class="badge text-bg-info">Beta</span></h4></div>
<div><p class="small text-body-secondary mb-2">Inside buttons</p><button type="button" class="btn btn-solid theme-primary position-relative">Inbox <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger">9</span></button><button type="button" class="btn btn-outline theme-secondary">Profile <span class="badge text-bg-warning ms-1">3</span></button></div>
<div class="position-relative d-inline-block border rounded p-4"><span class="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger">99+</span>Positioned badge anchor</div>
</div>
${note}<details v-show="!embedded" class="kit-code"><summary>Copy badge markup</summary><pre><code>&lt;span class="badge text-bg-primary"&gt;Primary&lt;/span&gt;</code></pre></details></section>`,
)

replaceSection(
  'card',
  `<section id="card" class="kit-section" v-show="showSection('card') && (!catalogSearch || &quot;card&quot;.includes(catalogSearch.toLowerCase()))"><h2>Card</h2><p>Summaries with header, body, and footer actions.</p>
<div class="l-demo"><div class="row g-3"><div class="col-md-6"><div class="card h-100"><div class="card-header">Featured</div><div class="card-body"><h3 class="h6 card-title">Review changes</h3><p class="card-text small">The latest request is waiting for your review.</p></div><div class="card-footer d-flex justify-content-between align-items-center gap-2"><span class="badge text-bg-warning">Needs review</span><button type="button" class="btn btn-sm btn-outline theme-secondary" @click="showToast('Open')">Open</button></div></div></div><div class="col-md-6"><div class="card h-100 border-success"><div class="card-body"><p class="text-success small mb-1">TASK · 024</p><h3 class="h6 card-title">Ready to ship</h3><p class="card-text small">Checks completed. The next step is a merge.</p></div><div class="card-footer"><button type="button" class="btn btn-sm btn-solid theme-primary">Continue</button></div></div></div></div></div>
${note}<details v-show="!embedded" class="kit-code"><summary>Copy card markup</summary><pre><code>&lt;div class="card"&gt;&lt;div class="card-body"&gt;…&lt;/div&gt;&lt;div class="card-footer"&gt;…&lt;/div&gt;&lt;/div&gt;</code></pre></details></section>`,
)

replaceSection(
  'chips',
  `<section id="chips" class="kit-section" v-show="showSection('chips') && (!catalogSearch || &quot;chips&quot;.includes(catalogSearch.toLowerCase()))"><h2>Chips</h2><p>Compact filters and metadata. Pair text with color; do not rely on hue alone.</p>
<div class="l-demo vstack gap-3">
<div class="d-flex flex-wrap gap-2 align-items-center"><span class="chip">Default</span><span class="chip theme-primary">Primary</span><span class="chip theme-secondary">Secondary</span><span class="chip theme-success">Success</span><span class="chip theme-warning">Warning</span><span class="chip theme-danger">Danger</span><span class="chip theme-info">Info</span></div>
<div class="d-flex flex-wrap gap-2"><button v-for="item in ['Design','Code','Preview']" :key="item" type="button" class="chip" :class="{ active: chipActive===item }" @click="chipActive=item">{{ item }}</button></div>
<div class="d-flex flex-wrap gap-2 align-items-center"><span class="chip theme-secondary"><span class="chip-icon" aria-hidden="true">★</span> Starred</span><span class="chip active">Selected</span><span class="chip">Draft<button type="button" class="chip-dismiss" aria-label="Remove Draft" @click="showToast('Chip removed','info')"></button></span></div>
</div>
${note}<details v-show="!embedded" class="kit-code"><summary>Copy chip markup</summary><pre><code>&lt;button type="button" class="chip active"&gt;Design&lt;/button&gt;</code></pre></details></section>`,
)

// Alerts: use btn-close + more variants
replaceSection(
  'alerts',
  `<section id="alerts" class="kit-section" v-show="showSection('alerts') && (!catalogSearch || &quot;alerts&quot;.includes(catalogSearch.toLowerCase()))"><h2>Alerts</h2><p>Alerts occupy the page and stay until dismissed. Pair severity with text — not color alone.</p>
<div class="l-demo vstack gap-2 mg-alert-demo">
<div class="alert theme-primary mg-bs6-alert" role="alert"><h4 class="alert-heading">Primary</h4><p class="mb-1">Neutral workspace update.</p><a href="#" class="alert-link" @click.prevent>Show details</a></div>
<div class="alert theme-success mg-bs6-alert" role="alert"><p class="mb-0"><strong>Saved.</strong> Your changes are up to date.</p></div>
<div class="alert theme-warning alert-dismissible fade show mg-bs6-alert" role="alert"><div class="mg-alert-text"><p class="mb-0"><strong>Needs attention.</strong> Two checks are waiting for review.</p></div><button type="button" class="btn-close" aria-label="Close" @click="showToast('Warning dismissed','warn')"></button></div>
<div class="alert theme-danger mg-bs6-alert" role="alert"><p class="mb-0"><strong>Blocked.</strong> Fix validation errors before continuing.</p></div>
<div class="alert theme-info mg-bs6-alert" role="alert"><p class="mb-0"><strong>Info.</strong> Scheduled maintenance tonight.</p></div>
<div class="alert theme-secondary mg-bs6-alert" role="alert"><p class="mb-0">Secondary surface message.</p></div>
</div>
${note}<details v-show="!embedded" class="kit-code"><summary>Copy implementation markup</summary><pre><code>&lt;div class="alert theme-success" role="alert"&gt;…&lt;/div&gt;</code></pre></details></section>`,
)

fs.writeFileSync(out, s)
console.log('Patched', out)