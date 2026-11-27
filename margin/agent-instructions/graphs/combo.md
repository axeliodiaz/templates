# Combo / dual axis

Margin graphs · `combo` · component `combo`

## Preview

- Scoped `.mg-graph-lab` Felix JSON chart with **Replay**, **Shuffle data**, and data-state select.
- Dark preview toggle on the guide frame; motion waits until after hydration (`mg-guide-motion`).

## Spec

- Example key: `combo`
- Component id: `combo`
- Data is synthetic; wire your own API and validation in production.

## Motion

Charts reuse the Margin preview motion stack (`margin-motion.css`) together with Felix SVG enter/update hooks on `.fj-plot`.

| Token | Default | Used for |
| --- | --- | --- |
| `--mg-chart-enter-duration` | `0.45s` | Plot fade/slide on enter |
| `--mg-chart-line-duration` | `0.65s` | Line and path stroke draw-in |
| `--mg-chart-bar-duration` | `0.55s` | Bars and columns growing from baseline |
| `--mg-chart-arc-duration` | `0.7s` | Donut, gauge, and arc sweeps |
| `--mg-chart-value-duration` | `0.4s` | Label/value count-up opacity |
| `--mg-chart-morph-duration` | `0.5s` | Data update morph after **Shuffle data** |
| `--mg-chart-hover-duration` | `0.15s` | Mark hover and readout easing |

All durations use `ease-out` unless noted in `margin-graphs.css`. Set `--mg-chart-motion: none` on `.mg-graph-lab` to disable chart motion while keeping theme transitions.

### Enter

- **Replay** increments the chart revision so the SVG remounts: lines draw in, bars grow from the baseline, donut and gauge arcs sweep, and values ease in.
- Motion starts only after hydration: `.mg-guide-motion` is applied on the next `requestAnimationFrame` after mount (same pattern as component previews). No enter animation runs on the server HTML.

### Data updates

- **Shuffle data** perturbs numeric cells in the local source and bumps revision so marks morph smoothly (token `--mg-chart-morph-duration`).
- Loading and empty states skip motion; the readout uses `role="status"`.

### Hover and tooltips

- Focusable marks use `--mg-chart-hover-duration` for opacity and stroke emphasis; exact values stay in the status readout and Data view table.

### Reduced motion

When `prefers-reduced-motion: reduce` is set, chart CSS forces instant render (no stroke draw, grow, sweep, or count-up). **Replay** still remounts data for testing but without animated transitions.

### Disable locally

```css
.mg-graph-lab {
  --mg-chart-motion: none;
}
```

**This chart:** Marks use the shared enter duration on replay.

## Accessibility

- SVG `role="img"` with title; marks are keyboard-focusable with `role="button"`.
- Status readout uses `role="status"`.
- Honor `prefers-reduced-motion` (instant render).

## Checklist

- [ ] Replay enter motion without flashing before hydration
- [ ] Shuffle data morphs smoothly (or instant when reduced motion)
- [ ] Loading and empty states show status text
- [ ] Dark preview maintains readable grid and labels
