---
aside: false
title: Lustro on Bootstrap 6
---

# Lustro on Bootstrap 6

Standalone component lab on **Bootstrap 6.0.0-alpha.1** (pinned with SRI), using Lustro glass surfaces, the indigo–pink gradient accent, and semantic status colors. The page is served from `public/lustro-template/` so Bootstrap never loads into the VitePress shell or other templates. Fictitious metrics; all actions are local.

<iframe src="/lustro-template/index.html" title="Lustro Bootstrap 6 template preview" loading="lazy" style="width:100%;height:820px;border:1px solid var(--vp-c-divider);border-radius:16px;background:#07070f"></iframe>

[Open the template full screen](/lustro-template/index.html)

## Palette

Tokens are defined in [`lustro-theme.css`](/lustro-template/lustro-theme.css) and mapped to Bootstrap 6 theme variables with `light-dark()` for dark (default) and light modes.

| Token | Value | Use |
| --- | --- | --- |
| Primary gradient | `#6366f1` → `#ec4899` | `btn-solid theme-primary`, active pills |
| Canvas | `#07070f` | Body background with ambient glows |
| Glass | `rgba(148,140,255,.07)` | Cards and panels |
| Glass border | `rgba(148,140,255,.16)` | Card edges |
| Success / warning / danger | `#00d992`, `#fbbf24`, `#ef4444` | Status badges and alerts |
| Cyan accent | `#22d3ee` | Chart series, info badges |
| Display / body / mono | Space Grotesk, DM Sans, JetBrains Mono | Headings, UI, labels |

## Use it

1. Load Bootstrap 6 first, then `lustro-theme.css`. JavaScript is ESM only (`<script type="module">`).
2. Default is dark (`data-bs-theme="dark"`). Toggle light with the navbar control or set `data-bs-theme="light"` on `<html>`.
3. Use v6 patterns: `btn-solid theme-primary`, `dialog`, `drawer`, `md:col-*`, `alert theme-*`.
4. Put gradient fills on `background-image`, not `background-color`, so the primary button keeps the Lustro spectrum.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="/lustro-template/lustro-theme.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js"></script>
```

## Motion

Entry fades use WAAPI on section markers (`data-lu-enter`). Lists and KPI updates use Motion with `prefers-reduced-motion` respected. The sample bar chart replays with a height animation; reduced motion shows the final frame immediately.

The live [component catalog](/lustro/components) and [expanded Bootstrap set](/lustro/components-more) still use the in-doc `.l-*` and `.bsx` previews. This page is the real Bootstrap 6 reference, parallel to [Umail](/umail).

## Notes

- Bootstrap 6 is an alpha; pin the version and integrity hashes in production.
- Gradient primary on white text is suitable for buttons, not small body copy.
- Dialog, drawer, toast, list, forms, alerts, progress, and chart demo are local only.
