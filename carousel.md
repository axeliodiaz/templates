---
pageClass: carousel-guide
---
<script setup>
import CarouselUsageDemo from './.vitepress/theme/CarouselUsageDemo.vue'
</script>

# Carousel

A carousel shows one item from a related sequence. Use it for optional previews when the sequence matters. Keep essential instructions, errors and primary actions outside it. A static list is often easier to scan and compare. Never make automatic rotation the only way to discover important information.

## Try controls, indicators and rotation

<CarouselUsageDemo />

The three fictitious local slides start on Overview with rotation off. Previous/Next wrap; numbered indicators choose a slide. Start rotation advances every five seconds when the pointer is outside the carousel. Hover pauses and leaving restarts a full five-second interval. Focus entering stops rotation until explicitly restarted. Manual controls also stop it. Reduced motion disables Start and turns off any active rotation; changing back does not restart automatically. No route, fetch or save occurs.

## How to use it

1. Name the carousel and each slide's position. This guide uses a named region with carousel description and a group named 1 of 3, 2 of 3 or 3 of 3.
2. Make arrows and indicators native buttons with useful names. Current indicator uses aria-current, not tab semantics without a tab keyboard model.
3. Keep focus on the control that changed the slide. Do not move focus into new content on every advance.
4. Keep rotation off initially. Offer an explicit stop control, pause on hover and stop on focus. Do not restart after focus leaves without the user's choice.
5. Use polite live updates for manual changes and turn them off during automatic rotation. Do not repeatedly announce background slides.
6. Prefer readable text and short movement. Respect both the reduced-motion CSS preference and runtime preference changes.

## Anatomy and actual API

`CarouselUsageDemo.vue` has no props or emits. `slides` contains `{ id, title, body }`; `index` starts zero. `playing`, `hovered` and `reduced` start false. `current` selects the active record. `move(delta)` wraps and stops rotation; `go(i)` chooses an index and stops rotation. `key(event)` handles Left/Right only in the controls group, not on the whole page. Native Enter/Space still activate each button.

```vue
<script setup>
import CarouselUsageDemo from './.vitepress/theme/CarouselUsageDemo.vue'
</script>
<template><CarouselUsageDemo /></template>
```

Only the current slide is mounted. Controls remain mounted and keep focus. `sync()` clears any old interval and starts a five-second interval only while playing, not hovered and not reduced. On mount, a matchMedia change listener reads the preference. Unmount clears the interval and removes that listener. There is no swipe recognizer, drag, image loading, external routing or persistence. IDs and interval configuration are local teaching data, not an installed Carousel API.

A host could use `{ slides: { id, title, description, imageUrl?, imageAlt? }[], activeIndex, rotationMs, rotationEnabled }`. Validate empty and changing datasets and clamp the active index. Treat this as suggested integration data. Give real images useful alternate text and stable dimensions; these text-only slides make no image-loading claims.

## States and variants

| State | Behavior |
|---|---|
| Manual | Default, Previous/Next/indicators or Left/Right in controls. |
| First/last | Wraps in both directions; arrows stay enabled. |
| Rotating | Five-second advance, live announcements off. |
| Hover paused | Interval cleared while pointer is inside; resumes a fresh interval on leaving if still playing. |
| Focus/manual stopped | Playing false; no automatic restart on blur. |
| Reduced motion | Animation removed and automatic rotation disabled, manual controls available. |
| Empty/loading/error | Not simulated by the fixed three-slide dataset. Provide recovery in the host rather than an empty rotating frame. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [UI kit](/ui-kit#carousel), [Lustro guide](/lustro/guide-components#carousel) | Shared ComponentCatalog has a local zero-based slide, wrapping native buttons and indicator buttons, polite content. No autoplay, pointer gesture or Left/Right controller there. Its current-dot check uses n-1. |
| [Components](/components#carousel) | Similar local three-slide example. Existing markup compares slide===n for current-dot state while click uses n-1, so its dot state is offset. This guide documents that mismatch rather than silently changing the specimen. |
| [Lustro expanded](/lustro/components-more#carousel), [Felix expanded](/felix/components-more#carousel), [Scopecraft expanded](/scopecraft/components-more#carousel) | .car/.sl styled specimens; bsx-live delegated clicks update text, gradient and active indicator. Arrows are spans and indicators are i elements, not this guide's native keyboard controls. No autoplay is established by that click controller. |
| [Lumen expanded](/lumen/components-more#carousel) | Separate linked gallery implementation; matching labels do not establish this guide's rotation, keyboard or reduced-motion state contract. |

This guide demonstrates optional rotation without claiming it already exists in every source catalog. A styled frame or Bootstrap-like class does not prove an installed library API.

## Motion, accessibility and integration

Guide slides fade and enter horizontally by 8px over 180ms. There is no exit animation or sliding track; replacement reaches final layout immediately. Reduced motion removes the entrance and blocks automatic rotation. Keep content length similar to limit layout shift. Do not put an auto-rotating carousel around inputs or controls whose removal would discard focus.

Test wrapping, indicators, current state, native Enter/Space, Left/Right scope, focus retention, rotation timing, hover pause, focus stop, reduced-motion changes, unmount and narrow wrapping. Test announcements with target assistive technology before shipping richer media. If integrating remote slides, abort stale requests and preserve stable IDs; never infer successful loading from a frame becoming visible.

<style>
@media(max-width:700px){.carousel-guide .vp-doc table,.carousel-guide .vp-doc tbody,.carousel-guide .vp-doc tr,.carousel-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.carousel-guide .vp-doc thead{display:none}.carousel-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.carousel-guide .vp-doc td{overflow-wrap:anywhere}.carousel-guide .vp-doc tr{margin-bottom:12px}}
</style>
