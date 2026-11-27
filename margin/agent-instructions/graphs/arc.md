# Arc meter

Margin graphs · `arc` · component `felix-arc`

## Preview

- Variant select: **Single**, **Multiple (2–4 rings)**, **With unavailable**, **Compact size**.
- Toolbar buttons match **Dark preview** (`btn-outline-secondary btn-sm`): **Replay**, **Shuffle data**.
- Concentric arcs with endpoint value labels and legend rows (dot, name, value, note).

## Data contract

Use `options.series[]` **or** source rows with columns mapped via `options.fields`:

| Field | Required | Notes |
| --- | --- | --- |
| `label` | yes | Series name (`encoding.category`) |
| `value` | yes | Number or `null` when unavailable |
| `max` | no | Default `options.maximum` (100) |
| `color` | no | Stroke color |
| `note` | no | Secondary legend (e.g. “Resets in 5h”) |
| `status` | no | `ready` or `unavailable` |

Single row → one ring (backwards compatible). `status: unavailable` → muted track, `--` endpoint label, `Unavailable` in legend.

## Motion

- Rings sweep on enter with stagger (`--mg-arc-stagger` × 0.12s per index).
- **Shuffle data** morphs numeric values; **Replay** remounts enter.
- `prefers-reduced-motion`: instant arcs.

See shared motion tokens in other graph agent stubs (`margin-motion.css`, `--mg-chart-arc-duration`).

## Checklist

- [ ] Single-row spec still renders one arc
- [ ] Legend matches MultiGauge semantics (value + note per row)
- [ ] Unavailable series muted, not empty layout
- [ ] Dark preview + 390px: labels readable, no overflow