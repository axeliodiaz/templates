---
pageClass: notifications-guide
---
<script setup>
import NotificationUsageDemo from './.vitepress/theme/NotificationUsageDemo.vue'
</script>

# Notifications

A notification inbox keeps events available after their arrival. Use it for review requests, report availability and activity history. A [toast](/toasts) is brief feedback; it is not a durable event record. Read means acknowledged or opened under the product's policy, not proof that the underlying work is finished.

## Try read, unread and local detail

<NotificationUsageDemo />

Two sample items start unread and one starts read. Individual controls toggle read state. Open detail marks that item read and reveals an in-page detail block, not another route or a modal. Unread only filters out read items; the detail remains visible if its item leaves the filter. Mark all read changes every item, including filtered-out items. Reset restores the initial three items, All filter and no detail. There is no expiry timer or deletion. The sample persists only while mounted, not across reloads or devices.

## How to use it

1. Give every event a stable ID, source and meaningful title. Do not use array position as identity.
2. Define when something becomes read. This guide uses explicit marking or opening detail. Merely rendering a row does not mark it read.
3. Show read/unread in words, not only a colored dot. Compute counts from the authoritative collection, not a manually decremented badge.
4. Preserve access when filtering. If the active row disappears after marking read, move focus to a stable control. This guide returns it to Inbox filter.
5. Keep the inbox as an ordinary list of buttons, not a menu unless menu keyboard behavior is implemented.
6. Keep persistent errors and required actions reachable. A notification does not replace validation beside a failed field.

## Anatomy and actual API

`NotificationUsageDemo.vue` has no props or emits. `initial` contains `{ id, title, body, read }` objects. `items` clones those records; `filter` starts all, `selected` and `feedback` start empty. Computed `unread` counts unread items, `visible` applies All/Unread only and `detail` finds the selected ID. `toggle(id)` changes one record, `open(id)` selects and marks read, `markAll()` marks every item read, and `reset()` restores defaults.

```vue
<script setup>
import NotificationUsageDemo from './.vitepress/theme/NotificationUsageDemo.vue'
</script>
<template><NotificationUsageDemo /></template>
```

The list is a native ul/li sequence, state labels are visible text, and action feedback uses one polite role=status. Individual controls have item-specific accessible names. Filtered-row removal returns focus to the filter after the DOM update. No timers, subscriptions, requests or storage exist, so unmount needs no cleanup. No browser permission prompt, push delivery, email, badge API, server read receipts or third-party event disclosure occurs.

Suggested host data is `{ id, source, title, body, createdAt, readAt, actionUrl }`. Those are integration fields, not verified repository exports. Validate destinations, enforce account permissions, reconcile server failures and avoid treating read as completed. Use actual timestamps and locale-aware labels rather than copying the catalogs' illustrative relative times.

## States and variants

| State | Actual behavior |
|---|---|
| Unread | Text label and accent boundary; included in unread count/filter. |
| Read | Still available in All, excluded from Unread only. |
| Selected detail | Local block remains even when its read item leaves the filter. No focus trap or auto-focus. |
| All read | Count zero, bulk action disabled. All still shows the three records. |
| Empty filter | Recovery text suggests All or Reset; no fabricated server-empty result. |
| Loading/error/pagination | Not simulated. Add reachable retry and reconcile optimistic changes in the host. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [UI kit](/ui-kit#notifications), [Components](/components#notifications), [Lustro guide](/lustro/guide-components#notifications) | Shared catalog family has one notificationsRead boolean for two illustrative rows, toggling Mark all read/Reset unread and a 2/0 badge. No independent per-row read state, filter, server persistence or detail route. |
| Studio catalogs | Toast / Notification / List item specimen has static Northstar/Jordan list rows and a New badge; no read/unread controller. Show toast updates a separate notice string, not an inbox record. |

This guide adds a local per-item teaching model without claiming the source catalogs already implement it. It is not a verified installed Notification provider or a backend delivery system.

## Motion, accessibility and integration

Guide rows/detail enter with a 3px fade over 160ms and row background changes over 140ms. Reduced motion removes both. Native Enter/Space activates buttons and Tab follows document order. No menu arrows, Escape dismissal, auto-focus or focus trap is implemented. Close sample detail is a normal button, not a dialog close action. Closing detail and bulk marking return focus to Inbox filter, so removing or disabling a focused control does not leave focus in limbo.

Test initial counts, each read toggle, bulk marking, filter-empty recovery, opening a row from Unread only, selected detail persistence, reset, keyboard and focus, reduced motion and narrow wrapping. In production, subscribe/unsubscribe cleanly, dedupe IDs, validate user/account scope, cancel stale loads and handle multi-device read conflicts. Notification previews can expose private information during screen sharing; keep sensitive content behind the proper account boundary.

<style>
@media(max-width:700px){.notifications-guide .vp-doc table,.notifications-guide .vp-doc tbody,.notifications-guide .vp-doc tr,.notifications-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.notifications-guide .vp-doc thead{display:none}.notifications-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.notifications-guide .vp-doc td{overflow-wrap:anywhere}.notifications-guide .vp-doc tr{margin-bottom:12px}}
</style>
