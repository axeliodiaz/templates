---
aside: false
title: Umail
---

# Umail

A standalone original template for a university messaging app. It uses the current Bootstrap (5.3.8) and keeps the original Umail colors: the blue `#0093D0` primary, the `#2274BA` link blue, the deep `#00517F`, and the near-black `#1B1B1B` navbar. Fictitious data; actions stay in the page and nothing is sent.

<iframe src="/umail-template/index.html" title="Umail template preview" loading="lazy" style="width:100%;height:760px;border:1px solid var(--vp-c-divider);border-radius:12px;background:#fff"></iframe>

[Open the template full screen](/umail-template/index.html)

## Palette

The colors come from the live Umail stylesheet and Bootstrap 2 build, mapped to Bootstrap 5.3 variables in one file: [`umail-theme.css`](/umail-template/umail-theme.css).

| Token | Value | Use |
| --- | --- | --- |
| `--bs-primary` | `#0093D0` | Primary buttons, active pills, badges |
| hover | `#04B5FF` | Primary button hover |
| active, deep | `#00517F` | Pressed state, link hover, emphasis text |
| `--bs-link-color` | `#2274BA` | Links and outline buttons |
| navbar | `#1B1B1B` | Top bar |
| `--bs-body-color` | `#333333` | Text |
| `--bs-secondary-color` | `#6D6D6D` | Muted text |
| `--bs-border-color` | `#E5E5E5` | Borders |
| `--bs-secondary-bg` | `#F9F9F9` | Card headers and strips |
| warning, danger, success, info | `#F89406`, `#BD362F`, `#51A351`, `#2F96B4` | Status colors |

## Use it

1. Load Bootstrap 5.3 first, then `umail-theme.css`.
2. Set `data-bs-theme="light"` or `"dark"` on `<html>`. The theme file defines both.
3. Use standard Bootstrap components. Only variables and a few component tokens are overridden, so upgrades stay simple.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="/umail-template/umail-theme.css">
```

## Notes

- Motion handles the list entrance, the detail panel, and badge pulses. It stops when `prefers-reduced-motion` is on.
- The primary blue `#0093D0` with white text is about 3.4:1, fine for large or bold button labels but under 4.5:1 for small text. Body links use `#2274BA` for that reason.
- Loading, empty, search, filter, compose, archive and mark-unread states all work locally. Add your own persistence and authorization before production use.
- Bootstrap and Motion load from jsDelivr with Bootstrap pinned and integrity-checked.
