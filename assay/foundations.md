# Assay foundations

## Color and type

| Token | Value | Role |
| --- | --- | --- |
| `--as-bg` | `#FCF9F4` | Paper canvas |
| `--as-card` | `#FEFDF9` | Card surface |
| `--as-ink` | `#000000` | Body, labels and values |
| `--as-muted` | `#44403C` | Metadata and axes |
| `--as-accent` | `#FF5809` | Graphic signal only |
| `--as-accent-text` | `#C2410C` | Orange links and chips |
| `--as-good-text` | `#15803D` | Favorable deltas |
| `--as-bad-text` | `#B91C1C` | Regressions and FAIL |
| `--as-border` | `#E8E2DA` | Decorative hairlines |

The reference's bright orange text is darkened to `#C2410C`, its green deltas to `#15803D`, and its red failures to `#B91C1C` for AA. Bright `#FF5809` stays in graphics, not small text. Heatmap values are black over a peach-to-orange scale; black against the full orange is above 4.5:1, so no white labels are used. Each cell also names the tool, suite and percentage to assistive technology.

Inter handles UI and values. JetBrains Mono handles commits, cases, tools and timestamps. Labels never fall below 11px. KPI values are 36px desktop, 30px tablet and 28px mobile. Cards use 16px radii, a 1px border and only a 0 1px 2px shadow at 4% opacity.

## Layout

- Below 768px: one KPI column, chart, trace, heatmap and failing-case cards. Only the heatmap scrolls internally.
- 768–1199px: two KPI columns and stacked panels; navigation stays in a drawer.
- At 1200px: a 220px rail, four KPIs, chart beside trace and heatmap beside the failing table.

The product stays light even if the guide shell is dark. There is no product dark toggle. Bootstrap 6.0.0-alpha.1 is generated inside `@scope (.assay-bs6)`; custom selectors use `.assay.assay-bs6` and `--as-*` tokens.

## Motion and accessibility

Motion uses 400ms entries staggered by 60ms, 900ms line drawing, 200ms heatmap entries staggered by 20ms, and a 2000ms live-dot pulse. Reduced motion cancels these effects, including when the preference changes while the page is open. The sample is static: no timer changes progress or claims real activity.

Keyboard users can skip directly to the product main landmark, open and close the native navigation dialog, select any preview destination, compare, inspect commits and cases, and return with Escape. Native dialogs contain focus and restore it. Controls have at least 40px touch targets and 2px black focus outlines. Current navigation and trace steps carry `aria-current`; arrows and FAIL labels make color redundant.

The mobile chart puts current values in accessible text and commit dialogs. Labels are enlarged rather than shrunk to fit. No data is silently omitted from the typed run model.
