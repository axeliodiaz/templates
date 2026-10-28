---
pageClass: navigation-menu-guide
---
<script setup>
import NavigationMenuUsageDemo from './.vitepress/theme/NavigationMenuUsageDemo.vue'
</script>

# Navigation menu

A navigation menu groups destinations. Use real links for pages or sections and a disclosure when a short group should be hidden until requested. Website navigation is not automatically an application menu: do not add menu/menuitem roles unless you also implement that complete keyboard pattern.

## Try disclosure and real destinations

<NavigationMenuUsageDemo />

Overview links to the first example heading. Guide sections reveals Set up and Checks links. Those links update the local hash, close the disclosure and focus their destination heading. Escape inside an open example closes it and focuses the summary. No route, account setting or remote action is changed.

## How to use it

1. Use a named nav landmark. Choose a distinct label if the page has several navigation regions.
2. Put destinations in anchors with actual href values. Use a button or summary for opening content, not an anchor without a destination.
3. Use details/summary for this disclosure pattern. Keep focus and standard Tab/Shift+Tab behavior; do not invent arrow-key handling for ordinary links.
4. Give every local target a unique ID. This demo uses Vue useId so repeated instances do not share hashes.
5. Handle Escape and focus after closing when that behavior is promised. Do not move focus on every mouse hover.
6. Use aria-current="page" only for the actual current page, or location for a tracked in-page destination. This demo makes neither claim: a clicked hash is not a complete scrollspy.

## Anatomy and actual API

`NavigationMenuUsageDemo.vue` has no props or emits. Native details owns its open state. Refs point to the details, summary and three headings. `follow(target)` closes the disclosure and focuses the requested heading after nextTick; the anchor's default behavior still updates the hash. `escape(event)` closes only an open disclosure and restores summary focus. The key handler is on this component's section, not document. No global listeners or timers need cleanup.

```vue
<script setup>
import NavigationMenuUsageDemo from './.vitepress/theme/NavigationMenuUsageDemo.vue'
</script>
<template><NavigationMenuUsageDemo /></template>
```

Suggested host data, not an exported package contract:

```ts
type NavDestination = { id: string; label: string; href: string }
type NavGroup = { id: string; label: string; items: NavDestination[] }
```

Validate destinations and permission gates in the host. Hiding a link does not enforce access. For a router, preserve normal modified-click/new-tab behavior and route focus management; do not replace every link with a click-only state toggle.

## States and variants

| State | Actual behavior |
|---|---|
| Closed | Summary and Overview link visible; child links hidden natively. |
| Open | Two child links in normal document flow, not a floating overlay. |
| Escape | Closes open disclosure and focuses summary. |
| Followed | Hash changes; heading gets focus; disclosure closes. |
| Narrow | Navigation wraps, links remain in flow. No separate hamburger UI. |
| Outside click/hover | No automatic dismissal or opening. These are not promised behaviors. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [UI kit](/ui-kit#navigation-menu), [Lustro guide](/lustro/guide-components#navigation-menu) | Named Workspace navigation with Projects/Calendar anchors and a native Resources disclosure linking Charts/Messaging. No route-derived active state, Escape handler or outside-dismiss logic in that specimen. |
| [Felix molecules](/felix/components/molecules#navigationmenu) | Native Productos disclosure containing two buttons plus a separate Ayuda button. No destinations or navigation handlers are wired to those buttons. It is a styled specimen, not verified routing. |

Felix prose describes package exports for triggers/content/links, but its actual preview does not establish an installed API. This guide adds real local destinations and scoped Escape/focus behavior without changing the catalogs.

## Motion, accessibility and checks

The newly revealed list fades and moves 3px over 160ms; the summary background changes over 150ms. Reduced motion removes both. The example does not animate scrolling; the browser/page owns hash navigation. The list stays in flow, so it does not cover neighboring controls or require a focus trap.

Test pointer and Enter/Space disclosure, hidden links when closed, Tab order, Escape focus return, real anchor targets, heading focus, reopen, reduced motion and narrow layouts. When adapting to a floating panel, also check viewport clipping, zoom, outside-dismiss and pointer travel. Do not claim these extra behaviors from the simple in-flow example.

<style>
@media(max-width:700px){.navigation-menu-guide .vp-doc table,.navigation-menu-guide .vp-doc tbody,.navigation-menu-guide .vp-doc tr,.navigation-menu-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.navigation-menu-guide .vp-doc thead{display:none}.navigation-menu-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.navigation-menu-guide .vp-doc td{overflow-wrap:anywhere}.navigation-menu-guide .vp-doc tr{margin-bottom:12px}}
</style>
