---
aside: false
---
# Relay

Dark graphite control room for AI agents and MCP servers. The interface is a place to watch agents, servers, tool calls, and approvals. Violet marks the human-and-agent path. Teal marks the server path. Everything on these pages is sample data.

## Start here

- [Color, type, and tokens](/relay/foundations): palette, type, spacing, and accessibility.
- [CSS implementation](/relay/tokens): Bootstrap 6 scope, classes, and alpha notes.
- [Motion](/relay/motion): entrances, graph edges, sparklines, feed, and reduced motion.
- [Components](/relay/components): live catalog, extended variants, and the 43 core families.
- [Charts](/relay/charts): trend, bar, and sparkline patterns.
- [Layouts](/relay/layouts): shell, drawer, and stacked regions.
- [Control room](/relay/overview): the interactive dashboard.

## Principles

1. One violet action color. Success, warning, and danger stay green, amber, and rose, and they always have a word.
2. The graph is a picture of sample links. When the curves do not fit, the same links stay in text.
3. Approvals are explicit. Approve and Deny change only this page.
4. The sidebar is an offcanvas drawer below the Bootstrap `lg` breakpoint (1024px) and a column from there up.
5. Motion explains arrivals and live state. `prefers-reduced-motion: reduce` leaves the final numbers and layout in place.

## Using the system

Guide pages load the shared studio catalog with `theme="relay"` inside `b2-bs6`, the Bootstrap 6 scope shared with Folio, Spark, and Pace. The control room uses a separate `@scope (.relay-bs6)` so its glassy layout does not restyle those catalogs or the VitePress shell. Bootstrap is pinned to `6.0.0-alpha.1`.

[Implementation tokens](/relay/tokens) · [Full live catalog](/relay/components) · [Control room](/relay/overview)
