---
outline: [2, 3]
pageClass: tables-guide
---
<script setup>
import TablesGallery from './.vitepress/theme/TablesGallery.vue'
</script>

# Tables

Every table pattern for the Lustro template: basic, striped, hover, compact, bordered, sticky header, sortable, search and column filters, pagination, selectable rows, row actions, expandable rows, numeric deltas, footer totals, empty state, loading skeleton and a mobile card layout. All data is fictitious and local.


## How to use it

A table compares records across shared columns. Keep real table headers, predictable row identity and readable numeric units. Use cards when the main task is reading one record at a time. The gallery below demonstrates 17 independent patterns, not one combined data-grid controller. All records, money-like amounts, dates and actions are fictitious and local.

1. **Define the record before styling.** Stable IDs connect selection, expansion and actions. Distinguish text, numeric amount, signed delta and date fields.
2. **Choose density and boundaries.** Basic, striped, hover, compact and bordered variants change appearance, not semantics. Hover color is not row activation.
3. **Make operations explicit.** Sort with header buttons and aria-sort; label search/filters, pagination and selection controls. Do not infer a spreadsheet keyboard model from a table.
4. **Keep scope truthful.** State whether totals, selection and pagination apply to all records, filtered records or one page. This gallery deliberately keeps them independent.
5. **Plan empty, loading and failure.** No-match results need a clear reset. Loading must end on the actual result. Preserve useful input on failure; an error state is not implemented in these fixed samples.
6. **Check narrow screens.** Most examples scroll inside their frame. The responsive variant becomes labelled cards below 640px. Keep core explanatory prose readable without horizontal scrolling.

## Actual data and API

`TablesGallery.vue` has no props or emits. It owns 10 fixed records with `{ id: number, name: string, status: string, owner: string, amount: number, delta: number, date: string }`. Status is Ready/Review/Example; amounts are sample numbers formatted with a dollar sign and en-US grouping, not live balances or a declared currency contract. Dates are fixed ISO-like strings. Delta is a signed sample percentage, not a computed return.

`basic` is the first 4 rows. `sortKey` starts name, `sortDir` 1; `sortBy(k)` toggles direction for the same field or starts ascending for another. `sorted` copies all records, sorts and displays 6. The comparator does not explicitly return 0 for equal values; add stable tie handling before relying on it for production data.

`q`, `fStatus` and `fOwner` combine name-substring search with exact status/owner matching; clearFilters resets all three. `page` starts 1, fixed size 4, with 3 pages over the unfiltered 10 rows. These controls are not wired together as one filtered/paged grid.

`sel` holds IDs. The header toggle currently selects all 10 source IDs, although only 6 row checkboxes are shown in that sample. `allSel` compares selection length to all 10; partial state sets indeterminate. This scope is important: it is not a visible-page-only select-all. A production app should state the scope and align controls with it.

`list` starts as a separate first 4-row copy. View/Edit set local message only; Delete removes a local row and sets message. Nothing is saved, sent or deleted externally. `open` holds one expanded ID or null. `loading` starts true and toggles manually. `emptyQ` starts zzz; its Clear filters button only clears that string and does not replace the fixed empty specimen with records. Footer total sums all 10 amounts; average is the arithmetic mean of all 10 deltas, not a weighted return or filtered total.

```vue
<script setup>
import TablesGallery from './.vitepress/theme/TablesGallery.vue'
</script>
<template><TablesGallery /></template>
```

The same component is used by [Lustro tables](/lustro/tables). There is no server, storage, request timer or installed data-grid API. Local state resets on remount. Add operation identity, cancellation/stale-response protection and defined selection behavior before introducing remote data.

## Pattern map

| Pattern | Behavior and limits |
|---|---|
| Basic / striped / hover | Header/body structure, badges and row appearance; no row-click action. |
| Compact / bordered | Dense padding or cell boundaries; keep readable text/hit areas. |
| Sticky header | Header sticks inside a 230px scroll frame, not the whole document. |
| Sortable | Header buttons update local order and aria-sort; six results shown. |
| Search and filters | Independent combined filters with count and real no-match/reset path. |
| Pagination | Four rows per page over all ten, independent of filters. |
| Selectable | Native checkboxes; header selects all ten IDs despite six displayed rows. |
| Row actions | View/Edit feedback; Delete removes a local demo row only. |
| Expandable | One detail row at a time, toggled by named aria-expanded button. |
| Deltas | Signed percent plus color, right-aligned tabular numbers. |
| Footer totals | All-record amount sum and unweighted mean delta, not filtered totals. |
| Empty | Fixed demonstration; its clear button changes only displayed query text. |
| Loading | Manual skeleton/data switch with aria-busy, no real request. |
| Responsive | Four sample records become labelled cards below 640px. |

## Source coverage

| Source | Actual implementation |
|---|---|
| [Lustro UI kit](/ui-kit#tables), [Components](/components#tables), [Lustro guide](/lustro/guide-components#tables) | Small static table specimens. The 17-pattern gallery on this page is a separate local component. |
| [Lustro expanded](/lustro/components-more#tables-basic-striped-and-hover), [Felix expanded](/felix/components-more#tables-basic-striped-and-hover), [Scopecraft expanded](/scopecraft/components-more#tables-basic-striped-and-hover) | Styled static basic/striped/hover and other visual table variants, not a universal sorting/filter/pagination API. |
| [Lumen expanded](/lumen/components-more#tables-basic-striped-and-hover) | Actual rendered gallery is in an iframe; inspect that HTML rather than assuming this gallery's behavior. |
| [Felix molecule](/felix/components/molecules#table) | Fixed sample transfer-history table. Package names in prose are design-source usage, not verified installed Table exports. |
| [Bastion tables](/bastion/components#tables) | Local sample table in the catalog, separate from this gallery's state. |
| Studio catalogs | Catalog search filters local rows. Extended adds its own search/sort/table variants. Those states do not share this component's API. |
| [Pulsefit HTML](/pulsefit-template/components.html#tables) | Styled HTML table specimens; visual similarity does not imply these 17 local controllers. |

## Motion, keyboard and integration

The gallery's skeleton shimmer uses 1.4s animation, removed by reduced motion. Sorting, selection and expansion do not wait for animation. Use native button/checkbox keyboard behavior, visible focus and named controls. This is not a grid with custom arrow navigation. Keep column headers and a caption or associated heading for each table; a nearby visual heading is not always an explicit accessible-name relationship.

Test sort directions/aria-sort, combined filters and no-match recovery, page limits, selection scope/indeterminate state, local row actions, expansion, totals, loading and mobile cards. Test sticky headers in their own scroll frame. Review screen-reader table navigation after responsive CSS changes. A skeleton's visual presence and aria-busy do not alone provide a full loading announcement strategy.

For production, enforce permissions server-side, validate actions, give destructive actions an appropriate confirmation/undo route, keep stable IDs and preserve focus after deletion. Do not copy this gallery's all-ten selection scope or fixed empty state without making that policy intentional. All examples remain fictitious and local.

## Live pattern gallery

<TablesGallery />

<style>
@media(max-width:700px){.tables-guide .vp-doc>div>table,.tables-guide .vp-doc>div>table tbody,.tables-guide .vp-doc>div>table tr,.tables-guide .vp-doc>div>table td{display:block;width:100%;box-sizing:border-box}.tables-guide .vp-doc>div>table thead{display:none}.tables-guide .vp-doc>div>table td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.tables-guide .vp-doc>div>table td{overflow-wrap:anywhere}.tables-guide .vp-doc>div>table tr{margin-bottom:12px}}
</style>
