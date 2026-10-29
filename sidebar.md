---
pageClass: sidebar-organism-guide
---
<script setup>
import SidebarUsageDemo from './.vitepress/theme/SidebarUsageDemo.vue'
</script>

# Sidebar

A sidebar is the application's persistent navigation frame: brand/header, grouped destinations and supporting account/footer content. It is not a tab list, menu widget or permission boundary. This focused organism guide adds local destination state and filtering; [Sidebar and footer](/sidebar-footer) covers the simpler composition and footer relationship.

## Try grouped destinations and local page state

<SidebarUsageDemo />

Choose Overview, Activity or Help to replace the local content panel and focus its heading. Filter matches destination labels without changing the current page; zero matches shows a recovery instruction. Hide navigation removes the filter/links from interaction while preserving the fictitious account footer and current content. Reset restores Overview, visible navigation and an empty filter. No real route, account or permissions change. At narrow widths the sidebar stacks in normal flow, not an overlay drawer.

## How to use it

1. Divide header, navigation sections and footer by responsibility. Keep account actions outside the primary destination list.
2. Use links for destinations and derive aria-current from actual route/content state. A last-click class alone does not prove navigation occurred.
3. Give each navigation region a useful name. Group headings clarify destinations without inventing menu keyboard behavior.
4. Treat filtering as a view over links, not a navigation or permission change. Keep current content intact when its destination is filtered out.
5. Hide controls with actual display behavior so hidden links cannot be tabbed. A collapse button needs aria-expanded and a matching controls id.
6. Choose mobile behavior explicitly. A stacked region needs no modal focus trap; an overlay drawer needs its own dismissal, focus restoration and scroll-lock contract.

## Anatomy and actual API

`SidebarUsageDemo.vue` has no props or emits. Local refs are `expanded`, `current`, `query` and `heading`; `useId()` scopes body/content ids. Fixed links have id/label/group. `visible` filters labels case-insensitively after trimming query. `go(route)` changes current, waits for DOM update and focuses the new heading. The anchors retain a destination href, but click.prevent routes only this local panel, without changing browser URL/history. This is a local navigation model, not a real router integration.

Reset restores expanded/overview/empty query. v-show hides the navigation body including its filter, while footer and content remain. Only the active destination has aria-current=page; it can be absent from the filtered view without clearing current content. There are no document listeners, timers, requests, subscriptions or stored preferences to clean up.

```vue
<script setup>
import SidebarUsageDemo from './.vitepress/theme/SidebarUsageDemo.vue'
</script>
<template><SidebarUsageDemo /></template>
```

Suggested host data, not a package API:

```ts
type SidebarDestination = {
  id: string
  label: string
  href: string
  group: string
  visible: boolean
}
// Active state should come from the host router, not a click-only flag.
```

A production router must handle direct loading, keyboard/new-tab navigation, history and refresh consistently. Authorization must be enforced independently of which links are shown. Account identity must come from the correct signed-in account; this example deliberately uses fictitious text and has no logout/switcher.

## States and layout

| State | Behavior |
|---|---|
| Overview/Activity/Help | Local content and current-link state agree; heading receives focus. |
| Filtered | Matching links only, current content preserved. |
| No matches | Recovery text; filter can be cleared. |
| Hidden navigation | Filter/links hidden, footer and content remain. |
| Wide/narrow | Two columns or normal-flow stack; no modal overlay. |
| Reset | Initial page/filter/expanded state, no server effects. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Felix Sidebar](/felix/components/organisms#sidebar) | Static aside with brand, Inicio/Enviar/Perfil buttons and avatar footer. Generic data-fx=select-one handler changes the on class only; it does not navigate, render a destination, derive current route or fetch identity. |
| [Felix SidebarFooter](/felix/components/molecules#sidebarfooter) | Separate static identity specimen. No account menu, logout or live account lookup. |
| [Sidebar and footer guide](/sidebar-footer) | Related composition with real local anchors and hide/show; distinct from this local-panel/filter controller. |

Felix prose names compound @felix/ui exports, href/icon/active and titled sections. Those are design-source usage claims, not verified installed exports or behavior of the rendered buttons. This original Vue example does not silently upgrade the source or pretend its local current state is a real URL route.

## Motion, accessibility and checks

Revealed navigation fades/moves 3px horizontally over 160ms. Reduced motion removes it. Hidden navigation disappears immediately, with no deferred timer leaving links active. Native links, buttons and search retain keyboard behavior. A changed local content heading is focused programmatically and is not an extra normal tab stop. The footer remains readable on mobile.

Test each destination, content/current-link agreement, focused heading, case/whitespace filtering, no matches, current item filtered out, collapse/hidden tab behavior, footer visibility, reset, unique ids, Enter activation, reduced motion and narrow stacking. Real hosts need separate router/history/direct-link, authorization, identity and overlay-drawer tests.

<style>
@media(max-width:700px){.sidebar-organism-guide .vp-doc table,.sidebar-organism-guide .vp-doc tbody,.sidebar-organism-guide .vp-doc tr,.sidebar-organism-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.sidebar-organism-guide .vp-doc thead{display:none}.sidebar-organism-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.sidebar-organism-guide .vp-doc td{overflow-wrap:anywhere}.sidebar-organism-guide .vp-doc tr{margin-bottom:12px}}
</style>
