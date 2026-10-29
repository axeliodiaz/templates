---
pageClass: text-guide
---
<script setup>
import TextUsageDemo from './.vitepress/theme/TextUsageDemo.vue'
</script>

# Text

A text primitive applies a consistent typographic scale to copy. Visual size and semantic structure are separate: a large paragraph is not a heading, and small caption styling does not create a time, label or status element. Choose the HTML element from the content's role, then choose the visual style from the layout.

## Try style versus structure

<TextUsageDemo />

Choose display/heading/body/caption styling independently of p/h3/span. Edit up to 400 characters of literal text, including line breaks, and choose default or muted tone. The status names the actual element. Empty input shows an explicit preview placeholder. Replay text entrance demonstrates optional whole-text motion; Reset restores body/p/default and the fictitious copy. This is a local typography lesson, not an editor or content publishing action.

## How to use it

1. Select semantics first: paragraph for prose, an appropriate heading level for a section, span for inline text. Do not choose h3 just because its default size looks right.
2. Use the host's type tokens consistently instead of scattering arbitrary sizes. This demo's scale is local, not a promise of source font equivalence.
3. Keep text selectable and let long words/URLs wrap. Avoid fixed heights that clip translated, enlarged or multiline copy.
4. Render untrusted content as text. Rich HTML or markdown needs a separate sanitization and rendering contract.
5. Keep essential copy readable in every theme. Muted tone is not disabled behavior or a substitute for contrast checks.
6. Add the semantics a use case needs: a real form label needs association, time needs a valid datetime, and meaningful status updates need an announcement policy. A generic text primitive provides none automatically.

## Anatomy and actual API

`TextUsageDemo.vue` has no props or emits. Local refs are `style` (display/heading/body/caption), `tag` (p/h3/span), `tone` (default/muted), `text` and `fresh`. Replay increments fresh to remount the dynamic element; Reset restores body/p/default/original text/zero. Vue interpolation preserves literal content, while pre-wrap retains line breaks and overflow-wrap permits long-token wrapping. No timers, requests, global listeners or subscriptions need cleanup.

The stage is not a live region; a separate status names configuration rather than repeating the entire edited copy. The rendered preview actually changes element, not merely aria-role. Demo heading is h3 under this page's h2 section; this does not prescribe heading level in another host. Local display/heading/body/caption sizes are 32/24/16/13px with explicit line heights. A span remains inline even with a large visual style.

```vue
<script setup>
import TextUsageDemo from './.vitepress/theme/TextUsageDemo.vue'
</script>
<template><TextUsageDemo /></template>
```

Suggested host data, not a package contract:

```ts
type CopySpec = {
  text: string
  element: 'p' | 'h2' | 'h3' | 'span'
  visualStyle: 'display' | 'heading' | 'body' | 'caption'
  tone: 'default' | 'muted'
}
```

The host must validate appropriate structure and supply safe text. Do not expose arbitrary HTML element names or v-html from untrusted content just because this controlled demo offers a fixed set of elements. Font files, licenses, language coverage and fallbacks need separate verification before use in another product.

## States and variants

| Variant/state | Behavior |
|---|---|
| Display/heading/body/caption | Local size, weight, line-height and tracking choices. |
| p/h3/span | Actual element semantics, independent from styling. |
| Default/muted | Text tone only, not interactive disabled state. |
| Literal/multiline | HTML-like strings stay text; line breaks preserved. |
| Empty | Explicit preview placeholder, not saved copy. |
| Replay/reset | Optional whole-text entrance or restore local defaults. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Felix Text](/felix/components/atoms#text) | Four static p elements with fx-t-display-md, fx-t-heading-3, fx-t-body and fx-t-caption classes. The heading-looking example is still a paragraph, not a semantic heading. Amount and relative-time specimen strings are hardcoded, not formatted from current account/time data. |
| [Felix Label](/felix/components/atoms#label) | Separate label-looking spans; text styling alone does not associate a form control. See [Label](/label) for actual for/id association. |

Felix prose names a Saans/Plain scale, @felix/ui and role selection. Those are design-source usage claims, not verified installed exports or fonts in another host. This guide's local Vue element/style selectors are an original teaching API, not a shared package adapter or a change to the gallery specimens.

## Motion, accessibility and checks

Replay moves the whole text block 4px while fading over 180ms. Initial content and ordinary edits/style/element changes do not animate. Reduced motion removes replay animation. No letter-by-letter announcement, automatic typing or repeated live readout is added. The actual text remains available when animation stops.

Test every visual style and semantic element, heading presence versus heading-looking paragraphs, tones, literal HTML-like content, line breaks, empty/long text, replay versus edits, reset, native keyboard controls, reduced motion and mobile wrapping. Also test zoom, translations, font failure and host theme contrast before integrating the primitive into a real page.

<style>
@media(max-width:700px){.text-guide .vp-doc table,.text-guide .vp-doc tbody,.text-guide .vp-doc tr,.text-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.text-guide .vp-doc thead{display:none}.text-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.text-guide .vp-doc td{overflow-wrap:anywhere}.text-guide .vp-doc tr{margin-bottom:12px}}
</style>
