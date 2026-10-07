---
aside: false
---
# Spark

Dark analytics workspace with orange actions, pixel histograms and compact tabular reporting. A reusable design system, separate from the dashboard example.

## Start here

- [Principles and tokens](/spark/foundations): palette, type, spacing, radius, semantics and CSS API.
- [Components](/spark/components): Live component patterns and states.
- [Charts](/spark/charts): line, area, bar, stack, donut and pixel-grid histogram.
- [Motion](/spark/motion): timing, state feedback and reduced motion.
- [Layouts](/spark/layouts): app shell, navigation and form composition.
- [Dashboard](/spark/overview): the source-inspired interactive overview.

## Principles

1. One brand accent per surface. Brand color is an action, not a synonym for success or failure.
2. Numbers use tabular digits, currency labels and explicit periods. Never hide units in a tooltip.
3. Every control has focus, disabled, loading or feedback states where applicable.
4. Dense reports keep horizontal table scrolling on small screens. Core forms and cards stack.
5. All live previews are local. No payment, message or account connection occurs.

## Using the system

Load `studio-systems.css`, wrap content in `studio-kit studio-spark` and use the `sk-*` component classes. `StudioCatalog.vue` renders the live component examples with `theme="spark"`. The dashboard has its own domain layout and keeps its existing URL.

[Implementation tokens](/spark/tokens) · [Full live catalog](/spark/components)
