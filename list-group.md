---
pageClass: list-group-guide
---
<script setup>
import ListGroupUsageDemo from './.vitepress/theme/ListGroupUsageDemo.vue'
</script>

# List group

A list group presents related rows with consistent spacing, boundaries and optional metadata. Choose semantics from the row's job: plain list items for information, links for navigation and buttons for local actions. Styling a row as active or disabled does not supply those behaviors. A list group is not automatically a menu, tablist or listbox.

## Try actions, badges and layout

Select Overview or Activity to update a local detail and pressed state. Archive is a real disabled button. Switch bordered, flush or horizontal appearance; horizontal stacks on small screens. Filter to see matching rows or an explicit empty result. Filtering preserves the selected detail. Reset restores the defaults. The separate linked list goes to this guide's actual sections. All counts and records are fictitious; selection performs no request or navigation.

<ListGroupUsageDemo />

## How to use it

1. **Choose the row's element.** Use li for structure, a with a real destination for navigation and button for action. Do not add click handlers to static divs and call them links.
2. **Name the state correctly.** This local selection uses aria-pressed on buttons. Navigation may need aria-current=page. A true tablist or listbox needs its complete keyboard model, not just a list-group class.
3. **Keep metadata readable.** Badges need units or context. Do not encode unread status, severity or selection by color alone.
4. **Make disabled real.** Native disabled buttons cannot activate. A disabled link needs a deliberate non-navigating replacement or complete keyboard/pointer handling; a CSS disabled class alone is insufficient.
5. **Choose layout for the viewport.** Flush removes outer edges; horizontal is for short peers, with a stacked mobile fallback. Preserve readable descriptions and hit areas.
6. **Keep empty and selection separate.** A filter with no rows is not a failed load. Decide whether selected detail persists, and state that policy.

## Anatomy {#list-group-anatomy}

| Part | Purpose |
|---|---|
| List | ul/li structure for related sample sections. |
| Row control | Native button with name, pressed state and disabled behavior. |
| Supporting text | Short sample description below each label. |
| Badge | Fictitious count with a spoken unit. |
| Detail/status | Local selected record and feedback, independent of filtering. |
| Linked list | Separate real anchors to guide sections. |

## Actual data and API

`ListGroupUsageDemo.vue` has no props or emits. `items` is a fixed array of `{ id, label, count, description, disabled }`. Overview has 3 items, Activity 12 and unavailable Archive 0. `selected` starts at overview; `query` is empty; `variant` starts bordered. `filtered` matches case-insensitive label substrings. `active` derives the selected record from the original array, so filtering does not silently change detail.

Clicking an enabled button changes selected. The native disabled Archive never runs that handler. Reset restores selection, query and appearance. There is no network, timer, storage or router mutation; unmount needs no cleanup. The linked anchors use browser navigation to this page's anatomy/source headings.

```vue
<script setup>
import ListGroupUsageDemo from './.vitepress/theme/ListGroupUsageDemo.vue'
</script>
<template><ListGroupUsageDemo /></template>
```

For a dynamic host, keep stable IDs and decide what happens when the selected record is removed or disabled. A navigation record might use `{ id, label, href, current }`, not the same API as a local action record. Those are integration models, not verified package exports.

## States and variants

- **Default/selected:** native buttons with pressed true/false, visible inset accent and text.
- **Disabled:** Archive cannot activate or receive normal Tab focus.
- **Badge/supporting content:** labels retain meaning without color.
- **Bordered/flush:** same semantics, different outer boundaries.
- **Horizontal:** desktop peers, stacked on mobile; not a tablist.
- **Filtered/empty:** explicit no-match text, selected record remains visible.
- **Linked:** real anchors with normal browser navigation, separate from local selection.
- **Loading/error:** not simulated here; use truthful status and recovery if adding a service.

## Source coverage {#list-group-sources}

| Source | Actual implementation |
|---|---|
| [Lustro UI kit](/ui-kit#list-group), [Components](/components#list-group), [Lustro guide](/lustro/guide-components#list-group) | Static ul/li rows with descriptive text and badges. They are not a shared interactive selection API. |
| [Lustro expanded](/lustro/components-more#list-groups), [Felix expanded](/felix/components-more#list-groups), [Scopecraft expanded](/scopecraft/components-more#list-groups) | .lg-list/.it div specimens for active, disabled, contextual colors, badge, horizontal and flush. The bsx handler targets other anchor patterns, not these .it div rows; do not promise these specimens navigate or enforce disabled state. |
| [Lumen expanded](/lumen/components-more#list-groups) | Gallery iframe supplies the rendered examples. A heading alone does not prove a live linked-list controller. |
| [Bastion lists](/bastion/components#lists) | Native ul/li log-text specimens, no row actions. |
| Studio catalogs | Catalog shows static rich notification/list items. Extended has native action buttons, a real disabled button and local notice changes; the active class is presentation, not a selection manager. |
| [Pulsefit HTML](/pulsefit-template/components.html#list-group) | Anchor specimens use href=# and active/disabled classes, plus static contextual rows. Inspect actual navigation and disabled handling before reuse; styling is not an application destination or a native disabled anchor. |

This guide adds a separate local example. Preserve each source's tokens and actual semantics rather than assuming a universal ListGroup component API.

## Motion and accessibility

The guide changes row background over 150ms; reduced motion removes that transition. Selection/focus updates are immediate and independent of motion. Tab reaches enabled native buttons; Enter/Space selects. No custom arrow-key behavior is claimed because this is an ordinary list of buttons, not a composite widget. Linked rows keep normal link keyboard behavior.

Test selection, disabled nonactivation, badges, filter/no-match/reset, preserved detail, all appearances, mobile stacking and actual section links. Check visible focus, text wrapping and reduced motion. Do not make an entire rich row an ambiguous click target containing unrelated nested controls. Validate the intended screen-reader pattern when adapting to a menu or selection widget.

## Integration notes

Use stable keys, validate destinations, preserve useful focus after updates and do not apply stale results to a new selection. Sanitize external row text. Keep count units and unavailable reasons visible. Every record and count here is fictitious and local.

<style>
@media(max-width:700px){.list-group-guide .vp-doc table,.list-group-guide .vp-doc tbody,.list-group-guide .vp-doc tr,.list-group-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.list-group-guide .vp-doc thead{display:none}.list-group-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.list-group-guide .vp-doc td{overflow-wrap:anywhere}.list-group-guide .vp-doc tr{margin-bottom:12px}}
</style>
