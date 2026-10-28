---
pageClass: tabs-guide
---
<script setup>
import TabsUsageDemo from './.vitepress/theme/TabsUsageDemo.vue'
</script>

# Navs and tabs

Navigation links go to locations. Tabs switch related panels within the current view. Similar borders or pill styles do not make them the same widget. Use real links for routes and a tablist only when each tab controls an associated panel.

## Try related panels

Choose Overview, Activity or Settings. The guide uses automatic activation: horizontal Left/Right or vertical Up/Down moves focus and selects a panel. Home/End go to the first/last tab. Tab leaves the tablist for the visible panel. Change orientation with the checkbox. All content is fictitious and local.

<TabsUsageDemo />

## How to use it

1. **Choose links versus panels.** Navigation needs real href destinations and `aria-current` for the current location. Do not add tab roles to route links merely for a pill appearance.
2. **Connect each tab and panel.** Use unique IDs, `aria-controls` and `aria-labelledby`. Hide inactive panels from display and keyboard access.
3. **Keep one tab stop.** Only the selected tab has tabindex 0; others use -1. Arrow navigation moves within the tablist.
4. **Match orientation.** Left/Right for horizontal tabs, Up/Down for vertical tabs. Do not intercept page scrolling on the other axis.
5. **Choose activation deliberately.** Automatic activation fits instant local content. Slow remote panels may need manual activation with Enter/Space and a separate focused tab state.
6. **Preserve focus and context.** Do not move focus into a panel on every selection. Keep panel content understandable and provide pending/error states for real loading.

## Anatomy

| Part | Purpose |
|---|---|
| Tablist | Names the related set and exposes orientation. |
| Tab | Focusable selector with selected state and panel ID. |
| Panel | Named by its controlling tab; only the active panel is shown. |
| Focus indicator | Distinguishes keyboard focus from selection. |
| Navigation link | For another location, not a panel selector. |

## Data shape

`TabsUsageDemo.vue` has no props or emits. Its actual state:

```ts
const tabs = [
  { id: 'overview', label: 'Overview', text: 'Fictitious overview panel.' },
  { id: 'activity', label: 'Activity', text: 'Fictitious activity panel.' },
  { id: 'settings', label: 'Settings', text: 'Fictitious settings panel.' }
]
// selected: string = 'overview'
// vertical: boolean = false
```

Click assigns `selected`. The key handler wraps at the ends, supports Home/End, prevents only handled keys and focuses the newly selected tab after Vue renders. Inactive panels use `v-show`; they remain mounted but hidden. IDs use a guide-specific prefix, so scope them before rendering multiple instances. No routing, network, lazy loading or persistence exists.

Suggested application model:

```ts
type Tab = { id: string; label: string; panelId: string; disabled?: boolean }
type Orientation = 'horizontal' | 'vertical'
```

The guide has no disabled tabs. If adding them, define skip/focus behavior and recovery if the active tab disappears. This model is not a shared prop API for the catalogs.

## Usage

```vue
<div role="tablist" aria-label="Workspace views">
  <button role="tab" id="view-overview" aria-controls="panel-overview"
    :aria-selected="selected === 'overview'"
    :tabindex="selected === 'overview' ? 0 : -1"
    @click="selected = 'overview'">Overview</button>
</div>
<section role="tabpanel" id="panel-overview" aria-labelledby="view-overview"
  v-show="selected === 'overview'" tabindex="0">Overview content</section>
```

This fragment shows associations, not a complete multi-tab keyboard implementation. Import `TabsUsageDemo.vue` for the exact working guide example, including arrow/Home/End handling. Add other tabs and panels with unique IDs and the same selection logic.

For navigation instead:

```html
<nav aria-label="Workspace"><a href="/components" aria-current="page">Components</a></nav>
```

Use a real current destination, not a placeholder href. Links retain browser navigation, open-in-new-tab and history behavior.

## States and variants

- **Horizontal:** arrows move across the tablist; labels wrap without clipping essential text.
- **Vertical:** aria-orientation and keyboard axis change together. The guide retains readable narrow panels.
- **Selected / unselected:** selected tab controls the visible panel. Focus remains separately visible.
- **Pills / fill / card treatments:** visual variants do not change semantics or keyboard requirements.
- **Disabled:** a styled `.dis` link without native behavior is not a complete disabled tab implementation. Explain unavailable content.
- **Loading / empty / failed panel:** preserve tab identity and focus; show truthful status and recovery. Do not automatically select another tab because a request failed.
- **Manual activation:** needed when switching has noticeable latency; track focus separately and activate only on explicit selection. Not implemented in this automatic local demo.

## Template map

| Surface | Actual implementation |
|---|---|
| Lustro base | [Guide](/lustro/guide-components#navs-tabs), [components](/components#navs-tabs), [UI kit](/ui-kit#navs-tabs): click-select tab/button specimens and local panel. The guide example above adds explicit ID associations and roving keyboard focus; do not assume every older specimen includes them. |
| Lustro expanded | [Nav/tabs](/lustro/components-more#nav-and-tabs), [vertical/panes](/lustro/components-more#nav-vertical-and-tab-panes): visual anchors without hrefs show horizontal, pills, fill, card and vertical treatments. They do not navigate or switch real panels. |
| Felix expanded | [Nav/tabs](/felix/components-more#nav-and-tabs), [vertical/panes](/felix/components-more#nav-vertical-and-tab-panes): corresponding scoped visual specimens. |
| Lumen expanded | [Nav/tabs](/lumen/components-more#nav-and-tabs), [vertical/panes](/lumen/components-more#nav-vertical-and-tab-panes): bundled gallery links. |
| Scopecraft expanded | [Nav/tabs](/scopecraft/components-more#nav-and-tabs), [vertical/panes](/scopecraft/components-more#nav-vertical-and-tab-panes): corresponding visual specimens. |
| Felix molecules | [Tabs](/felix/components/molecules#tabs): inspect the native/static specimen independently of its design-source package prose. |
| Studio catalogs | [Relay](/relay/components), [Folio](/folio/components), [Pace](/pace/components), [Spark](/spark/components): local click-select tabs; verify full keyboard/ID wiring when adapting them. |
| Bastion / PulseFit | [Bastion tabs](/bastion/components#tabs), [PulseFit nav/tabs](/pulsefit-template/components.html#nav-tabs): template-specific treatments, not a universal API. |

## Motion and accessibility

The guide transitions tab background color over 120ms; reduced motion removes it. Content changes immediately without a sliding animation. No listeners or timers require cleanup. Focus never depends on motion.

Test arrow wrapping, Home/End, Tab exit, panel names and hidden content with keyboard and screen readers. Avoid nesting focusable controls in a tab label. Use a visible tablist name, clear selected styling and a focus outline; do not use color alone.

## Integration notes

Keep the consuming application's routing and panel state distinct. Preserve each template's scoped styles; no shared Tabs package API is established here. For asynchronous panels, cancel or ignore stale responses and preserve existing work before switching. All guide content is fictitious and nothing is saved.

<style>
.tabs-guide .vp-doc table { width:100%; table-layout:fixed }
.tabs-guide .vp-doc td, .tabs-guide .vp-doc th { overflow-wrap:anywhere }
@media(max-width:640px) {
  .tabs-guide .vp-doc table, .tabs-guide .vp-doc tbody, .tabs-guide .vp-doc tr, .tabs-guide .vp-doc td { display:block; width:100% }
  .tabs-guide .vp-doc thead { display:none }
  .tabs-guide .vp-doc tr { margin:12px 0; border:1px solid var(--vp-c-divider) }
  .tabs-guide .vp-doc td { border:0 }
  .tabs-guide .vp-doc td:first-child { font-weight:700; padding-bottom:4px }
  .tabs-guide .vp-doc td + td { padding-top:4px }
}
</style>
