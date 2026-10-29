---
pageClass: bubble-guide
---
<script setup>
import BubbleUsageDemo from './.vitepress/theme/BubbleUsageDemo.vue'
</script>

# Bubble

A bubble is the content surface inside a conversation entry. It holds message text and visual tone, not sender identity, timestamp or delivery state. Compose it with [Message](/message) when those details matter. A red or outgoing-looking surface does not prove an error occurred or a message was sent.

## Try tone, alignment and text wrapping

<BubbleUsageDemo />

Choose among seven local presentation tones, start/end alignment and up to 500 characters of plain text. Line breaks are preserved; HTML-like text stays literal. Replay entrance explicitly remounts the preview to demonstrate new-entry motion. Reset restores the initial text, tone and alignment. None of these actions sends a message or changes a receipt.

## How to use it

1. Keep the bubble responsible for body presentation. Put sender, time and source-backed state in the surrounding message.
2. Constrain width at the container and let long words wrap. Preserve chronological DOM order even when outgoing content aligns to the end.
3. Select tone from meaning, not sender identity guesses. Destructive styling alone is not an accessible error announcement.
4. Render untrusted content as text. Add a sanitized markdown pipeline only when the host explicitly supports it; ghost styling is not a parser.
5. Animate newly added content, not all loaded history. This demo replays only when asked, not on each edit or tone change.
6. Keep links/actions semantically separate and accessible if the host adds them. Do not make the whole bubble a button unless it truly performs one action.

## Anatomy and actual API

`BubbleUsageDemo.vue` has no props or emits. `tone`, `alignment` and `text` are local refs; seven tone strings are fixed options. `fresh` starts zero, increments on Replay entrance and becomes the preview key. `reset()` restores all refs. Content uses Vue interpolation with pre-wrap and overflow-wrap, not v-html. No timers, document listeners, requests or subscriptions need cleanup.

```vue
<script setup>
import BubbleUsageDemo from './.vitepress/theme/BubbleUsageDemo.vue'
</script>
<template><BubbleUsageDemo /></template>
```

Suggested host data, not an exported package API:

```ts
type BubbleContent = {
  text: string
  tone: 'default' | 'secondary' | 'muted' | 'tinted' | 'outline' | 'ghost' | 'destructive'
  align: 'start' | 'end'
  animateNewEntry: boolean
}
```

Attachments, rich content, streaming, sanitization and error announcements need separate contracts. Empty text here shows a preview placeholder; a production message should define whether empty content is valid rather than accidentally transmitting that placeholder.

## States and variants

| Variant/state | Local presentation |
|---|---|
| Default/secondary/muted/tinted | Different token-based surfaces; no sender or transport implication. |
| Outline | Border with transparent background. |
| Ghost | No surface, padding or rounded frame; still plain text. |
| Destructive | Danger surface/border, not an automatic alert. |
| Start/end | Flex alignment, not reading-order reversal. |
| Empty | Explicit preview placeholder, not a sent message. |
| Replayed entrance | Optional whole-bubble animation, not per-character streaming. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Felix Bubble](/felix/components/atoms#bubble) | Static default/them/secondary/tinted/ghost/outline/destructive div specimens. Body text and visual classes only; no click, send, markdown or state handler. Prose calls the other-party tone muted, while preview markup uses them. |
| [Felix Message](/felix/components/molecules#message) | Composes bubble body with avatar/sender/time specimens. These are static examples, not live conversation data. |

Felix prose describes a package variant prop and content-hugging behavior; it does not establish installed exports. This guide's Vue refs and token-based styles are an isolated teaching API, not a claim of pixel-equivalent Felix variants or a package adapter.

## Motion, accessibility and checks

Replay entrance fades and moves the whole bubble 4px over 180ms. Initial content and ordinary edits do not animate. Reduced motion removes replay animation. Preview text is not an assertive live region; a polite status names the local tone/alignment. Controls have visible labels and native keyboard behavior. Direction is also named in the status, rather than relying solely on position or color.

Test all tones, alignment, empty text, literal HTML-like content, multiline and unbroken long tokens, replay versus history, reset, keyboard, reduced motion and narrow wrapping. Check contrast with the host theme. A production conversation also needs trustworthy identity/time/state, attachment access and safe rich-content rendering; the bubble does not provide them.

<style>
@media(max-width:700px){.bubble-guide .vp-doc table,.bubble-guide .vp-doc tbody,.bubble-guide .vp-doc tr,.bubble-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.bubble-guide .vp-doc thead{display:none}.bubble-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.bubble-guide .vp-doc td{overflow-wrap:anywhere}.bubble-guide .vp-doc tr{margin-bottom:12px}}
</style>
