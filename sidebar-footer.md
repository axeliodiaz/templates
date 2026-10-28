---
pageClass: sidebar-footer-guide
---
<script setup>
import SidebarFooterUsageDemo from './.vitepress/theme/SidebarFooterUsageDemo.vue'
</script>

# Sidebar and footer

A sidebar holds persistent section navigation. Its footer holds supporting account context or help, not the main task. Use it for an application with several stable areas. For a short website header, see [Navbar and footer](/navbar-footer); for grouped destinations, see [Navigation menu](/navigation-menu).

## Try sections, footer and local destinations

<SidebarFooterUsageDemo />

Hide sections hides only the named section navigation; the fictitious account footer stays visible. Show sections restores the links. All links point to real local headings and focus them after activation. Desktop has side-by-side navigation/content; at 700px and below it stacks in normal flow. This is not a modal mobile drawer, account switcher or sign-out control.

## How to use it

1. Separate brand/header, named navigation and supporting footer. Avoid putting unrelated actions into the destination list.
2. Use anchors with real href values for navigation. Derive current-route styling from the actual router, not a last-click class.
3. Keep hide/show a native button with aria-expanded and aria-controls. Hidden links must not remain in the Tab order.
4. Give repeated instances unique target IDs. This example uses Vue useId for the navigation and content targets.
5. Keep footer account text grounded in the signed-in identity. This sample uses a clearly fictitious account, not a live identity lookup.
6. Choose responsive behavior explicitly. Stacking is simpler than a drawer; an overlay needs separate Escape, focus, scroll-lock and dismissal behavior.

## Anatomy and actual API

`SidebarFooterUsageDemo.vue` has no props or emits. `expanded` starts true and toggles only the section nav via v-show. `focus(target)` waits for nextTick and focuses the matching heading; anchors retain their native hash destination. Refs and generated IDs are instance-local. No document listeners, timers, persistence or account requests need cleanup.

```vue
<script setup>
import SidebarFooterUsageDemo from './.vitepress/theme/SidebarFooterUsageDemo.vue'
</script>
<template><SidebarFooterUsageDemo /></template>
```

Suggested host data, not a verified package export:

```ts
type SidebarLink = { id: string; label: string; href: string }
type SidebarSection = { id: string; label: string; links: SidebarLink[] }
type AccountSummary = { displayName: string; secondaryText?: string }
```

The footer is supporting content inside a sectioning element, not automatically the page-wide contentinfo landmark. Use account actions only when wired to the correct account and confirmed workflow. Hidden navigation is not authorization enforcement.

## States and variants

| State | Actual behavior |
|---|---|
| Expanded | Two navigation links visible, expanded=true. |
| Hidden sections | Nav hidden, expanded=false; footer and content remain. |
| Followed link | Real local hash and focused destination heading. |
| Wide | Two-column shell in document flow, no fixed positioning. |
| Narrow | One-column stack, no overlay or separate hamburger drawer. |
| Account menu/logout | Not implemented or simulated. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [UI kit](/ui-kit#sidebar-footer), [Lustro guide](/lustro/guide-components#sidebar-footer) | Aside contains named Sections nav, Projects/Calendar/Messaging anchors, divider and Demo workspace/Help footer. No collapse, route state, account request or responsive drawer handler. |
| [Felix sidebar](/felix/components/organisms#sidebar) | Fixed aside with Inicio/Enviar/Perfil buttons and avatar footer. Generic select-one enhancer changes on class only, not routes or content. |
| [Felix sidebar footer](/felix/components/molecules#sidebarfooter) | Static avatar, name and email specimen. No account menu, identity fetch or sign-out behavior. |

Felix prose describes Sidebar family and SidebarFooter props. The static markup/enhancer do not prove those package exports exist here. This guide adds an isolated teaching layout without copying the source's sample identity into a live-account claim.

## Motion, accessibility and checks

Revealed navigation fades and moves 3px horizontally over 160ms. Reduced motion removes the effect. Hidden navigation disappears immediately; no timer leaves hidden links active. Links/buttons retain native keyboard behavior and visible focus. Headings are focusable only programmatically, and the footer avatar is decorative because adjacent text names the example account.

Test hide/show with pointer, Enter and Space; hidden-link Tab behavior; footer visibility; real hashes and heading focus; unique IDs; reduced motion; long account labels; narrow stacking and overflow. A production drawer needs its own focus and dismissal checks. Current-route styling, saved collapse preferences and account actions are not claimed by this example.

<style>
@media(max-width:700px){.sidebar-footer-guide .vp-doc table,.sidebar-footer-guide .vp-doc tbody,.sidebar-footer-guide .vp-doc tr,.sidebar-footer-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.sidebar-footer-guide .vp-doc thead{display:none}.sidebar-footer-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.sidebar-footer-guide .vp-doc td{overflow-wrap:anywhere}.sidebar-footer-guide .vp-doc tr{margin-bottom:12px}}
</style>
