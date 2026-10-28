---
pageClass: pagination-guide
---
<script setup>
import PaginationUsageDemo from './.vitepress/theme/PaginationUsageDemo.vue'
</script>

# Pagination

Pagination splits a result set into manageable pages. Use it when people need a stable place, a known count or a way back to earlier results. A highlighted number alone is not pagination: the visible records and range must follow the selected page.

## Try local pages

Eight fictitious records are shown three at a time. Choose a page, First/Last or Previous/Next. Page 3 contains the final two records. Boundary buttons are truly disabled, and the status reports the actual slice. No remote data is fetched and nothing is saved.

<PaginationUsageDemo />

## How to use it

1. **Define the data contract.** Decide between page numbers and server cursors. Do not invent a total for an API that does not provide one.
2. **Keep results and controls in sync.** One current page should determine both the slice and `aria-current="page"`.
3. **Handle boundaries.** Disable Previous on the first page and Next on the last known page. Clamp a page after filtering or data changes.
4. **Describe the result range.** Include units such as records, not just an unexplained page number. Handle an empty set without showing a false 1..0 range.
5. **Choose links versus local buttons.** Real URL pages use hrefs and browser history. Buttons are appropriate for this local client-side slice.
6. **Keep state on failure.** For remote results, preserve known data, expose loading/error and ignore stale responses. Do not show a new page number with old data as though it finished.

## Anatomy

| Part | Purpose |
|---|---|
| Result region | The actual records for the current page. |
| Pagination nav | Names the controls independently of other page navigation. |
| First / Previous / Next / Last | Move to an endpoint or adjacent valid page with native disabled boundaries. |
| Page button/link | Direct page selection with an accessible page name. |
| Current marker | `aria-current="page"` on the selected page control. |
| Range/status | Actual position and count, announced politely after local changes. |

## Data shape

`PaginationUsageDemo.vue` has no props or emits. Exact local data:

```ts
// records: { id: string; label: string }[] = 8 fictitious records
// page: number = 1
// pageSize: number = 3
// pages: number = Math.ceil(records.length / pageSize) // 3
// visible: computed records.slice((page - 1) * pageSize, page * pageSize)
```

`go(n)` clamps to 1..3. The final page contains records 7 and 8. The page buttons and status use the same state. There are no requests, cursors, URL parameters, filters or persistence. This fixed eight-record demo does not implement empty/loading states.

A real page-number response might be:

```ts
type PageResult<T> = { items: T[]; page: number; pageSize: number; total: number }
// Cursor APIs need next/previous cursor state instead; they may have no total.
```

This is an application contract, not a shared catalog component API. Validate requested limits and access server-side.

## Usage

```vue
<nav aria-label="Record pages">
  <button :disabled="page === 1" @click="go(page - 1)">Previous</button>
  <button v-for="n in pages" :key="n" :aria-label="`Page ${n}`"
    :aria-current="page === n ? 'page' : undefined" @click="go(n)">{{ n }}</button>
  <button :disabled="page === pages" @click="go(page + 1)">Next</button>
</nav>
```

Define the state, actual result slice and boundary logic in the application. Use type button inside a form. This snippet shows controls only; import `PaginationUsageDemo.vue` for the exact local slice and status. For server-backed URLs, use real links rather than preventing normal browser navigation.

## States and variants

- **First / middle / last:** boundaries and range text follow actual data.
- **Current:** exactly one direct page control has aria-current page; it stays an ordinary button/link, not an ARIA tab.
- **Small / large / rounded:** visual treatments preserve readable labels and usable targets. This guide uses at least 44px controls.
- **Many pages / ellipsis:** show a stable window around current and meaningful first/last access. Ellipsis is not a fake clickable page.
- **Empty:** no records and a clear empty state, with irrelevant controls removed or disabled. Do not claim a fabricated total.
- **Loading / error:** distinguish requested from confirmed page, preserve known data and offer retry. This demo is synchronous and has neither state.
- **Filtered results:** reset or clamp the page when the result count shrinks. Apply sorting consistently across all pages, not each visible slice independently.

## Template map

| Surface | Actual implementation |
|---|---|
| Lustro base | [Guide](/lustro/guide-components#pagination), [components](/components#pagination), [UI kit](/ui-kit#pagination): local Previous/Next and page count, not a backend result query. |
| Lustro expanded | [Pagination](/lustro/components-more#pagination): `.pg` / small / large / rounded visual anchors without real href destinations. |
| Felix expanded | [Pagination](/felix/components-more#pagination): corresponding scoped visual specimens. |
| Lumen expanded | [Pagination](/lumen/components-more#pagination): link to bundled gallery examples. |
| Scopecraft expanded | [Pagination](/scopecraft/components-more#pagination): corresponding visual examples. |
| Felix molecules | [Pagination](/felix/components/molecules#pagination): local data-page/data-dir buttons and page label. Design-source import prose is not an installed shared package API. |
| Studio catalogs | [Relay](/relay/components), [Folio](/folio/components), [Pace](/pace/components), [Spark](/spark/components): local page value1..3 with aria-current and boundary buttons. The adjacent sample table is not sliced by that page value. This guide's separate demo does slice its records. |

## Motion and accessibility

A 120ms button background transition marks selection; reduced motion removes it. Records change immediately. Avoid an animation that briefly leaves old records under a new page label.

Tab and Enter/Space use native button behavior. Do not implement tablist arrow navigation for pagination. Keep focus stable after local updates, and announce the concise range via status. For route navigation use normal document focus/history conventions. Test wrapped mobile controls, long labels and the final partial page.

## Integration notes

Import `PaginationUsageDemo.vue` for this exact local example. Preserve each catalog's scoped classes. Server data may change between pages; use stable sorting and reconcile deletions, permissions and cursor expiry. Do not expose private counts beyond the viewer's access. All records here are fictitious and local.

<style>
.pagination-guide .vp-doc table { width:100%; table-layout:fixed }
.pagination-guide .vp-doc td, .pagination-guide .vp-doc th { overflow-wrap:anywhere }
@media(max-width:640px) {
  .pagination-guide .vp-doc table, .pagination-guide .vp-doc tbody, .pagination-guide .vp-doc tr, .pagination-guide .vp-doc td { display:block; width:100% }
  .pagination-guide .vp-doc thead { display:none }
  .pagination-guide .vp-doc tr { margin:12px 0; border:1px solid var(--vp-c-divider) }
  .pagination-guide .vp-doc td { border:0 }
  .pagination-guide .vp-doc td:first-child { font-weight:700; padding-bottom:4px }
  .pagination-guide .vp-doc td + td { padding-top:4px }
}
</style>
