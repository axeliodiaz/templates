---
aside: false
title: Felix (Bootstrap 6 alpha)
---

# Felix on Bootstrap 6

Standalone Felix remittance UI on Bootstrap 6.0.0-alpha.1 (pinned with SRI). Turquoise primary `#2bf2f1`, slate ink `#082422`, linen surfaces `#fefcf9`. Fictitious recipients and amounts; nothing is sent.

<iframe src="/felix-template/index.html" title="Felix send flow preview" loading="lazy" style="width:100%;height:820px;border:1px solid var(--vp-c-divider);border-radius:12px;background:#fefcf9"></iframe>

[Open send flow full screen](/felix-template/index.html) · [Component catalog](/felix-template/catalog.html)

## Palette

Tokens live in [`felix-theme.css`](/felix-template/felix-theme.css), mapped to Bootstrap 6 `light-dark()` theme variables like Umail.

| Token | Value | Use |
| --- | --- | --- |
| `--bs-primary-base` | `#2BF2F1` | Primary buttons, active pills |
| hover | `#1ABFBE` | Primary hover |
| active / brand | `#065958` | Pressed state, list active |
| `--bs-primary-contrast` | `#082422` | Text on turquoise |
| `--bs-bg-body` | `#FEFCF9` (light) | Page background |
| `--bs-fg-body` | `#082422` (light) | Body text |
| success / warning / danger | Felix semantic greens, yellow, papaya | Status |

## Use it

1. Load Bootstrap 6, then `felix-theme.css`. JavaScript is ESM (`<script type="module">`).
2. Set `data-bs-theme="light"` or `"dark"` on `<html>`, or use the in-page toggle.
3. Use v6 patterns: `btn-solid theme-primary`, `dialog`, `drawer`, `md:col-*`, `alert theme-*`.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="/felix-template/felix-theme.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js"></script>
```

## Notes

- Bootstrap 6 is an alpha; API may change. Browser floor matches Umail: Chrome/Edge 130, Firefox 132, Safari 18.
- Motion handles list/review entrance; it stops when `prefers-reduced-motion` is on.
- The VitePress [Felix component catalog](/felix/components/catalog) embeds the BS6 catalog iframe so Bootstrap does not bleed into the docs shell.
- Chart-heavy Felix pages (Sankey, histograms, etc.) keep their existing Motion animations in the main guide; this template covers the Bootstrap component layer.
