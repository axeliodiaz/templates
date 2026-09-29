# Felix

Warm, electric, and radically transparent. A financial compañero for the Latino community in the United States — not a bank.

Linen canvas, slate ink, turquoise primary, lime accent. Plain for display, Saans for UI. This guide is the Markdown build reference for the live system.

## Foundations

- [Principles](/felix/principles)
- [Colors](/felix/colors)
- [Typography](/felix/typography)

## Build

- [Design tokens](/felix/tokens)
- [Motion](/felix/motion) — task cards moving between states
- [Components](/felix/components/) — atoms, molecules (toast, collapse, alert, tabs), organisms

## Rules of thumb

1. Linen canvas in light mode; slate canvas in dark. Turquoise stays the primary in both.
2. Text on turquoise and lime is slate `#082422`, never white.
3. One electric accent per view. If the primary button is turquoise, nearby emphasis is lime or flat slate, not a second glow.
4. Status stays semantic: success, warning, error, and info never borrow turquoise or lime.
5. Selection and focus use turquoise at low opacity (`#2bf2f14d` selection, 6px focus ring), not a border color change alone.
