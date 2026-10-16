---
aside: false
pageClass: lmn-page
title: Lumen on Bootstrap 6
---

# Lumen on Bootstrap 6

Standalone observability dashboard template on **Bootstrap 6.0.0-alpha.1** (pinned with integrity hashes), using the Lumen palette: ink `#17171a` primary actions, purple `#7c6cf0`, model colors (yellow, cyan), amber for increases and green for decreases. Fictitious data; interactions stay in the page.

<iframe src="/lumen-template/index.html" title="Lumen Bootstrap 6 template preview" loading="lazy" style="width:100%;height:820px;border:1px solid var(--vp-c-divider);border-radius:12px;background:#eceef1"></iframe>

[Open the template full screen](/lumen-template/index.html)

## Theme file

Colors and Bootstrap 6 tokens are mapped in one scoped file: [`lumen-theme.css`](/lumen-template/lumen-theme.css). App layout and chart chrome use [`lumen-app.css`](/lumen-template/lumen-app.css) under `.lmn-bs6` so nothing bleeds into the VitePress shell or other templates.

## Usage

1. Load Bootstrap 6 first, then `lumen-theme.css` and `lumen-app.css`. JavaScript is ESM only.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="/lumen-template/lumen-theme.css">
<link rel="stylesheet" href="/lumen-template/lumen-app.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js"></script>
```

2. Wrap the app in `class="lmn-bs6"` on `<body>` (or a root element). Toggle light/dark with `data-bs-theme` on `<html>`.

3. Motion uses [Motion](https://motion.dev/) for entry fades and KPI feedback; chart crosshair, histogram bars, and progress fills respect `prefers-reduced-motion`.

## Notes

- Reference implementation for the batch-1 BS6 migration; the in-guide `.lmn` examples remain custom CSS inside VitePress.
- Bootstrap 6 is an alpha; browser floor matches the [Umail template](/umail) notes (Chrome/Edge 130+, Firefox 132+, Safari 18+).
