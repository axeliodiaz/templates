---
aside: false
title: Umail
---

# Umail

A standalone original template for a university messaging app. It uses Bootstrap 6.0.0-alpha.1 (an alpha, pinned with integrity hashes) and keeps the original Umail colors: the blue `#0093D0` primary, the `#2274BA` link blue, the deep `#00517F`, and the near-black `#1B1B1B` navbar. Fictitious data; actions stay in the page and nothing is sent.

<iframe src="/umail-template/index.html" title="Umail template preview" loading="lazy" style="width:100%;height:760px;border:1px solid var(--vp-c-divider);border-radius:12px;background:#fff"></iframe>

[Open the template full screen](/umail-template/index.html)

## Motion

Umail uses the shared layer with a short product feel: 6px rise, 1px hover, 1px press, 280ms. Bootstrap components inside the template pick up the same hover, press and focus transitions. Reduced motion disables them. Tokens are on `html[data-tpl="umail"]`.

## Palette

The colors come from the live Umail stylesheet and Bootstrap 2 build, mapped to Bootstrap 6 theme tokens in one file: [`umail-theme.css`](/umail-template/umail-theme.css). Bootstrap 6 resolves each token with `light-dark()`, so the same variables serve light and dark.

| Token | Value | Use |
| --- | --- | --- |
| `--bs-primary-base`, `--bs-primary-bg` | `#0093D0` | Solid buttons, active pills, badges |
| hover | `#04B5FF` | Primary button hover |
| active, deep | `#00517F` | Pressed state, emphasis text |
| `--bs-primary-fg`, `--bs-link-color` | `#2274BA` (light) | Links and outline buttons |
| `.umail-navbar` | `#1B1B1B` | Top bar |
| `--bs-fg-body` | `#333333` | Text |
| `--bs-fg-3` | `#6D6D6D` | Muted text |
| `--bs-border-color` | `#E5E5E5` | Borders |
| `--bs-bg-1` | `#F9F9F9` | Card headers and strips |
| warning, danger, success, info | `#F89406`, `#BD362F`, `#51A351`, `#2F96B4` | Status colors |

## Use it

1. Load Bootstrap 6 first, then `umail-theme.css`. The JavaScript is ESM only, so use `<script type="module">`.
2. Optionally set `data-bs-theme="light"` or `"dark"` on `<html>`. Without it the page follows the system preference.
3. Use the v6 patterns: `btn-solid theme-primary`, `badge theme-primary`, `alert theme-info`, `md:col-5` for responsive columns, `dialog` and `drawer` instead of modal and offcanvas.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="/umail-template/umail-theme.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js"></script>
```

## Notes

- Bootstrap 6 is an alpha (released 2026-10-08), so its API can still change. The stable line is 5.3.8. Browser floor: Chrome and Edge 130, Firefox 132, Safari 18.
- Motion handles the list entrance, the detail panel, and badge pulses. It stops when `prefers-reduced-motion` is on.
- The primary blue `#0093D0` with white text is about 3.4:1, fine for large or bold button labels but under 4.5:1 for small text. Body links use `#2274BA` for that reason.
- Loading, empty, search, filter, compose, archive and mark-unread states all work locally. Add your own persistence and authorization before production use.
- Bootstrap and Motion load from jsDelivr with Bootstrap pinned and integrity-checked.
