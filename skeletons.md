---
pageClass: skeleton-guide
---
<script setup>
import SkeletonUsageDemo from './.vitepress/theme/SkeletonUsageDemo.vue'
</script>

# Placeholders and skeletons

A skeleton reserves space for content that is loading. Its shape hints at the layout, not the final data. A placeholder can also be a static visual specimen; neither proves a request is running. Empty means there is no content, while error means loading failed. Those states need real text and recovery rather than a permanent shimmer.

## Try loading, ready, empty and error

Choose card or list shapes and change the local state. Loading shows decorative blocks with a single readable status outside the busy result region. Ready replaces the blocks with fictitious content. Empty has its own explanation. Error preserves the shape selection and offers Retry, which returns to the loading preview. Nothing completes on a timer and no request runs. Reduced motion keeps still shapes with the same status text.

<SkeletonUsageDemo />

## How to use it

1. **Reserve a useful layout.** Match major image, heading and row shapes without pretending to know exact text. Keep the final layout close enough to reduce jumps.
2. **Use real state, not elapsed animation.** Show loading only while the corresponding request is unresolved. Success, empty and error must stop the skeleton.
3. **Hide decorative blocks from assistive technology.** One status describes the operation. Do not announce every gray line or shimmer.
4. **Scope busy content.** Put aria-busy on the result region, with the live status outside it. Do not block unrelated controls.
5. **Preserve recovery.** Keep filters and user input on failure. Retry should start a new attempt, not make an endless animation look successful.
6. **Keep a still fallback.** Reduced motion removes shimmer, not the shape or loading text. Avoid fast flashes and large moving surfaces.

## Anatomy and actual API

`SkeletonUsageDemo.vue` has no props or emits. `state` starts at loading and offers ready/empty/error. `shape` starts at card and offers list. `message` derives the visible status. Both selects are local; no server, timer, storage or data fetch exists.

Card shape has an image block, title and two text lines. List shape has three avatar/title/line rows. Their wrapper is aria-hidden. The persistent role=status paragraph is outside the result section; aria-busy is true only during loading. Ready, empty and error replace the placeholder entirely. Retry changes state to loading and preserves shape. Unmount needs no request/timer cleanup because none is installed.

```vue
<script setup>
import SkeletonUsageDemo from './.vitepress/theme/SkeletonUsageDemo.vue'
</script>
<template><SkeletonUsageDemo /></template>
```

A host model might be `{ requestId: string, state: 'loading' | 'ready' | 'empty' | 'error', items: Item[], error: string | null }`. This is suggested integration data, not a package API. Derive empty only after a successful response with no items; an unresolved request is not empty.

## States and variants

| State/variant | Rule |
|---|---|
| Loading | Decorative skeleton, truthful status and scoped busy region. |
| Ready | Real content replaces shapes; announce a useful completion once. |
| Empty | Explicit no-content text, no animation. |
| Error/retry | Explain failure and recovery; preserve useful input. |
| Card/list | Major layout hints, not fake text or data. |
| Shimmer/still | Same loading meaning; reduced motion chooses still. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Lustro UI kit](/ui-kit#placeholders), [Components](/components#placeholders), [Lustro guide](/lustro/guide-components#placeholders) | Decorative .l-skeleton and adjacent Loading summary text. It is a fixed specimen, not a full loading/empty/error controller. |
| [Lustro expanded](/lustro/components-more#placeholders-and-skeletons), [Felix expanded](/felix/components-more#placeholders-and-skeletons), [Scopecraft expanded](/scopecraft/components-more#placeholders-and-skeletons) | Static placeholder/skeleton examples. Visual shapes do not establish busy state, live announcements or a request lifecycle. |
| [Lumen expanded](/lumen/components-more#placeholders-and-skeletons) | Actual gallery lives in an iframe. Do not infer its semantics from the Markdown heading alone. |
| [Felix atoms](/felix/components/atoms#skeleton) | Local DOM/CSS skeleton specimens; prose package usage is design-source guidance, not proof of installed exports. |
| Studio catalogs | Catalog has long/short .sk-skeleton blocks. Extended adds placeholder text and skeleton variants. They are visual specimens, independent of a data fetch. |
| [Bastion states](/bastion/components#states) | Empty/loading section includes explicit status saying the bars are placeholders. Keep that distinction when integrating, rather than treating decorative bars as active server work. |

This guide adds a separate manual state example. It does not silently replace existing specimens or claim one shared Skeleton prop contract across catalogs.

## Motion and accessibility

Each guide block clips a subtle shimmer that crosses in 1400ms. Reduced motion removes that moving layer entirely, keeping still blocks and the same text. A skeleton has no keyboard interaction and should not enter the Tab order. Selects and Retry are normal native controls with visible focus.

Test both shapes, all four states, Retry preserving shape, busy transitions, decorative aria-hidden content and reduced motion. Check mobile wrapping and result height. Test screen-reader announcement behavior in the target application; DOM attributes do not guarantee every browser/reader combination. Avoid repeatedly announcing identical loading messages on every polling refresh.

## Integration notes

Cancel stale requests or ignore results after operation identity changes. Reuse existing content during background refresh when that is clearer than replacing it with a skeleton. Avoid exposing private data through preview shapes or stale text. All content on this page is fictitious and local.

<style>
@media(max-width:700px){.skeleton-guide .vp-doc table,.skeleton-guide .vp-doc tbody,.skeleton-guide .vp-doc tr,.skeleton-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.skeleton-guide .vp-doc thead{display:none}.skeleton-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.skeleton-guide .vp-doc td{overflow-wrap:anywhere}.skeleton-guide .vp-doc tr{margin-bottom:12px}}
</style>
