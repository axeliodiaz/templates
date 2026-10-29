---
pageClass: scroller-guide
---
<script setup>
import MessageScrollerUsageDemo from './.vitepress/theme/MessageScrollerUsageDemo.vue'
</script>

# MessageScroller

A message scroller is the conversation frame: header, scrollable history or empty state, and a composer. It coordinates reading position and new content. It does not provide trustworthy sender identity, delivery receipts, network transport or message persistence by itself. Use [Message](/message), [Bubble](/bubble) and [Marker](/marker) for their separate content responsibilities.

## Try reading position and local entries

<MessageScrollerUsageDemo />

The initial eight fictitious history entries open at the bottom. Scroll up, then add a local draft: reading position stays put and a Jump to bottom control reports new local content below. At the bottom, added entries are followed automatically. Enter submits the local form; blank/whitespace drafts are rejected, up to 240 characters. Show empty state clears only this local thread; Reset restores the history and bottom position. Nothing is sent to a person, saved or deleted remotely.

## How to use it

1. Define the frame's height and let only the history region scroll. Keep composer and recovery controls reachable on narrow screens.
2. Follow new content only when the reader is already near the bottom. Do not yank someone out of older history when an entry arrives.
3. Offer an explicit bottom jump and a meaningful new-entry count. Do not move keyboard focus into a new message without a reason.
4. Separate local draft/append from real send. Network transport needs recipient resolution, authorization, pending/error state and verified delivery facts.
5. Keep chronological DOM order and safe text rendering. Virtualization, older-history loading and attachment access need their own accessibility contracts.
6. Animate only new entries, not restored history. Keep all text and navigation working with reduced motion.

## Anatomy and actual API

`MessageScrollerUsageDemo.vue` has no props or emits. Refs are `viewport`, `draft`, `items`, `nearBottom`, `unseen` and `status`; serial ids are local. Items have id/text/fresh. Initial and reset history has fresh=false. `measure()` uses a 24px bottom threshold and clears unseen at the bottom. `append()` rejects trimmed empty text, captures the follow decision, adds a fresh local item, clears the draft and waits for DOM update. It follows only when already near the bottom; otherwise it increments unseen. `bottom()` waits for DOM update, sets scrollTop to scrollHeight and clears unseen.

Show empty state clears local items/count and reports that no remote delete occurred. Reset restores eight entries/draft/status and bottom position. onMounted initializes bottom position. Native template scroll handling is scoped to the region; no global listener, timer, request or subscription needs cleanup. CSS overflow-anchor is disabled so the browser does not silently alter the deliberate reading-position policy.

```vue
<script setup>
import MessageScrollerUsageDemo from './.vitepress/theme/MessageScrollerUsageDemo.vue'
</script>
<template><MessageScrollerUsageDemo /></template>
```

Suggested host data, not a package contract:

```ts
type ThreadFrame = {
  conversationId: string
  entries: { id: string; text: string }[]
  draft: string
  hasOlder: boolean
  sendState: 'idle' | 'pending' | 'failed'
}
```

The host owns sender/time/state provenance, send permission, storage, pagination and stale-response handling. This demo has none of those effects. A local append is not a sent message or a delivery receipt, and a header name alone does not resolve a recipient.

## States and controls

| State/control | Behavior |
|---|---|
| History | Eight local entries, initially at bottom, no entrance motion. |
| Bottom/follow | New local entry scrolls into view without moving focus. |
| Reading older history | New entry leaves position intact; explicit jump/count offered. |
| Empty | Local empty guidance and composer remain. |
| Draft | Literal text, max240 characters, trimmed-empty guard. |
| Reset | Restores initial history, empty draft, bottom position. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Felix MessageScroller](/felix/components/organisms#messagescroller) | Empty and populated static frames. The populated data-fx=thread handler reads the first input, trims it, appends a textContent bubble and clears the input. It does not send to the named person, persist, add trustworthy sender/time/receipt data, or implement the prose's refresh/attach/scroll-to-bottom controls. |
| [Felix Message](/felix/components/molecules#message) | Separate static message composition, not a live transport contract. |

Felix prose names a 380×600 Figma frame and @felix/ui compound exports plus showScrollToBottom. Those are design-source usage claims, not verified installed exports or behaviors of the rendered gallery. This guide's original Vue controller makes its own local follow policy explicit, without silently adding it to the source.

## Motion, accessibility and checks

Only fresh appended entries fade/move 4px over 180ms. History and reset entries do not animate. Reduced motion removes entry animation. Scroll jumps are immediate rather than smooth so reading policy does not depend on animation or motion preference. The focusable named history region supports keyboard scrolling. An ordered list preserves sequence; the entire thread is not a live log that re-announces history. Separate status gives short local outcomes and new-entry count.

Test initial bottom, keyboard/pointer scroll, no forced follow while reading, bottom jump/count clearing, follow when already at bottom, blank/literal/long drafts, Enter submission, empty/reset, history versus new-entry motion, reduced motion and mobile wrapping. Real hosts additionally need pagination anchoring, send retries, unread rules, attachment safety and actual recipient/delivery verification.

<style>
@media(max-width:700px){.scroller-guide .vp-doc table,.scroller-guide .vp-doc tbody,.scroller-guide .vp-doc tr,.scroller-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.scroller-guide .vp-doc thead{display:none}.scroller-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.scroller-guide .vp-doc td{overflow-wrap:anywhere}.scroller-guide .vp-doc tr{margin-bottom:12px}}
</style>
