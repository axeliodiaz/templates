---
pageClass: marker-guide
---
<script setup>
import MarkerUsageDemo from './.vitepress/theme/MarkerUsageDemo.vue'
</script>

# Marker

A conversation marker is a low-emphasis annotation between messages: a dated boundary or a system event. It is not a participant's [message](/message), a [badge](/badges) or a map pin. Keep it in the chronological reading order and ground any actual event or date in the conversation data rather than inventing it from presentation.

## Try an annotation in context

<MarkerUsageDemo />

Choose default, separator or border, change up to 160 characters of literal text and optionally show a decorative icon. Separator suppresses the icon and disables that choice, while preserving the preference for other variants. Empty input shows a preview placeholder. Replay new marker demonstrates an explicit entrance; changing text/variant does not replay it. Reset restores the original annotation and choices. The surrounding messages and annotation are fictitious; no routing or conversation change occurs.

## How to use it

1. Separate annotation data from participant messages. A visual divider must not claim a sender or delivery receipt it does not have.
2. Use source-backed event text. A marker saying reassigned must follow a confirmed reassignment, not a button animation.
3. For dates, group by the intended conversation timezone and retain an unambiguous date representation. This demo deliberately formats no current date or relative Today claim.
4. Keep the text readable without the icon or hairlines. Decorative graphics should be hidden from assistive technology, not become the annotation's only meaning.
5. Use native chronological DOM order. Do not make static annotations keyboard stops or fake menu buttons.
6. Animate newly inserted markers sparingly, not loaded history or every text edit. Preserve the same text when motion is reduced.

## Anatomy and actual API

`MarkerUsageDemo.vue` has no props or emits. Local refs are `variant` (default/separator/border), `text`, `icon` and `fresh`. Replay increments fresh, remounting the keyed marker; Reset restores default/original text/icon on/fresh zero. The preview uses Vue text interpolation, not HTML rendering. Two fictitious paragraphs supply message context; the marker has no click handler or sender metadata.

An aria-hidden Font Awesome branch icon appears only when icon is enabled and the variant is not separator. Separator hairlines are CSS decoration. Text wraps long unbroken tokens. The live status describes local configuration, not a new conversation event; the marker itself is not an assertive live region, progressbar or focus target. There are no timers, requests, subscriptions or global listeners to clean up.

```vue
<script setup>
import MarkerUsageDemo from './.vitepress/theme/MarkerUsageDemo.vue'
</script>
<template><MarkerUsageDemo /></template>
```

Suggested host data, not a package prop contract:

```ts
type ThreadAnnotation = {
  id: string
  kind: 'date' | 'system-event'
  text: string
  occurredAt: string
  conversationTimeZone: string
  sourceEventId?: string
}
```

A host owns event truth, date grouping, localization and access control. Use a semantic time element with a valid datetime when rendering an actual date, and choose any live-announcement policy at the conversation level to avoid duplicate announcements. A marker is not an audit log or proof of an account mutation.

## States and variants

| State/variant | Behavior |
|---|---|
| Default | Local icon/text annotation, no action. |
| Separator | Centered text between hairlines; decorative icon omitted. |
| Border | Icon/text with a bottom hairline. |
| Icon off | Text remains readable; no decorative glyph. |
| Empty | Explicit preview placeholder, not a persisted annotation. |
| Replay | Optional new-marker entrance; initial/history presentation is static. |
| Reset | Restores local controls and original fictitious annotation. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Felix Marker](/felix/components/atoms#marker) | Three static div specimens: fx-marker-default, fx-marker-sep and fx-marker-border. Actual CSS gives default a pseudo-element dot, separator two hairlines and border a bottom hairline. No event source, date grouping, click handler or actual branch icon is attached to these specimens. |
| [Felix Message](/felix/components/molecules#message) | Separate static participant-message composition. Annotation text does not inherit a sender/time/receipt contract from nearby bubbles. |

Felix prose describes default/separator/border variants and a Phosphor GitBranch icon override/null option. The rendered source uses a CSS dot rather than that icon. Package imports/props are design-source usage claims, not verified installed exports here. This guide uses an original local Vue implementation and a decorative Font Awesome branch icon, not a package adapter or a silent change to the source specimens.

## Motion, accessibility and checks

Replay moves the whole annotation 4px while fading over 180ms. Initial display and ordinary edits do not animate. Reduced motion removes that entrance. The preview has no animation-driven event state or hidden waiting process. The icon and hairlines are decorative; meaning remains in visible text.

Test three variants, icon suppression/restoration, plain-text rendering, empty and long text, chronological order, explicit replay versus edits, reset, native keyboard controls, reduced motion and narrow wrapping. A real host must separately test date/timezone boundaries, localization and trustworthy system-event provenance. Never let an illustrative annotation masquerade as a confirmed support or account action.

<style>
@media(max-width:700px){.marker-guide .vp-doc table,.marker-guide .vp-doc tbody,.marker-guide .vp-doc tr,.marker-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.marker-guide .vp-doc thead{display:none}.marker-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.marker-guide .vp-doc td{overflow-wrap:anywhere}.marker-guide .vp-doc tr{margin-bottom:12px}}
</style>
