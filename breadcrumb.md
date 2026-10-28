---
pageClass: breadcrumb-guide
---
<script setup>
import BreadcrumbUsageDemo from './.vitepress/theme/BreadcrumbUsageDemo.vue'
</script>

# Breadcrumb

A breadcrumb shows where the current page sits in a hierarchy. Use it for nested documentation or content where going to a parent is useful. It is not browser history, a progress stepper or a replacement for primary navigation.

## Try the hierarchy

This guide shows Templates / Lustro / Breadcrumb guide. The first two are real documentation links; the current page is plain text with `aria-current="page"`. Change the decorative separator to slash, chevron or dot. Separator choice stays local and does not change navigation or save anything. There is no private user data in this example.

<BreadcrumbUsageDemo />

## How to use it

1. **Start from the actual hierarchy.** Use stable ancestors and the current page, not the order of pages someone happened to visit.
2. **Link ancestors to real locations.** Avoid href="#" placeholders, which change the fragment rather than going to a parent.
3. **Name the navigation.** A breadcrumb nav should have a distinct accessible label when other navigation is present.
4. **Mark the current page.** Use `aria-current="page"` and a visible current label. A plain span is appropriate when linking to the same page adds nothing.
5. **Keep separators decorative.** Hide them from assistive technology so each slash is not announced as content.
6. **Wrap on narrow screens.** Preserve readable ancestor/current labels. If collapsing a deep path, provide an accessible disclosure rather than silently removing necessary context.

## Anatomy

| Part | Purpose |
|---|---|
| Navigation landmark | Names the breadcrumb separately from other navigation. |
| Ordered list | Preserves the hierarchy in document order. |
| Ancestor link | Goes to a genuine parent location. |
| Separator | Visual hierarchy cue; decorative and hidden from speech. |
| Current page | Names the present location with aria-current page. |

## Data shape

`BreadcrumbUsageDemo.vue` has no props or emits. Exact data:

```ts
const items = [
  { label: 'Templates', href: '/' },
  { label: 'Lustro', href: '/lustro' },
  { label: 'Breadcrumb guide', href: null }
]
// separator: string = '/' // select permits /, chevron, dot
```

Ancestor anchors use the actual href. A null href renders current text. Changing `separator` only changes the aria-hidden visual symbol. There is no router state, history tracking, async loading, storage or fictitious saving result.

An application model might be:

```ts
type Crumb = { id: string; label: string; href?: string }
// Require a consistent hierarchy and exactly one current location.
```

Use stable IDs when paths/labels change. This is a suggested data contract, not shared catalog props. For dynamic routes, resolve ancestors from authorized route metadata rather than private content leaked into URLs.

## Usage

```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Templates</a></li>
    <li><span aria-hidden="true">/</span><a href="/lustro">Lustro</a></li>
    <li><span aria-hidden="true">/</span><span aria-current="page">Current guide</span></li>
  </ol>
</nav>
```

Use actual application destinations and page labels. Style list items without removing the list semantics. A router link is appropriate when it preserves normal link behavior, including keyboard activation, history and open in a new tab. Do not replace ancestor links with buttons that impersonate navigation.

## States and variants

- **Root only:** one current item; do not invent a parent.
- **Nested hierarchy:** ordered ancestors then the current page. Keep labels concise but unambiguous.
- **Current:** plain text or an intentionally linked current location, with aria-current page. It is not a selected tab.
- **Slash / chevron / dot:** decorative separators do not alter semantic structure.
- **Long labels:** wrap without hiding the current location or pushing the page wider than the screen.
- **Collapsed path:** use a real accessible disclosure/menu with proper focus behavior if needed. Not implemented in this guide.
- **Unknown/loading route:** do not show stale ancestors as current. Handle unavailable/unauthorized paths without exposing private names.

## Template map

| Surface | Actual implementation |
|---|---|
| Lustro base | [Guide](/lustro/guide-components#breadcrumb), [components](/components#breadcrumb), [UI kit](/ui-kit#breadcrumb): real Templates/Lustro links and current Components text. This guide adds explicit list/current/separator semantics. |
| Lustro expanded | [Breadcrumbs](/lustro/components-more#breadcrumbs): `.bc`, chevron and dot visual specimens. Ancestor anchors omit href; they are not functioning navigation. |
| Felix expanded | [Breadcrumbs](/felix/components-more#breadcrumbs): corresponding scoped visual specimens. |
| Lumen expanded | [Breadcrumbs](/lumen/components-more#breadcrumbs): bundled gallery link. |
| Scopecraft expanded | [Breadcrumbs](/scopecraft/components-more#breadcrumbs): corresponding visual hierarchy treatments. |
| Felix molecules | [Breadcrumb](/felix/components/molecules#breadcrumb): Inicio/Envíos anchors use href="#" and current Confirmar text. Replace placeholders with real parent destinations before use. Design-source import prose does not establish a shared package API. |
| Studio catalogs | [Relay](/relay/components), [Folio](/folio/components), [Pace](/pace/components), [Spark](/spark/components): a named nav with text Workspace / Reports / brand, not ancestor links. |
| Bastion | [Catalog](/bastion/components): named breadcrumb text for Bastion / Catalog / current tab. It is a local preview, not a real nested route. |

## Motion and accessibility

Ancestor link color transitions over 120ms; reduced motion removes it. No path movement or animation conveys the current page. The separator is aria-hidden and the current page is explicit.

Tab reaches only actual ancestor links; Enter follows them normally. Current plain text does not add an unnecessary tab stop. Keep visible focus, meaningful labels and a named nav. Test wrapped long paths at phone widths and zoom. Do not implement tablist arrow navigation for breadcrumbs.

## Integration notes

Import `BreadcrumbUsageDemo.vue` for this exact example. Preserve each template's scoped styles and route conventions. Keep hierarchy distinct from browser history and from task completion steps. Never build a link from an untrusted label or expose a private record title to an unauthorized viewer. The example uses only public documentation labels and local separator state.

<style>
.breadcrumb-guide .vp-doc table { width:100%; table-layout:fixed }
.breadcrumb-guide .vp-doc td, .breadcrumb-guide .vp-doc th { overflow-wrap:anywhere }
@media(max-width:640px) {
  .breadcrumb-guide .vp-doc table, .breadcrumb-guide .vp-doc tbody, .breadcrumb-guide .vp-doc tr, .breadcrumb-guide .vp-doc td { display:block; width:100% }
  .breadcrumb-guide .vp-doc thead { display:none }
  .breadcrumb-guide .vp-doc tr { margin:12px 0; border:1px solid var(--vp-c-divider) }
  .breadcrumb-guide .vp-doc td { border:0 }
  .breadcrumb-guide .vp-doc td:first-child { font-weight:700; padding-bottom:4px }
  .breadcrumb-guide .vp-doc td + td { padding-top:4px }
}
</style>
