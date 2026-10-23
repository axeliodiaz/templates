---
aside: false
---
# Batch 2: Bootstrap 6

Folio, Spark, Fixtrack, Crestway, Margin, Sentinel, Brief, Pace and Cargo now render their controls with pinned Bootstrap 6.0.0-alpha.1. This is an alpha API. All figures are fictitious and all actions stay local.

## Integration

- `scripts/build-batch2-bs6.mjs` reads the installed MIT Bootstrap package and generates a stylesheet inside native `@scope (.b2-bs6)`. Reboot, root tokens and component selectors cannot style the documentation shell or another template.
- Each template root opts in with `b2-bs6` and a brand class. `batch2-bs6.css` maps existing palette tokens into Bootstrap background, text, border, primary, control and focus tokens.
- Authored `btn-outline`, `btn-solid theme-primary`, `form-control` and `table` classes preserve Vue state, native validation and keyboard behavior. Existing chart layouts and Motion remain independent.
- Existing native dialogs retain Escape and focus containment. Reduced-motion stops transitions and chart animation. No Bootstrap JavaScript is needed for the current Vue-controlled interactions.
- Build with `npm ci && npm run build`. Against a running local site, run `node tests/batch2-bs6.cjs`. Set `BASE_URL` for a different preview origin.

## Browser requirement

Native CSS scope is required for this integration. Check your target browser's support before adopting the alpha. Bootstrap is bundled locally, so runtime previews do not depend on a CDN. Bootstrap's MIT license remains in the generated file and package.

## Bastion

Bastion does not use `.b2-bs6`. It generates a separate `@scope (.bst-root)` from the same pinned `bootstrap@6.0.0-alpha.1`, so the terminal skin cannot restyle this batch or the VitePress shell. See [Bastion usage](/bastion/usage).
