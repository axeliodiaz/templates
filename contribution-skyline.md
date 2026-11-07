---
pageClass: contribution-skyline-guide
---
<script setup>
import ContributionSkylineDemo from './.vitepress/theme/ContributionSkylineDemo.vue'
</script>

# Contribution skyline

## What a skyline adds and what it must not change

A skyline adds height to a calendar contribution grid. It must preserve the exact count, date, period, filters, timezone, color level and day text already used by the grid. It is a second projection, not a new metric or data source. Keep Grid as the default and let people switch without fetching or rebuilding their data. A [bar chart](/bar-chart) is better for precise comparisons; a [heatmap](/heatmap) is better for day/hour matrices.

<ContributionSkylineDemo />

The five datasets are synthetic, starting Sunday, November 2, 2025. Synthetic year, Outlier, All zero and With unknown days contain 365 real consecutive dates; Partial range contains 91. The final week is padded without inventing dates. There are no props, emits, network calls or saved preferences. Loading, Empty and Error withhold the chart and table. Reset restores Synthetic year, Ready, Grid and no active day.

## Data contract

```ts
interface SkylineCellInput {
  col: number // week index, 0..W-1
  row: number // day index, 0..6, Sunday first in this demo
  date: string | null // YYYY-MM-DD; null is padding outside the period
  count: number | null // nonnegative integer; null is unknown, not zero
  level: number | null // host color level 0..4; null for unknown
}
interface SkylineOptions {
  gap?: number; hMaxFactor?: number; hMinFactor?: number; hMinPx?: number;
  padFactor?: number; labelLeftFactor?: number; labelBottomFactor?: number;
}
```

Build cells from the same weeks and day order the existing grid uses. Do not read source labels to reinterpret counts. Padding is not drawn. Known zero stays zero; unknown stays null and is excluded from the maximum. An absent day follows the host's existing missing-day policy, not a new Skyline policy. Dates remain calendar strings: never use `new Date('YYYY-MM-DD')` to display a local calendar date. The sample generator uses explicit UTC calendar arithmetic only to create its fictional fixtures.

`validateCells(cells, W)` rejects invalid columns/rows, duplicate coordinates, malformed date strings, negative/non-integer/nonfinite counts and invalid week counts with `SkylineInputError`. It validates date shape, not a full calendar parser. Host adapters must validate real date ranges, unique dates, color levels and period limits before drawing. A host catching a geometry error returns to its existing grid with a visible warning, rather than changing counts or silently dropping cells.

| API | Actual result |
|---|---|
| `kindOf`, `domainMax`, `heightFor` | pad/unknown/zero/positive, visible maximum, exact height |
| `frame`, `project`, `unproject`, `pickPitch` | frame, oblique coordinates, base-plane cell, responsive pitch |
| `paintKey`, `layoutSkyline` | deterministic paint order and final prism faces |
| `prismAt(p,t,pitch,frame,opts?)` | top/left/front at clamped animation fraction |
| `silhouette(p,t,pitch,frame,opts?)` | outer polygon for the final overlay; these arguments are required by the executable module |
| `pointsAttr` | rounded SVG point string |

## Geometry

### Base and projection

A footprint has inset `gap = 0.16`: `c0=c+0.08, c1=c+0.92, r0=r+0.08, r1=r+0.92`.

```text
W = visible weeks; S = pitch in pixels
Weeks = (WX,WY) = (0.94,-0.34); Days = (DX,DY) = (0.50,0.72)
hMax = 5*S; pad = 1*S; labelLeft = 2.2*S; labelBottom = 1.6*S
ox = pad + labelLeft
oy = pad + hMax + 0.34*W*S
width = ox + (0.94*W + 0.50*7)*S + pad = (0.94*W + 7.7)*S
height = oy + 0.72*7*S + labelBottom + pad = (0.34*W + 13.64)*S
P(c,r,z) = (ox + (0.94*c + 0.50*r)*S, oy + (-0.34*c + 0.72*r)*S - z)
```

Coordinates round to 0.01 px with `Math.round(v*100)/100`. The frame always reserves hMax so changing the maximum does not change its bounds.

| W=53 | Width | Height |
|---|---:|---:|
| S=8 | 460.16 | 253.28 |
| S=12 | 690.24 | 379.92 |
| S=14 | 805.28 | 443.24 |

### Heights and faces

```text
M = max count among dated, known cells in the visible period
h(null) = null
h(0) = 0; if M=0 every known cell is flat
h(count>0) = max(hMin, hMax*count/M)
hMax = 5*S; hMin = max(2px, 0.18*S)
top = [P(c0,r0,h),P(c1,r0,h),P(c1,r1,h),P(c0,r1,h)]
left = [P(c0,r0,0),P(c0,r1,0),P(c0,r1,h),P(c0,r0,h)]
front = [P(c0,r1,0),P(c1,r1,0),P(c1,r1,h),P(c0,r1,h)]
```

Left/front exist only above zero. Height is linear above the disclosed minimum, with no square root, logarithm, outlier cap or compression. Small positive values may share the minimum height; exact values remain available. All zero is not Empty. Unknown uses a hatch and dashed border, never the zero color.

Paint ascending `k = row + (W-1-col)`, then row, then column. Within each prism paint left, front, top. SVG hit testing therefore selects the visible prism. The silhouette is `[P(c0,r0,h),P(c1,r0,h),P(c1,r1,h),P(c1,r1,0),P(c0,r1,0),P(c0,r0,0)]`, or the top at zero. Hover/focus overlays are painted last, above every prism.

The base-plane inverse has determinant `0.94*0.72 + 0.50*0.34 = 0.8468` and chooses a dated cell for taps between faces. Month labels use the grid's month/week markers at `P(col+0.5,7,0)+(0,0.9*S)`; weekday labels use `P(0,row+0.5,0)-(0.4*S,0)`.

```text
pickPitch(availableWidth,W) = clamp(8, floor(availableWidth/(0.94*W+7.7)), 14)
```

A ResizeObserver measures the board. Below pitch 8 the board scrolls horizontally instead of shrinking the values into illegibility.

## Token contract

All `--sky-*` tokens are local to this demo. Top colors are opaque; translucent faces would reveal hidden buildings. Front uses 80% top + black; left uses 64%. Each rule declares an opaque top fallback before `color-mix`.

| Role | Light | Dark |
|---|---|---|
| `--sky-top-0..4` | #E5E7EB #BFDBFE #60A5FA #2563EB #1E3A8A | #2A303C #1E3A5F #1D4ED8 #3B82F6 #93C5FD |
| `--sky-edge`, `--sky-focus`, `--sky-hover` | #111827 | #E5E7EB |
| `--sky-halo` | #FFFFFF | #161618 |
| `--sky-unknown` | #6B7280 | #9CA3AF |
| `--sky-board`, `--sky-label` | `--vp-c-bg-soft`, `--vp-c-text-2` | same roles |

Measured VitePress board colors are #f6f6f7 in light and #202127 in dark. The theme sets `.dark` on the root; its catalogue shell remains dark even without that class, so this specimen declares its own local light surface and readable control/text roles.

C1 is mandatory: an opaque 1 px edge must reach 3:1 against the board and every face that does not itself reach 3:1 against the board. C2 is mandatory: inner focus ink 2 px plus an outer 2 px halo must have ink/halo contrast at least 3:1, and `max(contrast(ink,X),contrast(halo,X)) >= 3` for every board, edge, top, front and left color. Recheck both whenever host tokens change. The final overlay uses an outer 6 px stroke then inner 2 px stroke, leaving a 2 px halo on each side. Forced colors uses Canvas faces, CanvasText edges and Highlight 3 px active strokes without a halo.

## Interaction, keyboard and touch

| State | Meaning |
|---|---|
| selectedDate | Keyboard cursor, separate from tooltip visibility; preserved while the date exists |
| hoverDate | Fine-pointer prism, never a synthetic touch hover |
| tip | One date with origin hover, focus or pinned |
| pinnedBy | Pointer or keyboard, with different blur behavior |
| suppressed | Escape dismissal until an intentional new input |
| graceTimer | 120 ms bridge from prism to hoverable tooltip |

Priority is pinned, then focus, then hover. The SVG is hidden from assistive technology inside one named wrapper tabstop. Focus starts at the last dated day. Left/Right move 7 days, Up/Down 1, Page Up/Down 28, Home/End first/last. A navigation step that would cross a boundary does not move. Enter/Space pins or returns to a visible focus tooltip; Escape dismisses without moving focus or selectedDate. Blur closes focus and keyboard pins but leaves pointer pins. The Grid uses one roving native-button tabstop and the same day text.

A fine-pointer entry cancels the grace timer. Leaving starts 120 ms only for hover. Entering the tooltip cancels it; its text is selectable and has no links or buttons. Focus tooltips survive pointer exit. Escape suppresses reopening from movement inside the same prism; entering a different prism or using navigation/click explicitly clears suppression. Tap/click pins; same prism, outside pointerdown or Escape closes. Base-plane taps use `unproject`. The mode radiogroup uses roving Left/Right keys and has 44 px touch targets.

Tooltip text is `{date}: {count} contributions (synthetic)`, or `{date}: no data (synthetic)`. It sits 8 px above the top-face bounds, below if needed, and clamps 8 px inside the viewport. Scroll/resize closes hover and repositions focus/pins. A separate polite region announces keyboard movements and pins only, never ordinary hover. Dataset/state/mode changes close the tooltip without changing source data.

## States

| State | Output |
|---|---|
| Ready | Same dates/counts in Grid, Skyline and exact table |
| Loading | Manual demonstration, data withheld, no mode selector/table |
| Empty | No days in this period, not a zero-filled dataset |
| Error | Visible failure and Reset example; no chart/table |
| All zero | Flat known tops, max 0 and "0 in the whole period" |
| Unknown | Hatched flat top, no data text, excluded from M |
| Partial range | 91 dated days, pads excluded, not an error |

Real hosts keep their own refresh/error/partial semantics. A partial source needs a visible note that heights may be below the real total; refreshing with existing data retains it and interpolates new heights over 240 ms without replay. The synthetic dataset selector also interpolates dated heights over 240 ms; this local controller has no request/refresh adapter.

## Motion

Grid fades out over 120 ms; Skyline extrudes over 480 ms per prism with `cubic-bezier(.2,.7,.2,1)` and delay `min(col*6,240)` ms, total at most 720 ms. Reverse collapses in 200 ms ease-in then fades Grid in for 120 ms. The fixed plane never tilts and the camera never moves. One requestAnimationFrame loop updates geometry via `prismAt`, then stops. Mode changes cancel earlier work. Reduced motion is instant, including a live preference change. Timers, animation frames, ResizeObserver, document and matchMedia listeners are cleaned up on unmount.

## Accessibility

Grid is always the initial reading mode. Color is supplemented by height, exact text, outline and a lazy table containing every dated cell in ascending order, including all zero and no-data rows, with at most 366 rows. Closed details has no body rows. The table has a caption, column headers and date row headers. Only its scroll container becomes focusable when it overflows; the table is outside all live regions. The board scrolls horizontally at narrow widths and 200% zoom. Test keyboard, hover grace, touch, forced colors and both themes; contrast checks are not screen-reader certification.

## Reuse guide

Vendor the pure geometry/types with a header naming the actual reviewed Templates merge SHA; copy the canonical fixtures byte-for-byte and rerun parity tests. Do not publish a package or fetch a mutable branch at runtime. Geometry and token role names are shared; app data, adapters, copy, tokens and UI are not.

| Known adopters | Boundary |
|---|---|
| agents-ai | Adapter starts from the host's existing week cells |
| axeldiaz-web | Adapter starts from the host's existing week columns |

No private endpoints, routes, credentials or source data belong in this guide. Hosts keep their current missing-day policy, date/count wording and filters.

## Anatomy and actual API

`ContributionSkylineDemo.vue` has no props or emits. Its controls are local refs for dataset, state and view. `skyline.sample.ts` supplies fictional calendar cells; `skyline.geometry.ts` is the pure canonical model with its own fixture tests. `skyline.css` owns only local demo tokens. The controller owns selectedDate, hoverDate, tooltip origin, pointer/keyboard pin, suppression, lazy table, resize and motion lifecycle.

Possible host input, not implemented props:

```ts
type HostSkylineInput = { weeks: SkylineCellInput[][]; periodLabel: string; dayText: (date:string,count:number|null)=>string }
```

A host adapter must enforce its own source contract, preserve original data semantics, catch validation errors and expose existing Grid as the fallback. This demo does not implement persistence, network fetching, aggregation, export, free camera, orbit, zoom controls, KPIs, drawer or project breakdown.
