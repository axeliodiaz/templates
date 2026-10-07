---
aside: false
---
# Folio

Charcoal finance workspace with mint actions, calm balance typography and thin cash-flow lines. A reusable design system, separate from the dashboard example.

## Start here

- [Principles and tokens](/folio/foundations): palette, type, spacing, radius, semantics and CSS API.
- [Components](/folio/components): Live component patterns and states.
- [Charts](/folio/charts): line, area, bar, stack, donut and cash-flow comparison.
- [Motion](/folio/motion): timing, state feedback and reduced motion.
- [Layouts](/folio/layouts): app shell, navigation and form composition.
- [Dashboard](/folio/overview): the source-inspired interactive overview.

## Principles

1. One brand accent per surface. Brand color is an action, not a synonym for success or failure.
2. Numbers use tabular digits, currency labels and explicit periods. Never hide units in a tooltip.
3. Every control has focus, disabled, loading or feedback states where applicable.
4. Dense reports keep horizontal table scrolling on small screens. Core forms and cards stack.
5. All live previews are local. No payment, message or account connection occurs.

## Using the system

Load `studio-systems.css`, wrap content in `studio-kit studio-folio` and use the `sk-*` component classes. `StudioCatalog.vue` renders the live component examples with `theme="folio"`. The dashboard has its own domain layout and is available at /folio/overview.

[Implementation tokens](/folio/tokens) · [Full live catalog](/folio/components)
