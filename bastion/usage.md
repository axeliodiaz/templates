---
aside: false
title: Bastion usage
---

# Usage

Bastion is a product skin on **Bootstrap 6.0.0-alpha.1**, pinned exactly. The stable line remains 5.3.8. Scopecraft, the VitePress shell, and the other languages do not load this copy.

## Load order

1. Generate the scoped stylesheet with `node scripts/build-bastion-bs6.mjs`. The site build does this. Output is `.vitepress/theme/bastion-bs6.bootstrap.css` and it is gitignored.
2. The generator wraps the whole Bootstrap file in `@scope (.bst-root)` and rewrites `:root`, `html`, and `body` to `:scope`.
3. Import that file, then `bastion.css`. The theme file overrides semantic tokens on `.bst-root`.
4. Mark the wrapper `data-bs-theme="dark"`. Bootstrap’s `light-dark()` follows `color-scheme`, which that attribute sets to `dark`.

```html
<div class="bst-root" data-bs-theme="dark">
  <div class="bst">
    <button type="button" class="btn-solid theme-success">Primary</button>
    <button type="button" class="btn-outline theme-warning">Dismiss</button>
  </div>
</div>
```

This guide does not inject Bootstrap’s JavaScript into the VitePress page. Dialogs are native `<dialog class="dialog">` elements styled by the scoped CSS. If a standalone app needs Bootstrap behavior (toasts, drawers), load the ESM bundle:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js"></script>
```

Do not load it as a classic script. The alpha build is ESM only.

## Alpha quirks

These showed up while pinning 6.0.0-alpha.1 (released 2026-10-08). The API can still change, which is why the version is exact and not `bootstrap@next` or a caret range.

- Column and variant utilities flipped their prefix: `lg:col-7`, `md:col-6`, not `col-lg-7`. Breakpoints in this alpha are sm 576, md 768, lg 1024, xl 1280, 2xl 1536.
- Buttons are `btn-solid`, `btn-outline`, `btn-subtle`, or `btn-text`, plus a `theme-*` class (`theme-success`, `theme-warning`, `theme-danger`). `btn-primary` is not the color hook. `btn-sm` only overrides size variables; it still needs a button class.
- Color is `oklch` scales (`--bs-blue-500` and friends) plus `light-dark()`. `data-bs-theme` works because it sets `color-scheme`, not because `light-dark()` reads the attribute itself.
- Modal and offcanvas markup gave way to native `dialog` and `drawer`. Accordion items are `details.accordion-item` with `summary.accordion-header`, and the panel height uses `::details-content`.
- Reboot still targets `html` and `body`. Unscoped, it restyles the docs shell. Bastion rewrites those selectors to `:scope` and keeps the file inside `@scope (.bst-root)`.
- `@layer` stays inside that `@scope`. A second copy for another template must use its own scope root. Do not drop this file onto `:root`.
- Default control min-heights are tall for a terminal row. Bastion sets `--bs-btn-input-min-height: 0` and square radii.
- Browser floor is higher than Bootstrap 5 because of `@scope`, `light-dark()`, and relative color syntax: Chrome and Edge 130, Firefox 132, Safari 18.
- The package in this repo is the npm pin `bootstrap@6.0.0-alpha.1`. Bastion must not float it.

## Responsive layout

The dashboard uses Bootstrap’s grid (`col-12 lg:col-7` / `lg:col-5`). Below the lg breakpoint (1024px viewport) the panels stack. A container query also stacks them when the Bastion frame itself is under 860px, so a wide viewport with a docs sidebar does not crush the table. Tables scroll inside `.table-responsive`. The page itself should not scroll sideways. Check 390, 820, and 1440.

## Motion

Prefer CSS animation so the final state exists without JavaScript. Do not set `opacity: 0` as the resting style. Reduced motion clears animation and transition on `.bst-root` and leaves the numbers in place. See [Motion](/bastion/motion).

## Accessibility

- Name every input. The region control’s label is “REGION”.
- Meters expose `aria-valuenow` and a text percent.
- The map has a text description of each city and latency.
- Log lines are a list. New lines are not announced on a timer; the operator can pause the tail.
- Focus is the amber outline. Escape closes native dialogs.
- The ops-agent recommendation is `lang="es"`.

## Do not

- Do not import this Bootstrap build from a Scopecraft page or from the shell layout.
- Do not reuse Folio, Spark, or Pace palettes inside `.bst`.
- Do not ship Approve as a real scale action. The button in the sample only updates the page.
