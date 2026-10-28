---
pageClass: navbar-footer-guide
---
<script setup>
import NavbarFooterUsageDemo from './.vitepress/theme/NavbarFooterUsageDemo.vue'
</script>

# Navbar and footer

A navbar exposes primary destinations and the site's identity. A footer holds secondary help, legal and identity information without competing with primary navigation. Keep their navigation landmarks named differently. A mobile disclosure is not a modal and should not trap focus.

## Try desktop and mobile navigation

<NavbarFooterUsageDemo />

Overview starts selected. At viewport widths up to 700px, a native button reveals the links. Picking a primary link closes the mobile disclosure and returns focus to its button. Escape inside the header does the same. Desktop always shows the links. Crossing to desktop clears open state, so returning to mobile starts closed. Footer links stay visible at every width. These links select local sample content only; no route, server request or save happens.

## How to use it

1. Name navigation landmarks by purpose, such as Primary and Footer. Keep brand text readable and give a real brand link an actual destination.
2. Use links for destinations and a native button for the mobile disclosure. Bind expanded state and a stable controls ID; closed links must not remain in keyboard order.
3. Show the current page with aria-current=page plus a visible treatment, not color alone. The sample uses local view state rather than a router.
4. Keep keyboard order logical. Native Tab/Enter/Space works without menu arrows or role=menu. Do not copy menu roles without the full interaction model.
5. Handle closing focus. Selecting or Escape returns focus to the disclosure button here. No outside-click listener or focus trap is implemented.
6. Keep footer links useful on mobile. Let them wrap; do not clip legal or help text into a fixed-width desktop layout.

## Anatomy and actual API

`NavbarFooterUsageDemo.vue` has no props or emits. `links` is Overview/Projects/Reports; `active` starts Overview, `open` and `narrow` false. On mount, matchMedia reads max-width:700px. `resize()` updates narrow and clears open on desktop. `pick(label)` updates the local view and, on mobile, closes navigation and focuses its trigger. `escape()` closes an open menu. Unmount removes the media-query listener.

```vue
<script setup>
import NavbarFooterUsageDemo from './.vitepress/theme/NavbarFooterUsageDemo.vue'
</script>
<template><NavbarFooterUsageDemo /></template>
```

The named navigation wraps brand, disclosure and the controlled link container. Header/footer elements are inside this demonstration section, not a claim that it replaces the site's global landmarks. Instance-specific IDs are needed before mounting multiple copies. Suggested host data is `{ brand, primaryLinks: { id, label, href }[], currentRoute, footerLinks }`. These are integration fields, not installed component props. Replace preventDefault sample handlers with real, validated router destinations.

## States and variants

| State | Behavior |
|---|---|
| Desktop | Links visible, disclosure button absent. |
| Mobile closed | Button expanded false; link container hidden. |
| Mobile open | Button expanded true; links visible in a column. |
| Current page | One primary link has aria-current=page for a primary view. Help/Privacy select footer-only local views, so no primary link is current. |
| Footer | Always visible, stacked on mobile, independent from primary disclosure. |
| Loading/auth/permissions | Not simulated; do not hide access errors or infer authorization from a visible link. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [UI kit](/ui-kit#navbar-and-footer), [Components](/components#navbar-and-footer), [Lustro guide](/lustro/guide-components#navbar-and-footer) | Shared family uses navOpen, a Menu button, sample-nav-links and actual site links, plus a short footer. This guide's route-free state/focus behavior is separate. |
| [Lustro expanded](/lustro/components-more#navbar), [Felix expanded](/felix/components-more#navbar), [Scopecraft expanded](/scopecraft/components-more#navbar), [Lumen expanded](/lumen/components-more#navbar), [PulseFit](/pulsefit/components-more#navbar) | NavbarDemo theme prop chooses tokens; primary/secondary/inverted bars share active state. Primary collapses under 700px, More toggles a local dropdown, search only echoes q, and Light/Dark toggles its label. No search backend or actual route change. |
| [Pawprint](/pawprint/components#navbar) | Static brand/nav links and styled Book a visit span, not this guide's responsive disclosure controller or a confirmed booking action. |
| [Bastion](/bastion/components#nav) | Breadcrumb and sample pagination in the Navigation section, not a full responsive navbar/footer. |
| Studio catalogs | Local Sidebar / Header / Navigation shell selects tab state and renders illustrative links; do not infer this guide's mobile or footer controller. |

NavbarDemo's theme is lustro/felix/pulsefit/scopecraft/lumen, default pulsefit with fallback tokens. Its More specimen uses menu roles, but that alone does not establish roving menu keyboard support. Its fixed nb-p1 ID needs scoping for repeated instances. Native DOM and local source state are not proof of a universal installed Navbar API.

## Motion, accessibility and integration

This guide reveals links with a 4px fade over 160ms; reduced motion removes it. Closed links use hidden, not opacity alone. Existing NavbarDemo uses Motion for bar/menu entrances and checks reduced motion when animating; that source behavior is not the same as this CSS sample. The guide media listener is cleaned up on unmount.

Test mobile opening/closing, keyboard and Escape focus, primary/footer selection, current state, resize both directions, reduced motion and narrow wrapping. Before production, bind actual routes, valid permissions, localized labels and a tested focus policy for route transitions. Do not claim that a clicked sample label navigated to a real page or changed account settings.

<style>
@media(max-width:700px){.navbar-footer-guide .vp-doc table,.navbar-footer-guide .vp-doc tbody,.navbar-footer-guide .vp-doc tr,.navbar-footer-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.navbar-footer-guide .vp-doc thead{display:none}.navbar-footer-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.navbar-footer-guide .vp-doc td{overflow-wrap:anywhere}.navbar-footer-guide .vp-doc tr{margin-bottom:12px}}
</style>
