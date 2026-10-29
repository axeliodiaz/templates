---
pageClass: empty-state-guide
---
<script setup>
import EmptyStateUsageDemo from './.vitepress/theme/EmptyStateUsageDemo.vue'
</script>

# Empty state

An empty state explains why there is no content and offers the next useful action. Distinguish a genuinely empty collection from no search results, loading, failure and missing access. A blank area does not establish which one happened.

## Try first use, populated and filtered empty

<EmptyStateUsageDemo />

The example starts with no local items. Add fictitious project inserts an actual local record and replaces the empty panel with a list. Type a nonmatching filter to see the no-results state; Clear filter restores the existing item. Reset example empties the collection and filter. No server project is created or deleted.

## How to use it

1. Verify the collection loaded before calling it empty. Use loading/error/access states when those are the real cause.
2. Give the state a short title and explain its scope. No matching results is different from no projects exist.
3. Offer one useful primary action. First use may need creation; filtered empty usually needs filter clearing, not creating unrelated content.
4. Make the action change the relevant state. A success toast alone does not populate a collection.
5. Preserve context and filters where appropriate. Clearing a filter should not delete the underlying records.
6. Use respectful, factual copy. Avoid blaming people for empty data or promising access they do not have.

## Anatomy and actual API

`EmptyStateUsageDemo.vue` has no props or emits. `items` starts as an empty array of `{ id, name }`, `query` and `feedback` start empty. `visible` filters names using a trimmed, case-insensitive substring. `add()` appends one fixed fictitious record with an increasing ID. `reset()` empties items/query and updates feedback, but does not reset IDs. The panel chooses collection-empty before filtered-empty, then populated. No requests, timers or global listeners need cleanup.

```vue
<script setup>
import EmptyStateUsageDemo from './.vitepress/theme/EmptyStateUsageDemo.vue'
</script>
<template><EmptyStateUsageDemo /></template>
```

Suggested host model, not an exported package API:

```ts
type CollectionView<T> = {
  status: 'loading' | 'loaded' | 'failed' | 'forbidden'
  items: T[]
  query: string
  filteredItems: T[]
}
// Empty collection: status === 'loaded' && items.length === 0
// No matches: loaded, items exist, filteredItems.length === 0
```

Keep full-collection counts separate from paginated or filtered counts. An empty first page, stale cache or denied query does not prove no records exist. Host actions still need real permissions and a verified result.

## States and variants

| State | Actual behavior |
|---|---|
| First use | No local items, explanation and one add action. |
| Populated | Local record rendered in a list. |
| No matches | Existing items hidden by filter, Clear filter recovery. |
| Reset | Local items/filter cleared, empty collection panel restored. |
| Loading/error/forbidden | Not simulated or inferred. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [UI kit](/ui-kit#empty-state), [Lustro guide](/lustro/guide-components#empty-state) | Fixed No projects yet panel. Create demo project calls showToast with success copy; it does not insert a project into a collection or remove the empty state. |
| [Felix MessageScroller](/felix/components/organisms#messagescroller) | Static Estado vacío thread specimen separate from the populated preview. It is not connected to a loaded collection or dynamic empty/populated switch. |

This guide adds actual local collection transitions without turning the source toast into a server-creation claim. See [Error and retry](/error-retry) for recovery and [Skeletons](/skeletons) for pending content.

## Motion, accessibility and checks

The panel fades and moves 3px over 180ms when its empty/filtered/list category changes. Reduced motion removes animation. Filtering within the same category does not remount the panel. No focus is moved automatically and no animated placeholder keeps running. A polite status reports local changes or visible/total counts. The search field has a visible label; buttons retain native keyboard behavior.

Test first use, local add, case-insensitive and whitespace-trimmed filters, no matches, clear without deletion, reset, keyboard, reduced motion and narrow wrapping. Production checks also need verified loaded/error/access state, pagination boundaries and successful creation. A local example does not prove anything about a live account's records.

<style>
@media(max-width:700px){.empty-state-guide .vp-doc table,.empty-state-guide .vp-doc tbody,.empty-state-guide .vp-doc tr,.empty-state-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.empty-state-guide .vp-doc thead{display:none}.empty-state-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.empty-state-guide .vp-doc td{overflow-wrap:anywhere}.empty-state-guide .vp-doc tr{margin-bottom:12px}}
</style>
