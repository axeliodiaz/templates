---
pageClass: message-guide
---
<script setup>
import MessageUsageDemo from './.vitepress/theme/MessageUsageDemo.vue'
</script>

# Message

A message presents one conversation entry with sender, content and time or state. Keep incoming, outgoing and system entries distinguishable beyond color. A bubble is a display element, not evidence that anything was sent, delivered or read.

## Try local entries and safe text

<MessageUsageDemo />

The example starts with fictitious incoming/system entries. Add local entry trims nonempty text and appends an outgoing record marked Local only, not sent. Add fictitious incoming appends a fixed sample. Clear local entries empties the list. Enter in the textarea inserts a line break, not a send action. Nothing reaches a recipient, provider or server.

## How to use it

1. Keep a stable message ID, sender identity, content and provenance-backed time/state together. Do not infer read receipts from the presence of a bubble.
2. Keep chronological reading order in the DOM. Change alignment for direction without reversing history.
3. Render untrusted text as text, not HTML. This demo uses Vue interpolation and preserves line breaks.
4. Separate local composition, pending provider submission, sent, delivered, read and failed. Only use a state when the source supports it.
5. Animate new arrivals only, not history already present. Avoid stealing focus or forcing scroll while someone reads older messages.
6. Keep system notices distinct and clearly attributed. Do not disguise automated text as a human message.

## Anatomy and actual API

`MessageUsageDemo.vue` has no props or emits. Each local entry is `{ id, kind, sender, text, time, fresh }`; kind is incoming/outgoing/system. `entries` starts with two fixed records and `draft`/`feedback` start empty. `append()` rejects blank/whitespace text, appends a new local outgoing record and clears draft. `incoming()` adds fixed fictitious content. `clear()` removes the list but does not clear draft or reset IDs. Time strings are illustrative labels, not timestamps from a provider. There are no timers, network requests, global listeners or subscriptions to clean up.

```vue
<script setup>
import MessageUsageDemo from './.vitepress/theme/MessageUsageDemo.vue'
</script>
<template><MessageUsageDemo /></template>
```

Suggested production fields, not a verified exported API:

```ts
type MessageRecord = {
  id: string
  senderId: string
  direction: 'incoming' | 'outgoing' | 'system'
  text: string
  timestamp: string // source-backed instant
  status?: 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
}
```

Keep provider IDs and acknowledgments separate from temporary local IDs. Reconcile retries to avoid duplicates. Resolve display timezone explicitly; an illustrative clock label has no scheduling meaning. Do not attach credentials, private files or unrelated history just because a composer exists.

## States and variants

| State | Actual behavior |
|---|---|
| Incoming | Fixed fictitious sender, start aligned and explicitly labeled. |
| Outgoing | End aligned, Example author and Local only, not sent. |
| System | Distinct centered dashed surface and system label. |
| Empty | No local entries text after clear. |
| Blank input | Polite feedback, no entry appended. |
| Multiline/long text | Line breaks preserved, long tokens wrap; textarea capped at 500 characters. |
| Pending/delivered/read/failed | Not simulated; no invented receipts or retry operation. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [UI kit](/ui-kit#message), [Lustro guide](/lustro/guide-components#message) | Fixed incoming/outgoing articles and system text. Names, clock labels and content are examples. No composer or delivery state integration. |
| [Felix Message](/felix/components/molecules#message) | Static avatar, sender, bubble and time/read-label specimens. The read label is not backed by a provider receipt. |
| [Felix MessageScroller](/felix/components/organisms#messagescroller) | Composed thread/input specimen. Enhancer appends a plain bubble with textContent on click or Enter and clears input. No recipient, network send, sender/time metadata or delivery acknowledgment is added. |

Felix prose names package exports and animateIn. The preview markup/enhancer do not establish installed exports or a messaging service. This guide adds local interaction and explicit provenance labels, not a real send operation.

## Motion, accessibility and checks

Fresh entries fade and move 4px over 180ms; initial history does not animate. Reduced motion removes entrance motion. The list is not a live region that rereads full history; a polite status reports local additions. Sender and local-state text remain visible. The textarea has a visible label and standard multiline keyboard behavior. No autofocus or automatic scrolling is added.

Test whitespace rejection, button append, line breaks, literal HTML-like text, stable unique IDs, incoming/system/outgoing distinction, clear/empty, draft preservation, keyboard, reduced motion and narrow wrapping. A production thread separately needs provider-state reconciliation, failed-send retry, pagination, scroll preservation and assistive-technology tests. This example does not verify any external communication.

<style>
@media(max-width:700px){.message-guide .vp-doc table,.message-guide .vp-doc tbody,.message-guide .vp-doc tr,.message-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.message-guide .vp-doc thead{display:none}.message-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.message-guide .vp-doc td{overflow-wrap:anywhere}.message-guide .vp-doc tr{margin-bottom:12px}}
</style>
