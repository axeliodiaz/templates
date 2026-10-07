# Spark foundations

## Palette

| Token | Value | Role |
| --- | --- | --- |
| `--sk-bg` | `#252525` | App canvas |
| `--sk-surface` | `#2c2c2c` | Elevated panels |
| `--sk-ink` | `#f0efeb` | Primary text |
| `--sk-muted` | `#b8b9b4` | Secondary text |
| `--sk-border` | `#444444` | Dividers and input boundaries |
| `--sk-accent` | `#ff953f` | Primary action and series |
| `--sk-on` | `#2b1506` | Text on primary action |

Success is mint/green, warning amber, danger rose and information blue. Spark's orange is not an error; Folio's mint action is not an approval. Use a label and icon with status colors.

## Typography

DM Sans for text and headings, system monospace for technical identifiers. Titles 24–30px, card titles 15px, body 13px, metadata 11px. Amounts 30px with `font-variant-numeric: tabular-nums`. Keep currency and decimal precision explicit.

## Spacing and shape

4px base grid. Gaps 8/12/16/24px; card padding 18–24px. 8px default card radius, 6px controls, 999px avatar and switches. Borders are 1px; shadows are reserved for overlays. Avoid glow and decorative gradients.

## Accessibility

Primary button text uses dark ink on the light brand accent. Keyboard focus has a 2px accent outline plus 3px offset. Inputs have associated labels; errors have visible text. Charts have readable captions and SVG labels. Disabled controls do not become invisible. All movement stops with `prefers-reduced-motion`.

## Responsive layout

Desktop uses two-column component grids; below 700px it stacks into one column. Tables scroll inside their wrapper rather than overflowing the page. Keep real action targets at least 40px in production compositions; the compact dashboard is a reference layout.

[Live examples](/spark/components)
